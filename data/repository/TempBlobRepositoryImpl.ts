import { TempBlobRepository } from '@/domain/model/TempBlobRepository';
import { getStore, getTransaction } from '@/lib/indexedDBHelper';

export class TempBlobRepositoryImpl implements TempBlobRepository {
  async saveBlob(blob: Blob): Promise<string> {
    const key = crypto.randomUUID();
    const tx = await getTransaction('readwrite');
    if (tx.store && tx.store.put) {
      await tx.store.put({ id: key, blob });
    }
    await tx.done;
    return key;
  }

  async getBlob(key: string): Promise<Blob | null> {
    const store = await getStore('readonly');
    const record = await store.get(key);
    return record ? record.blob : null;
  }

  async deleteBlob(key: string): Promise<void> {
    const tx = await getTransaction('readwrite');
    if (tx.store && tx.store.delete) {
      await tx.store.delete(key);
    }
    await tx.done;
  }
} 