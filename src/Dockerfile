FROM node:22-slim as install
WORKDIR /src

COPY ./src/ ./
COPY ./src/package.json ./src/yarn.* ./src/.npmrc yarn.* ./

FROM install as build
WORKDIR /src
RUN yarn install
