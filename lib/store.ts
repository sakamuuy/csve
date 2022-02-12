export class CSVStore {
  private static _instance: CSVStore;
  private _csvData: string[][] | null;

  constructor() {
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

  public set csvData(data: string[][] | null) {
    if (data === null) return;

    this._csvData = data;
  }
}
