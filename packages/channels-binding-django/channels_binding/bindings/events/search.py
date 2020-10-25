from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from channels_binding import settings as self_settings
from channels_binding.utils import bind, db_sync, send, send_sync, sync
from django.forms import modelform_factory

__all__ = [
    'AsyncSearchModelBinding',
]


@database_sync_to_async
def async_search_data(bind, data):
    queryset = bind.get_queryset(data)
    filters = data.get('filters', {})
    if not isinstance(filters, dict):
        filters = {}
    queryset = bind.filter_queryset(queryset, filters, data)
    order = data.get('order', None)
    if not isinstance(order, (str, bytes, tuple, list)):
        order = None
    queryset = bind.order_queryset(queryset, order, data)
    page = data.get('page', None)
    if not isinstance(page, (str, int)):
        page = None
    limit = data.get('limit', None)
    if not isinstance(limit, (str, int)):
        limit = None
    queryset = bind.paginate(queryset, page, limit, data)
    search_data = bind.serialize_search(queryset, data)
    return search_data


class AsyncSearchModelBinding(object):

    @ bind('search')
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

    @ bind('search_suggestions')
    async def search_suggestions(self, data, *args, **kwargs):
        query = data.get('query', '')
        await self.reflect(f'search_suggestions', dict(
            query=dict(
                query=query,
            ),
        ), *args, **kwargs)
