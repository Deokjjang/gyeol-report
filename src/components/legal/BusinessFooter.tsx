import { GYEOL_BUSINESS_INFO } from "../../lib/legal/businessInfo";
import { legalLinks } from "./LegalPageLayout";
import styles from "./legal.module.css";

export default function BusinessFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <section aria-label="사업자 정보">
          <p className={styles.footerBrand}>{GYEOL_BUSINESS_INFO.serviceNameKo}</p>
          <p className={styles.identity}>
            <span>{GYEOL_BUSINESS_INFO.businessName} · 대표 {GYEOL_BUSINESS_INFO.representativeKo}</span>
            <span>사업자등록번호 {GYEOL_BUSINESS_INFO.businessRegistrationNumber}</span>
          </p>
          <p>통신판매업 신고번호 {GYEOL_BUSINESS_INFO.mailOrderSalesRegistrationNumber}</p>
          <address className={styles.address}>
            <p>{GYEOL_BUSINESS_INFO.businessAddressKo}</p>
            <div className={styles.contacts}>
              <a href={`tel:${GYEOL_BUSINESS_INFO.customerServicePhone}`} aria-label={`고객센터 ${GYEOL_BUSINESS_INFO.customerServicePhone}`}>
                {GYEOL_BUSINESS_INFO.customerServicePhone}
              </a>
              <a href={`mailto:${GYEOL_BUSINESS_INFO.supportContactEmail}`}>
                {GYEOL_BUSINESS_INFO.supportContactEmail}
              </a>
            </div>
          </address>
        </section>
        <nav aria-label="정책 링크" className={styles.footerNav}>
          {legalLinks.map((link) => (
            <a key={link.href} href={link.href}>{link.labelKo}</a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
