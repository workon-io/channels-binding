from channels.db import database_sync_to_async

__all__ = [
    'AsyncSerializerBinding',
]


class AsyncSerializerBinding(object):

    serializer_class = None

    def serialize(self, instance, *args, **kwargs):
        # kwargs['context'] = self.get_serializer_context()
        if not self.serializer_class:
            if hasattr(instance, '__json__'):
                return getattr(instance, '__json__')(*args, **kwargs)
            elif hasattr(instance, 'to_json'):
                return getattr(instance, 'to_json')(*args, **kwargs)
            elif hasattr(instance, 'json'):
                return getattr(instance, 'json')
            else:
                return {}
        else:
            return self.serializer_class(instance, *args, **kwargs).data

    def serialize_results(self, queryset, *args, **kwargs):
        if not self.serializer_class:
            rows = [self.serialize(inst, *args, **kwargs) for inst in queryset]
            return dict(page=queryset.number, limit=queryset.paginator.per_page, count=queryset.paginator.count, rows=rows)
        else:
            return self.serializer_class(queryset, *args, **kwargs).data
