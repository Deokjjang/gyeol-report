// V4 궁합 픽스처(현우×소연)의 점수 쪽: 점수 v2.1로 바뀌지 않는지(P6c-ui2 2단계 시험 쌍 표).
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { storedBook } from "../../src/lib/book/storedReport";
it("v4 score", () => {
  const snap = JSON.parse(gunzipSync(readFileSync("tests/fixtures/production-version-combos/saju_mbti_compatibility-v4.json.gz")).toString());
  const b = storedBook(snap)!, s = b.data.pages.find(p => p.kind === "score") as Extract<typeof b.data.pages[number], { kind: "score" }>;
  console.log("V4", b.data.names, s.total, s.scores.map(x => `${x.label} ${x.value}/${x.max}`).join(" · "));
});
