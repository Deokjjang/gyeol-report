import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { localAccountAllowed } from "../../../../lib/account/gate";
import { MOCK_BUNDLE_POLICY } from "../../../../lib/tickets/shopContract";
import { TicketShop } from "../../../../components/account/TicketShop";
export const metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" as const };
export default async function Page() {
  if (!localAccountAllowed(new Request("http://localhost/dev/account/tickets", { headers: await headers() }))) notFound();
  return <TicketShop local policyVersion={MOCK_BUNDLE_POLICY} />;
}
