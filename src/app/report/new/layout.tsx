import type { ReactNode } from "react";
import { bookExperiencePublicEnabled } from "../../../lib/book/publicGate";
import { BookInputRoute } from "../../../components/book/BookRoutes";

export default function ReportInputLayout({ children }: { children: ReactNode }) {
  return bookExperiencePublicEnabled() ? <BookInputRoute /> : children;
}
