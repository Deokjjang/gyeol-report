import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-4">
          <p className="text-sm font-medium text-neutral-400">Gyeol Report</p>
          <h1 className="text-4xl font-bold tracking-tight">
            개인정보 처리방침
          </h1>
          <p className="text-base leading-8 text-neutral-400">
            이 문서는 출시 전 초안입니다. 실제 저장과 결제 기능 공개 전에 처리
            기준을 다시 정리할 예정입니다.
          </p>
        </header>

        <div className="rounded-2xl border border-amber-900/50 bg-amber-950/20 p-5">
          <p className="text-sm leading-6 text-amber-100/90">
            사전 안내용 초안입니다. 수집 항목, 보관 기간, 삭제 요청 절차는
            정식 출시 전에 다시 확인해 공개합니다.
          </p>
        </div>

        <section className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-100">
              처리할 수 있는 입력값
            </h2>
            <p className="text-sm leading-7 text-neutral-400">
              입력 데이터에는 생년월일, 태어난 시간, 양력/음력, 선택 입력인
              성별과 MBTI가 포함될 수 있습니다. 출생시간 확인 여부와 시간대도
              리포트 생성을 위해 사용될 수 있습니다.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-100">
              이용 목적
            </h2>
            <p className="text-sm leading-7 text-neutral-400">
              입력값은 리포트를 생성하고 사용자에게 결과를 제공하기 위해
              사용됩니다. 유료 기능이 추가되면 리포트 접근 상태 확인에도 일부
              정보가 사용될 수 있습니다.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-100">
              결제 정보
            </h2>
            <p className="text-sm leading-7 text-neutral-400">
              결제 기능이 공개되면 카드 정보 등 민감 결제 정보는 결제 제공자가
              처리하도록 설계합니다. 앱은 카드 상세 정보를 저장하지 않는
              방향으로 준비합니다.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-100">
              보관과 삭제
            </h2>
            <p className="text-sm leading-7 text-neutral-400">
              보관 기간과 삭제 요청 절차는 정식 출시 전에 확정해 안내합니다.
              삭제 문의는 support contact를 통해 접수할 수 있도록 준비합니다.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-100">문의</h2>
            <p className="text-sm leading-7 text-neutral-400">
              개인정보 관련 문의는{" "}
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
