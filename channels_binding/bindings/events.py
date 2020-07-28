from channels.db import database_sync_to_async
from django.forms import modelform_factory
from ..utils import (
    bind, db_sync, sync
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
        return search_data

    @bind('search')
    async def search(self, data, *args, **kwargs):
        await self.reflect(f'search', await self.get_search_data(data), *args, **kwargs)


class AsyncRetrieveModelBinding(object):

    @database_sync_to_async
    def get_retrieve_data(self, data):
        instance = self.get_object(data)
        retrieve_data = self.serialize(instance, data)
        retrieve_data.update(id=instance.pk)
        return retrieve_data

    @bind('retrieve')
    async def retrieve(self, data, *args, **kwargs):
        await self.reflect('retrieve', await self.get_retrieve_data(data), *args, **kwargs)


class AsyncSaveModelBinding(object):

    @database_sync_to_async
    def get_save_data_form(self, data):
        form = self.get_form(data)
        if self.form_is_valid(form, data):
            self.save_form(form, data)
        save_data = self.serialize_form(form, data)
        return save_data, form

    def form_is_valid(self, form, data):
        return form.is_valid()

    def get_form_fields(self, data):
        return self.fields

    def save_form(self, form, data):
        return form.save()

    def get_form(self, data):
        instance = self.get_object(data)
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
        save_data, form = await self.get_save_data_form(data)
        await self.reflect('save', save_data, *args, **kwargs)
        if not form.errors:
            await self.dispatch('retrieve', await self.get_retrieve_data(data), *args, **kwargs)
