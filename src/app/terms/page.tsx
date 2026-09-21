import LegalPageLayout from "../../components/legal/LegalPageLayout";
import { termsPolicyDescriptionKo, termsPolicySections } from "../../lib/legal/termsPolicy";

const detailLinks: Record<string, { href: string; label: string }> = {
  "사업자 정보": { href: "/business", label: "사업자정보 확인" },
  "청약철회 및 환불": { href: "/refund", label: "상세 환불정책 확인" },
  "개인정보 처리": { href: "/privacy", label: "개인정보처리방침 확인" },
};

export default function TermsPage() {
  return (
    <LegalPageLayout titleKo="이용약관" descriptionKo={termsPolicyDescriptionKo} currentPath="/terms">
      {termsPolicySections.map((section) => (
        <section key={section.titleKo}>
          <h2>{section.titleKo}</h2>
          {section.bodyKo.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {detailLinks[section.titleKo] && (
            <p><a href={detailLinks[section.titleKo].href}>{detailLinks[section.titleKo].label}</a></p>
          )}
        </section>
      ))}
    </LegalPageLayout>
  );
}
