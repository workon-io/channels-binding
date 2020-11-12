from channels_binding.utils import bind
from django.forms import model_to_dict

__all__ = [
    'AsyncRetrieveModelBinding',
]


class AsyncRetrieveModelBinding(object):

    @bind('retrieve')
    async def retrieve(self, request):

        instance = await self.get_object(request, create=False)
        if isinstance(instance, list):
            retrieve_data = []
            for inst in instance:
                inst_data = await self.serialize_retrieve(request, inst)
                inst_data.update(id=inst.pk)
                retrieve_data.append(inst_data)
            await request.reflect(retrieve_data)

        else:
            retrieve_data = await self.serialize_retrieve(request, instance)
            retrieve_data.update(id=instance.pk)
            if hasattr(self, 'serialize_retrieve_extra'):
                retrieve_data.update(await self.serialize_retrieve_extra(request, instance))

            await request.reflect(retrieve_data)

    async def serialize_retrieve(self, request, instance):
        return model_to_dict(instance)
