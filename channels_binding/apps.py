import glob
import os
import importlib.util
from django.apps import AppConfig
from django.utils.module_loading import autodiscover_modules, module_has_submodule
from importlib import import_module
from importlib.util import find_spec as importlib_find


class AppConfig(AppConfig):
    name = 'channels_binding'
    verbose_name = "Channels Binding"

    def ready(self):

        from django.apps import apps
        module_to_search = 'bindings'
        autodiscover_modules(module_to_search)
        # autodiscover bindings
        for app_config in apps.get_app_configs():
            try:
                module = import_module('%s.%s' % (app_config.name, module_to_search))
                try:
                    package_name = module.__name__
                    package_path = module.__path__[0]
                    for file in glob.glob(os.path.join(package_path, '*.py')):
                        filename = os.path.basename(file)
                        try:
                            module = import_module('%s.%s.%s' % (app_config.name, module_to_search, filename))
                        except Exception as e:
                            pass
                except AttributeError as e:
                    print(e)
            except ModuleNotFoundError as e:
                pass
            except Exception as e:
                print(e)

        # for base_start, pattern, base_stop in [
        #     ['app.bindings', os.path.join(os.path.dirname(__file__), '../bindings/*.py'), ''],
        #     ['apps', os.path.join(os.path.dirname(__file__), '../apps/*/bindings.py'), 'bindings']
        # ]:
        #     # Dynamicaly loads of all consumer bindings
        #     for file in glob.glob(pattern):
        #         file = os.path.abspath(file)
        #         spec = importlib.util.spec_from_file_location('.'.join([o for o in [base_start, os.path.basename(file), base_stop] if o]), file)
        #         module = importlib.util.module_from_spec(spec)
        #         spec.loader.exec_module(module)
