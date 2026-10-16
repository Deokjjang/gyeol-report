import { withKoreanParticle, type KoreanParticle } from '../../koreanCopyUtils';

/** Bounded offline grammar. These slots carry no interpretation or approval. */
export type NounSlot = {
  kind: 'noun_phrase';
  surface: string;
  owner: string;
  pronunciation:
    | { status: 'known'; reading: string; final: 'none' | 'rieul' | 'other' }
    | { status: 'unknown'; fallback: 'honorific_nim' | 'particle_free' | 'withhold' };
};
export type SlotResult =
  | { ok: true; text: string; newFactRoots: 0 }
  | { ok: false; reason: 'GRAMMAR_SLOT_UNVERIFIED' };
export type PredicateSlot = {
  kind: 'predicate';
  subjectOwner: string;
  honorificTarget: string | null;
  tense: 'past_conditional' | 'present_conditional' | 'future_conditional' | 'timeless';
  polarity: 'affirmative' | 'negative';
  mood: 'conditional' | 'question' | 'instruction';
  lemma: string;
  reviewedSurface: string;
};
const withheld = (): SlotResult => ({ ok: false, reason: 'GRAMMAR_SLOT_UNVERIFIED' });
const success = (text: string): SlotResult => ({ ok: true, text, newFactRoots: 0 });

export function finalConsonant(reading: string): 'none' | 'rieul' | 'other' | null {
  const last = reading.trim().at(-1);
  if (!last) return null;
  const code = last.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return null;
  const coda = code % 28;
  return coda === 0 ? 'none' : coda === 8 ? 'rieul' : 'other';
}

function validNoun(slot: NounSlot): boolean {
  return slot.kind === 'noun_phrase' && !!slot.owner.trim() && !!slot.surface.trim()
    && slot.surface === slot.surface.trim() && !/[\r\n\u0000-\u001f]/u.test(slot.surface);
}

/** Never derives pronunciation from a digit, foreign label or closing quote. */
export function realizeParticle(slot: NounSlot, particle: KoreanParticle): SlotResult {
  if (!validNoun(slot)) return withheld();
  if (!['topic', 'subject', 'object', 'with', 'to', 'called'].includes(particle)) return withheld();
  if (slot.pronunciation.status === 'unknown') {
    if (slot.pronunciation.fallback === 'honorific_nim') {
      return success(withKoreanParticle(slot.surface + '님', particle));
    }
    // Particle-free fallback needs a different construction, not a missing suffix.
    return withheld();
  }
  const { reading, final } = slot.pronunciation;
  if (finalConsonant(reading) !== final) return withheld();
  const realizedReading = withKoreanParticle(reading, particle);
  return success(slot.surface + realizedReading.slice(reading.length));
}

export function realizeParticleFree(slot: NounSlot, context: 'name_view' | 'mbti' | 'hanja' | 'quantity' | 'label'): SlotResult {
  if (!validNoun(slot)) return withheld();
  switch (context) {
    case 'name_view': return success(slot.surface + '님의 관점');
    case 'mbti': return /^[EI][SN][TF][JP]$/u.test(slot.surface)
      ? success(slot.surface + ' 유형에서는') : withheld();
    case 'hanja': return /^\p{Script=Han}+$/u.test(slot.surface)
      ? success('일간 표기 ‘' + slot.surface + '’:') : withheld();
    case 'quantity': return /^\d+(?:\.\d+)?$/u.test(slot.surface)
      ? success('수량: ' + slot.surface) : withheld();
    case 'label': return success(slot.surface + ':');
    default: return withheld();
  }
}

/** Copula is applied to a typed noun, never to an arbitrary verb suffix. */
export function realizeCopula(slot: NounSlot, style: 'formal' | 'soft', polarity: 'affirmative' | 'negative' = 'affirmative'): SlotResult {
  if (!validNoun(slot) || slot.pronunciation.status !== 'known'
    || finalConsonant(slot.pronunciation.reading) !== slot.pronunciation.final) return withheld();
  if (polarity === 'negative') {
    const subject = realizeParticle(slot, 'subject');
    return subject.ok ? success(subject.text + (style === 'formal' ? ' 아닙니다.' : ' 아니에요.')) : subject;
  }
  if (polarity !== 'affirmative') return withheld();
  return success(slot.surface + (style === 'formal' ? '입니다.'
    : slot.pronunciation.final === 'none' ? '예요.' : '이에요.'));
}

// Reviewed finite forms only. Unsupported irregular forms remain withheld.
const PREDICATES: readonly Omit<PredicateSlot, 'kind' | 'subjectOwner'>[] = [
  { lemma: '있다', reviewedSurface: '있었다면', honorificTarget: null, tense: 'past_conditional', polarity: 'affirmative', mood: 'conditional' },
  { lemma: '있다', reviewedSurface: '있다면', honorificTarget: null, tense: 'present_conditional', polarity: 'affirmative', mood: 'conditional' },
  { lemma: '있다', reviewedSurface: '있게 된다면', honorificTarget: null, tense: 'future_conditional', polarity: 'affirmative', mood: 'conditional' },
  { lemma: '있다', reviewedSurface: '없다면', honorificTarget: null, tense: 'present_conditional', polarity: 'negative', mood: 'conditional' },
  { lemma: '확인하다', reviewedSurface: '확인해 볼까요?', honorificTarget: null, tense: 'timeless', polarity: 'affirmative', mood: 'question' },
  { lemma: '확인하다', reviewedSurface: '확인해 보세요.', honorificTarget: null, tense: 'timeless', polarity: 'affirmative', mood: 'instruction' },
];

export function realizePredicate(slot: PredicateSlot): SlotResult {
  if (slot.kind !== 'predicate' || !slot.subjectOwner.trim()) return withheld();
  const match = PREDICATES.some(p => p.lemma === slot.lemma && p.reviewedSurface === slot.reviewedSurface
    && p.honorificTarget === slot.honorificTarget && p.tense === slot.tense
    && p.polarity === slot.polarity && p.mood === slot.mood);
  return match ? success(slot.reviewedSurface) : withheld();
}

/** Joining typed clauses does not tokenize or rewrite their internal punctuation. */
export function joinReviewedClauses(clauses: readonly string[]): SlotResult {
  if (!clauses.length || clauses.some(c => !c.trim() || /[\r\n\u0000-\u001f]/u.test(c))) return withheld();
  return success(clauses.map(c => c.trim()).join(' '));
}
