import type { IStorageAdapter } from './StorageAdapter';
import { supabase } from './SupabaseClient';

/**
 * Supabase-backed storage adapter. Implements the exact same IStorageAdapter
 * contract as LocalStorageAdapter, so swapping it into the Kernel is a
 * one-line change (see core/kernel/Kernel.ts) — no module code changes needed.
 *
 * Backed by a single `kv_store` table (user_id, key, value jsonb), scoped
 * per-user via Row Level Security. See core/storage/supabase.sql for the
 * schema this expects.
 *
 * NOT YET WIRED IN: the Kernel still uses LocalStorageAdapter by default.
 * Activate by setting VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY and
 * switching the Kernel's adapter once auth is connected end-to-end.
 */
export class SupabaseStorageAdapter implements IStorageAdapter {
  private async userId(): Promise<string | null> {
    if (!supabase) return null;
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!supabase) return null;
    const uid = await this.userId();
    if (!uid) return null;
    const { data, error } = await supabase
      .from('kv_store')
      .select('value')
      .eq('user_id', uid)
      .eq('key', key)
      .maybeSingle();
    if (error || !data) return null;
    return data.value as T;
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (!supabase) return;
    const uid = await this.userId();
    if (!uid) return;
    await supabase.from('kv_store').upsert(
      { user_id: uid, key, value, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,key' },
    );
  }

  async remove(key: string): Promise<void> {
    if (!supabase) return;
    const uid = await this.userId();
    if (!uid) return;
    await supabase.from('kv_store').delete().eq('user_id', uid).eq('key', key);
  }

  async keys(prefix = ''): Promise<string[]> {
    if (!supabase) return [];
    const uid = await this.userId();
    if (!uid) return [];
    const { data, error } = await supabase.from('kv_store').select('key').eq('user_id', uid);
    if (error || !data) return [];
    return data.map((r) => r.key as string).filter((k) => k.startsWith(prefix));
  }
}
