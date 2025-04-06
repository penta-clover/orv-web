export interface TempBlobRepository {
    /**
     * IndexedDB에 Blob 데이터를 저장하고 고유한 키를 반환합니다.
     * @param blob 저장할 Blob 데이터
     * @returns 저장된 Blob의 고유 키 (문자열)
     */
    saveBlob(blob: Blob): Promise<string>;
  
    /**
     * 주어진 키를 사용하여 IndexedDB에서 Blob 데이터를 가져옵니다.
     * @param key 가져올 Blob의 고유 키
     * @returns Blob 데이터 또는 찾을 수 없는 경우 null
     */
    getBlob(key: string): Promise<Blob | null>;
  
    /**
     * 주어진 키를 사용하여 IndexedDB에서 Blob 데이터를 삭제합니다.
     * @param key 삭제할 Blob의 고유 키
     */
    deleteBlob(key: string): Promise<void>;
  } 