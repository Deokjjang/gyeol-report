/**
 * "/" 로그인 화면 맨 아래 사업자 정보 한 줄(명령 2 추가 사항 1). 값은 기존 사업자 정보 푸터와 같은 상수(GYEOL_BUSINESS_INFO) · 정책 링크(legalLinks)를 그대로 쓴다.
 * 상호 · 대표자 · 주소 · 연락처 · 사업자등록번호는 바로 보이고, 통신판매업 신고번호 · 이용약관 · 개인정보처리방침은 같은 줄의 링크.
 * 내 홈 · 질문지 · 친구 응답 화면에는 두지 않는다.
 */
import { legalLinks } from "../legal/LegalPageLayout";
import { GYEOL_BUSINESS_INFO as B } from "../../lib/legal/businessInfo";
import f from "./social.module.css";

const link = (href: string) => legalLinks.find(l => l.href === href)!;
export function BusinessLine({ className }: { className?: string }) {
  const terms = link("/terms"), privacy = link("/privacy"), business = link("/business");
  return <p className={`${f.biz} ${className ?? ""}`} data-business-line>
    {B.businessName} · 대표 {B.representativeKo} · {B.businessAddressKo} · {B.customerServicePhone} · {B.supportContactEmail} · 사업자등록번호 {B.businessRegistrationNumber}
    {" · "}<a href={business.href}>통신판매업 신고번호</a>{" · "}<a href={terms.href}>{terms.labelKo}</a>{" · "}<a href={privacy.href}>{privacy.labelKo}</a>
  </p>;
}
