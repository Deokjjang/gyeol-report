import LegalPageLayout from "../../components/legal/LegalPageLayout";
import styles from "../../components/legal/legal.module.css";
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
    <LegalPageLayout titleKo="개인정보처리방침" descriptionKo={privacyPolicyProcessingScopeKo} currentPath="/privacy">
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
        <p>
          고객 문의 정보는 문의 확인, 환불·재생성 요청 처리, 서비스 장애
          대응을 위해 필요한 범위에서 처리됩니다.
        </p>
      </PolicySection>

      <PolicySection titleKo="보유 및 이용기간">
        <p>{privacyPolicyServiceRetentionKo}</p>
        <p>{privacyPolicyLegalRetentionKo}</p>
        <div>
          <table>
            <caption>개인정보 항목별 보유기간</caption>
            <thead>
              <tr>
                <th scope="col">
                  구분
                </th>
                <th scope="col">
                  보유기간
                </th>
              </tr>
            </thead>
            <tbody>
              {privacyPolicyRetentionRows.map((row) => (
                <tr key={row.categoryKo}>
                  <th scope="row">{row.categoryKo}</th>
                  <td>{row.periodKo}</td>
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


      <PolicySection titleKo="처리위탁 또는 외부 서비스 이용">
        <table>
          <caption>외부 서비스와 이용 목적</caption>
          <thead><tr><th scope="col">서비스</th><th scope="col">이용 목적</th></tr></thead>
          <tbody>
            {privacyPolicyExternalServiceRows.map((row) => (
              <tr key={row.providerKo}>
                <th scope="row">{row.providerKo === "호스팅 제공자" ? GYEOL_BUSINESS_INFO.hostingProvider : row.providerKo}</th>
                <td>{row.purposeKo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PolicySection>

      <PolicySection titleKo="국외 처리 또는 국외 이전 가능성">
        <p>{privacyPolicyOverseasProcessingKo}</p>
      </PolicySection>

      <PolicySection titleKo="미성년자 이용">
        <p>{privacyPolicyUnder14Ko}</p>
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
        <div className={styles.contacts}>
          <a href={`tel:${GYEOL_BUSINESS_INFO.customerServicePhone}`}>고객센터 {GYEOL_BUSINESS_INFO.customerServicePhone}</a>
          <a href={`mailto:${GYEOL_BUSINESS_INFO.supportContactEmail}`}>{GYEOL_BUSINESS_INFO.supportContactEmail}</a>
        </div>
      </PolicySection>

    </LegalPageLayout>
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
    <section>
      <h2>{titleKo}</h2>
      {children}
    </section>
  );
}
