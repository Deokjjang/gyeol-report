import { SourceReader, recordHash } from '../sourceReader';
import type { CatalogKey, KnowledgeSourcePointer } from '../types';
import type { SourceProof } from '../source-verification/types';
import { KOREAN_TERM_EXPLANATIONS } from '../../korean-editorial-research/termExplanationResearch';
import type { TermStudy } from '../../korean-editorial-research/researchTypes';

const renderer = 'src/lib/interpretation-v4/compatibilityReleaseRenderer.ts';
const research = 'src/lib/report-knowledge/korean-editorial-research/termExplanationResearch.ts';
// Derive identity pins from the existing records; no new Source registry.
const originalRecords = new Map(KOREAN_TERM_EXPLANATIONS.map(t => [t.id, recordHash(t)]));
const targets = ['ker:term:2', 'ker:term:6', 'ker:term:7'];
const receipt = 'tests/fixtures/technical-stabilization-01/source-revision-contract.json';
const publication = 'tests/fixtures/publication-safety-01/source-revision-contract.json';
const proofFile = 'docs/validation/v4-knowledge-source-revision-contract-01/source-drift-resolution.json';
type Revision = { file: string; commit: string; before: string; after: string };
type TermRevision = {
  sourceId: string; catalogKey: CatalogKey; locator: KnowledgeSourcePointer; researchFileSha256: string;
  sourceFile: string; originalSha256: string; currentSha256: string; changingCommit: string;
  classification: string; technicalChainResolved: boolean; meaningApproved: boolean; customerUseApproved: boolean;
};
export type TermSourceVerification = { status: 'WITHHELD' } | {
  status: 'TECHNICALLY_VERIFIED_SOURCE'; mode: 'ORIGINAL_SOURCE' | 'VERIFIED_REVISION_CHAIN';
  originalSourceHash: string; currentSourceHash: string; proof?: SourceProof;
};

/** Consume the already reviewed, sealed three-record proof. These receipts prove
 * source editions only; they never license a meaning, customer Claim or Book. */
export function verifyTermSource(root: string, term: TermStudy): TermSourceVerification {
  const withheld = { status: 'WITHHELD' as const };
  try {
    if (originalRecords.get(term.id) !== recordHash(term)) return withheld;
    const reader = new SourceReader(root, async () => ({}));
    const sealed = <T,>(file: string, sha: string): T => {
      const text = reader.text(file);
      if (reader.files.get(file) !== sha) throw Error('EXACT_TERM_REVISION_RECEIPT_REQUIRED');
      return JSON.parse(text) as T;
    };
    if (!targets.includes(term.id) && term.sourceFile !== renderer) {
      reader.text(term.sourceFile);
      return reader.files.get(term.sourceFile) === term.sourceHash ? {
        status: 'TECHNICALLY_VERIFIED_SOURCE', mode: 'ORIGINAL_SOURCE',
        originalSourceHash: term.sourceHash, currentSourceHash: term.sourceHash,
      } : withheld;
    }
    const reviewed = sealed<{ rows: TermRevision[] }>(proofFile, 'af9d901f52f32c007b5dd01418efd8f6f3004fda309ed29a03aebf74093124fe');
    const contract = sealed<{ priorRevisions: Revision[] }>(receipt, '1c2495895978aeccdfd43f30b84e474d7fbc7c5b7b45b616b1c63c5edc8ae9b1');
    const safety = sealed<{ deltas: Record<string, { before: string; after: string }> }>(publication, 'afdcb18f96f9a6252c96b23c3a050d71473b6c27385affa97752d790b1f30580');
    const rows = reviewed.rows.filter(r => r.sourceId === term.id), revisions = contract.priorRevisions.filter(r => r.file === renderer);
    if (!targets.includes(term.id) || rows.length !== 1 || revisions.length !== 1) return withheld;
    const row = rows[0], revision = revisions[0], delta = safety.deltas[renderer], actualRecordHash = recordHash(term);
    if (row.classification !== 'VERIFIED_COMMITTED_REVISION' || !row.technicalChainResolved || row.meaningApproved || row.customerUseApproved
      || row.locator.file !== research || row.locator.exportName !== 'KOREAN_TERM_EXPLANATIONS' || row.locator.originalId !== term.id
      || row.locator.recordSha256 !== actualRecordHash || !row.locator.sourceVersion || term.sourceFile !== renderer || row.sourceFile !== renderer
      || term.sourceHash !== row.originalSha256 || revision.commit !== row.changingCommit || revision.before !== row.originalSha256
      || revision.after !== row.currentSha256 || delta?.before !== revision.before || delta.after !== revision.after) return withheld;
    reader.text(research); reader.text(renderer);
    if (reader.files.get(research) !== row.researchFileSha256 || reader.files.get(renderer) !== revision.after) return withheld;
    const proof: SourceProof = { locator: { ...row.locator, fileSha256: row.researchFileSha256 }, matchedCatalogKey: row.catalogKey,
      originalId: term.id, role: 'ORIGINAL_RECORD', expectedHash: row.locator.recordSha256, actualHash: actualRecordHash,
      hashAlgorithm: 'SHA256_JSON_INSERTION', sourceVersion: row.locator.sourceVersion,
      reviewState: 'TECHNICAL_REVISION_VERIFIED_NOT_MEANING_OR_CUSTOMER_APPROVAL', qualification: {
        sourceFile: renderer, originalSourceHash: revision.before, currentSourceHash: revision.after, revisionCommit: revision.commit,
        revisionContract: receipt, originalPublicationReceipt: publication, reviewedProof: proofFile,
        meaningApproved: false, customerApproved: false, newIndependentFacts: 0,
      } };
    return { status: 'TECHNICALLY_VERIFIED_SOURCE', mode: 'VERIFIED_REVISION_CHAIN',
      originalSourceHash: term.sourceHash, currentSourceHash: revision.after, proof };
  } catch { return withheld; }
}
