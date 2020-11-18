import random

from channels_binding.bindings import AsyncBinding, bind
from django.core.cache import cache

__all__ = [
    'NetworkBinding',
]


class NetworkBinding(AsyncBinding):

    stream = 'app.Network'

    @bind('infos')
    async def infos(self, request):

        connections = cache.get('app.Network.connections', None)
        if connections is None:
            connections = random.randint(50, 160)
        connections = min(160, max(50, connections - random.randint(-1, 1)))

        cache.set('app.Network.connections', connections)

        quality = cache.get('app.Network.quality', None)
        if quality is None:
            quality = random.randint(20, 100) / 100

        quality = min(0.95, max(0.13, quality - (random.randint(-5, 5) / 100)))
        cache.set('app.Network.quality', quality)

        await request.reflect(dict(
            connections=connections,
            quality=quality
        ))
