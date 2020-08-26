import re
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

__all__ = [
    'send',
]


def send(event, data, group='all'):
    layer = get_channel_layer()
    async_to_sync(layer.group_send)(group, {
        'type': 'channel_message',
        'message': {'event': event, 'data': data}
    })
