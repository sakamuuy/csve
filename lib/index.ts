import { launchEditor } from "./editor";
import { parse } from "./parse";
import { CSVStore } from "./store";

export function csve(argv: NodeJS.Process["argv"]) {
  const store = CSVStore.instance;
  const targetFilePath = argv[2];

  try {
    if (!targetFilePath) throw new Error("Path is required.");
    parse(targetFilePath, (data: CSVStore["csvData"]) => {
      store.csvData = data;
    });
    launchEditor(store);
  } catch (error) {
    console.error(error);
  }
}
