export type KoreanParticle = "topic" | "subject" | "object" | "with" | "to" | "called";

/** Unknown foreign pronunciation stays explicitly neutral; never guess a reading. */
export function withKoreanParticle(value: string, kind: KoreanParticle): string {
  const last = value.trim().replace(/[\s”’"'」』)\]]+$/u, "").slice(-1);
  const code = last.charCodeAt(0);
  const digitFinals = [21, 8, 0, 16, 0, 0, 1, 8, 8, 0];
  const final = code >= 0xac00 && code <= 0xd7a3 ? (code - 0xac00) % 28
    : /^\d$/u.test(last) ? digitFinals[Number(last)] : undefined;
  const pairs: Record<KoreanParticle, readonly [string, string, string]> = {
    topic: ["은", "는", "은(는)"], subject: ["이", "가", "이(가)"],
    object: ["을", "를", "을(를)"], with: ["과", "와", "과(와)"],
    to: ["으로", "로", "(으)로"], called: ["이라는", "라는", "(이)라는"],
  };
  const pair = pairs[kind];
  return value + (final === undefined ? pair[2] : pair[final !== 0 && !(kind === "to" && final === 8) ? 0 : 1]);
}

/** Only known particle slots in inherited Korean copy; not a prose rewrite. */
export function correctKoreanParticleSlots(text: string): string {
  return text.replace(/([가-힣]+)(이 과해지면|이 업무나|을 결과물로|을 루틴으로|을 살피|가 실제로)/gu,
    (_, word: string, tail: string) => withKoreanParticle(word, tail.startsWith("을") ? "object" : "subject") + tail.slice(1));
}

export function removeDuplicateKoreanPeriods(text: string): string {
  return text.replace(/([.!?。])\1+/g, "$1").replace(/다\.\./g, "다.");
}

export function normalizeKoreanSentenceSpacing(text: string): string {
  return removeDuplicateKoreanPeriods(text)
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?。])/g, "$1")
    .replace(/([.!?。])(?=[가-힣A-Za-z0-9])/g, "$1 ")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function removeRepeatedLeadingLabel(text: string, labelKo: string): string {
  const normalizedLabel = labelKo.trim();

  if (normalizedLabel.length === 0) {
    return normalizeKoreanSentenceSpacing(text);
  }

  const leadingPattern = new RegExp(
    `^${escapeRegExp(normalizedLabel)}\\s*(?:은|는|:|-)?\\s*`,
  );
  const repeatedPattern = new RegExp(
    `([.!?。]\\s*)${escapeRegExp(normalizedLabel)}\\s*(?:은|는|:|-)?\\s*`,
    "g",
  );

  return normalizeKoreanSentenceSpacing(
    text.replace(leadingPattern, "").replace(repeatedPattern, "$1"),
  );
}

function asKoreanSentence(input: string): string {
  const normalized = normalizeKoreanSentenceSpacing(input);

  if (normalized.length === 0) {
    return "";
  }
  if (/[.!?。]$/.test(normalized)) {
    return normalized;
  }
  if (/(기운|구조|감각|흐름|패턴|장치|이미지|통로|창고|조건|힘)$/.test(normalized)) {
    return `${normalized}입니다.`;
  }

  return `${normalized}.`;
}

export function joinKoreanSentences(sentences: readonly string[]): string;
export function joinKoreanSentences(
  ...sentences: readonly (string | undefined)[]
): string;
export function joinKoreanSentences(
  first?: readonly string[] | string,
  ...rest: readonly (string | undefined)[]
): string {
  const sentences = Array.isArray(first) ? first : [first, ...rest];

  return normalizeKoreanSentenceSpacing(
    sentences
      .filter((sentence): sentence is string => sentence !== undefined)
      .map(asKoreanSentence)
      .filter((sentence) => sentence.length > 0)
      .join(" "),
  );
}
