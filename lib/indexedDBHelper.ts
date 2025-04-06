import { IDBPDatabase, openDB, IDBPTransaction } from 'idb';

const DB_NAME = 'orv-temp-storage';
const DB_VERSION = 1;
const STORE_NAME = 'tempBlobs';

interface TempBlobSchema {
  id: string;
  blob: Blob;
}

let dbPromise: Promise<IDBPDatabase<TempBlobSchema>> | null = null;

function getDbPromise(): Promise<IDBPDatabase<TempBlobSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<TempBlobSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function getStore(mode: IDBTransactionMode): Promise<IDBPTransaction<TempBlobSchema, [typeof STORE_NAME], typeof mode>['store']> {
  const db = await getDbPromise();
  const tx = db.transaction(STORE_NAME, mode);
  // 트랜잭션 객체 자체를 반환하도록 변경하거나, 
  // store와 tx.done을 함께 반환하는 방식으로 변경하는 것이 좋을 수 있습니다.
  // 여기서는 우선 store만 반환하고, 사용하는 쪽에서 tx.done을 직접 처리하도록 합니다.
  return tx.store;
}

// 트랜잭션 객체를 직접 가져오는 함수 추가
export async function getTransaction(mode: IDBTransactionMode): Promise<IDBPTransaction<TempBlobSchema, [typeof STORE_NAME], typeof mode>> {
    const db = await getDbPromise();
    return db.transaction(STORE_NAME, mode);
}

export { STORE_NAME }; 