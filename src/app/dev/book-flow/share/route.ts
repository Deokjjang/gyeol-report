import { NextRequest } from "next/server";
import { localAccountAllowed } from "../../../../lib/account/gate";
export async function POST(request: NextRequest) {
  if (!localAccountAllowed(request)) return new Response(null, { status: 404 });
  const { createLocalAccountPort } = await import("../../../../lib/account/localReview");
  const { localBookShareDatabase, sqlBookShareLibrary, sqlBookSharePort } = await import("../../../../lib/book/shareLocalReview");
  const { prepareBookShare } = await import("../../../../lib/book/shareServer");
  const db = await localBookShareDatabase(), auth = createLocalAccountPort(request);
  return db && auth ? prepareBookShare(request, auth, sqlBookShareLibrary(db), sqlBookSharePort(db), true) : new Response(null, { status: 404 });
}
