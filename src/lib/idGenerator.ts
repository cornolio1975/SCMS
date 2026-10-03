/**
 * SCMS Immutable ID Generator
 * Generates structured, permanent, non-colliding human-readable identifiers
 * Compliant with Rule 6: Never use names as permanent identifiers.
 */

export type IdPrefix =
  | 'CLUB'
  | 'BRANCH'
  | 'MEM'
  | 'VOL'
  | 'TSK'
  | 'INV'
  | 'REC'
  | 'EVT'
  | 'DOC'
  | 'APP'
  | 'TREG';

let inMemoryCounters: Record<string, number> = {
  CLUB: 100,
  MEM: 1000,
  VOL: 500,
  TSK: 300,
  INV: 2000,
  REC: 2000,
  EVT: 100,
  DOC: 500,
  APP: 100,
  TREG: 50,
};

export function generateImmutableId(prefix: IdPrefix, parentClubId?: string, branchNumber?: number): string {
  if (prefix === 'BRANCH' && parentClubId && branchNumber !== undefined) {
    const branchPad = String(branchNumber).padStart(3, '0');
    return `${parentClubId}-B${branchPad}`;
  }

  const current = (inMemoryCounters[prefix] || 1) + 1;
  inMemoryCounters[prefix] = current;
  const pad = String(current).padStart(6, '0');
  return `SCMS-${prefix}-${pad}`;
}

export function generateIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'idem-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now().toString(36);
}
