// W7-6 m2(외부 호출 0, 가상 이름 + 합성 문장만): 측정 m1 직접 읽기에서 찾은 깨진 문장·사실 결함의 결정론 고침.
import { describe, expect, it } from "vitest";
import { fixEchoPhrase, fixJudgeWords, glossEchoes, stripGlossEcho } from "@/lib/writer/safety/broken";
import { dependsOnRemoved } from "@/lib/writer/safety/orphan";
import { sentenceViolation } from "@/lib/writer/safety/sentences";
import { groupClaims } from "@/lib/writer/safety/lint";
import { dropBookTwins, dropSentences } from "@/lib/writer/repairPlan";
import { tidyBook } from "@/lib/writer/safety/p6c";
import { renderMarks } from "@/lib/writer/marks";

const ch = (n: number, sections: string[][]) => ({ n, title: `${n}장`, source: "writer" as const, sections: sections.map((paragraphs, i) => ({ heading: `소제목 ${i + 1}`, paragraphs })) });
const facts = { relationship: "single", children: "unknown", job: "employee", birthTimeKnown: true, mbti: "ISFP" } as never;

describe("W7 m2 풀이 되풀이", () => {
  it("6자 겹침 · 이어진 두 낱말 되풀이는 풀이 괄호를 뗀다", () => {
    expect(stripGlossEcho("올해의 식신(만들고 다듬는 재능)은 만들고 다듬는 일에 손을 붙여 줍니다.").text).toBe("올해의 식신은 만들고 다듬는 일에 손을 붙여 줍니다.");
    expect(stripGlossEcho("여기에 장성살(앞에 서면 힘이 실리는 기운)이 더해져 앞에 서면 무게가 실려요.").text).toBe("여기에 장성살이 더해져 앞에 서면 무게가 실려요.");
  });
  it("다음 문장이 같은 이름으로 풀이를 되풀이하면 앞 문장의 풀이 괄호를 뗀다", () => {
    const p = "태어난 날 땅 글자(일지)에 편재(움직이는 돈과 큰 판을 다루는 힘)가 있어요. 편재(偏財)는 움직이는 돈과 큰 판을 다루는 감각이라, 기회가 보이면 벌이게 돼요.";
    expect(stripGlossEcho(p).text).toBe("태어난 날 땅 글자(일지)에 편재가 있어요. 편재(偏財)는 움직이는 돈과 큰 판을 다루는 감각이라, 기회가 보이면 벌이게 돼요.");
  });
  it("낱말 하나만 겹치면 되풀이가 아니다", () => {
    expect(glossEchoes("편인(혼자 깊이 파고드는 힘)이 있어서 혼자 있는 시간이 필요해요.")).toHaveLength(0);
    expect(stripGlossEcho("정관(평가와 기준이 또렷한 자리에서 인정받는 힘)이 있어서 사람들 앞에서 일할 때 빛나요.").count).toBe(0);
  });
});

describe("W7 m2 겹친 자리 말 · 판정 낱말", () => {
  it("작가 자리 말 뒤 같은 자리 구절은 하나로", () => {
    expect(fixEchoPhrase("가람님은 태어난 날 기둥이 태어난 날 기둥(일주) 갑신이에요.").text).toBe("가람님은 태어난 날 기둥(일주) 갑신이에요.");
    expect(fixEchoPhrase("태어난 날 기둥(일주)이 갑신이에요.").count).toBe(0);
  });
  it("「많음이고·부족이에요」는 용언으로", () => {
    expect(fixJudgeWords("오행으로 보면 흙이 많음이고 물이 부족이에요.").text).toBe("오행으로 보면 흙이 많고 물이 부족해요.");
    expect(fixJudgeWords("쇠가 없음입니다.").text).toBe("쇠가 없습니다.");
    expect(fixJudgeWords("물이 부족이라는 말은 흔해요.").count).toBe(0);
  });
});

describe("W7 m2 떼기 뒤 고아", () => {
  it("출처 문장을 떼면 「…다는 평가죠」는 기대는 문장이다", () => {
    expect(dependsOnRemoved("MBTI 통념으로 보면 두 유형의 궁합은 '보통'이에요.", "일은 잘 맞지만 변화 속도에서 부딪친다는 평가죠.")).toBe("leans");
    expect(dependsOnRemoved("첫 문장이에요.", "두 사람은 일에서 잘 맞아요.")).toBeNull();
  });
  it("내용 반복 규칙은 문단 가운데 문장을 떼지 않는다(노출 규칙은 그대로 뗀다)", () => {
    const p = "공통 귀인 둘이 함께 있어요. 천을귀인은 두 사람 모두에게 있어요. 한 사람에게만 있는 귀인도 있어요. 마지막 문장이에요.";
    const mid = dropSentences([ch(1, [[p, "다른 문단이에요."]])], [{ chapter: 1, section: 0, paragraph: 0, sentence: "천을귀인은 두 사람 모두에게 있어요.", rule: "phrase_repeat", hard: false }]);
    expect(mid.chapters[0].sections[0].paragraphs[0]).toBe(p);
    expect(mid.dropped[0].kept).toBe("mid");
    const leak = dropSentences([ch(1, [[p, "다른 문단이에요."]])], [{ chapter: 1, section: 0, paragraph: 0, sentence: "천을귀인은 두 사람 모두에게 있어요.", rule: "rule_leak", hard: true }]);
    expect(leak.chapters[0].sections[0].paragraphs[0]).toBe("공통 귀인 둘이 함께 있어요. 한 사람에게만 있는 귀인도 있어요. 마지막 문장이에요.");
  });
});

describe("W7 m2 사실", () => {
  it("몸이 아픈 것을 성향의 결과로 단정하면 건강 단정", () => {
    expect(sentenceViolation("지치고 상처받은 마음을 몸이 아프고 나서야 알아채기도 합니다.", facts)).toBe("health_claim");
    expect(sentenceViolation("마음이 지치면 쉬는 시간을 먼저 챙겨 두세요.", facts)).toBeNull();
  });
  it("「만들고 넓히는 힘이 크기 때문에」는 식상 강 세기 말", () => {
    expect(groupClaims("만들고 넓히는 힘이 크기 때문에 판을 키우는 일에서 힘이 나요.")).toEqual([{ group: "식상", level: "강" }]);
  });
});

describe("W7 m3 렌더 · 수리 뒤 같은 문장", () => {
  it("MBTI 이름 되풀이는 낱말 머리에서만(「구하는」 안의 「하는」은 되풀이가 아니다)", () => {
    const t = (x: string) => tidyBook([{ n: 2, id: "x", title: "x", source: "writer", chars: 0, sections: [{ heading: "h", paragraphs: [x] }] }], { mbtiPlain: { Te: "일 되게 하는 판단", Si: "지난 경험 기억" }, monthChapters: new Set() }).chapters[0].sections[0].paragraphs[0];
    expect(t("상대의 의견을 구하는 모습이 낯설지 않으시죠? ENTJ는 일 되게 하는 판단(Te)이 주기능이에요.")).toBe("상대의 의견을 구하는 모습이 낯설지 않으시죠? ENTJ는 일 되게 하는 판단(Te)이 주기능이에요.");
    expect(t("지난 경험을 기준점으로 삼는 지난 경험 기억(Si)의 결과예요.")).toBe("지난 경험을 기준점으로 삼는 성향(Si)의 결과예요.");
  });
  it("작가가 「P님에게 Q님은」 틀을 쓰면 서로 보는 십성은 그 방향 이름만", () => {
    const tb = new Map([["tg:ab", { key: "tg:ab", kind: "tg" as const, text: "가람님에게 비견인 나래님", short: "나래님" }], ["tg:ba", { key: "tg:ba", kind: "tg" as const, text: "나래님에게 겁재인 가람님", short: "가람님" }]]);
    expect(renderMarks("나래님에게 가람님은 ⟦tg:ab⟧이에요.", tb)).toBe("나래님에게 가람님은 겁재예요.");
    expect(renderMarks("가람님에게 나래님은 ⟦tg:ab⟧이에요.", tb)).toBe("가람님에게 나래님은 비견이에요.");
    expect(renderMarks("두 사람은 ⟦tg:ab⟧이라 나란히 걸어요.", tb)).toBe("두 사람은 가람님에게 비견인 나래님이라 나란히 걸어요.");
  });
  it("수리 뒤 같은 문장 둘은 하나를 뗀다(다음 문장이 기대는 쪽은 남긴다)", () => {
    const s = "숫자와 날짜, 순서 같은 구체 사실부터 확인하는 쪽은 두 사람 중 나래님이 더 강합니다.";
    const book = [ch(1, [["짧은 글에서도 마음을 읽어요. " + s + " 용건만 있어도 마음은 같아요."]]), ch(2, [["비용이 어긋날 때가 있어요. " + s.replace("강합니다", "강해요") + " 그래서 나래님은 이미 정리하고 있어요."]])];
    const r = dropBookTwins(book);
    expect(r.dropped).toHaveLength(1);
    expect(r.chapters[0].sections[0].paragraphs[0]).toBe("짧은 글에서도 마음을 읽어요. 용건만 있어도 마음은 같아요.");
    expect(r.chapters[1].sections[0].paragraphs[0]).toContain("더 강해요. 그래서");
    expect(dropBookTwins([ch(1, [["가람님은 정한 일을 끝까지 붙드는 쪽이에요. 나래님은 새 길을 먼저 여는 쪽이에요."]])]).dropped).toHaveLength(0);
  });
});
