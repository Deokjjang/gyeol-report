import { createHash, createPublicKey, sign, verify, type KeyObject } from 'node:crypto';
import { BOOKS } from '../../src/lib/book/product';
import type { BookData } from '../../src/app/dev/book-preview/bookTypes';

export const ARTIFACT_VERSION = 'gyeol-staging-book-1';
export const READER_VERSION = 'v4-book-pages-1';
export const MAX_ARTIFACT_BYTES = 8 * 1024 * 1024;
export const sha256 = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export type ReviewArtifact = {
  version: typeof ARTIFACT_VERSION; sourceCommit: string; productKey: string; relationshipCategory: string | null;
  inputHash: string; evidenceHash: string; bookHash: string; publicationSafetyVersion: string; readerVersion: typeof READER_VERSION;
  evaluatedAt: string; testOnly: true; safeToPublish: true; approvedForCustomerUse: false; humanQualityApproved: false;
  customerAuthorized: false; actualCustomerClaims: 0; actualBookAllocations: 0; book: BookData;
};
export type SignedBook = { payload: string; signature: string };
// Only the local generator calls this after the private Publication receipt is
// checked. This key authenticates review transport, never Official Approval.
export function signBook(value: ReviewArtifact, key: KeyObject): SignedBook {
  const payload = JSON.stringify(value);
  return { payload, signature: sign(null, Buffer.from(payload), key).toString('base64') };
}
export function verifyBook(value: unknown, publicKey: string | KeyObject, sourceCommit: string) {
  const failure = (error: string) => ({ ok: false as const, error });
  try {
    if (!value || typeof value !== 'object' || !('payload' in value) || !('signature' in value)
      || typeof value.payload !== 'string' || typeof value.signature !== 'string' || Buffer.byteLength(value.payload) > MAX_ARTIFACT_BYTES
      || Object.keys(value).sort().join(',') !== 'payload,signature') return failure('SIGNED_ARTIFACT_REQUIRED');
    const key = typeof publicKey === 'string' ? createPublicKey(publicKey) : publicKey;
    if (key.asymmetricKeyType !== 'ed25519' || !/^[A-Za-z0-9+/]{86}==$/.test(value.signature)
      || !verify(null, Buffer.from(value.payload), key, Buffer.from(value.signature, 'base64'))) return failure('ARTIFACT_SIGNATURE_INVALID');
    const a = JSON.parse(value.payload) as ReviewArtifact;
    if (a.version !== ARTIFACT_VERSION || a.readerVersion !== READER_VERSION || !/^[a-f0-9]{40}$/.test(a.sourceCommit) || a.sourceCommit !== sourceCommit
      || a.publicationSafetyVersion !== 'compatibility-publication-safety-01-v1') return failure('ARTIFACT_VERSION_OR_SOURCE_INVALID');
    if (a.testOnly !== true || a.safeToPublish !== true || a.approvedForCustomerUse !== false || a.humanQualityApproved !== false
      || a.customerAuthorized !== false || a.actualCustomerClaims !== 0 || a.actualBookAllocations !== 0) return failure('TEST_ONLY_AUTHORITY_REQUIRED');
    if (![a.inputHash, a.evidenceHash, a.bookHash].every(h => /^[a-f0-9]{64}$/.test(h)) || sha256(a.book) !== a.bookHash) return failure('BOOK_HASH_INVALID');
    const product = BOOKS.find(b => b.productKey === a.productKey);
    if (!product || !a.book || a.book.bookId !== product.id || !Array.isArray(a.book.pages) || !a.book.pages.length || a.book.pages[0].kind !== 'cover'
      || a.book.pages.at(-1)?.kind !== 'back') return failure('BOOK_CONTRACT_INVALID');
    if (a.productKey === 'saju_mbti_compatibility' ? !['love','marriage','parentChild','coworker','managerReport','businessPartner','friendship'].includes(a.relationshipCategory ?? '') : a.relationshipCategory !== null) return failure('RELATIONSHIP_CONTRACT_INVALID');
    if (a.productKey === 'major_fortune' && a.book.pages.find(p => p.kind === 'timeline')?.kind === 'timeline') {
      const timeline = a.book.pages.find(p => p.kind === 'timeline');
      if (timeline?.kind !== 'timeline' || timeline.years.length !== 14) return failure('HORIZON_INVALID');
    } else if (a.productKey === 'major_fortune') return failure('HORIZON_INVALID');
    if (a.productKey === 'annual_fortune') {
      const months = a.book.pages.find(p => p.kind === 'months');
      if (months?.kind !== 'months' || months.months.length !== 12) return failure('MONTHS_INVALID');
    }
    return { ok: true as const, artifact: a };
  } catch { return failure('ARTIFACT_INVALID'); }
}
