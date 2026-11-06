// 운영 V4 궁합 픽스처의 점수 쪽·관계 쪽 모양을 찍는다.
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { storedBook } from "../../src/lib/book/storedReport";
it("v4 score", () => {
  const snap = JSON.parse(gunzipSync(readFileSync("tests/fixtures/production-version-combos/saju_mbti_compatibility-v4.json.gz")).toString());
  const b = storedBook(snap)!;
  console.log(b.data.pages.map((p, i) => `${i}:${p.kind}:${p.id}`).join(" "));
  console.log(JSON.stringify(b.data.pages.filter(p => p.kind === "score" || p.kind === "pair"), null, 1).slice(0, 4000));
});
