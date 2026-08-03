import { LocalStorageAdapter, type IStorageAdapter } from '../storage/StorageAdapter';
import { migrateLegacyData } from './migrateLegacyData';
import { logger } from '../logger/Logger';

export const APP_VERSION = '2.0.0';

interface KernelState {
  isOnline: boolean;
  bootedAt: string;
}

/**
 * The Kernel is the single source of truth for cross-cutting app services:
 * storage backend, connectivity, boot sequence, versioning.
 * Modules should never instantiate their own storage adapter — they get it
 * from here, so swapping local -> Supabase later is a one-line change.
 */
class Kernel {
  readonly storage: IStorageAdapter;
  state: KernelState;

  constructor() {
    this.storage = new LocalStorageAdapter();
    this.state = {
      isOnline: navigator.onLine,
      bootedAt: new Date().toISOString(),
    };
  }

  boot() {
    logger.info('kernel', `LifeOS v${APP_VERSION} booting`);
    const { migratedKeys, alreadyDone } = migrateLegacyData();
    if (!alreadyDone && migratedKeys.length > 0) {
      logger.info('kernel', `Imported ${migratedKeys.length} collections from legacy app`);
    }

    window.addEventListener('online', () => (this.state.isOnline = true));
    window.addEventListener('offline', () => (this.state.isOnline = false));

    logger.info('kernel', 'Boot complete');
  }
}

export const kernel = new Kernel();
