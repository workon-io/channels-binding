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
    description="a RESTful API Streaming system over django channels, with model binding automations",
    license="MIT",
    keywords="channels api binding stream models json bindings framework websocket restframework django",
    url="https://github.com/workon-io/channels-binding",
    # packages=['tests'],
    long_description=read('README.rst'),
    packages=setuptools.find_packages(exclude=EXCLUDE_FROM_PACKAGES),
    include_package_data=True,
    install_requires=[
        'Django>=1.8',
        'channels>=2.0.0',
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
