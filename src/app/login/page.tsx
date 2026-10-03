import { notFound } from "next/navigation";
import { accountPublicEnabled } from "../../lib/account/gate";
import { AccountScreen } from "../../components/account/AccountScreen";
export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) { if (!accountPublicEnabled()) notFound(); return <AccountScreen loginError={!!(await searchParams).error} />; }
