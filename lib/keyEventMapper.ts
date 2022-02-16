import { Editor, ModeEntries } from "./editor";
import { Key } from "./keyEventListner";

const editor = Editor.instance

function mapNormalKeyEvent(key: Key){
  switch (key.sequence) {
    case "c":
      editor.clear();
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

function mapInsertKeyEvent(key: Key) {

}

function mapVisualKeyEvent(key: Key) {

}

function mapCommandKeyEvent(key: Key) {

}

export function generateKeyEventMapper(mode: ModeEntries) {
  switch (mode) {
    case "NORMAL": return mapNormalKeyEvent
    case "INSERT": return mapInsertKeyEvent
    case "VISUAL": return mapVisualKeyEvent
    case "COMMAND": return mapCommandKeyEvent
    default: break;
  }
}