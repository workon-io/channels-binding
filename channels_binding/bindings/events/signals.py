from channels_binding.utils import send_sync

__all__ = [
    'AsyncSignalsModelBinding',
]


class AsyncSignalsModelBinding(object):

    post_save_connect = True
    post_delete_connect = True

    @classmethod
    def post_save(cls, sender, instance, created, *args, **kwargs):
        bind = cls._lazy
        retrieve_data = bind.serialize_retrieve(instance, dict())
        retrieve_data.update(id=instance.pk)
        if hasattr(bind, 'serialize_retrieve_extra'):
            retrieve_data.update(bind.serialize_retrieve_extra(bind, instance, data))
        send_sync('retrieve', retrieve_data, stream=bind.stream, group=bind.stream)

    @classmethod
    def post_delete(cls, sender, instance, *args, **kwargs):
        bind = cls._lazy
        delete_data = {'success': True, 'id': instance.pk}
        send_sync('delete', delete_data, stream=bind.stream, group=bind.stream)
