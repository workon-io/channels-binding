import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.sessions import SessionMiddlewareStack
from channels_binding.consumers import AsyncConsumer
from django.http import HttpResponse
from django.urls import re_path

PUBLIC_PATH = os.environ.get('PUBLIC_PATH').strip('/')
PUBLIC_WS_PATH = os.environ.get('PUBLIC_WS_PATH').strip('/')

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': SessionMiddlewareStack(AuthMiddlewareStack(
        URLRouter([
            re_path(rf'^{PUBLIC_WS_PATH}/?$', AsyncConsumer, name="root"),
        ])
    ))
})

urlpatterns = [
    re_path(rf"^{PUBLIC_WS_PATH}/?$", lambda request: HttpResponse(f"[OK] WSAPI COMPONENT")),

]
