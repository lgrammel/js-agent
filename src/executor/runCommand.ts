import { exec } from "child_process";

export function runCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      resolve(`StdOut
${stdout}

StdErr
${stderr}
`);
    });
  });
}
