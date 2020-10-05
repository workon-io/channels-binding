# from rest_framework import routers
from channels.routing import ChannelNameRouter, ProtocolTypeRouter, URLRouter
from channels.sessions import SessionMiddlewareStack
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from django.urls import include, path, re_path

from .consumers import AsyncConsumer

async_root_application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': SessionMiddlewareStack(
        URLRouter([
            path('', AsyncConsumer, name="root"),
        ])
    )
})


# router = routers.DefaultRouter()
# router.registry.extend(test_router.registry)

# urlpatterns = [
#     # re_path(r"^$", lambda request: HttpResponse(f"[OK] WSAPI CLEARVERSION")
#     # ),
#     path(r'', include((router.urls, 'api'), namespace='api')),
#     path(r'api-auth/', include('rest_framework.urls')),
#     path(r'graphmodels/', graphmodels)
# ]
