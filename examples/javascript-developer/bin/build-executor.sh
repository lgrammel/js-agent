#!/bin/bash

# needs to be run from parent directory

rm -f .build/gptagent-executor.js
mkdir -p .build
npx esbuild executor.mjs --bundle --platform=node --loader:.node=file --outfile=.build/gptagent-executor.js

rm -rf ./node_modules/@dqbd
cp -a ../../node_modules/.pnpm/@dqbd+tiktoken@1.0.7/node_modules/@dqbd ./node_modules

PLATFORM=linux/amd64
if [[ $(uname -m) == "aarch64" ]]; then
    PLATFORM=linux/arm64
fi
docker build --platform "$PLATFORM" -t gptagent-javascript-developer .
