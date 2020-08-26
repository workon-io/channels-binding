from rest_framework import routers
from django.conf import settings
from django.http import HttpResponse
from django.urls import include, path, re_path
from django.conf.urls.static import static
from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter
from channels.sessions import SessionMiddlewareStack
from channels_binding.consumers import AsyncConsumer


application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': SessionMiddlewareStack(
        URLRouter([
            path('', AsyncConsumer, name="root"),
        ])
    )
})

urlpatterns = [
    # re_path(r"^$", lambda request: HttpResponse(f"[OK] WSAPI CLEARVERSION")
    # ),
]
