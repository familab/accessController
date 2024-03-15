FROM node:18-alpine as base
LABEL org.opencontainers.image.source = "https://github.com/familab/accessController"


FROM base as build_api
# Build API

RUN npm install --global pnpm

WORKDIR /build
COPY package.json \
     tsconfig.json \
     pnpm-workspace.yaml \
     ./

WORKDIR /build/api
COPY api/package.json \
     api/tsconfig.json \
     api/tsconfig.build.json \
     ./
COPY api/src src/

RUN pnpm install
RUN pnpm run build
RUN pnpm \
    --filter=@familab/access-controller.api \
    --prod \
    deploy deployment


FROM base

COPY --from=build_api /build/api/deployment ./

ENTRYPOINT node ./build/server.js
