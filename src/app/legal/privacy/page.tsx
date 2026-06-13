import LegalPageLayout from "../../../components/legal/LegalPageLayout";
import type { ReactNode } from "react";
import { GYEOL_BUSINESS_INFO } from "../../../lib/legal/businessInfo";
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
} from "../../../lib/legal/privacyPolicy";

export default function LegalPrivacyPage() {
  return (
    <LegalPageLayout
      titleKo="개인정보처리방침"
      descriptionKo={privacyPolicyProcessingScopeKo}
    >
      <section className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <PolicyBlock titleKo="수집하는 개인정보 항목">
          <ul className="grid gap-2 sm:grid-cols-2">
            {privacyPolicyCollectionItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </PolicyBlock>

        <PolicyBlock titleKo="수집·이용 목적">
          <ul className="grid gap-2 sm:grid-cols-2">
            {privacyPolicyPurposeItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </PolicyBlock>

        <PolicyBlock titleKo="보유 및 이용기간">
          <p>{privacyPolicyServiceRetentionKo}</p>
          <p>{privacyPolicyLegalRetentionKo}</p>
          <ul className="space-y-2">
            {privacyPolicyRetentionRows.map((row) => (
              <li key={row.categoryKo}>
                {row.categoryKo}: {row.periodKo}
              </li>
            ))}
          </ul>
        </PolicyBlock>

        <PolicyBlock titleKo="결제 처리">
          <p>
            결제 거래정보는 결제 처리 및 결제 내역 확인을 위해 처리됩니다.
            결제수단의 상세 정보는 결제대행사인 토스페이먼츠가 처리하며,
            결리포트는 카드번호 등 결제수단 상세 정보를 직접 저장하지
            않습니다.
          </p>
        </PolicyBlock>

        <PolicyBlock titleKo="리포트 생성">
          <p>
            이름 또는 닉네임, 생년월일, 출생시간, 성별, MBTI, 리포트 생성 및
            열람 정보는 입력값 확인과 자동 생성 디지털 리포트 제공을 위해
            처리됩니다.
          </p>
        </PolicyBlock>

        <PolicyBlock titleKo="고객 문의 대응">
          <p>
            고객 문의 정보는 문의 확인, 환불·재생성 요청 처리, 서비스 장애
            대응을 위해 필요한 범위에서 처리됩니다.
          </p>
        </PolicyBlock>

        <PolicyBlock titleKo="처리위탁 또는 외부 서비스 이용">
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
        </PolicyBlock>

        <PolicyBlock titleKo="국외 처리 또는 국외 이전 가능성">
          <p>{privacyPolicyOverseasProcessingKo}</p>
        </PolicyBlock>

        <PolicyBlock titleKo="만 14세 미만 이용 제한">
          <p>{privacyPolicyUnder14Ko}</p>
        </PolicyBlock>

        <PolicyBlock titleKo="미성년자 안내">
          <p>{privacyPolicyMinorNoticeKo}</p>
        </PolicyBlock>

        <PolicyBlock titleKo="민감정보 수집 제한">
          <p>{privacyPolicySensitiveInfoLimitKo}</p>
          <p>{privacyPolicyNoResidentRegistrationNumberKo}</p>
        </PolicyBlock>

        <PolicyBlock titleKo="이용자의 권리">
          <p>{privacyPolicyUserRightsKo}</p>
        </PolicyBlock>

        <PolicyBlock titleKo="개인정보 문의처">
          <p>고객센터: {GYEOL_BUSINESS_INFO.customerServicePhone}</p>
          <p>이메일: {GYEOL_BUSINESS_INFO.supportContactEmail}</p>
        </PolicyBlock>
      </section>
    </LegalPageLayout>
  );
}

function PolicyBlock({
  titleKo,
  children,
}: {
  readonly titleKo: string;
  readonly children: ReactNode;
}) {
  return (
    <article className="space-y-2">
      <h2 className="text-lg font-semibold text-neutral-100">{titleKo}</h2>
      <div className="space-y-2 text-sm leading-7 text-neutral-400">
        {children}
      </div>
    </article>
  );
}
