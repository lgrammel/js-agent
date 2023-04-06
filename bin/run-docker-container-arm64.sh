#!/bin/sh

echo "Run gptagent.js executor container"
docker run -i -t -p 3001:3001 \
  --env PORT=3001 \
  --env HOST=0.0.0.0 \
  --env WORKSPACE=/home/service/repository \
  --volume "$1:/home/service/repository" \
  gptagent-arm64:latest