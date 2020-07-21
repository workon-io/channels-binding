from channels.db import database_sync_to_async

__all__ = [
    'db_sync'
]


class DbSync():

    @database_sync_to_async
    def __enter__(self):
        return None

    def __exit__(self, type, value, traceback):
        # Exception handling here
        pass


db_sync = DbSync()
