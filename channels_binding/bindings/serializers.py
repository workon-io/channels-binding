from channels.db import database_sync_to_async

__all__ = [
    'AsyncSerializerBinding',
]


class AsyncSerializerBinding(object):

    serializer_class = None
