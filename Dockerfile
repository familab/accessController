FROM node:6-slim

# Home directory for Node-RED application source code.
RUN mkdir -p /usr/src/app
COPY . /usr/src/app/

# User data directory, contains flows, config and nodes.
RUN mkdir /data

WORKDIR /usr/src/app

# Add node-red user so we aren't running as root.
RUN adduser --home /usr/src/app --disabled-login node-red \
    && chown -R node-red:node-red /data \
    && chown -R node-red:node-red /usr/src/app

USER node-red
RUN npm install

# User configuration directory volume
VOLUME ["/data"]
EXPOSE 8000

ENV FLOWS=flows.json USERDIR=/data

CMD ["npm", "start"]
