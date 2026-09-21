import LegalPageLayout from "../../components/legal/LegalPageLayout";
import { GYEOL_BUSINESS_INFO } from "../../lib/legal/businessInfo";

const businessInfoRows = [
  ["상호명", GYEOL_BUSINESS_INFO.businessName],
  ["서비스명", GYEOL_BUSINESS_INFO.serviceNameKo],
  ["대표자명", GYEOL_BUSINESS_INFO.representativeKo],
  ["사업자등록번호", GYEOL_BUSINESS_INFO.businessRegistrationNumber],
  [
    "통신판매업 신고번호",
    GYEOL_BUSINESS_INFO.mailOrderSalesRegistrationNumber,
  ],
  ["사업장 주소", GYEOL_BUSINESS_INFO.businessAddressKo],
  ["고객센터", GYEOL_BUSINESS_INFO.customerServicePhone],
  ["이메일", GYEOL_BUSINESS_INFO.supportContactEmail],
  ["홈페이지", GYEOL_BUSINESS_INFO.domain],
  ["호스팅 제공자", GYEOL_BUSINESS_INFO.hostingProvider],
] as const;

export default function BusinessPage() {
  return (
    <LegalPageLayout
      currentPath="/business"
      titleKo="사업자 정보"
      descriptionKo="결리포트를 운영하는 사업자 정보와 고객 문의 채널입니다."
    >
      <section aria-label="사업자 상세 정보">
        <dl>
          {businessInfoRows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>
                {label === "고객센터" ? <a href={`tel:${value}`}>{value}</a>
                  : label === "이메일" ? <a href={`mailto:${value}`}>{value}</a>
                  : label === "홈페이지" ? <a href={value}>{value}</a> : value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </LegalPageLayout>
  );
}
