"use client";

import { usePathname } from "next/navigation";
import { GYEOL_BUSINESS_INFO } from "../../lib/legal/businessInfo";
import { legalLinks } from "./LegalPageLayout";
import styles from "./legal.module.css";

export default function BusinessFooter() {
  const pathname = usePathname();
  if (/^\/(?:reports|r)\/[^/]+\/?$/.test(pathname ?? "")) return null;
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <section aria-label="사업자 정보">
          <p className={styles.footerBrand}>{GYEOL_BUSINESS_INFO.serviceNameKo}</p>
          <div className="my-4 flex flex-wrap items-center gap-3 text-[#6f1d35]" aria-label="소셜과 고객 문의">
            <a href="https://www.instagram.com/gyeolreport/" target="_blank" rel="noopener noreferrer" aria-label="결리포트 Instagram" className="inline-flex size-11 items-center justify-center rounded-full border border-[#cbbba5] hover:bg-[#eee5d8] focus-visible:outline-2">
              <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href="http://pf.kakao.com/_sbHaX/chat" target="_blank" rel="noopener noreferrer" aria-label="카카오톡 고객 문의" className="inline-flex size-11 items-center justify-center rounded-full border border-[#cbbba5] hover:bg-[#eee5d8] focus-visible:outline-2">
              <svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.7 1.8 5.1 4.5 6.5L5.4 21l4.4-2.6c.7.1 1.4.2 2.2.2 5.5 0 10-3.5 10-7.8S17.5 3 12 3Z" /></svg>
            </a>
            <a href="http://pf.kakao.com/_sbHaX/chat" target="_blank" rel="noopener noreferrer" className={`${styles.footerChat} rounded-full bg-[#6f1d35] px-4 py-3 text-sm font-semibold hover:bg-[#542032]`}>채팅하기</a>
            <a href="http://pf.kakao.com/_sbHaX" target="_blank" rel="noopener noreferrer" className="text-xs underline underline-offset-4">채널 보기</a>
          </div>
          <p className={styles.footerNote}>고객 문의는 카카오톡 채널 채팅으로 받고 있습니다.</p>
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
            <p className={styles.footerNote}>
              전화 상담은 제공하지 않습니다.
            </p>
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
