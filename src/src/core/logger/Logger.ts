type Level = 'debug' | 'info' | 'warn' | 'error';

const STYLES: Record<Level, string> = {
  debug: 'color:#6b7280',
  info: 'color:#6c63ff',
  warn: 'color:#fbbf24',
  error: 'color:#f87171',
};

/**
 * Centralized logger. Swap the console.* calls here for a remote sink
 * (Sentry, Supabase logs table, etc.) later without touching call sites.
 */
class Logger {
  private log(level: Level, scope: string, message: string, data?: unknown) {
    const prefix = `%c[LifeOS:${scope}]`;
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console[level === 'debug' ? 'log' : level](prefix, STYLES[level], message, data ?? '');
    }
  }

  debug(scope: string, message: string, data?: unknown) {
    this.log('debug', scope, message, data);
  }
  info(scope: string, message: string, data?: unknown) {
    this.log('info', scope, message, data);
  }
  warn(scope: string, message: string, data?: unknown) {
    this.log('warn', scope, message, data);
  }
  error(scope: string, message: string, data?: unknown) {
    this.log('error', scope, message, data);
  }
}

export const logger = new Logger();
