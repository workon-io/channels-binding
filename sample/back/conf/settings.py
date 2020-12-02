import os
from urllib.parse import urlparse

os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SECRET_KEY = '4(v5**rxw*bwdldai8rcf)=d27oq)k7*@i(#n1u*2)kn2!(f)m'
DEBUG = bool(int(os.environ.get('DEBUG', '0')))
DEV_MODE = bool(int(os.environ.get('DEV_MODE', '0')))
STG_ROOT = os.environ.get('STG', '/stg/')
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True


INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'channels',
    'channels_binding',
    'app',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'conf.routing'
AUTH_USER_MODEL = 'app.User'

REDIS_URL = os.environ.get('REDIS_URL', 'redis://redis:6379')
REDIS = urlparse(REDIS_URL)

DATABASE_URL = os.environ.get('DATABASE_URL', f'postgres://postgres@postgres/postgres')
DATABASE = urlparse(DATABASE_URL)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'HOST': DATABASE.hostname,
        'NAME': DATABASE.path.strip('/'),
        'USER': DATABASE.username,
        'PASSWORD': DATABASE.password,
        'PORT': DATABASE.port,
        'CONN_MAX_AGE': None,
    },
}


ASGI_APPLICATION = 'conf.routing.application'
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'capacity': 1000,
            'expiry': 5,
            'hosts': [(REDIS.hostname, REDIS.port)],
        },
    },
}
CHANNELS_BINDING = {
    "DEFAULT_PAGE_SIZE": 25,
    "AUTO_CONNECT_MODEL_SIGNALS": True,
    "ANONYMOUS_CONNECTION_ALLOWED": True,
}

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": f"{REDIS_URL}/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "PICKLE_VERSION": -1  # Use the latest protocol version
        }
    },
}
