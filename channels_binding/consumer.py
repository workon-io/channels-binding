import json
import os
import datetime
import requests
import traceback
import logging
import decimal
try:
    from psycopg2.extras import NumericRange
except ImportError as e:
    NumericRange = None
from channels.exceptions import DenyConnection
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.conf import settings
from .binding import (
    register_bindings,
    registered_binding_classes,
    registered_binding_events
)
from . import settings as self_settings


logger = logging.getLogger(__name__)
__all__ = ['AsyncConsumer', ]


register_bindings()
print(registered_binding_events)


class AsyncConsumer(AsyncWebsocketConsumer):

    groups = ["all"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
        self.user_id = None
        self.user_group_name = None
        self.actions = {}
        self.authentifications = [cls() for cls in self_settings.AUTHENTIFICATION_CLASSES]

    @database_sync_to_async
    def get_user(self):
        self.user = None
        self.user_id = None
        self.user_group_name = None
        for auth in self.authentifications:
            if hasattr(auth, 'get_user'):
                self.user = auth.get_user(self)
                if self.user:
                    self.user_id = getattr(self.user, 'pk', getattr(self.user, 'id', getattr(self.user, 'key')))
                    if self.user_id:
                        self.user_group_name = f'user.{self.user_id}'
                    break

    async def connect(self):
        try:
            self.user = self.get_user()
            if self.user:
                self.bindings_by_class = {bc: bc(self) for bc in registered_binding_classes}
                if self.user_group_name:
                    await self.channel_layer.group_add(self.user_group_name, self.channel_name)
                await self.accept()
                # await self.send('auth.roles', self.user.roles)
            else:
                if self_settings.ANONYMOUS_CONNECTION_ALLOWED:
                    await self.accept()
                else:
                    raise DenyConnection("Invalid Token")
                    await self.close()
        except Exception as e:
            logger.error(traceback.format_exc())
            raise DenyConnection(traceback.format_exc())
            await self.close()

    # On client disconnect
    async def disconnect(self, close_code):
        if self.user_group_name:
            # TODO Discard all groups
            await self.channel_layer.group_discard(self.user_group_name, self.channel_name)
            # await self.channel_layer.group_discard(f'siliconexpert', self.channel_name)

    # On client send a message, pass throught the corresponding action_ (event)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            event = data['event']
            payload = data.get('data', {})
            events = registered_binding_events.get(event, [])
            counter = 0
            for binding_class, method_name in events:
                binding = self.bindings_by_class.get(binding_class, None)
                if binding:
                    if not isinstance(payload, dict):
                        payload = {}
                    await getattr(binding, method_name)(payload)
                    counter += 1
            if not counter:
                await self.send('error', f'No binding found for {event}')
        except Exception as e:
            logger.error(traceback.format_exc())
            await self.send('error', traceback.format_exc())

    # Send a event message
    async def send(self, event, data, group=None, user=None):

        if user:
            # Self to a specific user
            await self.channel_layer.group_send(
                f'user.{user.id}',
                {
                    'type': 'channel_message',
                    'message': {'event': event, 'data': data}
                }
            )
        elif group:
            # Self to a specific group
            await self.channel_layer.group_send(
                group,
                {
                    'type': 'channel_message',
                    'message': {'event': event, 'data': data}
                }
            )
        else:
            # Self to current thread ~= the connected user
            await super().send(text_data=json.dumps({'event': event, 'data': data}, cls=JSONEncoder))

    # async def broadcast(self, event, data, group=None, user=None):
    # await super().send(text_data=json.dumps({ 'event': event, 'data': data
    # }))

    # Receive message from the group

    async def channel_message(self, event):
        await super().send(text_data=json.dumps(event['message'], cls=JSONEncoder))


class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, '__json__'):
            return obj.__json__()
        elif isinstance(obj, datetime.datetime):
            return obj.isoformat()
        elif isinstance(obj, bytes):
            return obj.decode('utf-8')
        elif isinstance(obj, memoryview):
            return obj.tobytes().decode('utf-8')
        elif NumericRange and isinstance(obj, NumericRange):
            return [obj.lower, obj.upper]
        elif isinstance(obj, decimal.Decimal):
            return float(obj)
        return super().default(obj)
