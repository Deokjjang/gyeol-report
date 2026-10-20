import { withKoreanParticle, type KoreanParticle } from "../report-knowledge/koreanCopyUtils";
import { heavenlyStemDisplays, earthlyBranchDisplays } from "../report-tables/displayDictionaries";

const stems = Object.keys(heavenlyStemDisplays), branches = Object.keys(earthlyBranchDisplays);
const punctuation = /[\s‘’“”'"()[\]{}·,.:;!?→~—/]/u;
const particle = /^(?:은|는|이|가|을|를|의|와|과|에서|에게|으로|로|에|도|만)(?:\s|[,.!?]|$)/u;

/** Presentation only. Recognized dictionary tokens, never arbitrary CJK words,
 * names, calculation fields, source IDs or persisted snapshot mutation. */
export function readableSajuText(value: string, names: readonly string[] = []): string {
  const annotated = value.replace(/[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]|[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]/gu, (token, offset: number) => {
    const left = value.slice(0, offset), right = value.slice(offset + token.length);
    if (/[A-Za-z0-9_/-]+:$/.test(left) || /^:[A-Za-z0-9_/-]/.test(right)) return token;
    if (left && !punctuation.test(left.at(-1)!) || right && !punctuation.test(right[0]) && !particle.test(right)) return token;
    if (names.some(name => name && (name.includes(token) && value.includes(name) &&
      [...value.matchAll(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gu"))].some(m => offset >= m.index && offset < m.index + name.length)))) return token;
    if (token.length === 2 && stems.indexOf(token[0]) % 2 !== branches.indexOf(token[1]) % 2) return token;
    const reading = [...token].map(c => heavenlyStemDisplays[c as keyof typeof heavenlyStemDisplays]?.ko ?? earthlyBranchDisplays[c as keyof typeof earthlyBranchDisplays]?.ko).join("");
    if (left.endsWith(`${reading}(`) || right.startsWith(`(${reading})`)) return token;
    return `${reading}(${token})`;
  });
  // A recognized reading also determines the attached particle. In particular
  // a legacy “己丑로” must not become the visibly incorrect “기축(己丑)로”.
  const kinds: Readonly<Record<string, KoreanParticle>> = { 은: "topic", 는: "topic", 이: "subject", 가: "subject", 을: "object", 를: "object", 과: "with", 와: "with", 으로: "to", 로: "to" };
  return annotated.replace(/([가-힣]{1,2})\(([甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]{1,2})\)(으로|로|은|는|이|가|을|를|과|와)(?=\s|[,.!?]|$)/gu,
    (whole, reading: string, raw: string, suffix: string) => {
      const known = [...raw].map(c => heavenlyStemDisplays[c as keyof typeof heavenlyStemDisplays]?.ko ?? earthlyBranchDisplays[c as keyof typeof earthlyBranchDisplays]?.ko).join("");
      if (reading !== known || raw.length === 2 && stems.indexOf(raw[0]) % 2 !== branches.indexOf(raw[1]) % 2
        || names.some(name => name.includes(`${reading}(${raw})`))) return whole;
      return `${reading}(${raw})${withKoreanParticle(reading, kinds[suffix]).slice(reading.length)}`;
    });
}

/** Seoul display of an explicit instant, preserving every non-zero second.
 * Date-only values have no timezone conversion. Unknown formats stay literal. */
export function readableBookTime(value: string): string {
  return value.replace(/\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:\d{2})| \d{2}:\d{2}(?::\d{2})? KST)?/g, (token, offset: number) => {
    if (value[offset + token.length] === "T") return token;
    // Reject invalid calendar dates before Date can normalize e.g. February 30.
    const [year, month, day] = token.slice(0, 10).split("-").map(Number);
    const calendar = new Date(Date.UTC(year, month - 1, day));
    if (calendar.getUTCFullYear() !== year || calendar.getUTCMonth() !== month - 1 || calendar.getUTCDate() !== day) return token;
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(token);
    const iso = token.includes(" KST") ? token.replace(" ", "T").replace(" KST", "+09:00") : token;
    const date = new Date(dateOnly ? `${token}T00:00:00+09:00` : iso);
    if (!Number.isFinite(date.getTime())) return token;
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(date).map(p => [p.type, p.value]));
    if (dateOnly && `${parts.year}-${parts.month}-${parts.day}` !== token) return token;
    const label = `${parts.year}년 ${Number(parts.month)}월 ${Number(parts.day)}일`;
    return dateOnly ? label : `${label} ${Number(parts.hour)}시 ${Number(parts.minute)}분${parts.second !== "00" ? ` ${Number(parts.second)}초` : ""}`;
  });
}

export const readableBookText = (value: string, names: readonly string[] = []) => readableBookTime(readableSajuText(value, names));
