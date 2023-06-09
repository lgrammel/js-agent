---
sidebar_position: 2
title: Create agent.ts
---

# Create agent.ts

`src/agent.ts` will contain the Wikipedia agent. To get started, add the following content:

```typescript
const task = process.argv.slice(2).join(" ");

runWikipediaAgent()
  .then(() => {})
  .catch((error) => {
    console.error(error);
  });

async function runWikipediaAgent() {
  console.log(task);
}
```

You can now run it with e.g.:

```bash
❯ npx ts-node src/agent.ts "how many people live in BC, Canada?"
```

At this point, it only outputs the task to the console.
