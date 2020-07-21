from channels.db import database_sync_to_async
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
        data = self.serialize_results(qs, *args, **kwargs)
        data.update(self.search_extra_data(qs, *args, **kwargs))
        return data

    @bind('search')
    async def search(self, *args, **kwargs):
        await self.send('search', await self.sync_search(*args, **kwargs))

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
        await self.send('retrieve', await self.sync_retrieve(*args, **kwargs))

    def retrieve_extra_data(self, *args, **kwargs):
        return {}


class AsyncSaveModelBinding(object):

    @database_sync_to_async
    def save(self, *args, **kwargs):
        form = self.get_form(*args, **kwargs)
        if self.form_is_valid(form):
            self.save_form(form, *args, **kwargs)
            return True
        else:
            return form.errors

    def form_is_valid(self, form):
        return form.is_valid()

    def get_form_fields(self):
        return self.fields

    def save_form(self, form, *args, **kwargs):
        return form.save()

    def get_form(self, data):
        instance = self.get_object(data)
        if not self.model_form:
            form = modelform_factory(Product, fields=self.get_form_fields())(data, instance=instance)
        else:
            form = model_form()

    @bind('save')
    async def async_save(self, *args, **kwargs):
        await self.send('save', await self.save(*args, **kwargs))

    def save_extra_data(self, *args, **kwargs):
        return {}
