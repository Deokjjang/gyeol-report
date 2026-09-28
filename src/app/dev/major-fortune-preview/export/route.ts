import { majorFortuneV3CustomerText } from "../../../../lib/interpretation-v3/majorFortuneEditorial";
import { GAON_MAJOR_FORTUNE_V3_PAYLOAD } from "../../../../lib/interpretation-v3/majorFortuneFixtures";
import { createMajorFortuneV3 } from "../../../../lib/report-generation/majorFortuneV3Generation";

export async function GET() {
  if (process.env.NODE_ENV === "production" && process.env.MAJOR_FORTUNE_DEV_PREVIEW_ENABLED !== "1") return new Response("Not Found", { status: 404 });
  const result = await createMajorFortuneV3(GAON_MAJOR_FORTUNE_V3_PAYLOAD);
  if (result === null) return new Response("Preview unavailable", { status: 500 });
  return new Response(majorFortuneV3CustomerText(result.draft), { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}
