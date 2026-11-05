/**
 * 최종판2(판독 결함 보완): 0 비용 원장 · 1-1 표지·이미지·같은 일주 구절 · 1-2 종합 장면 · 1-3 성격표 · 1-4 글자 나열 · 1-5 세기 활용형 · 1-6 면책·내부 표현 · 1-7 관계 목록 · 1-8 작은 문장.
 */
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief } from "@/lib/brief";
import { avoidOverlaps, echoRuns, iljuPhraseHit } from "@/lib/brief/imageLedger";
import { applyProfile, profileCodes } from "@/lib/brief/pairProfile";
import { computeCostUsd } from "@/lib/llm/prices";
import { payloadToBriefInput } from "@/lib/writer/book";
import { chooseCover, coverIssue, writerKnowledge } from "@/lib/writer/publish";
import { renderWriterBrief } from "@/lib/writer/prompt";
import { WRITER_SYSTEM } from "@/lib/writer/prompt/system";
import { glyphListMismatch, pairProfileMismatch, type ProfilePerson } from "@/lib/writer/safety/final2";
import { groupClaimMismatch } from "@/lib/writer/safety/lint";
import { isNoticeSentence, metaInstruction, pillarClaims, plainWords } from "@/lib/writer/safety/p6e";
import { mbtiMisattr, tidyBook } from "@/lib/writer/safety/p6c";
import { sentenceViolation } from "@/lib/writer/safety/sentences";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { DEOKMIN, JIWOO } from "../../../tools/final/cases";
import { applyFileLedger } from "../../../tools/final/fileLedger";
// 최종 A-2: 이미지 대장 파일은 시험·도구 전용(운영 번들 밖) — 이 시험은 파일 대장을 넣고 본다.
applyFileLedger();

const { k } = writerKnowledge();
const compat = (a: unknown, b: unknown) => {
  const n = normalizeReportInputPayload({ productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType: "love", compatibilityRoleVersion: "compatibility-fixed-ab-v1", personA: a, personB: b } as never, { now: () => new Date("2026-11-05T03:00:00Z") });
  if (!n.ok) throw new Error(String(n.error));
  return buildBrief(payloadToBriefInput(n.value as never, "2026-11-05") as never, k);
};
const DJ = compat(DEOKMIN, JIWOO);

describe("최종판2 0 비용 원장", () => {
  it("부르기 전에 최악 비용으로 먼저 적고(도중에 죽어도 남는다), 끝나면 실제 비용으로 바꾼다", async () => {
    const dir = mkdtempSync(join(tmpdir(), "budget2-")), log = join(dir, "cost.md");
    writeFileSync(log, "| a |\n|---|\n누적 합계: **$0.00000000**\n");
    process.env.LLM_CACHE_DIR = dir; process.env.LLM_COST_LOG = log;
    try {
      const B = await import("../../../tools/llm/budget");
      B.ensureScope("t2", 1, "시험");
      const dead = B.budgetGate({ scope: "t2", run: "r", runBudget: 1, stage: "죽는 호출", inner: async () => { throw new Error("killed"); } });
      await expect(dead.stream({ provider: "anthropic", model: "claude-sonnet-5-5", system: "s", user: "u", maxOutputTokens: 1000, timeoutMs: 1000 })).rejects.toThrow();
      const l = B.readLedger(); expect(l.calls).toHaveLength(1); expect(l.calls[0].pending).toBe(true); expect(B.spent(l, "t2")).toBeGreaterThan(0.009);
      const ok = B.budgetGate({ scope: "t2", run: "r2", runBudget: 1, stage: "끝나는 호출", inner: async () => ({ text: "x", finishReason: "complete", usage: { inputTokens: 10, cachedInputTokens: 0, outputTokens: 10 }, costUsd: 0.0001, requestId: "q" }) });
      await ok.stream({ provider: "anthropic", model: "claude-sonnet-5-5", system: "s", user: "u2", maxOutputTokens: 100, timeoutMs: 1000 });
      const l2 = B.readLedger(); expect(l2.calls).toHaveLength(2); expect(l2.calls[1].pending).toBeUndefined(); expect(l2.calls[1].costUsd).toBe(0.0001);
    } finally { delete process.env.LLM_CACHE_DIR; delete process.env.LLM_COST_LOG; }
  });
  it("Sonnet 5.5 캐시 읽기 단가 $0.20/1M", () => {
    expect(computeCostUsd("anthropic", "claude-sonnet-5-5", { inputTokens: 0, cachedInputTokens: 1_000_000, outputTokens: 0 })).toBeCloseTo(0.2);
  });
});

describe("최종판2 1-1 표지·이미지", () => {
  it("작가 브리프의 핵심 이미지는 그림 없는 뜻, 엔진 그림 줄은 피할 이미지에만", () => {
    const w = renderWriterBrief(DJ, { knowledge: k }) as { chart: { coreImage: string; avoidImages?: string[] }; compatibility: { pairImage: string; a: { image: string } } };
    expect(w.chart.coreImage).toMatch(/^갑목\(위로 곧게 뻗는 힘\) · /);
    expect(w.compatibility.pairImage).toMatch(/관계$/); expect(w.compatibility.a.image).not.toMatch(/아스팔트/);
  });
  it("길이는 공백을 빼고 센다. 길이만 벗어나면 작가 표지(30자 이내), 엔진 기본 이미지는 작가 표지가 없을 때만", () => {
    expect(coverIssue("물길을 여는 한여름 큰 나무의 작은 사업", DJ, [])).toBeNull();
    expect(coverIssue("서비스 로드맵을 쥔 스물일곱 대표의 엔진과 밤새 켜진 사무실 불빛", DJ, [])?.level).toBe("length");
    expect(chooseCover([{ line: "", source: "repaired" }, { line: "서비스 로드맵을 쥔 스물일곱 대표의 엔진과 밤새 켜진 사무실 불빛", source: "writer" }], DJ, []).source).toBe("writer");
    expect(chooseCover([{ line: "", source: "repaired" }, { line: "", source: "writer" }], DJ, []).source).toBe("fallback");
    expect(chooseCover([{ line: "한겨울 골목을 오래 지키는 작은 가로등 하나", source: "repaired" }, { line: "빗속에서도 꺼지지 않는 카페 사장의 불", source: "writer" }], DJ, ["빗속에서도 꺼지지 않는 캠핑 랜턴"]).source).toBe("repaired");
    expect(avoidOverlaps("빗속에서도 꺼지지 않는 카페 사장의 불", ["빗속에서도 꺼지지 않는 캠핑 랜턴"])).toHaveLength(1);
  });
  it("같은 일주 이전 책 구절(공백 뺀 12자 이상)", () => {
    const runs = echoRuns(["마음을 열면 상대의 퇴근 시간에 맞춰 따뜻한 국물을 데워 둡니다."], ["한번 열면 상대의 퇴근 시간에 맞춰 따뜻한 국물을 데워 둡니다."]);
    expect(runs[0]).toContain("상대의퇴근시간에맞춰따뜻한국물을데워");
    expect(iljuPhraseHit("상대의 퇴근 시간에 맞춰 따뜻한 국물을 데워 두는 식으로", runs)).toBeTruthy();
    expect(iljuPhraseHit("퇴근길에 국물 한 그릇을 사 오는 식으로", runs)).toBeNull();
  });
});

describe("최종판2 1-3 궁합 성격표", () => {
  const people = (DJ.compatibility!.profiles ?? []).map((p, i) => ({ names: i ? ["최지우", "지우"] : ["장덕민", "덕민"], codes: p, label: p.name.replace(/님$/, "") })) as ProfilePerson[];
  it("ENTJ 장덕민 = E·앞·그 자리에서·말·빠름, ISTJ 최지우 = I·뒤·정리한 뒤·행동", () => {
    expect(DJ.compatibility!.profiles![0]).toMatchObject({ energy: "E", lead: "front", conflict: "now", express: "말", decide: "fast" });
    expect(DJ.compatibility!.profiles![1]).toMatchObject({ energy: "I", lead: "back", conflict: "later", express: "행동" });
    expect(Object.keys(renderWriterBrief(DJ, { knowledge: k }))[0]).toBe("profiles");
  });
  it("장면 주인(who)도 표를 따른다: 최지우를 「가운데에 서고 발표를 자원」 쪽에 세우지 않는다", () => {
    const who = DJ.chapters.flatMap(c => [...c.materials, ...(c.sections ?? []).flatMap(s => s.materials)]).flatMap(m => m.kind === "rel" ? m.who ?? [] : []);
    expect(who.some(w => /가운데에 서고 발표를 자원하는 편 쪽 = 최지우/.test(w))).toBe(false);
    expect(who.some(w => /그 자리에서 받아치는 편 쪽 = 최지우/.test(w))).toBe(false);
    const v = applyProfile(new Map([["attentionSeeking", 0.91], ["reactivity", 0.91]]), profileCodes("ISTJ", new Map(), []));
    expect(v.get("attentionSeeking")).toBe(-1); expect(v.get("reactivity")).toBe(-1);
  });
  it("판독 문장: 한 사람·두 사람·'두 사람은' 묶음 모두 대조, 권하는 문장·꾸밈 '두 사람의'·직설 '짚는'도 다툼 단서로 본다(최종판3)", () => {
    for (const s of ["사진을 찍을 때 가운데에 서고 발표를 자원하는 쪽은 최지우님이에요.", "최지우님은 거슬리는 말에 그 자리에서 바로 받아치는 편이에요.",
      "그래서 장덕민님은 다툰 직후에 곧바로 맞서기보다 한 박자 두고 상황을 보는 쪽을 택할 수 있어요.", "곱씹는 시간이 필요한 장덕민님과, 바로 말하는 최지우님의 속도를 둘 다 지켜 주는 규칙이에요.",
      "두 사람은 하고 싶은 일이 떠오르면 바로 말로 풀어내는 편이에요.",
      // 최종판3: 「틀린 것은 그 자리에서 짚는」도 다툼=정리한 뒤인 사람과 함께 읽으면 모순(장소담×전성민 판독).
      "두 사람은 결론부터 말하고 틀린 것은 그 자리에서 짚는 편이고, 그 정도는 장덕민님이 더 짙습니다."]) expect(pairProfileMismatch(s, people), s).toBeTruthy();
    for (const s of ["바로 풀고 싶은 마음과 한 박자 두고 싶은 마음 사이에, 저녁이라는 만날 시간을 정해 두는 것이 두 사람의 몫 나누기예요.",
      "최지우님은 말을 아끼다가 쌓이면 근거 자료까지 챙겨 와 한꺼번에 꺼내는 쪽이에요.",
      "장덕민님은 무엇이 어긋났는지부터 바로 말하려 하고, 사과 한마디도 빠르게 나옵니다.", "서운한 날에는 한 박자 두고 말해 보세요."]) expect(pairProfileMismatch(s, people), s).toBeNull();
  });
});

describe("최종판2 1-4·1-5·1-6·1-7·1-8", () => {
  it("1-4 명식 글자 나열: 그 사람 명식에 없는 글자(장덕민에게 午 없음), 재료도 그 사람 글자만", () => {
    const g = [{ names: ["장덕민"], glyphs: new Set("기묘신미갑신무진") }, { names: ["최지우"], glyphs: new Set("병술병신기해임신") }];
    expect(glyphListMismatch("현침살이 있어서 갑·신·묘·오 글자가 겹친 만큼 장덕민님 말이 더 날카롭습니다.", g)).toMatch(/오/);
    expect(glyphListMismatch("장덕민님은 갑·신·묘 글자가 겹쳐 말이 날카롭습니다.", g)).toBeNull();
    expect(JSON.stringify(renderWriterBrief(DJ, { knowledge: k }))).not.toMatch(/갑·신·묘·오/);
  });
  it("1-5 쉬운 이름 활용형도 세기 대조", () => {
    const lv = { 비겁: "보통", 식상: "약", 재성: "강", 관성: "보통", 인성: "보통" } as const;
    expect(groupClaimMismatch("당신의 사업은 만들고 넓히는 힘이 큰 확장형 쪽입니다.", lv)).toMatch(/식상:강≠약/);
    expect(groupClaimMismatch("값을 받아 내는 힘이 강해서 거래가 빨라요.", lv)).toBeNull();
    expect(groupClaimMismatch("배우고 익히는 힘이 약해서 반복이 필요해요.", lv)).toMatch(/인성:약≠보통/);
  });
  it("1-6 면책·내부 표현 꼴과 정리", () => {
    for (const s of ["이 이야기는 자녀의 성별이나 수를 말하는 것이 아니라 부모로서의 결을 읽는 것이에요.", "만나는 시기나 결혼 여부를 정해 주는 것은 아닙니다.", "구체적인 일을 말하는 건 아닙니다."]) expect(isNoticeSentence(s), s).toBe(true);
    expect(metaInstruction("지어낸 연차 없이 지금의 사실만 담으세요.")).toBe(true);
    expect(sentenceViolation("상태가 대표라면 서류의 무게가 훨씬 큽니다.", { relationship: "single", children: "unknown", job: "business", birthTimeKnown: true, mbti: "ENTJ" } as never)).toBe("internal_term");
    expect(plainWords("여기에 토 과다가 겹칩니다.").text).toBe("여기에 흙 기운이 많은 점이 겹칩니다.");
    expect(plainWords("토 과다라서 바꾸는 속도가 느려요.").text).toBe("흙 기운이 많아서 바꾸는 속도가 느려요.");
    const t = (baseDate: string) => tidyBook([{ n: 9, id: "x", title: "x", source: "writer", chars: 0, sections: [{ heading: "h", paragraphs: ["이번 가을 남은 두 달 동안 한 줄씩 적어 보세요."] }] }], { mbtiPlain: {}, monthChapters: new Set(), baseDate }).chapters[0].sections[0].paragraphs[0];
    expect(t("2026-11-05")).toBe("2026년 남은 두 달 동안 한 줄씩 적어 보세요."); expect(t("2026-10-05")).toBe("이번 가을 남은 두 달 동안 한 줄씩 적어 보세요.");
  });
  it("1-7 엔진이 감지한 두 사람 사이 관계는 모두(辛丙 천간합·卯戌 육합·辰戌 충·未戌 형·파)", () => {
    const r = DJ.compatibility!.relationsPlain.join("\n");
    expect(DJ.compatibility!.relationsPlain.length).toBeGreaterThan(4);
    for (const re of [/천간합/, /육합/, /충/, /파/, /형/]) expect(r).toMatch(re);
  });
  it("1-8 일지 자리에 간지 두 글자, INTP에게 '가장 먼저 다가가'", () => {
    expect(pillarClaims("여기에 태어난 날 땅 글자의 갑신이 더해져요.", { dayBranch: ["편관", "편인", "비견"] })).toBe("dayBranch:ganji");
    expect(pillarClaims("태어난 날 땅 글자 신은 편관이에요.", { dayBranch: ["편관", "편인", "비견"] })).toBeNull();
    expect(mbtiMisattr("굳은 표정의 손님 곁에 가장 먼저 다가가 분위기를 풀어 주는 일이 잦지 않나요?", [{ type: "INTP", anchors: /INTP/ }] as never)).toBeTruthy();
  });
  it("4 정리: 대운·세운이 아닌 책의 「이번 달」 → 「앞으로 한 달」(따옴표 대사는 그대로)", async () => {
    const { nowMonth } = await import("@/lib/writer/safety/p6c");
    expect(nowMonth("앞에서 본 관계의 결을 이번 달 행동 하나로 옮겨 볼게요.")).toBe("앞에서 본 관계의 결을 앞으로 한 달 행동 하나로 옮겨 볼게요.");
    expect(nowMonth("이번 한 달은 한 줄로 말하는 것만 해 보세요.")).toBe("앞으로 한 달은 한 줄로 말하는 것만 해 보세요.");
    expect(nowMonth("\"이번 달은 내가 못 내지만 다음 달에 살게\"라고 말해요.")).toBe("\"이번 달은 내가 못 내지만 다음 달에 살게\"라고 말해요.");
  });
  it("역행 금지 1: 작가 시스템 지침은 그대로(시작 커밋과 같은 글)", () => {
    expect(WRITER_SYSTEM).toMatch(/핵심 이미지는 \[표지\] 줄에서 한 번 짓는다/);
  });
});
