import { notFound } from "next/navigation";

export const metadata = { title: "Book preview", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function BookPreviewPage({ searchParams }: { searchParams?: Promise<{ fixture?: string; book?: string; read?: string }> }) {
  // Fail closed, including next start. No query/cookie/env feature flag enables this.
  if (process.env.NODE_ENV !== "development") notFound();
  const { default: BookPreview } = await import("./BookPreview");
  const { loadBookLibrary } = await import("./runtimeBooks");
  const query = await searchParams ?? {};
  const library = await loadBookLibrary(query.fixture);
  if (!library) return <p role="alert">검수용 책 데이터를 준비하지 못했습니다. 입력 계약을 확인해 주세요.</p>;
  return <BookPreview key={`${library.selected}:${query.book ?? ""}`} library={library} initialBook={query.book} initialRead={query.read === "1"} />;
}
