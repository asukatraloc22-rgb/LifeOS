import { LocalStorageAdapter } from '@/core/storage/StorageAdapter';
import { SupabaseStorageAdapter } from '@/core/storage/SupabaseStorageAdapter';
import { logger } from '@/core/logger/Logger';

const NAMESPACE_PREFIX = 'lifeos.v2.';

export async function migrateLocalToSupabase(userId: string): Promise<void> {
  const flag = `lifeos.v2.supabase.migrated.${userId}`;
  if (localStorage.getItem(flag) === 'true') return;

  const local = new LocalStorageAdapter();
  const remote = new SupabaseStorageAdapter();

  const keys = await local.keys(NAMESPACE_PREFIX);
  let migrated = 0;

  for (const key of keys) {
    const value = await local.get<unknown>(key);
    if (value === null) continue;
    const existing = await remote.get<unknown>(key);
    if (existing !== null) continue;
    await remote.set(key, value);
    migrated++;
  }

  localStorage.setItem(flag, 'true');
  logger.info('auth', `Migrated ${migrated} local collections to Supabase for user ${userId}`);
}
