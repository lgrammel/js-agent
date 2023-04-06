FROM node:19.8.1-alpine

# Install dumb-init. Used to enable response to SIGTERM and SIGINT.
RUN apk update && apk add dumb-init

RUN npm install -g npm@9.6.2

# Security: Run as non-root user.
USER node

WORKDIR /home/service

COPY --chown=node:node .build/gptagent-executor.js /home/service

WORKDIR /home/service/repository

# Use dumb-init to enable response to SIGTERM and SIGINT.
CMD ["dumb-init", "node", "../gptagent-executor.js"]