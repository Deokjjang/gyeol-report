import { notFound, redirect } from "next/navigation";
import { accountPublicEnabled } from "../../lib/account/gate";
import { accountMovedToMe } from "../../lib/mirror/gate";
import { AccountScreen } from "../../components/account/AccountScreen";
import { ticketShopEnabled } from "../../lib/tickets/shopGate";
export default function Page() {
  if (!accountPublicEnabled()) notFound();
  // 「남이 본 나」(명령 3): 정식 공개 + 서재 기능 대조 완료(ACCOUNT_MOVED_TO_ME)일 때만 새 내 계정으로 보낸다. 그 전에는 지금 서재 그대로.
  if (accountMovedToMe()) redirect("/me");
  return <AccountScreen ticketShopEnabled={ticketShopEnabled()} prefetchLibrary />;
}
