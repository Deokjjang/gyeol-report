import { bookExperiencePublicEnabled } from "../../lib/book/publicGate";
import { BookLegalRoute } from "../../components/book/BookRoutes";
import LegalPageLayout from "../../components/legal/LegalPageLayout";
import { PolicyBlocks } from "../../components/legal/PolicyBlocks";
import styles from "../../components/legal/legal.module.css";

import { GYEOL_BUSINESS_INFO } from "../../lib/legal/businessInfo";
import { privacyPolicyProcessingScopeKo, privacyPolicySections } from "../../lib/legal/privacyPolicy";

export default function PrivacyPage() {
  if (bookExperiencePublicEnabled()) return <BookLegalRoute index={1} />;
  return (
    <LegalPageLayout titleKo="개인정보처리방침" descriptionKo={privacyPolicyProcessingScopeKo} currentPath="/privacy">
      {privacyPolicySections.map(section => (
        <section key={section.titleKo}>
          <h2>{section.titleKo}</h2>
          <PolicyBlocks blocks={section.blocks} />
        </section>
      ))}
      <section>
        <h2>개인정보 문의처</h2>
        <div className={styles.contacts}>
          <a href={`tel:${GYEOL_BUSINESS_INFO.customerServicePhone}`}>고객센터 {GYEOL_BUSINESS_INFO.customerServicePhone}</a>
          <a href={`mailto:${GYEOL_BUSINESS_INFO.supportContactEmail}`}>{GYEOL_BUSINESS_INFO.supportContactEmail}</a>
        </div>
      </section>
    </LegalPageLayout>
  );
}
