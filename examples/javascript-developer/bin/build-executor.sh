#!/bin/bash

# needs to be run from parent directory

rm -f .build/gptagent-executor.js
mkdir -p .build
npx esbuild executor.mjs --bundle --platform=node --outfile=.build/gptagent-executor.js

if [[ $(uname -m) == "aarch64" ]]; then
docker build --platform linux/arm64 -t gptagent-javascript-developer .
else
docker build --platform linux/amd64 -t gptagent-javascript-developer .
fi
