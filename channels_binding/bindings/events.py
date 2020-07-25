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
    def sync_search(self, *args, **kwargs):
        qs = self.get_queryset(*args, **kwargs)
        qs = self.filter_queryset(qs, *args, **kwargs)
        qs = self.paginate(qs, *args, **kwargs)
        data = self.serialize_queryset(qs, *args, **kwargs)
        data.update(self.search_extra_data(qs, *args, **kwargs))
        return data

    @bind('search')
    async def search(self, *args, **kwargs):
        await self.reflect('search', await self.sync_search(*args, **kwargs))

    def search_extra_data(self, *args, **kwargs):
        return {}


class AsyncRetrieveModelBinding(object):

    @database_sync_to_async
    def sync_retrieve(self, *args, **kwargs):
        instance = self.get_object(*args, **kwargs)
        data = self.serialize(instance, *args, **kwargs)
        data.update(self.retrieve_extra_data(instance, *args, **kwargs))
        return data

    @bind('retrieve')
    async def retrieve(self, *args, **kwargs):
        await self.reflect('retrieve', await self.sync_retrieve(*args, **kwargs))

    def retrieve_extra_data(self, *args, **kwargs):
        return {}


class AsyncSaveModelBinding(object):

    @database_sync_to_async
    def sync_save(self, *args, **kwargs):
        form = self.get_form(*args, **kwargs)
        if self.form_is_valid(form, *args, **kwargs):
            self.save_form(form, *args, **kwargs)
        data = self.serialize_form(form, *args, **kwargs)
        data.update(self.save_extra_data(form, *args, **kwargs))
        return data, form

    def form_is_valid(self, form, *args, **kwargs):
        return form.is_valid()

    def get_form_fields(self, data):
        return self.fields

    def save_form(self, form, *args, **kwargs):
        return form.save()

    def get_form(self, data, *args, **kwargs):
        instance = self.get_object(data, *args, **kwargs)
        fields = self.get_form_fields(data, *args, **kwargs)
        for name in fields:
            if name not in data:
                data[name] = getattr(instance, name, None)
        if self.model and not self.model_form:
            form = modelform_factory(self.model, fields=fields)(data, instance=instance)
        else:
            form = model_form(data, instance=instance)
        return form

    @bind('save')
    async def save(self, *args, **kwargs):
        data, form = await self.sync_save(*args, **kwargs)
        await self.reflect('save', data)
        if not form.errors:
            await self.dispatch('retrieve', await self.sync_retrieve(*args, **kwargs))

    def save_extra_data(self, *args, **kwargs):
        return {}
