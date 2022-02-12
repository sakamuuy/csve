import * as fs from "fs";
import { CSVStore } from "./store";
import { DEFAULT_DELIMITER, getNewlineCharacterReg } from "./token";

function csv2Array(dataStr: string): string[][] {
  // TODO: Handle line break in cell
  const rows = dataStr.split(getNewlineCharacterReg());
  return rows.map((row) => {
    // TODO: Handle DELIMITER in cell.
    return row.split(DEFAULT_DELIMITER);
  });
}

function createTargetReadStream(
  filePath: string,
  onData: (data: CSVStore["csvData"]) => void
) {
  const rs = fs.createReadStream(filePath, "utf-8");

  rs.on("data", (chunk) => {
    let data: string[][];
    if (typeof chunk === "string") {
      data = csv2Array(chunk);
    } else {
      data = csv2Array(chunk.toString());
    }
    onData(data);
  });

  rs.on("end", () => {
    console.log("end");
  });

  return rs;
}

export function parseCSV(
  filePath: string,
  onData: (data: CSVStore["csvData"]) => void
) {
  const rs = createTargetReadStream(filePath, onData);
}
