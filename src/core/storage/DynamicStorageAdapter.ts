import type { IStorageAdapter } from './StorageAdapter';

export class DynamicStorageAdapter implements IStorageAdapter {
  private active: IStorageAdapter;

  constructor(initial: IStorageAdapter) {
    this.active = initial;
  }

  setActive(adapter: IStorageAdapter) {
    this.active = adapter;
  }

  get<T>(key: string): Promise<T | null> {
    return this.active.get<T>(key);
  }
  set<T>(key: string, value: T): Promise<void> {
    return this.active.set(key, value);
  }
  remove(key: string): Promise<void> {
    return this.active.remove(key);
  }
  keys(prefix?: string): Promise<string[]> {
    return this.active.keys(prefix);
  }
}
