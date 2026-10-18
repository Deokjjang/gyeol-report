import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { hash, recordHash } from '../sourceReader';
import { digest } from '../global-specialist-integration/candidateEnvelope';
import { evidenceHash } from '../actual-evidence-graph/graph';
import { isRecord } from '../normalization';
import { verifyTermSource } from './termSourceRevision';
import type { ActualEvidenceNode } from '../actual-evidence-graph/types';
import { authenticClaim } from './claimEnvelope';
import { RESEARCH } from './researchRegistry';
import type { EditorialInput, TypedEditorialClaim } from './types';

export type TermMemory = { readonly mode: 'OFFLINE_TERM_REFERENCE' };
const introduced = new WeakMap<TermMemory, { input: EditorialInput; terms: Set<string> }>();
export function newTermMemory(input: EditorialInput): TermMemory {
  const memory = Object.freeze({ mode: 'OFFLINE_TERM_REFERENCE' as const });
  introduced.set(memory, { input, terms: new Set() }); return memory;
}


/** Validate existing producer observations; do not calculate or issue a relation. */
export function hasTenGodContext(root: string, claim: Pick<TypedEditorialClaim, 'owner' | 'direction' | 'directionWitnesses' | 'evidenceIds' | 'temporal'>, nodes: readonly ActualEvidenceNode[]): boolean {
  if (!['A_TO_B', 'B_TO_A'].includes(claim.direction ?? '') || claim.temporal.some(t => t.scope !== 'natal')) return false;
  const subjectSlot = claim.direction === 'A_TO_B' ? 'personA' : 'personB', recipientSlot = subjectSlot === 'personA' ? 'personB' : 'personA';
  const producerFile = 'src/lib/report-knowledge/compatibilityDirectionEvidence.ts';
  let version: string;
  try { version = `source-sha256:${hash(readFileSync(join(root, producerFile)))}`; } catch { return false; }
  return nodes.some(n => {
    const d = n.direction, value = isRecord(n.value) ? n.value.receivedTenGod : null;
    if (!claim.evidenceIds.includes(n.id) || n.kind !== 'DIRECTIONAL_RELATION_FACT' || n.status !== 'VERIFIED' || n.blockers.length
      || !n.ancestry.complete || n.ancestry.cycle || n.ancestry.missingIds.length || n.certainty !== 'confirmed' || n.temporal !== null
      || n.producer.file !== producerFile || n.producer.symbol !== 'buildCompatibilityDirectionEvidence' || n.producer.system !== 'direction' || n.producer.version !== version
      || !d || n.owner.slot !== subjectSlot || claim.owner !== n.owner.fixtureOwnerId || d.subject !== n.owner.fixtureOwnerId || d.subject === d.recipient
      || !n.fact.producerEvidenceId || d.relationId !== n.fact.producerEvidenceId || !isRecord(value)
      || value.viewerDayStem !== d.recipientDayMaster || value.targetDayStem !== d.subjectDayMaster || typeof value.tenGod !== 'string' || !value.tenGod.trim()
      || !claim.directionWitnesses.some(w => w.nodeId === n.id && w.ownerId === n.owner.fixtureOwnerId && digest(w.direction) === digest(d))) return false;
    // Check the original root's integrity, including the original tenGod value.
    if (n.fact.rootId !== `aeg:root:${evidenceHash([n.owner.fixtureOwnerId, n.producer, n.fact.producerEvidenceId, n.participants, n.temporal, n.direction, n.value])}`) return false;
    if (n.participants.length !== 2 || ![[d.subject, d.subjectDayMaster], [d.recipient, d.recipientDayMaster]].every(([owner, stem]) =>
      n.participants.some(p => p.owner === owner && p.position === 'day' && p.slot === 'stem' && p.value === stem))) return false;
    return [[d.subject, d.subjectDayMaster, subjectSlot], [d.recipient, d.recipientDayMaster, recipientSlot]].every(([owner, stem, slot]) =>
      nodes.some(p => n.ancestry.parentIds.includes(p.id) && p.kind === 'CALCULATED_NATAL_FACT' && p.owner.fixtureOwnerId === owner && p.owner.slot === slot
        && p.status !== 'WITHHELD' && p.certainty === 'confirmed' && p.ancestry.complete && !p.ancestry.cycle
        && p.producer.file === 'src/lib/saju/calculateSaju.ts' && p.producer.symbol === 'calculateSaju'
        && p.blockers.every(b => b.code === 'UNADDRESSABLE_PRODUCER_OBSERVATION')
        && isRecord(p.value) && p.value.position === 'day' && p.value.slot === 'stem' && p.value.value === stem
        && p.participants.some(x => x.owner === owner && x.position === 'day' && x.slot === 'stem' && x.value === stem)));
  });
}

/** General terminology usage is not a new individual interpretation. Unavailable
 * actual formations/strength/markers are withheld instead of inferred from text. */
export function explainTerm(input: EditorialInput, claim: TypedEditorialClaim, termId: string, memory: TermMemory) {
  const state = introduced.get(memory), term = RESEARCH.terms.find(t => t.id === termId);
  const withheld = (reason: string) => ({ status: 'WITHHELD' as const, reason, termId, text: '', newIndependentFacts: 0 as const });
  if (!state || state.input !== input || !authenticClaim(claim, input)) return withheld('AUTHENTIC_TERM_CONTEXT_REQUIRED');
  if (!term) return withheld('REQUIRED_SOURCE_NOT_VERIFIED');
  const source = verifyTermSource(input.root, term);
  if (source.status !== 'TECHNICALLY_VERIFIED_SOURCE') return withheld('REQUIRED_SOURCE_NOT_VERIFIED');
  const nodes = (input.request.actualEvidenceWitnesses as readonly ActualEvidenceNode[]).filter(n => claim.evidenceIds.includes(n.id));
  const natal = nodes.some(n => n.kind === 'CALCULATED_NATAL_FACT'), mbti = nodes.some(n => n.kind === 'MBTI_INPUT_TYPE' || n.kind === 'MBTI_SOURCE_NODE');
  const eligible = ['원국', '일간', '오행'].includes(term.term) ? natal
    : term.term === '십성' ? hasTenGodContext(input.root, claim, input.request.actualEvidenceWitnesses as readonly ActualEvidenceNode[])
    : term.term === 'MBTI' ? mbti
    : term.term === 'Fusion' ? nodes.some(n => n.kind === 'FUSION_DERIVATION' && nodes.some(m => m.kind === 'MBTI_SOURCE_NODE' && m.owner.fixtureOwnerId === n.owner.fixtureOwnerId) && nodes.some(m => m.kind === 'CALCULATED_NATAL_FACT' && m.owner.fixtureOwnerId === n.owner.fixtureOwnerId))
    : term.term === '대운' ? claim.temporal.some(t => t.scope === 'dayun' && t.start && t.endExclusive)
    : term.term === '세운' ? claim.temporal.some(t => t.scope === 'annual' && t.start && t.endExclusive)
    : term.term === '월운' ? claim.temporal.some(t => t.scope === 'month' && t.start && t.endExclusive)
    : false; // Strength confidence, actual formations and markers need exact suppliers.
  if (!eligible) return withheld('MISSING_REQUIRED_CONTEXT');
  const key = digest([term.id, term.sourceHash]);
  if (state.terms.has(key)) return { status: 'REFERENCE_ALREADY_INTRODUCED' as const, termId, text: '', newIndependentFacts: 0 as const };
  state.terms.add(key);
  return { status: 'GENERAL_USAGE_REFERENCE' as const, termId, term: term.term, text: term.good,
    origin: 'RESEARCH_EXPRESSION_REFERENCE' as const, ...(source.proof ? { sourceRevisionProof: source.proof } : {}), researchRecordHash: recordHash(term), sourceFile: term.sourceFile, sourceHash: term.sourceHash,
    sourceDefinitionRequirement: term.requiredDefinition, forbiddenTransfer: term.forbiddenTransfer,
    kind: 'EDITORIAL_CONNECTIVE' as const, claimScope: { question: claim.readerQuestion.id, owner: claim.owner, direction: claim.direction, temporal: claim.temporal },
    individualDefinitionOrInterpretationApproved: false as const, actualCustomerClaims: 0 as const, newIndependentFacts: 0 as const };
}
