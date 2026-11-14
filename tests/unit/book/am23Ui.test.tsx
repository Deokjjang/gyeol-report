/** AM2-3 5부(덕짱님과 정한 시안): 세운 흐름표 · 달 카드 · 대운 평생 지도 띠 · 앞으로 10년표 · 해 카드(가짜 작가 책, 호출 0). */
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { projectV5Book } from "@/lib/writer/book";
import { AmPage } from "@/app/dev/book-preview/BookAm";
import type { BookPage } from "@/app/dev/book-preview/bookTypes";

const AT = "2026-12-02T03:00:00.000Z";
const payload = (productKey: "annual_fortune" | "major_fortune") => ({
  productKey, productSlug: productKey === "annual_fortune" ? "annual-fortune" : "major-fortune",
  person: { name: "한서윤", birthDate: "1998-04-17", birthTime: "08:20", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "FEMALE", mbtiType: "ENFP" },
  userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "", focusAreas: [] },
  productOptions: productKey === "annual_fortune" ? { selectedYear: "2027", wish: "지금 회사에서 인정받고 싶어요" } : {},
});
async function book(productKey: "annual_fortune" | "major_fortune") {
  const { buildV5Snapshot } = await import("@/lib/writer/publish");
  const { devMockStream } = await import("@/lib/ops/generation/devMock");
  const { memorySink } = await import("@/lib/ops/generation/sinks");
  const p = payload(productKey);
  const built = await buildV5Snapshot({ payload: p as never, reportId: `report_am23ui${productKey === "annual_fortune" ? "annual" : "major0"}01`, policyAt: AT, sink: memorySink() as never, deps: { provider: "anthropic", model: "claude-sonnet-5-5", fallback: null, stream: devMockStream("ok", p as never, AT), people: async () => [] } });
  return projectV5Book(built.snapshot, "2027-05-20")!;
}
const html = (page: BookPage) => renderToStaticMarkup(<AmPage page={page} title="책" onPage={() => {}} text={v => v} />);

describe("AM2-3 5부 세운", () => {
  it("앞머리 흐름표: 해 머리 · 내 오행 막대 · 13행(지금 달 · ★) · 십성 사전, 줄을 누르면 그 달 카드로, 다크 모드는 AM 책만", async () => {
    const data = await book("annual_fortune");
    expect(data.scheme).toBe("auto");
    const ft = data.pages.find((p): p is Extract<BookPage, { kind: "flowTable" }> => p.kind === "flowTable")!;
    expect(ft.title).toBe("2027 한 해 흐름표");
    expect(ft.year).toMatchObject({ ganji: "丁未", name: "정미년" });
    expect(ft.rows).toHaveLength(13);
    expect(ft.rows.filter(r => r.now).map(r => r.name)).toEqual(["5월 · 을사월"]);
    expect(ft.rows.some(r => r.star)).toBe(true);
    for (const r of ft.rows) { expect(data.pages[r.page].kind).toBe("periodCard"); expect(["잔잔", "느림", "보통", "활발", "거셈"]).toContain(r.flowWord); }
    expect(ft.dict.length).toBeGreaterThan(3);
    expect(data.pages.some(p => p.kind === "months")).toBe(false);
    const h = html(ft);
    expect(h).toContain("data-el=\"fire\""); expect(h).toMatch(/오름|살필/); expect(h).not.toMatch(/흐름[^<]{0,6}\d\/5/);
  }, 300_000); // 전체 실행(병렬 부하)에서 혼자 돌 때의 3~5배가 걸린다.
  it("달 카드: 머리(달·날짜·흐름 단어) → 한 줄 뜻 → 좋은 것/살필 점 → 이달의 한 가지, 「명리로 보면」에 관계 이름 + 쉬운 뜻, 간지는 한 번, 지난 달은 돌아보기", async () => {
    const data = await book("annual_fortune");
    const cards = data.pages.filter((p): p is Extract<BookPage, { kind: "periodCard" }> => p.kind === "periodCard");
    expect(cards).toHaveLength(13);
    const now = cards.find(c => c.now)!, past = cards.find(c => c.past)!;
    expect(now.title).toBe("5월 · 을사월"); expect(now.sub).toMatch(/^\d+\/\d+~\d+\/\d+$/);
    expect(now.one?.label).toBe("이달의 한 가지"); expect(past.caution).toBeUndefined(); expect(past.one?.label).toMatch(/돌아보기|이달의 한 가지/);
    const h = html(now);
    expect((h.match(/data-el=/g) ?? []).length).toBe(2); // 간지 칸은 머리에 한 번
    expect(h).toContain("명리로 보면"); expect(h).not.toContain("앞으로");
  }, 300_000);
});

describe("AM2-3 5부 대운", () => {
  it("평생 지도: 같은 주제 대운을 한 띠로 · 나이 · 오행 색 칸 · 대운수·바뀌는 달은 머리에 한 번 · 지금 표시", async () => {
    const data = await book("major_fortune");
    const life = data.pages.find((p): p is Extract<BookPage, { kind: "lifetime" }> => p.kind === "lifetime")!;
    expect(life.bands!.length).toBeLessThan(life.cycles.length);
    expect(life.head).toMatch(/대운수 \d+/);
    expect(life.cycles.filter(c => c.current)).toHaveLength(1);
    const h = html(life);
    expect(h).toContain("지금"); expect(h).not.toMatch(/대운수 \d+\)/);
  }, 300_000);
  it("10년표: 연도·나이 | 간지 | 한 줄 뜻 | 십성 | 흐름, 핵심 해 ★, 대운이 바뀌는 곳에 구분 줄, 해 카드는 달 카드와 같은 문법 · 지난 해는 돌아보기만", async () => {
    const data = await book("major_fortune");
    const dt = data.pages.find((p): p is Extract<BookPage, { kind: "decadeTable" }> => p.kind === "decadeTable")!;
    expect(dt.rows).toHaveLength(14);
    expect(dt.rows.filter(r => r.star).length).toBe(3);
    expect(dt.rows.some(r => r.divider && /대운/.test(r.divider))).toBe(true);
    for (const r of dt.rows) expect(data.pages[r.page].kind).toBe("periodCard");
    const cards = data.pages.filter((p): p is Extract<BookPage, { kind: "periodCard" }> => p.kind === "periodCard");
    const past = cards.find(c => c.past)!;
    expect(past.caution).toBeUndefined(); expect(past.one?.label).toBe("돌아보기");
    expect(html(cards.find(c => !c.past)!)).not.toMatch(/대운 [갑을병정무기경신임계]/);
  }, 300_000);
});
