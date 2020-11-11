from channels_binding.utils import bind
from django.core.paginator import Paginator
from django.db.models import F, Q

__all__ = [
    'AsyncSearchModelBinding',
]


class AsyncSearchModelBinding(object):

    @bind('search')
    async def search(self, request):

        queryset = await self.get_queryset(request)
        filters = request.data.get('filters', {})
        if not isinstance(filters, dict):
            filters = {}
        queryset = await self.filter_queryset(request, queryset, filters)
        order = request.data.get('order', None)
        if not isinstance(order, (str, bytes, tuple, list)):
            order = None
        queryset = await self.order_queryset(request, queryset, order)
        page = request.data.get('page', None)
        if not isinstance(page, (str, int)):
            page = None
        limit = request.data.get('limit', None)
        if not isinstance(limit, (str, int)):
            limit = None
        queryset = await self.paginate(request, queryset, page, limit)
        search_data = await self.serialize_search(request, queryset)

        await request.reflect(search_data)

    async def serialize_search(self, request, queryset):
        rows = []
        for instance in queryset:
            row = await self.serialize_search_row(request, instance)
            if 'id' not in row:
                row['id'] = instance.pk
            rows.append(row)
        return dict(
            page=queryset.number,
            limit=queryset.paginator.per_page,
            count=queryset.paginator.count,
            order=request.data.get('order', None),
            rows=rows
        ) if hasattr(queryset, 'paginator') else dict(
            page=1,
            limit=len(rows),
            count=len(rows),
            order=request.data.get('order', None),
            rows=rows
        )

    async def serialize_search_row(self, instance, data):
        return await self.serialize_retrieve(instance, data)

    @bind('search_suggestions')
    async def search_suggestions(self, request):
        query = request.data.get('query', '')
        await request.reflect(dict(
            query=dict(
                query=query,
            ),
        ))

    async def and_filters(self, config, data):
        filters = Q()
        for name, lookup in config.items():
            if name in data:
                value = data[name]
                if isinstance(value, list):
                    if len(value):
                        filters &= Q(**{f'{lookup}__in': value})
                else:
                    filters &= Q(**{f'{lookup}': value})
        return filters

    async def or_filters(self, config, data):
        filters = Q()
        for name, lookup in config.items():
            if name in data:
                value = data[name]
                if isinstance(value, list):
                    if len(value):
                        filters |= Q(**{f'{lookup}__in': value})
                else:
                    filters |= Q(**{f'{lookup}': value})
        return filters

    async def filter_queryset(self, request, queryset, filters):
        for name, data in filters.items():
            if isinstance(data, (list, tuple)):
                queryset = await self.filter_in(request, queryset, name)
        return queryset

    async def order_queryset(self, request, queryset, order):
        if order:
            order = order.replace('.', '__')
            queryset = queryset.order_by(
                F(order.strip('-')).asc(nulls_last=True) if order.startswith('-')
                else
                F(order.strip('-')).desc(nulls_last=True)
            )
        return queryset

    async def paginate(self, request, queryset, page, limit):
        limit = limit or self.page_size or self_settings.DEFAULT_PAGE_SIZE
        try:
            page = int(page)
        except (KeyError, ValueError, TypeError) as e:
            page = 1
        paginator = Paginator(queryset, max(10, min(100, int(limit))))
        return paginator.get_page(page)
