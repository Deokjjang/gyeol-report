import { notFound } from "next/navigation";
import { ticketShopEnabled } from "../../../lib/tickets/shopGate";
import { BUNDLE_PURCHASE_POLICY_VERSION } from "../../../lib/tickets/shopContract";
import { TicketShop } from "../../../components/account/TicketShop";
export const dynamic = "force-dynamic";
export const metadata = { title: "내 이용권", robots: { index: false, follow: false }, referrer: "no-referrer" as const };
export default function Page() {
  if (!ticketShopEnabled()) notFound();
  return <TicketShop policyVersion={BUNDLE_PURCHASE_POLICY_VERSION} />;
}
