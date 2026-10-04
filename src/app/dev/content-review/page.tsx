import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { manualReviewAllowed } from "./gate";
export default async function Page() {
  if (!manualReviewAllowed(new Request("http://localhost/dev/content-review", { headers: await headers() }))) notFound();
  const { ManualReview } = await import("./ManualReview");
  return <ManualReview now={new Date().toISOString()} />;
}
