import json
from django.apps import AppConfig
# from celery import app as celery_app


__all__ = ['celery_app', 'default_app_config']
default_app_config = 'app.DefaultConfig'


class DefaultConfig(AppConfig):
    name = 'app'
    verbose_name = "Application"


class JSONEncoder(json.JSONEncoder):

    def default(self, obj):
        if hasattr(obj, '__json__'):
            return obj.__json__()
        return super().default(obj)
