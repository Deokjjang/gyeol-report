// ZW-2 4부 명반 화면 · 고지(호출 0): 뷰 = 저장 명반, 밝기 점은 통용 칸만, 주석은 해당하는 사람만, 라이선스 원문 = node_modules, 「iztro」는 고지 · 내부 코드에만,
// 자미 책 투영 쪽 차례(명반 → … 사화 배지 → 8장 → 대한 띠 → 9장), 부품 정적 렌더.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { computeZiweiChart } from "../../../src/lib/ziwei/chart";
import { CELL_POS, ziweiBoardView, ZIWEI_SCHOOL_NOTE, ZIWEI_YEAR_NOTE } from "../../../src/lib/ziwei/view";
import { ZiweiBoard, ZiweiDecadeBand, ZiweiMutagenBadges } from "../../../src/components/ziwei/ZiweiBoard";
import { buildV5Snapshot } from "../../../src/lib/writer/publish";
import { projectV5Book, validateV5Publication } from "../../../src/lib/writer/book";
import { ziweiMockStreamFor } from "../../../src/lib/writer/chunked/ziweiMock";
import licenses from "../../../src/data/licenses/open-source.json";
import { randomPeople, Z5_PEOPLE } from "./zw2People";

const ASOF = "2026-12-02";
const walk = (dir: string): string[] => readdirSync(dir).flatMap(n => { const p = join(dir, n); return statSync(p).isDirectory() ? walk(p) : [p]; });

describe("명반 뷰", () => {
  it("12칸 전통 배치 · 밝기 점은 통용 칸만 · 주석은 해당하는 사람만(시험 인물 5 + 무작위 300)", () => {
    for (const tp of [...Z5_PEOPLE, ...randomPeople(300, 4242)]) {
      const c = computeZiweiChart(tp.input as never, ASOF), v = ziweiBoardView(c);
      expect(v.cells).toHaveLength(12);
      expect(new Set(v.cells.map(x => `${x.row},${x.col}`)).size).toBe(12);
      for (const cell of v.cells) {
        expect([cell.row, cell.col]).toEqual([...CELL_POS[cell.branch]]);
        const p = c.palaces.find(x => x.id === cell.palace)!;
        expect(cell.majors.map(s => s.id)).toEqual([...p.majors]);
        for (const s of cell.majors) { const placed = c.stars.find(x => x.id === s.id)!; expect(Boolean(s.bright)).toBe(placed.brightnessBasis === "통용" && Boolean(placed.brightness)); }
        expect(cell.empty).toBe(p.empty);
      }
      expect(v.mutagens.map(m => m.id)).toEqual(["rok", "gwon", "gwa", "gi"]);
      expect(v.notes.school === ZIWEI_SCHOOL_NOTE).toBe(c.mutagens.some(m => m.schoolVariant));
      expect(v.notes.year === ZIWEI_YEAR_NOTE).toBe(c.year.differsFromSaju);
      expect(v.decades.filter(d => d.current).length).toBe(c.now.current !== undefined ? 1 : 0);
    }
    // 7부 5번(庚午 설≠입춘)은 주석 둘, 3번(癸亥)은 0.
    const v5 = ziweiBoardView(computeZiweiChart(Z5_PEOPLE[4].input as never, ASOF)), v3 = ziweiBoardView(computeZiweiChart(Z5_PEOPLE[2].input as never, ASOF));
    expect(v5.notes).toEqual({ school: ZIWEI_SCHOOL_NOTE, year: ZIWEI_YEAR_NOTE }); expect(v3.notes).toEqual({});
  }, 120_000);
  it("부품 정적 렌더: 칸 12 · 가운데 · 범례 · 펼침 칸 · 사화 4 · 대한 12(나이 없음)", () => {
    const v = ziweiBoardView(computeZiweiChart(Z5_PEOPLE[4].input as never, ASOF));
    const b = renderToStaticMarkup(createElement(ZiweiBoard, { view: v, name: "민준" }));
    expect((b.match(/<button/g) ?? []).length).toBe(12);
    expect(b).toContain("민준"); expect(b).toContain("data-ziwei-detail"); expect(b).toContain(ZIWEI_YEAR_NOTE);
    const m = renderToStaticMarkup(createElement(ZiweiMutagenBadges, { view: v })), d = renderToStaticMarkup(createElement(ZiweiDecadeBand, { view: v }));
    expect((m.match(/<li/g) ?? []).length).toBe(4); expect(m).toContain(ZIWEI_SCHOOL_NOTE);
    expect((d.match(/<li/g) ?? []).length).toBe(12); expect(d).not.toMatch(/\d+\s?세|살</);
    for (const html of [b, m, d]) expect(html).not.toMatch(/iztro|살성|길성|흉성|학파/i);
  });
});

describe("오픈소스 고지", () => {
  it("7개 패키지 · 모두 MIT · 원문 = node_modules 라이선스 파일", () => {
    const pk = licenses.packages;
    expect(pk.map(p => p.name)).toEqual(["iztro", "dayjs", "i18next", "@babel/runtime", "lunar-lite", "lunar-typescript", "korean-lunar-calendar"]);
    const pnpm = readdirSync("node_modules/.pnpm");
    for (const p of pk) {
      expect(p.license).toBe("MIT");
      const dir = pnpm.find(d => d.startsWith(`${p.name.replace("/", "+")}@${p.version}`))!;
      const base = join("node_modules/.pnpm", dir, "node_modules", p.name);
      expect(JSON.parse(readFileSync(join(base, "package.json"), "utf8")).version).toBe(p.version);
      expect(readFileSync(join(base, p.licenseFile), "utf8").trim()).toBe(p.text);
    }
    expect(JSON.parse(readFileSync("node_modules/iztro/package.json", "utf8")).version).toBe("2.6.5");
  });
  it("「iztro」는 고지 데이터와 내부 코드(계산 어댑터 · 기준 기록 · 검사 낱말)에만", () => {
    const hits = walk("src").filter(f => /\.(tsx?|json|css|md)$/.test(f) && /iztro/i.test(readFileSync(f, "utf8"))).map(f => f.replaceAll("\\", "/")).sort();
    expect(hits).toEqual(["src/data/licenses/open-source.json", "src/lib/writer/chunked/ziweiPublish.ts", "src/lib/ziwei/basis.ts", "src/lib/ziwei/chart.ts", "src/lib/ziwei/text.ts"]);
    expect(readFileSync("src/app/legal/open-source/page.tsx", "utf8")).toContain("open-source.json");
    expect(readFileSync("src/components/legal/LegalPageLayout.tsx", "utf8")).toContain("/legal/open-source");
  });
});

describe("자미 책 투영(가짜 작가 → 저장 스냅샷 → 화면 쪽)", () => {
  it("쪽 차례 · 명반 조각 · 다크 모드 따름 · 공유 없음 모양", async () => {
    const tp = Z5_PEOPLE[2], at = "2026-12-02T01:00:00.000Z";
    const payload = { productKey: "ziwei_full", productSlug: "ziwei-full", person: { name: tp.person.name, birthDate: tp.input.birthDate, birthTimePrecision: "exact", birthTime: tp.input.birthTime, birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: tp.input.gender, mbtiType: tp.person.mbti ?? "" },
      userContext: { relationshipStatus: tp.person.relationshipStatus, jobStatus: tp.person.jobStatus, detailJob: "", focusAreas: [] }, productOptions: { children: "has" } } as never;
    const { snapshot } = await buildV5Snapshot({ payload, reportId: "report_zw2screen0001", policyAt: at, sink: { save: async () => true, load: async () => [] }, deps: { provider: "anthropic", model: "claude-mock", fallback: null, stream: await ziweiMockStreamFor(payload, at) } });
    expect(snapshot.productType).toBe("ziwei_full");
    expect(validateV5Publication("ziwei_full", snapshot.draft, snapshot.evidencePacket).ok).toBe(true);
    const d = snapshot.draft as unknown as { ziwei: { calcVersion: string; chart: { palaces: unknown[] } } };
    expect(d.ziwei.calcVersion).toBe("ziwei-v1-sanhe-kasi"); expect(d.ziwei.chart.palaces).toHaveLength(12);
    const data = projectV5Book(snapshot)!;
    expect(data.bookId).toBe("ziwei"); expect(data.scheme).toBe("auto");
    const kinds = data.pages.map(p => `${p.kind}${p.kind === "narrative" ? `:${p.id}` : ""}`);
    const at0 = (k: string) => kinds.findIndex(x => x.startsWith(k));
    expect(at0("ziweiBoard")).toBeLessThan(at0("narrative"));
    expect(at0("ziweiMutagens")).toBeGreaterThan(-1); expect(at0("ziweiDecades")).toBeGreaterThan(at0("ziweiMutagens"));
    expect(kinds.at(-1)).toBe("back");
    expect(validateV5Publication("ziwei_full", { ...(snapshot.draft as object), chapters: [] }, snapshot.evidencePacket).ok).toBe(false);
  }, 60_000);
});
