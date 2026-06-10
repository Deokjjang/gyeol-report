export const dynamic = "force-dynamic";

type TossSuccessPageProps = {
  readonly searchParams: Promise<{
    readonly paymentKey?: string | string[];
    readonly orderId?: string | string[];
    readonly amount?: string | string[];
  }>;
};

function readQueryValue(value: string | string[] | undefined): string {
  const firstValue = Array.isArray(value) ? value[0] : value;

  return typeof firstValue === "string" ? firstValue.slice(0, 160) : "";
}

function renderValue(value: string): string {
  return value.trim().length > 0 ? value : "not provided";
}

export default async function TossPaymentSuccessPage({
  searchParams,
}: TossSuccessPageProps) {
  const query = await searchParams;
  const orderId = readQueryValue(query.orderId);
  const amount = readQueryValue(query.amount);
  const paymentKeyReceived = readQueryValue(query.paymentKey).trim().length > 0;

  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8">
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-500">
            Gyeol Report / 결리포트
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl">
            결제 승인 대기
          </h1>
        </div>

        <div className="space-y-5 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl shadow-black/30">
          <p className="text-base leading-7 text-neutral-300">
            Toss 결제 인증은 완료되었지만, 서버 승인 단계는 아직 연결되지
            않았습니다. 이 화면은 개발 검증용 임시 화면입니다.
          </p>

          <dl className="grid gap-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 text-sm">
            <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium text-neutral-500">orderId</dt>
              <dd className="break-words text-neutral-100">
                {renderValue(orderId)}
              </dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium text-neutral-500">amount</dt>
              <dd className="break-words text-neutral-100">
                {renderValue(amount)}
              </dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium text-neutral-500">
                paymentKeyReceived
              </dt>
              <dd className="text-neutral-100">
                {paymentKeyReceived ? "yes" : "no"}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
