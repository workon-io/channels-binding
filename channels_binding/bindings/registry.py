from django.db.models.signals import post_save, post_delete

__all__ = [
    'RegisteredBindingMetaClass',
    'registered_binding_classes',
    'registered_binding_events',
]


registered_binding_classes = set()
registered_binding_events = dict()
registered_lazy_binding_by_stream = dict()


class RegisteredBindingMetaClass(type):
    def __new__(cls, clsname, superclasses, attributedict):
        binding_class = type.__new__(cls, clsname, superclasses, attributedict)
        if superclasses:
            stream = None
            if binding_class.stream:
                stream = binding_class.stream
            elif binding_class.model:
                stream = f'{binding_class.model._meta.app_label}.{binding_class.model._meta.object_name}'
            binding_class.stream = stream
            binding_class._registred_actions = {}
            binding_class._lazy = binding_class()
            binding_class._lazy_bindings_by_stream = registered_lazy_binding_by_stream
            binding_class._lazy_bindings_by_stream[stream] = binding_class._lazy

            if (
                binding_class.model and
                getattr(binding_class, 'post_save_connect', False) and
                hasattr(binding_class, 'post_save')
            ):
                post_save.connect(binding_class.post_save, sender=binding_class.model)

            if (
                binding_class.model and
                getattr(binding_class, 'post_delete_connect', False) and
                hasattr(binding_class, 'post_delete')
            ):
                post_delete.connect(binding_class.post_delete, sender=binding_class.model)

            for method_name in dir(binding_class):
                method = getattr(binding_class, method_name)
                is_bind = getattr(method, 'is_bind', False)
                if is_bind:
                    args = getattr(method, 'args', [])
                    kwargs = getattr(method, 'kwargs', {})
                    name = kwargs.get('name', args[0] if len(args) else method_name) or method_name
                    event = f'{stream}.{name}'
                    events = registered_binding_events.setdefault(event, [])
                    events.append([binding_class, method_name])

            if stream:
                registered_binding_classes.add(binding_class)
                print(f'\033[40;92m\033[1m[Bindings registered]\033[0m \033[40;92m{stream} ({binding_class})\033[0m')
        return binding_class
