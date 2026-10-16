import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { hash, recordHash } from '../sourceReader';
import { digest } from '../global-specialist-integration/candidateEnvelope';
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

/** General terminology usage is not a new individual interpretation. Unavailable
 * actual formations/strength/markers are withheld instead of inferred from text. */
export function explainTerm(input: EditorialInput, claim: TypedEditorialClaim, termId: string, memory: TermMemory) {
  const state = introduced.get(memory), term = RESEARCH.terms.find(t => t.id === termId);
  const withheld = (reason: string) => ({ status: 'WITHHELD' as const, reason, termId, text: '', newIndependentFacts: 0 as const });
  if (!state || state.input !== input || !authenticClaim(claim, input)) return withheld('AUTHENTIC_TERM_CONTEXT_REQUIRED');
  if (!term || hash(readFileSync(join(input.root, term.sourceFile))) !== term.sourceHash) return withheld('REQUIRED_SOURCE_NOT_VERIFIED');
  const nodes = (input.request.actualEvidenceWitnesses as readonly ActualEvidenceNode[]).filter(n => claim.evidenceIds.includes(n.id));
  const natal = nodes.some(n => n.kind === 'CALCULATED_NATAL_FACT'), mbti = nodes.some(n => n.kind === 'MBTI_INPUT_TYPE' || n.kind === 'MBTI_SOURCE_NODE');
  const eligible = ['원국', '일간', '오행'].includes(term.term) ? natal
    : term.term === '십성' ? claim.directionWitnesses.length > 0
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
    origin: 'RESEARCH_EXPRESSION_REFERENCE' as const, researchRecordHash: recordHash(term), sourceFile: term.sourceFile, sourceHash: term.sourceHash,
    sourceDefinitionRequirement: term.requiredDefinition, forbiddenTransfer: term.forbiddenTransfer,
    kind: 'EDITORIAL_CONNECTIVE' as const, claimScope: { question: claim.readerQuestion.id, owner: claim.owner, direction: claim.direction, temporal: claim.temporal },
    individualDefinitionOrInterpretationApproved: false as const, actualCustomerClaims: 0 as const, newIndependentFacts: 0 as const };
}
