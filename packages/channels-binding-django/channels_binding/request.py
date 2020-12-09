import datetime
import json
import logging
import traceback

from channels.auth import login, logout
from channels.db import database_sync_to_async

from .bindings.registry import registered_binding_events
from .utils import encode_json

logger = logging.getLogger(__name__)
__all__ = ['AsyncRequest']


class AsyncRequest:

    def __init__(self, consumer, text_data):

        self.consumer = consumer

        payload = json.loads(text_data)
        self.event = payload.get('event', 'error')
        self.data = payload.get('data', {})
        event_uid = self.event.split('#', 1)
        self.pure_event = event_uid[0].strip()
        self.action = self.pure_event.rsplit('.', 1)[-1]
        self.uid = event_uid[-1].strip() if len(event_uid) == 2 else None
        self.today = datetime.date.today()
        if not isinstance(self.data, (list, dict)):
            self.data = {}

    @property
    def user(self):
        return self.consumer.user

    @property
    def session(self):
        return self.consumer.session

    @property
    def scope(self):
        return self.consumer.scope

    async def apply(self):

        try:
            events = registered_binding_events.get(self.pure_event, [])
            counter = 0
            for binding_class, method_name, action in events:
                binding = self.consumer.bindings_by_class.get(binding_class, None)
                if binding:
                    counter += 1
                    if await binding.has_permission(self):
                        await self.consumer.subscribe(binding.stream)  # TODO: auto unsubscribe or get subscribe from front
                        method = getattr(binding, method_name)
                        outdata = await method(self)
                        if outdata:
                            await self.reflect(outdata)
                    else:
                        message = await encode_json({'event': self.event, 'error': 'No permision for {}'.format(self.event)})
                        await self.consumer.send(text_data=message)

            if not counter:
                logger.warning('No binding found for {}'.format(self.event))
                message = await encode_json({'event': self.event, 'error': 'No binding found for {}'.format(self.event)})
                await self.consumer.send(text_data=message)

        except Exception as e:
            logger.error(traceback.format_exc())
            message = await encode_json({'event': self.event, 'error': traceback.format_exc()})
            await self.consumer.send(text_data=message)

    # Respond to the current socket

    async def login(self, user):
        self.consumer.user = user
        await login(self.consumer.scope, self.user, backend=None)
        self.consumer.scope["session"].save()
        await database_sync_to_async(self.consumer.scope["session"].save)()
        self.consumer.scope["user"] = self.user
        user_id = getattr(self.user, 'pk', None) or getattr(self.user, 'id', None) or getattr(self.user, 'key', None) or None
        if user_id:
            await self.subscribe(f'user.{user_id}')
        await self.reflect(getattr(self.session, 'session_key', None), event="sessionid")

    async def logout(self):
        user_id = getattr(self.user, 'pk', None) or getattr(self.user, 'id', None) or getattr(self.user, 'key', None) or None
        await logout(self.consumer.scope)
        self.consumer.scope["session"].save()
        await database_sync_to_async(self.consumer.scope["session"].save)()
        self.consumer.user = self.consumer.scope["user"]
        if user_id:
            await self.unsubscribe(f'user.{user_id}')
        await self.reflect(None, event="sessionid")

    async def tunnel(self, stream, method, *args):
        binding = self.consumer.bindings_by_stream.get(stream)
        return await getattr(binding, method)(self, *args)

    async def switch(self, stream, method=None, *args):
        if method:
            binding = self.consumer.bindings_by_stream.get(stream)
            return await getattr(binding, method)(self, *args)

        else:
            return self.consumer.bindings_by_stream.get(stream)

    # TODO: Deprecated
    def get_binding(self, *args, **kwargs):
        return self.consumer.bindings_by_stream.get(stream)

    async def reflect(self, data, event=None):
        message = await encode_json({'event': event or self.event, 'data': data})
        await self.consumer.send(text_data=message)

    # Respond to the current streamed group attached sockets
    async def dispatch(self, data, stream, event=None):
        layer = self.consumer.channel_layer
        message = await encode_json(dict(
            event=event or self.event,
            data=data
        ))
        await layer.group_send(stream, dict(
            type='channel_message',
            message=message
        ))

    # Respond to all sockets
    async def broadcast(self, data, event=None):
        layer = self.consumer.channel_layer
        message = await encode_json(dict(
            event=event or self.event,
            data=data
        ))
        await layer.group_send('__all__', dict(
            type='channel_message',
            message=message
        ))

    # Respond to the current streamed group attached sockets
    async def subscribe(self, stream):
        await self.consumer.subscribe(stream)

    # Respond to the current streamed group attached sockets
    async def unsubscribe(self, stream):
        await self.consumer.unsubscribe(stream)
