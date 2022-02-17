import { Editor, ModeEntries } from "./editor";
import { Key } from "./keyEventListner";

let editor: Editor;

function mapNormalKeyEvent(key: Key){
  switch (key.sequence) {
    case "c":
      editor.clear();
      editor.kill();
      break;

    case "h":
      editor.moveCellToLeft();
      break;

    case "k":
      editor.moveCellToAbove();
      break;

    case "j":
      editor.moveCellToBelow();
      break;

    case "l":
      editor.moveCellToRight();
      break;

    default:
      break;
  }
}

function mapInsertKeyEvent(key: Key) {

}

function mapVisualKeyEvent(key: Key) {

}

function mapCommandKeyEvent(key: Key) {

}

export function generateKeyEventMapper(mode: ModeEntries) {
  editor = Editor.instance

  switch (mode) {
    case "NORMAL": return mapNormalKeyEvent
    case "INSERT": return mapInsertKeyEvent
    case "VISUAL": return mapVisualKeyEvent
    case "COMMAND": return mapCommandKeyEvent
    default: break;
  }
}