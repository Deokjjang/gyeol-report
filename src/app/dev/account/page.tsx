import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { localAccountAllowed } from "../../../lib/account/gate";
import { AccountScreen } from "../../../components/account/AccountScreen";
import { safeAccountNext } from "../../../lib/account/policy";
export const metadata = { robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const h = await headers();
  if (!localAccountAllowed(new Request("http://localhost/dev/account", { headers: h }))) notFound();
  const query = await searchParams;
  return <AccountScreen local loginError={!!query.error} next={safeAccountNext(query.next, true)} />;
}
