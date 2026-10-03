// frontend/src/utils/safeStorage.ts

/**
 * Memory fallback cache for large datasets (>5MB) that exceed browser sessionStorage quota.
 */
const memoryCache = new Map<string, string>();

export const SafeStorage = {
    setItem: (key: string, value: string): boolean => {
        try {
            sessionStorage.setItem(key, value);
            memoryCache.delete(key);
            return true;
        } catch (e: any) {
            console.warn(
                `[SafeStorage] sessionStorage quota exceeded. Switching to in-memory fallback for key: "${key}"`,
            );
            memoryCache.set(key, value);
            return false;
        }
    },

    getItem: (key: string): string | null => {
        try {
            const val = sessionStorage.getItem(key);
            if (val !== null) return val;
        } catch {}
        return memoryCache.get(key) || null;
    },

    removeItem: (key: string): void => {
        try {
            sessionStorage.removeItem(key);
        } catch {}
        memoryCache.delete(key);
    },

    clear: (): void => {
        try {
            sessionStorage.clear();
        } catch {}
        memoryCache.clear();
    },
};
