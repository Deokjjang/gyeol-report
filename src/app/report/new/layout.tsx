import type { ReactNode } from "react";
import { bookExperiencePublicEnabled } from "../../../lib/book/publicGate";
import { BookInputRoute } from "../../../components/book/BookRoutes";

/** AM: 판매 상태(대운·세운 시각 관문)가 정적 화면에 굳지 않게 60초마다 다시 그린다(ops/config FORTUNE_SALES_OPEN_AT). */
export const revalidate = 60;

export default function ReportInputLayout({ children }: { children: ReactNode }) {
  return bookExperiencePublicEnabled() ? <BookInputRoute /> : children;
}
