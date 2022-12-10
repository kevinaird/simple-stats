FROM node:14.21-alpine3.15

RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json /app/

RUN npm ci --only=production && \
    npm cache clean --force

COPY . /app/

USER root

ENTRYPOINT [ "node", "bin/index.js" ]