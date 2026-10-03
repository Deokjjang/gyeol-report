import { notFound } from "next/navigation";
import { accountPublicEnabled } from "../../lib/account/gate";
import { AccountScreen } from "../../components/account/AccountScreen";
import { safeAccountNext } from "../../lib/account/policy";
export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) { if (!accountPublicEnabled()) notFound(); const query = await searchParams; return <AccountScreen loginError={!!query.error} next={safeAccountNext(query.next)} />; }
