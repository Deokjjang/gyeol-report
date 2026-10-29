/**
 * TimelineEntry 결정론 생성(SPEC §5): 키, 간지(한자·한글)와 오행 색, 십성, 합충형파해 배지, 부족 오행 채움, 흐름 세기(1~5, 근거), 키워드, 추천 행동, 해석 재료.
 * 행동 템플릿은 (십성, 영역, 세기 구간)으로 고르고 영역을 돌려 같은 템플릿이 두 번 나오지 않게 한다.
 */
import { TIMELINE_ACTION_DOMAINS } from "@/data/knowledge-v5/schema";
import { scoreFlow, type FlowInput } from "@/data/knowledge-v5/flow-score";
import { BRANCH_MAIN_ELEMENT, HEAVENLY_STEMS, HIDDEN_STEMS } from "@/lib/saju/constants";
import type { CustomerDayunCycle } from "@/lib/saju/customerDayun";
import { analyzeIncoming, getAnnualPillar, getMonthlyPillars } from "@/lib/saju/detections";
import type { ChartPosition, RelationHit, RelationMember, TemporalPosition } from "@/lib/saju/detections/types";
import type { Pillar, SajuCalcResult, TenGod } from "@/lib/saju/types";
import { inflowEffect, type ElementState } from "./chart";
import { sceneFits, type FactProfile } from "./facts";
import type { Badge, Knowledge } from "./knowledge";
import { colorsOf, ELEMENT_KO, ganjiLabel, ganjiOf, POSITION_KO, TEN_GOD_GROUP, TEN_GOD_KO, tenGodLabel } from "./labels";
import type { Rng } from "./seed";
import type { TimelineEntry, Trait } from "./schema";

const STRENGTH_MAP = { VERY_WEAK: "WEAK", WEAK: "WEAK", BALANCED: "BALANCED", STRONG: "STRONG", VERY_STRONG: "STRONG" } as const;
const NATAL: readonly string[] = ["year", "month", "day", "hour"];
/** 흐름 근거 짧은 이름(전체 문장은 flow-rule.json). */
const FLOW_SHORT: Record<string, string> = {
  fillsLack: "부족한 기운을 채움", feedsExcess: "이미 많은 기운이 더 들어옴", clashDay: "태어난 날 글자와 부딪힘", clashMonth: "태어난 달 글자와 부딪힘",
  clashOther: "태어난 해·시각 글자와 부딪힘", hapDay: "태어난 날 기둥과 합", samhap: "세 글자 합이 완성", officerIn: "책임·압박의 기운이 들어옴",
  wealthOnWeak: "힘이 약한데 재물 기운이 들어옴", resourceOnWeak: "힘이 약한데 받쳐 주는 기운이 들어옴", peerOnStrong: "힘이 센데 같은 기운이 더 들어옴",
  outputOnStrong: "힘이 센데 내보내는 기운이 들어옴", gongmang: "빈칸(공망)에 듦", monthScope: "월 단위라 한 단계 낮춤",
};

/** clashOther는 실제로 부딪친 자리만 쓴다(P3.6 B: 시간 미상 고객에게 "해·시각"이 나가 시주를 쓴 것처럼 읽혔다). */
function flowShort(key: string, clashes: readonly ChartPosition[]): string | undefined {
  if (key !== "clashOther") return FLOW_SHORT[key];
  const where = (["year", "hour"] as const).filter(p => clashes.includes(p)).map(p => ({ year: "해", hour: "시각" })[p]).join("·");
  return `태어난 ${where} 글자와 부딪힘`;
}

export type TimelineCtx = {
  readonly saju: SajuCalcResult; readonly k: Knowledge; readonly st: ElementState; readonly facts: FactProfile;
  readonly rng: Rng; readonly usedScenes: Set<string>; readonly usedTemplates: Set<string>;
  /** 원국 trait(P3.7 1-1): 그해·그달 글자가 실제로 건드리는 것만 항목 재료(touched)가 된다. */
  readonly traits?: readonly TraitRef[];
};
type TraitRef = Pick<Trait, "id" | "featureId" | "family" | "positions">;

/** 관계 쉬운 이름(용어 사전 easy와 같은 결). */
const REL_EASY: Record<string, string> = {
  STEM_HAP: "끌려 붙는 합(천간합)", YUKHAP: "짝꿍처럼 붙는 합(육합)", SAMHAP: "세 글자 한 팀(삼합)", BANGHAP: "같은 계절 모임(방합)",
  CHUNG: "서로 부딪치는 기운(충)", HYEONG: "서로 조이는 기운(형)", PA: "금이 가게 하는 기운(파)", HAE: "서로 거슬리는 기운(해)", WONJIN: "신발 속 모래알 같은 기운(원진)",
};
const relEasy = (r: RelationHit) => r.kind === "SAMHAP" && r.completeness !== "full" ? "반쯤 맺힌 짝(반합)" : REL_EASY[r.kind] ?? r.kind;
const GROUP_EASY = { PEER: "나와 같은 기운(비겁)", OUTPUT: "표현하는 기운(식상)", WEALTH: "재물 기운(재성)", OFFICER: "책임의 기운(관성)", RESOURCE: "받쳐 주는 기운(인성)" } as const;

/**
 * 그해·그달 글자가 건드리는 원국 trait(P3.7 1-1): ① 합충형파해로 엮인 자리의 trait, ② 같은 십성(묶음)으로 세지거나 채워지는 trait, ③ 부족 오행을 채우거나 많은 오행을 더하는 trait.
 * 해당이 없으면 빈 목록(원국 특성을 억지로 넣지 않는다). 순서 = 우선순위.
 */
/** trait가 그 자리의 천간·지지 중 관계가 걸린 글자 쪽에 있는가(P3.7 r2: 월간 乙의 을경합을 월지 丑의 묘(墓) trait에 이었다). */
function onGlyph(saju: SajuCalcResult, t: TraitRef, m: RelationMember & { position: ChartPosition }): boolean {
  const isStem = (HEAVENLY_STEMS as readonly string[]).includes(m.char);
  const [fam, key] = t.featureId.split(":");
  if (fam === "dayPillar" || fam === "relation") return true;
  if (fam === "stem" || fam === "branch") return key === m.char;
  if (fam === "dayMaster") return isStem;
  if (fam === "tenGod") return isStem
    ? m.position !== "day" && saju.tenGods.stems[m.position] === key
    : saju.tenGods.hiddenStems.find(h => h.branch === m.char && h.stem === HIDDEN_STEMS[m.char as keyof typeof HIDDEN_STEMS][0].stem)?.tenGod === key;
  return !isStem; // 십이운성·신살·귀인은 지지 자리
}

function touchedTraits(ctx: TimelineCtx, inc: ReturnType<typeof analyzeIncoming>, eff: ReturnType<typeof inflowEffect>): { traitId: string; how: string }[] {
  const out: { traitId: string; how: string }[] = [];
  const add = (traitId: string, how: string) => { if (!out.some(x => x.traitId === traitId)) out.push({ traitId, how }); };
  for (const r of inc.relations) {
    const natal = r.members.filter((m): m is RelationMember & { position: ChartPosition } => NATAL.includes(m.position));
    for (const t of ctx.traits ?? []) {
      // 합충형파해 trait는 같은 종류의 관계가 다시 걸릴 때만 건드려진다(P3.7 r1: 파 trait를 합이 건드린다고 이어 "합이 파를 푼다"로 읽혔다).
      if ((t.family === "relation" && t.featureId !== `relation:${r.kind}`) || (t.featureId === "shinsal:WONJIN" && r.kind !== "WONJIN")) continue;
      const m = natal.find(x => t.positions.includes(x.position) && onGlyph(ctx.saju, t, x));
      if (m) add(t.id, `${POSITION_KO[m.position]} 글자와 ${relEasy(r)}`);
    }
  }
  for (const t of ctx.traits ?? []) {
    const [fam, key, state] = t.featureId.split(":");
    if (fam === "tenGod" && (key === inc.stemTenGod || key === inc.branchTenGod)) add(t.id, `같은 ${TEN_GOD_KO[key as TenGod]} 기운이 또 들어와 더 세짐`);
    if (fam === "tenGodBalance" && key === TEN_GOD_GROUP[inc.stemTenGod]) add(t.id, state === "WEAK" ? `부족한 ${GROUP_EASY[key as keyof typeof GROUP_EASY]}이 채워짐` : `이미 많은 ${GROUP_EASY[key as keyof typeof GROUP_EASY]}이 더 커짐`);
    if (fam === "element" && (state === "WEAK" || state === "MISSING") && eff.fills.includes(key as never)) add(t.id, `부족한 ${ELEMENT_KO[key as keyof typeof ELEMENT_KO]} 기운이 채워짐`);
    if (fam === "element" && state === "STRONG" && eff.feeds.includes(key as never)) add(t.id, `이미 많은 ${ELEMENT_KO[key as keyof typeof ELEMENT_KO]} 기운이 더 들어옴`);
  }
  return out;
}

function badgeFor(hit: RelationHit, k: Knowledge): Badge | undefined {
  const pairs = [hit.key, [...hit.key].reverse().join("")];
  return k.badges.find(b => b.kind === hit.kind && b.pair !== undefined && pairs.includes(b.pair)) ?? k.badges.find(b => b.kind === hit.kind && b.pair === undefined);
}

function pickAction(ctx: TimelineCtx, tenGod: TenGod, flow: number, slot: number): { templateId: string; text: string } {
  const band = flow >= 4 ? "high" : "low";
  // 학생이 아니면 시험 공부 행동, 기혼이면 연애 행동을 주지 않는다(P3.7 r1: 37세 기혼 간호사에게 연애형 행동을 억지로 각색).
  const domains = TIMELINE_ACTION_DOMAINS.filter(d => !(d === "study" && ctx.facts.job !== "student") && !(d === "love" && ctx.facts.relationship === "married"));
  const n = domains.length;
  for (let i = 0; i < n * 2; i++) {
    const domain = domains[(slot + i) % n];
    const b = i < n ? band : band === "high" ? "low" : "high";
    const t = ctx.k.actions.find(a => a.id === `act:${tenGod}:${domain}:${b}`);
    if (t && !ctx.usedTemplates.has(t.id)) { ctx.usedTemplates.add(t.id); return { templateId: t.id, text: ctx.rng.fork(t.id).pick(t.text) }; }
  }
  const fallback = ctx.k.actions.find(a => a.id === `tg:${tenGod}`)!;
  return { templateId: fallback.id, text: ctx.rng.fork(`fb:${slot}`).pick(fallback.text) };
}

function pickScene(ctx: TimelineCtx, list: readonly { text: string; requires: Parameters<typeof sceneFits>[0] }[], label: string): string | undefined {
  const ok = list.filter(s => sceneFits(s.requires, ctx.facts) && !ctx.usedScenes.has(s.text));
  if (!ok.length) return undefined;
  const s = ctx.rng.fork(label).pick(ok); ctx.usedScenes.add(s.text); return s.text;
}

export function buildEntry(ctx: TimelineCtx, kind: "year" | "month", key: string, label: string, pillar: Pillar, position: TemporalPosition, slot: number, extra: Partial<TimelineEntry> = {}): TimelineEntry {
  const { saju, k, st } = ctx;
  const inc = analyzeIncoming(saju, position, pillar);
  const natalOf = (hits: readonly RelationHit[]) => [...new Set(hits.flatMap(h => h.members.map(m => m.position)).filter(p => NATAL.includes(p)))] as ChartPosition[];
  const flowInput: FlowInput = {
    kind, incomingElement: BRANCH_MAIN_ELEMENT[pillar.branch], lackElements: st.lacking, excessElements: st.excess,
    tenGod: inc.stemTenGod, dayMasterStrength: STRENGTH_MAP[saju.structureAnalysis.dayMasterStrength.level],
    clashes: natalOf(inc.relations.filter(r => r.kind === "CHUNG")),
    haps: natalOf(inc.relations.filter(r => r.kind === "STEM_HAP" || r.kind === "YUKHAP")),
    samhapComplete: inc.relations.some(r => r.kind === "SAMHAP" && r.completeness === "full"),
    gongmang: inc.gongmang,
  };
  const flow = scoreFlow(k.flowRule, flowInput);
  const badges: TimelineEntry["badges"] = [];
  for (const r of inc.relations) {
    // 어느 원국 자리와 엮였는지(P3.7 1-1·1-5): "태어난 달 글자와". 같은 배지가 여러 자리와 엮이면 자리를 잇는다.
    const natal = [...new Set(r.members.map(m => m.position).filter((p): p is ChartPosition => NATAL.includes(p)))].map(p => POSITION_KO[p]);
    const b = badgeFor(r, k); if (!b) continue;
    const same = badges.find(x => x.kind === b.kind && x.pair === b.pair);
    if (same) { const w = [...new Set([...(same.with?.split("·") ?? []), ...natal])]; if (w.length) same.with = w.join("·"); continue; }
    // 세 글자 중 두 글자만 만난 합은 "완성"이 아니다(P3.6 B: 반합을 "팀이 완성"으로 썼다).
    const half = r.kind === "SAMHAP" && r.completeness !== "full";
    badges.push({ kind: b.kind, ...(b.pair ? { pair: b.pair } : {}), label: half ? `${b.label}(반쯤)` : b.label, line: half ? `두 글자만 만나 반쯤 맺힌 팀: ${b.line.replace(/완성/g, "반쯤 맺힘")}` : b.line, tone: b.tone, ...(natal.length ? { with: natal.join("·") } : {}) });
  }
  if (inc.gongmang) { const b = k.badges.find(x => x.kind === "GONGMANG" && !x.pair); if (b) badges.push({ kind: b.kind, label: b.label, line: b.line, tone: b.tone }); }
  const eff = inflowEffect(pillar, st);
  const g = k.ganji.get(pillar.stem + pillar.branch)!;
  const period = k.tenGodPeriod.get(inc.stemTenGod)!;
  const stage = k.features.get(`twelveStage:${inc.twelveStage}`);
  const scene = pickScene(ctx, kind === "year" ? period.year.scenes : period.month.scenes, `scene:${key}`);
  const touched = touchedTraits(ctx, inc, eff);
  return {
    key, label, kind, ganji: ganjiOf(pillar), colors: colorsOf(pillar),
    tenGod: { stem: tenGodLabel(inc.stemTenGod), branch: tenGodLabel(inc.branchTenGod) },
    badges,
    fillsLack: { fills: eff.fills.length > 0, elements: eff.fills, feedsExcess: eff.feeds },
    flow: { score: flow.score, label: flow.label, basis: flow.applied.map(a => `${flowShort(a.key, flowInput.clashes) ?? a.when} ${a.delta > 0 ? "+" : ""}${a.delta}`), note: "참고" },
    keywords: (kind === "year" ? g.year.keywords : g.month.keywords).slice(0, 3),
    action: pickAction(ctx, inc.stemTenGod, flow.score, slot),
    material: {
      image: g.image.metaphor, mood: kind === "year" ? g.year.mood : g.month.mood,
      ...(scene ? { scene } : {}),
      stage: stage ? `${stage.name} — ${stage.oneLiner}` : inc.twelveStage,
    },
    ...(touched.length ? { touched } : {}),
    ...extra,
  };
}

/** 앞 항목과 달라진 점 한 줄(P3.6 B: 원고에 "지난해·지난달"과의 차이가 없었다). */
const changeOf = (prev: TimelineEntry | undefined, unit: "해" | "달", stem: string, score: number) => prev
  ? { change: { tenGodFrom: prev.tenGod.stem, flowFrom: prev.flow.score, line: `지난${unit}보다 흐름 세기 ${prev.flow.score}→${score}${prev.tenGod.stem !== stem ? `, 들어오는 기운 ${prev.tenGod.stem.replace(/\(.*\)/, "")}→${stem.replace(/\(.*\)/, "")}` : ", 같은 기운이 이어짐"}` } } : {};

/** 대운 상품: 지나온 3년 → 올해 → 앞으로 10년 = 14개 연도. when: 지난해는 돌아보는 말로 쓴다. */
export function buildYearEntries(ctx: TimelineCtx, thisYear: number, cycles: readonly CustomerDayunCycle[]): TimelineEntry[] {
  const start = ctx.rng.fork("slot").int(6);
  const out: TimelineEntry[] = [];
  for (let i = 0; i < 14; i++) {
    const year = thisYear - 3 + i;
    const pillar = getAnnualPillar(year);
    const cyc = cycles.find(c => c.startYear <= year && year <= c.endYear);
    const transition = Boolean(cyc && cyc.startYear === year);
    const e = buildEntry(ctx, "year", String(year), `${year}년 ${ganjiLabel(pillar)}${year === thisYear ? " (올해)" : ""}${transition ? " · 새 대운 시작" : ""}`, pillar, "annual", start + i,
      { ...(cyc ? { dayun: { ganji: `${cyc.ganji} 대운`, transition } } : {}), when: year < thisYear ? "past" : year === thisYear ? "now" : "future" });
    out.push({ ...e, ...changeOf(out.at(-1), "해", e.tenGod.stem, e.flow.score) });
  }
  return out;
}

/** 세운 상품: 선택 연도 절기 12개월(寅월~丑월). 앞달과의 차이(change)를 단다. */
export function buildMonthEntries(ctx: TimelineCtx, year: number, baseDate?: string): TimelineEntry[] {
  const start = ctx.rng.fork("slot").int(6);
  const out: TimelineEntry[] = [];
  const months = getMonthlyPillars(year);
  months.forEach((m, i) => {
    const date = m.startKst.slice(5, 10).replace("-", "/");
    // 기준일이 이미 지난 절기월은 past, 기준일이 든 달은 now(P3.6 B: 지난달을 예보처럼 썼다).
    const next = months[i + 1]?.startKst.slice(0, 10);
    const when = !baseDate ? undefined : next && next <= baseDate ? "past" : m.startKst.slice(0, 10) <= baseDate ? "now" : "future";
    const e = buildEntry(ctx, "month", `${year}-M${String(m.index).padStart(2, "0")}`, `${m.index}번째 달 ${ganjiLabel(m.pillar)} (${date} 절입부터)${when === "now" ? " (이번 달)" : ""}`, m.pillar, "monthly", start + m.index,
      when ? { when } : {});
    out.push({ ...e, ...changeOf(out.at(-1), "달", e.tenGod.stem, e.flow.score) });
  });
  return out;
}

export function cycleSummary(cycles: readonly CustomerDayunCycle[], from: number, to: number, thisYear: number, getTenGodFn: (s: Pillar["stem"]) => TenGod) {
  return cycles.filter(c => c.endYear >= from && c.startYear <= to).map(c => ({ ganji: ganjiLabel(c), years: `${c.startYear}~${c.endYear}`, tenGod: tenGodLabel(getTenGodFn(c.stem)), current: c.startYear <= thisYear && thisYear <= c.endYear }));
}
