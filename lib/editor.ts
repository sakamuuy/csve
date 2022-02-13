import * as readline from "readline";
import { CSVStore } from "./store";
import {
  DEFAULT_CELL_SIZE,
  EDITOR_CELL_DELIMITER,
  ELLIPSIS_CHARACTER,
  PADDING_CHARACTER,
} from "./token";

function paddingCell(text: string) {
  const count = ((str) => {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
      str[i].match(/[ -~]/) ? (len += 1) : (len += 2);
    }
    return len;
  })(text);

  const remain = DEFAULT_CELL_SIZE - count;
  if (remain > 0) {
    const padding = new Array(remain).join(PADDING_CHARACTER);
    return text + padding;
  }
  if (remain < 1) {
    const ellipsis = text.slice(0, DEFAULT_CELL_SIZE - 2) + ELLIPSIS_CHARACTER;
    return ellipsis;
  }
  return text;
}

function generateHeader(header: string[]) {
  const paddedHeader = header.map((h) => paddingCell(h));
  return paddedHeader.join(EDITOR_CELL_DELIMITER);
}

function generateBody(body: string[][]) {
  const separatedRows = body.map((row) => {
    const paddedRow = row.map((c) => paddingCell(c));
    return paddedRow.join(EDITOR_CELL_DELIMITER);
  });
  return separatedRows.join("\n");
}

function listenKeyEvent(editor: Editor) {
  const mapProcessToKey = (key: Buffer) => {
    // 
    switch (key.toString()) {
      case "c":
        editor.kill();
        break;

      case "h":
        editor.moveToLeft();
        break;

      case "k":
        editor.moveToAbove();
        break;

      case "j":
        editor.moveToBelow();
        break;

      case "l":
        editor.moveToRight();
        break;

      default:
        break;
    }
  }
  process.stdin.on("data", mapProcessToKey);
}

function makeRawMode() {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
}

class Editor {
  private static _instance: Editor | null;
  private stdout;

  constructor() {
    this.stdout = process.stdout;
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new Editor();
    }
    return this._instance;
  }

  write(str: string) {
    this.stdout.write(str);
  }

  clear() {
    this.stdout.clearScreenDown();
    this.moveTo(1,1);
  }

  moveTo(x: number, y?: number) {
    this.stdout.cursorTo(x, y);
  }

  moveToRight() {
    this.stdout.moveCursor(1, 0);
  }

  moveToLeft() {
    this.stdout.moveCursor(-1, 0);
  }

  moveToAbove() {
    this.stdout.moveCursor(0, -1);
  }

  moveToBelow() {
    this.stdout.moveCursor(0, 1);
  }

  kill() {
    Editor._instance = null
    process.exit();
  }
}

function initializeView(data: CSVStore["csvData"], editor: Editor) {
  const header = data?.header ?? [];
  const body = data?.body ?? [];
  editor.write(generateHeader(header));
  editor.write("\n");
  editor.write(generateBody(body));
}

export function launchEditor(store: CSVStore) {
  makeRawMode();
  const editor = Editor.instance;
  editor.clear();
  listenKeyEvent(editor);

  store.on("setData", (data: CSVStore["csvData"]) => {
    initializeView(data, editor);
  });
}
