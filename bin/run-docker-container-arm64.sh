#!/bin/sh

echo "Run developer-ai container"
docker run -i -t -p 3001:3001 \
  --env PORT=3001 \
  --env HOST=0.0.0.0 \
  --env WORKSPACE=/home/service/repository \
  --volume "$1:/home/service/repository" \
  developer-ai-arm64:latest