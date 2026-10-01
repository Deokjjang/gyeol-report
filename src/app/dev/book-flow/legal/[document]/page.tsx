import { notFound } from "next/navigation";
import { BookLegalRoute, BookFooterRoute } from "../../../../../components/book/BookRoutes";
export default async function LocalBookLegal({ params }: { params: Promise<{ document: string }> }) {
  if (process.env.NODE_ENV !== "development") notFound();
  const index = ["terms", "privacy", "refund", "business"].indexOf((await params).document);
  if (index < 0) notFound();
  return <><BookLegalRoute index={index} /><BookFooterRoute /></>;
}
