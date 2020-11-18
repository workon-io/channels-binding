from app.worker import app as celery_app
from django.apps import AppConfig

__all__ = ['celery_app', 'default_app_config']
default_app_config = 'app.DefaultConfig'


class DefaultConfig(AppConfig):
    name = 'app'
    verbose_name = "Application"
