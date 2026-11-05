import type { ReactNode } from "react";
import { bookExperiencePublicEnabled } from "../../lib/book/publicGate";
import { BookHomeRoute } from "../../components/book/BookRoutes";

/** 예전(v4) 상품 소개 화면은 6상품·90일 열람 안내가 남아 있어, 책 화면이 켜져 있으면 책 첫 화면을 보여 준다(최종3, 홈·입력 화면과 같은 방식). */
export default function ProductsLayout({ children }: { children: ReactNode }) {
  return bookExperiencePublicEnabled() ? <BookHomeRoute /> : children;
}
