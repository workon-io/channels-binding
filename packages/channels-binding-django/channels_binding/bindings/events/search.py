from channels_binding.utils import bind
from django.core.paginator import Paginator

__all__ = [
    'AsyncSearchModelBinding',
]


class AsyncSearchModelBinding(object):

    @bind('search')
    async def search(self, data, *args, **kwargs):

        queryset = await self.get_queryset(data)
        filters = data.get('filters', {})
        if not isinstance(filters, dict):
            filters = {}
        queryset = await self.filter_queryset(queryset, filters, data)
        order = data.get('order', None)
        if not isinstance(order, (str, bytes, tuple, list)):
            order = None
        queryset = await self.order_queryset(queryset, order, data)
        page = data.get('page', None)
        if not isinstance(page, (str, int)):
            page = None
        limit = data.get('limit', None)
        if not isinstance(limit, (str, int)):
            limit = None
        queryset = await self.paginate(queryset, page, limit, data)
        search_data = await self.serialize_search(queryset, data)

        await self.reflect(f'search', search_data, *args, **kwargs)

    async def serialize_search(self, queryset, data):
        rows = []
        for inst in queryset:
            row = await self.serialize_search_row(inst, data)
            if 'id' not in row:
                row['id'] = inst.pk
            rows.append(row)
        return dict(
            page=queryset.number,
            limit=queryset.paginator.per_page,
            count=queryset.paginator.count,
            order=data.get('order', None),
            rows=rows
        ) if hasattr(queryset, 'paginator') else dict(
            page=1,
            limit=len(rows),
            count=len(rows),
            order=data.get('order', None),
            rows=rows
        )

    async def serialize_search_row(self, instance, data):
        return await self.serialize_retrieve(instance, data)

    @bind('search_suggestions')
    async def search_suggestions(self, data, *args, **kwargs):
        query = data.get('query', '')
        await self.reflect(f'search_suggestions', dict(
            query=dict(
                query=query,
            ),
        ), *args, **kwargs)

    async def filter_in(self, queryset, name, data, lookup=None):
        if name in data:
            value = data[name]
            if isinstance(value, list):
                if len(value):
                    return queryset.filter(**{f'{lookup or name}__in': value})
                else:
                    return queryset
            else:
                return queryset.filter(**{f'{lookup or name}': value})
        else:
            return queryset

    async def filter_queryset(self, queryset, filters, data):
        for name, data in filters.items():
            if isinstance(data, (list, tuple)):
                queryset = await self.filter_in(queryset, name, data)
        return queryset

    async def order_queryset(self, queryset, order, data):
        if order:
            queryset = queryset.order_by(
                F(order.strip('-')).asc(nulls_last=True) if order.startswith('-')
                else
                F(order.strip('-')).desc(nulls_last=True)
            )
        return queryset

    async def paginate(self, queryset, page, limit, data):
        limit = limit or self.page_size or self_settings.DEFAULT_PAGE_SIZE
        try:
            page = int(page)
        except (KeyError, ValueError, TypeError) as e:
            page = 1
        paginator = Paginator(queryset, max(10, min(100, int(limit))))
        return paginator.get_page(page)
