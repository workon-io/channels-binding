import asyncio
import random

from app.worker import task
from asgiref.sync import async_to_sync
from channels_binding.utils import send
from django.core.cache import cache

LOCKER = f'task__{__name__}__locker'


@task
def high_frequency_realtime_data():
    return async_to_sync(high_frequency_realtime_data_async)()


async def high_frequency_realtime_data_async():

    cache.set(LOCKER, True, 10)
    while cache.get(LOCKER):
        value = 1
        send(f'high_frequency_realtime_data.data', dict(value=value), group='high_frequency_realtime_data')

        await asyncio.sleep(0.1)
        print(value)
