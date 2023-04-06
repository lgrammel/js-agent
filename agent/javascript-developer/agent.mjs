import { runAgent } from "@gptagent/agent";

runAgent({
  name: "JavaScript Developer",
  role: `You are a software developer that creates and modifies JavaScript programs.
You are working in a Linux environment.
You have access to a GitHub repository (current folder).`,
});
