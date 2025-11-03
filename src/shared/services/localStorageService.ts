/**
 * LocalStorage Service with TypeScript support
 * Provides type-safe methods for working with browser localStorage
 */

interface StorageOptions {
  expiry?: number; // Expiration time in milliseconds
}

interface StorageItem<T> {
  value: T;
  expiry?: number;
}

class LocalStorageService {
  /**
   * Set an item in localStorage with optional expiration
   */
  set<T>(key: string, value: T, options?: StorageOptions): boolean {
    try {
      const item: StorageItem<T> = {
        value,
        expiry: options?.expiry ? Date.now() + options.expiry : undefined,
      };
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error("Error setting localStorage item:", error);
      return false;
    }
  }

  /**
   * Get an item from localStorage with type safety
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const itemStr = localStorage.getItem(key);

      if (!itemStr) {
        return defaultValue ?? null;
      }

      const item: StorageItem<T> = JSON.parse(itemStr);

      // Check if item has expired
      if (item.expiry && Date.now() > item.expiry) {
        this.remove(key);
        return defaultValue ?? null;
      }

      return item.value;
    } catch (error) {
      console.error("Error getting localStorage item:", error);
      return defaultValue ?? null;
    }
  }

  /**
   * Remove an item from localStorage
   */
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing localStorage item:", error);
      return false;
    }
  }

  /**
   * Clear all items from localStorage
   */
  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  }

  /**
   * Check if a key exists in localStorage
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Get all keys from localStorage
   */
  keys(): string[] {
    return Object.keys(localStorage);
  }

  /**
   * Get the number of items in localStorage
   */
  size(): number {
    return localStorage.length;
  }

  /**
   * Get all items from localStorage with a specific prefix
   */
  getByPrefix<T>(prefix: string): Record<string, T> {
    const items: Record<string, T> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const value = this.get<T>(key);
        if (value !== null) {
          items[key] = value;
        }
      }
    }

    return items;
  }

  /**
   * Remove all items with a specific prefix
   */
  removeByPrefix(prefix: string): number {
    let count = 0;
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      if (this.remove(key)) {
        count++;
      }
    });

    return count;
  }

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    try {
      const testKey = "__localStorage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the approximate size of localStorage in bytes
   */
  getSizeInBytes(): number {
    let size = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        size += key.length + (value?.length || 0);
      }
    }
    return size * 2; // 2 bytes per character in UTF-16
  }
}

// Export singleton instance
export const localStorageService = new LocalStorageService();

// Export class for custom instances
export default LocalStorageService;
