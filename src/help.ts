import { readFile } from "node:fs/promises";

export default async function showHelp() {
  const helpFileURL = new URL("../assets//help.txt", import.meta.url);
  const helpText = await readFile(helpFileURL, "utf-8");
  console.log(helpText);
}
