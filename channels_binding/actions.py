def bindable(name=None, **kwargs):
    """
    Used to mark a method on a ResourceBinding that should be routed for detail actions.
    """
    def decorator(func):
        func.name = name
        func.is_bind = True
        func.kwargs = kwargs
        return func
    return decorator


class AsyncRetrieveModelBinding(object):

    @bindable('retrieve')
    async def retrieve(self, data):
        instance = await database_sync_to_async(self.get_object)(data)
        data = await database_sync_to_async(self.serialize)(instance, data)
        await self.send(f'{self.stream}.retrieve', data)
