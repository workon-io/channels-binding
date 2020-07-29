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

    post_save_retrieve = True

    @classmethod
    def _post_save_retrieve(cls, sender, instance, created, *args, **kwargs):
        print('----=> _post_save_retrieve', cls, sender, instance)
        retrieve_data = cls.serialize(cls, instance, {})
        send_sync('retrieve', retrieve_data, stream=cls.stream, group=cls.stream)

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

    @database_sync_to_async
    def get_save_data(self, data):
        if self.form_is_valid(self.form, data):
            self.save_form(self.form, data)
        save_data = self.serialize_form(self.form, data)
        return save_data

    def form_is_valid(self, form, data):
        return form.is_valid()

    def get_form_fields(self, data):
        return self.fields

    def save_form(self, form, data):
        return form.save()

    @database_sync_to_async
    def get_form(self, data):
        instance = self.get_object(data, create=True)
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
        self.form = await self.get_form(data)
        save_data = await self.get_save_data(data)
        await self.reflect('save', save_data, *args, **kwargs)
        if not self.form.errors:
            await self.dispatch('retrieve', await self.get_retrieve_data(data, instance=self.form.instance), *args, **kwargs)

    @bind('create')
    async def create(self, data, *args, **kwargs):
        self.form = await self.get_form(data)
        save_data = await self.get_save_data(data)
        await self.reflect('save', save_data, *args, **kwargs)
        # if not self.form.errors:
        #     await self.dispatch('retrieve', await self.get_retrieve_data(data), *args, **kwargs)

    @bind('update')
    async def update(self, data, *args, **kwargs):
        self.form = await self.get_form(data)
        save_data = await self.get_save_data(data)
        await self.reflect('save', save_data, *args, **kwargs)
        # if not self.form.errors:
        #     await self.dispatch('retrieve', await self.get_retrieve_data(data, instance=self.form), *args, **kwargs)
