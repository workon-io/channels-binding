from channels.db import database_sync_to_async
from ..utils import (
    bind
)
from . import settings as self_settings

__all__ = [
    'AsyncSearchModelBinding',
    'AsyncRetrieveModelBinding'
]


class AsyncSearchModelBinding(object):

    @bind('search')
    async def search(self, data):
        queryset = await database_sync_to_async(self.get_queryset)(data)
        queryset = await database_sync_to_async(self.filter_queryset)(queryset, data)
        queryset = await database_sync_to_async(self.paginate)(queryset, data)
        results_data = await database_sync_to_async(self.serialize_results)(queryset, data)
        await self.send('search', results_data)


class AsyncRetrieveModelBinding(object):

    @bind('retrieve')
    async def retrieve(self, data):
        instance = await database_sync_to_async(self.get_object)(data)
        instance_data = await database_sync_to_async(self.serialize)(instance, data)
        await self.send('retrieve', instance_data)
