import * as readline from "readline";
import { startListenInput } from "./keyEventListner";
import { CSVStore } from "./store";
import {
  DEFAULT_CELL_SIZE,
  EDITOR_CELL_DELIMITER,
  ELLIPSIS_CHARACTER,
  PADDING_CHARACTER,
} from "./token";

const NORMAL_MODE = "NORMAL" as const
const INSERT_MODE = "INSERT" as const
const VISUAL_MODE = "VISUAL" as const
const COMMAND_MODE = "COMMAND" as const
export type ModeEntries = typeof NORMAL_MODE | typeof INSERT_MODE | typeof VISUAL_MODE | typeof COMMAND_MODE;

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

function makeRawMode() {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
}

export class Editor {
  private static _instance: Editor | null;
  private _stdout;
  private _mode: ModeEntries;

  constructor() {
    this._stdout = process.stdout;
    this._mode = "NORMAL";
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new Editor();
    }
    return this._instance;
  }

  get mode() {
    return this._mode;
  }

  write(str: string) {
    this._stdout.write(str);
  }

  clear() {
    this.moveTo(0, 0);
    this._stdout.clearScreenDown();
  }

  moveTo(x: number, y?: number) {
    this._stdout.cursorTo(x, y);
  }

  moveToRight() {
    this._stdout.moveCursor(1, 0);
  }

  moveToLeft() {
    this._stdout.moveCursor(-1, 0);
  }

  moveToAbove() {
    this._stdout.moveCursor(0, -1);
  }

  moveToBelow() {
    this._stdout.moveCursor(0, 1);
  }

  moveCellToRight() {
    this._stdout.moveCursor(DEFAULT_CELL_SIZE, 0);
  }

  moveCellToLeft() {
    this._stdout.moveCursor(-DEFAULT_CELL_SIZE, 0);
  }

  moveCellToAbove() {
    this._stdout.moveCursor(0, -1);
  }

  moveCellToBelow() {
    this._stdout.moveCursor(0, 1);
  }

  insertMode() {
    this._mode = "INSERT"
  }

  normalMode() {
    this._mode = "NORMAL"
  }

  visualMode() {
    this._mode = "VISUAL"
  }

  commandMode() {
    this._mode = "COMMAND"
  }

  kill() {
    Editor._instance = null;
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
  startListenInput(editor);

  store.on("setData", (data: CSVStore["csvData"]) => {
    initializeView(data, editor);
  });
}
