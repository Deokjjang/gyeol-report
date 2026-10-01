import { notFound } from "next/navigation";
import { BookInputRoute } from "../../../../components/book/BookRoutes";
export const dynamic = "force-dynamic";
export default function LocalBookInput() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <BookInputRoute internal />;
}
