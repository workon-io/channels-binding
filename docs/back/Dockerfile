FROM python:3.9.0b3-alpine3.12

ENV PYTHONUNBUFFERED 1

LABEL "name"="channels_binding.docs.back"
LABEL "version"="1.0"
LABEL "description"="Channels binding docs back"
LABEL "author"="Damien Autrusseau (autrusseau.damien@gmail.com)"

RUN set -xe \
    && packages=' \
    postgresql-libs \
    ca-certificates \
    ' \
    && buildPackages=' \
    gcc \
    musl-dev \
    postgresql-dev \
    libffi-dev \
    ' \
    && apk add --no-cache $packages \
    && apk add --no-cache --virtual .build-deps $buildPackages


# !!!!!!!!!!!!! TEMP
RUN echo '@testing http://nl.alpinelinux.org/alpine/edge/testing' >> /etc/apk/repositories && \
    apk add --update --no-cache bzip2 curl freetds-dev gawk git sqlite-dev libzip-dev make patch unzip wget
RUN echo '@testing http://nl.alpinelinux.org/alpine/edge/community' >> /etc/apk/repositories && \
    apk add --update --no-cache sbcl@testing --force-broken-world
RUN git clone https://github.com/dimitri/pgloader.git /opt/src/pgloader
RUN mkdir -p /opt/src/pgloader/build/bin \
    && cd /opt/src/pgloader \
    && make
RUN ln -s /opt/src/pgloader/build/bin/pgloader /usr/bin/pgloader
# !!!!!!!!!!!!! TEMP


RUN set -xe \
    && packages=' \
    cffi==1.14.0 \
    psycopg2==2.8.5 \
    pytz==2020.1 \
    redis==3.2.1 \
    requests==2.24.0 \
    watchdog==0.10.3 \
    asgiref==3.2.10 \
    daphne==2.5.0 \
    ' \
    && pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org --no-cache-dir --upgrade pip \
    && pip --no-cache-dir install --trusted-host pypi.org --trusted-host files.pythonhosted.org $packages 

RUN set -xe \
    && django_packages=' \
    django==3.0.7 \
    django-redis==4.12.1 \
    channels==2.4.0 \
    channels_redis==2.4.2 \
    channels-binding==1.1.5 \
    ' \
    && pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org --no-cache-dir $django_packages 


RUN apk --purge del .build-deps --force-broken-world

WORKDIR /app
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]