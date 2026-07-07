import Link from "next/link";

import GyeolBrandHeader from "../components/brand/GyeolBrandHeader";
import ProductGrid from "../components/product/ProductGrid";
import {
  GYEOL_HOME_PRODUCT_GRID,
  GYEOL_PRODUCTS,
} from "../lib/product/gyeolProducts";

const activeComprehensiveProduct = GYEOL_PRODUCTS[0];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4efe7] px-5 py-8 text-[#201a18] sm:px-8 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-10">
        <GyeolBrandHeader taglineKo="사주와 MBTI를 함께 읽는 자기이해 리포트" />

        <header className="motion-safe:animate-[gyeol-reveal_520ms_ease-out_both] space-y-7 rounded-lg border border-[#d8d1c4] bg-[#fffdf8] p-5 shadow-[0_22px_80px_rgba(40,24,28,0.10)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-5">
              <p className="text-sm font-extrabold text-[#7f1d38]">
                지금 구매 가능한 리포트
              </p>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-extrabold tracking-normal text-[#201a18] sm:text-5xl">
                  사주×MBTI 종합 리포트
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[#5d5149] sm:text-base">
                  입력한 생년월일과 MBTI를 바탕으로 명리 구조와 행동 패턴을
                  함께 읽습니다. 모든 리포트는 1,290원이며 결제 후 온라인에서
                  생성·열람하는 자동 생성 디지털 콘텐츠입니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-[#4c433c]">
                <span className="rounded-full border border-[#d8d1c4] bg-[#f4efe7] px-3 py-1">
                  자동 생성 디지털 리포트
                </span>
                <span className="rounded-full border border-[#d8d1c4] bg-[#f4efe7] px-3 py-1">
                  명리 기반
                </span>
                <span className="rounded-full border border-[#d8d1c4] bg-[#f4efe7] px-3 py-1">
                  MBTI 정밀 DB 반영
                </span>
                <span className="rounded-full border border-[#d8d1c4] bg-[#f4efe7] px-3 py-1">
                  상담이 아닌 참고용 리포트
                </span>
              </div>
              <Link
                href="/report/new?product=saju-mbti-full"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#7f1d38] px-5 py-3 text-sm font-extrabold text-[#fffdf8] shadow-[0_12px_28px_rgba(127,29,56,0.20)] transition duration-200 hover:bg-[#8f2543] active:scale-[0.98]"
              >
                1,290원 결제하고 리포트 생성하기
              </Link>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-lg border border-[#7f1d38]/20 bg-[#7f1d38]/10 p-4">
                <dt className="font-semibold text-[#7f1d38]">판매가</dt>
                <dd className="mt-1 text-2xl font-extrabold text-[#7f1d38]">
                  1,290원
                </dd>
              </div>
              <div className="rounded-lg border border-[#d8d1c4] bg-[#f4efe7] p-4">
                <dt className="font-semibold text-[#7b7165]">열람 기간</dt>
                <dd className="mt-1 font-bold text-[#201a18]">
                  90일 온라인 열람
                </dd>
              </div>
              <div className="rounded-lg border border-[#d8d1c4] bg-[#f4efe7] p-4">
                <dt className="font-semibold text-[#7b7165]">제공 방식</dt>
                <dd className="mt-1 font-bold text-[#201a18]">
                  결제 후 온라인 열람
                </dd>
              </div>
              <div className="rounded-lg border border-[#d8d1c4] bg-[#f4efe7] p-4">
                <dt className="font-semibold text-[#7b7165]">구매 상태</dt>
                <dd className="mt-1 font-bold text-[#201a18]">
                  사주×MBTI 종합 리포트 구매 가능
                </dd>
              </div>
            </dl>
          </div>
        </header>

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold text-[#7f1d38]">상품 선택</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-normal text-[#201a18]">
                결리포트 리포트
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[#6f675d]">
              6개 리포트 모두 결제 후 온라인에서 자동 생성되며, 생성일로부터
              90일간 열람할 수 있습니다.
            </p>
          </div>
          <ProductGrid products={GYEOL_HOME_PRODUCT_GRID} />
        </section>
      </section>
    </main>
  );
}
