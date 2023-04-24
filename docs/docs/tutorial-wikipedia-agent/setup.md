---
sidebar_position: 1
title: Setup project
---

# Setup Project

## Pre-requisites

This tutorial assumed that you have Node.js (v18 or newer) installed.
You also need access to the OpenAI API.

## Create a new Node.js project

```bash
mkdir wikipedia-agent
cd wikipedia-agent
npm init -y
mkdir src
```

## Setup TypeScript

```bash
npm install --save-dev typescript ts-node @types/node
npx tsc --init --rootDir src --outDir .build
```

## Install JS Agent

```bash
npm install js-agent
```

At this point, you should have a basic Node.js project that has TypeScript and JS Agent installed.
