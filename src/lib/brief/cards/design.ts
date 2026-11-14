/**
 * W3 P3 연결 시스템 3·4·5·6 — 절 설계 카드(결정론, 호출 0). planChapters 결과(절 materials)에서 만든다. 4종만(세운·대운 AM은 만들지 않는다).
 * SectionCard = { q, evidence[{name, where, meaning}](0~3, 자리 이름 포함), link(장당 하나), scene(근거 있는 장면 하나), punch(장당 하나), rx(장당 하나) }.
 * - 근거: trait = 이름·자리(정답지 칸)·뜻(책에서 첫 등장만, 둘째부터 「이번 장에서 새로 보는 쓰임: 영역」). 상품 근거 = 사실 줄. 원국 참조 = 이름·자리·ref(뜻은 chart 칸).
 * - 연결: 장마다 명리 × MBTI 하나(궁합은 두 사람 카드끼리 하나, 방향 A→B·B→A). 근거가 없으면 없음. 같은 연결은 책에서 한 번, 같은 차원은 책에서 두 번까지.
 * - 장면: 절 재료의 첫 장면 하나(씨앗 · 지식 DB · 관계). 소품(장 sceneHint)은 씨앗 장면 옆 배경으로만 붙인다.
 * - 팩폭: 장당 하나(Shadow 근거 있을 때만). 같은 장의 둘째 팩폭 재료는 근거(「지나칠 때」)로 낮춘다.
 * - 처방: 장마다 마지막 절에 종류 하나(prescriptions RX 14종, 상품별 장 선호표, 같은 종류 책에 두 번까지, 시작 자리 = 고객 해시).
 * - 사실 대조(card_fact_drop): 카드 자리·십성·관계·신살·운성이 정답지(buildFactSheet)와 맞지 않으면 그 근거를 빼고 기록한다.
 * 브리프의 materials·plan·ledger는 그대로 둔다(안전망·이전 책 원장·AM이 쓴다). 작가는 절을 {q, card}로 받는다(prompt/index.ts).
 */
import type { FusionRule, MbtiProfile, MyeongriFeature } from "@/data/knowledge-v5/schema";
import type { PersonFacts, Slot } from "@/lib/factsheet/build";
import { josa, TEN_GOD_KO } from "../labels";
import type { FeatureHit } from "../featureTypes";
import type { Knowledge } from "../knowledge";
import { allocateChapters, PRODUCT_CHAPTER_RX, RX, rxKindsOf, type RxKind } from "../prescriptions";
import type { Brief, ChapterBrief, Material, Trait } from "../schema";
import { splitSentences } from "@/lib/writer/safety/patterns";
import { plainName } from "@/lib/writer/safety/info";
import { AREA6_OF, connectAll, connectionKey, mbtiCards, myeongriCard, plainGrade, type Connection, type FeatureCard } from "./features";

export const CARDS_VERSION = "cards-v1" as const;
/** 같은 차원 연결은 책에서 이 횟수까지. */
export const MAX_DIM_LINKS = 2;
/** 같은 처방 종류는 책에서 이 횟수까지. */
export const MAX_RX_KIND = 2;

export type CardEvidence = { name: string; where: string; meaning?: string; facts?: string[]; ref?: string; rule?: string; traitId?: string; kind?: "context" };
export type SectionCard = { q: string; evidence: CardEvidence[]; link: Connection | null; scene: { text: string; from: "seed" | "knowledge" | "relation"; who?: string; props?: string[] } | null; punch: { text: string; basis: string; warm: string } | null; rx: RxKind | null };
export type CardFactDrop = { chapter: string; section: number; name: string; where: string; reason: string };
export type BookDesign = { version: typeof CARDS_VERSION; cards: FeatureCard[]; links: Connection[]; card_fact_drop: CardFactDrop[] };

export type CardPerson = {
  readonly owner?: "a" | "b";
  readonly callName: string;
  readonly traits: readonly Trait[];
  /** feature id → 엔진 hit(자리·짝). */
  readonly hits: ReadonlyMap<string, FeatureHit>;
  /** 정답지 한 사람분(buildFactSheet). */
  readonly facts: PersonFacts;
  readonly mbti: MbtiProfile | null;
  /** Fusion 사실 조건(시간·성별·맥락). */
  readonly ruleOk: (r: FusionRule) => boolean;
};
export type DesignInput = {
  readonly product: string;
  readonly chapters: ChapterBrief[];
  readonly people: readonly CardPerson[];
  readonly brief: Pick<Brief, "chart" | "mbti" | "shadows" | "compatibility" | "partner" | "ledgerNotes">;
  readonly k: Knowledge;
  /** 고객 해시(처방 시작 자리). */
  readonly spread: number;
  /** 처방 종류를 쓸 수 있는가(입력: 월급날은 직장인만 등). */
  readonly rxFits?: (kind: RxKind) => boolean;
};

const P1: Readonly<Record<string, string>> = { year: "연", month: "월", day: "일", hour: "시" };

/** 카드 자리 이름과 정답지 대조. 맞지 않으면 이유(그 카드 근거를 뺀다). */
export function cardWhere(t: Trait, hit: FeatureHit | undefined, f: PersonFacts): { where: string[]; drop?: string } {
  const [family, code = ""] = t.featureId.split(":");
  const ps = hit?.positions ?? t.positions;
  if (ps.includes("hour") && !f.timeKnown) return { where: [], drop: "시간 미상인데 시 자리" };
  switch (family) {
    case "dayMaster": return f.dayMaster.stem === code ? { where: ["일간"] } : { where: [], drop: `일간 ${f.dayMaster.stem} ≠ ${code}` };
    case "dayPillar": { const d = f.pillars.day; return d && d.stem + d.branch === code ? { where: ["일주"] } : { where: [], drop: `일주 다름(${code})` }; }
    case "stem": { const bad = ps.filter(p => f.pillars[p]?.stem !== code); return bad.length ? { where: [], drop: `천간 ${code} 자리 다름(${bad.join(",")})` } : { where: ps.map(p => `${P1[p]}간`) }; }
    case "branch": { const bad = ps.filter(p => f.pillars[p]?.branch !== code); return bad.length ? { where: [], drop: `지지 ${code} 자리 다름(${bad.join(",")})` } : { where: ps.map(p => `${P1[p]}지`) }; }
    case "tenGod": {
      const ko = TEN_GOD_KO[code as keyof typeof TEN_GOD_KO] ?? code, where: string[] = [];
      for (const p of [...new Set(ps)]) {
        if (p !== "day" && f.tenGods[`${p}Stem` as Slot]?.[0] === ko) where.push(`${P1[p]}간`);
        if (f.tenGods[`${p}Branch` as Slot]?.[0] === ko) where.push(`${P1[p]}지`);
      }
      return where.length ? { where: [...new Set(where)] } : { where: [], drop: `십성 ${ko} 자리 없음(${ps.join(",")})` };
    }
    case "shinsal": case "gwiin": {
      const s = f.shinsal.find(x => x.id === t.featureId);
      if (!s) return { where: [], drop: `정답지에 없는 ${family === "gwiin" ? "귀인" : "신살"}` };
      const bad = ps.filter(p => !s.positions.includes(p));
      if (bad.length) return { where: [], drop: `${s.name} 자리 다름(${bad.join(",")})` };
      // 기둥 단위 신살(백호·괴강 등: 한 기둥의 하늘·땅 글자 둘 다)은 「일주」처럼 기둥 이름으로.
      const pos = [...new Set(s.slots.map(x => x.replace(/(Stem|Branch)$/, "")))];
      return { where: pos.flatMap(p => { const st = s.slots.includes(`${p}Stem` as Slot), br = s.slots.includes(`${p}Branch` as Slot); return st && br ? [`${P1[p]}주`] : st ? [`${P1[p]}간`] : br ? [`${P1[p]}지`] : []; }) };
    }
    case "twelveStage": {
      const bad = ps.filter(p => !f.twelveStages.some(x => x.position === p && x.stage === code));
      return bad.length ? { where: [], drop: `운성 ${code} 자리 다름(${bad.join(",")})` } : { where: ps.map(p => `${P1[p]}지`) };
    }
    case "relation": {
      const r = f.relations.find(x => x.kind === code && (!hit?.variantKey || x.key === hit.variantKey)) ?? f.stemClashes.find(x => x.kind === code && (!hit?.variantKey || x.key === hit.variantKey));
      if (!r) return { where: [], drop: `정답지에 없는 관계 ${code}${hit?.variantKey ? `(${hit.variantKey})` : ""}` };
      const suffix = /^STEM_/.test(code) ? "간" : "지";
      return { where: (hit?.pairs ?? [ps]).map(pair => [...new Set(pair)].map(p => `${P1[p]}${suffix}`).join("·")) };
    }
    default: return { where: ["원국 전체"] };
  }
}

const REF_LABEL: Readonly<Record<string, readonly [string, string]>> = {
  "chart.climate": ["태어난 계절", "월지"], "chart.strength": ["내 힘의 세기", "원국 전체"], "chart.elements": ["오행 분포", "원국 전체"], "chart.yinYang": ["음양 비율", "원국 전체"],
  "chart.thisYear": ["올해 운", "그 해"], "chart.currentDayun": ["지금 대운", "대운"], fortunes: ["좋은 기운", "원국 전체"], unused: ["덜 쓴 기운", "원국 전체"],
  "mbti.functions": ["MBTI 기능", "MBTI"], "compatibility.score": ["궁합 점수", "두 사람"], "compatibility.common": ["두 사람 공통", "두 사람"], "compatibility.complement": ["서로 채우는 점", "두 사람"],
  "compatibility.mbtiConvention": ["MBTI 통념 궁합", "두 사람"], "compatibility.tenGodAB": ["A→B", "두 사람"], "compatibility.tenGodBA": ["B→A", "두 사람"], "compatibility.dayRelations": ["두 사람 일주 관계", "두 사람"],
  "compatibility.differences": ["두 사람 차이", "두 사람"], "compatibility.a": ["A의 바탕", "A"], "compatibility.b": ["B의 바탕", "B"],
};
const whereText = (c: FeatureCard) => c.where.join(c.where.some(w => w.includes("·")) ? " / " : "·");
/** 앞 마디가 이름이 아닌 상품 근거(사실 줄이 문장으로 시작)의 이름. */
const EV_NAME: Readonly<Record<string, string>> = { loveEngine: "배우자 자리", matchTypes: "맞는 사람", childStar: "자녀 별", jobGroups: "넓혀 갈 직군", jobGroupsFar: "길게 볼 직군", investMistakes: "투자에서 되풀이하기 쉬운 실수", investPrinciples: "투자 원칙", spouseStar: "배우자 별", childPalace: "자녀 자리" };
/**
 * W3 P3 보강 — 이름으로 쓰지 않는 상품 근거 자리표 말(사실의 이름이 아니라 칸 이름). 이런 머리면 사실 줄이 든 십성·신살·관계·간지 이름을 찾아 이름으로 쓰고,
 * 그것도 없으면 맥락 근거(kind context — 작가에게 이름을 보내지 않고 지표는 사실 낱말로 센다).
 */
const GENERIC_EV = new Set(["관계 상태", "상태", "맞는 사람", "통념상 잘 맞는 조합", "호감 표현", "호감 표현 장면", "관계가 위험할 때의 신호", "피해야 할 신호", "점검", "상황 씨앗", "배우자 자리", "자녀 자리", "배우자 별", "자녀 별", "관계 신살",
  "연애 기능", "의사결정", "보이는 힘", "넓혀 갈 직군", "길게 볼 직군", "투자에서 되풀이하기 쉬운 실수", "투자 원칙", "분기 이름", "지칠 때 돈이 새는 신호", "판정", "근거 없음", "뿌리 자리", "지금 대운", "조건형", "자녀", "앞 장 종합", "새 인연을 만나기 좋은 곳", "십이운성", "태어난 달 기둥", "태어난 날 기둥", "태어난 해 기둥", "태어난 시각 기둥"]);
const TG_NAMES = "비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인|비겁|식상|재성|관성|인성", GZ = "[갑을병정무기경신임계][자축인묘진사오미신유술해]";
const STAGE_NAMES = "장생|목욕|관대|건록|제왕|쇠|병|사|묘|절|태|양";
const POS_KO: Readonly<Record<string, string>> = { 해: "연", 달: "월", 날: "일", 시각: "시" };
const REL_KO: Readonly<Record<string, string>> = { CHUNG: "충", HYEONG: "형", PA: "파", HAE: "해", WONJIN: "원진", YUKHAP: "합", SAMHAP: "합", BANGHAP: "합", STEM_HAP: "합" };
/** 사실 줄 정리(이름 찾기용): 한자만 든 괄호를 떼고 간지 한자는 한글로, 한글 괄호는 괄호만 푼다(「기운(편관·정관)이」의 십성을 남긴다). */
const factLine = (s: string) => plainName(s.replace(/\(([^()]*[가-힣][^()]*)\)/g, " $1 ")).replace(/\s{2,}/g, " ");
/** 십성·관계 이름 뒤 조사(「정관은」「편관이고」「인성이 강해」). */
const AFTER = "(?=$|[^가-힣]|(?:은|는|이|가|을|를|의|과|와|도|로|에|이고|이라|이며|으로|입니다|이에요)(?![가-힣]))";
/** 사실 줄이 든 이름 하나(해 간지·십성 → 대운 간지 → 간지 짝 관계 → 신살·귀인 → 십성(「편관·정관」 이어 쓴 것은 함께) → MBTI 유형(줄마다 모아) → 십이운성 → 기둥 간지). */
function factName(facts: readonly string[]): { name: string; line: string; kind: "year" | "dayun" | "rel" | "shinsal" | "tg" | "mbti" | "stage" | "pillar" } | null {
  const lines = facts.map(factLine);
  for (const l of lines) { const m = l.match(new RegExp(`(20\\d\\d)년 (?:(${GZ}) )?(${TG_NAMES})?${AFTER}`)); if (m && (m[2] || m[3])) return { name: [`${m[1]}년`, m[2], m[3]].filter(Boolean).join(" "), line: l, kind: "year" }; }
  for (const l of lines) { const m = l.match(new RegExp(`대운: (${GZ})`)) ?? l.match(new RegExp(`(${GZ}) 대운`)); if (m) return { name: `${m[1]} 대운`, line: l, kind: "dayun" }; }
  for (const l of lines) { const m = l.match(new RegExp(`(?<![가-힣])([자축인묘진사오미신유술해]{2,3}) ?(충|합|형|파|해|원진)${AFTER}`)); if (m) return { name: `${m[1]} ${m[2]}`, line: l, kind: "rel" }; }
  for (const l of lines) { const m = l.match(/(?<![가-힣])(?!신살(?![가-힣]))([가-힣]{1,4}(?:살|귀인))(?=[\s:·,)]|$|(?:은|는|이|가|을|를|의|과|와|도|로|에)(?![가-힣]))/); if (m) return { name: m[1], line: l, kind: "shinsal" }; }
  for (const l of lines) { const m = l.match(new RegExp(`(?<![가-힣])((?:${TG_NAMES})(?:·(?:${TG_NAMES}))*)${AFTER}`)); if (m) return { name: m[1], line: l, kind: "tg" }; }
  const types = [...new Set(lines.flatMap(l => l.match(/\b[EI][NS][TF][JP]\b/g) ?? []))]; if (types.length) return { name: types.join("·"), line: lines.find(l => l.includes(types[0]))!, kind: "mbti" };
  for (const l of lines) { const m = l.match(new RegExp(`십이운성: (${STAGE_NAMES})(?![가-힣])`)); if (m) return { name: `십이운성 ${m[1]}`, line: l, kind: "stage" }; }
  for (const l of lines) { const m = l.match(new RegExp(`기둥: (${GZ})(?![가-힣])`)); if (m) return { name: m[1], line: l, kind: "pillar" }; }
  return null;
}
/** 사실 줄이 드러낸 자리(「태어난 날(의) 땅 글자」→ 일지, 「태어난 달 기둥」→ 월주, 「배우자 자리」→ 일지, 「자녀 자리」→ 시지, 「뿌리 자리(태어난 해)」→ 연주). 시간 미상이면 시 자리는 뺀다. */
function factWhere(line: string, timeKnown: boolean): string[] {
  const out: string[] = [];
  for (const m of line.matchAll(/태어난 (해|달|날|시각)의? (하늘|땅) 글자/g)) out.push(`${POS_KO[m[1]]}${m[2] === "하늘" ? "간" : "지"}`);
  for (const m of line.matchAll(/태어난 (해|달|날|시각) 기둥/g)) out.push(`${POS_KO[m[1]]}주`);
  if (/배우자 자리/.test(line)) out.push("일지");
  if (/자녀 자리/.test(line)) out.push("시지");
  if (/뿌리 자리/.test(line)) out.push("연주");
  return [...new Set(out)].filter(w => timeKnown || !w.startsWith("시"));
}
/**
 * 상품 근거 → 카드 근거(W3 P3 보강). 이름은 깨끗한 한글(한자·괄호 라벨·「해과」 같은 깨진 조사 없음): 「이름: 뜻」 머리를 정리한 것,
 * 머리가 자리표 말이면 사실 줄이 든 이름(십성·신살·관계·간지). where는 사실이 자리를 가질 때만(사실 줄의 자리 말, 신살·관계는 정답지 칸).
 * 이름을 찾지 못한 자리표 근거는 맥락 근거(kind context).
 */
export function productEvidence(key: string, facts: readonly string[], person: CardPerson | undefined, note?: string): CardEvidence {
  const raw = facts[0]?.match(/^([^:—]{2,40})(?::| —) /)?.[1]?.trim();
  const head = plainName(plainGrade(raw ?? EV_NAME[key] ?? facts[0]?.split(/[.,:·(—→]/)[0]?.trim().slice(0, 20) ?? "")).replace(/^태어난 (?:해|달|날|시각)의? (?:하늘|땅) 글자의 /, "").trim();
  const generic = !head || GENERIC_EV.has(head) || head.length > 16;
  // 머리가 자리표 말이면 사실 줄 전체에서, 아니면 머리에서(해·대운 간지 꼴로 맞추고 신살·관계 자리를 찾는 데만) 이름을 찾는다.
  const found = factName(generic ? facts : [raw ?? head]);
  const timeKnown = person?.facts.timeKnown ?? true;
  const rule = note ? { rule: note } : {};
  if (generic && !found) return { name: head || "맥락", where: factWhere(factLine(facts[0] ?? ""), timeKnown).join("·"), facts: [...facts], ...rule, kind: "context" };
  const name = generic || found?.kind === "year" || found?.kind === "dayun" ? found!.name : head, line = generic ? found!.line : factLine(facts[0] ?? "");
  let where = found?.kind === "year" || found?.kind === "dayun" ? [] : factWhere(line, timeKnown);
  const f = person?.facts;
  if (f && found?.kind === "shinsal") { const s = f.shinsal.find(x => x.name === found.name); if (s) where = [...new Set(s.slots.map(x => `${P1[x.replace(/(Stem|Branch)$/, "")]}${/Stem$/.test(x) ? "간" : "지"}`))]; }
  if (f && found?.kind === "rel") { const [k2, kind] = found.name.split(" "); const r = [...f.relations, ...f.stemClashes].find(x => x.keyKo === k2 && REL_KO[x.kind] === kind); if (r) where = [...new Set(r.members.map(m => `${m.where}${/^STEM_/.test(r.kind) ? "간" : "지"}`))]; }
  return { name, where: where.filter(w => timeKnown || !w.startsWith("시")).join("·"), facts: [...facts], ...rule };
}
/** 특성 카드 이름 정리: 변형 이름이 요소 이름을 되풀이하면(「원진살 묘신 원진」「해 신해해」) 변형 이름만, 한자·괄호 라벨은 뗀다. */
export function plainTraitName(name: string): string {
  const t = plainName(name), w = t.split(" ");
  if (w.length >= 2) { const core = w[0].replace(/살$/, ""); const last = w[w.length - 1]; if (core && (last === core || (w.length === 2 && last.length > core.length && last.endsWith(core)))) return w.slice(1).join(" "); }
  return t;
}

export function designCards(input: DesignInput): BookDesign {
  const { k, brief, people } = input;
  const pair = Boolean(brief.compatibility);
  const name = (p: CardPerson, n: string) => (pair ? `${p.callName}의 ${n}` : n);
  const drops: CardFactDrop[] = [];
  // ① 특징 카드
  const cards: FeatureCard[] = [], byTrait = new Map<string, { card: FeatureCard; drop?: string; person: CardPerson; trait: Trait }>(), mbtiOf = new Map<CardPerson, FeatureCard[]>();
  for (const p of people) {
    for (const t of p.traits) {
      const f: MyeongriFeature | undefined = k.features.get(t.featureId); if (!f) continue;
      const w = cardWhere(t, p.hits.get(t.featureId), p.facts);
      const c0 = myeongriCard(t, f, w.where, k, p.owner), card = { ...c0, name: name(p, plainTraitName(c0.name)) };
      // 자리 글: 같은 특성의 자리는 「·」, 합충형해 짝이 여럿이면 짝 사이를 「 / 」로.
      cards.push(card); byTrait.set(t.id, { card, ...(w.drop ? { drop: w.drop } : {}), person: p, trait: t });
    }
    const mc = p.mbti ? mbtiCards(p.mbti, k, p.owner).map(c => ({ ...c, name: name(p, c.name) })) : [];
    mbtiOf.set(p, mc); cards.push(...mc);
  }
  const cardById = new Map(cards.map(c => [c.id, c]));
  const shadowById = new Map(brief.shadows.map(s => [s.id, s]));
  const rel = brief.compatibility;
  const label = (ref: string): [string, string] => {
    if (ref === "chart.dayMaster") return [brief.chart.dayMaster.name.replace(/\s?\([^)]*\)/g, ""), "일간"];
    if (ref === "mbti") return [brief.mbti?.type ?? "MBTI", "MBTI"];
    const l = REF_LABEL[ref];
    // 「A→B」 = A가 보는 B(조사는 호칭에 맞춰).
    const ab = (s: string) => (!rel ? s : s === "A→B" ? `${josa(rel.a.callName, "이가")} 보는 ${rel.b.callName}` : s === "B→A" ? `${josa(rel.b.callName, "이가")} 보는 ${rel.a.callName}` : s.replace(/^A/, rel.a.callName).replace(/^B/, rel.b.callName));
    return l ? [ab(l[0]), ab(l[1])] : [ref.replace(/^(chart|compatibility)\./, ""), ""];
  };

  // ② 절 카드(근거·장면·팩폭)
  type Slot0 = { ch: ChapterBrief; si: number; card: SectionCard; fusionTraits: Set<string> };
  const slots: Slot0[] = [];
  for (const ch of input.chapters) {
    if (ch.id.includes(":") || !ch.sections) continue;
    let punchUsed = false;
    ch.sections.forEach((sec, si) => {
      const card: SectionCard = { q: sec.q, evidence: [], link: null, scene: null, punch: null, rx: null };
      const fusionTraits = new Set<string>();
      const scene = (s: NonNullable<SectionCard["scene"]>) => { if (!card.scene) card.scene = s; };
      const ev: CardEvidence[] = [];
      for (const m of sec.materials as Material[]) {
        if (m.kind === "trait") {
          const x = byTrait.get(m.traitId); if (!x) continue;
          const meaning = m.angle === "first" ? x.trait.meaning : `이번 장에서 새로 보는 쓰임: ${AREA6_OF[m.domain]}${m.angle === "known" ? "(뜻은 다른 책에서 풀었다)" : ""}`;
          if (x.drop) { drops.push({ chapter: ch.id, section: si, name: x.card.name, where: whereText(x.card), reason: x.drop }); }
          else ev.push({ name: x.card.name, where: whereText(x.card), meaning, traitId: m.traitId });
          if (m.scene) scene({ text: m.scene, from: "knowledge" });
        } else if (m.kind === "mbti") {
          if (m.seedId === "prop") continue;
          scene({ text: m.scene, from: m.seedId ? "seed" : "knowledge", ...(m.who ? { who: m.who } : {}) });
        } else if (m.kind === "rel") scene({ text: m.scene, from: "relation", ...(m.who?.length ? { who: m.who.join(" / ") } : {}) });
        // 상품 근거는 사실 줄을 줄마다 그대로(facts) — 줄 단위 재료 바꾸기·복사 검사가 그대로 돈다.
        else if (m.kind === "evidence") ev.push(productEvidence(m.key, m.facts, people.length === 1 ? people[0] : undefined, m.note));
        else if (m.kind === "ref") {
          const sh = m.ref.match(/^shadows\.(s\d+)$/)?.[1], fu = m.ref.match(/^traits\.([ab]?t\d+)\.fusion$/)?.[1];
          if (sh) {
            const s = shadowById.get(sh); if (!s) continue;
            if (!punchUsed) { card.punch = { text: s.text, basis: s.basis, warm: s.warmTurn }; punchUsed = true; }
            else { const x = byTrait.get(s.traitId); ev.push({ name: `${josa(x?.card.name ?? s.traitId, "이가")} 지나칠 때`, where: (x ? whereText(x.card) : ""), meaning: `${s.text} 근거: ${s.basis}` }); }
          } else if (fu) fusionTraits.add(fu);
          else if (m.ref === "mbti.shadows") { if (brief.mbti?.shadows[0]) ev.push({ name: `${brief.mbti.type}의 그늘`, where: "MBTI", meaning: brief.mbti.shadows[0] }); }
          else if (m.ref.startsWith("chapters.")) { const title = input.chapters.find(c => c.id === m.ref.slice(9))?.title ?? ""; ev.push({ name: "앞 장 종합", where: "", meaning: `「${title}」 장의 근거로`, ...(m.note ? { rule: m.note } : {}), kind: "context" }); }
          else { const [n, w] = label(m.ref); ev.push({ name: n, where: w, ref: m.ref, ...(m.note ? { rule: m.note } : {}) }); }
        }
      }
      // 근거는 trait(뜻) → 상품 근거 → 원국 참조 순으로 3개까지.
      card.evidence = [...ev.filter(e => e.traitId), ...ev.filter(e => !e.traitId && !e.ref), ...ev.filter(e => e.ref)].slice(0, 3);
      // 소품은 씨앗 장면 옆 배경으로만(설계 3): 장 소품 힌트를 씨앗 장면에 붙인다.
      if (card.scene?.from === "seed" && ch.sceneHint?.length && !slots.some(s => s.ch === ch && s.card.scene?.props)) card.scene.props = [...ch.sceneHint];
      sec.card = card;
      slots.push({ ch, si, card, fusionTraits });
    });
  }

  // ③ 장마다 연결 하나
  const usedLinks = new Set<string>(), dimUse = new Map<string, number>(), links: Connection[] = [];
  const rank = (c: Connection) => (c.source.startsWith("fusion:") ? 3 : c.source === "mbtiLink" ? 2 : 1);
  // trait.fusion이 고른 Fusion 규칙(일주에 정확한 유형 규칙이 없으면 그 일간 규칙 — enforceMbtiLinks). 이유 문장은 브리프가 거른 것이라 원문과 같지 않을 수 있다.
  const ruleOf = (t: Trait) => {
    if (t.fusion?.source !== "fusion") return null;
    const stem = t.featureId.match(/[甲乙丙丁戊己庚辛壬癸]/)?.[0];
    const rules = [...(k.fusionByFeature.get(t.featureId) ?? []), ...(t.family === "dayPillar" && stem ? k.fusionByFeature.get(`dayMaster:${stem}`) ?? [] : [])].filter(r => r.mbtiTarget === t.fusion!.target);
    const first = splitSentences(t.fusion.why)[0] ?? "";
    return rules.find(r => r.why === t.fusion!.why) ?? rules.find(r => first && r.why.includes(first)) ?? rules[0] ?? null;
  };
  const chapters = [...new Set(slots.map(s => s.ch))];
  for (const ch of chapters) {
    const mine = slots.filter(s => s.ch === ch);
    type Cand = { slot: Slot0; conn: Connection; score: number };
    const cands: Cand[] = [];
    for (const slot of mine) for (const e of slot.card.evidence) {
      const x = e.traitId ? byTrait.get(e.traitId) : undefined; if (!x || x.drop) continue;
      const bonus = slot.fusionTraits.has(x.trait.id) ? 10 : 0;
      if (!pair) {
        const mc = mbtiOf.get(x.person) ?? []; if (!mc.length) continue;
        const t = x.trait, target = t.fusion ? mc.find(c => c.key === t.fusion!.target) ?? mc[0] : mc[0];
        const conns = t.fusion ? connectAll(x.card, target, k, t.fusion.source === "fusion" ? { rule: ruleOf(t), kind: t.fusion.kind, why: t.fusion.why } : t.fusion.source === "mbtiLink" ? { rule: null, kind: t.fusion.kind, why: t.fusion.why, source: "mbtiLink" } : { rule: null })
          : connectAll(x.card, mc[0], k, { ruleOk: x.person.ruleOk });
        conns.forEach((conn, i) => cands.push({ slot, conn, score: bonus + rank(conn) - i * 0.1 }));
      } else {
        // 궁합: 두 사람 카드끼리(상대의 MBTI 유형 카드 → 상대의 명리 카드). 방향은 카드 주인 → 상대.
        const other = people.find(p => p !== x.person); if (!other) continue;
        const targets = [...(mbtiOf.get(other) ?? []).slice(0, 1), ...[...byTrait.values()].filter(y => y.person === other && !y.drop && y.trait.chapters.length).map(y => y.card)];
        for (const target of targets) {
          // Fusion 규칙은 한 사람 안의 명리 × MBTI라 두 사람 사이에는 쓰지 않는다(차원 양끝 설명으로 잇는다).
          const d = rel!.score.direction[x.person.owner === "a" ? "aToB" : "bToA"];
          const [from, to] = x.person.owner === "a" ? [rel!.a.callName, rel!.b.callName] : [rel!.b.callName, rel!.a.callName];
          connectAll(x.card, target, k, { rule: null }).forEach((conn, i) => cands.push({ slot, conn: { ...conn, dir: `${from}→${to}: ${d.tenGod}(${d.role})` }, score: bonus + rank(conn) + (target.system === "mbti" ? 0.5 : 0) - i * 0.1 }));
        }
      }
    }
    // 같은 연결(두 카드 + 차원)은 책에서 한 번, 같은 차원은 두 번까지, 같은 MBTI 쪽(상대 카드) + 같은 차원도 한 번(계산 이유 문장이 같아진다).
    const sideKey = (c: Connection) => (c.source === "computed" ? `${cardById.get(c.b)?.key ?? c.b}|${c.tag}` : `-${connectionKey(c, cardById)}`);
    const best = cands.filter(c => !usedLinks.has(connectionKey(c.conn, cardById)) && !usedLinks.has(sideKey(c.conn)) && (dimUse.get(c.conn.tag) ?? 0) < MAX_DIM_LINKS)
      .sort((a, b) => b.score - a.score || a.slot.si - b.slot.si || a.conn.a.localeCompare(b.conn.a) || a.conn.b.localeCompare(b.conn.b))[0];
    if (!best) continue;
    best.slot.card.link = best.conn; usedLinks.add(connectionKey(best.conn, cardById)); usedLinks.add(sideKey(best.conn)); dimUse.set(best.conn.tag, (dimUse.get(best.conn.tag) ?? 0) + 1); links.push(best.conn);
  }

  // ④ 처방: 장마다 마지막 절에 한 종류(같은 종류 책에 두 번까지, 이전 책 처방 종류는 피한다).
  const avoid = new Set((brief.ledgerNotes?.avoidActions ?? []).flatMap(rxKindsOf));
  const table = PRODUCT_CHAPTER_RX[input.product] ?? {};
  const rx = allocateChapters(chapters.map((c, i) => ({ n: i + 1, id: c.id, keyed: false })), new Map(), { table, cap: MAX_RX_KIND, spread: input.spread, avoid, fits: input.rxFits, fallback: RX.map(([kd]) => kd) });
  chapters.forEach((ch, i) => { const use = rx.get(i + 1)?.use ?? null; const last = slots.filter(s => s.ch === ch).at(-1); if (last && use) last.card.rx = use; });

  return { version: CARDS_VERSION, cards, links, card_fact_drop: drops };
}

/** 작가에게 보이는 카드(빈 칸 빼고, 연결 카드 id → 이름). */
export function writerCard(c: SectionCard | import("../schema").SectionCardBrief, cards: ReadonlyMap<string, FeatureCard>, propOk: (h: string) => boolean = () => true): Record<string, unknown> {
  const nm = (id: string) => cards.get(id)?.name ?? id;
  const props = c.scene?.props?.filter(propOk);
  return {
    ...(c.evidence.length ? { evidence: c.evidence.map(e => ({ ...(e.traitId ? { id: e.traitId } : {}), ...(e.kind === "context" ? {} : { name: e.name }), ...(e.where ? { where: e.where } : {}), ...(e.meaning ? { meaning: e.meaning } : {}), ...(e.facts ? { facts: e.facts } : {}), ...(e.ref ? { ref: e.ref } : {}), ...(e.rule ? { rule: e.rule } : {}) })) } : {}),
    ...(c.link ? { link: { kind: c.link.kind, a: nm(c.link.a), b: nm(c.link.b), tag: c.link.tagName, why: c.link.why, ...(c.link.dir ? { dir: c.link.dir } : {}) } } : {}),
    ...(c.scene ? { scene: { text: c.scene.text, ...(c.scene.who ? { who: c.scene.who } : {}), ...(props?.length ? { props } : {}) } } : {}),
    ...(c.punch ? { punch: c.punch } : {}),
    ...(c.rx ? { rx: c.rx } : {}),
  };
}
