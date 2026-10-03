import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function LocalBookReport({ params }: { params: Promise<{ reportId: string }> }) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { readLocalBook } = await import("../../../../../lib/book/localReview");
  const { reportId } = await params;
  let snapshot = await readLocalBook(reportId);
  if (!snapshot) {
    const { headers } = await import("next/headers");
    const { NextRequest } = await import("next/server");
    const { createLocalAccountPort } = await import("../../../../../lib/account/localReview");
    const { localTicketStore } = await import("../../../../../lib/tickets/localDatabase");
    const { readPublishedReport } = await import("../../../../../lib/payment/paidReportReliability");
    const { validateBookPublication } = await import("../../../../../lib/book/storedReport");
    const auth = createLocalAccountPort(new NextRequest("http://127.0.0.1/dev/account", { headers: await headers() }));
    const user = await auth?.currentUser(), store = await localTicketStore();
    if (user && store) {
      const read = await readPublishedReport({ call: async action => action === "read_report" ? store.call("read", user.id, { reportId }) : { ok: false } }, reportId, validateBookPublication);
      if (read.ok && read.status === "COMPLETED") snapshot = read.snapshot;
    }
    if (!snapshot) {
      const { cookies } = await import("next/headers");
      const { LOCAL_COUPON_COOKIE, localCouponIdentity } = await import("../../../../../lib/coupons/handler");
      const { readLocalCouponReport } = await import("../../../../../lib/coupons/localDatabase");
      const secret = (await cookies()).get(LOCAL_COUPON_COOKIE)?.value;
      if (user || secret) snapshot = await readLocalCouponReport(localCouponIdentity(user?.id ?? null, secret ?? ""), reportId);
      if (!snapshot && user && secret) snapshot = await readLocalCouponReport(localCouponIdentity(null, secret), reportId);
    }
  }
  if (!snapshot) return <p>로컬 검수 책을 찾을 수 없습니다. 서버를 다시 시작하면 검수 데이터가 사라집니다.</p>;
  const { StoredBookReport } = await import("../../../../../lib/book/storedReport");
  return <StoredBookReport snapshot={snapshot} home="/dev/book-flow" saveToLibrary={{ reportId, local: true }} />;
}
