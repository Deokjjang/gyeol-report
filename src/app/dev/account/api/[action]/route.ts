import { NextRequest, NextResponse } from "next/server";
import { localAccountAllowed } from "../../../../../lib/account/gate";

async function handle(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  if (!localAccountAllowed(request)) return new NextResponse(null, { status: 404 });
  const { createLocalAccountPort } = await import("../../../../../lib/account/localReview");
  const port = createLocalAccountPort(request);
  if (!port) return new NextResponse(null, { status: 404 });
  const action = (await context.params).action;
  if (action.startsWith("ticket-")) {
    const { localTicketStore, grantTestReportTickets, failNextLocalTicketPublish } = await import("../../../../../lib/tickets/localDatabase");
    const store = await localTicketStore();
    if (!store) return new NextResponse(null, { status: 404 });
    // Explicit localhost fixture only: fixed scenarios, no arbitrary grant API/UI.
    if (action === "ticket-fixture") {
      const url = new URL(request.url); if (request.headers.get("host")) url.host = request.headers.get("host")!;
      if (request.method !== "POST" || request.headers.get("origin") !== url.origin) return new NextResponse(null, { status: 403 });
      const user = await port.currentUser(), snapshot = user ? await port.read(user) : null;
      const { accountSession } = await import("../../../../../lib/account/policy");
      if (!user || !snapshot || accountSession(user,snapshot).status !== "member") return new NextResponse(null, { status: 401 });
      const raw = await request.text(); if (raw.length > 80) return new NextResponse(null, { status: 400 });
      if (raw === "failure") { failNextLocalTicketPublish(user.id); return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "private, no-store" } }); }
      if (raw !== "one" && raw !== "several") return new NextResponse(null, { status: 400 });
      const result = await grantTestReportTickets(store,user.id,raw);
      return NextResponse.json({ ok: result.ok }, { headers: { "Cache-Control": "private, no-store" } });
    }
    const { handleTickets } = await import("../../../../../lib/tickets/handler");
    return handleTickets(request, action.slice(7), port, store);
  }
  if (action.startsWith("library-")) {
    const { handleLibrary } = await import("../../../../../lib/library/server");
    const { createLocalLibraryPort } = await import("../../../../../lib/library/localReview");
    const library = createLocalLibraryPort();
    const { localTicketStore } = await import("../../../../../lib/tickets/localDatabase");
    return handleLibrary(request, action.slice(8), port, { ...library, async list(user) {
      const paid = await library.list(user), tickets = await (await localTicketStore())?.call("library", user);
      return paid && tickets?.ok && Array.isArray(tickets.items) ? [...paid, ...tickets.items] : null;
    } }, true);
  }
  const { handleAccount } = await import("../../../../../lib/account/handler");
  return handleAccount(request, action, port, true);
}
export const GET = handle;
export const POST = handle;
