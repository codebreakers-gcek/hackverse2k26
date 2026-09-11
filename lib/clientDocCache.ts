/**
 * Client Document Cache using IndexedDB
 * Stores large PDF/Image files as ArrayBuffers reliably without hitting localStorage quota limits (5MB).
 * Ensures both files persist independently and remain previewable across browser reloads.
 */

const DB_NAME = "hackverse_doc_cache_db";
const DB_VERSION = 1;
const STORE_NAME = "cached_documents";

export interface StoredDocRecord {
  key: string;
  name: string;
  type: string;
  sizeStr: string;
  buffer?: ArrayBuffer;
  blob?: Blob;
  updatedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB is not supported in this browser"));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error("Failed to open IndexedDB"));
    };
  });
}

export async function saveDocToCache(
  key: string,
  file: File,
  sizeStr: string,
): Promise<void> {
  try {
    const db = await openDB();
    const buffer = await file.arrayBuffer();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      const record: StoredDocRecord = {
        key,
        name: file.name,
        type: file.type || "application/octet-stream",
        sizeStr,
        buffer,
        updatedAt: Date.now(),
      };

      const request = store.put(record);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("IndexedDB document save failed:", err);
  }
}

export async function getDocFromCache(
  key: string,
): Promise<{ file: File; name: string; type: string; sizeStr: string } | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result as StoredDocRecord | undefined;
        if (!result || (!result.buffer && !result.blob)) {
          resolve(null);
          return;
        }

        const data = result.buffer || result.blob;
        if (!data) {
          resolve(null);
          return;
        }

        const file = new File([data], result.name, {
          type: result.type,
          lastModified: result.updatedAt,
        });

        resolve({
          file,
          name: result.name,
          type: result.type,
          sizeStr: result.sizeStr,
        });
      };

      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("IndexedDB document retrieval failed:", err);
    return null;
  }
}

export async function removeDocFromCache(key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("IndexedDB delete failed:", err);
  }
}

export async function clearAllDocCache(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("IndexedDB clear failed:", err);
  }
}
