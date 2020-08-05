from channels.db import database_sync_to_async
from django.forms import modelform_factory
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from channels_binding.utils import (
    bind, db_sync, sync, send, send_sync
)

from channels_binding import settings as self_settings

__all__ = [
    'AsyncSaveModelBinding',
]


class AsyncSaveModelBinding(object):

    pass
    # @database_sync_to_async
    # def get_save_data(self, data):
    #     if self.form_is_valid(self.form, data):
    #         self.save_form(self.form, data)
    #     save_data = self.serialize_save(self.form, data)
    #     save_data.update(id=self.form.instance.pk)
    #     return save_data

    # def form_is_valid(self, form, data):
    #     return form.is_valid()

    # def get_form_fields(self, data):
    #     return self.fields

    # def save_form(self, form, data):
    #     return form.save()

    # @database_sync_to_async
    # def get_form(self, data, **kwargs):
    #     instance = self.get_object(data, create=kwargs.get('create', True))
    #     fields = self.get_form_fields(data)
    #     for name in fields:
    #         if name not in data:
    #             data[name] = getattr(instance, name, None)
    #     if self.model and not self.model_form:
    #         form = modelform_factory(self.model, fields=fields)(data, instance=instance)
    #     else:
    #         form = self.model_form(data, instance=instance)
    #     return form

    # @bind('save')
    # async def save(self, data, *args, **kwargs):
    #     self.form = await self.get_form(data, create=kwargs.get('create', True))
    #     save_data = await self.get_save_data(data)
    #     await self.reflect('save', save_data, *args, **kwargs)
    #     if not self.form.errors and not self.post_save_connect:
    #         await self.dispatch('retrieve', await self.get_retrieve_data(data, instance=self.form.instance), *args, **kwargs)

    # @bind('create')
    # async def create(self, data, *args, **kwargs):
    #     await self.save(data, create=True)

    # @bind('update')
    # async def update(self, data, *args, **kwargs):
    #     await self.save(data, create=False)

    # def serialize_save(self, form, *args, **kwargs):
    #     if form.errors:
    #         return {'errors': form.errors}
    #     else:
    #         return {'success': True}
