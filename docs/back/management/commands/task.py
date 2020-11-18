import logging

from django.core.management.base import BaseCommand
from django.utils.module_loading import import_string

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = """Little help to describe the command
        \n  usage:   de manage.py engineering_compare"""

    def add_arguments(self, parser):
        parser.add_argument('task', nargs='+', type=str)

    def handle(self, *args, **options):

        task_name = options.get('task')[0]
        try:
            print(f'app.tasks.{task_name}.task')
            task = import_string(f'app.tasks.{task_name}.task')
            logger.info(f'Task found: {task_name}')
            task()
        except ImportError as e:
            logger.error(f'Task not found: {task_name} ({str(e)})')
