import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { localAccountAllowed } from "../../../lib/account/gate";
import { AccountScreen } from "../../../components/account/AccountScreen";
export const metadata = { robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const h = await headers();
  if (!localAccountAllowed(new Request("http://localhost/dev/account", { headers: h }))) notFound();
  return <AccountScreen local loginError={!!(await searchParams).error} />;
}
