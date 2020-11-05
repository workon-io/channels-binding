from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from channels_binding import settings as self_settings
from channels_binding.utils import bind, db_sync, send, send_sync, sync
from django.forms import modelform_factory

__all__ = [
    'AsyncListModelBinding',
]


class AsyncListModelBinding(object):

    @bind('list')
    async def list(self, data, *args, **kwargs):

        queryset = await self.get_queryset(data)
        queryset = await self.filter_queryset(queryset, data)
        list_data = await self.serialize_list(queryset, data)

        await self.reflect(f'list', list_data, *args, **kwargs)

    async def serialize_list(self, queryset, *args, **kwargs):
        if not self.serializer_class:
            rows = []
            for inst in queryset:
                row = await self.serialize_list_row(inst, *args, **kwargs)
                if 'id' not in row:
                    row['id'] = inst.pk
                rows.append(row)
        else:
            return self.serializer_class(queryset, *args, **kwargs).data

    async def serialize_list_row(self, instance, *args, **kwargs):
        return await self.serialize_retrieve(instance, *args, **kwargs)
