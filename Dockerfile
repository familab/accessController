FROM node:18-alpine
LABEL org.opencontainers.image.source = "https://github.com/familab/accessController"

RUN npm install --global pnpm

WORKDIR /home

COPY tsconfig.json ./
COPY api/package.json \
     api/tsconfig.json \
     api/tsconfig.build.json \
     api/
COPY api/src api/src

RUN cd api && \
    pnpm install && \
    pnpm run build

ENTRYPOINT node ./api/build/server.js
