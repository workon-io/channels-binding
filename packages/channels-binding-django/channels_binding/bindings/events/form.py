from channels_binding.utils import bind
from django.forms import ChoiceField, ModelChoiceField, modelform_factory

__all__ = [
    'AsyncFormModelBinding',
]


class AsyncFormModelBinding(object):

    post_save_connect = False
    form_class = None
    form_fields = None

    @bind('form')
    async def receive_form(self, request):

        self.form = await self.get_form(request)
        if 'submit' in request.data:
            if await self.form_is_valid(request, self.form):
                await self.save_form(request, self.form)
        form_data = await self.serialize_form(request, self.form)
        form_data.update(id=self.form.instance.pk)
        await request.reflect(form_data)

        # if not self.form.errors and not getattr(self, 'post_save_connect', False) is True:
        #     await self.dispatch('retrieve', await self.serialize_retrieve(self.form.instance, data), *args, **kwargs)

    async def get_form_fields(self, request):
        if not self.form_fields:
            return [field.name for field in self.model._meta.get_fields() if field.editable] if self.model else []
        else:
            return self.form_fields

    async def get_form_kwargs(self, request, instance):
        # args = [
        #     data.get('submit', None),
        # ]
        kwargs = dict(
            instance=instance
        )
        return kwargs

    async def get_form(self, request, **kwargs):
        instance = await self.get_object(request, create=kwargs.get('create', True))
        fields = await self.get_form_fields(request)
        kwargs = await self.get_form_kwargs(request, instance)
        data = request.data.get('submit', None)
        form_class = modelform_factory(self.model, fields=fields) if self.model and not self.form_class else self.form_class
        form = form_class(data, **kwargs)
        return form

    async def form_is_valid(self, request, form):
        return form.is_valid()

    async def save_form(self, request, form):
        return form.save()

    async def serialize_form(self, request, form):
        fields = []
        for field in form:
            type = str(field.field.__class__.__name__)
            field_data = dict(
                name=field.name,
                label=field.label,
                type=type,
                value=field.value(),
            )
            if isinstance(field.field, ModelChoiceField):
                model_field = field.field.queryset.model  # self.model._meta.get_field(field.name)
                field_data['stream'] = getattr(model_field, '_last_binding_stream', f'{model_field._meta.app_label}.{model_field._meta.object_name}')

            elif isinstance(field.field, ChoiceField):
                field_data['choices'] = field.field.choices
            fields.append(field_data)

        return dict(
            errors=form.errors or None,
            success=not form.errors if 'submit' in request.data else None,
            object=await self.serialize_retrieve(request, form.instance) if form.instance else None,
            fields=fields
        )
