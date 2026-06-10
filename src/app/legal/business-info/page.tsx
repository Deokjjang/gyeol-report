import LegalPageLayout from "../../../components/legal/LegalPageLayout";
import { GYEOL_BUSINESS_INFO } from "../../../lib/legal/businessInfo";

const businessInfoRows = [
  ["상호명", GYEOL_BUSINESS_INFO.businessName],
  ["서비스명", GYEOL_BUSINESS_INFO.serviceNameKo],
  ["대표자", GYEOL_BUSINESS_INFO.representativeKo],
  ["사업자등록번호", GYEOL_BUSINESS_INFO.businessRegistrationNumber],
  ["과세유형", GYEOL_BUSINESS_INFO.taxTypeKo],
  [
    "통신판매업 신고번호",
    GYEOL_BUSINESS_INFO.mailOrderSalesRegistrationNumber,
  ],
  ["우편번호", GYEOL_BUSINESS_INFO.postalCode],
  ["사업장 주소", GYEOL_BUSINESS_INFO.businessAddressKo],
  ["홈페이지", GYEOL_BUSINESS_INFO.domain],
  ["고객센터 전화번호", GYEOL_BUSINESS_INFO.customerServicePhone],
  ["공식 문의", GYEOL_BUSINESS_INFO.officialContactEmail],
  ["고객지원", GYEOL_BUSINESS_INFO.supportContactEmail],
  ["개인정보보호 책임자", GYEOL_BUSINESS_INFO.privacyOfficerName],
  ["개인정보보호 문의", GYEOL_BUSINESS_INFO.privacyOfficerEmail],
  ["호스팅 제공자", GYEOL_BUSINESS_INFO.hostingProvider],
] as const;

export default function LegalBusinessInfoPage() {
  return (
    <LegalPageLayout
      titleKo="사업자 정보"
      descriptionKo="결리포트를 운영하는 사업자 정보와 공식 문의 채널입니다."
    >
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <dl className="grid gap-x-4 gap-y-3 text-sm leading-6 sm:grid-cols-[10rem_1fr]">
          {businessInfoRows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="font-medium text-neutral-500">{label}</dt>
              <dd className="text-neutral-200">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="rounded-2xl border border-amber-900/50 bg-amber-950/20 p-5 text-sm leading-7 text-amber-100/90">
        통신판매업 신고번호는 확정 즉시 업데이트됩니다.
      </p>
    </LegalPageLayout>
  );
}
