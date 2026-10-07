import type { EndingStyle, NarrativePhrase } from "./narrativeCore";
import { normalizeNarrativeText } from "./narrativeVariant";

export function detectEnding(text: string): EndingStyle {
  if (/\?\s*$/.test(text)) return "QUESTION";
  if (/(죠|거죠)[.]?$/.test(text)) return "OBSERVATION_JYO";
  if (/요[.]?$/.test(text)) return "SOFT_YO";
  return "FORMAL_DA";
}
const endings = [
  ["합니다.", "해요.", "하죠."], ["있습니다.", "있어요.", "있죠."], ["없습니다.", "없어요.", "없죠."],
  ["아닙니다.", "아니에요.", "아니죠."], ["봅니다.", "봐요.", "보죠."],
  ["됩니다.", "돼요.", "되죠."], ["싶어 합니다.", "싶어 해요.", "싶어 하죠."],
  ["움직입니다.", "움직여요.", "움직이죠."], ["보입니다.", "보여요.", "보이죠."],
] as const;
export type NarrativeSurface = { id: string; text: string; ending: EndingStyle };
/** Small, closed suffix whitelist. Never removes modality, negation or changes claim content. */
export function narrativeSurfaces(phrase: NarrativePhrase, preserveDirect = false): NarrativeSurface[] {
  const text = normalizeNarrativeText(phrase.text);
  const ending = preserveDirect ? "DIRECT" : phrase.endingStyle ?? detectEnding(text);
  const result: NarrativeSurface[] = [{ id: "SOURCE", text, ending }];
  if (preserveDirect || phrase.role === "ACTION" || ending === "QUESTION") return result;
  // 입니다 is also the final substring of verbs like 움직입니다/보입니다.
  // Only reviewed noun predicates may use the copula transform.
  if (/(?:편|사람|기회|뜻|것|패|성향|기운|장점|때문|부분|모습|이유)입니다\.$/.test(text)) {
    const root = text.slice(0, -4); const code = root.charCodeAt(root.length - 1);
    if (code >= 0xac00 && code <= 0xd7a3) {
      result.push({ id: "SOFT", text: `${root}${(code - 0xac00) % 28 ? "이에요." : "예요."}`, ending: "SOFT_YO" });
      result.push({ id: "OBSERVATION", text: `${root}${(code - 0xac00) % 28 ? "이죠." : "죠."}`, ending: "OBSERVATION_JYO" });
    }
  } else {
    const row = [...endings].sort((a, b) => b[0].length - a[0].length).find(([formal]) => text.endsWith(formal));
    if (row) {
      const root = text.slice(0, -row[0].length);
      result.push({ id: "SOFT", text: root + row[1], ending: "SOFT_YO" }, { id: "OBSERVATION", text: root + row[2], ending: "OBSERVATION_JYO" });
    }
  }
  return result;
}
export function allowsEnding(history: readonly EndingStyle[], ending: EndingStyle): boolean {
  return !(history.length >= 2 && history.at(-1) === ending && history.at(-2) === ending)
    && !(ending === "QUESTION" && history.at(-1) === "QUESTION");
}
