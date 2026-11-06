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
import { colorsOf, currentDayunAt, dayunLabel, ELEMENT_KO, ganjiLabel, ganjiOf, halfHapLine, josa, koCount, POSITION_KO, TEN_GOD_GROUP, TEN_GOD_KO, tenGodLabel, HALF_HAP_PLAIN, REL_PLAIN } from "./labels";
import { splitSentences } from "@/lib/writer/safety/patterns";
import { periodDomains } from "./productEvidence";
import type { Rng } from "./seed";
import type { TimelineEntry, Trait } from "./schema";
import { getTenGod } from "@/lib/saju/tenGods";

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
  /** 이미 나온 십성(→ 첫 항목 key·횟수)과 십이운성 단계(P3.8 r1: 같은 십성 해에 같은 열쇠말·단계 문구가 되풀이). */
  readonly seenTenGod?: Map<string, { key: string; n: number }>; readonly seenStage?: Set<string>;
  /** 원국 trait(P3.7 1-1): 그해·그달 글자가 실제로 건드리는 것만 항목 재료(touched)가 된다. */
  readonly traits?: readonly TraitRef[];
};
type TraitRef = Pick<Trait, "id" | "featureId" | "family" | "positions">;

const REL_EASY = REL_PLAIN;
const relEasy = (r: RelationHit) => r.kind === "SAMHAP" && r.completeness !== "full" ? HALF_HAP_PLAIN : REL_EASY[r.kind] ?? r.kind;
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
  const ok = list.filter(s => sceneFits(s.requires, ctx.facts, s.text) && !ctx.usedScenes.has(s.text));
  if (!ok.length) return undefined;
  const s = ctx.rng.fork(label).pick(ok); ctx.usedScenes.add(s.text); return s.text;
}

/** 지난 기간 카드의 돌아보기 질문(P6b E-5). 열쇠말 두 개와 문형 셋을 돌려 쓴다(질문형이라 지난 경험 단정이 아니다). */
export function reviewLine(keywords: readonly string[], slot: number): string {
  const [a, b = a] = keywords;
  return [
    `${a}·${josa(b, "이가")} 두드러진 때였어요. 그때 붙잡은 일 가운데 지금까지 이어진 것은 무엇인가요?`,
    `${a} 쪽으로 힘이 실린 때였어요. 그때 정한 것 중 지금 다시 꺼내 볼 하나는 무엇인가요?`,
    `${josa(b, "이가")} 앞에 섰던 때였어요. 그때 미뤄 둔 일 하나를 지금 다시 살펴볼까요?`,
  ][Math.abs(slot) % 3];
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
    // 세 글자 중 두 글자만 만난 합은 "완성"이 아니다(P3.6 B: 반합을 "팀이 완성"으로 썼다). 최종판3 7: 궁합 관계 목록과 같은 반합 문구(halfHapLine).
    const half = r.kind === "SAMHAP" && r.completeness !== "full";
    badges.push({ kind: b.kind, ...(b.pair ? { pair: b.pair } : {}), label: half ? `${b.label}(반쯤)` : b.label, line: half ? `${HALF_HAP_PLAIN}: ${halfHapLine(b.line)}` : b.line, tone: b.tone, ...(natal.length ? { with: natal.join("·") } : {}) });
  }
  if (inc.gongmang) { const b = k.badges.find(x => x.kind === "GONGMANG" && !x.pair); if (b) badges.push({ kind: b.kind, label: b.label, line: b.line, tone: b.tone }); }
  const eff = inflowEffect(pillar, st);
  const g = k.ganji.get(pillar.stem + pillar.branch)!;
  const period = k.tenGodPeriod.get(inc.stemTenGod)!;
  const stage = k.features.get(`twelveStage:${inc.twelveStage}`);
  const scene = pickScene(ctx, kind === "year" ? period.year.scenes : period.month.scenes, `scene:${key}`);
  const touched = touchedTraits(ctx, inc, eff);
  const seen = ctx.seenTenGod?.get(`${kind}:${inc.stemTenGod}`);
  ctx.seenTenGod?.set(`${kind}:${inc.stemTenGod}`, { key: seen?.key ?? key, n: (seen?.n ?? 0) + 1 });
  const kw = kind === "year" ? period.year.keywords : period.month.keywords, per = kind === "year" ? 3 : 2, occ = seen?.n ?? 0;
  const keywords = Array.from({ length: per }, (_, i) => kw[(occ * per + i) % kw.length]);
  // 십이운성은 그림 한 줄이 아니라 뜻으로(P6b B-1).
  const stageText = stage ? `${stage.name}: ${splitSentences(stage.meaning)[1] ?? splitSentences(stage.meaning)[0]}` : inc.twelveStage;
  // 카드 그림 줄(P6b E-4): 작가 원고를 잘라 오지 않는 독립 문장. 달 카드는 "해"를 "달"로.
  const imageLine = kind === "month" ? g.imageLine.replace(/ 해$/, " 달") : g.imageLine;
  const action = pickAction(ctx, inc.stemTenGod, flow.score, slot);
  const state = extra.when === "past" ? "past" : extra.when === "future" ? "future" : "current";
  const stageNew = !ctx.seenStage?.has(inc.twelveStage); ctx.seenStage?.add(inc.twelveStage);
  return {
    key, label, kind, ganji: ganjiOf(pillar), colors: colorsOf(pillar),
    tenGod: { stem: tenGodLabel(inc.stemTenGod), branch: tenGodLabel(inc.branchTenGod) },
    badges,
    fillsLack: { fills: eff.fills.length > 0, elements: eff.fills, feedsExcess: eff.feeds },
    flow: { score: flow.score, label: flow.label, basis: flow.applied.map(a => `${flowShort(a.key, flowInput.clashes) ?? a.when} ${a.delta > 0 ? "+" : ""}${a.delta}`), note: "참고" },
    // 뜻(열쇠말)은 일간 기준 십성, 그림은 간지(P3.8 1: 간지 기준 열쇠말·분위기가 정인 해에 '독립·경쟁자'를 줬다). 같은 십성이 다시 오면 다음 묶음.
    keywords,
    action,
    period: state, imageLine,
    // 카드 행동 줄(P6b E-5): 앞으로는 할 일(todo), 지난 기간은 돌아보는 질문(review).
    ...(state === "past" ? { review: reviewLine(keywords, slot) } : { todo: action.text }),
    material: {
      image: imageLine, domains: periodDomains(inc.stemTenGod),
      ...(scene ? { scene } : {}),
      ...(stageNew ? { stage: stageText } : {}),
    },
    ...(seen ? { repeatOf: seen.key } : {}),
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
    // 대운 안 몇 번째 해(P6d C): 엔진 연차 그대로. 위치 말(앞쪽·중간·끝 무렵·마지막 해)은 이 값으로만.
    const yi = cyc ? year - cyc.startYear + 1 : 0, total = cyc ? cyc.endYear - cyc.startYear + 1 : 0;
    const dyTg = cyc ? tenGodLabel(getTenGod(ctx.saju.dayMaster, cyc.stem)) : "";
    const e = buildEntry(ctx, "year", String(year), `${year}년 ${ganjiLabel(pillar)}${year === thisYear ? " (올해)" : ""}${transition ? " · 새 대운 시작" : ""}`, pillar, "annual", start + i,
      { ...(cyc ? { dayun: { ganji: `${cyc.ganji} 대운`, transition, yearIndex: yi, total, position: dayunPositionLine(cyc.startYear, cyc.endYear, yi, total), tenGod: dyTg, ...(transition ? { start: dayunLabel(cyc).start } : {}) } } : {}), when: year < thisYear ? "past" : year === thisYear ? "now" : "future" });
    e.head = headLine(e, cyc ? { ganji: `${ganjiOf(cyc).hangul}(${ganjiOf(cyc).hanja})`, tenGod: dyTg, month: dayunLabel(cyc).month } : undefined);
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
    // 달 이름(P6c E5): "N번째 달 · 간지월 (절입일~)". 본문은 "경인월"처럼 부른다. "N월 무렵"(달력 달)과 "(이번 달)"은 쓰지 않는다(지금 달 강조는 화면이 읽는 날로).
    const e = buildEntry(ctx, "month", `${year}-M${String(m.index).padStart(2, "0")}`, `${m.index}번째 달 · ${ganjiOf(m.pillar).hangul}월 (${date}~)`, m.pillar, "monthly", start + m.index,
      when ? { when } : {});
    e.head = headLine(e);
    out.push({ ...e, ...changeOf(out.at(-1), "달", e.tenGod.stem, e.flow.score) });
  });
  return out;
}

/** 대운 안 위치 한 줄(P6d C): "2022~2031 대운 10년 가운데 10번째 해(마지막 해)". */
export function dayunPositionLine(startYear: number, endYear: number, index: number, total: number): string {
  const where = index === 1 ? "첫해" : index === total ? "마지막 해" : index <= 3 ? "앞쪽" : index <= 7 ? "중간" : "끝 무렵";
  return `${startYear}~${endYear} 대운 ${total}년 가운데 ${index}번째 해(${where}${index < total ? `, 뒤로 ${koCount(total - index, "해")} 남음` : ""})`;
}

/**
 * 머리 문장(P6d D): 결정론 형식. 해 = "2028년 무신(戊申)은 상관(傷官)이 하늘에, 정재(正財)가 땅에 들어오는 해예요."
 * 달 = "경인월(庚寅月)은 …이 하늘에, …이 땅에 들어오는 달이에요." 대운 전환 해는 새 대운 이름과 십성을 잇는다.
 */
export function headLine(e: Pick<TimelineEntry, "kind" | "key" | "ganji" | "tenGod" | "dayun">, cycle?: { ganji: string; tenGod: string; month?: string }): string {
  const sky = `${josa(e.tenGod.stem, "이가")} 하늘에, ${josa(e.tenGod.branch, "이가")} 땅에 들어오는`;
  if (e.kind === "month") return `${e.ganji.hangul}월(${e.ganji.hanja}月)은 ${sky} 달이에요.`;
  const base = `${e.key}년 ${josa(`${e.ganji.hangul}(${e.ganji.hanja})`, "은는")} ${sky} 해예요.`;
  // 최종판3 8: 교운 달은 공통 대운 표기(dayunLabel.month) 그대로 — "이 해 5월 무렵부터 무진(戊辰) 대운이 시작되고".
  const from = cycle?.month ? `이 해 ${cycle.month} 무렵부터` : "이 해부터";
  return e.dayun?.transition && cycle ? `${base} ${from} ${cycle.ganji} 대운이 시작되고, 10년의 중심 기운은 ${cycle.tenGod}${josa(cycle.tenGod, "이가").endsWith("이") ? "이에요" : "예요"}.` : base;
}

/** 대운 지도(timeline.cycles). 최종판3 8: label·ages(만 나이)는 공통 대운 표기 함수(dayunLabel) 그대로. */
/** 운영 Q 8-1: 대운수(daeunsu)는 한 사람에 한 숫자(첫 대운이 시작될 때의 만 나이), 「만 X~Y세」도 그 값에서. 최종 A-4·5: 기간(period)은 다음 대운 교운 연·월까지. atMs가 있으면 지금 대운은 교운 시각으로 고른다(대운 상품). */
export function cycleSummary(dayun: { readonly cycles: readonly CustomerDayunCycle[]; readonly daeunsu?: number }, from: number, to: number, thisYear: number, getTenGodFn: (s: Pillar["stem"]) => TenGod, atMs?: number) {
  const cycles = dayun.cycles, now = atMs === undefined ? undefined : currentDayunAt(cycles, atMs);
  return cycles.filter(c => c.endYear >= from && c.startYear <= to).map(c => { const l = dayunLabel(c, dayun.daeunsu, cycles.find(x => x.index === c.index + 1));
    return { ganji: ganjiLabel(c), years: l.years, period: l.period, tenGod: tenGodLabel(getTenGodFn(c.stem)), current: now ? now.index === c.index : c.startYear <= thisYear && thisYear <= c.endYear, label: l.line, ages: l.ages }; });
}
