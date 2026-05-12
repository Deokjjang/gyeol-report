import Link from "next/link";

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-4">
          <p className="text-sm font-medium text-neutral-400">Gyeol Report</p>
          <h1 className="text-4xl font-bold tracking-tight">환불 안내</h1>
          <p className="text-base leading-8 text-neutral-400">
            이 문서는 정식 출시 전 placeholder이며, 실제 결제 기능 공개 전에
            환불과 실패 처리 기준을 다시 정리할 예정입니다.
          </p>
        </header>

        <div className="rounded-2xl border border-amber-900/50 bg-amber-950/20 p-5">
          <p className="text-sm leading-6 text-amber-100/90">
            현재 결제 기능은 활성화되어 있지 않습니다. 유료 출시 전 결제 실패,
            환불, 고객지원 절차를 별도 안내로 공개합니다.
          </p>
        </div>

        <section className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-100">
              결제 실패
            </h2>
            <p className="text-sm leading-7 text-neutral-400">
              결제가 실패하거나 취소된 경우 유료 리포트 접근은 열리지 않는
              방식으로 설계합니다. 사용자는 다시 시도하거나 고객지원으로 문의할
              수 있어야 합니다.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-100">
              리포트 생성 실패
            </h2>
            <p className="text-sm leading-7 text-neutral-400">
              결제는 완료되었지만 리포트 생성이 실패한 경우 고객지원 또는 환불
              경로를 제공하는 방향으로 준비합니다.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-100">
              환불 처리
            </h2>
            <p className="text-sm leading-7 text-neutral-400">
              유료 출시 전 환불 기준, 처리 기간, 확인 절차를 정리해 공개합니다.
              V1에서는 고객지원 기반의 수동 처리 절차를 우선 검토합니다.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-100">문의</h2>
            <p className="text-sm leading-7 text-neutral-400">
              환불 관련 문의는{" "}
              <a
                href="mailto:official@dvem.ai"
                className="text-neutral-200 underline underline-offset-4"
              >
                official@dvem.ai
              </a>
              로 보내 주세요.
            </p>
          </div>
        </section>

        <Link
          href="/"
          className="inline-flex rounded-xl border border-neutral-800 px-4 py-3 text-sm font-semibold text-neutral-200"
        >
          홈으로 돌아가기
        </Link>
      </section>
    </main>
  );
}
