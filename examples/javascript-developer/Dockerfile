FROM node:lts-alpine

# Install dumb-init. Used to enable response to SIGTERM and SIGINT.
RUN apk update && apk add dumb-init && apk add git && apk add ca-certificates

RUN npm install -g npm@9.6.2

# PROJECT SPECIFIC INSTALLS
# Specific to js-agent example. Adjust to fit your own project:
# RUN npm install -g pnpm
# RUN apk add python3 && apk add build-base

# Security: Run as non-root user.
USER node

WORKDIR /home/service

COPY --chown=node:node .build/gptagent-executor.js /home/service
COPY --chown=node:node ./node_modules/@dqbd /home/service/node_modules/@dqbd

WORKDIR /home/service/repository

# Use dumb-init to enable response to SIGTERM and SIGINT.
CMD ["dumb-init", "node", "../gptagent-executor.js"]