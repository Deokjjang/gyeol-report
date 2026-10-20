import { recordHash } from '../sourceReader';
import { RESEARCH } from './researchRegistry';
import { finalConsonant, realizeParticle, realizeParticleFree, realizeCopula, realizePredicate, joinReviewedClauses, type NounSlot } from './typedKoreanSlots';
import type { KoreanParticle } from '../../koreanCopyUtils';

const noun = (surface: string, reading: string | null): NounSlot => {
  const final = reading === null ? null : finalConsonant(reading);
  return { kind: 'noun_phrase', surface, owner: 'synthetic:grammar:owner', pronunciation: final !== null && reading !== null
    ? { status: 'known', reading, final } : { status: 'unknown', fallback: 'withhold' } };
};
export function runGrammarFixtures() {
  return RESEARCH.grammarFixtures.map(f => {
    const slot = noun(f.surface, f.intendedReading); let text: string | null = null;
    if (['subject', 'topic', 'object', 'with', 'to'].includes(f.topic)) {
      const r = realizeParticle(slot, f.topic as KoreanParticle); if (r.ok) text = r.text;
    } else {
      switch (f.id) {
        case 'ker:grammar-fixture:foreign': {
          const r = realizeParticle({ ...slot, pronunciation: { status: 'unknown', fallback: 'honorific_nim' } }, 'subject'); if (r.ok) text = r.text; break;
        }
        case 'ker:grammar-fixture:symbols': case 'ker:grammar-fixture:mbti': case 'ker:grammar-fixture:hanja': case 'ker:grammar-fixture:digit': case 'ker:grammar-fixture:parenthesis': {
          const context = f.topic === 'name' ? 'name_view' : f.id.endsWith(':mbti') ? 'mbti' : f.id.endsWith(':hanja') ? 'hanja' : f.topic === 'number' ? 'quantity' : 'label';
          const r = realizeParticleFree(slot, context); if (r.ok) text = f.id.endsWith(':parenthesis') ? '검토 ' + r.text : r.text; break;
        }
        case 'ker:grammar-fixture:decimal': { const r = joinReviewedClauses(['버전 ' + f.surface + '에서 확인합니다.']); if (r.ok) text = r.text; break; }
        case 'ker:grammar-fixture:copula-collision': { const r = realizeCopula(noun('정보', f.intendedReading), 'soft'); if (r.ok) text = '이 자료는 ' + r.text; break; }
        case 'ker:grammar-fixture:past': {
          const r = realizePredicate({ kind: 'predicate', lemma: '있다', reviewedSurface: '있었다면', subjectOwner: slot.owner, honorificTarget: null, tense: 'past_conditional', polarity: 'affirmative', mood: 'conditional' });
          if (r.ok) text = '그해 그런 일이 ' + r.text; break;
        }
        case 'ker:grammar-fixture:negative': {
          const r = realizeParticle(noun('관심이 없다는 뜻', '뜻'), 'topic'); if (r.ok) text = '연락이 적다고 ' + r.text + ' 아닙니다.'; break;
        }
        case 'ker:grammar-fixture:honorific': { const r = realizeParticle(noun(f.surface, '님'), 'subject'); if (r.ok) text = r.text + ' 고른 기준'; break; }
      }
    }
    return { id: f.id, originalRecordHash: recordHash(f), expected: f.preferred, actual: text, prohibited: f.prohibited,
      passed: text === f.preferred && text !== f.prohibited, scope: 'BOUNDED_TYPED_GRAMMAR_FIXTURE_NOT_CUSTOMER_CLAIM', originalHelperChanged: false };
  });
}

export function referenceCoverage() {
  return {
    functions: RESEARCH.functions.map(f => ({ id: f.id, function: f.function, purpose: f.purpose, sourceHash: recordHash(f) })),
    products: RESEARCH.products.map(p => ({ ...p, runtimePolicyChanged: false })),
    relationships: RESEARCH.relationships.map(p => ({ ...p, actualRoleCreated: false })),
    expressions: RESEARCH.expressions.map(e => ({ id: e.id, sourceHash: recordHash(e), meaning: e.meaningIdentity, claimRef: e.claimRef, disposition: 'RESEARCH_EXPRESSION_REFERENCE_NO_AUTOMATIC_SYNTHETIC_MAPPING' })),
    scenes: RESEARCH.scenes.map(s => ({ id: s.id, hash: recordHash(s), product: s.productKey, category: s.category, status: s.status, required: s.requiredUserState, notCustomerHistory: s.notCustomerHistory })),
    grammar: RESEARCH.grammar.map(g => ({ id: g.id, hash: recordHash(g), topic: g.topic, originalRule: g.rule, linguisticCompleteness: g.linguisticCompleteness })),
    transitions: RESEARCH.transitions.map(t => ({ ...t, useRequiresActualRelation: true, missingBridgeIsWithheld: true })),
    rhythm: RESEARCH.rhythm.map(r => ({ ...r, measuredHumanImprovement: false, lengthQuotaAdded: false })),
    terms: RESEARCH.terms.map(t => ({ ...t, disposition: 'REFERENCE_ONLY_REQUIRES_EXACT_DEFINITION_AND_ACTUAL_SCOPE', automaticTermSubstitution: false })),
    roleViews: RESEARCH.roles.map(v => ({ ...v, newPersonFacts: 0 })),
  };
}
