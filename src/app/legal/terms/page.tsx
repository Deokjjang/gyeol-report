import LegalPageLayout from "../../../components/legal/LegalPageLayout";
import { GYEOL_BUSINESS_INFO } from "../../../lib/legal/businessInfo";

const termsSections = [
  {
    titleKo: "1. 목적",
    bodyKo:
      "이 약관은 결리포트가 제공하는 디지털 리포트 서비스의 이용 조건, 유료 상품, 제공 방식, 이용자와 서비스 제공자의 권리와 책임을 정하는 것을 목적으로 합니다.",
  },
  {
    titleKo: "2. 서비스 제공자",
    bodyKo: `결리포트의 서비스 제공자는 ${GYEOL_BUSINESS_INFO.businessName}이며, 대표자는 ${GYEOL_BUSINESS_INFO.representativeKo}입니다. 사업자등록번호는 ${GYEOL_BUSINESS_INFO.businessRegistrationNumber}입니다.`,
  },
  {
    titleKo: "3. 서비스 내용",
    bodyKo:
      "결리포트는 생년월일시, 성별, MBTI 등 사용자가 입력한 정보를 바탕으로 자기이해용 디지털 리포트를 제공합니다. 현재 상품은 사주×MBTI 전체 리포트이며, 가격은 1,290원입니다.",
  },
  {
    titleKo: "4. 유료 상품 및 결제",
    bodyKo:
      "유료 상품은 리포트 1개당 1회 결제를 기준으로 제공됩니다. 실제 유료 제공은 결제 승인 및 서버 확인 이후에 이루어집니다.",
  },
  {
    titleKo: "5. 리포트 제공 방식",
    bodyKo:
      "결제 완료 후 생성된 리포트는 공유 링크 또는 열람 페이지로 제공됩니다. 서비스는 결제 승인 이후 서버에서 확인된 주문 정보를 기준으로 리포트를 제공합니다.",
  },
  {
    titleKo: "6. 이용자의 책임",
    bodyKo:
      "사용자는 정확한 정보를 입력할 책임이 있습니다. 입력값이 부정확하거나 타인의 정보를 무단으로 입력한 경우 리포트 내용과 서비스 이용에 제한이 생길 수 있습니다.",
  },
  {
    titleKo: "7. 사주·MBTI 해석의 한계",
    bodyKo:
      "사주/MBTI 해석은 자기이해와 참고용 콘텐츠이며 의학, 법률, 투자, 심리진단, 직업선택, 미래 사건 예측을 보장하지 않습니다. 중요한 의사결정은 관련 전문가와 상담해 주세요.",
  },
  {
    titleKo: "8. 금지행위",
    bodyKo:
      "이용자는 타인의 정보를 무단 입력하거나, 서비스를 악용하거나, 자동화된 방식으로 과도한 요청을 보내거나, 서비스 운영을 방해해서는 안 됩니다.",
  },
  {
    titleKo: "9. 서비스 변경/중단",
    bodyKo:
      "서비스는 운영상, 기술상 필요에 따라 일부 내용이 변경되거나 일시 중단될 수 있습니다. 중요한 변경은 서비스 화면 또는 공지 방식으로 안내합니다.",
  },
  {
    titleKo: "10. 책임 제한",
    bodyKo:
      "결리포트는 자기이해용 콘텐츠를 제공하며, 리포트 해석을 근거로 한 이용자의 선택 결과를 보장하지 않습니다. 법령상 허용되는 범위에서 서비스 책임은 제한될 수 있습니다.",
  },
  {
    titleKo: "11. 문의",
    bodyKo: `서비스 문의는 ${GYEOL_BUSINESS_INFO.supportContactEmail}로 접수할 수 있습니다.`,
  },
] as const;

export default function LegalTermsPage() {
  return (
    <LegalPageLayout
      titleKo="이용약관"
      descriptionKo="결리포트 유료 디지털 리포트 서비스 이용 기준입니다."
    >
      <section className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        {termsSections.map((section) => (
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
