import json
import os

import requests
from app.models import User
from channels_binding.bindings import AsyncBinding, bind
from django.conf import settings
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

__all__ = [
    'UserBinding'
]


class UserBinding(AsyncBinding):

    stream = 'app.User'

    @bind('user')
    async def get_user(self, request):

        user = request.user
        return dict(
            is_authenticated=getattr(user, 'is_authenticated', False),
            is_staff=getattr(user, 'is_staff', False),
            is_superuser=getattr(user, 'is_superuser', False),
            username=getattr(user, 'username', None),
            email=getattr(user, 'email', None),
        )

    @bind('login')
    async def login(self, request):
        if request.user.is_authenticated:
            return dict(error='Already Authentificated')

        try:
            username = request.data.get("username")
            password = request.data.get("password")
            if settings.DEV_MODE and username in ['dev']:
                user, created = User.objects.get_or_create(username='dev', email='dev@dev', is_superuser=True, is_staff=True)
            else:
                user = authenticate(username=username, password=password)
            if user:
                await request.login(user)
                return dict(user=user.pk)
            else:
                return dict(error='Authentification failed (Invalid credentials)')
        except Exception as e:
            return dict(error=e)
