export class Cache {
  /**
   * Retrieve an item from the cache by key.
   */
  public static async get<T>(kv: KVNamespace, key: string): Promise<T | null> {
    try {
      const data = await kv.get(key, 'json');
      return data as T | null;
    } catch (error) {
      console.error(`[Cache] Error getting key \${key}:`, error);
      return null;
    }
  }

  /**
   * Store an item in the cache.
   * @param ttl Time to live in seconds
   */
  public static async set(kv: KVNamespace, key: string, value: any, ttl?: number): Promise<void> {
    try {
      const options = ttl ? { expirationTtl: ttl } : {};
      await kv.put(key, JSON.stringify(value), options);
    } catch (error) {
      console.error(`[Cache] Error setting key \${key}:`, error);
    }
  }

  /**
   * Remove an item from the cache.
   */
  public static async forget(kv: KVNamespace, key: string): Promise<void> {
    try {
      await kv.delete(key);
    } catch (error) {
      console.error(`[Cache] Error deleting key \${key}:`, error);
    }
  }

  /**
   * Get an item from the cache, or execute the given closure and store the result.
   */
  public static async remember<T>(
    kv: KVNamespace,
    key: string,
    ttl: number,
    closure: () => Promise<T>
  ): Promise<T> {
    const cached = await this.get<T>(kv, key);
    if (cached !== null) {
      return cached;
    }

    const value = await closure();
    await this.set(kv, key, value, ttl);
    return value;
  }
}
