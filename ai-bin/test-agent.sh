#!/bin/sh

# Intended to be used by the AI agent (to produce better outputs).
# Needs to be invoked from root of the project.

cd packages/agent
pnpm vitest --no-color run .test.ts