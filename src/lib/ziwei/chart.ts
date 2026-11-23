import "server-only";
/**
 * ZW-1 자미두수 명반 어댑터(서버 전용). 계산 핵심은 외부 계산 라이브러리(MIT, 이름은 고객 화면 · 상품 · 마케팅에 쓰지 않는다)이고,
 * 이 파일이 우리 기준(basis.ts)을 강제한다. 라이브러리의 해석 문장 · AI 해석 기능은 쓰지 않는다(배치 계산만).
 *
 * 경로: 사주 엔진(태양시 · 통자시) → 자미 날짜 · 시진 → 한국 음력 → 윤달 규칙(lunar.ts 한 곳) → 라이브러리(음력 평달 입력, 설정 전부 고정)
 *       → 중국어 이름을 id로(ids.ts 매핑, 빠지면 오류) → 사화 · 밝기를 우리 표로 다시 계산해 라이브러리 값과 맞댐 → ZiweiChart.
 * 운반 날짜: 라이브러리 달력(중국 농력)에 그 음력 날짜가 없으면(1900~2050년 74일, 대개 30일) 같은 간지 해(±60년 …)의 같은 달 · 날을 넣는다.
 *            라이브러리의 별 배치는 해 간지 · 달 · 날 · 시진 · 성별만 쓰므로 명반이 같다. 대한 연도 · 지금 대한은 실제 출생 음력 해로 계산한다.
 */
import { astro } from "iztro";
import { BRIGHTNESS_TABLE, brightnessBasisOf, brightnessIndex, MUTAGEN_ORDER, MUTAGEN_SCHOOL_VARIANTS, MUTAGEN_TABLE, ZIWEI_BASIS, ZIWEI_CALC_VERSION } from "./basis";
import {
  BRANCHES, BRIGHTNESS3_OF, FIVE_CLASS_INFO, PALACES, pairIdOf, STAR_NAMES, STEMS, ZH_BRANCH, ZH_BRIGHTNESS, ZH_FIVE_CLASS, ZH_MUTAGEN, ZH_PALACE, ZH_STAR, ZH_STEM,
  type Branch, type MajorStarId, type PalaceId, type StarId, type Stem,
} from "./ids";
import { effectiveLunarMonth, solarToKoreanLunar, ziweiDayAndHour, type ZiweiBirthInput } from "./lunar";
import type { ZiweiChart, ZiweiDecadal, ZiweiGender, ZiweiPalace, ZiweiStarPlacement } from "./types";

export type ZiweiChartInput = ZiweiBirthInput & { readonly gender: ZiweiGender };

const ZH_NAME_OF: Readonly<Record<StarId, string>> = Object.fromEntries(Object.entries(ZH_STAR).map(([zh, id]) => [id, zh])) as Record<StarId, string>;
const ZH_LEVEL_OF: Readonly<Record<string, string>> = Object.fromEntries(Object.entries(ZH_BRIGHTNESS).map(([zh, ko]) => [ko, zh]));

/** 라이브러리에 넘기는 설정(매 호출 전부 고정 — 전역 설정을 쓰지도 바꾸지도 않는다). */
const LIBRARY_CONFIG = Object.freeze({
  yearDivide: "normal", horoscopeDivide: "normal", ageDivide: "normal", dayDivide: "forward", algorithm: "default",
  mutagens: Object.fromEntries(STEMS.map(s => [s, MUTAGEN_TABLE[s].map(id => ZH_NAME_OF[id])])),
  brightness: Object.fromEntries(Object.entries(BRIGHTNESS_TABLE).filter(([, levels]) => levels!.every(l => l !== null)).map(([id, levels]) => [ZH_NAME_OF[id as StarId], levels!.map(l => ZH_LEVEL_OF[l!])])),
} as const);

const mod = (n: number, m: number) => ((n % m) + m) % m;
const branchAt = (i: number): Branch => BRANCHES[mod(i, 12)];
const bIdx = (b: Branch) => BRANCHES.indexOf(b);

export class ZiweiMappingError extends Error {
  constructor(what: string, value: unknown) {
    super(`자미 계산 결과를 읽을 수 없습니다(${what}: ${String(value)}).`);
    this.name = "ZiweiMappingError";
  }
}
const must = <T>(table: Readonly<Record<string, T>>, key: string, what: string): T => {
  const v = table[key];
  if (v === undefined) throw new ZiweiMappingError(what, key);
  return v;
};

type LibraryChart = ReturnType<typeof astro.withOptions>;
/** 운반 해 후보: 같은 간지 해(60년 간격)를 가까운 순으로. 1900~2050년 74일은 모두 ±300년 안에서 찾는다(시험). */
const VEHICLE_SHIFTS: readonly number[] = [0, ...Array.from({ length: 10 }, (_, i) => [(i + 1) * 60, -(i + 1) * 60]).flat()];
/** 음력 평달 (해, 달, 날)을 라이브러리에 넣는다. 그 날이 라이브러리 달력에 없으면 같은 간지 해로 옮긴다. */
function libraryChart(year: number, month: number, day: number, hourIndex: number, gender: ZiweiGender): { chart: LibraryChart; vehicleYear: number } {
  for (const shift of VEHICLE_SHIFTS) {
    const vehicleYear = year + shift;
    let chart: LibraryChart;
    try {
      chart = astro.withOptions({
        type: "lunar", dateStr: `${vehicleYear}-${month}-${day}`, isLeapMonth: false, fixLeap: true, timeIndex: hourIndex,
        gender: gender === "MALE" ? "male" : "female", language: "zh-CN", config: { ...LIBRARY_CONFIG },
      });
    } catch {
      continue;
    }
    const l = chart.rawDates.lunarDate;
    if (l.lunarYear !== vehicleYear || l.lunarMonth !== month || l.lunarDay !== day || l.isLeap) continue;
    return { chart, vehicleYear };
  }
  throw new Error(`음력 ${year}-${month}-${day}을 계산할 수 없습니다.`);
}

/** 음력 해 번호 → 해 간지(甲子 = 4년). */
export const lunarYearGanzhi = (year: number): { stem: Stem; branch: Branch } => ({ stem: STEMS[mod(year - 4, 10)], branch: BRANCHES[mod(year - 4, 12)] });

/**
 * 명반 하나. asOf(YYYY-MM-DD, 한국 날짜)는 「지금 대한」 기준일 — 책 발행일을 넣는다.
 * 시각 완전 미상 → ZiweiTimeUnknownError, 범위 밖 날짜 → ZiweiDateRangeError(readiness.ts가 입력 단계에서 먼저 막는다).
 */
export function computeZiweiChart(input: ZiweiChartInput, asOf: string): ZiweiChart {
  if (input.gender !== "MALE" && input.gender !== "FEMALE") throw new Error("자미두수 명반에는 성별이 필요합니다.");
  const dh = ziweiDayAndHour(input);
  const lunar = solarToKoreanLunar(dh.date);
  const eff = effectiveLunarMonth(lunar);
  const year = lunarYearGanzhi(lunar.year);
  const yang = STEMS.indexOf(year.stem) % 2 === 0;
  const { chart: lib } = libraryChart(lunar.year, eff.month, lunar.day, dh.hourIndex, input.gender);

  const yearly = lib.rawDates.chineseDate.yearly;
  if (yearly[0] !== year.stem || yearly[1] !== year.branch) throw new Error("라이브러리 해 간지가 한국 음력 해 간지와 다릅니다.");

  const mutagenOf = new Map<StarId, (typeof MUTAGEN_ORDER)[number]>(MUTAGEN_TABLE[year.stem].map((id, i) => [id, MUTAGEN_ORDER[i]]));
  const stars: ZiweiStarPlacement[] = [];
  const rawPalaces = lib.palaces.map(p => {
    const id = must(ZH_PALACE, p.name, "궁 이름");
    const branch = must(ZH_BRANCH, p.earthlyBranch, "지지");
    const stem = must(ZH_STEM, p.heavenlyStem, "천간");
    const place = (zh: { name: string; brightness?: string; mutagen?: string }, expectKind: "major" | "minor" | "love"): StarId => {
      const sid = must(ZH_STAR, zh.name, "별 이름");
      const kind = STAR_NAMES[sid].kind;
      if ((expectKind === "major") !== (kind === "major") || (expectKind === "love") !== (kind === "love")) throw new ZiweiMappingError("별 종류", zh.name);
      const raw = BRIGHTNESS_TABLE[sid as keyof typeof BRIGHTNESS_TABLE]?.[brightnessIndex(branch)] ?? null;
      const libRaw = zh.brightness ? must(ZH_BRIGHTNESS, zh.brightness, "밝기") : null;
      if (expectKind !== "love" && libRaw !== raw) throw new Error(`밝기 표가 라이브러리와 다릅니다: ${sid} ${branch} ${raw} ≠ ${libRaw}`);
      const mutagen = mutagenOf.get(sid);
      const libMutagen = zh.mutagen ? must(ZH_MUTAGEN, zh.mutagen, "사화") : undefined;
      if (expectKind !== "love" && libMutagen !== mutagen) throw new Error(`사화 표가 라이브러리와 다릅니다: ${sid} ${mutagen} ≠ ${libMutagen}`);
      stars.push({ id: sid, kind, palace: id, branch, brightness: raw ? { raw, level: BRIGHTNESS3_OF[raw] } : null, brightnessBasis: brightnessBasisOf(sid, branch, raw), ...(mutagen ? { mutagen } : {}) });
      return sid;
    };
    const majors = p.majorStars.map(s => place(s, "major")) as MajorStarId[];
    const minors = p.minorStars.map(s => place(s, "minor"));
    const loves = p.adjectiveStars.filter(s => ZH_STAR[s.name] && STAR_NAMES[ZH_STAR[s.name]].kind === "love").map(s => place(s, "love"));
    return { id, branch, stem, isBody: p.isBodyPalace, majors, minors, loves, range: p.decadal.range };
  });

  const byBranch = new Map(rawPalaces.map(p => [p.branch, p]));
  const life = rawPalaces.find(p => p.id === "myeong");
  const body = rawPalaces.find(p => p.isBody);
  if (rawPalaces.length !== 12 || byBranch.size !== 12 || !life || !body) throw new Error("명반 12궁을 읽을 수 없습니다.");
  const palaceAt = (b: Branch): PalaceId => byBranch.get(b)!.id;
  const fiveClass = must(ZH_FIVE_CLASS, lib.fiveElementsClass, "오행국");
  const n = FIVE_CLASS_INFO[fiveClass].number;
  const forward = yang === (input.gender === "MALE");

  const decadals: ZiweiDecadal[] = Array.from({ length: 12 }, (_, k) => {
    const branch = branchAt(bIdx(life.branch) + (forward ? k : -k));
    const p = byBranch.get(branch)!;
    const startAge = n + 10 * k, endAge = startAge + 9;
    if (p.range[0] !== startAge || p.range[1] !== endAge) throw new Error(`대한 범위가 라이브러리와 다릅니다: ${p.id} ${startAge}-${endAge} ≠ ${p.range.join("-")}`);
    return { index: k, palace: p.id, branch, stem: p.stem, startAge, endAge, startYear: lunar.year + startAge - 1, endYear: lunar.year + endAge - 1 };
  });
  const decadalOf = new Map(decadals.map(d => [d.palace, d]));

  const palaces: ZiweiPalace[] = PALACES.map(id => {
    const p = rawPalaces.find(x => x.id === id)!;
    const b = bIdx(p.branch);
    const helpers = p.minors.filter(s => STAR_NAMES[s].kind === "helper");
    const malefics = p.minors.filter(s => STAR_NAMES[s].kind === "malefic");
    const empty = p.majors.length === 0;
    return {
      id, branch: p.branch, stem: p.stem, isBody: p.isBody, majors: p.majors, helpers, malefics, loves: p.loves, empty,
      ...(empty ? { borrowFrom: palaceAt(branchAt(b + 6)) } : {}),
      ...(p.majors.length === 2 ? { pair: pairIdOf(p.majors[0], p.majors[1]) } : {}),
      sanbang: [id, palaceAt(branchAt(b + 6)), palaceAt(branchAt(b + 4)), palaceAt(branchAt(b + 8))],
      decadal: decadalOf.get(id)!,
    };
  });

  const asOfLunar = solarToKoreanLunar(asOf);
  const age = asOfLunar.year - lunar.year + 1;
  const current = decadals.find(d => d.startAge <= age && age <= d.endAge)?.index;
  const next = current === undefined ? (age < n ? 0 : undefined) : current + 1 < 12 ? current + 1 : undefined;
  const variants = MUTAGEN_SCHOOL_VARIANTS[year.stem] ?? [];
  const sajuYear = dh.saju.year;

  return {
    calcVersion: ZIWEI_CALC_VERSION,
    basis: ZIWEI_BASIS,
    birth: { gender: input.gender, precision: dh.precision, date: dh.date, lunar, month: eff.month, monthRolledToNextYear: eff.rolledToNextYear, day: lunar.day, hourBranch: dh.hourBranch, hourIndex: dh.hourIndex },
    year: { ...year, yang, differsFromSaju: sajuYear !== year.stem + year.branch },
    lifePalace: { branch: life.branch },
    bodyPalace: { branch: body.branch, palace: body.id },
    fiveClass: { id: fiveClass, number: n },
    direction: forward ? "forward" : "backward",
    palaces,
    stars,
    mutagens: MUTAGEN_TABLE[year.stem].map((star, i) => {
      const placed = stars.find(s => s.id === star);
      if (!placed) throw new Error(`사화 별이 명반에 없습니다: ${star}`);
      return { mutagen: MUTAGEN_ORDER[i], star, palace: placed.palace, schoolVariant: variants.some(v => v.mutagen === MUTAGEN_ORDER[i]) };
    }),
    pairs: palaces.filter(p => p.pair).map(p => ({ id: p.pair!, palace: p.id })),
    decadals,
    now: { asOf, ...(current !== undefined ? { current } : {}), ...(next !== undefined ? { next } : {}) },
  };
}
