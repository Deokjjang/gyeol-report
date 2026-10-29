/**
 * 엔진 결과(calculateSaju + analyzeChartDetections) → 지식 DB id 목록. 순수 함수.
 * 강약은 각 항목 strengthRules.rule 문장을 옮긴 것이다(정책 docs/manseryeok-policy.md §5).
 * 시간 미상이면 어떤 hit에도 hour 자리가 없다.
 */
import { BRANCH_MAIN_ELEMENT, HIDDEN_STEMS, STEM_ELEMENT } from "@/lib/saju/constants";
import { getTenGodGroupScores } from "@/lib/saju/extractTags";
import { membersAdjacent } from "@/lib/saju/detections/relations";
import { CHEONRA_JIMANG_PAIRS, ROK_BRANCH, SEASON_BY_BRANCH } from "@/lib/saju/detections/tables";
import type { ChartDetections, ChartPosition, ExtraShinsalHit, RelationHit, Season } from "@/lib/saju/detections/types";
import type { ShinsalCode } from "@/lib/saju/shinsalTypes";
import type { EarthlyBranch, FiveElement, HeavenlyStem, SajuCalcResult, TenGod } from "@/lib/saju/types";
import type { FeatureHit, FeatureStrength } from "./featureTypes";

const ORDER: readonly ChartPosition[] = ["year", "month", "day", "hour"];
const RANK: Record<FeatureStrength, number> = { weak: 0, medium: 1, strong: 2 };
const ELEMENTS: readonly FiveElement[] = ["WOOD", "FIRE", "EARTH", "METAL", "WATER"];
const TEN_GODS: readonly TenGod[] = ["比肩", "劫財", "食神", "傷官", "偏財", "正財", "偏官", "正官", "偏印", "正印"];
const GWIIN_SHINSAL_CODES: ReadonlySet<ShinsalCode> = new Set([
  "CHEON_EUL_GWIIN", "TAEGEUK_GWIIN", "MUN_CHANG_GWIIN", "HAK_DANG_GWIIN", "WOL_DEOK_GWIIN", "CHEON_DEOK_GWIIN",
]);
const EARTH_MONTHS: readonly EarthlyBranch[] = ["辰", "戌", "丑", "未"];

type Raw = Omit<FeatureHit, "count"> & { readonly instances?: number };

type Ctx = {
  readonly saju: SajuCalcResult;
  readonly det: ChartDetections;
  readonly natal: readonly { position: ChartPosition; stem: HeavenlyStem; branch: EarthlyBranch }[];
  readonly groups: ReturnType<typeof getTenGodGroupScores>;
  readonly monthBranch: EarthlyBranch;
  readonly season: Season;
  /** 글자 수(천간·지지 본기 오행, 일간 제외). */
  readonly chars: (...elements: FiveElement[]) => number;
  readonly dmSign: number;
};

const sortPositions = (ps: Iterable<ChartPosition>): ChartPosition[] => {
  const set = new Set(ps);
  return ORDER.filter((p) => set.has(p));
};
const has = (ps: readonly ChartPosition[], ...want: ChartPosition[]) => ps.some((p) => want.includes(p));
const level = (n: number): FeatureStrength => (n > 0 ? "strong" : n < 0 ? "weak" : "medium");

/* ───────── 일간·일주 ───────── */

/** dayMaster rule: 월지 계절 점수 + 도움 글자 − 극하는 글자×1.5 (일간 제외). structureAnalysis 점수와 부호가 같으면 확정. */
function dayMasterStrength(c: Ctx): FeatureStrength {
  const dm = c.saju.pillars.day.stem;
  const el = STEM_ELEMENT[dm];
  const m = c.monthBranch;
  const s = c.season;
  let season: number;
  let support: FiveElement[];
  let pressure: FiveElement;
  if (el === "WOOD") [season, support, pressure] = [{ spring: 2, winter: 1, summer: -1, autumn: -2 }[s], ["WOOD", "WATER"], "METAL"];
  else if (el === "FIRE") [season, support, pressure] = [{ summer: 2, spring: 1, autumn: -1, winter: -2 }[s], ["WOOD", "FIRE"], "WATER"];
  else if (el === "EARTH") [season, support, pressure] = [EARTH_MONTHS.includes(m) ? 1 : { summer: 2, autumn: -1, winter: -1, spring: -2 }[s], ["FIRE", "EARTH"], "WOOD"];
  else if (el === "METAL") {
    const special = dm === "庚" ? { 辰: 1, 丑: 1, 未: 0.5, 戌: 0.5 } : { 辰: 1, 丑: 1 };
    season = (special as Partial<Record<EarthlyBranch, number>>)[m] ?? { autumn: 2, spring: -1, winter: -1, summer: -2 }[s];
    [support, pressure] = [["EARTH", "METAL"], "FIRE"];
  } else [season, support, pressure] = [{ winter: 2, autumn: 1, spring: -1, summer: -2 }[s], ["METAL", "WATER"], "EARTH"];
  let score = season + c.chars(...support) - c.chars(pressure) * 1.5;
  if (dm === "乙" && c.natal.some((n) => (n.position !== "day" && n.stem === "甲") || n.branch === "寅")) score += 1;
  const sign = Math.sign(score);
  return sign !== 0 && sign === c.dmSign ? level(sign) : "medium";
}

/* ───────── 천간(년·월·시) ───────── */

const STEM_ROOTS: Record<HeavenlyStem, Partial<Record<EarthlyBranch, number>>> = {
  甲: { 寅: 2, 卯: 2, 亥: 1, 辰: 1, 未: 1 },
  乙: { 卯: 2, 寅: 2, 辰: 1, 未: 1, 亥: 1 },
  丙: { 巳: 2, 午: 2, 寅: 1, 未: 1, 戌: 1 },
  丁: { 午: 2, 巳: 2, 未: 1, 戌: 1, 寅: 1 },
  戊: { 辰: 2, 戌: 2, 丑: 2, 未: 2, 巳: 1, 寅: 1, 申: 1 },
  己: { 丑: 2, 未: 2, 辰: 1, 戌: 1, 午: 1 },
  庚: { 申: 2, 酉: 2, 戌: 1, 丑: 1, 巳: 1 },
  辛: { 酉: 2, 申: 2, 戌: 1, 丑: 1, 巳: 1 },
  壬: { 亥: 2, 子: 2, 申: 1, 辰: 1, 丑: 1 },
  癸: { 子: 2, 亥: 2, 丑: 1, 辰: 1, 申: 1 },
};
const STEM_HELPERS: Partial<Record<HeavenlyStem, readonly HeavenlyStem[]>> = {
  乙: ["丙", "丁"], 丙: ["甲", "乙"], 丁: ["甲", "乙"], 戊: ["丙", "丁"], 己: ["丙", "丁"], 庚: ["丁"], 辛: ["壬", "癸"], 壬: ["庚", "辛"], 癸: ["庚", "辛"],
};

/** stem rule: 투출 수 + 지지 통근 + 도움 천간 투출 +1 + 월령 ±2 (+ 감점) → ≥3 strong, ≤0 weak. 위치 가중은 규칙에 수치가 없어 자리당 1. */
function stemStrength(c: Ctx, stem: HeavenlyStem, positions: readonly ChartPosition[]): FeatureStrength {
  let score = positions.length;
  for (const n of c.natal) score += STEM_ROOTS[stem][n.branch] ?? 0;
  const others = c.natal.filter((n) => !positions.includes(n.position)).map((n) => n.stem);
  if (STEM_HELPERS[stem]?.some((h) => others.includes(h))) score += 1;
  const s = c.season;
  if (stem === "甲" || stem === "乙") score += s === "spring" ? 2 : s === "autumn" ? -2 : 0;
  if (stem === "丙" || stem === "丁") score += s === "summer" ? 2 : s === "winter" ? -2 : 0;
  if (stem === "戊") score += EARTH_MONTHS.includes(c.monthBranch) ? 2 : s === "spring" ? -1 : 0;
  if (stem === "庚" || stem === "辛") score += s === "autumn" ? 2 : s === "summer" ? -2 : 0;
  if (stem === "壬" || stem === "癸") score += s === "winter" ? 2 : s === "summer" ? -2 : 0;
  if (stem === "丁") {
    const idx = (p: ChartPosition) => ORDER.indexOf(p);
    const nearWater = c.natal.some((n) => (n.stem === "壬" || n.stem === "癸") && positions.some((p) => Math.abs(idx(p) - idx(n.position)) === 1));
    if (nearWater) score -= 1;
  }
  if (stem === "己" && c.chars("WATER") >= 3) score -= 1;
  if (stem === "辛" && c.chars("EARTH") >= 4) score -= 1;
  return score >= 3 ? "strong" : score <= 0 ? "weak" : "medium";
}

/* ───────── 십성 ───────── */

function tenGodStrength(c: Ctx, tg: TenGod): FeatureStrength {
  const d = c.saju.tenGods.distribution;
  const monthMain = c.saju.tenGods.hiddenStems.find((h) => h.branch === c.monthBranch && h.stem === HIDDEN_STEMS[c.monthBranch][0].stem)?.tenGod;
  if (d[tg] >= 2 || monthMain === tg) return "strong";
  const g = c.groups;
  const weak: Partial<Record<TenGod, boolean>> = {
    偏印: g.WEALTH >= 2,
    正官: d.傷官 >= 2,
    正財: g.PEER >= 3,
    比肩: g.OFFICER + g.WEALTH >= 4,
    劫財: g.OFFICER >= 2,
    傷官: g.RESOURCE >= 2,
    偏財: g.PEER >= 3,
    正印: g.WEALTH >= 3,
  };
  return weak[tg] ? "weak" : "medium";
}

/* ───────── 신살·귀인 ───────── */

const HYEONCHIM_CHARS: readonly string[] = ["甲", "辛", "卯", "午", "申"];

function shinsalStrength(c: Ctx, code: ShinsalCode, positions: readonly ChartPosition[]): FeatureStrength {
  if (code === "HYEONCHIMSAL") {
    const n = c.natal.reduce((sum, p) => sum + (HYEONCHIM_CHARS.includes(p.stem) ? 1 : 0) + (HYEONCHIM_CHARS.includes(p.branch) ? 1 : 0), 0);
    return n >= 3 ? "strong" : n === 2 ? "medium" : "weak";
  }
  if (code === "WOL_DEOK_GWIIN" && positions.length === 1 && positions[0] === "hour") return "weak";
  return has(positions, "month", "day") || positions.length >= 2 ? "strong" : "medium";
}

function extraStrength(c: Ctx, hit: ExtraShinsalHit): FeatureStrength {
  const ps = hit.positions;
  const dm = c.saju.structureAnalysis.dayMasterStrength.level;
  const dmStrong = dm === "STRONG" || dm === "VERY_STRONG";
  const dmWeak = dm === "WEAK" || dm === "VERY_WEAK";
  const g = c.groups;
  const voidPositions = c.det.gongmang.find((x) => x.basis === "day")?.positions ?? [];
  const allVoid = ps.every((p) => voidPositions.includes(p));
  const rokPresent = c.natal.some((n) => n.branch === ROK_BRANCH[c.saju.pillars.day.stem]);
  const only = (...allowed: ChartPosition[]) => ps.every((p) => allowed.includes(p));
  switch (hit.code) {
    case "GOEGANG":
      return (ps.includes("day") && dmStrong) || ps.length >= 2 ? "strong" : only("year", "hour") && dmWeak ? "weak" : "medium";
    case "YANGIN":
      return ps.includes("month") || (dmStrong && g.PEER >= 2.5) ? "strong" : dmWeak || g.OFFICER >= 2.5 ? "weak" : "medium";
    case "GWIMUN":
      return "strong";
    case "CHEONMUN":
      return ps.length >= 2 || has(ps, "month", "day") ? "strong" : only("year") ? "weak" : "medium";
    case "EUMCHAK_YANGCHA":
      return ps.includes("day") || ps.length >= 2 ? "strong" : only("year") || only("hour") ? "weak" : "medium";
    case "CHEONRA_JIMANG": {
      const present = CHEONRA_JIMANG_PAIRS.filter(({ pair }) => pair.every((b) => c.natal.some((n) => n.branch === b)));
      const adjacent = present.some(({ pair }) =>
        c.natal.some((x) => c.natal.some((y) => x.branch === pair[0] && y.branch === pair[1] && membersAdjacent([x.position, y.position]))),
      );
      return present.length >= 2 || adjacent ? "strong" : "weak";
    }
    case "GONGMANG":
      return ps.length >= 2 || ps.includes("month") ? "strong" : only("year") || only("hour") ? "weak" : "medium";
    case "AMROK":
    case "GEUMYEO":
      return allVoid ? "weak" : ps.includes("day") || rokPresent ? "strong" : "medium";
    case "BOKSEONG":
      return allVoid ? "weak" : has(ps, "day", "month") && c.saju.tenGods.distribution.食神 >= 1 ? "strong" : "medium";
    case "CHEON_EUI":
      return allVoid ? "weak" : ps.includes("day") || g.RESOURCE >= 1.5 ? "strong" : "medium";
    case "MUNGOK":
      return allVoid ? "weak" : has(ps, "day", "hour") && g.OUTPUT >= 1 ? "strong" : "medium";
    case "JAEGO": {
      const wealthVisible = Object.values(c.saju.tenGods.stems).some((t) => t === "偏財" || t === "正財");
      return has(ps, "day", "month") && wealthVisible ? "strong" : g.WEALTH < 1 || g.PEER >= 2.5 ? "weak" : "medium";
    }
    case "WONJIN":
      return "medium";
  }
}

/* ───────── 관계 ───────── */

function relationStrength(r: RelationHit): FeatureStrength {
  const ps = r.members.map((m) => m.position);
  const yearHour = ps.length === 2 && ps.includes("year") && ps.includes("hour");
  const graded = (strong: boolean): FeatureStrength => (strong ? "strong" : yearHour ? "weak" : "medium");
  switch (r.kind) {
    case "STEM_HAP":
    case "YUKHAP":
      return graded(r.adjacent);
    case "CHUNG":
      return graded(ps.includes("day") && (ps.includes("month") || ps.includes("hour")));
    case "SAMHAP":
      return r.completeness === "full" ? "strong" : r.adjacent ? "medium" : "weak";
    case "BANGHAP":
      return ps.includes("month") ? "strong" : "medium";
    case "HYEONG":
      if (r.subtype === "삼형") return r.completeness === "full" ? "strong" : r.adjacent ? "medium" : "weak";
      return graded(r.adjacent);
    case "PA":
    case "HAE":
      return r.adjacent ? "strong" : "weak";
    case "WONJIN":
      return graded(r.adjacent && ps.includes("day"));
  }
}

/* ───────── 오행·음양·구조 ───────── */

function elementStrength(c: Ctx, e: FiveElement, kind: "STRONG" | "WEAK" | "MISSING" | "BALANCED"): FeatureStrength {
  if (kind === "MISSING") return c.det.hourIncluded ? "strong" : "weak";
  if (kind !== "STRONG") return "medium";
  return c.det.elementBalance.shares[e] >= 0.4 ? "strong" : "medium";
}

const STRUCTURE_GROUP: Partial<Record<string, keyof Ctx["groups"]>> = {
  RESOURCE_HEAVY: "RESOURCE", PEER_HEAVY: "PEER", OUTPUT_HEAVY: "OUTPUT", WEALTH_HEAVY: "WEALTH", OFFICER_HEAVY: "OFFICER",
};

function structureStrength(c: Ctx, code: string, scores?: Readonly<Record<string, number>>): FeatureStrength {
  const g = c.groups;
  const d = c.saju.tenGods.distribution;
  if (scores) {
    const groupScores = Object.entries(scores).filter(([k]) => k !== "dayMaster").map(([, v]) => v);
    return Math.min(...groupScores) >= 2.5 ? "strong" : "medium";
  }
  if (code.startsWith("WEAK_DAYMASTER")) return c.saju.structureAnalysis.dayMasterStrength.level === "VERY_WEAK" ? "strong" : "medium";
  const group = STRUCTURE_GROUP[code];
  if (group) return g[group] >= 2.5 ? "strong" : "medium";
  if (code === "MIXED_OFFICER_KILLING") return Math.min(d.偏官, d.正官) >= 1 ? "strong" : Math.min(d.偏官, d.正官) < 0.5 ? "weak" : "medium";
  if (code === "WATER_WEAK_RECOVERY_NEEDED") return c.saju.elements.labels.includes("WATER_MISSING") ? "strong" : "medium";
  return "medium";
}

/* ───────── 조립 ───────── */

function aggregate(raws: readonly Raw[]): FeatureHit[] {
  const map = new Map<string, { hit: Raw; positions: Set<ChartPosition>; instances: number; bases: string[]; pairs: ChartPosition[][] }>();
  for (const r of raws) {
    const key = `${r.id}|${r.variantKey ?? ""}`;
    const cur = map.get(key);
    if (!cur) {
      map.set(key, { hit: r, positions: new Set(r.positions), instances: r.instances ?? 1, bases: [r.basis], pairs: [[...r.positions]] });
      continue;
    }
    r.positions.forEach((p) => cur.positions.add(p));
    cur.instances += r.instances ?? 1;
    if (!cur.bases.includes(r.basis)) cur.bases.push(r.basis);
    if (!cur.pairs.some(p => p.join() === r.positions.join())) cur.pairs.push([...r.positions]);
    if (RANK[r.strength] > RANK[cur.hit.strength]) cur.hit = { ...cur.hit, strength: r.strength };
  }
  return [...map.values()].map(({ hit, positions, instances, bases, pairs }) => {
    const sorted = sortPositions(positions);
    const isRelation = hit.family === "relation" || hit.id === "shinsal:WONJIN";
    return {
      id: hit.id,
      family: hit.family,
      positions: sorted,
      strength: hit.strength,
      ...(hit.variantKey ? { variantKey: hit.variantKey } : {}),
      count: isRelation ? instances : Math.max(1, sorted.length),
      basis: bases.join(" / "),
      ...(isRelation ? { pairs: pairs.map(p => sortPositions(new Set(p))) } : {}),
    };
  });
}

export function collectFeatureHits(saju: SajuCalcResult, det: ChartDetections): FeatureHit[] {
  const hourOk = det.hourIncluded;
  const keep = (ps: readonly ChartPosition[]) => ps.filter((p) => hourOk || p !== "hour");
  const natal = (["year", "month", "day", "hour"] as const)
    .filter((p) => hourOk || p !== "hour")
    .flatMap((position) => {
      const pillar = saju.pillars[position];
      return pillar ? [{ position, stem: pillar.stem, branch: pillar.branch }] : [];
    });
  const others = natal.filter((n) => n.position !== "day");
  const monthBranch = saju.pillars.month.branch;
  const c: Ctx = {
    saju,
    det,
    natal,
    groups: getTenGodGroupScores(saju.tenGods.distribution),
    monthBranch,
    season: SEASON_BY_BRANCH[monthBranch],
    chars: (...els) =>
      others.filter((n) => els.includes(STEM_ELEMENT[n.stem])).length + natal.filter((n) => els.includes(BRANCH_MAIN_ELEMENT[n.branch])).length,
    dmSign: Math.sign(saju.structureAnalysis.dayMasterStrength.score),
  };
  const raws: Raw[] = [];
  const push = (r: Raw) => raws.push({ ...r, positions: keep(r.positions) });

  // 일간·일주
  const dm = saju.pillars.day.stem;
  const dmStrength = dayMasterStrength(c);
  push({ id: `dayMaster:${dm}`, family: "dayMaster", positions: ["day"], strength: dmStrength, basis: `일간 ${dm}` });
  push({ id: `dayPillar:${dm}${saju.pillars.day.branch}`, family: "dayPillar", positions: ["day"], strength: dmStrength, basis: `일주 ${dm}${saju.pillars.day.branch}` });

  // 천간(일간 제외)
  const stemPositions = new Map<HeavenlyStem, ChartPosition[]>();
  for (const n of others) stemPositions.set(n.stem, [...(stemPositions.get(n.stem) ?? []), n.position]);
  for (const [stem, ps] of stemPositions) push({ id: `stem:${stem}`, family: "stem", positions: ps, strength: stemStrength(c, stem, ps), basis: `천간 ${stem}` });

  // 지지
  const clashed = new Set(det.relations.filter((r) => r.kind === "CHUNG").flatMap((r) => r.members.map((m) => m.char)));
  const branchPositions = new Map<EarthlyBranch, ChartPosition[]>();
  for (const n of natal) branchPositions.set(n.branch, [...(branchPositions.get(n.branch) ?? []), n.position]);
  for (const [branch, ps] of branchPositions) {
    const strong = ps.includes("month") || ps.length >= 2 || SEASON_BY_BRANCH[branch] === c.season;
    const strength: FeatureStrength = strong ? "strong" : clashed.has(branch) ? "weak" : "medium";
    push({ id: `branch:${branch}`, family: "branch", positions: ps, strength, basis: `지지 ${branch}` });
  }

  // 십성: 년·월·시 천간 + 네 지지 본기
  const tgPositions = new Map<TenGod, ChartPosition[]>();
  for (const n of natal) {
    const list: TenGod[] = [];
    if (n.position !== "day") {
      const tg = saju.tenGods.stems[n.position];
      if (tg) list.push(tg);
    }
    const mainTg = saju.tenGods.hiddenStems.find((h) => h.branch === n.branch && h.stem === HIDDEN_STEMS[n.branch][0].stem)?.tenGod;
    if (mainTg) list.push(mainTg);
    for (const tg of list) tgPositions.set(tg, [...(tgPositions.get(tg) ?? []), n.position]);
  }
  for (const tg of TEN_GODS) {
    const ps = tgPositions.get(tg);
    if (ps) push({ id: `tenGod:${tg}`, family: "tenGod", positions: ps, strength: tenGodStrength(c, tg), basis: `십성 ${tg} dist=${saju.tenGods.distribution[tg]}` });
  }

  // 십성 균형(extractSajuTags와 같은 임계: ≥2.5 STRONG, <1 WEAK)
  for (const [group, score] of Object.entries(c.groups) as [keyof Ctx["groups"], number][]) {
    if (score >= 2.5) push({ id: `tenGodBalance:${group}:STRONG`, family: "tenGodBalance", positions: [], strength: score >= 3 ? "strong" : "medium", basis: `${group}=${score.toFixed(2)}` });
    else if (score < 1) push({ id: `tenGodBalance:${group}:WEAK`, family: "tenGodBalance", positions: [], strength: score === 0 ? "strong" : "medium", basis: `${group}=${score.toFixed(2)}` });
  }

  // 기존 신살·귀인
  // 같은 코드가 기준별(년지·일지)로 여러 건이면 자리를 합친 뒤 강약을 매긴다.
  const shinsalByCode = new Map<ShinsalCode, { positions: ChartPosition[]; basis: string[] }>();
  for (const s of saju.shinsal) {
    const cur = shinsalByCode.get(s.code) ?? { positions: [], basis: [] };
    cur.positions.push(...keep(s.positions));
    cur.basis.push(...s.evidence.slice(0, 2));
    shinsalByCode.set(s.code, cur);
  }
  for (const [code, { positions, basis }] of shinsalByCode) {
    const ps = sortPositions(positions);
    if (!ps.length) continue;
    const family = GWIIN_SHINSAL_CODES.has(code) ? "gwiin" : "shinsal";
    push({ id: `${family}:${code}`, family, positions: ps, strength: shinsalStrength(c, code, ps), basis: [...new Set(basis)].slice(0, 3).join(",") || code });
  }
  // 신살·귀인 확장(원진은 관계에서 짝별로 낸다)
  for (const x of det.extraShinsal) {
    if (x.code === "WONJIN") continue;
    push({ id: `${x.family}:${x.code}`, family: x.family, positions: x.positions, strength: extraStrength(c, x), basis: x.basis });
  }

  // 십이운성
  for (const t of det.twelveStages) {
    const p = t.position as ChartPosition;
    push({ id: `twelveStage:${t.stage}`, family: "twelveStage", positions: [p], strength: p === "month" || p === "day" ? "strong" : "weak", basis: `${dm}→${t.branch} ${t.stage}` });
  }

  // 관계
  for (const r of det.relations) {
    const id = r.kind === "WONJIN" ? "shinsal:WONJIN" : `relation:${r.kind}`;
    const family = r.kind === "WONJIN" ? "shinsal" : "relation";
    const ps = r.members.map((m) => m.position as ChartPosition);
    push({ id, family, positions: ps, strength: relationStrength(r), variantKey: r.key, basis: `${r.key} ${ps.join("-")}${r.completeness === "full" ? "" : ` ${r.completeness}`}` });
  }

  // 오행: 단일 판단(det.elementBalance). 많음은 가장 강한 기운 하나, 부족·없음은 가장 약한 기운 하나만 hit로 낸다.
  const bal = det.elementBalance;
  for (const e of ELEMENTS) {
    const st = bal.status[e];
    const kind = e === bal.strongest.element && st === "많음" ? "STRONG" : e === bal.weakest.element && (st === "부족" || st === "없음") ? (st === "없음" ? "MISSING" : "WEAK") : st === "보통" ? "BALANCED" : null;
    if (!kind) continue;
    push({ id: `element:${e}:${kind}`, family: "element", positions: [], strength: elementStrength(c, e, kind), basis: `${e} score=${bal.scores[e]} share=${bal.shares[e]}` });
  }

  // 음양
  const yy = saju.yinYang;
  const gender = saju.input.gender;
  const suffix = yy.label !== "BALANCED" && (gender === "MALE" || gender === "FEMALE") ? `:${gender}` : "";
  push({ id: `yinYang:${yy.label}${suffix}`, family: "yinYang", positions: [], strength: Math.max(yy.yin, yy.yang) >= 0.75 * (yy.yin + yy.yang) ? "strong" : "medium", basis: `yin=${yy.yin},yang=${yy.yang}` }); // 통용 편중 기준: 8자 중 한쪽 6자 이상(P3.5 A8, 기본값 #7)

  // 조후
  push({ id: `climate:${det.climate.featureKey}`, family: "climate", positions: [], strength: det.climate.level, basis: `${det.climate.monthBranch}월 ${det.climate.dayMaster} 조후 ${det.climate.level}` });

  // 구조
  for (const p of saju.structureAnalysis.patterns) push({ id: `structure:${p.code}`, family: "structure", positions: [], strength: structureStrength(c, p.code), basis: p.labelKo });
  for (const f of det.structureFlows) {
    push({ id: `structure:${f.code}`, family: "structure", positions: [], strength: structureStrength(c, f.code, f.scores), basis: Object.entries(f.scores).map(([k, v]) => `${k}=${v}`).join(",") });
  }

  return aggregate(raws);
}
