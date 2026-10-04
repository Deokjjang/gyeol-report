import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { manualReviewAllowed } from "./gate";
export const metadata = { title: "V4 LOCAL REVIEW", robots: { index: false, follow: false }, referrer: "no-referrer" as const };
export const dynamic = "force-dynamic";
export default async function Layout({ children }: { children: React.ReactNode }) {
  if (!manualReviewAllowed(new Request("http://localhost/dev/content-review", { headers: await headers() }))) notFound();
  return children;
}
