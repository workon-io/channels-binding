#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.conf.settings')
app_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
sys.path.append(app_dir)

if __name__ == '__main__':
    """Run administrative tasks."""
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)
