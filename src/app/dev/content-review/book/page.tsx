import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { manualReviewAllowed } from "../gate";
import { CASES, generationIdValid } from "../model";
export default async function Page({ searchParams }: { searchParams: Promise<{ case?: string; generation?: string }> }) {
  if (!manualReviewAllowed(new Request("http://localhost/dev/content-review/book", { headers: await headers() }))) notFound();
  const query = await searchParams;
  if (!CASES.some(c => c.id === query.case) || !generationIdValid(query.generation)) notFound();
  const { ReviewBook } = await import("../ReviewBook");
  return <ReviewBook caseId={query.case!} generationId={query.generation} />;
}
