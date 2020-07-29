import traceback
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
)
from ..utils import (
    bind,
    send,
)

__all__ = [
    'AsyncBinding',
    'bind'
]


class AsyncBindingBase(metaclass=RegisteredBindingMetaClass):

    stream = None
    permission_classes = ()

    def __init__(self, consumer):
        self.consumer = consumer
        self.user = consumer.user

    # Respond to the current socket

    async def send(self, *args, **kwargs):
        kwargs['binding'] = self
        await self.consumer.lazy_send(*args, **kwargs)

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
        await self.consumer.subscribe(group or self.stream)

    # Respond to the current streamed group attached sockets
    async def unsubscribe(self, group=None):
        await self.consumer.unsubscribe(group or self.stream)


class AsyncBinding(
    AsyncBindingBase,
    AsyncModelBinding,
    AsyncSerializerBinding,
    AsyncSearchModelBinding,
    AsyncRetrieveModelBinding,
    AsyncSaveModelBinding,
    AsyncDeleteModelBinding,
):
    pass
