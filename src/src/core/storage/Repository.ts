import type { IStorageAdapter } from './StorageAdapter';

const NAMESPACE = 'lifeos.v2';

/**
 * Typed, namespaced repository for a single collection (e.g. "basketball.sessions").
 * All new modules should read/write through a Repository instance, never
 * through the adapter or localStorage directly.
 */
export class Repository<T> {
  private readonly adapter: IStorageAdapter;
  private readonly key: string;

  constructor(adapter: IStorageAdapter, collection: string) {
    this.adapter = adapter;
    this.key = `${NAMESPACE}.${collection}`;
  }

  async getAll(): Promise<T[]> {
    return (await this.adapter.get<T[]>(this.key)) ?? [];
  }

  async saveAll(items: T[]): Promise<void> {
    await this.adapter.set(this.key, items);
  }

  async add(item: T): Promise<T[]> {
    const items = await this.getAll();
    items.push(item);
    await this.saveAll(items);
    return items;
  }

  async update(predicate: (item: T) => boolean, updater: (item: T) => T): Promise<T[]> {
    const items = await this.getAll();
    const next = items.map((item) => (predicate(item) ? updater(item) : item));
    await this.saveAll(next);
    return next;
  }

  async remove(predicate: (item: T) => boolean): Promise<T[]> {
    const items = await this.getAll();
    const next = items.filter((item) => !predicate(item));
    await this.saveAll(next);
    return next;
  }

  /** Single-value (non-array) get/set, for settings-like objects. */
  async getValue<V = T>(fallback: V): Promise<V> {
    const v = await this.adapter.get<V>(this.key);
    return v ?? fallback;
  }

  async setValue<V = T>(value: V): Promise<void> {
    await this.adapter.set(this.key, value);
  }
}
