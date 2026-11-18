/**
 * AM2-9 3부 시험(호출 0): 세운·대운 네 갈래 분류(four.ts) — 저장 책 40권 전수 대조에서 참 · 오탐으로 갈린 문장을 그대로 쓴다(rubric.md 2-3절).
 * 오탐 난 몫은 기록(null), 참은 그 갈래.
 */
import { describe, expect, it } from "vitest";
import { inputsOf } from "@/lib/brief/premise";
import { branchOf, briefBranchOf, type FourCtx } from "@/lib/writer/chunked/four";

const ctx = (job: string, relationship: string, mbti = "ENFP"): FourCtx => ({
  entered: { job: job !== "unknown", rel: relationship !== "unknown", children: false }, relationship,
  inputs: inputsOf({ relationship, children: "unknown", job: { status: job } }), mbtiType: mbti, pairedAt: () => false,
});
const f = (rule: string, sentence: string, detail?: string) => ({ chapter: 7, section: 0, rule, sentence, ...(detail ? { detail } : {}) });

describe("AM2-9 3부 네 갈래 — 사실", () => {
  it("입력 전제: 본 입력 무리의 낱말 6개만 사실, 나머지 낱말은 기록", () => {
    expect(branchOf(f("input_premise", "거래처에서 온 연락에 바로 답하기보다 하루 묵혀 보세요."), ctx("unemployed", "single"))).toBe("fact");
    expect(branchOf(f("input_premise", "호감 가는 사람에게 먼저 말을 거는 달이에요."), ctx("business_owner", "dating"))).toBe("fact");
    expect(branchOf(f("input_premise", "일터·사회생활 자리가 닿는 쪽은 공부와 배움의 길이에요."), ctx("student", "single"))).toBeNull();
    expect(branchOf(f("input_premise", "시험이나 면접처럼 평가받는 자리에서 힘이 납니다."), ctx("employee", "single"))).toBeNull();
    expect(branchOf(f("input_premise", "새 인연이 넓어지는 해예요."), ctx("freelancer", "married"))).toBeNull();
  });
  it("key 값: 다른 key와 견줌 · 관계 뜻 일치는 기록, 빌려 온 값은 사실", () => {
    expect(branchOf(f("key_value", "하늘의 정재는 2027년과 같은 결이지만, 흐름이 느림에서 거셈으로 바뀝니다.", "흐름 「느림」 — 2029년 기유년은 「거셈」"), ctx("employee", "single"))).toBeNull();
    expect(branchOf(f("key_value", "앞의 을경합이 붙는 힘이었다면, 이번에는 서로 밀어내듯 흔들립니다.", "다른 key의 관계 을경합(5월 · 을사월)"), ctx("employee", "single"))).toBeNull();
    expect(branchOf(f("key_value", "부딪침이 있는 만큼 옛 방식을 바꾸게 되는 계기가 되기 좋아요.", "다른 달·해(2034년 갑인년)의 태어난 달 자리와 인신충 뜻(부디·바꾸·계기)"), ctx("employee", "single"))).toBeNull();
    expect(branchOf(f("key_value", "흐름 세기는 1/5 잔잔함입니다.", "흐름 1/5 — 5월 · 을사월은 「느림」"), ctx("employee", "single"))).toBe("fact");
    expect(branchOf(f("key_value", "가벼운 만남보다 믿을 만한 사람에게 마음이 가기 쉬운 달이기도 합니다.", "다른 달·해(11월 · 신해월)의 연애가 오르는 달 뜻(가벼·믿으·만하·가기)"), ctx("employee", "single"))).toBe("fact");
  });
  it("달 목록은 달 둘 이상 · 대운 위치는 맞는 위치 말이 함께 있으면 기록", () => {
    expect(branchOf(f("month_list", "방합이 닿는 태어난 달 자리는 1월 · 신축월과 같은 일터의 자리예요.", "달 목록이 카드와 다름(카드: 무신·기유·임자)"), ctx("employee", "single"))).toBeNull();
    expect(branchOf(f("month_list", "쉬어 가기 좋은 달은 갑진월, 을사월, 병오월, 정미월이에요.", "달 목록이 카드와 다름(카드: 병오·정미)"), ctx("employee", "single"))).toBe("fact");
    expect(branchOf(f("dayun_position", "2026년 무렵의 당신은 10년 한가운데로 들어서는 앞쪽에 서 있어요.", "「한가운데」 ≠ 3번째 해"), ctx("employee", "single"))).toBeNull();
    expect(branchOf(f("dayun_position", "이 책을 쓴 2026년 무렵은 재능을 밖으로 꺼내는 10년 한가운데예요.", "「한가운데」 ≠ 3번째 해"), ctx("employee", "single"))).toBe("fact");
  });
  it("오탐 난 사실 규칙은 기록(대운 순서 · 해 기둥 읽기 · 부정 견줌 · 짐작 · 끝값)", () => {
    for (const r of ["dayun_order", "fact_dayun", "dayun_claim", "group_claim", "relation_scope", "presumed_partner", "future_assert", "degree"]) expect(branchOf(f(r, "다음 대운은 병인 대운이에요.", "x"), ctx("employee", "married")), r).toBeNull();
    expect(branchOf(f("yinyang_claim", "음이 더 많은 사주예요."), ctx("employee", "single"))).toBe("fact");
  });
});

describe("AM2-9 3부 네 갈래 — 잘못된 연결 · 깨진 문장 · 브리프", () => {
  it("성향 장면 · 성향만 말하는 절은 기록, 운과 묶은 성향은 연결", () => {
    expect(branchOf(f("mbti_trait", "묵직한 일이 겹칠수록 당신은 눈앞의 것부터 처리하는 쪽이라 속도는 빠르게 나올 수 있어요.", "당신은 눈앞의 것부터 처리하는 쪽이라"), ctx("employee", "single", "ESTP"))).toBeNull();
    expect(branchOf(f("mbti_trait", "ENFP는 편재처럼 사람을 잇는 데서 신이 나는 유형이라 약속이 더 잘 불어나요.", "나는 유형이라"), ctx("employee", "single"))).toBe("link");
    expect(branchOf(f("pair_clause", "ESTJ는 해낸 일을 헤아릴 때 마음이 가라앉는 유형이라, 적는 것만으로도 저녁이 가벼워집니다.", "짝 없는 절"), ctx("employee", "single", "ESTJ"))).toBeNull();
    expect(branchOf(f("pair_clause", "ENFP는 표정과 말에 기분이 바로 묻어나는 편이라, 홍염살과 같은 쪽으로 겹쳐 그 다정함이 더 쉽게 읽혀요.", "짝 없는 key"), ctx("employee", "single"))).toBe("link");
    expect(branchOf(f("pair_link", "일요일 저녁에 다음 주 마음가짐을 정리해 보는 습관은 그 숙제를 가장 조용하게 푸는 방법이에요.", "이웃 문장 잇기"), ctx("employee", "single"))).toBeNull();
    expect(branchOf(f("pair_link", "그런데 ESFP는 마감이 눈앞에 올 때 정리가 시작되는 유형이라, 이 시기가 정리의 손을 훈련하는 환경이 돼요.", "이웃 문장 잇기"), ctx("employee", "single", "ESFP"))).toBe("link");
    expect(branchOf(f("pair_scope", "ISTJ는 하던 방식을 끝까지 밀고 가는 편이라 그 빈틈을 채워 줍니다.", "겹치"), ctx("employee", "single", "ISTJ"))).toBeNull();
  });
  it("깨진 문장: 문장 짜임 검사는 남고, 주제 생략 · 앞앞 지시 · 수 지시어는 기록", () => {
    for (const r of ["grammar", "subject_unit", "noun_predicate", "relation_frame", "pair_text"]) expect(branchOf(f(r, "x"), ctx("employee", "single")), r).toBe("broken");
    for (const r of ["fragment", "orphan_ref", "orphan_deictic", "rel_subject_time", "count_mismatch"]) expect(branchOf(f(r, "x"), ctx("employee", "single")), r).toBeNull();
    expect(branchOf(f("count_mismatch", "x", "카드 값 3 — 본문 4"), ctx("employee", "single"))).toBe("fact");
  });
  it("브리프 검사는 네 갈래 이슈만 작가를 막는다", () => {
    expect(briefBranchOf("rest_conflict")).toBe("contra");
    expect(briefBranchOf("pair_section")).toBe("link");
    expect(briefBranchOf("card_engine")).toBe("fact");
    expect(briefBranchOf("seed_grammar")).toBeNull();
  });
});
