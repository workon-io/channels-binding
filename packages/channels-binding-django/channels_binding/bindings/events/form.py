from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from channels_binding import settings as self_settings
from channels_binding.utils import bind, db_sync, send, send_sync, sync
from django.forms import ChoiceField, ModelChoiceField, modelform_factory

__all__ = [
    'AsyncFormModelBinding',
]


@database_sync_to_async
def async_form_data(bind, data):
    bind.form = bind.get_form(data)
    if 'submit' in data:
        if bind.form_is_valid(bind.form, data):
            bind.save_form(bind.form, data)
    form_data = bind.serialize_form(bind.form, data)
    form_data.update(id=bind.form.instance.pk)
    return form_data


class AsyncFormModelBinding(object):

    post_save_connect = False
    form_class = None
    form_fields = None

    @bind('form')
    async def receive_form(self, data, *args, **kwargs):
        await self.reflect('form', await async_form_data(self, data), *args, **kwargs)
        if not self.form.errors and not getattr(self, 'post_save_connect', False) is True:
            await self.dispatch('retrieve', await self.serialize_retrieve(self.form.instance, data), *args, **kwargs)

    async def get_form_fields(self, data):
        if not self.form_fields:
            return [field.name for field in self.model._meta.get_fields() if field.editable] if self.model else []
        else:
            return self.form_fields

    async def get_form_kwargs(self, instance, data):
        # args = [
        #     data.get('submit', None),
        # ]
        kwargs = dict(
            instance=instance
        )
        return kwargs

    async def get_form(self, data, **kwargs):
        instance = await self.get_object(data, create=kwargs.get('create', True))
        fields = await self.get_form_fields(data)
        kwargs = await self.get_form_kwargs(instance, data)
        # for name in fields:
        #     if name not in data:
        #         data[name] = getattr(instance, name, None)
        if self.model and not self.form_class:
            form = modelform_factory(self.model, fields=fields)(
                data.get('submit', None),
                **kwargs
            )
        else:
            form = self.form_class(
                data.get('submit', None),
                **kwargs
            )
        return form

    async def form_is_valid(self, form, data):
        return form.is_valid()

    async def save_form(self, form, data):
        return form.save()

    async def serialize_form(self, form, data):
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
                field_data['event'] = f'{model_field._meta.app_label}.{model_field._meta.object_name}'

            elif isinstance(field.field, ChoiceField):
                field_data['choices'] = field.field.choices
            fields.append(field_data)

        return dict(
            errors=form.errors or None,
            success=not form.errors if 'submit' in data else None,
            object=self.serialize_retrieve(form.instance, data),
            fields=fields
        )
