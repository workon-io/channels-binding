from channels_binding.utils import send_sync
from django.db.models.signals import post_save, post_delete, m2m_changed
from django.db.models.fields.related import ManyToManyField

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
    def m2m_changed(cls, sender, instance, action, reverse, model, pk_set, *args, **kwargs):
        if action.startswith('post'):
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

    @classmethod
    def connect_signals(cls, connected=True):
        if (
            cls.model and
            getattr(cls, 'post_save_connect', False) and
            hasattr(cls, 'post_save')
        ):
            if connected:
                post_save.connect(cls.post_save, sender=cls.model)
            else:
                post_save.disconnect(cls.post_save, sender=cls.model)
            for field in cls.model._meta.get_fields():
                if isinstance(field, ManyToManyField):
                    if connected:
                        m2m_changed.connect(cls.m2m_changed, sender=getattr(cls.model, field.name).through)
                    else:
                        m2m_changed.disconnect(cls.m2m_changed, sender=getattr(cls.model, field.name).through)

        if (
            cls.model and
            getattr(cls, 'post_delete_connect', False) and
            hasattr(cls, 'post_delete')
        ):
            if connected:
                post_delete.connect(cls.post_delete, sender=cls.model)
            else:
                post_delete.disconnect(cls.post_delete, sender=cls.model)

    @classmethod
    def disconnect_signals(cls):
        cls.connect_signals(connected=False)
