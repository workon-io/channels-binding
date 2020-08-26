FROM node:latest

LABEL "name"="channels_binding.docs.front"
LABEL "version"="1.0"
LABEL "description"="Channels binding docs front"
LABEL "author"="Damien Autrusseau (autrusseau.damien@gmail.com)"

COPY package.json *yarn* ./
RUN yarn --modules-folder /node_modules/ --network-timeout 100000
ENV PATH /node_modules/.bin:$PATH
WORKDIR /app
CMD ["yarn", "run", "runserver"]