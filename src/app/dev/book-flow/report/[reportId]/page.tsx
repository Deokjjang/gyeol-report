import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function LocalBookReport({ params }: { params: Promise<{ reportId: string }> }) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { readLocalBook } = await import("../../../../../lib/book/localReview");
  const snapshot = await readLocalBook((await params).reportId);
  if (!snapshot) return <p>로컬 검수 책을 찾을 수 없습니다. 서버를 다시 시작하면 검수 데이터가 사라집니다.</p>;
  const { StoredBookReport } = await import("../../../../../lib/book/storedReport");
  return <StoredBookReport snapshot={snapshot} home="/dev/book-flow" />;
}
