import { GYEOL_BUSINESS_INFO } from "../../lib/legal/businessInfo";

const legalLinks = [
  { href: "/terms", labelKo: "이용약관" },
  { href: "/privacy", labelKo: "개인정보처리방침" },
  { href: "/refund", labelKo: "환불정책" },
  { href: "/business", labelKo: "사업자정보" },
] as const;

export default function BusinessFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white px-5 py-4 text-neutral-600 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 text-xs leading-5 sm:text-sm">
        <section className="space-y-2" aria-label="사업자 정보">
          <p className="font-extrabold text-neutral-950">
            {GYEOL_BUSINESS_INFO.serviceNameKo}
          </p>
          <dl className="flex flex-wrap gap-x-4 gap-y-1">
            <dt className="font-semibold text-neutral-800">상호명</dt>
            <dd>{GYEOL_BUSINESS_INFO.businessName}</dd>
            <dt className="font-semibold text-neutral-800">대표</dt>
            <dd>{GYEOL_BUSINESS_INFO.representativeKo}</dd>
            <dt className="font-semibold text-neutral-800">사업자등록번호</dt>
            <dd>{GYEOL_BUSINESS_INFO.businessRegistrationNumber}</dd>
            <dt className="font-semibold text-neutral-800">
              통신판매업 신고번호
            </dt>
            <dd>{GYEOL_BUSINESS_INFO.mailOrderSalesRegistrationNumber}</dd>
            <dt className="font-semibold text-neutral-800">사업장 주소</dt>
            <dd>{GYEOL_BUSINESS_INFO.businessAddressKo}</dd>
            <dt className="font-semibold text-neutral-800">고객센터</dt>
            <dd>
              <a
                href={`tel:${GYEOL_BUSINESS_INFO.customerServicePhone}`}
                className="font-semibold text-neutral-900 underline underline-offset-4"
              >
                {GYEOL_BUSINESS_INFO.customerServicePhone}
              </a>
            </dd>
            <dt className="font-semibold text-neutral-800">이메일</dt>
            <dd>
              <a
                href={`mailto:${GYEOL_BUSINESS_INFO.supportContactEmail}`}
                className="font-semibold text-neutral-900 underline underline-offset-4"
              >
                {GYEOL_BUSINESS_INFO.supportContactEmail}
              </a>
            </dd>
            <dt className="font-semibold text-neutral-800">호스팅 제공자</dt>
            <dd>{GYEOL_BUSINESS_INFO.hostingProvider}</dd>
          </dl>
        </section>

        <nav aria-label="정책 링크" className="flex flex-wrap gap-x-4 gap-y-2">
          {legalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-extrabold text-neutral-950 underline underline-offset-4"
            >
              {link.labelKo}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
