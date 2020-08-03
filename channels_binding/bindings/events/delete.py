from channels.db import database_sync_to_async
from django.forms import modelform_factory
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from channels_binding.utils import (
    bind, db_sync, sync, send, send_sync
)

from channels_binding import settings as self_settings

__all__ = [
    'AsyncDeleteModelBinding'
]


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
