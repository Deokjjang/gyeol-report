import { manualReviewAllowed } from "../gate";
import { CASES, generationIdValid } from "../model";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  if (!manualReviewAllowed(request)) return new Response(null, { status: 404 });
  const raw = await request.text();
  if (raw.length > 16000) return Response.json({ ok: false, error: "INPUT_TOO_LARGE" }, { status: 413 });
  let input;
  try { input = JSON.parse(raw); } catch { return Response.json({ ok: false, error: "INVALID_JSON" }, { status: 400 }); }
  if (!input || !CASES.some(c => c.id === input.caseId) || !generationIdValid(input.generationId)) return Response.json({ ok: false, error: "REVIEW_ID_REQUIRED" }, { status: 400 });
  const { generateReview } = await import("../generate");
  let cancelled = false;
  const stream = new ReadableStream({
    async start(controller) {
      await generateReview(input.caseId, input.generationId, input.payload, new Date().toISOString(), event => {
        if (!cancelled) controller.enqueue(new TextEncoder().encode(`${JSON.stringify(event)}\n`));
      });
      if (!cancelled) controller.close();
    },
    cancel() { cancelled = true; },
  });
  return new Response(stream, { headers: { "content-type": "application/x-ndjson", "cache-control": "no-store", "x-content-type-options": "nosniff" } });
}
