import json
import decimal
import datetime
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
try:
    from psycopg2.extras import NumericRange
except ImportError as e:
    NumericRange = None

__all__ = [
    'bind',
    'db_sync',
    'sync',
    'JSONEncoder',
]


def bind(name=None, **kwargs):
    """
    Used to mark a method on a Binding that should be binded for event receive.
    """
    def decorator(func):
        func.name = name
        func.is_bind = True
        func.kwargs = kwargs
        return func
    return decorator


class DbSync():
    """
    Usage : with db_sync:
    """

    @database_sync_to_async
    def __enter__(self):
        return None

    def __exit__(self, type, value, traceback):
        # Exception handling here
        pass


db_sync = DbSync()


class Sync():
    """
    Usage : with sync:
    """

    @async_to_sync
    def __enter__(self):
        return None

    def __exit__(self, type, value, traceback):
        # Exception handling here
        pass


sync = Sync()


class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, '__json__'):
            return obj.__json__()
        elif isinstance(obj, datetime.datetime):
            return obj.isoformat()
        elif isinstance(obj, bytes):
            return obj.decode('utf-8')
        elif isinstance(obj, memoryview):
            return obj.tobytes().decode('utf-8')
        elif NumericRange and isinstance(obj, NumericRange):
            return [obj.lower, obj.upper]
        elif isinstance(obj, decimal.Decimal):
            return float(obj)
        return super().default(obj)
