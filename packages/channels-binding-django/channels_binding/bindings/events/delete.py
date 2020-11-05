from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from channels_binding import settings as self_settings
from channels_binding.utils import bind, db_sync, send, send_sync, sync
from django.forms import modelform_factory

__all__ = [
    'AsyncDeleteModelBinding'
]


class AsyncDeleteModelBinding(object):

    @bind('delete')
    async def delete(self, data, *args, **kwargs):

        instance = await self.get_object(data)
        pk = instance.pk
        instance.delete()
        if not getattr(self, 'post_delete_connect', False) is True:
            await self.reflect('delete', {'success': True, 'id': pk}, *args, **kwargs)
        # if not self.form.errors:
        #     await self.dispatch('retrieve', await self.get_retrieve_data(data, instance=self.form), *args, **kwargs)
