class PPPStore {
  static storeName: 'packets-per-page';
  db!: IDBDatabase;

  constructor (db: IDBDatabase, initStore: boolean) {
    this.db = db;
    if (initStore) {
      console.log('[IndexedDB] Creating object store');
      const store = db.createObjectStore(
        PPPStore.storeName,
        { keyPath: 'key' },
      );
      store.createIndex('key', 'key', { unique: true });
    }
  }

  async read (projectName: string, origin: string): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
      const ppp = this.db
        .transaction([PPPStore.storeName])
        .objectStore(PPPStore.storeName);
      const request = ppp.get(`${projectName}-${origin}`);
      request.onerror = function (event) {
        reject(new Error('Cannot read'));
      };
      request.onsuccess = function (event) {
        resolve(request.result?.value);
      };
    });
  }

  async update (projectName: string, origin: string, newValue: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.db
        .transaction([PPPStore.storeName], 'readwrite')
        .objectStore(PPPStore.storeName);

      const request = store.get(`${projectName}-${origin}`);
      request.onerror = function (event) {
        reject(new Error('Cannot write'));
      };
      request.onsuccess = function (event: any) {
        const data = event.target.result;
        data.value = newValue;
        const requestUpdate = store.put(data);
        requestUpdate.onerror = function (event) {
          reject(new Error('Cannot write'));
        };
        requestUpdate.onsuccess = function (event) {
          resolve();
        };
      };
    });
  }

  // Im too lazy to delete each record, lol
  async deleteAll (): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.db
        .transaction([PPPStore.storeName], 'readwrite')
        .objectStore(PPPStore.storeName);
      const req = store.clear();
      req.onsuccess = function (evt) {
        resolve();
      };
      req.onerror = function (evt) {
        reject(new Error('Cannot clean'));
      };
    });
  }

  async write (projectName: string, origin: string, num: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([PPPStore.storeName], 'readwrite');
      transaction.oncomplete = function (event) {
        resolve();
      };
      transaction.onerror = function (event) {
        reject(new Error('Cannot write'));
      };
      transaction.objectStore(PPPStore.storeName).add({
        key: `${projectName}-${origin}`,
        value: num,
      });
    });
  }
}

export default PPPStore;
