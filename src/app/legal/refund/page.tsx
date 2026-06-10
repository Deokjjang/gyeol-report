import LegalPageLayout from "../../../components/legal/LegalPageLayout";
import { GYEOL_BUSINESS_INFO } from "../../../lib/legal/businessInfo";

const refundSections = [
  {
    titleKo: "1. 상품 성격",
    bodyKo:
      "결리포트는 사용자의 입력값을 바탕으로 즉시 생성되는 디지털 콘텐츠입니다. 현재 상품은 사주×MBTI 전체 리포트이며, 가격은 1,290원입니다.",
  },
  {
    titleKo: "2. 결제 취소 가능 시점",
    bodyKo:
      "결제 승인 전 또는 리포트 생성 전에는 결제 취소가 가능할 수 있습니다. 취소 가능 여부는 결제 상태와 리포트 생성 상태 확인 후 판단합니다.",
  },
  {
    titleKo: "3. 리포트 생성 후 환불 제한",
    bodyKo:
      "결제 승인 후 리포트가 생성되어 열람 가능한 상태가 된 경우, 디지털 콘텐츠 제공이 개시된 것으로 보아 단순 변심 환불이 제한될 수 있습니다.",
  },
  {
    titleKo: "4. 오류/중복 결제 처리",
    bodyKo:
      "결제 중복, 시스템 오류, 리포트 미제공, 명백한 기술적 장애가 확인되는 경우에는 확인 후 취소 또는 환불을 지원합니다.",
  },
  {
    titleKo: "5. 환불 요청 방법",
    bodyKo: `환불 문의: ${GYEOL_BUSINESS_INFO.supportContactEmail}. 문의 시 주문 식별 정보와 발생 상황을 함께 알려 주시면 확인 후 처리합니다.`,
  },
  {
    titleKo: "6. 처리 기간",
    bodyKo:
      "환불 또는 취소 요청은 접수 후 결제 상태, 리포트 제공 여부, 오류 여부를 확인해 관련 법령과 결제대행사 처리 기준에 따라 처리합니다.",
  },
  {
    titleKo: "7. 문의",
    bodyKo: `환불/취소 관련 문의는 ${GYEOL_BUSINESS_INFO.supportContactEmail}로 접수할 수 있습니다.`,
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
