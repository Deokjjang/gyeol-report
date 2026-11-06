/**
 * calc-audit 1-a 1부 보조: 같은 뜻의 표가 두 군데 있을 때 서로 같은지 본다(읽기 전용).
 *   십이운성: 만세력 표(v4 표 데이터, sajuPillarFeaturePlacement.ts twelveLifeStageByStem) ↔ v5 감지(detections/twelveStages.ts)
 *   대운수 표기: 전통 대운수(traditionalDaeunsu) ↔ dayunLabel 「만 X~Y세」의 X(교운 해 − 출생 해) ↔ 교운 순간의 실제 만 나이
 * 실행: pnpm exec tsx scripts/calc-audit/consistency.ts   (출력: docs/v5/calc-audit/consistency.json)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { getTwelveStage } from "../../src/lib/saju/detections/twelveStages";
import { calculateCustomerDayun } from "../../src/lib/saju/customerDayun";
import { calculateTraditionalDaeunsu } from "../../src/lib/saju/traditionalDaeunsu";
import { dayunLabel } from "../../src/lib/brief/labels";
import type { EarthlyBranch, HeavenlyStem } from "../../src/lib/saju/types";

const OUT = new URL("../../docs/v5/calc-audit/", import.meta.url);
// 1) 십이운성 두 표
const KO_STEM: Record<string, HeavenlyStem> = { 갑: "甲", 을: "乙", 병: "丙", 정: "丁", 무: "戊", 기: "己", 경: "庚", 신: "辛", 임: "壬", 계: "癸" };
const KO_BRANCH: Record<string, EarthlyBranch> = { 자: "子", 축: "丑", 인: "寅", 묘: "卯", 진: "辰", 사: "巳", 오: "午", 미: "未", 신: "申", 유: "酉", 술: "戌", 해: "亥" };
const STAGE_KO: Record<string, string> = { 長生: "장생", 沐浴: "목욕", 冠帶: "관대", 建祿: "건록", 帝旺: "제왕", 衰: "쇠", 病: "병", 死: "사", 墓: "묘", 絶: "절", 胎: "태", 養: "양" };
const src = readFileSync(new URL("../../src/lib/report-knowledge/sajuPillarFeaturePlacement.ts", import.meta.url), "utf8");
const block = src.slice(src.indexOf("const twelveLifeStageByStem"), src.indexOf("} as const satisfies Record<NormalizedStem, Record<NormalizedBranch, string>>;", src.indexOf("const twelveLifeStageByStem")));
const v4: Record<string, Record<string, string>> = {};
let stem = "";
for (const line of block.split("\n")) {
  const s = /^\s{2}(\S):\s*\{/.exec(line); if (s) { stem = s[1]; v4[stem] = {}; continue; }
  const b = /^\s{4}(\S):\s*"([^"]+)"/.exec(line); if (b && stem) v4[stem][b[1]] = b[2];
}
const stageDiff: string[] = [];
let stageCells = 0;
for (const [ks, hs] of Object.entries(KO_STEM)) for (const [kb, hb] of Object.entries(KO_BRANCH)) {
  stageCells++;
  const a = v4[ks]?.[kb], b = STAGE_KO[getTwelveStage(hs, hb)];
  if (a !== b) stageDiff.push(`${hs}${hb}: 표 ${a} / 감지 ${b}`);
}

// 2) 대운수 ↔ 만 나이 표기(무작위 3,000명, 1930~2025, 정확한 시각)
let seed = 7;
const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const tally = { n: 0, daeunsuEqualsLabelStart: 0, daeunsuPlus1: 0, daeunsuMinus1: 0, other: 0, labelStartEqualsTrueManAgeAtSwitch: 0, daeunsuEqualsTrueManAgeAtSwitch: 0 };
const examples: string[] = [];
for (let i = 0; i < 3000; i++) {
  const t = Date.UTC(1930, 0, 1) + Math.floor(rand() * (Date.UTC(2026, 0, 1) - Date.UTC(1930, 0, 1)) / 60000) * 60000;
  const iso = new Date(t).toISOString();
  const input = { birthDate: iso.slice(0, 10), birthTime: iso.slice(11, 16), birthTimeUnknown: false, gender: rand() < 0.5 ? "MALE" : "FEMALE", name: "audit" } as const;
  const d = calculateCustomerDayun(input), tr = calculateTraditionalDaeunsu(input);
  if (!d.ok || !tr.ok) continue;
  tally.n++;
  const c = d.value.cycles[0];
  // 운영 Q 8-1 뒤 dayunLabel 둘째 인자는 생일(대운수 = 교운 때 만 나이). 1-a 감사 당시 X(교운 해 − 출생 해)를 다시 재려고 생일 없이 부른다.
  const label = dayunLabel(c, undefined, d.value.cycles[1]);
  const labelStart = Number(/^만 (\d+)~/.exec(label.ages)![1]);
  // 교운 순간(KST 날짜)의 실제 만 나이: 생일이 지났는지 본다.
  const sw = c.startSolarKst!;
  const [by, bm, bd] = input.birthDate.split("-").map(Number), [sy, sm, sd] = sw.slice(0, 10).split("-").map(Number);
  const trueMan = sy - by - (sm < bm || (sm === bm && sd < bd) ? 1 : 0);
  const k = tr.value.daeunsu - labelStart;
  if (k === 0) tally.daeunsuEqualsLabelStart++; else if (k === 1) tally.daeunsuPlus1++; else if (k === -1) tally.daeunsuMinus1++; else tally.other++;
  if (labelStart === trueMan) tally.labelStartEqualsTrueManAgeAtSwitch++;
  if (tr.value.daeunsu === trueMan) tally.daeunsuEqualsTrueManAgeAtSwitch++;
  if (k !== 0 && examples.length < 6) examples.push(`${input.birthDate} ${input.birthTime} ${input.gender}: ${label.line} · ${label.ages} · 교운 ${sw.slice(0, 16)} · 교운 때 실제 만 ${trueMan}세`);
}
const out = { twelveStages: { cells: stageCells, differ: stageDiff.length, diff: stageDiff }, daeunsuVsAgeLabel: { ...tally, examples } };
writeFileSync(new URL("consistency.json", OUT), JSON.stringify(out, null, 2) + "\n");
console.log(JSON.stringify(out, null, 2));
