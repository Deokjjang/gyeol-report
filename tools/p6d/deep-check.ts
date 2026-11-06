/**
 * P6d 새 지식 DB 검사(엔진 표로 검산): pnpm exec tsx tools/p6d/deep-check.ts <파일...>
 * 대상: src/data/knowledge-v5/deep/*.json(심화 상품 재료), src/data/knowledge-v5/mbti-seeds/*.json(MBTI 장면 씨앗).
 * 줄마다: 길이·문장 끝맺음·따옴표·마침표·그림 별명·농사·MBTI 약어·"명리학에서"·십성 누름 방향·오행 생극 방향·when(강/약)과 반대인 말·투자 지시.
 * 파일마다: 키가 엔진 어휘(오행·십성·묶음·신살·귀인·십이운성·관계·상태)에 있는지, 주제별 필수 키·면(facet)·개수.
 * 위반을 줄마다 출력하고, 없으면 "OK <줄 수>". 종료 코드는 위반 수 > 0이면 1.
 */
import { readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { FARMING, NICKNAME_KEYS, bareFunctionCodes, MYEONGRI_PREFIX } from "../../src/lib/writer/safety/lint";
import { RURAL_PROP } from "../../src/lib/writer/safety/patterns";
import { tenGodDirection } from "../../src/lib/writer/safety/p6c";

const KNOW = resolve(import.meta.dirname, "../../src/data/knowledge-v5");
const features = readdirSync(join(KNOW, "myeongri")).flatMap(f => (JSON.parse(readFileSync(join(KNOW, "myeongri", f), "utf8")).features as { id: string; easyName: string }[]));
const NICK = [...features.map(x => x.easyName).filter(n => n.length >= 2), ...NICKNAME_KEYS];
const FEATURE_IDS = new Set(features.map(f => f.id));
const ELEMENTS = ["WOOD", "FIRE", "EARTH", "METAL", "WATER"] as const;
const TEN_GODS = ["比肩", "劫財", "食神", "傷官", "偏財", "正財", "偏官", "正官", "偏印", "正印"] as const;
const GROUPS = ["PEER", "OUTPUT", "WEALTH", "OFFICER", "RESOURCE"] as const;
export const STATUSES = ["employee", "business", "freelancer", "student", "job_seeker", "homemaker", "other", "unknown"] as const;
export const LOVE_STATUSES = ["single", "some", "dating", "married", "unknown"] as const;
export const MBTI_DOMAINS = ["work", "money", "love", "relationships", "alone"] as const;

/** 키가 엔진 어휘에 있는가. */
export function validKey(key: string): boolean {
  const [fam, v] = [key.slice(0, key.indexOf(":")), key.slice(key.indexOf(":") + 1)];
  if (fam === "element") return (ELEMENTS as readonly string[]).includes(v);
  if (fam === "tenGod") return (TEN_GODS as readonly string[]).includes(v);
  if (fam === "group") return (GROUPS as readonly string[]).includes(v);
  if (fam === "status") return (STATUSES as readonly string[]).includes(v);
  if (fam === "love") return (LOVE_STATUSES as readonly string[]).includes(v);
  if (["shinsal", "gwiin", "twelveStage", "relation"].includes(fam)) return FEATURE_IDS.has(key);
  return false;
}

const ENDING = /(니다|[어아여해예에세네군지]요|이에요|죠|까|[는한된진있없했였겠인]다)[.!?…]*$/;
const KO_EL: Record<string, string> = { 나무: "WOOD", 목: "WOOD", 불: "FIRE", 화: "FIRE", 흙: "EARTH", 토: "EARTH", 쇠: "METAL", 금: "METAL", 물: "WATER", 수: "WATER" };
const GEN: Record<string, string> = { WOOD: "FIRE", FIRE: "EARTH", EARTH: "METAL", METAL: "WATER", WATER: "WOOD" };
const CTRL: Record<string, string> = { WOOD: "EARTH", EARTH: "WATER", WATER: "FIRE", FIRE: "METAL", METAL: "WOOD" };
const EL_ACT = /(?<![가-힣])(나무|불|흙|쇠|물)(이|가|은|는) [^,.]{0,10}?(나무|불|흙|쇠|물)(을|를|에) ?(누르|눌러|극하|꺾|막|살리|살려|키우|키워|돕|도와|낳|생하|북돋)/;
/** 오행 생극 방향이 틀린 말(나무가 물을 누른다 등). */
export function elementDirection(s: string): boolean {
  const m = s.match(EL_ACT); if (!m) return false;
  const a = KO_EL[m[1]], b = KO_EL[m[3]], verb = m[5];
  if (a === b) return false;
  const controls = /누르|눌러|극하|꺾|막/.test(verb);
  return controls ? CTRL[a] !== b : GEN[a] !== b;
}
/** 투자 장(G): 특정 종목·상품·매수 시점 금지. 성향·원칙만. */
export const INVEST_DIRECTIVE = /매수|매도|종목|코인|가상 ?화폐|비트코인|레버리지|몰빵|풀매수|사 두세요|팔아 치우|지금 사|지금 팔|타이밍을 노|\d+ ?%|수익률 \d|삼성전자|테슬라|엔비디아|S&P|나스닥 ?\d/;
const STRONG_WORD = /강해|강한|강하게|많아|많은|넘쳐|넘치|두꺼|두텁|세서|센 /;
const WEAK_WORD = /약해|약한|약하게|옅|부족|모자|없어|없는|적어|적은|얇/;
const NAME_OF: Record<string, readonly string[]> = {
  PEER: ["비겁", "비견", "겁재"], OUTPUT: ["식상", "식신", "상관"], WEALTH: ["재성", "편재", "정재"], OFFICER: ["관성", "편관", "정관", "관살"], RESOURCE: ["인성", "편인", "정인"],
  WOOD: ["나무", "목"], FIRE: ["불", "화"], EARTH: ["흙", "토"], METAL: ["쇠", "금"], WATER: ["물", "수"],
};

export type LineCtx = { readonly key: string; readonly when?: string; readonly facet: string; readonly seed: boolean; readonly invest?: boolean };
export function lineProblems(text: unknown, c: LineCtx): string[] {
  if (typeof text !== "string" || !text.trim()) return ["빈 값"];
  const v = text.trim(), p: string[] = [];
  const [min, max] = c.seed ? [6, 24] : [8, 60];
  if (v.length < min || v.length > max) p.push(`길이 ${v.length}(${min}~${max})`);
  if (ENDING.test(v)) p.push("문장 끝맺음(구로 쓴다)");
  if (/["'‘’“”?!]/.test(v)) p.push("따옴표·물음표·느낌표");
  if (/[.。]$/.test(v) || /[.] /.test(v)) p.push("마침표");
  const nick = NICK.filter(n => v.includes(n)); if (nick.length) p.push(`그림 별명 ${nick.join(",")}`);
  if (RURAL_PROP.test(v) || FARMING.test(v)) p.push("농촌·농사 낱말");
  if (bareFunctionCodes(v).length || /(?<![A-Za-z])[EI][NS][TF][JP](?![A-Za-z])/.test(v)) p.push("MBTI 약어·유형 이름");
  if (MYEONGRI_PREFIX.test(v)) p.push("명리학에서");
  if (tenGodDirection(v)) p.push("십성 누름 방향");
  if (elementDirection(v)) p.push("오행 생극 방향");
  if (c.invest && INVEST_DIRECTIVE.test(v)) p.push("투자 지시(종목·시점·수익률)");
  // when(강/약)과 반대인 말: 그 키의 이름이 나온 줄만 본다.
  const k = c.key.split(":")[1] ?? "";
  const tg = TEN_GODS.find(x => x === k);
  const names = NAME_OF[k] ?? (tg ? [] : []);
  if (names.length && names.some(n => new RegExp(`(?<![가-힣])${n}(이|가|은|는|의)?(?![가-힣])`).test(v))) {
    if (c.when === "strong" && WEAK_WORD.test(v)) p.push("강한 쪽 항목에 약하다는 말");
    if (c.when === "weak" && STRONG_WORD.test(v)) p.push("약한 쪽 항목에 강하다는 말");
  }
  return p;
}

type DeepFile = { version: string; topic: string; note?: string; entries: { key: string; when?: string; items: Record<string, string[]> }[] };
type SeedFile = { version: string; type: string; seeds: Record<string, { id: string; text: string; rel?: string; job?: string }[]> };
/** 주제별 필수: 키 목록 × when, 면(facet)과 최소 개수. */
export const TOPICS: Record<string, { keys: readonly string[]; when: readonly string[]; facets: Readonly<Record<string, number>>; seed?: readonly string[]; invest?: boolean }> = {
  "element-appeal": { keys: ELEMENTS.map(e => `element:${e}`), when: ["strong", "weak"], facets: { power: 2, resume: 2, interview: 2, pay: 2, brand: 2, portfolio: 2, loveImage: 2, profile: 2, firstMeet: 2 } },
  "work-engine": { keys: GROUPS.map(g => `group:${g}`), when: ["strong", "weak"], facets: { engine: 2, stop: 2, decision: 2, burnout: 2, flow: 2 } },
  "workplace-people": { keys: TEN_GODS.map(t => `tenGod:${t}`), when: ["any"], facets: { person: 2, asLeader: 2, asMember: 2, asOwner: 2, partnerCaution: 1, helper: 1 } },
  documents: { keys: [...["OFFICER", "RESOURCE"].map(g => `group:${g}`), ...["正官", "偏官", "正印", "偏印"].map(t => `tenGod:${t}`)], when: ["strong", "weak"], facets: { promotion: 2, contract: 2, exam: 2, yearTrend: 2 } },
  invest: { keys: GROUPS.map(g => `group:${g}`), when: ["strong", "weak"], facets: { savings: 1, realEstate: 1, stocks: 1, business: 1, self: 1, mistake: 2, principle: 2 }, invest: true },
  "love-attract": { keys: [...TEN_GODS.map(t => `tenGod:${t}`), "shinsal:DOHWASAL", "shinsal:HONGYEOMSAL", "shinsal:TWELVE_JANGSEONGSAL"], when: ["any"], facets: { charm: 2, contact: 2, confess: 2, attachment: 2, date: 2, conflict: 2 } },
  "red-flags": { keys: [...ELEMENTS.map(e => `element:${e}`), ...GROUPS.map(g => `group:${g}`)], when: ["strong", "weak"], facets: { flag: 2, why: 1, check: 1 } },
  "status-scenes": { keys: [...STATUSES.filter(s => s !== "unknown").map(s => `status:${s}`), ...LOVE_STATUSES.filter(s => s !== "unknown").map(s => `love:${s}`)], when: ["any"], facets: {}, seed: ["c2", "c3", "c4", "c6", "c7", "l3", "l4", "l7", "l8", "l9"] },
};

export function checkDeep(file: string, d: DeepFile): string[] {
  const out: string[] = [];
  const t = TOPICS[d.topic]; if (!t) return [`${file}\t알 수 없는 topic ${d.topic}`];
  for (const key of t.keys) for (const when of t.when) {
    // 상태 장면: 커리어 상태는 c*, 연애 상태는 l* 면만 본다.
    const e = d.entries.find(x => x.key === key && (x.when ?? "any") === when);
    if (!e) { out.push(`${file}\t${key}/${when}\t항목 없음`); continue; }
    const facets = t.seed ? Object.fromEntries(t.seed.filter(f => f.startsWith(key.startsWith("love:") ? "l" : "c")).map(f => [f, 8])) : t.facets;
    for (const [f, n] of Object.entries(facets)) if ((e.items[f]?.length ?? 0) < n) out.push(`${file}\t${key}/${when}.${f}\t${e.items[f]?.length ?? 0}개(${n}개 이상)`);
  }
  const seen = new Map<string, string>();
  for (const e of d.entries) {
    if (!validKey(e.key)) out.push(`${file}\t${e.key}\t엔진에 없는 키`);
    for (const [f, lines] of Object.entries(e.items)) lines.forEach((line, i) => {
      const at = `${e.key}/${e.when ?? "any"}.${f}[${i}]`;
      for (const p of lineProblems(line, { key: e.key, when: e.when, facet: f, seed: Boolean(t.seed), invest: t.invest })) out.push(`${file}\t${at}\t${p}: ${line}`);
      const prev = seen.get(line); if (prev) out.push(`${file}\t${at}\t같은 줄(${prev})`); else seen.set(line, at);
    });
  }
  return out;
}

export function checkSeeds(file: string, d: SeedFile): string[] {
  const out: string[] = [];
  if (basename(file, ".json") !== d.type) out.push(`${file}\t파일 이름과 type이 다름`);
  const seen = new Map<string, string>(), ids = new Set<string>();
  for (const dom of MBTI_DOMAINS) {
    const list = d.seeds[dom] ?? [];
    if (list.length < 30) out.push(`${file}\t${dom}\t${list.length}개(30개 이상)`);
    for (const s of list) {
      if (ids.has(s.id)) out.push(`${file}\t${s.id}\t같은 id`); ids.add(s.id);
      if (!new RegExp(`^${d.type}-${dom}-\\d{2,3}$`).test(s.id)) out.push(`${file}\t${s.id}\tid 꼴(${d.type}-${dom}-NN)`);
      if (s.rel && !["any", "partner"].includes(s.rel)) out.push(`${file}\t${s.id}\trel은 any·partner`);
      if (s.job && !["any", "employed", "business", "student"].includes(s.job)) out.push(`${file}\t${s.id}\tjob은 any·employed·business·student`);
      for (const p of lineProblems(s.text, { key: `mbti:${d.type}`, facet: dom, seed: true })) out.push(`${file}\t${s.id}\t${p}: ${s.text}`);
      const prev = seen.get(s.text); if (prev) out.push(`${file}\t${s.id}\t같은 씨앗(${prev})`); else seen.set(s.text, s.id);
    }
  }
  return out;
}

if (process.argv[1]?.endsWith("deep-check.ts")) {
  let bad = 0, lines = 0;
  for (const f of process.argv.slice(2)) {
    const d = JSON.parse(readFileSync(f, "utf8"));
    const probs = "seeds" in d ? checkSeeds(f, d) : checkDeep(f, d);
    lines += "seeds" in d ? Object.values(d.seeds as Record<string, unknown[]>).reduce((a, l) => a + l.length, 0) : (d.entries as DeepFile["entries"]).reduce((a, e) => a + Object.values(e.items).reduce((b, l) => b + l.length, 0), 0);
    for (const p of probs) console.log(p);
    bad += probs.length;
  }
  console.log(bad ? `위반 ${bad}` : `OK ${lines}`);
  process.exitCode = bad ? 1 : 0;
}
