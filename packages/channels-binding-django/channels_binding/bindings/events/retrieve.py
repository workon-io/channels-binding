from channels_binding.utils import bind
from django.forms import model_to_dict

__all__ = [
    'AsyncRetrieveModelBinding',
]


class AsyncRetrieveModelBinding(object):

    @bind('retrieve')
    async def retrieve(self, data, *args, instance=None, **kwargs):

        instance = instance or await self.get_object(data, create=False)
        if isinstance(instance, list):
            retrieve_data = []
            for inst in instance:
                inst_data = await self.serialize_retrieve(inst, data)
                inst_data.update(id=inst.pk)
                retrieve_data.append(inst_data)
        else:
            retrieve_data = await self.serialize_retrieve(instance, data)
            retrieve_data.update(id=instance.pk)
            if hasattr(self, 'serialize_retrieve_extra'):
                retrieve_data.update(await self.serialize_retrieve_extra(instance, data))

        await self.reflect('retrieve', retrieve_data, *args, **kwargs)

    async def serialize_retrieve(self, instance, data):
        return model_to_dict(instance)
