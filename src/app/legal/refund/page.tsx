import LegalPageLayout from "../../../components/legal/LegalPageLayout";
import { GYEOL_BUSINESS_INFO } from "../../../lib/legal/businessInfo";
import {
  prePaymentRefundNoticeKo,
  refundPolicyRequiredNotices,
  refundPolicyStateRows,
  refundPolicySupportRequestGuidanceKo,
} from "../../../lib/legal/refundPolicy";

const productFacts = [
  ["상품 유형", "자동 생성 디지털 리포트"],
  ["상품명", "사주×MBTI 종합 리포트"],
  ["실제 결제금액", "990원"],
  ["제공 방식", "결제 후 온라인 열람"],
  ["생성 방식", "입력값 기반 자동 생성"],
  ["상담 여부", "사람 상담 아님"],
] as const;

export default function LegalRefundPage() {
  return (
    <LegalPageLayout
      titleKo="환불정책"
      descriptionKo="자동 생성 디지털 리포트의 취소, 환불, 재생성, 고객센터 처리 기준입니다."
    >
      <section className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <h2 className="text-xl font-bold text-neutral-100">상품 유형</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          {productFacts.map(([labelKo, valueKo]) => (
            <div
              key={labelKo}
              className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4"
            >
              <dt className="text-xs font-semibold text-neutral-500">
                {labelKo}
              </dt>
              <dd className="mt-1 font-bold text-neutral-100">{valueKo}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <h2 className="text-xl font-bold text-neutral-100">처리 기준</h2>
        <div className="space-y-3 text-sm leading-7 text-neutral-300">
          {refundPolicyStateRows.map((row) => (
            <article
              key={row.id}
              className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4"
            >
              <h3 className="font-bold text-neutral-100">{row.statusKo}</h3>
              <p>{row.handlingKo}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <h2 className="text-xl font-bold text-neutral-100">상세 안내</h2>
        <article className="space-y-2">
          <h3 className="text-lg font-semibold text-neutral-100">
            환불 가능 시점
          </h3>
          <p className="text-sm leading-7 text-neutral-400">
            {refundPolicyRequiredNotices[0]}
          </p>
        </article>
        <article className="space-y-2">
          <h3 className="text-lg font-semibold text-neutral-100">
            환불 제한 시점
          </h3>
          <p className="text-sm leading-7 text-neutral-400">
            {refundPolicyRequiredNotices[1]}
          </p>
        </article>
        <article className="space-y-2">
          <h3 className="text-lg font-semibold text-neutral-100">
            장애·중복결제·결과 미제공 처리
          </h3>
          <p className="text-sm leading-7 text-neutral-400">
            {refundPolicyRequiredNotices[2]}
          </p>
          <p className="text-sm leading-7 text-neutral-400">
            {refundPolicyRequiredNotices[3]}
          </p>
        </article>
        <article className="space-y-2">
          <h3 className="text-lg font-semibold text-neutral-100">
            입력값 오류 처리
          </h3>
          <p className="text-sm leading-7 text-neutral-400">
            잘못된 입력값은 결제 전 확인 화면에서 수정할 수 있습니다. 생성
            시작 후 입력 오류로 인한 단순 재생성 또는 환불은 제한될 수
            있습니다.
          </p>
        </article>
        <article className="space-y-2">
          <h3 className="text-lg font-semibold text-neutral-100">
            미성년자 취소 안내
          </h3>
          <p className="text-sm leading-7 text-neutral-400">
            {refundPolicyRequiredNotices[4]}
          </p>
        </article>
        <article className="space-y-2">
          <h3 className="text-lg font-semibold text-neutral-100">
            결제 직전 고지 기준
          </h3>
          <p className="text-sm leading-7 text-neutral-400">
            {prePaymentRefundNoticeKo}
          </p>
        </article>
      </section>

      <section className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <h2 className="text-xl font-bold text-neutral-100">문의 방법</h2>
        <p className="text-sm leading-7 text-neutral-400">
          {refundPolicySupportRequestGuidanceKo}
        </p>
        <dl className="grid gap-3 text-sm text-neutral-300 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-neutral-100">고객센터</dt>
            <dd>{GYEOL_BUSINESS_INFO.customerServicePhone}</dd>
          </div>
          <div>
            <dt className="font-semibold text-neutral-100">이메일</dt>
            <dd>{GYEOL_BUSINESS_INFO.supportContactEmail}</dd>
          </div>
        </dl>
      </section>
    </LegalPageLayout>
  );
}
