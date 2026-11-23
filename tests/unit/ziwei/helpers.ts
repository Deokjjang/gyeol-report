import { BIRTH_TIME_SLOT_DEFINITIONS } from "@/lib/saju/birthTimePrecisionTypes";
import { getDayPillarFromSolarDate } from "@/lib/saju/pillars";
import { MUTAGEN_TABLE } from "@/lib/ziwei/basis";
import { solarToKoreanLunar } from "@/lib/ziwei/lunar";
import { computeZiweiChart, type ZiweiChartInput } from "@/lib/ziwei/chart";
import { resolveBirthTimeCalculation } from "@/lib/saju/birthTimePrecision";
import { BRANCHES, HELPER_STARS, LOVE_STARS, MAJOR_STARS, MALEFIC_STARS, PALACES, STAR_PAIRS, STEMS } from "@/lib/ziwei/ids";
import type { ZiweiChart } from "@/lib/ziwei/types";
import { verifyChart } from "./verifier";

/** 결정론 난수(mulberry32). */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAY = 86_400_000;
/** 무작위 고객 n명: 1930~2030년 날짜, 정확한 시각 90% · 시진만 10%, 성별 반반. */
export function randomInputs(seed: number, n: number, from = "1930-01-01", to = "2030-12-31"): ZiweiChartInput[] {
  const r = rng(seed);
  const t0 = Date.parse(`${from}T00:00:00Z`), days = Math.round((Date.parse(`${to}T00:00:00Z`) - t0) / DAY) + 1;
  return Array.from({ length: n }, () => {
    const birthDate = new Date(t0 + Math.floor(r() * days) * DAY).toISOString().slice(0, 10);
    const gender = r() < 0.5 ? "MALE" : "FEMALE";
    if (r() < 0.1) return { birthDate, gender, birthTime: "", birthTimeUnknown: false, approximateBirthTimeSlot: BIRTH_TIME_SLOT_DEFINITIONS[Math.floor(r() * 12)].value } as ZiweiChartInput;
    const minute = Math.floor(r() * 1440);
    return { birthDate, gender, birthTime: `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`, birthTimeUnknown: false } as ZiweiChartInput;
  });
}

/** 어댑터 명반 ↔ 소형 검증기. 다른 칸을 문장으로 돌려준다(빈 배열 = 일치). */
export function compareWithVerifier(c: ZiweiChart): string[] {
  const v = verifyChart({ yearStem: c.year.stem, yearBranch: c.year.branch, month: c.birth.month, day: c.birth.day, hour: c.birth.hourIndex, male: c.birth.gender === "MALE" });
  const out: string[] = [];
  const life = c.palaces.find(p => p.id === "myeong")!;
  if (life.branch !== v.life) out.push(`명궁 ${life.branch}≠${v.life}`);
  if (c.bodyPalace.branch !== v.body) out.push(`신궁 ${c.bodyPalace.branch}≠${v.body}`);
  for (const p of c.palaces) if (p.stem !== v.palaceStems[p.branch]) out.push(`궁간 ${p.branch} ${p.stem}≠${v.palaceStems[p.branch]}`);
  if (c.fiveClass.number !== v.classNumber) out.push(`국 ${c.fiveClass.number}≠${v.classNumber}`);
  for (const id of MAJOR_STARS) {
    const s = c.stars.find(x => x.id === id);
    if (s?.branch !== v.majors[id]) out.push(`${id} ${s?.branch}≠${v.majors[id]}`);
  }
  const mut = c.mutagens.map(m => m.star).join(",");
  if (mut !== v.mutagens.join(",")) out.push(`사화 ${mut}≠${v.mutagens.join(",")}`);
  const dec = c.decadals.map(d => `${d.branch}${d.startAge}-${d.endAge}`).join(" ");
  const vdec = v.decadals.map(d => `${d.branch}${d.start}-${d.end}`).join(" ");
  if (dec !== vdec) out.push(`대한 ${dec}≠${vdec}`);
  return out;
}

const mod = (n: number, m: number) => ((n % m) + m) % m;
const bi = (b: string) => BRANCHES.indexOf(b as never);
/** 명반 불변식. 어긋난 것을 문장으로 돌려준다. */
export function invariantViolations(c: ZiweiChart, saju?: { readonly hour: string; readonly day: string }): string[] {
  const out: string[] = [];
  const count = (id: string) => c.stars.filter(s => s.id === id).length;
  for (const id of [...MAJOR_STARS, ...HELPER_STARS, ...MALEFIC_STARS, ...LOVE_STARS]) if (count(id) !== 1) out.push(`${id} ${count(id)}회`);
  const at = (id: string) => c.stars.find(s => s.id === id)!.branch;
  if (bi(at("cheonbu")) !== mod(4 - bi(at("jami")), 12)) out.push("자미 · 천부 인신 대칭 아님");
  if (c.mutagens.length !== 4 || new Set(c.mutagens.map(m => m.star)).size !== 4) out.push("사화 4개 아님");
  if (c.mutagens.map(m => m.star).join() !== MUTAGEN_TABLE[c.year.stem].join()) out.push("사화 표 다름");
  for (const m of c.mutagens) if (c.stars.find(s => s.id === m.star)?.mutagen !== m.mutagen || c.stars.find(s => s.id === m.star)?.palace !== m.palace) out.push(`사화 칸 다름 ${m.star}`);
  if (c.stars.filter(s => s.mutagen).length !== 4) out.push("사화 붙은 별 4개 아님");
  if (saju && saju.hour.slice(1) !== c.birth.hourBranch) out.push("사주 시지 ≠ 자미 시진");
  if (BRANCHES[c.birth.hourIndex] !== c.birth.hourBranch) out.push("시진 번호 ≠ 시진");
  const day = getDayPillarFromSolarDate(c.birth.date);
  if (saju && saju.day !== day.stem + day.branch) out.push("자미 날짜 일진 ≠ 사주 일주");
  if (new Set(c.palaces.map(p => p.branch)).size !== 12 || c.palaces.map(p => p.id).join() !== PALACES.join()) out.push("12궁 아님");
  const life = c.palaces[0];
  c.palaces.forEach((p, k) => { if (bi(p.branch) !== mod(bi(life.branch) - k, 12)) out.push(`궁 순서 ${p.id}`); });
  const yinStem = mod((STEMS.indexOf(c.year.stem) % 5) * 2 + 2, 10);
  for (const p of c.palaces) if (STEMS.indexOf(p.stem) !== mod(yinStem + mod(bi(p.branch) - 2, 12), 10)) out.push(`오호둔 ${p.branch}`);
  if (c.decadals.length !== 12 || c.decadals[0].startAge !== c.fiveClass.number || c.decadals[0].palace !== "myeong") out.push("첫 대한");
  for (let k = 1; k < 12; k++) {
    const a = c.decadals[k - 1], b = c.decadals[k];
    if (b.startAge !== a.endAge + 1 || b.startYear !== a.endYear + 1 || b.endAge - b.startAge !== 9) out.push(`대한 연속 ${k}`);
    if (bi(b.branch) !== mod(bi(a.branch) + (c.direction === "forward" ? 1 : -1), 12)) out.push(`대한 방향 ${k}`);
  }
  if (c.decadals[0].startYear !== c.birth.lunar.year + c.fiveClass.number - 1) out.push("대한 연도가 실제 출생 해와 다름");
  const nowAge = solarToKoreanLunar(c.now.asOf).year - c.birth.lunar.year + 1;
  const containing = c.decadals.filter(x => x.startAge <= nowAge && nowAge <= x.endAge);
  const lastEnd = c.decadals[11].endAge;
  if (nowAge < c.fiveClass.number ? c.now.current !== undefined || c.now.next !== 0
    : nowAge > lastEnd ? c.now.current !== undefined || c.now.next !== undefined
    : containing.length !== 1 || containing[0].index !== c.now.current) out.push("지금 대한 하나 아님");
  let singles = 0, pairs = 0, empties = 0;
  for (const p of c.palaces) {
    if (p.majors.length === 0) { empties++; if (!p.empty || !p.borrowFrom) out.push(`공궁 표시 ${p.id}`); else if (c.palaces.find(x => x.id === p.borrowFrom)!.majors.length === 0) out.push(`빌릴 칸도 공궁 ${p.id}`); }
    else if (p.majors.length === 1) singles++;
    else if (p.majors.length === 2) { pairs++; if (!p.pair || !STAR_PAIRS.includes(p.pair)) out.push(`쌍성 ${p.pair}`); }
    else out.push(`주성 3개 이상 ${p.id}`);
    if (p.sanbang[0] !== p.id) out.push("삼방사정 본궁");
  }
  if (singles + pairs + empties !== 12 || singles + 2 * pairs !== 14) out.push("주성 칸 수");
  if (c.pairs.length !== pairs) out.push("쌍성 목록");
  return out;
}

/** 무작위 1만 명 시험 한 조각(파일 4개 × 2,500명, seed 20261124 + 조각 번호). 어긋남을 문장으로 돌려준다. */
export function randomShardFailures(shard: number, n = 2500): { checked: number; failures: string[] } {
  const failures: string[] = [];
  let checked = 0;
  for (const input of randomInputs(20261124 + shard, n)) {
    const c = computeZiweiChart(input, "2026-11-24");
    const ctx = resolveBirthTimeCalculation(input);
    const saju = { hour: ctx.confirmed.hour!.stem + ctx.confirmed.hour!.branch, day: ctx.confirmed.day!.stem + ctx.confirmed.day!.branch };
    const v = [...compareWithVerifier(c), ...invariantViolations(c, saju)];
    checked++;
    if (v.length) failures.push(`${input.birthDate} ${input.birthTime || input.approximateBirthTimeSlot} ${input.gender}: ${v.join("; ")}`);
  }
  return { checked, failures };
}
