

class DefaultDjangoUser(object):

    async def get_user(self, consumer):
        return consumer.scope['user']
