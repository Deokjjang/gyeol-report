/**
 * P2 감지 커버리지: 결정론적 의사난수 출생 입력 N건 → calculateSaju → analyzeChartDetections → collectFeatureHits.
 * 지식 DB id별 감지 횟수를 세고 docs/v5/p2-detection-coverage.md를 쓴다. 네트워크 없음.
 * 실행: pnpm exec tsx tools/p2-brief/detection-coverage.ts [N]
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { collectFeatureHits } from "../../src/lib/brief/featureHits";
import { calculateSaju } from "../../src/lib/saju/calculateSaju";
import { analyzeChartDetections } from "../../src/lib/saju/detections";
import type { Gender, SajuCalcInput } from "../../src/lib/saju/types";

const ROOT = join(__dirname, "..", "..");
const N = Number(process.argv[2] ?? 6000);

/** P1 시점 engineSupport=false(71) + 타입에만 있던 구조 3코드. */
const NOT_DETECTABLE_BEFORE_P2 = new Set<string>([
  ...["SAMHAP", "BANGHAP", "HYEONG", "PA", "HAE"].map((k) => `relation:${k}`),
  ...["GONGMANG", "GOEGANG", "YANGIN", "WONJIN", "GWIMUN", "CHEONMUN", "EUMCHAK_YANGCHA", "CHEONRA_JIMANG"].map((k) => `shinsal:${k}`),
  ...["AMROK", "BOKSEONG", "CHEON_EUI", "GEUMYEO", "MUNGOK", "JAEGO"].map((k) => `gwiin:${k}`),
  ...["RESOURCE_SUPPORTS_DAYMASTER", "OUTPUT_GENERATES_WEALTH", "WEALTH_GENERATES_OFFICER"].map((k) => `structure:${k}`),
]);
const isNotDetectableBefore = (id: string) => NOT_DETECTABLE_BEFORE_P2.has(id) || id.startsWith("climate:") || id.startsWith("twelveStage:");

function loadKnowledgeIds(): { id: string; family: string }[] {
  const dir = join(ROOT, "src/data/knowledge-v5/myeongri");
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .flatMap((f) => (JSON.parse(readFileSync(join(dir, f), "utf8").replace(/^﻿/, "")) as { features: { id: string; family: string }[] }).features)
    .map(({ id, family }) => ({ id, family }));
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sampleInputs(n: number, seed = 20261029): SajuCalcInput[] {
  const rand = mulberry32(seed);
  const genders: Gender[] = ["MALE", "FEMALE", "MALE", "FEMALE", "OTHER_OR_UNSPECIFIED"];
  const out: SajuCalcInput[] = [];
  for (let i = 0; i < n; i += 1) {
    const year = 1940 + Math.floor(rand() * 76);
    const month = 1 + Math.floor(rand() * 12);
    const day = 1 + Math.floor(rand() * new Date(Date.UTC(year, month, 0)).getUTCDate());
    const unknown = rand() < 0.2;
    const hh = Math.floor(rand() * 24);
    const mm = Math.floor(rand() * 60);
    out.push({
      birthDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      ...(unknown ? {} : { birthTime: `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}` }),
      birthTimeUnknown: unknown,
      calendarType: "SOLAR",
      gender: genders[Math.floor(rand() * genders.length)],
      timezone: "Asia/Seoul",
    });
  }
  return out;
}

function main() {
  const items = loadKnowledgeIds();
  const known = new Set(items.map((i) => i.id));
  const counts = new Map<string, number>();
  const strengths = new Map<string, Record<string, number>>();
  const skipReasons = new Map<string, number>();
  const unknownIds = new Set<string>();
  let charts = 0;
  let skipped = 0;
  for (const input of sampleInputs(N)) {
    let saju;
    try {
      saju = calculateSaju(input);
    } catch (error) {
      skipped += 1;
      const name = error instanceof Error ? error.name : "unknown";
      skipReasons.set(name, (skipReasons.get(name) ?? 0) + 1);
      continue;
    }
    charts += 1;
    for (const hit of collectFeatureHits(saju, analyzeChartDetections(saju))) {
      counts.set(hit.id, (counts.get(hit.id) ?? 0) + 1);
      const st = strengths.get(hit.id) ?? { strong: 0, medium: 0, weak: 0 };
      st[hit.strength] += 1;
      strengths.set(hit.id, st);
      if (!known.has(hit.id)) unknownIds.add(hit.id);
    }
  }

  const families = [...new Set(items.map((i) => i.family))];
  const rows = families.map((family) => {
    const ids = items.filter((i) => i.family === family).map((i) => i.id);
    const before = ids.filter((id) => !isNotDetectableBefore(id)).length;
    const after = ids.filter((id) => (counts.get(id) ?? 0) > 0);
    const never = ids.filter((id) => !counts.get(id));
    return { family, total: ids.length, before, after: after.length, never };
  });
  const total = rows.reduce((s, r) => s + r.total, 0);
  const before = rows.reduce((s, r) => s + r.before, 0);
  const after = rows.reduce((s, r) => s + r.after, 0);
  const never = rows.flatMap((r) => r.never);
  const rare = items
    .map((i) => ({ id: i.id, n: counts.get(i.id) ?? 0 }))
    .filter((x) => x.n > 0)
    .sort((a, b) => a.n - b.n)
    .slice(0, 12);

  const md = [
    "# v5 P2 감지 커버리지",
    "",
    `생성: \`pnpm exec tsx tools/p2-brief/detection-coverage.ts ${N}\` (결정론 시드 20261029, 1940~2015년 양력, 남·여·미지정, 약 20% 시간 미상).`,
    `차트 ${charts}건 계산(실패 ${skipped}건: ${[...skipReasons].map(([k, v]) => `${k} ${v}`).join(", ") || "-"} — 시간 미상·절입 경계로 원국이 하나로 정해지지 않는 입력) → analyzeChartDetections → collectFeatureHits. 지식 DB에 없는 id 방출: ${unknownIds.size}건${unknownIds.size ? ` (${[...unknownIds].join(", ")})` : ""}.`,
    "",
    "- P2 전 감지 가능 = P1 engineSupport 기준(조후 40·십이운성 12·관계 SAMHAP·BANGHAP·HYEONG·PA·HAE·신살 8·귀인 6 = 71개 제외) − 타입에만 있던 구조 3코드.",
    "- P2 후 감지 = 이번 표본에서 1회 이상 나온 id.",
    "",
    "| 가족 | 지식 항목 | P2 전 감지 가능 | P2 후 감지 | 미감지 |",
    "|---|---:|---:|---:|---|",
    ...rows.map((r) => `| ${r.family} | ${r.total} | ${r.before} | ${r.after} | ${r.never.length ? r.never.join(", ") : "-"} |`),
    `| **합계** | **${total}** | **${before}** | **${after}** | **${never.length}** |`,
    "",
    "## 드문 항목(표본 감지 횟수 하위 12)",
    "",
    ...rare.map((x) => `- \`${x.id}\`: ${x.n}회`),
    "",
    "## P2에서 새로 감지되는 항목(74)",
    "",
    "| id | 감지 차트 수 | strong / medium / weak |",
    "|---|---:|---|",
    ...items.filter((i) => isNotDetectableBefore(i.id)).map((i) => {
      const st = strengths.get(i.id) ?? { strong: 0, medium: 0, weak: 0 };
      return `| \`${i.id}\` | ${counts.get(i.id) ?? 0} | ${st.strong} / ${st.medium} / ${st.weak} |`;
    }),
    "",
    "## 미감지",
    "",
    never.length ? never.map((id) => `- \`${id}\``).join("\n") : "없음. 모든 지식 항목이 표본에서 1회 이상 감지되었다.",
    "",
  ].join("\n");
  writeFileSync(join(ROOT, "docs/v5/p2-detection-coverage.md"), md);
  console.log(`charts=${charts} skipped=${skipped} items=${total} before=${before} after=${after} never=${never.length} unknownIds=${unknownIds.size}`);
  if (never.length) console.log("never:", never.join(" "));
  if (unknownIds.size) console.log("unknown:", [...unknownIds].join(" "));
}

main();
