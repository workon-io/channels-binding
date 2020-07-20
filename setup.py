import os
import sys
import setuptools

CURRENT_PYTHON = sys.version_info[:2]
REQUIRED_PYTHON = (3, 9)
EXCLUDE_FROM_PACKAGES = [
    'tests', 'build', 'dist',
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


version = __import__('channels_bind').__version__

setuptools.setup(
    name='channels_bind',
    version=version,
    # python_requires='>={}.{}'.format(*REQUIRED_PYTHON),
    author="Damien Autrusseau",
    author_email="damien.autrusseau@gmail.com",
    description=("Docker CLI that combine compose and machine for a full stack deployment"),
    license="Apache Software License",
    keywords="",
    url="https://pypi.org/project/docker-emperor",
    # packages=['tests'],
    long_description=read('README.rst'),
    packages=setuptools.find_packages(exclude=EXCLUDE_FROM_PACKAGES),
    include_package_data=True,
    install_requires=[
        'channels>=2.4.0',
    ],
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Programming Language :: Python",
        "Topic :: Utilities",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
    ],
    entry_points={
        'console_scripts': [
            'docker-emperor = docker_emperor.root:entrypoint',
            'de = docker_emperor.root:entrypoint',
        ],
    },
)
