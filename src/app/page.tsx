import Link from "next/link";

import ProductSummaryCard from "../components/product/ProductSummaryCard";
import { GYEOL_PRODUCTS } from "../lib/product/gyeolProducts";

const activeProduct = GYEOL_PRODUCTS[0];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8 lg:px-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="grid gap-6 pt-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-medium text-neutral-400">
                Gyeol Report
              </p>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                결리포트
              </h1>

              <p className="text-xl font-medium text-neutral-200">
                결리포트 소개
              </p>

              <p className="max-w-2xl text-base leading-8 text-neutral-400">
                생년월일과 MBTI를 바탕으로 사주 구조와 자기인식이 어디서
                겹치고 다르게 읽히는지 정리합니다. 해석은 현재의 성향과 선택
                패턴을 살피기 위한 자기이해용 참고 콘텐츠로 제공합니다.
              </p>
            </div>

            <Link
              href="/report/new"
              className="inline-flex w-full items-center justify-center rounded-lg bg-neutral-50 px-5 py-4 text-center font-semibold text-neutral-950 transition hover:bg-white sm:w-auto"
            >
              리포트 작성하기
            </Link>
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-5 shadow-2xl shadow-black/20">
            <p className="text-sm font-medium text-neutral-400">
              현재 구매 가능한 상품 1개
            </p>
            <p className="mt-2 text-2xl font-bold text-neutral-50">
              {activeProduct.nameKo}
            </p>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-neutral-800 pb-3">
                <dt className="text-neutral-500">가격</dt>
                <dd className="font-semibold text-neutral-100">
                  {activeProduct.priceKo}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-neutral-800 pb-3">
                <dt className="text-neutral-500">형태</dt>
                <dd className="font-semibold text-neutral-100">
                  {activeProduct.formatKo}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">제공 방식</dt>
                <dd className="text-right font-semibold text-neutral-100">
                  {activeProduct.deliveryTypeKo}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <ProductSummaryCard product={activeProduct} />

        <section className="grid gap-4 md:grid-cols-3" aria-label="리포트 포함 내용">
          {[
            "일주·오행·십성·신살을 바탕으로 한 사주 구조 해석",
            "MBTI 자기인식과 사주 신호의 겹침과 차이",
            "실제 선택과 관계에서 활용할 수 있는 정리 포인트",
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-5"
            >
              <p className="text-sm leading-6 text-neutral-300">{item}</p>
            </div>
          ))}
        </section>

        <section className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-5">
          <h2 className="text-sm font-semibold text-neutral-200">
            이용 전 안내
          </h2>
          <p className="mt-3 text-sm leading-6 text-neutral-500">
            {activeProduct.cautionKo}
          </p>
          <nav aria-label="정책 링크" className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link
              href="/products/saju-mbti-full"
              className="text-neutral-300 underline underline-offset-4"
            >
              상품 상세 보기
            </Link>
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
          </nav>
        </section>
      </section>
    </main>
  );
}
