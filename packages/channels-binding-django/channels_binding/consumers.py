import asyncio
import inspect
import logging
import time
import traceback

from channels.exceptions import DenyConnection
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings

from . import settings as self_settings
from .bindings.registry import registered_binding_classes
from .request import AsyncRequest
from .utils import encode_json, send, send_sync

logger = logging.getLogger(__name__)
__all__ = [
    'AsyncConsumer',
]


class AsyncConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
        self.session = None
        self.uid = None
        self.groups = set('__all__')
        self.actions = {}
        self.bindings_by_class = {}
        self.bindings_by_stream = {}
        self.authentifications = [cls() for cls in self_settings.AUTHENTIFICATION_CLASSES]

    async def get_session(self):
        return self.scope['session']

    async def get_user(self):
        return self.scope['user']
        # self.user = None
        # self.user_id = None
        # self.user_group_name = None
        # for auth in self.authentifications:
        #     if hasattr(auth, 'get_user'):
        #         if inspect.iscoroutinefunction(auth.get_user):
        #             self.user = await auth.get_user(self)
        #         else:
        #             self.user = auth.get_user(self)
        #         if self.user:
        #             self.user_id = getattr(self.user, 'pk', None) or getattr(self.user, 'id', None) or getattr(self.user, 'key', None) or None
        #             if self.user_id:
        #                 self.user_group_name = f'user.{self.user_id}'
        #             break
        # return self.user

    def get_binding(self, stream):
        return self.bindings_by_stream.get(stream)

    async def connect(self):
        try:
            self.user = await self.get_user()
            self.session = await self.get_session()

            if (self.user and self.user.is_authenticated) or self_settings.ANONYMOUS_CONNECTION_ALLOWED:
                self.bindings_by_class = {}
                self.bindings_by_stream = {}
                for bc in registered_binding_classes:
                    binding = bc()
                    self.bindings_by_class[bc] = binding
                    self.bindings_by_stream[binding.stream] = binding
                await self.subscribe_self()
                await self.subscribe_broadcast()
                await self.accept()
            else:
                raise DenyConnection("Anonymous User is not allowed")
        except Exception as e:
            logger.error(traceback.format_exc())
            raise DenyConnection(traceback.format_exc())

    async def disconnect(self, close_code=None):
        for group in set(self.groups):
            await self.unsubscribe(group)
        if not close_code:
            await self.close()

    async def subscribe_broadcast(self):
        await self.subscribe('__all__')

    async def subscribe_self(self):
        user_id = getattr(self.user, 'pk', None) or getattr(self.user, 'id', None) or getattr(self.user, 'key', None) or None
        if user_id:
            await self.subscribe(f'user.{user_id}')

    async def subscribe(self, group):
        self.groups.add(group)
        await self.channel_layer.group_add(group, self.channel_name)

    async def unsubscribe(self, group):
        self.groups.remove(group)
        await self.channel_layer.group_discard(group, self.channel_name)

    async def receive(self, text_data):
        asyncio.create_task(self.parallel_receive(text_data))

    async def parallel_receive(self, text_data):
        try:

            if settings.DEBUG:
                t0 = time.time()
            request = AsyncRequest(self, text_data)
            await request.apply()
            if settings.DEBUG:
                t = time.time() - t0
                logger.debug(f'Event AsyncRequest {request.event}#{request.uid} takes {round(t, 2)} seconds')

        except RuntimeError as e:
            logger.error(traceback.format_exc())
            message = await encode_json({'error': traceback.format_exc()})
            await self.send(text_data=message)
            await self.close()

    # Send a event message
    async def lazy_send(self, *args, **kwargs):
        kwargs['uid'] = self.uid
        kwargs['consumer'] = self
        await send(*args, **kwargs)

    def send_sync(self, *args, **kwargs):
        kwargs['uid'] = self.uid
        kwargs['consumer'] = self
        send_sync(*args, **kwargs)

    # Receive message from the group
    async def channel_message(self, message):
        await super().send(text_data=message['message'])
