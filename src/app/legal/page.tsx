import LegalPageLayout from "../../components/legal/LegalPageLayout";

const legalPages = [
  {
    href: "/legal/business-info",
    titleKo: "사업자 정보",
    descriptionKo: "결리포트 운영 사업자와 문의 채널을 확인할 수 있습니다.",
  },
  {
    href: "/legal/terms",
    titleKo: "이용약관",
    descriptionKo: "유료 디지털 리포트 서비스 이용 기준을 안내합니다.",
  },
  {
    href: "/legal/privacy",
    titleKo: "개인정보처리방침",
    descriptionKo: "리포트 제공과 결제 처리에 필요한 개인정보 처리 기준입니다.",
  },
  {
    href: "/legal/refund",
    titleKo: "환불/취소 정책",
    descriptionKo: "디지털 콘텐츠 특성에 따른 취소와 환불 기준입니다.",
  },
] as const;

export default function LegalIndexPage() {
  return (
    <LegalPageLayout
      titleKo="정책 안내"
      descriptionKo="결리포트의 사업자 정보, 이용약관, 개인정보처리방침, 환불/취소 정책을 확인할 수 있습니다."
    >
      <nav aria-label="정책 페이지" className="grid gap-4">
        {legalPages.map((page) => (
          <a
            key={page.href}
            href={page.href}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 transition hover:bg-neutral-900"
          >
            <p className="text-lg font-semibold text-neutral-100">
              {page.titleKo}
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              {page.descriptionKo}
            </p>
          </a>
        ))}
      </nav>
    </LegalPageLayout>
  );
}
