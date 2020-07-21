from django.core.exceptions import ObjectDoesNotExist
from django.core.paginator import Paginator, Page
from django.forms import modelform_factory
from channels.db import database_sync_to_async

__all__ = [
    'AsyncModelBinding',
]


class AsyncModelBinding(object):

    queryset = None
    # mark as abstract
    model = None
    lookup_field = 'pk'
    page_size = 25
    model_form = None
    fields = []  # hack to pass cls.register() without ValueError

    def get_queryset(self, data):
        if not self.queryset:
            if self.model:
                return self.model.objects.all()
        else:
            return self.queryset.all()

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

    def get_object(self, data):
        try:
            return self.model.objects.get(pk=data.get('id', None))
        except self.model.DoesNotExist:
            raise Exception(f'{self.stream} Does Not Exist')
