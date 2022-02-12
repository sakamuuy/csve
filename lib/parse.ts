import * as fs from "fs";

function csv2Array(dataStr: string): string[][] {
  return [[]]
}

function createTargetReadStream(filePath: string) {
  const rs = fs.createReadStream(filePath, 'utf-8');

  rs.on("data", (chunk) => {
    console.log(chunk);
    let data: string[][]
    if (typeof chunk === 'string') {
      data = csv2Array(chunk)
    } else {
      data = csv2Array(chunk.toString())
    }
    console.log('after parse', data)
  });

  rs.on("end", () => {
    console.log("end");
  });

  return rs;
}

export function parseCSV(filePath: string) {
  const rs = createTargetReadStream(filePath);
}
