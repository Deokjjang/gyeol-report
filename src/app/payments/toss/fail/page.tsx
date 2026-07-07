export const dynamic = "force-dynamic";

type TossFailPageProps = {
  readonly searchParams: Promise<{
    readonly code?: string | string[];
    readonly message?: string | string[];
    readonly orderId?: string | string[];
  }>;
};

function readQueryValue(value: string | string[] | undefined): string {
  const firstValue = Array.isArray(value) ? value[0] : value;

  return typeof firstValue === "string" ? firstValue.slice(0, 240) : "";
}

function renderValue(value: string): string {
  return value.trim().length > 0 ? value : "not provided";
}

export default async function TossPaymentFailPage({
  searchParams,
}: TossFailPageProps) {
  const query = await searchParams;
  const code = readQueryValue(query.code);
  const message = readQueryValue(query.message);
  const orderId = readQueryValue(query.orderId);

  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8">
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-500">
            Gyeol Report / 결리포트
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl">
            결제 실패 또는 취소
          </h1>
        </div>

        <div className="space-y-5 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl shadow-black/30">
          <p className="text-base leading-7 text-neutral-300">
            Toss 결제창에서 실패 또는 취소로 돌아온 상태입니다. 입력 화면에서
            다시 시도하거나 고객센터로 문의해 주세요.
          </p>

          <dl className="grid gap-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 text-sm">
            <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium text-neutral-500">code</dt>
              <dd className="break-words text-neutral-100">
                {renderValue(code)}
              </dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium text-neutral-500">message</dt>
              <dd className="break-words text-neutral-100">
                {renderValue(message)}
              </dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium text-neutral-500">orderId</dt>
              <dd className="break-words text-neutral-100">
                {renderValue(orderId)}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
