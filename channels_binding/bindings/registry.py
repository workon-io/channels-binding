__all__ = [
    'RegisteredBindingMetaClass',
    'registered_binding_classes',
    'registered_binding_events',
]


registered_binding_classes = set()
registered_binding_events = dict()


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

            for method_name in dir(binding_class):
                method = getattr(binding_class, method_name)
                is_bind = getattr(method, 'is_bind', False)
                if is_bind:
                    kwargs = getattr(method, 'kwargs', {})
                    name = kwargs.get('name', method_name) or method_name
                    event = f'{stream}.{name}'
                    events = registered_binding_events.setdefault(event, [])
                    events.append([binding_class, method_name])

            if stream:
                registered_binding_classes.add(binding_class)
                print(f'\033[40;92m\033[1m[Bindings registered]\033[0m \033[40;92m{stream} ({binding_class})\033[0m')
        return binding_class
