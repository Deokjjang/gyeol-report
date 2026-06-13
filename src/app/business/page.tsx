import LegalPageLayout from "../../components/legal/LegalPageLayout";
import { GYEOL_BUSINESS_INFO } from "../../lib/legal/businessInfo";

const businessInfoRows = [
  ["상호명", GYEOL_BUSINESS_INFO.businessName],
  ["대표자명", GYEOL_BUSINESS_INFO.representativeKo],
  ["사업자등록번호", GYEOL_BUSINESS_INFO.businessRegistrationNumber],
  ["사업장 주소", GYEOL_BUSINESS_INFO.businessAddressKo],
  ["고객센터", GYEOL_BUSINESS_INFO.customerServicePhone],
  ["이메일", GYEOL_BUSINESS_INFO.supportContactEmail],
  [
    "통신판매업 신고번호",
    GYEOL_BUSINESS_INFO.mailOrderSalesRegistrationNumber,
  ],
  ["호스팅 제공자", GYEOL_BUSINESS_INFO.hostingProvider],
] as const;

export default function BusinessPage() {
  return (
    <LegalPageLayout
      titleKo="사업자 정보"
      descriptionKo="결리포트를 운영하는 사업자 정보와 고객 문의 채널입니다."
    >
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
        <dl className="grid gap-x-4 gap-y-3 text-sm leading-6 sm:grid-cols-[10rem_1fr]">
          {businessInfoRows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="font-medium text-neutral-500">{label}</dt>
              <dd className="text-neutral-200">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </LegalPageLayout>
  );
}
