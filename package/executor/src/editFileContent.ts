import { promises as fs } from "fs";
import { join } from "path";

export async function editFileContent(
  workspaceFolder: string,
  filepath: string,
  content: string
) {
  const fullPath = join(workspaceFolder, filepath);
  await fs.writeFile(fullPath, content);
}
