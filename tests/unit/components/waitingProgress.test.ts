import { describe, expect, it } from "vitest";
import { etaLabel, etaOf, pollDelay, POLL_STEPS_MS } from "../../../src/components/report/generationProgress";
import { chapterForStore, chapterFromStore } from "../../../src/lib/writer/runner";

// AM 4부 대기 화면: 진짜 진행률·남은 시간(실측 중앙값, 없으면 숨김)·조회 주기 3초에서 점점 길게·먼저 읽기 저장 형식.
describe("대기 화면 진행", () => {
  it("남은 시간: 중앙값 × 남은 장 몫, 실측이 없으면 숨김", () => {
    expect(etaOf(null, 3, 13)).toBeNull();
    expect(etaOf(260_000, 0, 13)).toBe(260_000);
    expect(etaOf(260_000, 13, 13)).toBe(0);
    expect(etaOf(260_000, 5, null)).toBe(260_000);
    expect(etaLabel(null)).toBeNull();
    expect(etaLabel(30_000)).toBe("곧 완성돼요");
    expect(etaLabel(160_000)).toBe("남은 시간 약 3분");
  });
  it("조회 주기 3초에서 점점 길게(최대 20초)", () => {
    expect(pollDelay(0)).toBe(3_000);
    expect(pollDelay(3)).toBe(5_000);
    expect(pollDelay(99)).toBe(20_000);
    expect([...POLL_STEPS_MS].every((v, i, a) => i === 0 || v >= a[i - 1])).toBe(true);
  });
  it("장 저장 행에 전체 장 수·미리보기를 담고, 읽을 때는 뗀다(작가 원고는 그대로)", () => {
    const chapter = { n: 1, title: "2027 큰 그림", sections: [{ heading: "a", paragraphs: ["본문"] }] };
    const stored = chapterForStore({ n: 1, chapter, source: "writer", total: 10, preview: { n: 1, title: "2027 큰 그림", sections: [{ heading: "a", paragraphs: ["본문"] }], hidden: 0 } });
    expect(stored).toMatchObject({ _total: 10, _preview: { hidden: 0 } });
    expect(chapterFromStore(stored)).toEqual(chapter);
  });
});
