import LegalPageLayout from "../../../components/legal/LegalPageLayout";
import { GYEOL_BUSINESS_INFO } from "../../../lib/legal/businessInfo";

const privacySections = [
  {
    titleKo: "1. 처리 목적",
    bodyKo:
      "리포트 제공, 고객 문의, 결제/환불 처리, 부정 이용 방지를 위해 필요한 정보를 처리합니다.",
  },
  {
    titleKo: "2. 수집 항목",
    bodyKo:
      "수집 항목: 생년월일, 출생시간, 성별, MBTI, 시간대, 서비스 이용 기록, 주문/결제 식별 정보.",
  },
  {
    titleKo: "3. 보관 기간",
    bodyKo:
      "개인정보는 서비스 제공과 법령상 보관 의무 이행에 필요한 기간 동안 보유할 수 있으며, 목적 달성 또는 보관 기간 종료 후 관련 법령에 따라 파기합니다.",
  },
  {
    titleKo: "4. 결제 처리",
    bodyKo:
      "결제 처리: Toss Payments. 결제수단의 상세 정보는 Toss Payments 등 결제대행사가 처리하며, 결리포트는 카드번호 등 민감한 결제수단 정보를 직접 저장하지 않습니다.",
  },
  {
    titleKo: "5. 외부 서비스",
    bodyKo:
      `호스팅 제공자: ${GYEOL_BUSINESS_INFO.hostingProvider}. 서비스 제공에 필요한 범위에서 결제, 호스팅, 고객 문의 처리에 외부 서비스를 이용할 수 있습니다.`,
  },
  {
    titleKo: "6. 이용자 권리와 문의",
    bodyKo: `이용자는 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다. 개인정보 문의: ${GYEOL_BUSINESS_INFO.supportContactEmail}. 개인정보보호 책임자: ${GYEOL_BUSINESS_INFO.privacyOfficerName}.`,
  },
] as const;

export default function LegalPrivacyPage() {
  return (
    <LegalPageLayout
      titleKo="개인정보처리방침"
      descriptionKo="결리포트의 개인정보 수집, 이용, 보관, 결제 처리 기준입니다."
    >
      <section className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        {privacySections.map((section) => (
          <article key={section.titleKo} className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-100">
              {section.titleKo}
            </h2>
            <p className="text-sm leading-7 text-neutral-400">
              {section.bodyKo}
            </p>
          </article>
        ))}
      </section>
    </LegalPageLayout>
  );
}
