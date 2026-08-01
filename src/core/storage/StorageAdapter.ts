/**
 * Storage abstraction.
 *
 * Every module reads/writes data through this interface, never directly
 * through localStorage or Supabase. This is what lets us swap the backing
 * store (local -> Supabase, online -> offline queue) without ever touching
 * module code.
 */
export interface IStorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  keys(prefix?: string): Promise<string[]>;
}

/**
 * localStorage-backed adapter. This is the default adapter today.
 * A SupabaseStorageAdapter implementing the same interface can replace it
 * later (see core/storage/SupabaseStorageAdapter.ts, not yet wired).
 */
export class LocalStorageAdapter implements IStorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async keys(prefix = ''): Promise<string[]> {
    const out: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) out.push(k);
    }
    return out;
  }
}
