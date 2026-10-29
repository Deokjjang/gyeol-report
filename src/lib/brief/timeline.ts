/**
 * TimelineEntry 결정론 생성(SPEC §5): 키, 간지(한자·한글)와 오행 색, 십성, 합충형파해 배지, 부족 오행 채움, 흐름 세기(1~5, 근거), 키워드, 추천 행동, 해석 재료.
 * 행동 템플릿은 (십성, 영역, 세기 구간)으로 고르고 영역을 돌려 같은 템플릿이 두 번 나오지 않게 한다.
 */
import { TIMELINE_ACTION_DOMAINS } from "@/data/knowledge-v5/schema";
import { scoreFlow, type FlowInput } from "@/data/knowledge-v5/flow-score";
import { BRANCH_MAIN_ELEMENT } from "@/lib/saju/constants";
import type { CustomerDayunCycle } from "@/lib/saju/customerDayun";
import { analyzeIncoming, getAnnualPillar, getMonthlyPillars } from "@/lib/saju/detections";
import type { ChartPosition, RelationHit, TemporalPosition } from "@/lib/saju/detections/types";
import type { Pillar, SajuCalcResult, TenGod } from "@/lib/saju/types";
import { inflowEffect, type ElementState } from "./chart";
import { sceneFits, type FactProfile } from "./facts";
import type { Badge, Knowledge } from "./knowledge";
import { colorsOf, ganjiLabel, ganjiOf, tenGodLabel } from "./labels";
import type { Rng } from "./seed";
import type { TimelineEntry } from "./schema";

const STRENGTH_MAP = { VERY_WEAK: "WEAK", WEAK: "WEAK", BALANCED: "BALANCED", STRONG: "STRONG", VERY_STRONG: "STRONG" } as const;
const NATAL: readonly string[] = ["year", "month", "day", "hour"];
/** 흐름 근거 짧은 이름(전체 문장은 flow-rule.json). */
const FLOW_SHORT: Record<string, string> = {
  fillsLack: "부족한 기운을 채움", feedsExcess: "이미 많은 기운이 더 들어옴", clashDay: "태어난 날 글자와 부딪힘", clashMonth: "태어난 달 글자와 부딪힘",
  clashOther: "태어난 해·시각 글자와 부딪힘", hapDay: "태어난 날 기둥과 합", samhap: "세 글자 합이 완성", officerIn: "책임·압박의 기운이 들어옴",
  wealthOnWeak: "힘이 약한데 재물 기운이 들어옴", resourceOnWeak: "힘이 약한데 받쳐 주는 기운이 들어옴", peerOnStrong: "힘이 센데 같은 기운이 더 들어옴",
  outputOnStrong: "힘이 센데 내보내는 기운이 들어옴", gongmang: "빈칸(공망)에 듦", monthScope: "월 단위라 한 단계 낮춤",
};

export type TimelineCtx = {
  readonly saju: SajuCalcResult; readonly k: Knowledge; readonly st: ElementState; readonly facts: FactProfile;
  readonly rng: Rng; readonly usedScenes: Set<string>; readonly usedTemplates: Set<string>;
};

function badgeFor(hit: RelationHit, k: Knowledge): Badge | undefined {
  const pairs = [hit.key, [...hit.key].reverse().join("")];
  return k.badges.find(b => b.kind === hit.kind && b.pair !== undefined && pairs.includes(b.pair)) ?? k.badges.find(b => b.kind === hit.kind && b.pair === undefined);
}

function pickAction(ctx: TimelineCtx, tenGod: TenGod, flow: number, slot: number): { templateId: string; text: string } {
  const band = flow >= 4 ? "high" : "low";
  const n = TIMELINE_ACTION_DOMAINS.length;
  for (let i = 0; i < n * 2; i++) {
    const domain = TIMELINE_ACTION_DOMAINS[(slot + i) % n];
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
  for (const r of inc.relations) { const b = badgeFor(r, k); if (b && !badges.some(x => x.kind === b.kind && x.pair === b.pair)) badges.push({ kind: b.kind, ...(b.pair ? { pair: b.pair } : {}), label: b.label, line: b.line, tone: b.tone }); }
  if (inc.gongmang) { const b = k.badges.find(x => x.kind === "GONGMANG" && !x.pair); if (b) badges.push({ kind: b.kind, label: b.label, line: b.line, tone: b.tone }); }
  const eff = inflowEffect(pillar, st);
  const g = k.ganji.get(pillar.stem + pillar.branch)!;
  const period = k.tenGodPeriod.get(inc.stemTenGod)!;
  const stage = k.features.get(`twelveStage:${inc.twelveStage}`);
  const scene = pickScene(ctx, kind === "year" ? period.year.scenes : period.month.scenes, `scene:${key}`);
  return {
    key, label, kind, ganji: ganjiOf(pillar), colors: colorsOf(pillar),
    tenGod: { stem: tenGodLabel(inc.stemTenGod), branch: tenGodLabel(inc.branchTenGod) },
    badges,
    fillsLack: { fills: eff.fills.length > 0, elements: eff.fills, feedsExcess: eff.feeds },
    flow: { score: flow.score, label: flow.label, basis: flow.applied.map(a => `${FLOW_SHORT[a.key] ?? a.when} ${a.delta > 0 ? "+" : ""}${a.delta}`), note: "참고" },
    keywords: (kind === "year" ? g.year.keywords : g.month.keywords).slice(0, 3),
    action: pickAction(ctx, inc.stemTenGod, flow.score, slot),
    material: {
      image: g.image.metaphor, mood: kind === "year" ? g.year.mood : g.month.mood,
      ...(scene ? { scene } : {}),
      stage: stage ? `${stage.name} — ${stage.oneLiner}` : inc.twelveStage,
    },
    ...extra,
  };
}

/** 대운 상품: 지나온 3년 → 올해 → 앞으로 10년 = 14개 연도. */
export function buildYearEntries(ctx: TimelineCtx, thisYear: number, cycles: readonly CustomerDayunCycle[]): TimelineEntry[] {
  const start = ctx.rng.fork("slot").int(6);
  return Array.from({ length: 14 }, (_, i) => {
    const year = thisYear - 3 + i;
    const pillar = getAnnualPillar(year);
    const cyc = cycles.find(c => c.startYear <= year && year <= c.endYear);
    return buildEntry(ctx, "year", String(year), `${year}년 ${ganjiLabel(pillar)}${year === thisYear ? " (올해)" : ""}`, pillar, "annual", start + i,
      cyc ? { dayun: { ganji: `${cyc.ganji} 대운`, transition: cyc.startYear === year } } : {});
  });
}

/** 세운 상품: 선택 연도 절기 12개월(寅월~丑월). 앞달과의 차이(change)를 단다. */
export function buildMonthEntries(ctx: TimelineCtx, year: number): TimelineEntry[] {
  const start = ctx.rng.fork("slot").int(6);
  const out: TimelineEntry[] = [];
  for (const m of getMonthlyPillars(year)) {
    const prev = out.at(-1);
    const date = m.startKst.slice(5, 10).replace("-", "/");
    out.push(buildEntry(ctx, "month", `${year}-M${String(m.index).padStart(2, "0")}`, `${m.index}번째 달 ${ganjiLabel(m.pillar)} (${date} 절입부터)`, m.pillar, "monthly", start + m.index,
      prev ? { change: { tenGodFrom: prev.tenGod.stem, flowFrom: prev.flow.score } } : {}));
  }
  return out;
}

export function cycleSummary(cycles: readonly CustomerDayunCycle[], from: number, to: number, thisYear: number, getTenGodFn: (s: Pillar["stem"]) => TenGod) {
  return cycles.filter(c => c.endYear >= from && c.startYear <= to).map(c => ({ ganji: ganjiLabel(c), years: `${c.startYear}~${c.endYear}`, tenGod: tenGodLabel(getTenGodFn(c.stem)), current: c.startYear <= thisYear && thisYear <= c.endYear }));
}
