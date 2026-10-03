import { NextRequest, NextResponse } from "next/server";
import { localAccountAllowed } from "../../../../../lib/account/gate";

async function handle(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  if (!localAccountAllowed(request)) return new NextResponse(null, { status: 404 });
  const { createLocalAccountPort } = await import("../../../../../lib/account/localReview");
  const port = createLocalAccountPort(request);
  if (!port) return new NextResponse(null, { status: 404 });
  const action = (await context.params).action;
  if (action.startsWith("library-")) {
    const { handleLibrary } = await import("../../../../../lib/library/server");
    const { createLocalLibraryPort } = await import("../../../../../lib/library/localReview");
    return handleLibrary(request, action.slice(8), port, createLocalLibraryPort(), true);
  }
  const { handleAccount } = await import("../../../../../lib/account/handler");
  return handleAccount(request, action, port, true);
}
export const GET = handle;
export const POST = handle;
