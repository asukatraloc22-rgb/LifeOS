import { logger } from '../logger/Logger';

/**
 * Maps the legacy v1 localStorage keys (prefixed "lifeos_", used by the
 * single-file HTML app) to the new v2 namespaced collection names.
 *
 * Legacy read pattern was: localStorage.getItem('lifeos_' + key)
 */
const LEGACY_KEY_MAP: Record<string, string> = {
  transactions: 'finance.transactions',
  objectifs: 'goals.items',
  taches: 'tasks.items',
  habitudes: 'habits.items',
  projets: 'workspace.projects',
  notes_ws: 'notes.items',
  skills: 'academy.skills',
  courses_listes: 'finance.shoppingLists',
  db_custom_tables: 'database.tables',
  exercices_basket: 'basketball.exercises',
  exercices_routine: 'habits.routineExercises',
  notes_basket: 'basketball.notes',
  playbook: 'basketball.playbook',
};

const MIGRATION_FLAG = 'lifeos.v2.migrated';

/**
 * Runs once on app boot. Copies every recognized legacy key into its new
 * namespaced home. Never deletes the old data (so a rollback to the old
 * single-file app, if ever needed, still works).
 */
export function migrateLegacyData(): { migratedKeys: string[]; alreadyDone: boolean } {
  if (localStorage.getItem(MIGRATION_FLAG) === 'true') {
    return { migratedKeys: [], alreadyDone: true };
  }

  const migratedKeys: string[] = [];

  for (const [legacyKey, newKey] of Object.entries(LEGACY_KEY_MAP)) {
    const raw = localStorage.getItem('lifeos_' + legacyKey);
    if (raw === null) continue;

    const newFullKey = `lifeos.v2.${newKey}`;
    // Don't overwrite if the new key somehow already has data.
    if (localStorage.getItem(newFullKey) !== null) continue;

    try {
      JSON.parse(raw); // validate
      localStorage.setItem(newFullKey, raw);
      migratedKeys.push(legacyKey);
    } catch {
      logger.warn('migration', `Skipped unparsable legacy key: ${legacyKey}`);
    }
  }

  localStorage.setItem(MIGRATION_FLAG, 'true');
  logger.info('migration', `Migrated ${migratedKeys.length} legacy collections`, migratedKeys);

  return { migratedKeys, alreadyDone: false };
}
