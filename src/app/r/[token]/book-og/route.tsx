import { bookExperiencePublicEnabled } from "../../../../lib/book/publicGate";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  if (!bookExperiencePublicEnabled()) return new Response(null, { status: 404 });
  const { loadBookShare } = await import("../../../../lib/book/shareServer");
  const shared = await loadBookShare((await params).token);
  if (!shared) return new Response(null, { status: 404 });
  return (await import("../../../../lib/book/bookOg")).renderBookOg(shared.model);
}
