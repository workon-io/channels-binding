from channels.db import database_sync_to_async
from django.forms import modelform_factory, model_to_dict
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from channels_binding.utils import (
    bind, db_sync, sync, send, send_sync
)

from channels_binding import settings as self_settings

__all__ = [
    'AsyncRetrieveModelBinding',
]


@database_sync_to_async
def async_retrieve_data(bind, data, instance=None):
    instance = instance or bind.get_object(data, create=False)
    if isinstance(instance, list):
        retrieve_data = []
        for inst in instance:
            inst_data = bind.serialize_retrieve(inst, data)
            inst_data.update(id=inst.pk)
            retrieve_data.append(inst_data)
    else:
        retrieve_data = bind.serialize_retrieve(instance, data)
        retrieve_data.update(id=instance.pk)
        if hasattr(bind, 'serialize_retrieve_extra'):
            retrieve_data.update(bind.serialize_retrieve_extra(instance, data))
    return retrieve_data


class AsyncRetrieveModelBinding(object):

    @bind('retrieve')
    async def retrieve(self, data, *args, **kwargs):
        await self.reflect('retrieve', await async_retrieve_data(self, data), *args, **kwargs)

    def serialize_retrieve(self, instance, data):
        return model_to_dict(instance)
