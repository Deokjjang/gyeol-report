import { GYEOL_BUSINESS_INFO } from "../../lib/legal/businessInfo";

const legalLinks = [
  { href: "/legal/business-info", labelKo: "사업자 정보" },
  { href: "/legal/terms", labelKo: "이용약관" },
  { href: "/legal/privacy", labelKo: "개인정보처리방침" },
  { href: "/legal/refund", labelKo: "환불/취소 정책" },
] as const;

export default function BusinessFooter() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 px-5 py-8 text-neutral-400 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-5xl gap-6 text-sm leading-6 lg:grid-cols-[1fr_auto]">
        <section className="space-y-3" aria-label="사업자 정보">
          <p className="text-base font-semibold text-neutral-100">
            {GYEOL_BUSINESS_INFO.serviceNameKo}
          </p>
          <dl className="grid gap-x-4 gap-y-1 sm:grid-cols-[9rem_1fr]">
            <dt>상호명</dt>
            <dd>{GYEOL_BUSINESS_INFO.businessName}</dd>
            <dt>서비스명</dt>
            <dd>{GYEOL_BUSINESS_INFO.serviceNameKo}</dd>
            <dt>대표자</dt>
            <dd>{GYEOL_BUSINESS_INFO.representativeKo}</dd>
            <dt>사업자등록번호</dt>
            <dd>{GYEOL_BUSINESS_INFO.businessRegistrationNumber}</dd>
            <dt>과세유형</dt>
            <dd>{GYEOL_BUSINESS_INFO.taxTypeKo}</dd>
            <dt>통신판매업 신고번호</dt>
            <dd>{GYEOL_BUSINESS_INFO.mailOrderSalesRegistrationNumber}</dd>
            <dt>사업장 주소</dt>
            <dd>{GYEOL_BUSINESS_INFO.businessAddressKo}</dd>
            <dt>고객센터</dt>
            <dd>
              <a
                href={`tel:${GYEOL_BUSINESS_INFO.customerServicePhone}`}
                className="text-neutral-200 underline underline-offset-4"
              >
                {GYEOL_BUSINESS_INFO.customerServicePhone}
              </a>
            </dd>
            <dt>고객지원</dt>
            <dd>
              <a
                href={`mailto:${GYEOL_BUSINESS_INFO.supportContactEmail}`}
                className="text-neutral-200 underline underline-offset-4"
              >
                {GYEOL_BUSINESS_INFO.supportContactEmail}
              </a>
            </dd>
            <dt>공식 문의</dt>
            <dd>
              <a
                href={`mailto:${GYEOL_BUSINESS_INFO.officialContactEmail}`}
                className="text-neutral-200 underline underline-offset-4"
              >
                {GYEOL_BUSINESS_INFO.officialContactEmail}
              </a>
            </dd>
            <dt>개인정보보호 책임자</dt>
            <dd>{GYEOL_BUSINESS_INFO.privacyOfficerName}</dd>
            <dt>개인정보보호 문의</dt>
            <dd>
              <a
                href={`mailto:${GYEOL_BUSINESS_INFO.privacyOfficerEmail}`}
                className="text-neutral-200 underline underline-offset-4"
              >
                {GYEOL_BUSINESS_INFO.privacyOfficerEmail}
              </a>
            </dd>
            <dt>호스팅 제공자</dt>
            <dd>{GYEOL_BUSINESS_INFO.hostingProvider}</dd>
          </dl>
        </section>

        <nav aria-label="정책 링크" className="flex flex-wrap gap-3 lg:block lg:space-y-2">
          {legalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block rounded-lg border border-neutral-800 px-3 py-2 text-neutral-200 transition hover:bg-neutral-900"
            >
              {link.labelKo}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
