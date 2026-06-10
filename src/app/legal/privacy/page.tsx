import LegalPageLayout from "../../../components/legal/LegalPageLayout";
import { GYEOL_BUSINESS_INFO } from "../../../lib/legal/businessInfo";

const privacySections = [
  {
    titleKo: "1. 개인정보 처리 목적",
    bodyKo:
      "결리포트는 유료 리포트 제공, 고객지원, 부정 이용 방지, 결제/환불 처리, 서비스 품질 개선을 위해 필요한 개인정보를 처리할 수 있습니다.",
  },
  {
    titleKo: "2. 수집하는 개인정보 항목",
    bodyKo:
      "수집 항목에는 생년월일, 출생시간, 성별, MBTI, 시간대, 서비스 이용 기록, 결제 처리에 필요한 주문/결제 식별 정보가 포함될 수 있습니다.",
  },
  {
    titleKo: "3. 개인정보 보유 및 이용 기간",
    bodyKo:
      "개인정보는 서비스 제공과 법령상 보관 의무 이행에 필요한 기간 동안 보유할 수 있으며, 목적 달성 또는 보관 기간 종료 후 관련 법령에 따라 파기합니다.",
  },
  {
    titleKo: "4. 결제 처리",
    bodyKo:
      "결제수단의 상세 정보는 Toss Payments 등 결제대행사가 처리하며, 결리포트는 카드번호 등 민감한 결제수단 정보를 직접 저장하지 않습니다.",
  },
  {
    titleKo: "5. 제3자 제공 및 처리위탁",
    bodyKo:
      "결제 처리, 서비스 운영, 고객지원 등 서비스 제공에 필요한 범위에서 외부 서비스 제공자에게 처리를 위탁할 수 있습니다. 필요한 경우 관련 내용을 본 방침에 고지합니다.",
  },
  {
    titleKo: "6. 개인정보 파기",
    bodyKo:
      "보유 목적이 달성되거나 보유 기간이 종료된 개인정보는 복구하기 어려운 방법으로 파기합니다. 전자 파일은 안전하게 삭제하고 출력물은 분쇄 또는 이에 준하는 방법으로 파기합니다.",
  },
  {
    titleKo: "7. 이용자의 권리",
    bodyKo:
      "이용자는 관련 법령에 따라 개인정보 열람, 정정, 삭제, 처리 정지 등을 요청할 수 있습니다. 요청은 본인 확인 후 관련 법령에 따라 처리합니다.",
  },
  {
    titleKo: "8. 개인정보 보호 문의",
    bodyKo: `개인정보 보호 문의는 ${GYEOL_BUSINESS_INFO.officialContactEmail} 또는 ${GYEOL_BUSINESS_INFO.supportContactEmail}로 접수할 수 있습니다.`,
  },
  {
    titleKo: "9. 변경 고지",
    bodyKo:
      "개인정보처리방침이 변경되는 경우 서비스 화면 또는 별도 공지 방식으로 변경 내용을 안내합니다.",
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
