import { Campaign } from "../types";

const DB_NAME = 'AutoPosterHubDB';
const STORE_NAME = 'campaigns_store';
const KEY = 'root_campaigns';

const getDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        // Open (or create) the database
        const request = indexedDB.open(DB_NAME, 1);
        
        request.onupgradeneeded = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = () => resolve(request.result);
        
        request.onerror = () => {
            console.error("IndexedDB Error:", request.error);
            reject(request.error);
        };
    });
};

export const saveCampaignsToStorage = async (campaigns: Campaign[]) => {
    try {
        const db = await getDB();
        return new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const request = store.put(campaigns, KEY);
            
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (error) {
        console.error("Failed to save to IndexedDB:", error);
        throw error;
    }
};

export const loadCampaignsFromStorage = async (): Promise<Campaign[] | null> => {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.get(KEY);
            
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error("Failed to load from IndexedDB:", error);
        return null;
    }
};