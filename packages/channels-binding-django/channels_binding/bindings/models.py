
__all__ = [
    'AsyncModelBinding',
]


class AsyncModelBinding(object):

    queryset = None
    model = None
    lookup_field = 'pk'
    data_pk = 'id'
    page_size = 25

    async def get_queryset(self, data):
        if not self.queryset:
            if self.model:
                return self.model.objects.all()
        else:
            return self.queryset.all()

    async def get_object(self, request, create=False):
        pk = request.uid or request.data.get(self.data_pk, None)
        try:
            if isinstance(pk, list):
                return list((await self.get_queryset(request)).filter(**{f'{self.data_pk}__in': pk}))
            else:
                return (await self.get_queryset(request)).get(**{self.data_pk: pk})
        except self.model.DoesNotExist as e:
            if create:
                return self.model()
            else:
                raise self.model.DoesNotExist(f'{self.stream} {self.data_pk}:{pk} Does Not Exist')
