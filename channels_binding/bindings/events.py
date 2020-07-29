from channels.db import database_sync_to_async
from django.forms import modelform_factory
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from ..utils import (
    bind, db_sync, sync, send, send_sync
)

from . import settings as self_settings

__all__ = [
    'AsyncSearchModelBinding',
    'AsyncRetrieveModelBinding',
    'AsyncSaveModelBinding',
    'AsyncDeleteModelBinding'
]


class AsyncSearchModelBinding(object):

    @database_sync_to_async
    def get_search_data(self, data):
        queryset = self.get_queryset(data)
        queryset = self.filter_queryset(queryset, data)
        queryset = self.paginate(queryset, data)
        search_data = self.serialize_queryset(queryset, data)
        if hasattr(self, 'get_search_extra_data'):
            search_data.update(self.get_search_extra_data(queryset, data))
        return search_data

    @bind('search')
    async def search(self, data, *args, **kwargs):
        await self.reflect(f'search', await self.get_search_data(data), *args, **kwargs)


class AsyncRetrieveModelBinding(object):

    @database_sync_to_async
    def get_retrieve_data(self, data, instance=None):
        instance = instance or self.get_object(data)
        retrieve_data = self.serialize(instance, data)
        retrieve_data.update(id=instance.pk)
        if hasattr(self, 'get_retrieve_extra_data'):
            retrieve_data.update(self.get_retrieve_extra_data(instance, data))
        return retrieve_data

    @bind('retrieve')
    async def retrieve(self, data, *args, **kwargs):
        await self.reflect('retrieve', await self.get_retrieve_data(data), *args, **kwargs)


class AsyncSaveModelBinding(object):

    post_save_connect = True

    @classmethod
    def post_save(cls, sender, instance, created, *args, **kwargs):
        print('----=> _post_save_retrieve', cls, sender, instance)
        cls.user = None
        retrieve_data = cls.serialize(cls, instance, {})
        retrieve_data.update(id=instance.pk)
        if hasattr(cls, 'get_retrieve_extra_data'):
            retrieve_data.update(cls.get_retrieve_extra_data(instance, {}))
        send_sync('retrieve', retrieve_data, stream=cls.stream, group=cls.stream)

    @database_sync_to_async
    def get_save_data(self, data):
        if self.form_is_valid(self.form, data):
            self.save_form(self.form, data)
        save_data = self.serialize_form(self.form, data)
        save_data.update(id=self.form.instance.pk)
        return save_data

    def form_is_valid(self, form, data):
        return form.is_valid()

    def get_form_fields(self, data):
        return self.fields

    def save_form(self, form, data):
        return form.save()

    @database_sync_to_async
    def get_form(self, data, **kwargs):
        instance = self.get_object(data, create=kwargs.get('create', True))
        fields = self.get_form_fields(data)
        for name in fields:
            if name not in data:
                data[name] = getattr(instance, name, None)
        if self.model and not self.model_form:
            form = modelform_factory(self.model, fields=fields)(data, instance=instance)
        else:
            form = model_form(data, instance=instance)
        return form

    @bind('save')
    async def save(self, data, *args, **kwargs):
        self.form = await self.get_form(data, create=kwargs.get('create', True))
        save_data = await self.get_save_data(data)
        await self.reflect('save', save_data, *args, **kwargs)
        if not self.form.errors and not self.post_save_connect:
            await self.dispatch('retrieve', await self.get_retrieve_data(data, instance=self.form.instance), *args, **kwargs)

    @bind('create')
    async def create(self, data, *args, **kwargs):
        await self.save(data, create=True)

    @bind('update')
    async def update(self, data, *args, **kwargs):
        await self.save(data, create=False)


class AsyncDeleteModelBinding(object):

    post_delete_connect = True

    @classmethod
    def post_delete(cls, sender, instance, *args, **kwargs):
        print('----=> _post_delete_retrieve', cls, sender, instance)
        cls.user = None
        delete_data = {'success': True, 'id': instance.pk}
        send_sync('delete', delete_data, stream=cls.stream, group=cls.stream)

    @database_sync_to_async
    def get_delete_data(self, data):
        instance = self.get_object(data)
        pk = instance.pk
        instance.delete()
        return {'success': True, 'id': pk}

    @bind('delete')
    async def delete(self, data, *args, **kwargs):
        delete_data = await self.get_delete_data(data)
        if not self.post_delete_connect:
            await self.reflect('delete', delete_data, *args, **kwargs)
        # if not self.form.errors:
        #     await self.dispatch('retrieve', await self.get_retrieve_data(data, instance=self.form), *args, **kwargs)
