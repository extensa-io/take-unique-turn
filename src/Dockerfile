FROM node:22-slim as install
WORKDIR /src

COPY ./src/ ./
COPY ./src/package.json ./src/yarn.* yarn.* ./

FROM install as build
WORKDIR /src
RUN yarn install
RUN yarn run build

ENTRYPOINT ["yarn", "dev-server:start"]
