import { digest } from '../global-specialist-integration/candidateEnvelope';
import { composeSentence, sentenceSurfaces, unitEligibility } from './sentenceComposer';
import { authenticClaim } from './claimEnvelope';
import type { DisplayProof } from './introducedMeaningLedger';
import type { EditorialInput, SemanticUnit, SentenceLedger, TypedEditorialClaim } from './types';

/** Exact finite AST validation. This makes no general NLP equivalence claim. */
export function validateMeaning(input: EditorialInput, claim: TypedEditorialClaim, sentence: SentenceLedger, proof?: DisplayProof) {
  const errors: string[] = [];
  if (!authenticClaim(claim, input)) return { ok: false, state: 'WITHHELD_MEANING_NOT_VERIFIED', errors: ['AUTHENTIC_CLAIM_REQUIRED'] };
  const unit = claim.syntheticDefinition.units.find(u => u.id === sentence.semanticUnits[0]);
  if (!unit || sentence.semanticUnits.length !== 1) return { ok: false, state: 'WITHHELD_MEANING_NOT_VERIFIED', errors: ['SEMANTIC_UNITS_CHANGED'] };
  errors.push(...unitEligibility(input, claim, unit, sentence.function, proof));
  const expected = composeSentence(input, claim, unit, sentence.function, new Set(), proof);
  if (!expected) errors.push('GRAMMAR_SLOT_UNVERIFIED');
  else {
    const a = { ...expected, actualText: '', surfaceId: '' }, b = { ...sentence, actualText: '', surfaceId: '' };
    if (digest(a) !== digest(b)) errors.push('CLAIM_SOURCE_SCOPE_OR_SEMANTIC_UNITS_CHANGED');
    const surface = sentenceSurfaces(claim, unit, sentence.function).find(s => s.id === sentence.surfaceId && s.text === sentence.actualText);
    if (!surface) errors.push('ACTUAL_TEXT_NOT_LICENSED_BY_TYPED_MEANING');
  }
  return { ok: errors.length === 0, state: errors.length ? 'WITHHELD_MEANING_NOT_VERIFIED' : 'VERIFIED_SYNTHETIC_ONLY', errors: [...new Set(errors)].sort() };
}

export function validateUnitMutation(original: SemanticUnit, proposed: SemanticUnit) {
  return { ok: digest(original) === digest(proposed), state: digest(original) === digest(proposed) ? 'UNCHANGED' : 'WITHHELD_MEANING_NOT_VERIFIED' };
}
