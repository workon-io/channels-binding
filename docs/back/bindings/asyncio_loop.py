import asyncio
import random

from channels_binding.bindings import AsyncBinding, bind
from django.contrib.auth import authenticate


class HungerBinding(AsyncBinding):

    stream = 'hunger'

    @bind('food')
    async def food(self, request):
        request.user.has_feed = True

    @bind('sos')
    async def sos(self, request):
        if not getattr(request.user, 'hunger_started', None):
            life = 100
            request.user.hunger_started = True
            request.user.has_feed = False
            while (
                life > 0 and
                not request.user.has_feed
            ):
                life -= 5
                await request.reflect(dict(
                    life=life,
                    message=random.choice([
                        'Please Feed me',
                        'I\'m hungry',
                        'Please.. Help... Food...',
                        'Heeeeelp.. Feed me',
                        'Pleaaase, i will starving..'
                    ])
                ))
                await asyncio.sleep(2)

            if life <= 0:
                await request.reflect(dict(
                    life=0,
                    message='x_x couic'
                ))
                request.user.hunger_started = False
            else:
                await request.reflect(dict(
                    life=100,
                    message='Thanks ! but in 5 sec i will hunger again'
                ))
                await asyncio.sleep(5)
                await self.sos(request)
