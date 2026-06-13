import Link from "next/link";
import type { ReactNode } from "react";

import { GYEOL_BUSINESS_INFO } from "../../lib/legal/businessInfo";
import {
  privacyPolicyCollectionItems,
  privacyPolicyExternalServiceRows,
  privacyPolicyLegalRetentionKo,
  privacyPolicyMinorNoticeKo,
  privacyPolicyNoResidentRegistrationNumberKo,
  privacyPolicyOverseasProcessingKo,
  privacyPolicyProcessingScopeKo,
  privacyPolicyPurposeItems,
  privacyPolicyRetentionRows,
  privacyPolicySensitiveInfoLimitKo,
  privacyPolicyServiceRetentionKo,
  privacyPolicyUnder14Ko,
  privacyPolicyUserRightsKo,
} from "../../lib/legal/privacyPolicy";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-4">
          <p className="text-sm font-medium text-neutral-400">결리포트 정책</p>
          <h1 className="text-4xl font-bold tracking-tight">
            개인정보처리방침
          </h1>
          <p className="text-base leading-8 text-neutral-400">
            {privacyPolicyProcessingScopeKo}
          </p>
        </header>

        <PolicySection titleKo="수집하는 개인정보 항목">
          <ul className="grid gap-2 sm:grid-cols-2">
            {privacyPolicyCollectionItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </PolicySection>

        <PolicySection titleKo="수집·이용 목적">
          <ul className="grid gap-2 sm:grid-cols-2">
            {privacyPolicyPurposeItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </PolicySection>

        <PolicySection titleKo="보유 및 이용기간">
          <p>{privacyPolicyServiceRetentionKo}</p>
          <p>{privacyPolicyLegalRetentionKo}</p>
          <div className="overflow-hidden rounded-xl border border-neutral-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-neutral-950/70 text-neutral-200">
                <tr>
                  <th className="border-b border-neutral-800 px-4 py-3">
                    구분
                  </th>
                  <th className="border-b border-neutral-800 px-4 py-3">
                    보유기간
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-300">
                {privacyPolicyRetentionRows.map((row) => (
                  <tr key={row.categoryKo}>
                    <td className="px-4 py-3 font-semibold text-neutral-100">
                      {row.categoryKo}
                    </td>
                    <td className="px-4 py-3">{row.periodKo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PolicySection>

        <PolicySection titleKo="결제 처리">
          <p>
            결제 거래정보는 결제 처리 및 결제 내역 확인을 위해 처리됩니다.
            결제수단의 상세 정보는 결제대행사인 토스페이먼츠가 처리하며,
            결리포트는 카드번호 등 결제수단 상세 정보를 직접 저장하지
            않습니다.
          </p>
        </PolicySection>

        <PolicySection titleKo="리포트 생성">
          <p>
            이름 또는 닉네임, 생년월일, 출생시간, 성별, MBTI, 리포트 생성 및
            열람 정보는 입력값 확인과 자동 생성 디지털 리포트 제공을 위해
            처리됩니다.
          </p>
        </PolicySection>

        <PolicySection titleKo="고객 문의 대응">
          <p>
            고객 문의 정보는 문의 확인, 환불·재생성 요청 처리, 서비스 장애
            대응을 위해 필요한 범위에서 처리됩니다.
          </p>
        </PolicySection>

        <PolicySection titleKo="처리위탁 또는 외부 서비스 이용">
          <ul className="space-y-2">
            {privacyPolicyExternalServiceRows.map((row) => (
              <li key={row.providerKo}>
                {row.providerKo}:{" "}
                {row.providerKo === "호스팅 제공자"
                  ? `${GYEOL_BUSINESS_INFO.hostingProvider}, ${row.purposeKo}`
                  : row.purposeKo}
              </li>
            ))}
          </ul>
        </PolicySection>

        <PolicySection titleKo="국외 처리 또는 국외 이전 가능성">
          <p>{privacyPolicyOverseasProcessingKo}</p>
        </PolicySection>

        <PolicySection titleKo="만 14세 미만 이용 제한">
          <p>{privacyPolicyUnder14Ko}</p>
        </PolicySection>

        <PolicySection titleKo="미성년자 안내">
          <p>{privacyPolicyMinorNoticeKo}</p>
        </PolicySection>

        <PolicySection titleKo="민감정보 수집 제한">
          <p>{privacyPolicySensitiveInfoLimitKo}</p>
          <p>{privacyPolicyNoResidentRegistrationNumberKo}</p>
        </PolicySection>

        <PolicySection titleKo="이용자의 권리">
          <p>{privacyPolicyUserRightsKo}</p>
        </PolicySection>

        <PolicySection titleKo="개인정보 문의처">
          <dl className="grid gap-3 sm:grid-cols-2">
            <ContactFact
              labelKo="고객센터"
              valueKo={GYEOL_BUSINESS_INFO.customerServicePhone}
            />
            <ContactFact
              labelKo="이메일"
              valueKo={GYEOL_BUSINESS_INFO.supportContactEmail}
            />
          </dl>
        </PolicySection>

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

function PolicySection({
  titleKo,
  children,
}: {
  readonly titleKo: string;
  readonly children: ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-sm leading-7 text-neutral-300">
      <h2 className="text-xl font-bold text-neutral-100">{titleKo}</h2>
      {children}
    </section>
  );
}

function ContactFact({
  labelKo,
  valueKo,
}: {
  readonly labelKo: string;
  readonly valueKo: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4">
      <dt className="text-xs font-semibold text-neutral-500">{labelKo}</dt>
      <dd className="mt-1 font-bold text-neutral-100">{valueKo}</dd>
    </div>
  );
}
