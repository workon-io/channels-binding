import os

from django.conf import settings
from django.utils.module_loading import import_string

# from rest_framework.settings import APISettings

DJANGO_ALLOW_ASYNC_UNSAFE = os.environ.get('DJANGO_ALLOW_ASYNC_UNSAFE')
if DJANGO_ALLOW_ASYNC_UNSAFE != "true":
    print('------- Automatic turns environ DJANGO_ALLOW_ASYNC_UNSAFE variable to "true" -------')
    os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

CHANNELS_BINDING = getattr(settings, 'CHANNELS_BINDING', {})
DEFAULT_CHANNELS_BINDING = {
    "AUTHENTIFICATION_CLASSES": (
        'channels_binding.authentification.DefaultDjangoUser',
    ),
    "DEFAULT_PAGE_SIZE": 25,
    "AUTO_CONNECT_MODEL_SIGNALS": True,
    "ANONYMOUS_CONNECTION_ALLOWED": True,
}


def get_default(name):
    return CHANNELS_BINDING.get(name, DEFAULT_CHANNELS_BINDING[name])


AUTHENTIFICATION_CLASSES = []
classes = get_default("AUTHENTIFICATION_CLASSES")
if not isinstance(classes, (list, tuple)):
    classes = [classes]
for string in classes:
    try:
        AUTHENTIFICATION_CLASSES.append(import_string(string))
    except ImportError as e:
        msg = "Could not import '%s' for Channels Bindings setting '%s': %s." % (string, e.__class__.__name__, e)
        raise ImportError(msg)

DEFAULT_PAGE_SIZE = get_default("DEFAULT_PAGE_SIZE")
ANONYMOUS_CONNECTION_ALLOWED = bool(get_default("ANONYMOUS_CONNECTION_ALLOWED"))
