import type { FunctionKey } from '../../korean-editorial-research/researchTypes';
import type { NarrativePhrase } from '../../../interpretation-v4/narrativeCore';
import { narrativeSurfaces } from '../../../interpretation-v4/narrativeEndings';
import { digest } from '../global-specialist-integration/candidateEnvelope';
import { recordHash } from '../sourceReader';
import { RESEARCH } from './researchRegistry';
import { realizeParticle } from './typedKoreanSlots';
import { authenticClaim } from './claimEnvelope';
import { hasDisplayDependency, type DisplayProof } from './introducedMeaningLedger';
import type { EditorialInput, SemanticUnit, SentenceLedger, TypedEditorialClaim } from './types';

const PREDICATES = {
  check: { lemma: '확인하다', surface: '확인해 볼 수 있습니다.', negative: false },
  compare: { lemma: '비교하다', surface: '비교해 볼 수 있습니다.', negative: false },
  distinguish: { lemma: '구분하다', surface: '구분해 볼 수 있습니다.', negative: false },
  delay: { lemma: '늦추다', surface: '늦출 수 있습니다.', negative: false },
  reduce: { lemma: '줄이다', surface: '줄일 수 있습니다.', negative: false },
  retain: { lemma: '남기다', surface: '남길 수 있습니다.', negative: false },
  ask: { lemma: '묻다', surface: '물어볼 수 있습니다.', negative: false },
  notProve: { lemma: '증명하다', surface: '증명하지는 않습니다.', negative: true },
  notTransfer: { lemma: '넘기다', surface: '대신 넘겨야 한다는 뜻은 아닙니다.', negative: true },
} as const;
const RECALL_PREDICATES = {
  check: '확인해 볼 수 있다는', compare: '비교해 볼 수 있다는', distinguish: '구분해 볼 수 있다는',
  delay: '늦출 수 있다는', reduce: '줄일 수 있다는', retain: '남길 수 있다는', ask: '물어볼 수 있다는',
  notProve: '증명하지는 않는다는', notTransfer: '대신 넘겨야 한다는 뜻은 아니라는',
} as const;

export function sceneApplicable(input: Pick<EditorialInput, 'plan'>, unit: SemanticUnit) {
  if (!unit.sceneRef) return { ok: unit.kind !== 'HYPOTHETICAL_SCENE', source: null };
  const scene = RESEARCH.scenes.find(s => s.id === unit.sceneRef);
  const ok = !!scene && scene.status === 'hypothetical_only' && scene.productKey === input.plan.productScope
    && scene.category === input.plan.relationshipScope && !!unit.sceneCondition && /^가령 .+(?:다면|라면),$/u.test(unit.condition.clause)
    && unit.kind === 'HYPOTHETICAL_SCENE';
  return { ok, source: ok && scene ? { id: scene.id, recordHash: recordHash(scene), hypotheticalOnly: true as const } : null };
}
export function unitEligibility(input: EditorialInput, claim: TypedEditorialClaim, unit: SemanticUnit, fn: FunctionKey, proof?: DisplayProof): string[] {
  const errors: string[] = [];
  if (!authenticClaim(claim, input)) errors.push('WITHHELD_MEANING_NOT_VERIFIED');
  if (!RESEARCH.functions.some(f => f.function === fn) || !unit.functions.includes(fn)) errors.push('MISSING_FUNCTION');
  if (!claim.syntheticDefinition.units.some(u => u.id === unit.id && digest(u) === digest(unit))) errors.push('MISSING_SEMANTIC_UNITS');
  if (!sceneApplicable(input, unit).ok) errors.push('MISSING_REQUIRED_CONTEXT');
  const nodes = input.request.actualEvidenceWitnesses.filter(n => typeof n === 'object' && n !== null) as { id?: string; kind?: string; owner?: { fixtureOwnerId?: string }; direction?: unknown }[];
  for (const kind of unit.requiredEvidenceKinds) if (!nodes.some(n => claim.evidenceIds.includes(n.id ?? '') && n.kind === kind)) errors.push('REQUIRED_SOURCE_NOT_VERIFIED:' + kind);
  if (fn === 'fusion') {
    const fs = nodes.filter(n => claim.evidenceIds.includes(n.id ?? '') && n.kind === 'FUSION_DERIVATION');
    if (!fs.some(f => nodes.some(n => claim.evidenceIds.includes(n.id ?? '') && ['MBTI_INPUT_TYPE', 'MBTI_SOURCE_NODE'].includes(n.kind ?? '') && n.owner?.fixtureOwnerId === f.owner?.fixtureOwnerId)
      && nodes.some(n => claim.evidenceIds.includes(n.id ?? '') && n.kind === 'CALCULATED_NATAL_FACT' && n.owner?.fixtureOwnerId === f.owner?.fixtureOwnerId))) errors.push('SAME_OWNER_FUSION_ROOTS_REQUIRED');
  }
  if (claim.direction && !['AB', 'BA', 'A_TO_B', 'B_TO_A'].includes(claim.direction)) errors.push('MISSING_ACTUAL_DIRECTION');
  if (['risk', 'blunt'].includes(fn) && !unit.functions.includes('risk')) errors.push('MISSING_RISK_MEANING');
  if (fn === 'twist' && !unit.functions.includes('twist')) errors.push('MISSING_TWIST_MEANING');
  if ((unit.requiresPreviousDisplay || ['summary', 'closing'].includes(fn) || claim.originalAssignment.displayDependency) && !hasDisplayDependency(input, claim, proof, unit)) {
    errors.push(claim.originalAssignment.displayDependency?.kind === 'REPAIR' ? 'REPAIR_DEPENDENCY_MISSING' : 'RECALL_DISPLAY_MISSING');
  }
  return [...new Set(errors)].sort();
}

/** A closed construction, not a replacement over a Writer's finished prose. */
export function sentenceSurfaces(claim: TypedEditorialClaim, unit: SemanticUnit, fn: FunctionKey) {
  const predicate = PREDICATES[unit.predicate];
  if (!predicate || !unit.condition.clause || !/(?:다면|라면),$/u.test(unit.condition.clause)) return [];
  if (predicate.negative !== (unit.negationScope === 'predicate-object-negated')) return [];
  const object = realizeParticle(unit.object, 'object'), subject = unit.subject ? realizeParticle(unit.subject, ['summary', 'closing'].includes(fn) ? 'subject' : 'topic') : null;
  if (!object.ok || subject && !subject.ok) return [];
  const ending = fn === 'opening' ? '어떻게 확인해 볼까요?' : fn === 'summary' ? RECALL_PREDICATES[unit.predicate] + ' 뜻입니다.'
    : fn === 'closing' ? RECALL_PREDICATES[unit.predicate] + ' 점을 확인 질문으로 남길 수 있습니다.' : predicate.surface;
  const text = [unit.condition.clause, subject?.ok ? subject.text : '', object.text, ending].filter(Boolean).join(' ');
  const phrase: NarrativePhrase = { id: unit.id, role: fn === 'action' ? 'ACTION' : fn === 'scene' ? 'LIFE_SCENE' : 'DIRECT_CLAIM', text,
    semanticTheme: unit.meaningKey, primaryAxes: [], contexts: [], refs: { evidenceIds: claim.evidenceIds, claimIds: [claim.claimId], fusionIds: [], resonanceIds: [], guidanceIds: [], mbtiSourceNodeIds: [] },
    directnessLevel: 1, origin: fn === 'scene' ? 'SCENE' : 'SYNTHESIS' };
  return narrativeSurfaces(phrase, fn === 'blunt', true);
}

export function composeSentence(input: EditorialInput, claim: TypedEditorialClaim, unit: SemanticUnit, fn: FunctionKey, usedPhrases: ReadonlySet<string> = new Set(), proof?: DisplayProof): SentenceLedger | null {
  if (unitEligibility(input, claim, unit, fn, proof).length) return null;
  const surfaces = sentenceSurfaces(claim, unit, fn);
  if (!surfaces.length) return null;
  const style = RESEARCH.products.find(p => p.productKey === input.plan.productScope);
  const seed = parseInt(digest([claim.meaningId, claim.readerQuestion.id, fn, style?.id, input.plan.relationshipScope]).slice(0, 8), 16);
  const selected = surfaces.map((_, i) => surfaces[(seed + i) % surfaces.length]).find(s => !usedPhrases.has(s.text)) ?? surfaces[seed % surfaces.length];
  return {
    id: 'kee:sentence:' + digest([input.request.fixtureId, claim.readerQuestion.id, unit.id, fn]), readerAddress: claim.readerQuestion.address,
    questionId: claim.readerQuestion.id, materialId: claim.originalAssignment.originalMaterialId, primaryClaimId: claim.claimId, meaningId: claim.meaningId,
    semanticUnits: [unit.id], function: fn, kind: ['summary', 'closing'].includes(fn) ? 'RECALL' : unit.kind, source: claim.source, evidenceIds: claim.evidenceIds, factRoots: claim.factRoots,
    semanticMeaningKey: unit.meaningKey, practicalAdviceIdentity: unit.adviceIdentity,
    originalMeaningHash: claim.syntheticDefinition.native.originalMeaningHash, originalAssignmentHash: claim.syntheticDefinition.native.assignmentHash,
    originalApprovalState: claim.originalApprovalState,
    factRootOwnership: claim.factRootOwnership, directionWitnesses: claim.directionWitnesses,
    ancestryRoots: claim.ancestryRoots, owner: claim.owner, direction: claim.direction, temporal: claim.temporal, certainty: 'conditional',
    conditionalScope: unit.condition, negationScope: unit.negationScope, originalConditions: claim.originalConditions,
    originalCounterexamples: claim.originalCounterexamples, originalProhibitedInferences: claim.originalProhibitions,
    syntheticCounterexamples: claim.syntheticDefinition.counterexamples, syntheticProhibitedInferences: claim.syntheticDefinition.prohibitedInferences,
    originalSupportingInformation: claim.originalSupportingInformation, expressionSource: claim.expressionSource,
    sceneSource: sceneApplicable(input, unit).source, actualText: selected.text, surfaceId: selected.id,
    validationState: 'VERIFIED_SYNTHETIC_ONLY', newIndependentFacts: 0,
  };
}
