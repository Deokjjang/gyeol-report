import { describe, expect, it } from 'vitest';
import { KOREAN_GRAMMAR_FIXTURES } from '@/lib/report-knowledge/korean-editorial-research/grammarFixtures';
import {
  finalConsonant, joinReviewedClauses, realizeCopula, realizeParticle,
  realizeParticleFree, realizePredicate, type NounSlot, type PredicateSlot,
} from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/typedKoreanSlots';
import type { KoreanParticle } from '@/lib/report-knowledge/koreanCopyUtils';

function noun(surface: string, reading: string | null = surface): NounSlot {
  const final = reading === null ? null : finalConsonant(reading);
  return { kind: 'noun_phrase', surface, owner: 'synthetic:grammar:owner',
    pronunciation: reading !== null && final !== null ? { status: 'known', reading, final }
      : { status: 'unknown', fallback: 'withhold' } };
}
function predicate(changes: Partial<PredicateSlot> = {}): PredicateSlot {
  return { kind: 'predicate', subjectOwner: 'synthetic:grammar:owner', honorificTarget: null,
    lemma: '있다', reviewedSurface: '있다면', tense: 'present_conditional',
    polarity: 'affirmative', mood: 'conditional', ...changes };
}

describe('Offline Korean Editorial typed grammar component (not an interpretation engine)', () => {
  const particleTopics = ['subject', 'topic', 'object', 'with', 'to', 'called'];
  for (const f of KOREAN_GRAMMAR_FIXTURES.filter(f => particleTopics.includes(f.topic))) {
    it('realizes original researched noun slot ' + f.id, () => {
      const result = realizeParticle(noun(f.surface, f.intendedReading), f.topic as KoreanParticle);
      expect(result).toEqual({ ok: true, text: f.preferred, newFactRoots: 0 });
      expect(result.ok && result.text).not.toBe(f.prohibited);
    });
  }
  it('uses an honorific without guessing a foreign name pronunciation', () => {
    const slot = noun('Alex', null);
    slot.pronunciation = { status: 'unknown', fallback: 'honorific_nim' };
    expect(realizeParticle(slot, 'subject')).toEqual({ ok: true, text: 'Alex님이', newFactRoots: 0 });
  });
  it('keeps special symbols literal with no A/B substitution', () => {
    expect(realizeParticleFree(noun('A $& {{B}}', null), 'name_view'))
      .toEqual({ ok: true, text: 'A $& {{B}}님의 관점', newFactRoots: 0 });
  });
  for (const [surface, context, text] of [
    ['INTJ', 'mbti', 'INTJ 유형에서는'], ['庚', 'hanja', '일간 표기 ‘庚’:'],
    ['3', 'quantity', '수량: 3'], ['기준(예시)', 'label', '기준(예시):'],
  ] as const) it('uses a particle-free ' + context + ' construction', () => {
    expect(realizeParticleFree(noun(surface, null), context)).toEqual({ ok: true, text, newFactRoots: 0 });
  });
  it('preserves decimals and versions while joining clauses', () => {
    expect(joinReviewedClauses(['버전 3.14에서 확인합니다.', '다음 문장입니다.']))
      .toEqual({ ok: true, text: '버전 3.14에서 확인합니다. 다음 문장입니다.', newFactRoots: 0 });
  });
  it('distinguishes noun 정보 from the verb suffix 보입니다', () => {
    expect(realizeCopula(noun('정보'), 'soft')).toEqual({ ok: true, text: '정보예요.', newFactRoots: 0 });
    expect(realizeCopula(noun('기준'), 'soft')).toEqual({ ok: true, text: '기준이에요.', newFactRoots: 0 });
  });
  it('retains negative copula scope', () => {
    expect(realizeCopula(noun('정보'), 'soft', 'negative')).toEqual({ ok: true, text: '정보가 아니에요.', newFactRoots: 0 });
  });
  it('keeps past events conditional rather than asserting history', () => {
    expect(realizePredicate(predicate({ reviewedSurface: '있었다면', tense: 'past_conditional' })))
      .toEqual({ ok: true, text: '있었다면', newFactRoots: 0 });
  });
  it('distinguishes future condition from prediction', () => {
    expect(realizePredicate(predicate({ reviewedSurface: '있게 된다면', tense: 'future_conditional' })))
      .toEqual({ ok: true, text: '있게 된다면', newFactRoots: 0 });
    expect(realizePredicate(predicate({ reviewedSurface: '반드시 생깁니다.', tense: 'future_conditional' })).ok).toBe(false);
  });
  it('retains negation and conditional mood together', () => {
    expect(realizePredicate(predicate({ reviewedSurface: '없다면', polarity: 'negative' })))
      .toEqual({ ok: true, text: '없다면', newFactRoots: 0 });
  });
  it('does not guess an irregular predicate or arbitrary reviewed surface', () => {
    expect(realizePredicate(predicate({ lemma: '돕다', reviewedSurface: '돕으면' })).ok).toBe(false);
    expect(realizePredicate(predicate({ reviewedSurface: '있습니다.' })).ok).toBe(false);
  });
  it('rejects mismatched tense, negation, honorific target and mood', () => {
    for (const change of [ { tense: 'past_conditional' }, { polarity: 'negative' },
      { honorificTarget: 'synthetic:other-owner' }, { mood: 'instruction' } ] as const) {
      expect(realizePredicate(predicate(change)).ok).toBe(false);
    }
  });
  it('does not attach an honorific to an inanimate noun predicate', () => {
    expect(realizePredicate(predicate({ reviewedSurface: '말씀하십니다.', honorificTarget: '기준' })).ok).toBe(false);
  });
  for (const surface of ['Alex', 'INTJ', '庚', '3', '기준(예시)']) {
    it('withholds unknown pronunciation for ' + surface, () => {
      expect(realizeParticle(noun(surface, null), 'subject')).toEqual({ ok: false, reason: 'GRAMMAR_SLOT_UNVERIFIED' });
      expect(realizeCopula(noun(surface, null), 'soft').ok).toBe(false);
    });
  }
  it('requires a separate construction for particle-free fallback', () => {
    const slot = noun('Alex', null);
    slot.pronunciation = { status: 'unknown', fallback: 'particle_free' };
    expect(realizeParticle(slot, 'subject').ok).toBe(false);
  });
  it('does not accept a false final consonant declaration', () => {
    const slot = noun('길');
    slot.pronunciation = { status: 'known', reading: '길', final: 'none' };
    expect(realizeParticle(slot, 'to').ok).toBe(false);
  });
  it('requires explicit owner and rejects untyped line breaks', () => {
    expect(realizeParticle({ ...noun('길'), owner: '' }, 'to').ok).toBe(false);
    expect(realizeParticle(noun('길\n'), 'to').ok).toBe(false);
    expect(realizePredicate(predicate({ subjectOwner: '' })).ok).toBe(false);
    expect(joinReviewedClauses([]).ok).toBe(false);
    expect(joinReviewedClauses(['']).ok).toBe(false);
  });
  it('keeps source fixtures unchanged and never creates evidence', () => {
    const before = JSON.stringify(KOREAN_GRAMMAR_FIXTURES);
    for (const f of KOREAN_GRAMMAR_FIXTURES) realizeParticleFree(noun(f.surface, null), 'label');
    expect(JSON.stringify(KOREAN_GRAMMAR_FIXTURES)).toBe(before);
    expect(KOREAN_GRAMMAR_FIXTURES).toHaveLength(46);
  });
});
