// 운영 V4 세운 픽스처의 달 카드(번호·상태·간지)를 찍는다.
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { storedBook } from "../../src/lib/book/storedReport";
it("v4 months", () => {
  const snap = JSON.parse(gunzipSync(readFileSync("tests/fixtures/production-version-combos/annual_fortune-v4.json.gz")).toString());
  console.log("createdAt", snap.createdAtIso, JSON.stringify(snap.evidencePacket?.clock ?? snap.evidencePacket?.input?.clock ?? "").slice(0, 200));
  const b = storedBook(snap)!;
  const m = b.data.pages.find(p => p.kind === "months") as Extract<typeof b.data.pages[number], { kind: "months" }>;
  for (const x of m.months) console.log(x.month, x.time, x.ganji, x.boundary?.label ?? "");
});
