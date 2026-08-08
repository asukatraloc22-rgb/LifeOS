/**
 * Local credential hashing using the Web Crypto API (SubtleCrypto).
 * This replaces the previous plaintext-in-localStorage password scheme.
 * Note: this is still client-side-only protection (deters casual access on
 * a shared device), not real authentication — that arrives with Supabase
 * Auth. Nothing here should be treated as securing sensitive data.
 */

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function randomSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return toHex(bytes.buffer);
}

async function digest(pin: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${pin}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return toHex(hashBuffer);
}

export async function hashPin(pin: string): Promise<{ salt: string; hash: string }> {
  const salt = randomSalt();
  const hash = await digest(pin, salt);
  return { salt, hash };
}

export async function verifyPin(pin: string, salt: string, expectedHash: string): Promise<boolean> {
  const hash = await digest(pin, salt);
  return hash === expectedHash;
}
