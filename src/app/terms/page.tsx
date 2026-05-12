import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-4">
          <p className="text-sm font-medium text-neutral-400">Gyeol Report</p>
          <h1 className="text-4xl font-bold tracking-tight">이용약관</h1>
          <p className="text-base leading-8 text-neutral-400">
            이 문서는 정식 출시 전 placeholder이며, 결제 기능 공개 전에 최종
            약관으로 정리될 예정입니다.
          </p>
        </header>

        <div className="rounded-2xl border border-amber-900/50 bg-amber-950/20 p-5">
          <p className="text-sm leading-6 text-amber-100/90">
            사전 안내용 초안입니다. 실제 유료 서비스 시작 전 상품 범위, 결제,
            환불, 고객지원 기준을 다시 확인해 공개합니다.
          </p>
        </div>

        <section className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-100">
              서비스 성격
            </h2>
            <p className="text-sm leading-7 text-neutral-400">
              결리포트는 사용자가 입력한 출생정보와 MBTI를 바탕으로 생성되는
              디지털 자기이해 리포트입니다. 리포트 내용은 자기이해를 돕기 위한
              참고자료로 제공합니다.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-100">
              사용자 입력
            </h2>
            <p className="text-sm leading-7 text-neutral-400">
              사용자는 리포트 생성을 위해 가능한 한 정확한 정보를 입력해야
              합니다. 입력값이 다르면 리포트 해석과 표시 내용도 달라질 수
              있습니다.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-100">
              유료 접근과 환불
            </h2>
            <p className="text-sm leading-7 text-neutral-400">
              유료 접근 범위와 환불 기준은 결제 기능 공개 전에 별도 안내로
              정리됩니다. 현재 페이지는 최종 약관이 아닙니다.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-100">문의</h2>
            <p className="text-sm leading-7 text-neutral-400">
              문의는{" "}
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
