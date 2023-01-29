// storage.ts is the main API to use, db folder hold the core function for interacting with indexedDB

import PPPStore from './ppp_store';

class DatabaseManager {
  dbName: string;
  indexedDb: IDBFactory;
  db!: IDBDatabase;

  // All the Stores
  pppStore!: PPPStore;
  packetsPerPageStore!: IDBObjectStore;

  constructor (dbName: string) {
    this.indexedDb = window.indexedDB;
    this.dbName = dbName;
    const req = this.indexedDb.open(this.dbName);
    console.log('[IndexedDB] Opening DB');
    req.onupgradeneeded = (e: any) => {
      this.db = e.target.result;
      console.log('[IndexedDB] Upgrade needed');
      this.pppStore = new PPPStore(this.db, true);
    };
    req.onerror = function (event) {
      alert("Why didn't you allow my web app to use IndexedDB?!");
    };
    req.onsuccess = (e: any) => {
      this.db = e.target.result;
      console.log('[IndexedDB] Success');
      this.pppStore = new PPPStore(this.db, false);
    };
  }
};

const manager = new DatabaseManager('shadeless');

export default manager;
