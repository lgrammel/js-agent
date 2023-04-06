import fs from "fs/promises";
import path from "path";

export async function readFileContent(
  workspaceFolder: string,
  filepath: string
) {
  try {
    const fullPath = path.join(workspaceFolder, filepath);
    return await fs.readFile(fullPath, "utf-8");
  } catch (error: any) {
    throw new Error(`Error reading file: ${error.message}`);
  }
}
