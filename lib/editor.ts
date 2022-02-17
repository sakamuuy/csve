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

type CursorPosition = {
  x: number;
  y: number;
}
export class Editor {
  private static _instance: Editor | null;
  private _stdout;
  private _mode: ModeEntries;
  private _columnLength: number;
  private _rowLength: number;
  private _cursorPosition: CursorPosition;

  constructor(colL: number, rowL: number) {
    this._stdout = process.stdout;
    this._mode = "NORMAL";
    this._columnLength = colL;
    this._rowLength = rowL;
    this._cursorPosition= {
      x: 0,
      y: 0
    }
  }

  private _canMoveByCell(afterX: number, afterY: number) {
    if (afterX > this._columnLength || 
        afterX < 0 || 
        afterY > this._rowLength ||
        afterY < 0) {
      return false;
    }
    return true;
  }

  private _cacheCurrentPos(x: number, y: number) {
    this._cursorPosition = {x,y}
  }

  static get instance() {
    if (!this._instance) {
      const store = CSVStore.instance
      this._instance = new Editor(store.csvData?.header.length ?? 0, store.csvData?.body.length ?? 0);
    }
    return this._instance;
  }

  get mode() {
    return this._mode;
  }

  set colLength(l: number) {
    this._columnLength = l * DEFAULT_CELL_SIZE
  }

  set rowLength(l: number) {
    this._rowLength = l;
  }

  write(str: string) {
    this._stdout.write(str);
  }

  clear() {
    this.moveToOrigin();
    this._stdout.clearScreenDown();
  }

  moveToOrigin() {
    this._stdout.cursorTo(0, 0);
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

  moveByCellToRight() {
    this._canMoveByCell(this._cursorPosition.x + DEFAULT_CELL_SIZE, this._cursorPosition.y) && 
    this._stdout.moveCursor(DEFAULT_CELL_SIZE, 0);
  }

  moveByCellToLeft() {
    this._canMoveByCell(this._cursorPosition.x - DEFAULT_CELL_SIZE, this._cursorPosition.y) && 
    this._stdout.moveCursor(-DEFAULT_CELL_SIZE, 0);
  }

  moveByCellToAbove() {
    this._canMoveByCell(this._cursorPosition.x, this._cursorPosition.y -1) && 
    this._stdout.moveCursor(0, -1);
  }

  moveByCellToBelow() {
    this._canMoveByCell(this._cursorPosition.x, this._cursorPosition.y + 1) && 
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
  editor.colLength = header.length;
  editor.rowLength = body.length;
  editor.moveToOrigin();
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
