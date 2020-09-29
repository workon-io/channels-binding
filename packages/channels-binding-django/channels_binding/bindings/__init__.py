import traceback
import datetime
import os
from channels.db import database_sync_to_async
from django.conf import settings
from .registry import (
    RegisteredBindingMetaClass,
)
from .models import (
    AsyncModelBinding,
)
from .serializers import (
    AsyncSerializerBinding,
)
from .events import (
    AsyncSearchModelBinding,
    AsyncRetrieveModelBinding,
    AsyncSaveModelBinding,
    AsyncDeleteModelBinding,
    AsyncFormModelBinding,
    AsyncSignalsModelBinding,
)
from ..utils import (
    bind,
    send,
)

async_db = database_sync_to_async

__all__ = [
    'AsyncBinding',
    'bind',
    'async_db'
]


class AsyncBindingBase(metaclass=RegisteredBindingMetaClass):

    stream = None
    permission_classes = ()

    def __init__(self, consumer=None, user=None):
        self.consumer = consumer
        self.user = consumer.user if consumer else user
        self.today = datetime.date.today()

    def get_binding(self, stream):
        if self.consumer:
            return self.consumer.bindings_by_stream.get(stream)
        else:
            return self.__class__._lazy_bindings_by_stream.get(stream)

    # Respond to the current socket
    async def send(self, *args, **kwargs):
        kwargs['binding'] = self
        if self.consumer:
            await self.consumer.lazy_send(*args, **kwargs)
        else:
            await send(*args, **kwargs)

    # Respond to the current socket

    async def reflect(self, *args, **kwargs):
        await self.send(*args, **kwargs)

    # Respond to the current streamed group attached sockets
    async def dispatch(self, *args, **kwargs):
        await self.send(*args, group=kwargs.get('stream', self.stream), **kwargs)

    # Respond to all sockets
    async def broadcast(self, *args, **kwargs):
        await self.send(*args, group='__all__', **kwargs)

    # Respond to the current streamed group attached sockets
    async def subscribe(self, group=None):
        if self.consumer:
            await self.consumer.subscribe(group or self.stream)

    # Respond to the current streamed group attached sockets
    async def unsubscribe(self, group=None):
        if self.consumer:
            await self.consumer.unsubscribe(group or self.stream)


class AsyncBinding(
    AsyncBindingBase,
    AsyncModelBinding,
    AsyncSerializerBinding,
    AsyncSearchModelBinding,
    AsyncRetrieveModelBinding,
    AsyncSaveModelBinding,
    AsyncDeleteModelBinding,
    AsyncFormModelBinding,
    AsyncSignalsModelBinding
):
    pass
