import { localAccountAllowed } from "../../../../../../lib/account/gate";
import { BOOK_SHARE_HEADERS, loadSharedBookData } from "../../../../../../lib/book/shareServer";
export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  if (!localAccountAllowed(request)) return new Response(null, { status: 404 });
  const { localBookShareDatabase, sqlBookSharePort } = await import("../../../../../../lib/book/shareLocalReview");
  const db = await localBookShareDatabase(), result = db ? await loadSharedBookData((await params).token, sqlBookSharePort(db)) : null;
  return Response.json(result ?? {}, { status: result ? 200 : 404, headers: BOOK_SHARE_HEADERS });
}
