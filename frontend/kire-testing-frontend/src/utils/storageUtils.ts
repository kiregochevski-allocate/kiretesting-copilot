/**
 * Storage utilities for caching data locally
 * Supports offline data persistence with expiration
 */

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry?: number; // Optional expiration time in milliseconds
}

/**
 * Save data to local storage with optional expiration
 * @param key Storage key
 * @param data Data to store
 * @param expiryMs Time in milliseconds until the data expires (optional)
 */
export const saveToStorage = <T>(key: string, data: T, expiryMs?: number): void => {
  try {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: expiryMs ? Date.now() + expiryMs : undefined
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Get data from local storage if it exists and hasn't expired
 * @param key Storage key
 * @returns The stored data or null if not found or expired
 */
export const getFromStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsedItem: CacheItem<T> = JSON.parse(item);
    
    // Check if the item has expired
    if (parsedItem.expiry && parsedItem.expiry < Date.now()) {
      localStorage.removeItem(key); // Remove expired item
      return null;
    }

    return parsedItem.data;
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return null;
  }
};

/**
 * Remove an item from local storage
 * @param key Storage key
 */
export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Clear all application data from local storage
 * @param prefix Optional prefix to only clear items with a specific prefix
 */
export const clearStorage = (prefix?: string): void => {
  try {
    if (prefix) {
      // Only clear items that start with the prefix
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      });
    } else {
      // Clear all items
      localStorage.clear();
    }
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Check if local storage is available
 * @returns boolean indicating if localStorage is available
 */
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Get all cached keys with a specific prefix
 * @param prefix The prefix to filter by
 * @returns Array of keys
 */
export const getStorageKeysByPrefix = (prefix: string): string[] => {
  return Object.keys(localStorage).filter(key => key.startsWith(prefix));
};
