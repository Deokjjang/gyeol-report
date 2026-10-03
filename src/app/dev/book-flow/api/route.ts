import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  const url = new URL(request.url);
  // Next's dev server can normalize request.url to localhost while the actual
  // browser uses 127.0.0.1. Validate the Host too, then compare the real origin.
  const host = request.headers.get("host");
  if (host) url.host = host;
  if (process.env.NODE_ENV !== "development" || !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)) return new Response(null, { status: 404 });
  if (request.headers.get("origin") && request.headers.get("origin") !== url.origin) return new Response(null, { status: 403 });
  if (Number(request.headers.get("content-length") ?? 0) > 16_384) return new Response(null, { status: 413 });
  const raw = await request.text();
  if (raw.length > 16_384) return new Response(null, { status: 413 });
  let body: Record<string, unknown>;
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ ok: false, error: "입력을 확인해 주세요." }, { status: 400 }); }
  if (!body || typeof body !== "object") return new Response(null, { status: 400 });
  if (body.operation === "prepare" && body.memberGeneralConsent === true) {
    const { createLocalAccountPort } = await import("../../../../lib/account/localReview");
    const { accountSession } = await import("../../../../lib/account/policy");
    const port = createLocalAccountPort(new NextRequest(request.url, { headers: request.headers }));
    const user = await port?.currentUser();
    const snapshot = user && port ? await port.read(user) : null;
    if (!user || !snapshot || accountSession(user, snapshot).status !== "member") return NextResponse.json({ ok: false, error: "현재 약관 동의를 다시 확인해 주세요." }, { status: 401 });
  }
  const review = await import("../../../../lib/book/localReview");
  const result = body.operation === "validate" ? review.validateLocalBookInput(body.payload)
    : body.operation === "prepare" ? review.prepareLocalBook(body.request)
      : body.operation === "publish" && typeof body.orderId === "string" ? await review.publishLocalBook(body.orderId) : { ok: false, error: "검수 요청을 확인해 주세요." };
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
