from django.apps import AppConfig

__all__ = ['default_app_config']
default_app_config = 'app.DefaultConfig'


class DefaultConfig(AppConfig):
    name = 'app'
    verbose_name = "Application"
