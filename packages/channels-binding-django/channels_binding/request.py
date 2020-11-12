import datetime
import json
import logging

from django.conf import settings

from .bindings.registry import (registered_binding_classes,
                                registered_binding_events)
from .utils import encode_json

__all__ = ['AsyncRequest']

logger = logging.getLogger(__name__)


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

        events = registered_binding_events.get(self.pure_event, [])
        counter = 0
        for binding_class, method_name in events:
            binding = self.consumer.bindings_by_class.get(binding_class, None)
            if binding:
                await self.consumer.subscribe(binding.stream)  # TODO: auto unsubscribe or get subscribe from front
                method = getattr(binding, method_name)
                outdata = await method(self)
                if outdata:
                    await binding.reflect(method_name, outdata, uid=self.uid)
                counter += 1
        if not counter:
            logger.warning(f'No binding found for {self.event}')
            await self.consumer.lazy_send('error', f'No binding found for {self.event}')

    async def reflect(self, data, event=None):

        message = await encode_json({'event': event or self.event, 'data': data})
        await self.consumer.send(text_data=message)
