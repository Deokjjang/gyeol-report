import { NextResponse } from "next/server";
import { localAccountAllowed } from "../../../lib/account/gate";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  if (!localAccountAllowed(request)) return new Response(null, { status: 404 });
  const { localLaunchEventDatabase } = await import("../../../lib/growth/launchLocal");
  const { launchEventView } = await import("../../../lib/growth/launchServer");
  const db = await localLaunchEventDatabase();
  const event = db ? await launchEventView({ call: async () => (await db.query<{ r: unknown }>("select launch_event_state() r")).rows[0].r }) : null;
  return NextResponse.json(event, { status: event ? 200 : 503, headers: { "cache-control": "no-store" } });
}
