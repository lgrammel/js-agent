#!/bin/sh

echo "Run gptagent.js executor container"
echo "Drive: `pwd`/drive"
echo ""

docker run -i -t -p 3001:3001 \
  --env PORT=3001 \
  --env HOST=0.0.0.0 \
  --env WORKSPACE=/home/service/repository \
  --volume "`pwd`/drive:/home/service/repository" \
  gptagent-javascript-developer:latest