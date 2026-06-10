import Link from "next/link";

import ProductVisual from "../../../components/product/ProductVisual";
import { GYEOL_PRODUCTS } from "../../../lib/product/gyeolProducts";

const product = GYEOL_PRODUCTS[0];

const reportContents = [
  "사주 기본 구조",
  "일간·오행·십성 해석",
  "신살·귀인 참고 신호",
  "MBTI 자기보고 기반 성향 해석",
  "일·관계·자기관리 활용 방향",
] as const;

const inputItems = [
  "생년월일",
  "출생시간",
  "성별",
  "MBTI",
  "시간대",
] as const;

const cautions = [
  "본 리포트는 자기이해용 참고 콘텐츠입니다.",
  "의학, 법률, 투자, 심리진단, 미래 사건 예측을 보장하지 않습니다.",
  "입력 정보가 부정확하면 결과도 달라질 수 있습니다.",
] as const;

const refundSummaries = [
  "결제 승인 전 또는 리포트 생성 전에는 취소가 가능할 수 있습니다.",
  "결제 승인 후 리포트가 생성되어 열람 가능한 상태가 된 경우, 디지털 콘텐츠 제공이 개시된 것으로 보아 단순 변심 환불이 제한될 수 있습니다.",
  "중복 결제, 시스템 오류, 리포트 미제공 등은 확인 후 취소 또는 환불을 지원합니다.",
] as const;

export default function SajuMbtiFullProductPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8 lg:px-10">
      <article className="mx-auto max-w-5xl space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-sm font-medium text-neutral-400">상품명</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {product.nameKo}
            </h1>
            <p className="text-base leading-8 text-neutral-400">
              {product.summaryKo}
            </p>
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4">
                <p className="text-neutral-500">정가</p>
                <p className="mt-1 text-xl font-bold text-neutral-50">
                  {product.listPriceKo}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4">
                <p className="text-neutral-500">런칭가</p>
                <p className="mt-1 text-xl font-bold text-neutral-50">
                  {product.salePriceKo}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4">
                <p className="text-neutral-500">결제금액</p>
                <p className="mt-1 text-xl font-bold text-neutral-50">
                  {product.priceKo}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4">
                <p className="text-neutral-500">제공 방식</p>
                <p className="mt-1 font-semibold text-neutral-100">
                  {product.deliveryTypeKo}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4">
                <p className="text-neutral-500">형태</p>
                <p className="mt-1 font-semibold text-neutral-100">
                  {product.formatKo}
                </p>
              </div>
            </div>
          </div>
          <ProductVisual />
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <InfoSection title="리포트에 포함되는 내용" items={reportContents} />
          <InfoSection title="입력 정보" items={inputItems} />
        </section>

        <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/60 p-5">
          <h2 className="text-xl font-bold text-neutral-50">이용 전 확인사항</h2>
          <ul className="space-y-3 text-sm leading-6 text-neutral-300">
            {cautions.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/60 p-5">
          <h2 className="text-xl font-bold text-neutral-50">환불/취소 안내</h2>
          <ul className="space-y-3 text-sm leading-6 text-neutral-300">
            {refundSummaries.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/legal/refund"
            className="inline-flex text-sm font-semibold text-neutral-100 underline underline-offset-4"
          >
            환불/취소 정책 전문 보기
          </Link>
        </section>

        <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/60 p-5">
          <h2 className="text-xl font-bold text-neutral-50">개인정보 처리 안내</h2>
          <p className="text-sm leading-6 text-neutral-400">
            리포트 작성과 결제 처리에 필요한 정보만 수집하며, 자세한 처리 기준은
            개인정보처리방침에서 확인할 수 있습니다.
          </p>
          <nav aria-label="정책 및 사업자 링크" className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/legal/terms"
              className="text-neutral-300 underline underline-offset-4"
            >
              이용약관
            </Link>
            <Link
              href="/legal/privacy"
              className="text-neutral-300 underline underline-offset-4"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/legal/refund"
              className="text-neutral-300 underline underline-offset-4"
            >
              환불/취소 정책
            </Link>
            <Link
              href="/legal/business-info"
              className="text-neutral-300 underline underline-offset-4"
            >
              사업자 정보
            </Link>
          </nav>
        </section>

        <section className="rounded-lg border border-neutral-800 bg-neutral-50 p-5 text-neutral-950">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">구매 CTA</h2>
              <p className="text-sm leading-6 text-neutral-700">
                리포트 작성 화면에서 입력 정보를 작성한 뒤 결제창 테스트 흐름을 확인할 수 있습니다.
              </p>
            </div>
            <Link
              href="/report/new"
              className="inline-flex items-center justify-center rounded-lg bg-neutral-950 px-5 py-4 font-semibold text-neutral-50 transition hover:bg-neutral-800"
            >
              리포트 작성하기
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}

function InfoSection({
  title,
  items,
}: {
  readonly title: string;
  readonly items: readonly string[];
}) {
  return (
    <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/60 p-5">
      <h2 className="text-xl font-bold text-neutral-50">{title}</h2>
      <ul className="space-y-3 text-sm leading-6 text-neutral-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
