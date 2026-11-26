// ZW-2 5부 자미 엔진 주장 검사(호출 0): 주장마다 참 꼴은 걸리고(갈래 붙음), 오탐 대보기에서 찾은 보통 문장 꼴은 걸리지 않는다.
// 대보기 전수 결과(① DB 원문 · 카드 글 2,010명 · ② 가짜 작가 305권 · ③ 저장 책 125권): ~/Desktop/gyeol-review/ziwei-02/_raw/false-positive-sweep.json.
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { computeZiweiChart } from "../../../src/lib/ziwei/chart";
import { loadZiweiKnowledge } from "../../../src/lib/ziwei/knowledge";
import { buildZiweiBrief } from "../../../src/lib/ziwei/brief";
import { splitSents } from "../../../src/lib/ziwei/text";
import { cutSentence, inspectZiwei, splitZ, ziweiSentenceFlags, ZIWEI_RULE_BRANCH } from "../../../src/lib/writer/chunked/ziweiCheck";
import { buildZiweiDesign } from "../../../src/lib/ziwei/design";
import { buildV5Snapshot, writerKnowledge } from "../../../src/lib/writer/publish";
import { ziweiMockStreamFor } from "../../../src/lib/writer/chunked/ziweiMock";
import { randomPeople, Z5_PEOPLE } from "./zw2People";

const ASOF = "2026-12-02";
// 3번 인물(1983-07-08 여 · 기혼 · ISFJ): 명궁 축 천량+경양 · 부처 거문(화권)+타라 · 자녀 탐랑(화기) · 재백 태음(화과) · 노복 파군(화록) · 복덕 천동(밝기 근거 추정) · 공궁 0 · 금사국 · 지금 관록 2026~2035.
const z3 = computeZiweiChart(Z5_PEOPLE[2].input as never, ASOF);
const ctx = (over: object = {}) => ({ chart: z3, mbti: "ISFJ", relationship: "married", pairHere: false, ...over });
const rules = (s: string, over: object = {}) => ziweiSentenceFlags(s, ctx(over)).map(f => f.rule);

describe("참 꼴은 걸린다(갈래 붙음)", () => {
  it.each([
    ["짝 칸의 천량은 당신을 감쌉니다.", "star_palace"],
    ["천기가 나 칸에 앉아 있어 생각이 빠릅니다.", "star_palace"],
    ["천량과 거문이 한 칸에 나란히 앉아 있습니다.", "star_palace"],
    ["마음 쉼터 칸의 천동은 환하게 빛나는 별입니다.", "brightness_claim"],
    ["나 칸의 천량은 빛이 약한 별입니다.", "brightness_claim"],
    ["짝 칸의 화기는 공을 들이게 합니다.", "transform_claim"],
    ["천량에 붙은 화록 덕분에 술술 풀립니다.", "transform_claim"],
    ["짝 칸은 큰 별이 없는 빈 칸입니다.", "empty_claim"],
    ["짝 칸의 맞은편 돈 칸에서 힘을 받습니다.", "empty_claim"],
    ["명궁은 인(寅) 칸에 있습니다.", "chart_claim"],
    ["신궁은 돈 칸에 겹쳐 있습니다.", "chart_claim"],
    ["당신의 오행국은 수이국입니다.", "chart_claim"],
    ["2027~2036년은 일 칸에 머무는 10년입니다.", "decade_claim"],
    ["지금 머무는 10년은 돈 칸입니다.", "decade_claim"],
    ["서른 살 무렵부터 이 칸의 힘이 커집니다.", "decade_claim"],
    ["ENFP처럼 사람을 먼저 찾습니다.", "mbti_outside"],
    ["ISFJ인 당신은 맡은 일을 끝까지 합니다.", "mbti_outside"],
    ["솔로인 당신에게도 이 칸은 열려 있습니다.", "status_claim"],
    ["Z3 줄에서 본 것처럼 당신은 듬직합니다.", "memo_leak"],
    ["iztro로 계산하면 이렇게 나옵니다.", "lib_name"],
    ["유파에 따라 다르게 읽기도 합니다.", "school_talk"],
    ["극처의 기운이 있어 조심해야 합니다.", "fate_word"],
    ["경양은 살성이라 거칩니다.", "grade_word"],
    ["뚜렷하게 �잡히지 않아요.", "bad_char"],
    ["2028년에는 반드시 결혼하게 됩니다.", "future_event"],
    ["지치면 소화가 먼저 흔들립니다.", "health_claim"],
    // 7부 Z5 판독 ① → 결정론 1판(연애 별 · 빌려 읽기 · 오행국 뜻 · 몸의 열 · 9장 기조 말)
    ["마음이 끌리는 쪽은 일 칸에 모여 있습니다.", "love_claim"],
    ["마음이 끌리는 쪽은 터전 칸에 있습니다.", "love_claim"],
    ["비어 있어서 오히려 이웃한 무대의 힘이 넉넉히 흘러드는 자리입니다.", "empty_claim"],
    ["당신의 오행국은 금사국이라 성격이 단단합니다.", "chart_claim"],
    ["당신의 힘은 속에 열이 차올랐다가 뚝 끊기는 리듬으로 움직입니다.", "health_claim"],
    ["먼저 컨디션 리듬 칸의 열이 식을 때까지 손을 멈추세요.", "health_claim"],
    ["10년의 연도 범위만 알고 있어도 믿음을 둘 수 있습니다.", "memo_leak"],
  ])("%s → %s", (s, rule) => {
    const got = rules(s);
    expect(got).toContain(rule);
    expect(ZIWEI_RULE_BRANCH[rule]).not.toBeNull();
  });
  it("오행국 문단 안의 오행 비유는 문단 맥락으로 건다(오행국 없는 문단의 비유는 통과)", () => {
    const b = buildZiweiBrief({ chart: z3, kb: loadZiweiKnowledge(), k: writerKnowledge().k, person: Z5_PEOPLE[2].person, asOf: ASOF }), design = buildZiweiDesign(b);
    const ch = (p: string) => [{ n: 1, id: "read", title: "t", chars: 0, sections: [{ heading: "명반은 열두 칸의 지도입니다", paragraphs: [p] }] }] as never;
    const got = (p: string) => inspectZiwei(ch(p), { brief: b, design, intake: {} as never }).filter(f => f.paragraph === 0 && f.branch).map(f => `${f.rule} ${f.sentence}`);
    expect(got("당신의 오행국은 금사국입니다. 쇠처럼 한번 자리를 잡으면 쉽게 흔들리지 않는 결로 읽으면 됩니다.")).toEqual(["chart_claim 쇠처럼 한번 자리를 잡으면 쉽게 흔들리지 않는 결로 읽으면 됩니다."]);
    expect(got("쇠처럼 단단한 하루를 보냅니다. 나 칸에는 천량이 앉아 있습니다.")).toEqual([]);
  });
  it("문장 나누기: 핵심 문장 기호 ⟫가 마침표 뒤에 붙어도 옆 문장과 따로(지우기가 옆 문장까지 지우지 않게)", () => {
    expect(splitZ("앞 문장입니다. ⟪걸린 문장입니다.⟫ 옆 문장이에요.")).toEqual(["앞 문장입니다.", "⟪걸린 문장입니다.⟫", "옆 문장이에요."]);
    expect(splitZ("\"요즘 편해졌어.\" 하고 웃습니다.")).toEqual(["\"요즘 편해졌어.\" 하고 웃습니다."]);
  });
  it("지우기: 그 문장만 빼고, 다음 문장이 「그 칸」으로 받으면 지운 문장의 칸 이름으로 바꾼다 · 문단이 비면 null · 못 찾으면 undefined", () => {
    expect(cutSentence("마음이 끌리는 쪽은 컨디션 리듬 칸에 있습니다. 인연 신호(홍란)와 설렘의 별(함지)이 그 칸에 있어서, 마음이 쉽게 물들어요. 설렘은 오래갑니다.", "마음이 끌리는 쪽은 컨디션 리듬 칸에 있습니다."))
      .toBe("인연 신호(홍란)와 설렘의 별(함지)이 컨디션 리듬 칸에 있어서, 마음이 쉽게 물들어요. 설렘은 오래갑니다.");
    expect(cutSentence("앞 문장입니다. ⟪걸린 문장입니다.⟫ 옆 문장이에요.", "걸린 문장입니다.")).toBe("앞 문장입니다. 옆 문장이에요.");
    expect(cutSentence("걸린 문장입니다.", "걸린 문장입니다.")).toBeNull();
    expect(cutSentence("다른 문장입니다.", "걸린 문장입니다.")).toBeUndefined();
  });
  it("짝이 든 소제목 · 맞는 유형은 MBTI 걸림 없음", () => {
    expect(rules("ISFJ의 성실함이 천량의 품과 겹칩니다.", { pairHere: true })).not.toContain("mbti_outside");
  });
  it("입력 전제 말(칸 이름은 가림): 솔로에게 「배우자」", () => {
    const tp = Z5_PEOPLE[3], chart = computeZiweiChart(tp.input as never, ASOF), b = buildZiweiBrief({ chart, kb: loadZiweiKnowledge(), k: writerKnowledge().k, person: tp.person, asOf: ASOF });
    const f = ziweiSentenceFlags("배우자와 함께 사는 날에는 말이 길어집니다.", { chart, mbti: null, relationship: "single", inputs: b.inputs, pairHere: false });
    expect(f.map(x => x.rule)).toContain("input_premise");
    expect(ziweiSentenceFlags("부모와 윗사람 칸에는 칠살이 앉아 있습니다.", { chart, mbti: null, relationship: "single", inputs: b.inputs, pairHere: false }).map(x => x.rule)).not.toContain("input_premise");
  });
});

describe("맞는 말 · 오탐 대보기 꼴은 걸리지 않는다", () => {
  it.each([
    "짝 칸의 거문은 말로 사이를 짓습니다.",
    "짝 칸에는 거문이 앉아 있어 이야기가 통해야 마음이 열립니다.",
    "나 칸의 천량(감싸는 별)은 곁을 먼저 챙깁니다.",
    "나 칸의 천량은 환하게 빛나는 별입니다.",
    "거문에 붙은 화권은 짝 칸에서 결정하는 힘을 실어 줍니다.",
    "화기가 붙은 내가 기르는 것 칸은 당신이 공을 들이는 곳입니다.",
    "명궁은 축(丑) 칸입니다.",
    "신궁은 짝 칸에 겹쳐 있습니다.",
    "오행국은 금사국입니다.",
    "지금 머무는 10년은 일 칸, 2026~2035년입니다.",
    "다음 10년은 어울리는 사람들 칸으로 옮겨 갑니다.",
    // 오탐 대보기에서 찾은 보통 문장 꼴
    "자유파는 맞춰 둔 것이 어긋나는 뜻이라, 정리해 둔 것이 흐트러지는 일이 생길 수 있어요.",
    "이 달에는 모임에서 계산 방식을 먼저 정해 두세요.",
    "친구에게 보여 준 작은 프로그램 구조를 한참 설명했습니다.",
    "주간 업무 보고를 쓰는 장면으로 바꿔 보면 이렇습니다.",
    "헌 도면을 걷어 내고 집 한 채를 종이 한 장에 새로 그려 넣은 설계도",
    "당신에게는 천부적인 감각이 있습니다.",
    "화기애애한 자리를 좋아합니다.",
    "태양처럼 환한 사람이라는 말을 듣습니다.",
    // 7부 1판의 맞는 꼴 · 보통 낱말
    "마음이 끌리는 쪽도 칸마다 나뉩니다.",
    "인연 신호(홍란)는 터전 칸에 있어요.",
    "이웃과 모임에서 얼굴이 자주 바뀝니다.",
    "열두 칸을 차례로 읽어 봅니다.",
    "열정이 오르는 날에는 일이 술술 풀립니다.",
    "문이 열리는 칸입니다.",
    "물처럼 흘러가는 하루를 좋아합니다.",
    "파를 써는 사이 열이 식어, 다 볶은 뒤에는 친구 것을 맛있게 퍼먹습니다.",
    "마음이 달아오른 그때 판을 엎고, 열기가 식은 뒤에 다듬는 손이 옵니다.",
    "오행국은 금사국입니다. 다섯 가운데 첫 십 년 칸이 세 번째로 열리는, 쇠의 이름이 붙은 흐름이에요.",
  ])("%s", s => {
    const got = ziweiSentenceFlags(s, ctx({ pairHere: true })).filter(f => ZIWEI_RULE_BRANCH[f.rule]);
    expect(got).toEqual([]);
  });
});

describe("대보기 전수(작은 판): ① 카드 글 300명 · ② 가짜 작가 5권 — 걸림 0", () => {
  it("① 카드 글은 그 사람 명반 · 입력으로 걸림 0", () => {
    const kb = loadZiweiKnowledge(), { k } = writerKnowledge();
    const bad: string[] = [];
    for (const tp of randomPeople(300, 5151)) {
      const chart = computeZiweiChart(tp.input as never, ASOF), b = buildZiweiBrief({ chart, kb, k, person: tp.person, asOf: ASOF });
      for (const t of [...b.lines.flatMap(l => [l.value, l.meaning]), ...Object.values(b.palaces).flatMap(x => [x.angle, x.stage, ...x.scenes]), ...b.pairs.map(p => p.why)].filter(Boolean))
        for (const s of splitSents(t)) for (const f of ziweiSentenceFlags(s, { chart, mbti: tp.person.mbti, relationship: tp.person.relationshipStatus, inputs: b.inputs, pairHere: true })) bad.push(`${tp.id} ${f.rule} «${s}»`);
    }
    expect(bad.slice(0, 10)).toEqual([]);
  }, 300_000);
  it("② 가짜 작가 5권: 첫 원고 걸림 0 · 보류 0", async () => {
    for (const tp of Z5_PEOPLE) {
      const payload = { productKey: "ziwei_full", productSlug: "ziwei-full", person: { name: tp.person.name, birthDate: tp.input.birthDate, birthTimePrecision: tp.input.birthTimePrecision ?? "exact", birthTime: tp.input.birthTime ?? "", birthTimeUnknown: false, approximateBirthTimeSlot: tp.input.approximateBirthTimeSlot ?? "", gender: tp.input.gender, mbtiType: tp.person.mbti ?? "" },
        userContext: { relationshipStatus: tp.person.relationshipStatus, jobStatus: tp.person.jobStatus, detailJob: "", focusAreas: [] }, productOptions: tp.person.children ? { children: tp.person.children } : {} } as never;
      const at = "2026-12-02T01:00:00.000Z";
      const r = await buildV5Snapshot({ payload, reportId: "report_zw2check00001", policyAt: at, sink: { save: async () => true, load: async () => [] }, deps: { provider: "anthropic", model: "claude-mock", fallback: null, stream: await ziweiMockStreamFor(payload, at) } }) as unknown as { review: { first: unknown[]; hold: unknown[] } };
      expect(r.review.first).toEqual([]); expect(r.review.hold).toEqual([]);
    }
  }, 120_000);
});
