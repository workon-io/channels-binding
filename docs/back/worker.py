
import asyncio
import os
import sys

from asgiref.sync import async_to_sync
from celery import Celery
from celery.app.log import TaskFormatter
from celery.schedules import crontab
from celery.signals import after_setup_logger
from django.conf import settings

__all__ = ['app', 'task', 'async_task']

app_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../..')
sys.path.append(app_dir)


@after_setup_logger.connect
def setup_loggers(logger, *args, **kwargs):
    for handler in logger.handlers:
        # handler.setFormatter(TaskFormatter('%(asctime)s - %(task_id)s - %(task_name)s - %(name)s - %(levelname)s - %(message)s'))
        handler.setFormatter(TaskFormatter('%(message)s'))


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.conf.settings')
app = Celery(
    __name__,
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    accept_content=['application/json', 'json'],
    enable_utc=True,
    task_ignore_result=True,
    # task_always_eager=True
)
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
for file in os.listdir('tasks'):
    if file.startswith('__') or file.endswith('.pyc') or not file.endswith('.py'):
        continue
    file = file[:-3]
    name = os.path.basename(file)
    app.autodiscover_tasks([f'app.tasks.{name}.task'], related_name=file)

app.conf.beat_schedule = {
    'high_frequency_realtime_data': {
        'schedule': 5.0,
        'task': 'app.tasks.high_frequency_realtime_data.high_frequency_realtime_data',
    },
    # 'heartbeat': {
    #     'schedule': 1.0,
    #     'task': 'app.tasks.heartbeat.task',
    # },
    # 'control_scheduler': {
    #     'schedule': crontab(hour='*/1', minute=3),
    #     'task': 'app.tasks.control_scheduler.task',
    # },
}
app.conf.timezone = 'UTC'


task = app.task
# def task(wrapped):
#     return app.task(wrapped)


def async_task(async_def):
    wrapped = async_to_sync(async_def)
    wrapped.__name__ = async_def.__name__
    wrapped.__annotations__ = async_def.__annotations__
    return app.task(wrapped)


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
