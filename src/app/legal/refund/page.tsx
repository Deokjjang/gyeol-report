import LegalPageLayout from "../../../components/legal/LegalPageLayout";
import { GYEOL_BUSINESS_INFO } from "../../../lib/legal/businessInfo";

const refundSections = [
  {
    titleKo: "1. 상품 성격",
    bodyKo:
      "결리포트는 입력값을 바탕으로 생성되는 디지털 콘텐츠입니다.",
  },
  {
    titleKo: "2. 취소 가능 시점",
    bodyKo:
      "결제 승인 전 또는 리포트 생성 전에는 취소가 가능할 수 있습니다.",
  },
  {
    titleKo: "3. 환불 제한",
    bodyKo:
      "리포트가 생성되어 열람 가능한 상태가 된 뒤에는 단순 변심 환불이 제한될 수 있습니다.",
  },
  {
    titleKo: "4. 오류/중복 결제 처리",
    bodyKo:
      "중복 결제, 시스템 오류, 리포트 미제공은 확인 후 취소 또는 환불을 지원합니다.",
  },
  {
    titleKo: "5. 문의",
    bodyKo: `문의: ${GYEOL_BUSINESS_INFO.supportContactEmail}. 주문 식별 정보와 발생 상황을 함께 알려 주시면 확인 후 처리합니다.`,
  },
] as const;

export default function LegalRefundPage() {
  return (
    <LegalPageLayout
      titleKo="환불/취소 정책"
      descriptionKo="디지털 리포트 상품의 결제 취소와 환불 처리 기준입니다."
    >
      <section className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        {refundSections.map((section) => (
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
