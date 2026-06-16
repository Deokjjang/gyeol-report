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
