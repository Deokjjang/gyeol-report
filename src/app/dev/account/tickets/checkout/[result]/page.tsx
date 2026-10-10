import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { localAccountAllowed } from "../../../../../../lib/account/gate";
import { TicketShop } from "../../../../../../components/account/TicketShop";
export const metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" as const };
export default async function Page({ params }: { params: Promise<{ result: string }> }) {
  if (!localAccountAllowed(new Request("http://localhost/dev/account/tickets", { headers: await headers() }))) notFound();
  if (!["success", "fail"].includes((await params).result)) notFound();
  return <TicketShop local callback />;
}
