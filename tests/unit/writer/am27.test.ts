import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { inputsOf, needsOf, neutralize, premiseHits, soften, PREMISE_VERSION } from "@/lib/brief/premise";
import { antecedentIssues, dayunOrderIssues, detFix, factIssues, lengthIssue, RECORD_ONLY } from "@/lib/writer/chunked/accept";
import { ganjiClaim } from "@/lib/factsheet/check";
import { judgeBuild } from "@/lib/ops/generation/policy";
import { collectNeeds, needsTable } from "../../../tools/annual-major/am2-7-tags";

const facts = (job: string, rel: string) => ({ relationship: rel, children: "unknown", job: { status: job, class: "none", detail: "" } });

describe("AM2-7 2부 입력 조건 — 낱말표 하나(필요한 입력)", () => {
  it("P6 판독 입력 조건 차단 여섯 꼴을 잡는다", () => {
    expect(premiseHits("호감 있는 사람과 함께 가고 싶은 곳을 모으는 때라면", inputsOf(facts("self_employed", "dating"))).map(h => h.word)).toContain("호감 가는 사람");
    expect(premiseHits("자취방 장을 볼 때도", inputsOf(facts("student", "single"))).length).toBe(1);
    expect(premiseHits("월급날 바로 다음 날에", inputsOf(facts("", "married"))).length).toBe(1);
    expect(premiseHits("킥오프에서 각자 역할의 이유를 설명할 때", inputsOf(facts("job_seeker", "dating"))).length).toBe(1);
    expect(premiseHits("영업 전화 첫 문장으로", inputsOf(facts("unemployed", "single"))).length).toBe(1);
  });
  it("중립 꼴: 월급날 → 수입 · 돈이 들어오는 날, 호감 가는 사람 → 연인 · 배우자, 동료 → 주변 사람(조사 맞춤)", () => {
    expect(neutralize("월급날 바로 다음 날에 떼어 두세요.", inputsOf(facts("freelancer", "single")))).toBe("수입이 들어오는 날 바로 다음 날에 떼어 두세요.");
    expect(neutralize("월급날 바로 다음 날에 떼어 두세요.", inputsOf(facts("unemployed", "single")))).toBe("돈이 들어오는 날 바로 다음 날에 떼어 두세요.");
    expect(neutralize("호감 가는 사람이 약속을 지킬 때", inputsOf(facts("employee", "married")))).toBe("배우자가 약속을 지킬 때");
    expect(neutralize("동료가 경쟁자처럼 느껴지기 쉬워요.", inputsOf(facts("student", "single")))).toBe("주변 사람이 경쟁자처럼 느껴지기 쉬워요.");
    expect(neutralize("회의에서 말이 또렷해져요.", inputsOf(facts("job_seeker", "single")))).toBeNull();
    expect(soften("일터·사회생활의 자리", inputsOf(facts("unemployed", "single")))).toBe("사회생활의 자리");
  });
  it("오탐 없음: 상처가 · 정도면 · 장 제목 가운뎃점 목록 · 배우자 자리 · 업데이트 · 바람 원문", () => {
    const x = inputsOf(facts("unemployed", "single"));
    for (const t of ["말이 상처가 되는 흐름", "이 정도면 됐다", "## 4. 일·취업·공부", "태어난 날은 배우자 자리", "앱 업데이트를 미루는 날", "«회사에서 인정받고 싶어요»라는 바람"]) expect(premiseHits(t, x)).toEqual([]);
  });
  it("꼬리표 표는 지금 DB · 낱말표와 같다(한 번에 전부 매김 — 표에 없는 항목은 쓰지 않는다)", () => {
    const table = JSON.parse(readFileSync("src/data/knowledge-v5/input-needs.json", "utf8"));
    const fresh = needsTable(collectNeeds());
    expect(table.premise).toBe(PREMISE_VERSION);
    expect(Object.keys(table.items).length).toBe(Object.keys(fresh.items).length);
    expect(JSON.stringify(table.items)).toBe(JSON.stringify(fresh.items));
  });
  it("needsOf는 긴 말 먼저(월급날 ≠ 월급)", () => { expect(needsOf("월급날").map(h => h.word)).toEqual(["월급날"]); });
});

describe("AM2-7 1부 고치기 층 — 문단째 받기 · 결정론 받는 조건", () => {
  const rels = ["오미합", "신해해"];
  it("사실 낱말: chapter_repeat 교체가 달 목록을 잃으면 버린다(P6 annual-1 3.0 — 옛 RULE_FACT 면제 없음)", () => {
    const b = "돈이 오르는 달은 7월 · 정미월, 8월 · 무신월, 9월 · 기유월이에요.", a = "말과 아이디어로 버는 길을 찾기 쉬운 해예요.";
    expect(factIssues(b, a, rels, "").some(x => x.startsWith("잃음 month"))).toBe(true);
    expect(factIssues("신해해가 걸려요.", "오미합이 걸려요.", rels, "카드: 신해해").some(x => x.startsWith("카드 밖 rel"))).toBe(true);
  });
  it("지시어 앞말: 「이 달들」 · 「이때 그 감각」 · 「이 눌림은」(P6 annual-1 · annual-p6b · major-p6b)", () => {
    expect(antecedentIssues("내 말과 아이디어가 값이 되는 길을 이 달들에 살펴보기 좋아요.", "")).toHaveLength(1);
    expect(antecedentIssues("이때 그 감각이 더 쓸모 있게 켜질 수 있어요.", "")).toHaveLength(1);
    expect(antecedentIssues("하늘 글자끼리 끌려 묶여요. 이 눌림은 혼자 안고 가기 쉽습니다.", "")).toHaveLength(1);
    expect(antecedentIssues("겉은 빛나도 속은 눌릴 수 있어요. 이 눌림은 혼자 안고 가기 쉽습니다.", "")).toHaveLength(0);
    expect(antecedentIssues("그 증거입니다.", "앞 문장이 있어요.")).toHaveLength(0);
  });
  it("대운 순서 말: 「정미 대운은 이 10년이 끝난 뒤에 이어지는 다음 줄기」(P6 major-p6a 8.1 — 정미 2027~2036)", () => {
    const life = [{ ganji: "병오(丙午)", startYear: 2017, endYear: 2026 }, { ganji: "정미(丁未)", startYear: 2027, endYear: 2036 }];
    expect(dayunOrderIssues("정미 대운은 이 10년이 끝난 뒤에 이어지는 다음 줄기예요.", life, { start: 2027, end: 2036 })).toHaveLength(1);
    expect(dayunOrderIssues("2027년 3월 무렵부터는 정미 대운이 시작돼요.", life, { start: 2027, end: 2036 })).toHaveLength(0);
  });
  it("분량: 하한을 넘던 글이 밑으로 · 이미 밑인데 15% 넘게 줄면 버린다", () => {
    expect(lengthIssue("가".repeat(300), "가".repeat(250), 260)).not.toBeNull();
    expect(lengthIssue("가".repeat(200), "가".repeat(196), 260)).toBeNull();
    expect(lengthIssue("가".repeat(200), "가".repeat(150), 260)).not.toBeNull();
  });
  it("결정론 고침: 부름말 「X님, 」은 쉼표까지 · 「당신」이 있으면 이름 쪽을 지운다 · 정도말 · 중립 꼴 전제 말", () => {
    expect(detFix("서미란님, 이 대운은 재능을 꺼내는 10년이에요.", "name_call", { callName: "서미란님", name: "서미란" })).toBe("이 대운은 재능을 꺼내는 10년이에요.");
    expect(detFix("서미란님은 당신의 속도로 가요.", "name_call", { callName: "서미란님", name: "서미란" })).toBe("당신의 속도로 가요.");
    expect(detFix("서미란님은 천천히 가요.", "name_call", { callName: "서미란님", name: "서미란" })).toBe("당신은 천천히 가요.");
    expect(detFix("다듬는 힘은 이 시기에 가장 잘 길러집니다.", "degree", {})).toBe("다듬는 힘은 이 시기에 잘 길러집니다.");
    expect(detFix("월급날 다음 날에 떼어 두세요.", "input_premise", { inputs: inputsOf(facts("", "married")) })).toBe("돈이 들어오는 날 다음 날에 떼어 두세요.");
  });
  it("기록만 하는 깃발(다시 쓰기 · 지우기 안 함) — 지시 목록 열 가지", () => {
    for (const r of ["chapter_repeat", "screen_repeat", "rel_echo", "head_echo", "link_template", "tone_mismatch", "rx_extra", "ending_cap", "gyeol_cap", "rep_adjacent"]) expect(RECORD_ONLY.has(r)).toBe(true);
    for (const r of ["must_bare", "input_premise", "past_assert", "fact_ganji", "fact_dayun", "orphan_deictic"]) expect(RECORD_ONLY.has(r)).toBe(false);
  });
  it("fact_ganji 절 단위: 「2023년은 정묘 대운의 마지막 해였고, 2024년부터 무진 대운이 시작되었어요」는 맞다(P6 major-p5 2.0)", () => {
    const o = { annual: [], dayun: { number: 6, current: 4, cycles: [{ index: 3, ganji: "丁卯", ganjiKo: "정묘", startYear: 2014, endYear: 2023 }, { index: 4, ganji: "戊辰", ganjiKo: "무진", startYear: 2024, endYear: 2033 }] }, pillars: {} } as never;
    expect(ganjiClaim("2023년은 정묘 대운의 마지막 해였고, 2024년부터 무진 대운이 시작되었어요.", [o])).toBeNull();
    expect(ganjiClaim("2025년부터 무진 대운이 시작되었어요.", [o])?.rule).toBe("fact_ganji");
  });
  it("고칠 수 없는 차단이 남은 장은 발행 보류(generation_hold)", () => {
    const meta = { chapters: [{ n: 1, source: "writer", chars: 10 }, { n: 5, source: "writer", chars: 10, reason: "generation_hold:input_premise" }], calls: [{ chars: 100 }] } as never;
    const v = judgeBuild({ meta, run: null });
    expect(v.kind).toBe("incomplete");
    if (v.kind === "incomplete") expect(v.reason).toContain("generation_hold:5");
  });
});
