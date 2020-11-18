#!/bin/sh
pkill -f "celery";
ps -aux;
celery --app=worker:app purge  -f;
celery --app=worker:app beat -s /opt/celerybeat-schedule --loglevel=info --detach;
celery --app=worker:app worker  --loglevel=info ;
ps -aux;
#celery --app=worker:app beat -s /tmp/celerybeat-schedule --pidfile=/tmp/celerybeat.pid --loglevel=info &
#celery --app=worker:app worker --max-tasks-per-child=5 --max-memory-per-child=1000 --loglevel=info 
#celery --app=worker:app worker --pool=gevent --concurreny=500 --loglevel=info 
# celery -A app.conf.celery beat --scheduler django_celery_beat.schedulers:DatabaseScheduler --pidfile=~/celerybeat.pid -l info
