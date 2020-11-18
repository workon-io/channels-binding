import asyncio
import time

from channels_binding.bindings import AsyncBinding, bind


class SimpleReflexionBinding(AsyncBinding):

    stream = 'simple_reflexion'

    @bind('ping')
    async def pong(self, request):
        await asyncio.sleep(2)
        await request.reflect(dict(
            pong=True,
            time=time.time(),
            message='Hi'
        ))
