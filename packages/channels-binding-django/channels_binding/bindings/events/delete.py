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


@database_sync_to_async
def async_delete_data(bind, data):
    instance = bind.get_object(data)
    pk = instance.pk
    instance.delete()
    return {'success': True, 'id': pk}


class AsyncDeleteModelBinding(object):

    @bind('delete')
    async def delete(self, data, *args, **kwargs):
        delete_data = await async_delete_data(self, data)
        if not getattr(self, 'post_delete_connect', False) is True:
            await self.reflect('delete', delete_data, *args, **kwargs)
        # if not self.form.errors:
        #     await self.dispatch('retrieve', await self.get_retrieve_data(data, instance=self.form), *args, **kwargs)
