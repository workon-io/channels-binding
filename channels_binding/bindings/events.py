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
    def search(self, *args, **kwargs):
        qs = self.get_queryset(*args, **kwargs)
        qs = self.filter_queryset(qs, *args, **kwargs)
        qs = self.paginate(qs, *args, **kwargs)
        data = self.serialize_results(qs, *args, **kwargs)
        data.update(self.search_extra_data(qs, *args, **kwargs))
        return data

    @bind('search')
    async def async_search(self, *args, **kwargs):
        await self.send('search', await self.search(*args, **kwargs))

    def search_extra_data(self, *args, **kwargs):
        return {}


class AsyncRetrieveModelBinding(object):

    @database_sync_to_async
    def retrieve(self, *args, **kwargs):
        instance = self.get_object(*args, **kwargs)
        data = self.serialize(instance, *args, **kwargs)
        data.update(self.retrieve_extra_data(instance, *args, **kwargs))
        return data

    @bind('retrieve')
    async def async_retrieve(self, *args, **kwargs):
        await self.send('retrieve', await self.retrieve(*args, **kwargs))

    def retrieve_extra_data(self, data, *args, **kwargs):
        return {}


class AsyncSaveModelBinding(object):

    @database_sync_to_async
    def save(self, *args, **kwargs):
        form = self.get_form(*args, **kwargs)
        if form.is_valid():
            self.save_form(form, *args, **kwargs)
            form.instance.update()
            return True
        else:
            return form.errors
        return instance_data

    def save_form(self, form, *args, **kwargs):
        form.save()

    def get_form(self, data):
        instance = self.get_object(data)
        if not self.model_form:
            form = modelform_factory(Product, fields=self.fields)(data, instance=instance)
        else:
            form = model_form()

    @bind('save')
    async def async_save(self, *args, **kwargs):
        instance = await database_sync_to_async(self.get_object)(*args, **kwargs)
        instance_data = await database_sync_to_async(self.serialize)(instance, *args, **kwargs)
        instance_data.update(await database_sync_to_async(self.retrieve_extra_data)(instance, *args, **kwargs))
        await self.send('retrieve', instance_data)

    def save_extra_data(self, *args, **kwargs):
        return {}
