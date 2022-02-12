import { EventEmitter } from 'events'

type CSVData = {
  header: string[],
  body: string[][],
}
export class CSVStore extends EventEmitter {
  private static _instance: CSVStore;
  private _csvData: CSVData | null;

  constructor() {
    super();
    this._csvData = null;
  }

  public static get instance(): CSVStore {
    if (!this._instance) {
      this._instance = new CSVStore();
    }

    return this._instance;
  }

  public get csvData() {
    return this._csvData;
  }

  public set csvData(data: CSVData | null) {
    if (data === null) return;

    this._csvData = data;
    this.emit('setData', this._csvData)
  }
}
