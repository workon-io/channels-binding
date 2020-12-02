import logging
import os
import sys

import django
from channels.routing import get_default_application

logger = logging.getLogger(__name__)

app_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
sys.path.append(app_dir)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.conf.settings")
django.setup()
logger.warning(f'[DAPHNE] (asgi/http) Listening on {os.environ.get("PORT", "8000")}')
application = get_default_application()
