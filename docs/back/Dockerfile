FROM python:3.9.0-buster

LABEL "name"="channels-binding"
LABEL "version"="1.0"
LABEL "description"=""
LABEL "author"="Damien Autrusseau (autrusseau.damien@gmail.com)"

ENV PATH /usr/local/bin:$PATH
ENV LANG C.UTF-8
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONPATH "${PYTONPATH}:/app"

RUN set -xe \
    && packages=' \
    ca-certificates \
    ' \
    && buildPackages=' \
    ' \
    && apt-get -qq -y update \
    && apt-get install -y $packages \
    && apt-get install -y $buildPackages --no-install-recommends \
    && apt-get -qq -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


# HEAVY INSTALLS
RUN set -xe \
    && packages=' \
    cffi==1.14.0 \
    psycopg2==2.8.6 \
    requests==2.24.0 \
    PyYAML==5.3.1 \
    watchdog==0.10.3 \
    argh==0.26.2 \
    asgiref==3.2.10 \
    Pillow==7.1.1 \
    daphne==2.5.0 \
    dpath==2.0.1 \
    celery==5.0.2 \
    premailer==3.7.0 \
    hiredis==1.1.0 \
    eventlet==0.29.1 \
    gevent==20.9.0 \
    python-dateutil==2.8.1 \
    ' \
    && pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org --no-cache-dir --upgrade pip \
    && pip --no-cache-dir install --trusted-host pypi.org --trusted-host files.pythonhosted.org $packages 

# DJANGO INSTALLS
RUN set -xe \
    && packages=' \
    django==3.1.2 \
    django-redis==4.12.1 \
    django-cors-headers==3.2.0 \
    channels==2.4.0 \
    channels-redis==3.2.0 \
    channels-binding==1.8.8 \
    ' \
    && pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org --no-cache-dir $packages 


WORKDIR /app
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]