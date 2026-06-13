import Link from "next/link";
import type { ReactNode } from "react";

import { GYEOL_BUSINESS_INFO } from "../../lib/legal/businessInfo";
import {
  prePaymentRefundNoticeKo,
  refundPolicyRequiredNotices,
  refundPolicyStateRows,
  refundPolicySupportRequestGuidanceKo,
} from "../../lib/legal/refundPolicy";

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-4">
          <p className="text-sm font-medium text-neutral-400">결리포트 정책</p>
          <h1 className="text-4xl font-bold tracking-tight">환불정책</h1>
          <p className="text-base leading-8 text-neutral-400">
            사주×MBTI 종합 리포트는 입력값 기반 자동 생성 디지털
            리포트이며, 결제 후 온라인 열람 방식으로 제공됩니다. 사람 상담이
            아닌 자기이해와 참고 목적의 디지털 콘텐츠입니다.
          </p>
        </header>

        <dl className="grid gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-sm leading-7 text-neutral-300 sm:grid-cols-2">
          <PolicyFact labelKo="상품 유형" valueKo="자동 생성 디지털 리포트" />
          <PolicyFact labelKo="상품명" valueKo="사주×MBTI 종합 리포트" />
          <PolicyFact labelKo="실제 결제금액" valueKo="990원" />
          <PolicyFact labelKo="제공 방식" valueKo="결제 후 온라인 열람" />
          <PolicyFact labelKo="생성 방식" valueKo="입력값 기반 자동 생성" />
          <PolicyFact labelKo="상담 여부" valueKo="사람 상담 아님" />
        </dl>

        <section className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
          <h2 className="text-xl font-bold text-neutral-100">처리 기준</h2>
          <div className="overflow-hidden rounded-xl border border-neutral-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-neutral-950/70 text-neutral-200">
                <tr>
                  <th className="border-b border-neutral-800 px-4 py-3">
                    상태
                  </th>
                  <th className="border-b border-neutral-800 px-4 py-3">
                    권장 처리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-300">
                {refundPolicyStateRows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3 font-semibold text-neutral-100">
                      {row.statusKo}
                    </td>
                    <td className="px-4 py-3">{row.handlingKo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <PolicySection titleKo="환불 가능 시점">
            <p>{refundPolicyRequiredNotices[0]}</p>
          </PolicySection>
          <PolicySection titleKo="환불 제한 시점">
            <p>{refundPolicyRequiredNotices[1]}</p>
          </PolicySection>
          <PolicySection titleKo="장애·중복결제·결과 미제공 처리">
            <p>{refundPolicyRequiredNotices[2]}</p>
            <p>{refundPolicyRequiredNotices[3]}</p>
          </PolicySection>
          <PolicySection titleKo="입력값 오류 처리">
            <p>
              잘못된 입력값은 결제 전 확인 화면에서 수정할 수 있습니다. 생성
              시작 후 입력 오류로 인한 단순 재생성 또는 환불은 제한될 수
              있습니다.
            </p>
          </PolicySection>
          <PolicySection titleKo="미성년자 취소 안내">
            <p>{refundPolicyRequiredNotices[4]}</p>
          </PolicySection>
          <PolicySection titleKo="결제 직전 고지 기준">
            <p>{prePaymentRefundNoticeKo}</p>
          </PolicySection>
        </section>

        <section className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
          <h2 className="text-xl font-bold text-neutral-100">문의 방법</h2>
          <p className="text-sm leading-7 text-neutral-300">
            {refundPolicySupportRequestGuidanceKo}
          </p>
          <dl className="grid gap-3 text-sm text-neutral-300 sm:grid-cols-2">
            <PolicyFact
              labelKo="고객센터"
              valueKo={GYEOL_BUSINESS_INFO.customerServicePhone}
            />
            <PolicyFact
              labelKo="이메일"
              valueKo={GYEOL_BUSINESS_INFO.supportContactEmail}
            />
          </dl>
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

function PolicyFact({
  labelKo,
  valueKo,
}: {
  readonly labelKo: string;
  readonly valueKo: string;
}) {
  return (
    <div className="space-y-1 rounded-xl border border-neutral-800 bg-neutral-950/40 p-4">
      <dt className="text-xs font-semibold text-neutral-500">{labelKo}</dt>
      <dd className="font-bold text-neutral-100">{valueKo}</dd>
    </div>
  );
}

function PolicySection({
  titleKo,
  children,
}: {
  readonly titleKo: string;
  readonly children: ReactNode;
}) {
  return (
    <article className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
      <h2 className="text-lg font-bold text-neutral-100">{titleKo}</h2>
      <div className="space-y-2 text-sm leading-7 text-neutral-300">
        {children}
      </div>
    </article>
  );
}
