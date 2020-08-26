from channels.db import database_sync_to_async
from django.forms import modelform_factory
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from channels_binding.utils import (
    bind, db_sync, sync, send, send_sync
)

from channels_binding import settings as self_settings

__all__ = [
    'AsyncListModelBinding',
]


@database_sync_to_async
def async_list_data(bind, data):
    queryset = bind.get_queryset(data)
    queryset = bind.filter_queryset(queryset, data)
    list_data = bind.serialize_list(queryset, data)
    return list_data


class AsyncListModelBinding(object):

    @bind('list')
    async def list(self, data, *args, **kwargs):
        await self.reflect(f'list', await async_list_data(self, data), *args, **kwargs)

    def serialize_list(self, queryset, *args, **kwargs):
        if not self.serializer_class:
            rows = []
            for inst in queryset:
                row = self.serialize_list_row(inst, *args, **kwargs)
                if 'id' not in row:
                    row['id'] = inst.pk
                rows.append(row)
        else:
            return self.serializer_class(queryset, *args, **kwargs).data

    def serialize_list_row(self, instance, *args, **kwargs):
        return self.serialize_retrieve(instance, *args, **kwargs)
