import { EventEmitter } from "events";
import "keypress";
import { Editor } from "./editor";
import { generateKeyEventMapper } from "./keyEventMapper";

export type Key = {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
};

class KeyEventListner extends EventEmitter {
  private static _instance: KeyEventListner;

  public static get instance() {
    if (!this._instance) {
      this._instance = new KeyEventListner();
    }

    return this._instance;
  }
}

export function startListenInput(editor: Editor) {
  const mapProcessToKey = (ch: string, key: Key) => {
    const mapEvent = generateKeyEventMapper(editor.mode)
    if (!mapEvent) throw new Error("The mode is not specified");
    mapEvent(key) 
  };
  process.stdin.on("keypress", mapProcessToKey);

  return KeyEventListner.instance;
}
