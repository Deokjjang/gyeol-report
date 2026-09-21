import { ReportStatusView } from "../../../components/report/ReportStatusView";

export default function ReportResultLoading() {
  return <ReportStatusView state="payment-check" title="리포트를 확인하고 있습니다" message="잠시만 기다려 주세요." />;
}
