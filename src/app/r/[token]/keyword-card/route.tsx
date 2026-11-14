import { bookExperiencePublicEnabled } from "../../../../lib/book/publicGate";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** AM 2부 세운 키워드 카드 이미지. 공유 링크(토큰)로만 열린다. ?name=1이면 이름을 넣는다(기본 끔). */
export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  if (!bookExperiencePublicEnabled()) return new Response(null, { status: 404 });
  const { loadBookShare } = await import("../../../../lib/book/shareServer");
  const shared = await loadBookShare((await params).token);
  const d = shared?.snapshot.productVersion === "v5" ? (shared.snapshot.draft as unknown as { annual?: { year: number; keywords: string[] }; coverLine?: string; coreImage?: { line: string } }) : null;
  if (!shared || !d?.annual?.keywords?.length) return new Response(null, { status: 404 });
  const withName = new URL(request.url).searchParams.get("name") === "1";
  return (await import("../../../../lib/book/keywordCard")).renderKeywordCard({ year: d.annual.year, keywords: d.annual.keywords, line: d.coverLine ?? d.coreImage?.line ?? "", name: withName ? shared.model.displayName : null });
}
