import { notFound } from "next/navigation";
import { accountPublicEnabled } from "../../lib/account/gate";
import { AccountScreen } from "../../components/account/AccountScreen";
export default function Page() { if (!accountPublicEnabled()) notFound(); return <AccountScreen />; }
