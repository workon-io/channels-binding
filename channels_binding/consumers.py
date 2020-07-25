import json
import os
import requests
import traceback
import logging
from channels.exceptions import DenyConnection
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.conf import settings
from .bindings.registry import (
    registered_binding_classes,
    registered_binding_events
)
from .utils import bind, JSONEncoder
from . import settings as self_settings


logger = logging.getLogger(__name__)
__all__ = [
    'AsyncConsumer',
]


class AsyncConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
        self.user_id = None
        self.user_group_name = None
        self.groups = set('__all__')
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
                await self.subscribe('__all__')
                if self.user_group_name:
                    await self.subscribe(user_group_name)
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
        for group in set(self.groups):
            await self.unsubscribe(group)

    async def subscribe(self, group):
        self.groups.add(group)
        await self.channel_layer.group_add(group, self.channel_name)

    async def unsubscribe(self, group):
        self.groups.remove(group)
        await self.channel_layer.group_discard(group, self.channel_name)

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
                    await self.subscribe(binding.stream)  # TODO: auto unsubscribe or get subscribe from sfront
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
        message = await self.encode({'event': event, 'data': data})
        # Private
        if user:
            # Self to a specific user
            await self.channel_layer.group_send(
                f'user.{user.id}',
                {'type': 'channel_message', 'message': message}
            )

        # Dispatch or group == __all__ to broadcast
        elif group:
            # Self to a specific group
            await self.channel_layer.group_send(
                group,
                {'type': 'channel_message', 'message': message}
            )

        # Reflect
        else:
            # Self to current thread ~= the connected user
            await super().send(text_data=message)

    async def encode(self, message):
        return json.dumps(message, cls=JSONEncoder)

    # Receive message from the group
    async def channel_message(self, message):
        await super().send(text_data=message['message'])
