import { LocalStorageAdapter } from '../storage/StorageAdapter';
import { DynamicStorageAdapter } from '../storage/DynamicStorageAdapter';
import { migrateLegacyData } from './migrateLegacyData';
import { logger } from '../logger/Logger';

export const APP_VERSION = '2.1.0';

interface KernelState {
  isOnline: boolean;
  bootedAt: string;
}

class Kernel {
  readonly storage: DynamicStorageAdapter;
  state: KernelState;

  constructor() {
    this.storage = new DynamicStorageAdapter(new LocalStorageAdapter());
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
