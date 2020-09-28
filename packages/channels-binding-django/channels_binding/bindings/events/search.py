from channels.db import database_sync_to_async
from django.forms import modelform_factory
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from channels_binding.utils import (
    bind, db_sync, sync, send, send_sync
)

from channels_binding import settings as self_settings

__all__ = [
    'AsyncSearchModelBinding',
]


@database_sync_to_async
def async_search_data(bind, data):
    queryset = bind.get_queryset(data)
    queryset = bind.filter_queryset(queryset, data)
    queryset = bind.paginate(queryset, data)
    search_data = bind.serialize_search(queryset, data)
    return search_data


class AsyncSearchModelBinding(object):

    @bind('search')
    async def search(self, data, *args, **kwargs):
        await self.reflect(f'search', await async_search_data(self, data), *args, **kwargs)

    def serialize_search(self, queryset, data):
        if not self.serializer_class:
            rows = []
            for inst in queryset:
                row = self.serialize_search_row(inst, data)
                if 'id' not in row:
                    row['id'] = inst.pk
                rows.append(row)
            return dict(
                page=queryset.number,
                limit=queryset.paginator.per_page,
                count=queryset.paginator.count,
                rows=rows
            ) if hasattr(queryset, 'paginator') else dict(
                page=1,
                limit=len(rows),
                count=len(rows),
                rows=rows
            )
        else:
            return self.serializer_class(queryset, datas).data

    def serialize_search_row(self, instance, data):
        return self.serialize_retrieve(instance, data)
