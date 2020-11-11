import codecs
import datetime
import decimal
import json

from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer

try:
    from psycopg2.extras import NumericRange
except ImportError as e:
    NumericRange = None

__all__ = [
    'send',
    'send_sync',
    'encode_json',
    'bind',
    'db_sync',
    'sync',
    'JSONEncoder',
]


async def encode_json(message):
    return json.dumps(message, cls=JSONEncoder)


def get_binding(stream):
    from .bindings.registry import registered_lazy_binding_by_stream
    return registered_lazy_binding_by_stream.get(stream)


async def send(event, data, stream=None, uid=None, group=None, user=None, consumer=None, binding=None):
    # Send a event message
    if binding:
        layer = binding.consumer.channel_layer
    elif consumer:
        layer = consumer.channel_layer
    else:
        layer = get_channel_layer()  # TODO: cache it !
    if not stream and binding:
        stream = binding.stream
    if stream:
        event = f'{stream}.{event}'
    if uid:
        event = f'{event}#{uid}'
    message = await encode_json({'event': event, 'data': data})
    # print('----=> SEND', event, group)

    # Dispatch or group == __all__ to broadcast
    if group:
        # Self to a specific group
        await layer.group_send(
            group,
            {'type': 'channel_message', 'message': message}
        )

    # Private
    elif user:
        # Self to a specific user
        await layer.group_send(
            f'user.{user.id}',
            {'type': 'channel_message', 'message': message}
        )

    # Reflect to the current binding
    elif binding:
        # Self to current thread ~= the connected user
        await binding.consumer.send(text_data=message)

    # Reflect to the current consumer
    elif consumer:
        # Self to current thread ~= the connected user
        await consumer.send(text_data=message)

    # Reflect to the current consumer
    else:
        # Self to current thread ~= the connected user
        await layer.group_send(
            '__all__',
            {'type': 'channel_message', 'message': message}
        )


def send_sync(*args, **kwargs):
    async_to_sync(send)(*args, **kwargs)


def bind(*args, **kwargs):
    """
    Used to mark a method on a Binding that should be binded for event receive.
    """
    def decorator(func):
        func.is_bind = True
        func.args = args
        func.kwargs = kwargs
        return func
    return decorator


class DbSync():
    """
    Usage : with db_sync:
    """

    @database_sync_to_async
    def __enter__(self):
        return {}

    @database_sync_to_async
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

    @async_to_sync
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
            try:
                return obj.decode('utf-8')
            except UnicodeDecodeError:
                try:
                    return obj.decode('latin-1')
                except UnicodeDecodeError:
                    return obj.decode('cp1250')
        elif isinstance(obj, memoryview):
            return obj.tobytes().decode('utf-8')
        elif NumericRange and isinstance(obj, NumericRange):
            return [obj.lower, obj.upper]
        elif isinstance(obj, decimal.Decimal):
            return float(obj)
        try:
            return super().default(obj)
        except TypeError:
            return str(obj)
