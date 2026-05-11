export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-neutral-50">
      <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-medium text-neutral-400">
            Gyeol Report
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            결리포트
          </h1>

          <p className="text-xl font-medium text-neutral-200">
            사주와 MBTI로 읽는 나의 결
          </p>

          <p className="leading-7 text-neutral-400">
            생년월일과 MBTI를 바탕으로, 사주 구조와 자기인식이 어디서 겹치고 어긋나는지 읽어주는 자기서사 리포트입니다.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-400">출시 이벤트가</p>
          <p className="mt-1 text-3xl font-bold">990원</p>
          <p className="mt-2 text-sm text-neutral-500">정가 1,290원</p>
        </div>

        <a
          href="/report/new"
          className="rounded-xl bg-neutral-50 px-5 py-4 text-center font-semibold text-neutral-950"
        >
          무료 미리보기 만들기
        </a>

        <p className="text-xs leading-6 text-neutral-500">
          본 리포트는 자기이해를 돕기 위한 참고 콘텐츠이며, 의료·투자·법률·관계 선택에 대한 전문 판단이나 미래 사건 예측을 제공하지 않습니다.
        </p>
      </section>
    </main>
  );
}
