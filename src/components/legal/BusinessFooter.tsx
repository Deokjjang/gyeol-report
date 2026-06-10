import { GYEOL_BUSINESS_INFO } from "../../lib/legal/businessInfo";

const legalLinks = [
  { href: "/legal/business-info", labelKo: "사업자 정보" },
  { href: "/legal/terms", labelKo: "이용약관" },
  { href: "/legal/privacy", labelKo: "개인정보처리방침" },
  { href: "/legal/refund", labelKo: "환불/취소 정책" },
] as const;

export default function BusinessFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white px-5 py-8 text-neutral-600 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-5xl gap-5 text-sm leading-6 lg:grid-cols-[1fr_auto]">
        <section className="space-y-3" aria-label="사업자 정보">
          <p className="text-base font-bold text-neutral-950">
            {GYEOL_BUSINESS_INFO.serviceNameKo}
          </p>
          <dl className="grid gap-x-4 gap-y-1 sm:grid-cols-[9rem_1fr]">
            <dt>상호명</dt>
            <dd>{GYEOL_BUSINESS_INFO.businessName}</dd>
            <dt>대표자</dt>
            <dd>{GYEOL_BUSINESS_INFO.representativeKo}</dd>
            <dt>사업자등록번호</dt>
            <dd>{GYEOL_BUSINESS_INFO.businessRegistrationNumber}</dd>
            <dt>통신판매업 신고번호</dt>
            <dd>{GYEOL_BUSINESS_INFO.mailOrderSalesRegistrationNumber}</dd>
            <dt>고객센터</dt>
            <dd>
              <a
                href={`tel:${GYEOL_BUSINESS_INFO.customerServicePhone}`}
                className="font-semibold text-neutral-900 underline underline-offset-4"
              >
                {GYEOL_BUSINESS_INFO.customerServicePhone}
              </a>
            </dd>
          </dl>
        </section>

        <nav aria-label="정책 링크" className="flex flex-wrap gap-2 lg:justify-end">
          {legalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg border border-neutral-200 px-3 py-2 font-semibold text-neutral-800 transition hover:bg-neutral-50"
            >
              {link.labelKo}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
