from django.core.exceptions import ObjectDoesNotExist
from django.core.paginator import Paginator, Page
from django.forms import modelform_factory
from channels.db import database_sync_to_async

__all__ = [
    'AsyncModelBinding',
]


class AsyncModelBinding(object):

    queryset = None
    model = None
    lookup_field = 'pk'
    data_pk = 'id'
    page_size = 25

    def get_queryset(self, data):
        if not self.queryset:
            if self.model:
                return self.model.objects.all()
        else:
            return self.queryset.all()

    def filter_in(self, queryset, name, data, lookup=None):
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

    def filter_queryset(self, queryset, data):
        return queryset

    def paginate(self, queryset, data, limit=None):
        limit = limit or self.page_size or self_settings.DEFAULT_PAGE_SIZE
        try:
            page = int(data['page'])
        except (KeyError, ValueError, TypeError) as e:
            page = 1
        paginator = Paginator(queryset, max(10, min(100, int(limit))))
        return paginator.get_page(page)

    def get_object(self, data, create=False):
        pk = data.get(self.data_pk, None)
        try:
            if isinstance(pk, list):
                return list(self.filter_queryset(self.model.objects, {}).filter(pk__in=pk))
            else:
                return self.filter_queryset(self.model.objects, {}).get(pk=pk)
        except self.model.DoesNotExist as e:
            if create:
                return self.model()
            else:
                raise self.model.DoesNotExist(f'{self.stream} pk:{pk} Does Not Exist')
