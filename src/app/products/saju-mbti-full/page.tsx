import Link from "next/link";

import ProductVisual from "../../../components/product/ProductVisual";
import { GYEOL_BUSINESS_INFO } from "../../../lib/legal/businessInfo";
import { GYEOL_PRODUCTS } from "../../../lib/product/gyeolProducts";

const product = GYEOL_PRODUCTS[0];
const listPriceLabelKo = "정가 1,290원";
const salePriceLabelKo = "런칭가 990원";
const paymentPriceLabelKo = "결제금액 990원";

const reportContents = [
  "사주 기본 구조",
  "일간·오행·십성 해석",
  "신살·귀인 참고 신호",
  "MBTI 자기보고 기반 성향 해석",
  "일·관계·자기관리 활용 포인트",
] as const;

const inputItems = [
  "이름 또는 닉네임",
  "생년월일",
  "출생시간",
  "성별",
  "MBTI",
] as const;

const cautions = [
  "본 서비스는 사용자가 입력한 정보를 바탕으로 자동 생성되는 유료 디지털 리포트입니다.",
  "사람에 의한 1:1 상담 서비스가 아니며, 의료·법률·투자 자문을 제공하지 않습니다.",
  "결과물은 자기이해와 참고 목적의 정보입니다.",
] as const;

const refundSummaries = [
  "결제 후 생성 시작 전에는 취소 요청이 가능합니다.",
  "생성 시작 후 단순 변심 환불은 제한될 수 있습니다.",
  "시스템 장애, 중복결제, 결과 미제공 등은 확인 후 재생성 또는 환불을 지원합니다.",
] as const;

const productDetails = [
  ["상품명", product.fullNameKo],
  ["상품 유형", product.formatKo],
  ["제공 방식", product.deliveryTypeKo],
  ["생성 방식", "입력값 기반 자동 생성"],
  ["열람 방식", "결제 후 온라인 열람"],
  ["다운로드", "제공하지 않음, 온라인 열람 중심"],
  ["상담 여부", "사람 상담 아님"],
] as const;

const contactItems = [
  ["고객센터", GYEOL_BUSINESS_INFO.customerServicePhone],
  ["이메일", GYEOL_BUSINESS_INFO.supportContactEmail],
] as const;

export default function SajuMbtiFullProductPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-neutral-950 sm:px-8 lg:px-10">
      <article className="mx-auto max-w-5xl space-y-10">
        <section className="grid gap-7 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-bold text-emerald-700">상품명</p>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                {product.nameKo}
              </h1>
              <p className="text-base leading-8 text-neutral-600">
                {product.summaryKo}
              </p>
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-3">
              <PriceCard
                labelKo="정가"
                valueKo={product.listPriceKo}
                ariaLabel={listPriceLabelKo}
                subdued
              />
              <PriceCard
                labelKo="런칭가"
                valueKo={product.priceKo}
                ariaLabel={salePriceLabelKo}
                strong
              />
              <PriceCard
                labelKo="결제금액"
                valueKo={product.priceKo}
                ariaLabel={paymentPriceLabelKo}
              />
              <InfoCard labelKo="제공 방식" valueKo={product.deliveryTypeKo} />
              <InfoCard labelKo="형태" valueKo={product.formatKo} />
            </dl>

            <Link
              href="/report/new"
              className="inline-flex w-full items-center justify-center rounded-lg bg-neutral-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-neutral-800 sm:w-auto"
            >
              990원 결제하고 리포트 생성하기
            </Link>
          </div>
          <ProductVisual />
        </section>

        <section className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-950">상품 정보</h2>
          <dl className="grid gap-x-4 gap-y-3 text-sm leading-6 sm:grid-cols-[9rem_1fr]">
            {productDetails.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="font-semibold text-neutral-500">{label}</dt>
                <dd className="font-semibold text-neutral-900">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <InfoSection title="리포트에 포함되는 내용" items={reportContents} />
          <InfoSection title="입력 정보" items={inputItems} />
        </section>

        <section className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-950">이용 전 확인사항</h2>
          <ul className="space-y-3 text-sm leading-6 text-neutral-600">
            {cautions.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-950">환불/취소 안내</h2>
          <ul className="space-y-3 text-sm leading-6 text-neutral-600">
            {refundSummaries.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/legal/refund"
            className="inline-flex text-sm font-semibold text-neutral-900 underline underline-offset-4"
          >
            환불/취소 정책 전문 보기
          </Link>
        </section>

        <section className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-950">문의처</h2>
          <dl className="grid gap-x-4 gap-y-3 text-sm leading-6 sm:grid-cols-[7rem_1fr]">
            {contactItems.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="font-semibold text-neutral-500">{label}</dt>
                <dd className="font-semibold text-neutral-900">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-950">개인정보 처리 안내</h2>
          <p className="text-sm leading-6 text-neutral-600">
            리포트 작성과 결제 처리에 필요한 정보만 수집하며, 자세한 처리 기준은
            개인정보처리방침에서 확인할 수 있습니다.
          </p>
          <nav aria-label="정책 및 사업자 링크" className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/terms"
              className="text-neutral-800 underline underline-offset-4"
            >
              이용약관
            </Link>
            <Link
              href="/privacy"
              className="text-neutral-800 underline underline-offset-4"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/refund"
              className="text-neutral-800 underline underline-offset-4"
            >
              환불정책
            </Link>
            <Link
              href="/business"
              className="text-neutral-800 underline underline-offset-4"
            >
              사업자정보
            </Link>
          </nav>
        </section>

        <section className="rounded-lg border border-neutral-900 bg-neutral-950 p-5 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-bold">전체 리포트 시작</h2>
              <p className="text-sm leading-6 text-neutral-300">
                입력 정보를 작성한 뒤 결제를 완료하면 온라인에서 리포트를
                열람할 수 있습니다.
              </p>
            </div>
            <Link
              href="/report/new"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-4 text-sm font-bold text-neutral-950 transition hover:bg-neutral-100"
            >
              990원 결제하고 리포트 생성하기
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}

function PriceCard({
  labelKo,
  valueKo,
  ariaLabel,
  subdued = false,
  strong = false,
}: {
  readonly labelKo: string;
  readonly valueKo: string;
  readonly ariaLabel: string;
  readonly subdued?: boolean;
  readonly strong?: boolean;
}) {
  return (
    <div
      aria-label={ariaLabel}
      className={
        strong
          ? "rounded-lg border border-rose-200 bg-rose-50 p-4"
          : "rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
      }
    >
      <dt className={strong ? "text-rose-700" : "text-neutral-500"}>
        {labelKo}
      </dt>
      <dd
        className={
          strong
            ? "mt-1 text-2xl font-extrabold text-rose-700"
            : subdued
              ? "mt-1 text-xl font-bold text-neutral-400 line-through"
              : "mt-1 text-xl font-bold text-neutral-950"
        }
      >
        {valueKo}
      </dd>
    </div>
  );
}

function InfoCard({
  labelKo,
  valueKo,
}: {
  readonly labelKo: string;
  readonly valueKo: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <dt className="text-neutral-500">{labelKo}</dt>
      <dd className="mt-1 font-semibold text-neutral-950">{valueKo}</dd>
    </div>
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
    <section className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-neutral-950">{title}</h2>
      <ul className="space-y-3 text-sm leading-6 text-neutral-600">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
