#!/bin/sh

echo "Run js-agent executor container"
echo "Drive: `pwd`/drive"
echo ""

PLATFORM=linux/amd64
if [[ $(uname -m) == "aarch64" ]]; then
    PLATFORM=linux/arm64
fi

docker run -i -t -p 3001:3001 \
  --env PORT=3001 \
  --env HOST=0.0.0.0 \
  --env WORKSPACE=/home/service/repository \
  --volume "`pwd`/drive:/home/service/repository" \
  --platform "$PLATFORM" \
  gptagent-javascript-developer:latest
