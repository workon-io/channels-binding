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
)
from ..utils import (
    bind
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

    async def send(self, event, data, stream=None):
        await self.consumer.send(f'{stream or self.stream}.{event}', data)


class AsyncBinding(
    AsyncBindingBase,
    AsyncModelBinding,
    AsyncSerializerBinding,
    AsyncSearchModelBinding,
    AsyncRetrieveModelBinding,
):
    pass
