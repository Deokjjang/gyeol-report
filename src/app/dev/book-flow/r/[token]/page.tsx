import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { localAccountAllowed } from "../../../../../lib/account/gate";
import { SharedBookEntry } from "../../../../../components/book/SharedBookEntry";
import { bookShareMetadata } from "../../../../../lib/book/shareModel";
import { reportShareMetadata } from "../../../../../lib/sharing/reportShareMetadata";
export const dynamic = "force-dynamic";
async function load(token: string) {
  if (!localAccountAllowed(new Request("http://localhost/dev/book-flow", { headers: await headers() }))) return null;
  const { localBookShareDatabase, sqlBookSharePort } = await import("../../../../../lib/book/shareLocalReview");
  const { loadBookShare } = await import("../../../../../lib/book/shareServer");
  const db = await localBookShareDatabase();
  return db ? loadBookShare(token, sqlBookSharePort(db)) : null;
}
export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const shared = await load((await params).token);
  return shared ? bookShareMetadata(shared.model) : reportShareMetadata();
}
export default async function LocalSharedBook({ params, searchParams }: { params: Promise<{ token: string }>; searchParams?: Promise<{ref?: string}> }) {
  const shared = await load((await params).token); if (!shared) notFound();
  const { localReferralStore } = await import("../../../../../lib/referrals/localReview");
  const { referralPresentation } = await import("../../../../../lib/referrals/service");
  const { createLocalAccountPort } = await import("../../../../../lib/account/localReview");
  const { NextRequest } = await import("next/server");
  const auth = createLocalAccountPort(new NextRequest("http://127.0.0.1/dev/book-flow",{headers:await headers()})), store = await localReferralStore();
  const model = auth && store ? await referralPresentation(shared.model,(await searchParams)?.ref,auth,store) : shared.model;
  return <SharedBookEntry model={model} local />;
}
