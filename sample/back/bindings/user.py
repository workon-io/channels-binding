import random

from app.models import User
from channels_binding.bindings import AsyncBinding, bind
from django.conf import settings
from django.contrib.auth import authenticate
from django.db.models import Q

__all__ = [
    'UserBinding'
]


class UserBinding(AsyncBinding):

    stream = 'app.User'  # this the default value here, if you don't define stream
    model = User
    queryset = User.objects.all()
    form_fields = [
        'profiles'
    ]
    post_save_connect = True
    post_delete_connect = True

    async def serialize_retrieve(self, request, obj):
        return dict(
            **await self.serialize_search_row(request, obj)
        )

    async def serialize_search_row(self, request, obj):
        return dict(
            id=obj.pk,
            username=obj.username,
            first_name=obj.first_name,
            last_name=obj.last_name,
            is_authenticated=obj.is_authenticated,
            is_superuser=obj.is_superuser,
            email=obj.email,
            age=obj.age,
        )

    async def filter_queryset(self, request, qs, filters):

        query = (filters.get('query') or '').strip()
        if query:
            qs = qs.filter(
                Q(first_name__icontains=query) |
                Q(last_name__icontains=query) |
                Q(email__icontains=query) |
                Q(age__icontains=query)
            )
        return qs

    @bind('self')
    async def get_self(self, request):

        return await self.serialize_retrieve(request, request.user) if request.user.is_authenticated else dict(

        )

    @bind('randomize_age')
    async def randomize_age(self, request):
        user = await self.get_object(request)
        user.age = random.randint(10, 90)
        user.save()
        await request.reflect(dict(success=True))

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

    @bind('logout')
    async def logout(self, request):
        try:
            if request.user.is_authenticated:
                await request.logout()
                return dict(success=True)
        except Exception as e:
            return dict(error=e)
