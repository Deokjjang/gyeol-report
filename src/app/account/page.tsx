import { notFound } from "next/navigation";
import { accountPublicEnabled } from "../../lib/account/gate";
import { AccountScreen } from "../../components/account/AccountScreen";
import { ticketShopEnabled } from "../../lib/tickets/shopGate";
export default function Page() { if (!accountPublicEnabled()) notFound(); return <AccountScreen ticketShopEnabled={ticketShopEnabled()} />; }
