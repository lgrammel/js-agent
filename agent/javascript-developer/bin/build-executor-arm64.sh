#!/bin/bash

# needs to be run from parent directory

rm -f .build/gptagent-executor.js
mkdir -p .build
npx esbuild executor.mjs --bundle --platform=node --outfile=.build/gptagent-executor.js
docker build --platform linux/arm64 -t gptagent-javascript-developer-arm64 .