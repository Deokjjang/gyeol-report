import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mirrorAppPath, mirrorRoutesEnabled } from "../../lib/mirror/gate";
import { ticketShopEnabled } from "../../lib/tickets/shopGate";
import { MeEntry } from "../../components/mirror/account/MeEntry";

// 새 내 계정(명령 3 D7). routes 관문(숨은 공개) 뒤 — 닫혀 있으면 404. 로그인만으로 열린다(아이디 · 질문지를 요구하지 않는다).
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "내 계정 · 결리포트", robots: { index: false, follow: false } };

export default function MePage() {
  if (!mirrorRoutesEnabled()) notFound();
  return <MeEntry appPath={mirrorAppPath()} ticketShop={ticketShopEnabled()} />;
}
