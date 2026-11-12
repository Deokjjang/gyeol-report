/**
 * AM2-3 1부·3-1 — 근거 카드 글을 「고객 문장 기준」으로(결정론, 호출 0). intake.ts가 부른다.
 * 원천(엔진·지식 DB)은 그대로 두고, 세운·대운 작가에게 가는 카드 글만 고친다(4종 작가 입력은 이 파일을 쓰지 않는다).
 * - 일반론 줄 빼기: 「…있을 때 봅니다」「…라 부릅니다」「…이면 …두드러집니다」처럼 이 사람에게 해당하는지 모르는 규칙 문장(P2 판독 major-1 백호 자리 오류의 원인).
 * - 단위 맞추기: 달 카드의 「…해」 → 「…달」, 대운 카드의 「…들어오는 해입니다」 → 「…10년입니다」.
 * - 같은 문장 겹침(짝 이유에 같은 문장 두 번), MBTI 기능 기호(Ti·Ne …).
 * - 장면 씨앗 정리(3-1): 시점 말 · 지난 일 전제 · 연차·직급 소품 · 입력 밖 직업·역할 · 나이 · 앞날 결과 꼬리.
 */
import type { Brief } from "@/lib/brief/schema";
import { noticeMeaning } from "../safety/p6e";

const SENT = /(?<=[.!?])\s+/;
/** 문장 단위로 걸러 잇는다(「 · 」로 이어 붙인 카드 마디도 문장으로 본다). */
export const sentences = (t: string) => t.split(/(?<=[.!?])\s+| · /).map(x => x.trim()).filter(Boolean);

// ---------- 일반론 줄 ----------
/** 판정 규칙·정의(이 사람에게 해당하는지 모르는 일반 문장). 「당신」이 든 문장(그 사람에게 건넨 말)은 남긴다. */
const RULE_END = /(있을 때|있으면|있거나|없으면|이면|이거나|오면|놓이면|걸리면|많으면|적으면|둘 이상이거나|셋 이상이면|들면|만나면|함께 있거나|함께 걸리면)[^.!?]{0,60}(봅니다|읽습니다|봐요|읽어요|두드러집니다|또렷합니다|셉니다|진합니다|진하게|넓어집니다|커집니다|붙습니다|단단해집니다|격입니다|드러납니다|강해집니다|줄어듭니다|얻습니다|늦어집니다|이어집니다)[.!]?$/;
const DEFINITION = /(라|이라) 부릅니다[.!]?$|(있을|올|들) 때 봅니다|(때|경우) 붙는 이름입니다[.!]?$|가운데 [^.]{0,30}(하나|중 하나)가 있을 때|기준으로 정해진 [^.]{0,20}(있을|올) 때/;
/** 자리·개수·함께 있음 조건(엔진이 그 사람에게 따로 판정하지 않는 조건 — P2 판독 major-1 「일주에 있을 때 가장 진하게」가 백호를 일주로 옮겼다). */
const SEAT_COUNT_COND = /(연지|월지|일지|시지|연주|월주|일주|시주|연간|월간|시간|일간 바로 옆)(에|이|가)? ?(있|오|놓|들|앉)[^.!?]{0,14}(으면|면|때|거나)|둘이면|둘 이상|셋 이상|두 개 이상|여럿이면|(과|와) 함께 (있으면|있거나|걸리면)|(가|이) (많으면|없으면|적으면)/;
/** 그 사람의 힘 세기와 맞지 않을 수 있는 조건 문장. */
const PERSON_COND = /(일간이|힘이|사주가) (강한|약한|센|여린) (사람|사주)(에게는|이라면|은|이면)/;
const STRONG_COND = /(일간|자기 기운|내 힘)[^.!?]{0,12}(감당할 힘이 있으면|강하면|세면|넉넉하면)/, WEAK_COND = /(일간|자기 기운|내 힘)[^.!?]{0,12}(모자라면|약하면|여리면|부족하면)/;
export type GeneralCtx = { readonly weak?: boolean };
/** 이름 해명 마디(「이름과 달리 건강 상태를 뜻하지 않으며,」 「이름이 거칠어도 … 예언하지 않습니다.」)는 면책 꼴이라 뗀다(뒤 마디가 남으면 그것만). */
function dropNameDisclaimer(s: string): string | null {
  if (!noticeMeaning(s) && !/(뜻하지|예언하지|말하지) 않/.test(s)) return s;
  const m = /^[^,]{4,60}?(않으며|않고|않지만|아니라|아니고),\s*/.exec(s);
  if (m) { const rest = s.slice(m[0].length); return rest.replace(/[^가-힣]/g, "").length >= 10 && !noticeMeaning(rest) ? rest : null; }
  return null;
}
export function dropGeneral(text: string, g: GeneralCtx = {}): string {
  return sentences(text).map(dropNameDisclaimer).filter((s): s is string => s !== null).filter(s => {
    if (DEFINITION.test(s) || PERSON_COND.test(s) || SEAT_COUNT_COND.test(s)) return false;
    if (/당신/.test(s)) return true;
    if (RULE_END.test(s)) return false;
    if (g.weak !== undefined && ((g.weak && STRONG_COND.test(s)) || (!g.weak && WEAK_COND.test(s)))) return false;
    return true;
  }).map(s => s.replace(/쪽으로 읽습니다/g, "쪽입니다").replace(/(으)?로 읽습니다/g, "$1로 봅니다")).join(" · ");
}

// ---------- 단위 ----------
/** 달 카드: 「…드러나는 해」 「…해예요」 → 달. 대운 카드: 「…들어오는 해입니다」 → 「…10년입니다」. */
export function unitFix(text: string, unit: "달" | "10년" | "해"): string {
  if (unit === "해") return text;
  // AM2-4 3부(P3 판독 annual-1 차단 #5·#6, 예전 card.ts:47): 자리 이름 「태어난 해」는 단위가 아니다 — 바꾸지 않는다(「태어난 해·태어난 날」 → 「태어난 달·…」 버그).
  if (unit === "달") return text.replace(/(?<=[가-힣])(?<!태어난) 해(?=$|[.,·]| ·)/g, " 달").replace(/(?<=[는은운른인던])(?<!태어난) 해(예요|입니다|이에요)/g, " 달$1").replace(/한 해 동안/g, "한 달 동안");
  return text.replace(/(?<=[는은운른인던])(?<!태어난) 해(입니다|예요|이에요)/g, (_m, e: string) => ` 10년${e === "입니다" ? "입니다" : "이에요"}`).replace(/(?<=[가-힣])(?<!태어난) 해(?=$|[.,·]| ·)/g, " 10년").replace(/한 해 동안/g, "10년 동안");
}

// ---------- 같은 문장 · 기호 ----------
export function dedupeSentences(text: string): string {
  const seen = new Set<string>(), out: string[] = [];
  for (const s of text.split(SENT)) { const k = s.replace(/[^가-힣A-Za-z0-9]/g, ""); if (k && seen.has(k)) continue; seen.add(k); out.push(s); }
  return out.join(" ");
}
/** MBTI 기능 기호(「ENTP의 Ti는」 「(Ne)」)를 뗀다. 고객 말로 바꾸는 것은 카드의 기능 줄(가장 센 쪽 …)이 맡는다. */
export function stripFnCodes(text: string, type?: string): string {
  let t = text.replace(/\s?\((Ni|Ne|Si|Se|Ti|Te|Fi|Fe)\)/g, "");
  if (type) t = t.replace(new RegExp(`${type}의 (Ni|Ne|Si|Se|Ti|Te|Fi|Fe)(는|가|은|이)`, "g"), (_m, _f: string, j: string) => `${type}${j === "가" || j === "이" ? "가" : "는"}`);
  return t.replace(/(?<![A-Za-z])(Ni|Ne|Si|Se|Ti|Te|Fi|Fe)(?![A-Za-z])\s?/g, "");
}

// ---------- 장면 씨앗(3-1) ----------
/** 연차·직급 소품: 입력 직업 글에 연차·직급 말이 없으면 쓰지 않는다(AM: 20대 직장인에게 사수·막내·선배·사원증). */
export const SENIORITY_PROP = /사수|막내|선배|후배|신입|입사 동기|동기 모임|팀장|과장|부장|차장|대리|사원증|연차|인턴|수습|첫 출근|정규직 전환|승진 심사|인사 평가/;
const SEED_TIME_STRIP = /(?<![가-힣])(이번엔|이번에는|요즘|최근|요새)\s?/g;
const SEED_TIME_DROP = /(?<![가-힣])(지금|올해|오늘|어제|이번 ?(달|주|해))/;
const SEED_PAST = /몇 (달|해|년|주)째|오래 미뤄 둔|미뤄 두었던|미뤄 둔|그동안|예전부터|늘 하던|지난번|작년/;
/** 연차·직급·역할 소품(입력 직업 글에 없으면 쓰지 않는다). intake SENIORITY_PROP + 임원·부하·리더. */
const ROLE_PROP = new RegExp(`${SENIORITY_PROP.source}|임원|부하 직원|리더 자리|후임|선임`);
/** 직장 장면 낱말(직업 미입력 · 지난 대운이 만 22세 전이면 쓰지 않는다). */
export const WORKPLACE = /회사|사무실|출근|퇴근|회의|업무|보고서|결재|팀|동료|상사|월급|사원|직장|야근|거래처|인수인계|사내|명함|점심 메뉴 투표|책상 서랍/;
const HOMEMAKER = /주부|살림|집안일|장보기 목록|반찬/;
/** 앞날 장면의 결과 꼬리(건수·반응·완료를 못 박는 마디). */
const OUTCOME = /두세 개|한꺼번에 들어|반응이 [^,.]{0,10}(옵|와)|부탁이 옵|빠르게 찹|끝까지 다 채웁|처음 나옵|들어옵니다|생깁니다|늘어납니다|쏟아집니다|성공|합격|뽑힙니다|잘 팔립/;
export type SeedCtx = { readonly brief: Brief; readonly workplaceOk: boolean };
/** 「-(스)ㅂ니다.」 → 「-는 장면」(받침 ㅂ을 떼어 어간을 얻는다). 꼴이 맞지 않으면 null. */
function toScene(clause: string): string | null {
  const t = clause.trim().replace(/[.!]$/, "");
  const m = /^(.*?)([가-힣])(니다|습니다)$/.exec(t); if (!m) return /(는|ㄴ) (모습|장면|날|때|순간)$/.test(t) ? t : null;
  if (m[3] === "습니다") return `${m[1]}${m[2]}는 장면`;
  const code = m[2].charCodeAt(0) - 0xac00; if (code < 0 || code > 11171 || code % 28 !== 17) return null; // 받침 ㅂ
  const stem = String.fromCharCode(0xac00 + code - 17);
  return `${m[1]}${stem}는 장면`;
}
/** 고객 문장 꼴의 장면 씨앗만 남긴다. 뺄 것이면 null. */
export function cleanSeed(seed: string, c: SeedCtx): string | null {
  const f = c.brief.person.facts, detail = f.job.detail ?? "";
  let t = seed.replace(SEED_TIME_STRIP, "").replace(/\s{2,}/g, " ").trim();
  if (!t || SEED_TIME_DROP.test(t) || SEED_PAST.test(t)) return null;
  if (ROLE_PROP.test(t) && !ROLE_PROP.test(detail)) return null;
  const jobKnown = Boolean(f.job.status) && !/^(other|unknown|none)$/.test(f.job.status);
  if (HOMEMAKER.test(t) && f.job.status !== "homemaker") return null;
  if (WORKPLACE.test(t) && (!c.workplaceOk || !jobKnown || /^(student|unemployed|homemaker|job_seeker)$/.test(f.job.status))) return null;
  if (c.brief.person.age < 20 && /(월급|적금|출근|퇴근|회식|연봉)/.test(t)) return null;
  // 앞날 결과 꼬리: 첫 마디만 남기고 「…는 장면」으로. 남길 수 없으면 뺀다.
  if (OUTCOME.test(t)) {
    const clauses = t.split(/(?<=고|며|는데|더니),\s+|,\s+/);
    const first = clauses[0].replace(/(하)고$/, "$1는 장면").replace(/([가-힣])고$/, (_m, ch: string) => { const code = ch.charCodeAt(0) - 0xac00; if (code < 0) return `${ch}고`; const jong = code % 28; return jong === 8 ? `${String.fromCharCode(0xac00 + code - 8)}는 장면` : `${ch}는 장면`; });
    const scene = /장면$/.test(first) && !OUTCOME.test(first) ? first : toScene(first);
    if (!scene || OUTCOME.test(scene) || scene.replace(/[^가-힣]/g, "").length < 8) return null;
    t = scene;
  }
  return t;
}
