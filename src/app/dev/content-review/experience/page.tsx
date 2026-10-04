import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { manualReviewAllowed } from "../gate";
export default async function Page() {
  if (!manualReviewAllowed(new Request("http://localhost/dev/content-review/experience", { headers: await headers() }))) notFound();
  const { Experience } = await import("./Experience");
  return <Experience />;
}
