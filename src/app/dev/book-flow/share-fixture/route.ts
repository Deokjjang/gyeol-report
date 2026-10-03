import { NextRequest } from "next/server";
import { localAccountAllowed } from "../../../../lib/account/gate";
export async function POST(request: NextRequest) {
  if (!localAccountAllowed(request)) return new Response(null, { status: 404 });
  const url = new URL(request.url); if (request.headers.get("host")) url.host = request.headers.get("host")!;
  if (request.headers.get("origin") !== url.origin) return new Response(null, { status: 403 });
  if (Number(request.headers.get("content-length") ?? 0) > 16384) return new Response(null, { status: 413 });
  const text = await request.text(); if (text.length > 16384) return new Response(null, { status: 413 });
  let payload: unknown; try { payload = JSON.parse(text); } catch { return new Response(null, { status: 400 }); }
  const { createLocalShareFixture } = await import("../../../../lib/book/shareLocalReview");
  return createLocalShareFixture(request, payload);
}
