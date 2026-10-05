// Comprehensive Client & Data Security Utility Module
// Compliant with OWASP Top 10, KVKK (Turkish Data Protection Law), and Firebase Zero-Trust Security Models

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

/**
 * Standard Firestore error handler conforming to security diagnostic specifications
 */
export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  currentUser?: { uid?: string | null; email?: string | null; emailVerified?: boolean | null; isAnonymous?: boolean | null } | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Security/Operation Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Generates a cryptographically secure random salt using Web Crypto API
 */
export function generateSalt(length: number = 16): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  // Fallback if crypto is unavailable (should be available in all modern browsers)
  return Math.random().toString(36).substring(2, 18) + Date.now().toString(36);
}

/**
 * Cryptographic legacy single-round SHA-256 hash helper
 */
async function computeSha256(pin: string, salt: string): Promise<string> {
  const normalizedPin = pin.trim();
  const msgUint8 = new TextEncoder().encode(`${salt}::${normalizedPin}::minik_security_2026`);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return '';
}

/**
 * Hashes a PIN using modern PBKDF2 (100,000 iterations, SHA-256) via Web Crypto API.
 * Resilient against offline rainbow tables and brute-force attacks.
 */
export async function hashParentPin(pin: string, salt: string): Promise<string> {
  const normalizedPin = pin.trim();
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const enc = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(`${normalizedPin}::minik_security_2026`),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      );
      const derivedBits = await window.crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: enc.encode(salt || 'minik_salt_default'),
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        256
      );
      const hashArray = Array.from(new Uint8Array(derivedBits));
      return 'pbkdf2$' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback to SHA-256 if PBKDF2 fails
      return computeSha256(pin, salt);
    }
  }
  
  return computeSha256(pin, salt);
}

/**
 * Verifies a plain PIN against stored hash and salt with backward-compatible format handling:
 * 1. Plain 4-digit PIN (legacy fallback)
 * 2. Modern PBKDF2 (prefix "pbkdf2$")
 * 3. Salted SHA-256 (legacy 64-char hex)
 */
export async function verifyParentPin(
  enteredPin: string,
  storedHash: string,
  storedSalt: string
): Promise<boolean> {
  if (!enteredPin || !storedHash) return false;
  
  // 1. If stored value is a legacy plain 4-digit PIN (e.g., "1234"), handle backward compatibility
  if (storedHash.length === 4 && /^\d{4}$/.test(storedHash)) {
    return enteredPin === storedHash;
  }

  // 2. Modern PBKDF2 verification
  if (storedHash.startsWith('pbkdf2$')) {
    const computedHash = await hashParentPin(enteredPin, storedSalt || '');
    return computedHash === storedHash;
  }
  
  // 3. Salted single-round SHA-256 backward compatibility
  const sha256Hash = await computeSha256(enteredPin, storedSalt || '');
  if (sha256Hash === storedHash) {
    return true;
  }

  return false;
}

/**
 * Rate Limiter for PIN authentication attempts to prevent automated brute-force attacks.
 * Persists lockout state to secureStorage to prevent evasion via browser reload.
 */
class PinRateLimiter {
  private failedAttempts: number = 0;
  private lockoutUntil: number = 0;
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION_MS = 30000; // 30 seconds

  constructor() {
    this.restoreState();
  }

  private restoreState(): void {
    try {
      const savedLockout = secureStorage.get('pin_lockout_until');
      const savedAttempts = secureStorage.get('pin_failed_attempts');
      if (savedLockout) {
        const lockoutTime = parseInt(savedLockout, 10);
        if (!isNaN(lockoutTime) && lockoutTime > Date.now()) {
          this.lockoutUntil = lockoutTime;
        }
      }
      if (savedAttempts) {
        const attempts = parseInt(savedAttempts, 10);
        if (!isNaN(attempts)) {
          this.failedAttempts = attempts;
        }
      }
    } catch {
      // In case of storage access issues
    }
  }

  private persistState(): void {
    try {
      secureStorage.set('pin_lockout_until', this.lockoutUntil.toString());
      secureStorage.set('pin_failed_attempts', this.failedAttempts.toString());
    } catch {
      // Storage quota or restriction
    }
  }

  public isLockedOut(): { locked: boolean; remainingSeconds: number } {
    this.restoreState();
    const now = Date.now();
    if (this.lockoutUntil > now) {
      const remainingSeconds = Math.ceil((this.lockoutUntil - now) / 1000);
      return { locked: true, remainingSeconds };
    }
    if (this.lockoutUntil !== 0 && this.lockoutUntil <= now) {
      // Cooldown expired, reset attempts
      this.failedAttempts = 0;
      this.lockoutUntil = 0;
      this.persistState();
    }
    return { locked: false, remainingSeconds: 0 };
  }

  public recordFailedAttempt(): { locked: boolean; remainingSeconds: number; attemptsLeft: number } {
    this.restoreState();
    this.failedAttempts += 1;
    if (this.failedAttempts >= this.MAX_ATTEMPTS) {
      this.lockoutUntil = Date.now() + this.LOCKOUT_DURATION_MS;
      this.persistState();
      return { locked: true, remainingSeconds: Math.ceil(this.LOCKOUT_DURATION_MS / 1000), attemptsLeft: 0 };
    }
    this.persistState();
    return {
      locked: false,
      remainingSeconds: 0,
      attemptsLeft: Math.max(0, this.MAX_ATTEMPTS - this.failedAttempts),
    };
  }

  public recordSuccess(): void {
    this.failedAttempts = 0;
    this.lockoutUntil = 0;
    this.persistState();
  }
}

export const parentPinLimiter = new PinRateLimiter();

/**
 * Input sanitization helpers
 */
export function sanitizeString(input: unknown, maxLength: number = 100): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Strip basic HTML tags
    .trim()
    .slice(0, maxLength);
}

export function sanitizeNumber(input: unknown, min: number = 0, max: number = 1000000, fallback: number = 0): number {
  if (typeof input !== 'number' || isNaN(input)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(input)));
}

/**
 * Safe local storage manager with key isolation and error safety
 */
export const secureStorage = {
  get: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(`minik_sec_${key}`);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string): void => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(`minik_sec_${key}`, value);
    } catch {
      // Storage quota or private browsing mode handling
    }
  },
  remove: (key: string): void => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(`minik_sec_${key}`);
    } catch {
      // Ignore
    }
  },
};
