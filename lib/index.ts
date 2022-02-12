import { launchEditor } from "./editor";
import { parseCSV } from "./parse";
import { CSVStore } from "./store";

export function csve(argv: NodeJS.Process["argv"]) {
  const store = CSVStore.instance;
  const targetFilePath = argv[2];

  try {
    if (!targetFilePath) throw new Error("Path is required.");
    parseCSV(targetFilePath, (data: CSVStore["csvData"]) => {
      store.csvData = data;
    });
    launchEditor(store)
  } catch (error) {
    console.error(error);
  }
}
