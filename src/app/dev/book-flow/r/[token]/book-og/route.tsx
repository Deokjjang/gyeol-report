import { localAccountAllowed } from "../../../../../../lib/account/gate";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  if (!localAccountAllowed(request)) return new Response(null, { status: 404 });
  const { localBookShareDatabase, sqlBookSharePort } = await import("../../../../../../lib/book/shareLocalReview");
  const { loadBookShare } = await import("../../../../../../lib/book/shareServer");
  const db = await localBookShareDatabase(), shared = db ? await loadBookShare((await params).token, sqlBookSharePort(db)) : null;
  if (!shared) return new Response(null, { status: 404 });
  return (await import("../../../../../../lib/book/bookOg")).renderBookOg(shared.model);
}
