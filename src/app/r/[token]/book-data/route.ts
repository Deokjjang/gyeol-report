import { bookExperiencePublicEnabled } from "../../../../lib/book/publicGate";
import { BOOK_SHARE_HEADERS, loadSharedBookData } from "../../../../lib/book/shareServer";
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  if (!bookExperiencePublicEnabled()) return new Response(null, { status: 404 });
  const result = await loadSharedBookData((await params).token);
  return Response.json(result ?? {}, { status: result ? 200 : 404, headers: BOOK_SHARE_HEADERS });
}
