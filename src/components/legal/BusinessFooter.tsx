"use client";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { GYEOL_BUSINESS_INFO } from "../../lib/legal/businessInfo";
import { legalLinks } from "./LegalPageLayout";
import { SOCIAL_LINKS, SUPPORT_CHAT_URL } from "../../lib/legal/socialLinks";
import SocialIconLinks from "./SocialIconLinks";
import MetaSettingsLink from "../analytics/MetaSettingsLink";
import styles from "./legal.module.css";

export default function BusinessFooter() {
  const pathname = usePathname();
  if (/^\/(?:reports|r)\/[^/]+\/?$/.test(pathname ?? "")) return null;
  // 관리자 화면에는 고객용 푸터(사업자 정보·소셜·광고 설정)를 붙이지 않는다.
  if (/^\/admin(?:\/|$)/.test(pathname ?? "")) return null;
  const iconLink = "inline-flex size-11 items-center justify-center rounded-full border border-[#cbbba5] hover:bg-[#eee5d8] focus-visible:outline-2";
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <section aria-label="사업자 정보">
          <p className={styles.footerBrand}>{GYEOL_BUSINESS_INFO.serviceNameKo}</p>
          <div className="my-4 flex flex-wrap items-center gap-3 text-[#6f1d35]" aria-label="소셜과 고객 문의">
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="결리포트 Instagram" className={iconLink}>
              <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
            </a>
            <SocialIconLinks className={iconLink} />
            <a href={SUPPORT_CHAT_URL} target="_blank" rel="noopener noreferrer" aria-label="카카오톡 고객 문의" className={iconLink}>
              <Image src="/brand/kakao-talk-share.svg" width={24} height={25} alt="" />
            </a>
            <a href={SUPPORT_CHAT_URL} target="_blank" rel="noopener noreferrer" className={`${styles.footerChat} rounded-full bg-[#6f1d35] px-4 py-3 text-sm font-semibold hover:bg-[#542032]`}>채팅하기</a>
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
          <MetaSettingsLink />
        </nav>
      </div>
    </footer>
  );
}
