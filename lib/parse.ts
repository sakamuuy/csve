import * as fs from "fs";
import { CSVStore } from "./store";
import { DEFAULT_DELIMITER, getNewlineCharacterReg } from "./token";

function parseCSV(dataStr: string): string[][] {
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
      data = parseCSV(chunk);
    } else {
      data = parseCSV(chunk.toString());
    }
    // TODO: Handle that if the header size is learger than chunk.
    const header = data.shift()
    onData({
      header: header?? [],
      body: data
    });
  });

  rs.on("end", () => {
  });

  return rs;
}

export function parse(
  filePath: string,
  onData: (data: CSVStore["csvData"]) => void
) {
  const rs = createTargetReadStream(filePath, onData);
}
