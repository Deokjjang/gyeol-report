import { GYEOL_BUSINESS_INFO } from "../../lib/legal/businessInfo";

const legalLinks = [
  { href: "/terms", labelKo: "이용약관" },
  { href: "/privacy", labelKo: "개인정보처리방침" },
  { href: "/refund", labelKo: "환불정책" },
  { href: "/business", labelKo: "사업자정보" },
] as const;

export default function BusinessFooter() {
  return (
    <footer className="border-t border-[#e9e1d7] bg-[#f4efe7] px-6 py-10 text-[#71665e] sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 text-xs leading-6">
        <section className="space-y-5" aria-label="사업자 정보">
          <p className="text-sm font-semibold text-[#493b32]">
            {GYEOL_BUSINESS_INFO.serviceNameKo}
          </p>
          <dl className="grid grid-cols-[7rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 [&_dd]:break-words [&_dt]:font-normal [&_dt]:text-[#71665e] lg:grid-cols-[7rem_minmax(0,1fr)_7rem_minmax(0,1fr)]">
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
                className="inline-flex min-h-11 items-center text-[#493b32] underline decoration-[#c9bdae] underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7f1d38]"
              >
                {GYEOL_BUSINESS_INFO.customerServicePhone}
              </a>
            </dd>
            <dt className="font-semibold text-neutral-800">이메일</dt>
            <dd>
              <a
                href={`mailto:${GYEOL_BUSINESS_INFO.supportContactEmail}`}
                className="inline-flex min-h-11 items-center text-[#493b32] underline decoration-[#c9bdae] underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7f1d38]"
              >
                {GYEOL_BUSINESS_INFO.supportContactEmail}
              </a>
            </dd>
            <dt className="font-semibold text-neutral-800">호스팅 제공자</dt>
            <dd>{GYEOL_BUSINESS_INFO.hostingProvider}</dd>
          </dl>
        </section>

        <nav aria-label="정책 링크" className="flex flex-wrap gap-x-6 border-t border-[#e2d9cc] pt-3">
          {legalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center font-semibold text-[#493b32] underline decoration-[#c9bdae] underline-offset-4 hover:text-[#7f1d38] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7f1d38]"
            >
              {link.labelKo}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
