FROM node:22-slim as install
WORKDIR /src

COPY ./server/node/src/ ./
COPY ./server/node/src/package.json ./server/node/src/tsconfig.json ./server/node/src/yarn.* ./

FROM install as build
WORKDIR /src
RUN yarn install
