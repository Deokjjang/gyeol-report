import { notFound } from "next/navigation";
import { ReportStatusView } from "../../../components/report/ReportStatusView";

export const metadata = { title: "Status", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// P5 화면 검수 전용: 생성 대기 화면을 단계별로 고정해 연다(?stage=0~3). 개발 서버에서만.
export default async function UiStatusPage({ searchParams }: { searchParams?: Promise<{ stage?: string }> }) {
  if (process.env.NODE_ENV !== "development") notFound();
  const stage = Math.min(3, Math.max(0, Number((await searchParams)?.stage ?? 2) || 0));
  return <ReportStatusView state="preparing" stage={stage} />;
}
