import { parseCSV } from "./parse";
export function csve(argv: NodeJS.Process["argv"]) {
  const targetFilePath = argv[2];

  try {
    if (!targetFilePath) throw new Error("Path is required.");
    parseCSV(targetFilePath);
  } catch (error) {
    console.error(error);
  }
}
