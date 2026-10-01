import { useEffect, useRef, useState, type ReactNode } from "react";
import { GYEOL_BUSINESS_INFO as business } from "../../../lib/legal/businessInfo";
import { termsPolicyDescriptionKo, termsPolicySections } from "../../../lib/legal/termsPolicy";
import {
  privacyPolicyCollectionItems, privacyPolicyExternalServiceRows, privacyPolicyLegalRetentionKo,
  privacyPolicyMinorNoticeKo, privacyPolicyNoResidentRegistrationNumberKo, privacyPolicyOverseasProcessingKo,
  privacyPolicyProcessingScopeKo, privacyPolicyPurposeItems, privacyPolicyRetentionRows,
  privacyPolicySensitiveInfoLimitKo, privacyPolicyServiceRetentionKo, privacyPolicyUnder14Ko, privacyPolicyUserRightsKo,
} from "../../../lib/legal/privacyPolicy";
import { refundPolicyRequiredNotices, refundPolicyStateRows, refundPolicySupportRequestGuidanceKo } from "../../../lib/legal/refundPolicy";
import s from "./book.module.css";

// Presentation only. Policy data is imported unchanged; route-only passages below
// mirror the existing public documents and are covered by full-text parity tests.
export const LEGAL_TITLES = ["이용약관", "개인정보처리방침", "환불정책", "사업자 정보"] as const;
export const SUPPORT_COPY = "고객 문의는 카카오톡 채널 채팅으로 받고 있습니다.";
export const BUSINESS_ROWS = [
  ["상호명", business.businessName], ["서비스명", business.serviceNameKo], ["대표자명", business.representativeKo],
  ["사업자등록번호", business.businessRegistrationNumber], ["통신판매업 신고번호", business.mailOrderSalesRegistrationNumber],
  ["사업장 주소", business.businessAddressKo], ["고객센터", business.customerServicePhone],
  ["이메일", business.supportContactEmail], ["홈페이지", business.domain], ["호스팅 제공자", business.hostingProvider],
] as const;

export function BusinessDetails() {
  return <dl className={s.businessRows}>{BUSINESS_ROWS.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return <section><h3>{title}</h3>{children}</section>;
}
function Contacts() {
  // Statutory values remain visible, not presented as support-action buttons.
  return <p>고객센터 {business.customerServicePhone}<br />{business.supportContactEmail}</p>;
}
function RefundRows({ ids }: { ids: readonly string[] }) {
  return <dl>{refundPolicyStateRows.filter(r => ids.includes(r.id)).map(r => <div key={r.id}><dt>{r.statusKo}</dt><dd>{r.handlingKo}</dd></div>)}</dl>;
}

const DETAIL_LINKS: Record<string, { index: number; label: string }> = { "사업자 정보": { index: 3, label: "사업자정보 확인" }, "청약철회 및 환불": { index: 2, label: "상세 환불정책 확인" }, "개인정보 처리": { index: 1, label: "개인정보처리방침 확인" } };
export function LegalDocument({ index, onNavigate }: { index: number; onNavigate?: (index: number) => void }) {
  if (index === 0) return <div className={s.legalDocument}><p>{termsPolicyDescriptionKo}</p>{termsPolicySections.map(section => <PolicySection title={section.titleKo} key={section.titleKo}>{section.bodyKo.map(p => <p key={p}>{p}</p>)}{DETAIL_LINKS[section.titleKo] ? <button type="button" className={s.policyCrossLink} onClick={() => onNavigate?.(DETAIL_LINKS[section.titleKo].index)}>{DETAIL_LINKS[section.titleKo].label}</button> : null}</PolicySection>)}</div>;
  if (index === 1) return <div className={s.legalDocument}>
    <p>{privacyPolicyProcessingScopeKo}</p>
    <PolicySection title="수집하는 개인정보 항목"><ul>{privacyPolicyCollectionItems.map(v => <li key={v}>{v}</li>)}</ul></PolicySection>
    <PolicySection title="수집·이용 목적"><ul>{privacyPolicyPurposeItems.map(v => <li key={v}>{v}</li>)}</ul><p>고객 문의 정보는 문의 확인, 환불·재생성 요청 처리, 서비스 장애 대응을 위해 필요한 범위에서 처리됩니다.</p></PolicySection>
    <PolicySection title="보유 및 이용기간"><p>{privacyPolicyServiceRetentionKo}</p><p>{privacyPolicyLegalRetentionKo}</p><table><caption>개인정보 항목별 보유기간</caption><thead><tr><th scope="col">구분</th><th scope="col">보유기간</th></tr></thead><tbody>{privacyPolicyRetentionRows.map(r => <tr key={r.categoryKo}><th scope="row">{r.categoryKo}</th><td>{r.periodKo}</td></tr>)}</tbody></table></PolicySection>
    <PolicySection title="결제 처리"><p>결제 거래정보는 결제 처리 및 결제 내역 확인을 위해 처리됩니다. 결제수단의 상세 정보는 결제대행사인 토스페이먼츠가 처리하며, 결리포트는 카드번호 등 결제수단 상세 정보를 직접 저장하지 않습니다.</p></PolicySection>
    <PolicySection title="리포트 생성"><p>이름 또는 닉네임, 생년월일, 출생시간, 성별, MBTI, 리포트 생성 및 열람 정보는 입력값 확인과 자동 생성 디지털 리포트 제공을 위해 처리됩니다.</p></PolicySection>
    <PolicySection title="처리위탁 또는 외부 서비스 이용"><table><caption>외부 서비스와 이용 목적</caption><thead><tr><th scope="col">서비스</th><th scope="col">이용 목적</th></tr></thead><tbody>{privacyPolicyExternalServiceRows.map(r => <tr key={r.providerKo}><th scope="row">{r.providerKo === "호스팅 제공자" ? business.hostingProvider : r.providerKo}</th><td>{r.purposeKo}</td></tr>)}</tbody></table></PolicySection>
    <PolicySection title="국외 처리 또는 국외 이전 가능성"><p>{privacyPolicyOverseasProcessingKo}</p></PolicySection>
    <PolicySection title="미성년자 이용"><p>{privacyPolicyUnder14Ko}</p><p>{privacyPolicyMinorNoticeKo}</p></PolicySection>
    <PolicySection title="민감정보 수집 제한"><p>{privacyPolicySensitiveInfoLimitKo}</p><p>{privacyPolicyNoResidentRegistrationNumberKo}</p></PolicySection>
    <PolicySection title="이용자의 권리"><p>{privacyPolicyUserRightsKo}</p></PolicySection>
    <PolicySection title="개인정보 문의처"><Contacts /></PolicySection>
  </div>;
  if (index === 2) return <div className={s.legalDocument}>
    <p>디지털 리포트의 취소, 환불 및 재제공 기준입니다.</p>
    <PolicySection title="결제·생성 단계별 처리 기준"><table><caption>취소 및 환불 가능 시점</caption><thead><tr><th scope="col">시점</th><th scope="col">처리 기준</th></tr></thead><tbody>{refundPolicyStateRows.filter(r => ["before_payment", "paid_before_generation", "generation_started", "generated"].includes(r.id)).map(r => <tr key={r.id}><th scope="row">{r.statusKo}</th><td>{r.handlingKo}</td></tr>)}</tbody></table><p>입력값 기반 자동 생성 디지털 콘텐츠로, 결제 후 온라인 열람 방식으로 제공됩니다. 사람 상담이 아닌 자기이해와 참고 목적의 무형재화입니다.</p><p>상품별 가격·제공기간·열람기간은 이용약관과 결제 직전 안내에서 확인할 수 있습니다.</p></PolicySection>
    <PolicySection title="결과 미제공·중복결제·장애 및 회사 귀책"><RefundRows ids={["generation_failed", "duplicate_payment", "system_error", "company_fault"]} /><p>{refundPolicyRequiredNotices[3]}</p></PolicySection>
    {refundPolicyStateRows.filter(r => ["wrong_input", "minor_cancellation"].includes(r.id)).map(r => <PolicySection title={r.statusKo} key={r.id}><p>{r.handlingKo}</p></PolicySection>)}
    <PolicySection title="문의 방법"><p>{refundPolicySupportRequestGuidanceKo}</p><Contacts /></PolicySection>
  </div>;
  return <div className={s.legalDocument}><p>결리포트를 운영하는 사업자 정보와 고객 문의 채널입니다.</p><BusinessDetails /></div>;
}

export function LegalAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  const entries = useRef<Array<HTMLDetailsElement | null>>([]);
  useEffect(() => { if (open !== null) entries.current[open]?.scrollIntoView({ block: "start" }); }, [open]);
  return <div className={s.legalAccordion} aria-label="정책 문서 미리보기">
    <p className={s.supportPresentation}>{SUPPORT_COPY} <a href="http://pf.kakao.com/_sbHaX/chat" target="_blank" rel="noopener noreferrer">카카오톡 문의 ↗</a></p>
    <p className={s.hint}>문의 경로 디자인 미리보기 · 아래 법적 문서는 현재 원문입니다.</p>
    {LEGAL_TITLES.map((title, i) => <details key={title} ref={node => { entries.current[i] = node; }} open={open === i} onToggle={e => { const expanded = e.currentTarget.open; setOpen(current => expanded ? i : current === i ? null : current); }}>
      <summary>{title}<span aria-hidden="true">+</span></summary><LegalDocument index={i} onNavigate={index => { setOpen(index); }} />
    </details>)}
  </div>;
}

// Native modal supplies focus containment, Escape and return-to-trigger behavior.
// Mounted only on request: no expanded policy text underneath the receipt.
export function DetailSheet({ title, onClose, children, closeLabel = "상세 닫기" }: { title: string; onClose: () => void; children: ReactNode; closeLabel?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { dialog.current?.showModal(); }, []);
  // Close natively before unmounting, so focus returns before the close event.
  const close = () => dialog.current?.close();
  return <dialog ref={dialog} className={s.detailSheet} aria-labelledby="detail-title" onCancel={e => { e.preventDefault(); close(); }} onClose={onClose} onClick={e => { if (e.target === e.currentTarget) close(); }}>
    <header><h2 id="detail-title">{title}</h2><button type="button" aria-label={closeLabel} onClick={close}>×</button></header>
    <div className={s.detailBody}>{children}</div>
  </dialog>;
}
