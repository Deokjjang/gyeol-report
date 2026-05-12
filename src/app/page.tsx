export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8 lg:px-10">
      <section className="mx-auto flex min-h-[78vh] max-w-5xl flex-col justify-center gap-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-medium text-neutral-400">
                Gyeol Report
              </p>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                결리포트
              </h1>

              <p className="text-xl font-medium text-neutral-200">
                사주와 MBTI를 함께 보며 자기이해를 돕는 리포트
              </p>

              <p className="max-w-2xl text-base leading-8 text-neutral-400">
                생년월일과 MBTI를 바탕으로 사주 구조와 자기인식이 어디서
                겹치고 다르게 읽히는지 정리합니다. 해석은 현재의 성향과 선택
                패턴을 살피기 위한 참고자료로 제공합니다.
              </p>
            </div>

            <a
              href="/report/new"
              className="inline-flex w-full items-center justify-center rounded-xl bg-neutral-50 px-5 py-4 text-center font-semibold text-neutral-950 transition hover:bg-white sm:w-auto"
            >
              샘플 리포트 생성하기
            </a>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 shadow-2xl shadow-black/20">
            <p className="text-sm font-medium text-neutral-400">
              정식 출시 준비 중
            </p>
            <p className="mt-2 text-2xl font-bold text-neutral-50">
              현재는 샘플 리포트 미리보기로 제공됩니다.
            </p>
            <p className="mt-3 text-sm leading-6 text-neutral-400">
              결제 기능은 아직 연결되어 있지 않으며, 리포트 생성 흐름과 출력
              품질을 먼저 확인할 수 있습니다.
            </p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            "일주·오행·십성·신살을 바탕으로 한 사주 구조 해석",
            "MBTI 자기인식과 사주 신호의 겹침과 차이",
            "실제 선택과 관계에서 활용할 수 있는 정리 포인트",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5"
            >
              <p className="text-sm leading-6 text-neutral-300">{item}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
          <h2 className="text-sm font-semibold text-neutral-200">안내</h2>
          <div className="mt-3 space-y-2 text-sm leading-6 text-neutral-500">
            <p>본 서비스는 자기이해를 돕기 위한 참고 콘텐츠입니다.</p>
            <p>
              문의:{" "}
              <a
                href="mailto:official@dvem.ai"
                className="text-neutral-300 underline underline-offset-4"
              >
                official@dvem.ai
              </a>
            </p>
            <p>이용약관·개인정보 처리방침은 정식 출시 전 공개 예정입니다.</p>
          </div>
        </section>
      </section>
    </main>
  );
}
