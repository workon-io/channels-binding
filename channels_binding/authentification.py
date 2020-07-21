

class DefaultDjangoUser(object):

    def get_user(self, consumer):
        return consumer.scope['user']
