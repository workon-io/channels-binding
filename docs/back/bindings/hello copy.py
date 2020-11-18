import asyncio

from channels_binding.bindings import AsyncBinding, bind
from django.contrib.auth import authenticate


class HelloBinding(AsyncBinding):

    stream = 'hello'

    @bind('hello')
    async def hello(self, request):
        message = request.data.get('message')
        name = request.user.username
        await request.reflect('Hello {name}! you said me {message}')
        await request.dispatch('Hello everybody on "test" stream, {name} say me {message} !', self.stream)
        await request.broadcast('Hello everybody, {name} say me {message} !')
        await request.reflect('{name}, i will subscribe you to another stream binding')
        await request.subscribe('another.stream.binding')
        await request.dispatch('Hi again {name}, this is a message from this another stream binding', 'another.stream.binding')

    @bind('login')
    async def login(self, request):
        if request.user.is_authenticated:
            await request.reflect(dict(error='Already Authenticated'))
        else:
            user = authenticate(
                username=request.data.get("username"),
                password=request.data.get("password")
            )
        if user:
            await request.login(user)
            await request.reflect(dict(success='Authenticated'))
        else:
            await request.reflect(dict(error='Invalid credentials'))
