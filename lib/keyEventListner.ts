import { EventEmitter } from 'events'
import 'keypress';
import { Editor } from './editor';

type Key = {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
}

class KeyEventListner extends EventEmitter {

}

export function startListenInput(editor: Editor) {
  const mapProcessToKey = (ch: string, key: Key) => {
    console.log(key)
    switch (ch) {
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
  process.stdin.on("keypress", mapProcessToKey);
}