import { notFound } from "next/navigation";

export const metadata = { title: "Book preview", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function BookPreviewPage() {
  // Fail closed, including next start. No query/cookie/env feature flag enables this.
  if (process.env.NODE_ENV !== "development") notFound();
  const { default: BookPreview } = await import("./BookPreview");
  return <BookPreview />;
}
