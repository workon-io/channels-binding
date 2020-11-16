import datetime
import os
import traceback

from channels.db import database_sync_to_async
from django.conf import settings

from ..utils import bind, send
from .events import (AsyncDeleteModelBinding, AsyncFormModelBinding,
                     AsyncRetrieveModelBinding, AsyncSaveModelBinding,
                     AsyncSearchModelBinding, AsyncSignalsModelBinding)
from .models import AsyncModelBinding
from .registry import RegisteredBindingMetaClass
from .serializers import AsyncSerializerBinding

async_db = database_sync_to_async

__all__ = [
    'AsyncBinding',
    'bind',
    'async_db'
]


class AsyncBindingBase(metaclass=RegisteredBindingMetaClass):

    stream = None
    permission_classes = ()


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
