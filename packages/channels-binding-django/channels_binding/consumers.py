import datetime
import inspect
import json
import logging
import os
import traceback

import requests
from channels.db import database_sync_to_async
from channels.exceptions import DenyConnection
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings

from . import settings as self_settings
from .bindings.registry import (registered_binding_classes,
                                registered_binding_events)
from .utils import send, send_sync

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
        self.hash = None
        self.groups = set('__all__')
        self.actions = {}
        self.bindings_by_class = {}
        self.bindings_by_stream = {}
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
                    self.user_id = getattr(self.user, 'pk', None) or getattr(self.user, 'id', None) or getattr(self.user, 'key', None) or None
                    if self.user_id:
                        self.user_group_name = f'user.{self.user_id}'
                    break
        return self.user

    def get_binding(self, stream):
        return self.bindings_by_stream.get(stream)

    async def connect(self):
        try:
            self.user = await self.get_user()
            if self.user or self_settings.ANONYMOUS_CONNECTION_ALLOWED:
                self.bindings_by_class = {}
                self.bindings_by_stream = {}
                for bc in registered_binding_classes:
                    binding = bc(self)
                    self.bindings_by_class[bc] = binding
                    self.bindings_by_stream[binding.stream] = binding
                await self.subscribe('__all__')
                if self.user_group_name:
                    await self.subscribe(self.user_group_name)
                await self.accept()
                # await self.send('auth.roles', self.user.roles)
            else:
                raise DenyConnection("You have to be authenticated")
                # await self.close()
        except Exception as e:
            logger.error(traceback.format_exc())
            raise DenyConnection(traceback.format_exc())
            await self.close()

    async def disconnect(self, close_code=None):
        for group in set(self.groups):
            await self.unsubscribe(group)
        if not close_code:
            await self.close()

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
            event_hash = data['event'].split('#', 1)
            event = event_hash[0].strip()
            self.hash = event_hash[-1].strip() if len(event_hash) == 2 else None
            payload = data.get('data', {})
            events = registered_binding_events.get(event, [])
            counter = 0
            for binding_class, method_name in events:
                binding = self.bindings_by_class.get(binding_class, None)
                if binding:
                    await self.subscribe(binding.stream)  # TODO: auto unsubscribe or get subscribe from front
                    if not isinstance(payload, (list, dict)):
                        payload = {}
                    # print('----=> receive', event_hash, '<=TO=>', method_name)
                    binding.today = datetime.date.today()

                    method = getattr(binding, method_name)
                    if inspect.iscoroutinefunction(method):
                        await method(payload)
                    else:
                        outdata = await database_sync_to_async(method)(payload)
                        if isinstance(outdata, (list, dict)):
                            await binding.reflect(method_name, outdata)
                    counter += 1
            if not counter:
                logger.warning(f'No binding found for {event}#{self.hash}')
                await self.lazy_send('error', f'No binding found for {event}#{self.hash}')
        except Exception as e:
            logger.error(traceback.format_exc())
            await self.lazy_send('error', traceback.format_exc())

    # Send a event message
    async def lazy_send(self, *args, **kwargs):
        kwargs['hash'] = self.hash
        kwargs['consumer'] = self
        await send(*args, **kwargs)

    def send_sync(self, *args, **kwargs):
        kwargs['hash'] = self.hash
        kwargs['consumer'] = self
        send_sync(*args, **kwargs)

    # Receive message from the group
    async def channel_message(self, message):
        await super().send(text_data=message['message'])
