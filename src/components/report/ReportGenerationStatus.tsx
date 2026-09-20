"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export function ReportGenerationStatus({ attention = false, paymentPending = false }: { readonly attention?: boolean; readonly paymentPending?: boolean }) {
  const router = useRouter();
  useEffect(() => {
    const timer = setInterval(() => { if (document.visibilityState === "visible") router.refresh(); }, 10000);
    return () => clearInterval(timer);
  }, [router]);
  return <section role="status" className="space-y-4 p-6">
    <h1 className="text-2xl font-bold">{paymentPending ? "결제 상태를 확인하고 있습니다" : "결제가 완료되었습니다"}</h1>
    <p>{paymentPending ? "확인이 끝나면 리포트 준비 화면으로 자동 이동합니다." : attention ? "리포트 준비가 지연되어 확인하고 있습니다. 결제 내역은 안전하게 보관되어 있습니다." : "리포트를 생성하고 있습니다. 완성된 결과만 제공해 드립니다."}</p>
    <p>이 페이지를 닫아도 처리는 계속됩니다. 같은 주소에서 다시 확인하실 수 있습니다.</p>
  </section>;
}
