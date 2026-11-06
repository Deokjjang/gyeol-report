import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import type { BriefPersonInput } from "@/lib/brief/buildBrief";
import { DAYUN_AGE_NOTE, dayunLabel, personDaeunsu } from "@/lib/brief/labels";
import { pairRelations } from "@/lib/compat/relations";
import { pairRelationLines } from "@/lib/brief/compatibility";
import { calculateSaju } from "@/lib/saju/calculateSaju";
import { calculateCustomerDayun } from "@/lib/saju/customerDayun";
import { STEM_CHUNG_TABLE } from "@/lib/saju/detections/tables";
import { buildWriterPrompt } from "@/lib/writer/prompt";
import { applySafetyNet } from "@/lib/writer/safety";
import { assembleV5Book, createV5Snapshot, projectV5Book, type V5Evidence } from "@/lib/writer/book";
import { BookReader } from "@/app/dev/book-preview/BookReader";
import type { BookData, BookPage } from "@/app/dev/book-preview/bookTypes";

// 최종판3 7(궁합 점수 표기·관계 목록)·8(대운 표기 통일). 운영 Q 8-1: 대운수 = 한 사람에 한 숫자(첫 대운이 시작될 때의 만 나이), 「만 X~Y세」도 그 값에서 10씩. 호출 0, 결정론.
const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
const BASE = "2026-11-04";
const DEOKMIN: BriefPersonInput = { name: "장덕민", gender: "MALE", birthDate: "1999-07-31", birthTime: "08:27", birthTimeUnknown: false, mbtiType: "ENTJ", context: { relationshipStatus: "single", jobStatus: "business_owner", detailJob: "IT 서비스 창업" } };
const SODAM: BriefPersonInput = { name: "장소담", gender: "FEMALE", birthDate: "1996-12-06", birthTime: "14:15", birthTimeUnknown: false, mbtiType: "INTP", context: { relationshipStatus: "dating", jobStatus: "self_employed", detailJob: "카페 사장" } };
const SEONGMIN: BriefPersonInput = { name: "전성민", gender: "MALE", birthDate: "1992-11-09", birthTime: "19:45", birthTimeUnknown: false, mbtiType: "ISTJ" };
const sajuOf = (p: BriefPersonInput) => calculateSaju({ birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, approximateBirthTimeSlot: "" as never, calendarType: "SOLAR", gender: p.gender as "MALE", timezone: "Asia/Seoul" });
const dayunCycles = (p: BriefPersonInput) => { const r = calculateCustomerDayun({ ...p, approximateBirthTimeSlot: "", gender: p.gender } as never); if (!r.ok) throw new Error(r.error); return r.value.cycles; };

type Product = "saju_mbti_full" | "career_money_study" | "love_marriage_child" | "saju_mbti_compatibility" | "major_fortune" | "annual_fortune";
function book(product: Product, person = DEOKMIN, partner = SEONGMIN) {
  const pair = product === "saju_mbti_compatibility";
  const brief = buildBrief({ product, baseDate: BASE, person, ...(pair ? { partner, relationshipType: "love" as const } : {}), ...(product === "annual_fortune" ? { selectedYear: 2026 } : {}) }, k);
  const plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
  const { chapters, report } = applySafetyNet(brief, plan, new Map());
  const payload = (pair ? { productKey: product, personA: person, personB: partner } : { productKey: product, person }) as never;
  const b = assembleV5Book({ brief, plan, finals: chapters, report, payload, generatedAt: `${BASE}T05:00:00.000Z`, people: [], writer: null, calls: [], tokens: { input: 0, cachedInput: 0, output: 0 }, costUsd: 0, durationMs: 0, briefHash: "h", knowledgeVersion: "k", promptVersion: "p", recovered: false });
  const snap = (e: V5Evidence = b.evidence) => createV5Snapshot({ reportId: `report_final3${product.replace(/_/g, "")}`.slice(0, 40), createdAtIso: `${BASE}T05:00:00.000Z`, draft: b.draft, evidence: e });
  return { brief, ...b, data: projectV5Book(snap(), BASE)!, snap };
}
const html = (data: BookData, page: BookPage) => renderToStaticMarkup(<BookReader data={data} page={page} onNote={() => {}} onShare={() => {}} onPage={() => {}} />);
const pagesOf = <K extends BookPage["kind"]>(data: BookData, kind: K) => data.pages.filter((p): p is Extract<BookPage, { kind: K }> => p.kind === kind);

describe("8 대운 표기 통일(dayunLabel)", () => {
  it("장덕민 무진 대운: 2027년 5월 무렵부터 (대운수 7), 만 27~36세 — 대운수는 첫 대운(경오 2007-05) 교운 때 만 7세, 엔진 교운 시각 그대로", () => {
    const c = dayunCycles(DEOKMIN).find(x => x.ganji === "戊辰")!, base = personDaeunsu(DEOKMIN.birthDate, dayunCycles(DEOKMIN));
    expect(c.startSolarKst?.slice(0, 7)).toBe("2027-05");
    expect(base).toBe(7);
    expect(dayunLabel(c, base)).toMatchObject({ name: "무진 대운", start: "2027년 5월 무렵부터", daeunsu: 7, ages: "만 27~36세", years: "2027~2036", line: "무진 대운: 2027년 5월 무렵부터 (대운수 7)" });
    // 대운수는 한 사람에 한 숫자(모든 대운 줄에 같은 값), 「만 X~Y세」는 그 값에서 10씩.
    expect(new Set(dayunCycles(DEOKMIN).map(x => dayunLabel(x, base).daeunsu))).toEqual(new Set([7]));
    expect(dayunCycles(DEOKMIN).slice(0, 4).map(x => dayunLabel(x, base).ages)).toEqual(["만 7~16세", "만 17~26세", "만 27~36세", "만 37~46세"]);
    expect(dayunLabel(dayunCycles(SODAM).find(x => x.ganji === "丙申")!, personDaeunsu(SODAM.birthDate, dayunCycles(SODAM))).line).toBe("병신 대운: 2026년 8월 무렵부터 (대운수 9)");
    expect(dayunLabel(dayunCycles(SEONGMIN).find(x => x.ganji === "甲寅")!, personDaeunsu(SEONGMIN.birthDate, dayunCycles(SEONGMIN))).line).toBe("갑인 대운: 2021년 12월 무렵부터 (대운수 9)");
  });
  it("출생시간이 대략·미상이면 교운 가능 범위의 달(같은 해, 다르면 '4~6월')", () => {
    const c = { ...dayunCycles(DEOKMIN)[2], startSolarKst: null, startSolarRange: { earliestKst: "2027-04-02T00:00:00+09:00", latestKst: "2027-06-20T00:00:00+09:00" } };
    expect(dayunLabel(c, 7).line).toBe("무진 대운: 2027년 4~6월 무렵부터 (대운수 7)");
    const r = calculateCustomerDayun({ name: "x", birthDate: "1999-07-31", birthTime: "", birthTimeUnknown: false, approximateBirthTimeSlot: "JINSI", gender: "MALE" });
    expect(r.ok && dayunLabel(r.value.cycles[2], personDaeunsu("1999-07-31", r.value.cycles)).line).toMatch(/^무진 대운: 2027년 \d{1,2}(~\d{1,2})?월 무렵부터 \(대운수 7\)$/);
  });
  it("6개 상품의 브리프 currentDayun·next·timeline.cycles, 대운 전환 해 머리 문장, Book 부록이 같은 표기", () => {
    const want = dayunCycles(DEOKMIN).map(c => dayunLabel(c, 7));
    for (const product of ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"] as const) {
      const { brief, data } = book(product);
      const cd = brief.chart.currentDayun!;
      expect(cd.label, product).toBe(want.find(w => w.years === cd.years)!.line);
      expect(cd.ages, product).toBe("만 17~26세");
      expect(cd.next?.label, product).toBe("무진 대운: 2027년 5월 무렵부터 (대운수 7)");
      expect([cd.start, cd.next?.start], product).toEqual(["2017년 5월 무렵부터", "2027년 5월 무렵부터"]);
      for (const c of brief.timeline?.cycles ?? []) expect(c.label, product).toBe(want.find(w => w.years === c.years)!.line);
      const appendix = pagesOf(data, "appendix")[0];
      expect(appendix.notes, product).toEqual(["기사 대운: 2017년 5월 무렵부터 (대운수 7)", "무진 대운: 2027년 5월 무렵부터 (대운수 7)", DAYUN_AGE_NOTE]);
      expect(html(data, appendix), product).toContain("대운수는 첫 대운이 시작될 때의 만 나이예요.");
    }
  });
  it("대운 상품: 전환 해 카드·머리 문장·표 위 전환 줄", () => {
    const { brief, data } = book("major_fortune");
    const card = brief.timeline!.entries.find(e => e.key === "2027")!;
    expect(card.dayun).toMatchObject({ transition: true, start: "2027년 5월 무렵부터" });
    expect(card.head).toBe("2027년 정미(丁未)는 상관(傷官)이 하늘에, 정재(正財)가 땅에 들어오는 해예요. 이 해 5월 무렵부터 무진(戊辰) 대운이 시작되고, 10년의 중심 기운은 편재(偏財)예요.");
    const tl = pagesOf(data, "timeline")[0];
    expect(tl.transitions.map(t => `${t.before} → ${t.after} · ${t.date}`)).toEqual(["기사 대운 → 무진 대운 · 2027년 5월 무렵부터 (대운수 7)"]);
    expect(tl.years.find(y => y.year === 2027)!.transition).toBe("2027년 5월 무렵부터");
    expect(html(data, tl)).toContain("2027년 5월 무렵부터 · 대운 전환");
  });
});

describe("7 궁합 관계 목록(장소담 × 전성민)", () => {
  const { brief, data, evidence, snap } = book("saju_mbti_compatibility", SODAM, SEONGMIN);
  const c = brief.compatibility!;
  it("엔진 기준 전체 12줄: 丙壬 천간충 포함, 삼형 한 줄, 반합 '완성' 없음, 두 글자 형에 '세 땅' 없음, 모든 줄에 뜻 문장", () => {
    expect(c.relationsPlain).toHaveLength(12);
    expect(c.relationsSummary!.names).toEqual(["삼형", "육합", "충", "형", "천간합", "천간합", "천간합", "해", "반합", "천간충", "반합", "파"]);
    expect(c.relationsSummary!.line).toBe("두 사람 사이에서 찾은 관계는 모두 12가지예요. 합 6가지(천간합 3·육합 1·반합 2) · 형·충·파·해 6가지(삼형 1·형 1·충 1·천간충 1·파 1·해 1).");
    const clash = c.relationsPlain.find(l => l.includes("천간충"))!;
    expect(clash).toBe("장소담님의 태어난 해 하늘 글자와 전성민님의 태어난 해 하늘 글자가 천간충(하늘 글자끼리 마주 서서 부딪침) 관계예요. 불(화) 기운과 물(수) 기운이 하늘 글자에서 마주 서서, 겉으로 드러나는 생각과 의견이 부딪치기 쉬운 흐름이에요.");
    expect(c.relationsPlain.filter(l => /삼형|세 땅/.test(l))).toEqual(["장소담님의 태어난 날·시각 땅 글자 모두와 전성민님의 태어난 날·시각 땅 글자 모두가 삼형(세 땅 글자가 서로 깎고 다듬는 마찰) 관계예요. 세 땅이 서로 눌러 믿던 사람과 틀어지기 쉬운 흐름이에요."]);
    for (const l of c.relationsPlain) { expect(l).not.toMatch(/완성/); expect(l).toMatch(/ 관계예요\. .+이에요\.$/); }
    expect(c.relationsPlain.filter(l => l.includes("반합"))).toHaveLength(2);
    expect(c.dayRelations).toEqual(c.relationsPlain);
  });
  it("여러 쌍(60쌍): 모든 줄에 뜻 문장, 반합 '완성' 없음, '세 땅'은 삼형 세 글자가 다 모였을 때만, 삼형은 묶음마다 한 줄", () => {
    const day = (i: number) => new Date(Date.UTC(1970, 0, 1) + i * 86400000 * 211).toISOString().slice(0, 10);
    for (let i = 0; i < 60; i++) {
      const x = { ...SODAM, birthDate: day(i), birthTime: `${String(i % 24).padStart(2, "0")}:10` }, y = { ...SEONGMIN, birthDate: day(i * 7 + 3), birthTime: `${String((i * 5) % 24).padStart(2, "0")}:40` };
      const { rows, lines } = pairRelationLines({ saju: sajuOf(x), callName: "가님" } as never, { saju: sajuOf(y), callName: "나님" } as never, k);
      expect(lines).toHaveLength(rows.length);
      lines.forEach((l, j) => {
        expect(l, l).toMatch(/ 관계예요\. .+이에요\.$/); expect(l, l).not.toMatch(/완성/);
        if (/세 땅/.test(l)) expect(rows[j]).toMatchObject({ kind: "HYEONG", subtype: "삼형", completeness: "full" });
      });
      const samhyeong = rows.filter(r => r.kind === "HYEONG" && r.subtype === "삼형").map(r => r.key);
      expect(new Set(samhyeong).size).toBe(samhyeong.length);
    }
  });
  it("천간충 범위 = 엔진 STEM_CHUNG_TABLE(甲庚·乙辛·丙壬·丁癸), 戊甲·己乙은 없음", () => {
    expect(STEM_CHUNG_TABLE.map(p => p.join(""))).toEqual(["甲庚", "乙辛", "丙壬", "丁癸"]);
    expect(pairRelations(sajuOf(SODAM), sajuOf(SEONGMIN)).filter(r => r.kind === "STEM_CHUNG").map(r => `${r.key}:${r.a}:${r.b}`)).toEqual(["丙壬:year:year"]);
  });
  it("첫 쪽: 묶음 요약 + 영향 큰 3줄, 전체는 부록 '두 사람 사이의 모든 기운'", () => {
    const pair = pagesOf(data, "pair")[0], out = html(data, pair);
    expect(pair.relationsPlain).toEqual(c.relationsPlain.slice(0, 3));
    expect(pair.relationsTotal).toBe(12);
    expect(out).toContain("합 6가지(천간합 3·육합 1·반합 2)"); expect(out).toContain("영향이 큰 세 가지"); expect(out).toContain("전체 12가지는 책 끝 부록");
    expect(out).not.toContain(c.relationsPlain[3]);
    const all = pagesOf(data, "appendix").find(p => p.title === "두 사람 사이의 모든 기운")!;
    expect(all.items.map(i => i.meaning)).toEqual(c.relationsPlain);
    expect(all.items.map(i => i.group)).toEqual(["형·충·파·해", "합", "형·충·파·해", "형·충·파·해", "합", "합", "합", "형·충·파·해", "합", "형·충·파·해", "합", "형·충·파·해"]);
    expect(all.total).toBe(12);
  });
  it("요약이 없는 이전 Book은 첫 쪽에 전체 목록 그대로, 관계 부록 쪽 없음", () => {
    const old = projectV5Book(snap({ ...evidence, pair: { ...evidence.pair!, relationsSummary: undefined } }), BASE)!;
    expect(pagesOf(old, "pair")[0].relationsPlain).toEqual(c.relationsPlain);
    expect(pagesOf(old, "appendix").map(p => p.title)).toEqual(["장소담의 모든 기운", "전성민의 모든 기운"]);
  });
  it("점수: 기본점 40/40 + 일곱 항목 39/60 = 79/100(브리프·점수 쪽 모두 줄 합 = 총점)", () => {
    expect(c.score.components.map(x => `${x.name} ${x.points}/${x.max}`)).toEqual(["기본점 40/40", "오행 보완 12/12", "타고난 중심 관계 10/10", "생활 자리 7/10", "자란 환경·사회 자리 3/6", "서로에게 주는 역할 2/4", "음양 균형 1/3", "MBTI 4/15"]);
    expect(c.score.value).toBe(79);
    const score = pagesOf(data, "score")[0];
    expect(score.scores.reduce((n, s) => n + s.value, 0)).toBe(score.total);
    // 최종 A-10: 새 책은 「시작 점수 40점에 아래 일곱 항목(60점)을 더해요」(계산은 그대로).
    expect(score.scores[0].reason).toBe("시작 점수 40점에 아래 일곱 항목(60점)을 더해요. 이번 항목 점수는 39점이라 총점은 79점이에요.");
    expect(score.scores[0].reason).not.toContain("누구에게나");
    // 자란 환경 이유의 반합 이름도 같은 문구.
    expect(c.score.components.find(x => x.name === "자란 환경·사회 자리")!.onScorePage).toContain("반합(세 글자 중 두 글자만 모여 반쯤 묶임)");
  });
});
