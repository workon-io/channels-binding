import datetime
import json
import logging
import traceback

from channels.auth import login
from channels.db import database_sync_to_async

from .bindings.registry import registered_binding_events
from .utils import encode_json

logger = logging.getLogger(__name__)
__all__ = ['AsyncRequest']


class AsyncRequest:

    def __init__(self, consumer, text_data):

        self.consumer = consumer
        self.user = consumer.user

        payload = json.loads(text_data)
        self.event = payload.get('event', 'error')
        self.data = payload.get('data', {})
        event_uid = self.event.split('#', 1)
        self.pure_event = event_uid[0].strip()
        self.uid = event_uid[-1].strip() if len(event_uid) == 2 else None
        self.today = datetime.date.today()
        if not isinstance(self.data, (list, dict)):
            self.data = {}

    async def apply(self):

        try:
            events = registered_binding_events.get(self.pure_event, [])
            counter = 0
            for binding_class, method_name, name in events:
                binding = self.consumer.bindings_by_class.get(binding_class, None)
                if binding:
                    await self.consumer.subscribe(binding.stream)  # TODO: auto unsubscribe or get subscribe from front
                    method = getattr(binding, method_name)
                    outdata = await method(self)
                    if outdata:
                        await self.reflect(outdata)
                    counter += 1
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
        self.user = user
        self.consumer.user = self.user
        await login(self.consumer.scope, self.user, backend=None)
        await database_sync_to_async(self.consumer.scope["session"].save)()
        self.consumer.scope["user"] = user
        return user

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
    async def dispatch(self, *args, **kwargs):
        await self.send(*args, group=kwargs.get('stream', self.stream), **kwargs)

    # Respond to all sockets
    async def broadcast(self, *args, **kwargs):
        await self.send(*args, group='__all__', **kwargs)

    # Respond to the current streamed group attached sockets
    async def subscribe(self, group=None):
        if self.consumer:
            await self.consumer.subscribe(group or self.stream)

    # Respond to the current streamed group attached sockets
    async def unsubscribe(self, group=None):
        if self.consumer:
            await self.consumer.unsubscribe(group or self.stream)
