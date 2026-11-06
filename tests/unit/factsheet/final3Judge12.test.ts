// 최종판3 12: 무작위 4권 판독에서 나온 차단 문장 꼴을 결정론 검사가 잡는다(원인 층 고침).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PRESCRIPTION_LABEL, collapseRenderDup, factCheck, factCtxOf } from "@/lib/factsheet/check";
import type { FactSheet } from "@/lib/factsheet/build";
import { jobWordsOf, writerKnowledge } from "@/lib/writer/publish";

const { k } = writerKnowledge();
const base = JSON.parse(readFileSync("docs/v5/final3/factsheets/장소담.json", "utf8")) as FactSheet;
const withJob = (status: string, detail: string): FactSheet => ({ ...base, people: [{ ...base.people[0], input: { ...base.people[0].input!, job: { ...base.people[0].input!.job, status, detail } } }] });
const ctxOf = (s: FactSheet) => factCtxOf(s, k, [["장소담", "소담"]]);

describe("판독 꼴 → 결정론 검사(최종판3 12)", () => {
  it("처방 종류 이름만 말하는 문장은 내부 라벨이다(자연 문장은 통과)", () => {
    for (const s of ["처방은 지출 한도입니다.", "처방은 하루 두기입니다.", "처방은 시간을 정하는 것입니다.", "처방은 쉬는 시간이에요."]) {
      expect(PRESCRIPTION_LABEL.test(s)).toBe(true);
      expect(factCheck(s, ctxOf(base))?.rule).toBe("label_leak");
    }
    for (const s of ["처방은 간단해요.", "처방은 간단합니다.", "이번 주에 할 일은 하나예요."]) expect(PRESCRIPTION_LABEL.test(s)).toBe(false);
  });
  it("쉬운 이름 치환 겹침(「배우는 힘인 배우는 힘」)을 하나로 줄이고, 남아 있으면 render_dup", () => {
    expect(collapseRenderDup("규칙의 힘이 가장 강하고 배우는 힘인 배우는 힘은 약한 편이라")).toBe("규칙의 힘이 가장 강하고 배우는 힘은 약한 편이라");
    expect(factCheck("배우는 힘인 배우는 힘은 약한 편이에요.", ctxOf(base))?.rule).toBe("render_dup");
    expect(collapseRenderDup("규칙과 책임을 잡는 힘인 관성이 강해요.")).toBe("규칙과 책임을 잡는 힘인 관성이 강해요.");
  });
  it("지금 대운의 끝을 「올해까지」로 말하면 정답지와 대조해 fact_dayun", () => {
    const ctx = ctxOf(base), cur = [...base.people[0].dayun.cycles].reverse().find(c => c.startYear <= ctx.thisYear)!;
    const hit = factCheck("올해까지 이어지는 이 10년은 공부와 서류 쪽으로 힘이 실리는 시기입니다.", ctx);
    if (cur.endYear === ctx.thisYear) expect(hit?.rule).not.toBe("fact_dayun");
    else expect(hit).toMatchObject({ rule: "fact_dayun" });
    expect(factCheck("이 10년은 공부와 서류 쪽으로 힘이 실리는 시기입니다.", ctx)?.rule).not.toBe("fact_dayun");
  });
  it("자영업·프리랜서 입력에 회의·상사 장면, 재취업 준비 입력에 과거 근속 단정은 input_outside(가정형은 통과)", () => {
    const shop = ctxOf(withJob("self_employed", "동네 꽃집 운영"));
    expect(factCheck("회의 뒤 동료에게 조용히 메시지를 보내 흐름을 다시 잇는 일도 이 힘의 한 모습입니다.", shop)?.rule).toBe("input_outside");
    expect(factCheck("손님이나 동료에게 원칙만 말하면 차갑게 들리지요.", shop)?.rule).not.toBe("input_outside");
    expect(factCheck("나중에 회의에서 발표하게 되면 첫 줄을 먼저 정해 두세요.", shop)?.rule).not.toBe("input_outside");
    const seeker = ctxOf(withJob("job_seeker", "회계 사무직 재취업 준비"));
    expect(factCheck("당신의 내세울 근거는 오래 맡아도 사고 없던 안정성 자체입니다.", seeker)?.rule).toBe("input_outside");
    expect(factCheck("오래 같은 자리에서 성실하게 지낸 흔적은 말보다 먼저 믿음을 줍니다.", seeker)?.rule).not.toBe("input_outside");
    const employee = ctxOf(withJob("employee", "종합병원 간호사"));
    expect(factCheck("회의 뒤 동료에게 조용히 메시지를 보내 흐름을 다시 잇습니다.", employee)?.rule).not.toBe("input_outside");
  });
  it("가게꼴 직업 낱말은 앞 이름도 직업 낱말이다(종합 표지 「꽃 앞에서…」를 잡는다)", () => {
    expect(jobWordsOf("동네 꽃집 운영")).toEqual(expect.arrayContaining(["꽃집", "꽃"]));
    expect(jobWordsOf("동네 빵가게")).toEqual(expect.arrayContaining(["빵"]));
    expect(jobWordsOf("회계 사무직 재취업 준비")).not.toContain("회");
  });
});

describe("판독 꼴 2(최종판3 12, 연애)", () => {
  it("「이 장의 한 가지 행동은 X예요」도 처방 종류 라벨이다", () => {
    for (const s of ["이 장의 한 가지 행동은 고마움 말하기예요.", "이 장의 한 가지 행동은 한 줄 말하기입니다.", "이 장의 행동은 걷기예요."]) expect(PRESCRIPTION_LABEL.test(s)).toBe(true);
    expect(PRESCRIPTION_LABEL.test("이 장의 이야기는 여기까지예요.")).toBe(false);
  });
});
