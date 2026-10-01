import { notFound } from "next/navigation";
import { BookHomeRoute, BookFooterRoute } from "../../../components/book/BookRoutes";
export const dynamic = "force-dynamic";
export default function LocalBookHome() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <><BookHomeRoute internal /><BookFooterRoute /></>;
}
