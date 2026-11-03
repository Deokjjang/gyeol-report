// 운영 V4 세운 픽스처의 달 카드(번호·저장 상태·간지·절기 구간)와 본문 쪽 제목을 찍는다(P6c-ui2 h·j 확인).
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { storedBook } from "../../src/lib/book/storedReport";
it("v4 months", () => {
  const snap = JSON.parse(gunzipSync(readFileSync("tests/fixtures/production-version-combos/annual_fortune-v4.json.gz")).toString());
  const b = storedBook(snap, null, "2026-11-03")!;
  console.log("title", b.data.title, "createdAt", snap.createdAtIso, "readingDate", b.data.readingDate);
  const m = b.data.pages.find(p => p.kind === "months") as Extract<typeof b.data.pages[number], { kind: "months" }>;
  console.log("map", JSON.stringify(m.map));
  for (const x of m.months) console.log(x.month, x.time, x.ganji, x.gods, "|", x.boundary ? `${x.boundary.label} :: ${x.boundary.segments.map(s => `${s.start}~${s.end} ${s.ganji}`).join(" / ")}` : "-", "| page", x.page, b.data.pages[x.page]?.title);
});
