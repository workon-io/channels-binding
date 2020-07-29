import os
import sys
import setuptools

CURRENT_PYTHON = sys.version_info[:2]
REQUIRED_PYTHON = (2, 7)
EXCLUDE_FROM_PACKAGES = [
    'build', 'dist',
]
if CURRENT_PYTHON < REQUIRED_PYTHON:
    sys.stderr.write("""
==========================
Unsupported Python version
==========================


This version of Django requires Python {}.{}, but you're trying to
install it on Python {}.{}.

""".format(*(REQUIRED_PYTHON + CURRENT_PYTHON)))
    sys.exit(1)


def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()


version = __import__('channels_binding').__version__

setuptools.setup(
    name='channels_binding',
    version=version,
    # python_requires='>={}.{}'.format(*REQUIRED_PYTHON),
    author="Damien Autrusseau",
    author_email="damien.autrusseau@gmail.com",
    description="Channels Binding exposes an JSON API streaming system over django channels, in very few code lines, with a very simple and verboseless exchange structure, where each django Models would be easily binded and come with native basics operations like 'retrieve', 'search', 'update', 'create', 'delete' and subscription We could made the comparaison with django restframework with the REST system.",
    license="MIT",
    keywords="channels api binding stream models json bindings framework websocket restframework django",
    url="https://github.com/workon-io/channels-binding",
    # packages=['tests'],
    long_description=read('README.rst'),
    packages=setuptools.find_packages(exclude=EXCLUDE_FROM_PACKAGES),
    include_package_data=True,
    install_requires=[
        'Django>=1.8',
        'channels>=2.1.3',
    ],
    classifiers=[
        "Development Status :: 3 - Alpha",
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        "Programming Language :: Python",
        "Topic :: Utilities",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
    ],
)
