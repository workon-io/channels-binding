FROM node:15.0.0-buster

LABEL "name"="wabtec/component.front"
LABEL "version"="1.0"
LABEL "description"="Wabtec Component API /WS"
LABEL "author"="Damien Autrusseau (autrusseau.damien.ext@wabtec.com)"

COPY package.json *yarn* ./
RUN yarn --modules-folder /node_modules/ --network-timeout 100000
ENV PATH /node_modules/.bin:$PATH
WORKDIR /app
CMD ["yarn", "run", "release"]