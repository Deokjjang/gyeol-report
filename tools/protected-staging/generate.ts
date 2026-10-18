import { prepareOfflinePublication, validateOfflinePublication, SAFETY_EDITION } from '../../src/lib/interpretation-v4/publication-safety/engine';
import { normalizeReportInputPayload } from '../../src/lib/report-generation/reportInputAdapter';
import { validateV4Publication, v4Digest } from '../../src/lib/interpretation-v4/runtimeProjection';
import { storedBook } from '../../src/lib/book/storedReport';
import { ARTIFACT_VERSION, READER_VERSION, sha256, signBook, type ReviewArtifact } from './artifact';
import type { KeyObject } from 'node:crypto';
import type { ReportInputPayload } from '../../src/lib/report-generation/reportInputTypes';

export const REVIEW_CLOCK = { evaluatedAt: '2026-10-12T12:00:00+09:00', policyDate: '2026-10-12T12:00:00+09:00' };
export async function generateReviewBook(payload: ReportInputPayload, key: KeyObject, sourceCommit: string) {
  if (process.env.VERCEL || typeof window !== 'undefined') return { ok: false as const, stage: 'environment', errors: ['LOCAL_GENERATION_ONLY'] };
  const normalized = normalizeReportInputPayload(payload, { now: () => new Date(REVIEW_CLOCK.evaluatedAt) });
  if (!normalized.ok) return { ok: false as const, stage: 'input', errors: [normalized.error] };
  const session = await prepareOfflinePublication(payload, REVIEW_CLOCK);
  if (!session.ok) return { ok: false as const, stage: 'generation', errors: session.errors };
  const r = session.result, receipt = validateOfflinePublication(session);
  if (!receipt.ok || !r.safeToPublish || !r.snapshot) return { ok: false as const, stage: 'publication-safety', errors: receipt.errors };
  const publisher = validateV4Publication(r.evidence.productType, r.draft, r.evidence);
  const original = storedBook(r.snapshot), roundtrip = storedBook(JSON.parse(JSON.stringify(r.snapshot)));
  if (!publisher.ok || !original || !roundtrip || sha256(original.data) !== sha256(roundtrip.data) || v4Digest(original.data) !== r.bookHash)
    return { ok: false as const, stage: 'stored-book', errors: ['BOOK_ROUNDTRIP_INVALID', ...publisher.errors] };
  // Signed bytes are precisely the existing projection; no text edits, owner
  // grants, sharing tokens, new Writer or synthetic source material.
  const artifact: ReviewArtifact = { version: ARTIFACT_VERSION, sourceCommit, productKey: r.evidence.productType,
    relationshipCategory: normalized.value.kind === 'compatibility' ? normalized.value.relationshipType : null,
    inputHash: sha256(payload), evidenceHash: sha256(r.evidence), bookHash: sha256(original.data),
    publicationSafetyVersion: SAFETY_EDITION, readerVersion: READER_VERSION, evaluatedAt: REVIEW_CLOCK.evaluatedAt,
    testOnly: true as const, safeToPublish: true as const, approvedForCustomerUse: false as const, humanQualityApproved: false as const,
    customerAuthorized: false as const, actualCustomerClaims: 0 as const, actualBookAllocations: 0 as const, book: original.data };
  return { ok: true as const, signed: signBook(artifact, key), summary: { productKey: artifact.productKey, relationshipCategory: artifact.relationshipCategory,
    inputHash: artifact.inputHash, evidenceHash: artifact.evidenceHash, bookHash: artifact.bookHash, pages: artifact.book.pages.length,
    calculationsUnchanged: v4Digest(session.original.evidencePacket && (session.original.evidencePacket as typeof r.evidence).calculations) === v4Digest(r.evidence.calculations) } };
}
