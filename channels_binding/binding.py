import glob
import traceback
import os
import importlib.util
from django.core.paginator import Paginator, Page
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings

__all__ = ['AsyncBinding', 'registered_binding_classes', 'register_bindings', 'bind']

registered_binding_classes = set()
registered_binding_events = dict()


def register_bindings():
    for base_start, pattern, base_stop in [
        ['app.bindings', os.path.join(os.path.dirname(__file__), '../bindings/*.py'), ''],
        ['apps', os.path.join(os.path.dirname(__file__), '../apps/*/bindings.py'), 'bindings']
    ]:
        # Dynamicaly loads of all consumer bindings
        for file in glob.glob(pattern):
            file = os.path.abspath(file)
            spec = importlib.util.spec_from_file_location('.'.join([o for o in [base_start, os.path.basename(file), base_stop] if o]), file)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)


def bind(name=None, **kwargs):
    """
    Used to mark a method on a ResourceBinding that should be routed for detail actions.
    """
    def decorator(func):
        func.name = name
        func.is_bind = True
        func.kwargs = kwargs
        return func
    return decorator


class RegisteredBinding(type):
    def __new__(cls, clsname, superclasses, attributedict):
        binding_class = type.__new__(cls, clsname, superclasses, attributedict)
        if superclasses:
            stream = None
            if binding_class.stream:
                stream = binding_class.stream
            elif binding_class.model:
                stream = f'{binding_class.model._meta.app_label}.{binding_class.model._meta.object_name}'
            binding_class.stream = stream
            binding_class._registred_actions = {}

            for method_name in dir(binding_class):
                method = getattr(binding_class, method_name)
                is_bind = getattr(method, 'is_bind', False)
                if is_bind:
                    kwargs = getattr(method, 'kwargs', {})
                    name = kwargs.get('name', method_name) or method_name
                    event = f'{stream}.{name}'
                    events = registered_binding_events.setdefault(event, [])
                    events.append([binding_class, method_name])

            if stream:
                registered_binding_classes.add(binding_class)
        return binding_class


class AsyncBinding(metaclass=RegisteredBinding):

    stream = None
    fields = []  # hack to pass cls.register() without ValueError
    queryset = None
    # mark as abstract
    model = None
    serializer_class = None
    lookup_field = 'pk'
    permission_classes = ()
    page_size = 25

    def __init__(self, consumer):
        self.consumer = consumer
        self.user = consumer.user

    async def send(self, event, data, stream=None):
        await self.consumer.send(f'{stream or self.stream}.attributes', data)

    def get_queryset(self, data):
        if not self.queryset:
            if self.model:
                return self.model.objects.all()
        else:
            return self.queryset.all()

    def filter_queryset(self, queryset, data):
        return queryset

    def paginate(self, queryset, data, limit=None):
        limit = limit or self.page_size or 25
        try:
            page = int(data['page'])
        except (KeyError, ValueError, TypeError) as e:
            page = 1
        paginator = Paginator(queryset, max(20, min(100, int(limit or 50))))
        return paginator.get_page(page)

    def serialize(self, instance, data, *args, **kwargs):
        # kwargs['context'] = self.get_serializer_context()
        if not self.serializer_class:
            if hasattr(instance, '__json__'):
                return getattr(instance, '__json__')(**kwargs)
            elif hasattr(instance, 'to_json'):
                return getattr(instance, 'to_json')(**kwargs)
            elif hasattr(instance, 'json'):
                return getattr(instance, 'json')
            else:
                return {}
        else:
            return self.serializer_class(instance, *args, **kwargs).data

    def serialize_results(self, queryset, data, *args, **kwargs):
        if not self.serializer_class:
            rows = [self.serialize(inst, data, *args, **kwargs) for inst in queryset]
            return dict(page=queryset.number, limit=queryset.paginator.per_page, count=queryset.paginator.count, rows=rows)
        else:
            return self.serializer_class(queryset, *args, **kwargs).data

    @bind()
    async def search(self, data):
        queryset = await database_sync_to_async(self.get_queryset)(data)
        queryset = await database_sync_to_async(self.filter_queryset)(queryset, data)
        queryset = await database_sync_to_async(self.paginate)(queryset, data)
        data = await database_sync_to_async(self.serialize_results)(queryset, data)
        await self.send(f'{self.stream}.search', data)

    @bind()
    async def retrieve(self, data):
        instance = await database_sync_to_async(self.get_object)(data)
        data = await database_sync_to_async(self.serialize)(instance, data)
        await self.send(f'{self.stream}.retrieve', data)

    def get_object(self, data):
        try:
            return self.model.objects.get(pk=data.get('id', None))
        except self.model.DoesNotExist:
            raise Exception(f'{self.stream} Does Not Exist')


AsyncBinding.bind = bind
