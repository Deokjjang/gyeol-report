import { notFound } from "next/navigation";
import { ticketShopEnabled } from "../../../../../lib/tickets/shopGate";
import { TicketShop } from "../../../../../components/account/TicketShop";
export const dynamic = "force-dynamic";
export const metadata = { title: "이용권 구매 확인", robots: { index: false, follow: false }, referrer: "no-referrer" as const };
export default async function Page({ params }: { params: Promise<{ result: string }> }) {
  if (!ticketShopEnabled()) notFound();
  if (!["success", "fail"].includes((await params).result)) notFound();
  return <TicketShop callback />;
}
