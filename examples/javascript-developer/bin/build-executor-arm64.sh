#!/bin/bash

# needs to be run from parent directory

if [ "$(uname -m)" != "aarch64" ]; then
  echo "Error: This script must be run on an ARM64 environment."
  exit 1
fi

rm -f .build/gptagent-executor.js
mkdir -p .build
npx esbuild executor.mjs --bundle --platform=node --outfile=.build/gptagent-executor.js
docker build --platform linux/arm64 -t gptagent-javascript-developer-arm64 .