import LegalPageLayout from "../../../components/legal/LegalPageLayout";
import { GYEOL_BUSINESS_INFO } from "../../../lib/legal/businessInfo";

const termsSections = [
  {
    titleKo: "1. 서비스",
    bodyKo:
      "결리포트는 사용자가 입력한 생년월일시, 성별, MBTI 정보를 바탕으로 자기이해용 디지털 리포트를 제공합니다.",
  },
  {
    titleKo: "2. 유료 상품과 결제",
    bodyKo:
      "현재 유료 상품은 사주×MBTI 전체 리포트이며, 런칭가 990원입니다.",
  },
  {
    titleKo: "3. 리포트 제공",
    bodyKo:
      "유료 리포트는 결제 승인 및 서버 확인 이후 온라인 열람 방식으로 제공됩니다.",
  },
  {
    titleKo: "4. 이용자의 책임",
    bodyKo:
      "사용자는 정확한 정보를 입력해야 하며, 타인의 정보를 무단으로 입력하면 안 됩니다.",
  },
  {
    titleKo: "5. 해석의 한계",
    bodyKo:
      "사주·MBTI 해석은 자기이해용 참고 콘텐츠입니다. 의료·법률·투자 자문을 제공하지 않습니다.",
  },
  {
    titleKo: "6. 환불 및 문의",
    bodyKo: `환불 기준은 환불/취소 정책을 따르며, 문의는 ${GYEOL_BUSINESS_INFO.supportContactEmail}로 접수합니다.`,
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
