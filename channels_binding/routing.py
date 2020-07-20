# from rest_framework import routers
from django.conf import settings
from django.http import HttpResponse
from django.urls import include, path, re_path
from django.conf.urls.static import static
from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter
from channels.sessions import SessionMiddlewareStack
from channels_binding.consumer import Consumer


application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': SessionMiddlewareStack(
        URLRouter([
            path('', Consumer, name="root"),
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
