class Store {
  private static _instance: Store;
  private _csvData: string[][] | null;

  constructor() {
    this._csvData = null;
  }

  public static get instance(): Store {
    if (!this._instance) {
      this._instance = new Store();
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
