/**
 * P6 만세력 표 정합성: v5 발행 경로(v4People)가 고정하는 표가 엔진(analyzeChartDetections) 결과와 같은가.
 * - 관계는 구성원 자리 모두에 짝으로, 신살·귀인은 엔진이 낸 모든 자리에, 표에는 엔진이 내지 않은 것이 없다.
 * - 브리프(collectFeatureHits)의 신살·귀인 자리도 표와 같다(같은 기준).
 * - 이미 저장된 v5 Book은 저장된 표 그대로 연다(읽을 때 재계산 없음).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { NatalTable } from "@/app/dev/book-preview/BookPages";
import type { BookPerson } from "@/app/dev/book-preview/bookTypes";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import { collectFeatureHits } from "@/lib/brief/featureHits";
import { generateV4ShadowReport } from "@/lib/interpretation-v4/runtimeShadow";
import { projectV4Tables, type V4RuntimeEvidence } from "@/lib/interpretation-v4/runtimeProjection";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { COMPATIBILITY_ROLE_VERSION, type ReportInputPayload } from "@/lib/report-generation/reportInputTypes";
import { EXTRA_SHINSAL_LABEL, V5_ROW_LABELS } from "@/lib/report-tables/v5NatalRows";
import { calculateSaju } from "@/lib/saju/calculateSaju";
import { analyzeChartDetections, type ChartDetections, type ChartPosition, type RelationHit } from "@/lib/saju/detections";
import { HYEONCHIM_CHARS } from "@/lib/saju/detections/tables";
import { SHINSAL_METADATA } from "@/lib/saju/shinsalConstants";
import type { SajuCalcResult } from "@/lib/saju/types";
import { applySafetyNet } from "@/lib/writer/safety";
import { assembleV5Book, createV5Snapshot, payloadToBriefInput, projectV5Book } from "@/lib/writer/book";
import { buildWriterPrompt } from "@/lib/writer/prompt";
import { v4People } from "@/lib/writer/publish";

const POLICY_AT = "2026-10-27T03:00:00.000Z";
const POS: readonly ChartPosition[] = ["year", "month", "day", "hour"];
const SLOT = { stem: { year: "연간", month: "월간", day: "일간", hour: "시간" }, branch: { year: "연지", month: "월지", day: "일지", hour: "시지" } } as const;

type Case = { id: string; birthDate: string; birthTime: string; gender: "MALE" | "FEMALE"; pillars: string; mbti?: string };
/**
 * 20 기준 사례: 절입일에서 떨어진 날짜, 남녀·시간 미상 섞음, 드문 관계(삼합·방합·삼형·자형·상형·천간충·쟁합·괴강·귀문) 포함. pillars = 년 월 일 시.
 * c01은 MBTI를 넣는다: MBTI 없이는 v4 종합 원고 안전 검사(COMPREHENSIVE_MANUSCRIPT_UNSAFE)에 걸려 v4People가 표를 못 만든다(P6 이전부터 있던 문제, 별도 과제).
 */
const CASES: Case[] = [
  { id: "c01 사용자 신고(남)", birthDate: "1999-07-31", birthTime: "08:27", gender: "MALE", pillars: "己卯 辛未 甲申 戊辰", mbti: "ENTJ" },
  { id: "c02 사용자 신고(여)", birthDate: "2000-05-11", birthTime: "17:05", gender: "FEMALE", pillars: "庚辰 辛巳 己巳 壬申" },
  { id: "c03", birthDate: "1996-12-16", birthTime: "09:30", gender: "MALE", pillars: "" },
  { id: "c04 시간 미상", birthDate: "1989-03-21", birthTime: "", gender: "FEMALE", pillars: "" },
  { id: "c05", birthDate: "1978-07-15", birthTime: "22:10", gender: "MALE", pillars: "" },
  { id: "c06 천간충·괴강·파", birthDate: "1955-01-24", birthTime: "08:10", gender: "MALE", pillars: "甲午 丁丑 乙酉 庚辰" },
  { id: "c07 자형 午午", birthDate: "1955-01-24", birthTime: "12:40", gender: "FEMALE", pillars: "甲午 丁丑 乙酉 壬午" },
  { id: "c08 상형·음착양차", birthDate: "1955-03-16", birthTime: "02:30", gender: "MALE", pillars: "乙未 己卯 丙子 己丑" },
  { id: "c09 귀문·쟁합", birthDate: "1955-04-22", birthTime: "12:40", gender: "FEMALE", pillars: "乙未 庚辰 癸丑 戊午" },
  { id: "c10 丑戌未 삼형", birthDate: "1955-04-22", birthTime: "20:50", gender: "MALE", pillars: "乙未 庚辰 癸丑 壬戌" },
  { id: "c11 巳午未 방합", birthDate: "1955-05-26", birthTime: "12:40", gender: "FEMALE", pillars: "乙未 辛巳 丁亥 丙午" },
  { id: "c12 申子辰 삼합", birthDate: "1956-11-17", birthTime: "08:10", gender: "MALE", pillars: "丙申 己亥 戊子 丙辰" },
  { id: "c13 시간 미상", birthDate: "1970-01-25", birthTime: "", gender: "MALE", pillars: "" },
  { id: "c14", birthDate: "1985-10-24", birthTime: "03:15", gender: "FEMALE", pillars: "" },
  { id: "c15", birthDate: "1992-02-18", birthTime: "11:50", gender: "MALE", pillars: "" },
  { id: "c16", birthDate: "2001-09-14", birthTime: "19:40", gender: "FEMALE", pillars: "" },
  { id: "c17", birthDate: "1964-11-28", birthTime: "06:05", gender: "MALE", pillars: "" },
  { id: "c18 시간 미상", birthDate: "1995-06-30", birthTime: "", gender: "FEMALE", pillars: "" },
  { id: "c19", birthDate: "2006-03-27", birthTime: "07:20", gender: "MALE", pillars: "" },
  { id: "c20", birthDate: "2015-11-19", birthTime: "12:00", gender: "FEMALE", pillars: "" },
];

const personOf = (c: Case) => ({ name: c.id.slice(0, 3), birthDate: c.birthDate, birthTime: c.birthTime, birthTimeUnknown: !c.birthTime, approximateBirthTimeSlot: "", gender: c.gender, mbtiType: c.mbti ?? "" });
function payloadOf(c: Case): ReportInputPayload {
  const n = normalizeReportInputPayload({ productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: personOf(c),
    userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "기획자", focusAreas: [] }, productOptions: {} }, { now: () => new Date(POLICY_AT) });
  if (!n.ok) throw new Error(`payload ${c.id}: ${n.error}`);
  return n.value as ReportInputPayload;
}
/** 브리프와 같은 계산(buildBrief analyzePerson과 같은 인자). */
function briefSaju(c: Case): SajuCalcResult {
  return calculateSaju({ birthDate: c.birthDate, birthTime: c.birthTime, birthTimeUnknown: !c.birthTime, approximateBirthTimeSlot: "" as never, calendarType: "SOLAR", gender: c.gender, timezone: "Asia/Seoul" });
}

type Manse = BookPerson["table"]["manse"];
const row = (t: Manse, key: string) => t.detailRows.find((r) => r.key === key)!;
const isStem = (r: RelationHit) => r.kind === "STEM_HAP" || r.kind === "STEM_CHUNG";
/** 표 이름(테스트 쪽 독립 정의). */
function relationHead(r: RelationHit): string {
  const name = { STEM_HAP: "천간합", STEM_CHUNG: "천간충", YUKHAP: "육합", SAMHAP: r.completeness === "full" ? "삼합" : "반합", BANGHAP: "방합", CHUNG: "충",
    HYEONG: r.subtype === "자형" ? "자형" : r.subtype === "삼형" && r.completeness === "full" ? "삼형" : "형", PA: "파", HAE: "해", WONJIN: "원진" }[r.kind];
  return `${[...r.key].filter((ch) => r.members.some((m) => m.char === ch)).join("")} ${name}`;
}
const parse = (text: string) => { const [head, partners] = text.split(" · "); return { head, partners: partners.split("·") }; };
const engineRelations = (det: ChartDetections) => [...det.relations, ...det.stemClashes];

/** 엔진 신살·귀인 → (줄, 자리, 이름). 원진은 관계 줄에서 짝으로 본다. */
function engineMarks(det: ChartDetections): { row: "twelveSinsal" | "sinsalAndGwiin"; position: ChartPosition; label: string }[] {
  return [
    ...det.shinsal.flatMap((s) => s.positions.map((position) => ({ row: s.category === "TWELVE_SHINSAL" ? "twelveSinsal" as const : "sinsalAndGwiin" as const, position, label: s.labelKo }))),
    ...det.extraShinsal.filter((x) => x.code !== "WONJIN").flatMap((x) => x.positions.map((position) => ({ row: "sinsalAndGwiin" as const, position, label: EXTRA_SHINSAL_LABEL[x.code] }))),
  ];
}

/** 지지만 보고 정해지는 표식(같은 지지면 같은 표식이어야 한다). */
const BRANCH_ONLY_LABELS = new Set([
  ...(["HONGYEOMSAL", "MANGSINSAL", "YEOKMASAL", "DOHWASAL", "HWAGAE", "GOSINSAL", "GWASUKSAL", "CHEON_EUL_GWIIN", "TAEGEUK_GWIIN", "MUN_CHANG_GWIIN", "HAK_DANG_GWIIN"] as const).map((c) => SHINSAL_METADATA[c].labelKo),
  ...(["YANGIN", "CHEONMUN", "AMROK", "BOKSEONG", "GEUMYEO", "MUNGOK", "JAEGO", "CHEON_EUI", "GONGMANG"] as const).map((c) => EXTRA_SHINSAL_LABEL[c]),
]);

const built = new Map<string, Promise<{ saju: SajuCalcResult; det: ChartDetections; table: Manse }>>();
function buildCase(c: Case) {
  if (!built.has(c.id)) built.set(c.id, (async () => {
    const people = await v4People(payloadOf(c), POLICY_AT);
    expect(people, `${c.id}: v4People가 표를 만들지 못함`).toHaveLength(1);
    const saju = briefSaju(c);
    return { saju, det: analyzeChartDetections(saju), table: people[0].table.manse };
  })());
  return built.get(c.id)!;
}

describe("P6 만세력 표 = 엔진 결과(20 기준 사례)", () => {
  it.each(CASES)("$id", async (c) => {
    const { saju, det, table } = await buildCase(c);
    const included = POS.filter((p) => p !== "hour" || det.hourIncluded);

    // 기둥: 표 = 브리프 계산. 시간 미상이면 시주 없음.
    const pillars = included.map((p) => `${table.stemRow[p]?.hanja}${table.branchRow[p]?.hanja}`);
    expect(pillars).toEqual(included.map((p) => saju.pillars[p]!.stem + saju.pillars[p]!.branch));
    if (c.pillars) expect(pillars.join(" ")).toBe(c.pillars);
    if (!c.birthTime) {
      expect(det.hourIncluded).toBe(false);
      expect(table.stemRow.hour).toBeNull();
      for (const key of ["twelveSinsal", "sinsalAndGwiin", "interactions"]) expect(row(table, key).cells.hour).toEqual([]);
    }
    expect(row(table, "interactions").label).toBe(V5_ROW_LABELS.interactions);
    expect(row(table, "twelveSinsal").label).toBe(V5_ROW_LABELS.twelveSinsal);

    // 관계: 엔진 관계마다 구성원 자리 모두에 같은 이름 + 나머지 자리.
    const inter = row(table, "interactions").cells;
    for (const r of engineRelations(det)) {
      const ps = r.members.map((m) => m.position as ChartPosition);
      for (const p of ps) {
        const want = ps.filter((q) => q !== p).map((q) => SLOT[isStem(r) ? "stem" : "branch"][q]);
        expect(inter[p].map(parse).some((e) => e.head === relationHead(r) && want.every((w) => e.partners.includes(w))), `${c.id} ${r.kind} ${r.key} @${p}: ${JSON.stringify(inter[p])}`).toBe(true);
      }
    }
    // 표의 관계 칸 하나하나가 엔진 관계로 설명된다.
    for (const p of POS) for (const text of inter[p]) {
      const e = parse(text);
      for (const partner of e.partners) {
        const ok = engineRelations(det).some((r) => {
          const ps = r.members.map((m) => m.position as ChartPosition);
          return relationHead(r) === e.head && ps.includes(p) && ps.some((q) => q !== p && SLOT[isStem(r) ? "stem" : "branch"][q] === partner);
        });
        expect(ok, `${c.id} 표에만 있는 관계 @${p}: ${text}`).toBe(true);
      }
    }

    // 신살·귀인: 엔진 표식이 그 자리 칸에 있고, 표의 표식은 모두 엔진에서 왔다.
    const marks = engineMarks(det);
    for (const m of marks) expect(row(table, m.row).cells[m.position], `${c.id} ${m.label} @${m.position}`).toContain(m.label);
    for (const key of ["twelveSinsal", "sinsalAndGwiin"] as const) for (const p of POS) for (const label of row(table, key).cells[p]) {
      expect(marks.some((m) => m.row === key && m.position === p && m.label === label), `${c.id} 표에만 있는 표식 ${key} @${p}: ${label}`).toBe(true);
    }
    // 원진(신살)은 관계 줄에 짝으로 있다.
    for (const w of det.extraShinsal.filter((x) => x.code === "WONJIN")) for (const p of w.positions) expect(inter[p].some((t) => t.includes(" 원진 · ")), `${c.id} 원진 @${p}`).toBe(true);

    // 글자 기준: 현침 글자가 있는 모든 기둥(천간·지지 어느 쪽이든)에만 현침살.
    for (const p of included) {
      const has = HYEONCHIM_CHARS.includes(saju.pillars[p]!.stem) || HYEONCHIM_CHARS.includes(saju.pillars[p]!.branch);
      expect(row(table, "sinsalAndGwiin").cells[p].includes("현침살"), `${c.id} 현침 @${p}`).toBe(has);
    }
    // 같은 지지가 두 자리에 있으면 지지 기준 표식(십이신살 포함)도 두 자리에 똑같이.
    for (const p of included) for (const q of included) {
      if (POS.indexOf(p) >= POS.indexOf(q) || saju.pillars[p]!.branch !== saju.pillars[q]!.branch) continue;
      const branchMarks = (x: ChartPosition) => row(table, "sinsalAndGwiin").cells[x].filter((l) => BRANCH_ONLY_LABELS.has(l));
      expect(branchMarks(p), `${c.id} 같은 지지 ${p}/${q}`).toEqual(branchMarks(q));
      expect(row(table, "twelveSinsal").cells[p]).toEqual(row(table, "twelveSinsal").cells[q]);
    }

    // 브리프: 신살·귀인 featureHit 자리 = 표에서 그 이름이 있는 자리.
    const labelOf = (id: string) => { const code = id.split(":")[1]; return code in SHINSAL_METADATA ? SHINSAL_METADATA[code as keyof typeof SHINSAL_METADATA].labelKo : EXTRA_SHINSAL_LABEL[code as keyof typeof EXTRA_SHINSAL_LABEL]; };
    for (const h of collectFeatureHits(saju, det).filter((x) => (x.family === "shinsal" || x.family === "gwiin") && x.id !== "shinsal:WONJIN")) {
      const key = h.id.startsWith("shinsal:TWELVE_") ? "twelveSinsal" : "sinsalAndGwiin";
      expect(POS.filter((p) => row(table, key).cells[p].includes(labelOf(h.id))), `${c.id} 브리프 ${h.id}`).toEqual(h.positions);
    }
  }, 60_000);

  it("20 사례가 관계 종류·세부와 신살·귀인 41종을 모두 한 번 이상 지난다", () => {
    const seen = new Set<string>();
    for (const c of CASES) {
      const det = analyzeChartDetections(briefSaju(c));
      for (const r of engineRelations(det)) seen.add(`${r.kind}${r.subtype ? `:${r.subtype}` : ""}:${r.completeness}`);
      for (const s of det.shinsal) seen.add(s.code);
      for (const x of det.extraShinsal) seen.add(x.code);
    }
    expect([...seen].filter((t) => t.includes(":")).sort()).toEqual(["BANGHAP:full", "CHUNG:full", "HAE:full", "HYEONG:삼형:full", "HYEONG:삼형:partial", "HYEONG:상형:full", "HYEONG:자형:full",
      "PA:full", "SAMHAP:full", "SAMHAP:half", "STEM_CHUNG:full", "STEM_HAP:full", "WONJIN:full", "YUKHAP:full"]);
    for (const code of [...Object.keys(SHINSAL_METADATA), ...Object.keys(EXTRA_SHINSAL_LABEL)]) expect(seen.has(code), code).toBe(true);
  });

  it("c01 1999-07-31 08:27 남: 申辰·卯未 반합, 卯辰 해가 두 칸 모두에, 현침살은 년·월·일", async () => {
    const { table } = await buildCase(CASES[0]);
    const inter = row(table, "interactions").cells;
    expect(inter.day).toContain("申辰 반합 · 시지");
    expect(inter.hour).toContain("申辰 반합 · 일지");
    expect(inter.year).toContain("卯未 반합 · 월지");
    expect(inter.month).toContain("卯未 반합 · 연지");
    expect(inter.year).toContain("卯辰 해 · 시지");
    expect(inter.hour).toContain("卯辰 해 · 연지");
    expect(inter.year).toEqual(expect.arrayContaining(["甲己 천간합 · 일간", "卯申 원진 · 일지"]));
    expect(inter.day).toEqual(expect.arrayContaining(["甲己 천간합 · 연간", "卯申 원진 · 연지"]));
    const marks = row(table, "sinsalAndGwiin").cells;
    expect(POS.filter((p) => marks[p].includes("현침살"))).toEqual(["year", "month", "day"]);
  }, 60_000);

  it("c02 2000-05-11 17:05 여: 申辰 반합(연지·시지), 巳申 육합·파·형은 월지·일지 둘 다와", async () => {
    const { table } = await buildCase(CASES[1]);
    const inter = row(table, "interactions").cells;
    expect(inter.year).toContain("申辰 반합 · 시지");
    expect(inter.hour).toEqual(expect.arrayContaining(["申辰 반합 · 연지", "巳申 육합 · 월지·일지", "巳申 파 · 월지·일지", "巳申 형 · 월지·일지"]));
    for (const p of ["month", "day"] as const) expect(inter[p]).toEqual(["巳申 육합 · 시지", "巳申 파 · 시지", "巳申 형 · 시지"]);
    // 음간 己 일간은 양인을 내지 않는다(엔진 기준) — 예전 표의 파생 '양인살'이 남지 않는다.
    expect(Object.values(row(table, "sinsalAndGwiin").cells).flat()).not.toContain("양인살");
  }, 60_000);

  it("궁합 표: personA·personB가 각자의 원국 엔진 결과로 채워진다", async () => {
    const [a, b] = [CASES[0], CASES[3]];
    const n = normalizeReportInputPayload({ productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType: "love", compatibilityRoleVersion: COMPATIBILITY_ROLE_VERSION,
      personA: personOf(a), personB: personOf(b) }, { now: () => new Date(POLICY_AT) });
    if (!n.ok) throw new Error(String(n.error));
    const people = await v4People(n.value as ReportInputPayload, POLICY_AT);
    expect(people).toHaveLength(2);
    for (const [i, c] of [[0, a], [1, b]] as const) {
      const { table } = await buildCase(c);
      expect(people[i].table.manse.detailRows).toEqual(table.detailRows);
    }
  }, 120_000);
});

describe("저장된 v5 Book은 저장된 표로 연다", () => {
  it("P6 이전 형식 표(계산된 원국 합·충)를 다시 계산하지 않고 그대로 보여 준다", async () => {
    const c = CASES[0], payload = payloadOf(c);
    const v4 = await generateV4ShadowReport(payload, { evaluatedAt: POLICY_AT, policyDate: POLICY_AT });
    if (!v4.ok) throw new Error("v4");
    const oldTable = projectV4Tables(v4.evidencePacket as V4RuntimeEvidence)[0]; // P6 이전 v4People가 저장하던 표
    expect(oldTable.manse.detailRows.find((r) => r.key === "interactions")).toMatchObject({ label: "계산된 원국 합·충", cells: { year: ["연주·일주 천간합 甲己"], hour: [] } });
    const stored: BookPerson = { name: "c01", role: "주인공", birth: c.birthDate, gender: c.gender, precision: "exact", time: c.birthTime, mbti: c.mbti ?? "", timeLabel: `정확 · ${c.birthTime}`, table: oldTable };
    const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
    const brief = buildBrief(payloadToBriefInput(payload, "2026-10-27") as never, k);
    const plan = buildWriterPrompt(brief).chapters;
    const { chapters, report } = applySafetyNet(brief, plan, new Map());
    const { draft, evidence } = assembleV5Book({ brief, plan, finals: chapters, report, payload, generatedAt: POLICY_AT, people: [stored], writer: null, calls: [], tokens: { input: 0, cachedInput: 0, output: 0 }, costUsd: 0, durationMs: 1, briefHash: "h", knowledgeVersion: "kv", promptVersion: "pv", recovered: false });
    const snapshot = JSON.parse(JSON.stringify(createV5Snapshot({ reportId: "report_abcdefghijklmn", createdAtIso: POLICY_AT, draft, evidence })));
    const data = projectV5Book(snapshot);
    expect(data?.people[0].table).toEqual(oldTable);
    const html = renderToStaticMarkup(<NatalTable data={data!.people[0].table} />);
    expect(html).toContain("<abbr title=\"계산된 원국 합·충\">합·충</abbr>");
    expect(html).toContain("연주·일주 천간합 甲己");
    expect(html).not.toContain("申辰 반합");
  }, 120_000);

  it("새 표는 합·충·형·파·해 줄 이름과 모든 칸 값을 그대로 렌더한다(잘림 없음)", async () => {
    for (const c of [CASES[0], CASES[1], CASES[3]]) {
      const { table } = await buildCase(c);
      const html = renderToStaticMarkup(<NatalTable data={{ name: "x", manse: table, mbti: null, elements: [] }} />);
      expect(html).toContain(`<th scope="row">${V5_ROW_LABELS.interactions}</th>`);
      for (const r of table.detailRows) for (const p of POS) for (const v of r.cells[p]) expect(html).toContain(`<span>${v}</span>`);
    }
    // 390px 폭에서도 줄바꿈만 하고 자르지 않는다: 표 칸에 말줄임·숨김 규칙이 없다.
    const css = readFileSync(join(process.cwd(), "src/app/dev/book-preview/book.module.css"), "utf8");
    for (const line of css.split("\n").filter((l) => l.includes(".tables"))) expect(line).not.toMatch(/ellipsis|nowrap|overflow:\s*hidden|line-clamp/);
  }, 120_000);
});
