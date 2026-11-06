import { useEffect, useRef, useState, type ReactNode } from "react";
import { GYEOL_BUSINESS_INFO as business } from "../../../lib/legal/businessInfo";
import { termsPolicyDescriptionKo, termsPolicySections } from "../../../lib/legal/termsPolicy";
import { privacyPolicyProcessingScopeKo, privacyPolicySections } from "../../../lib/legal/privacyPolicy";
import { PolicyBlocks } from "../../../components/legal/PolicyBlocks";
import { refundPolicyHistoryLinesKo, refundPolicyRequiredNotices, refundPolicyStateRows } from "../../../lib/legal/refundPolicy";
import { REFUND_POLICY_TOP_LINES, SUPPORT_CHAT_LABEL, SUPPORT_CHAT_URL } from "../../../lib/legal/socialLinks";
import s from "./book.module.css";

// Presentation only. Policy data is imported unchanged; route-only passages below
// mirror the existing public documents and are covered by full-text parity tests.
// 운영 Q(2026-11-07.1)에서 일부러 다르게 한 곳: 환불정책 맨 위 3줄(설명 한 줄·「문의 방법」 절 대신), 개인정보처리방침 끝 「개인정보 문의처」 줄 없음.
export const LEGAL_TITLES = ["이용약관", "개인정보처리방침", "환불정책", "사업자 정보"] as const;
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
function RefundRows({ ids }: { ids: readonly string[] }) {
  return <dl>{refundPolicyStateRows.filter(r => ids.includes(r.id)).map(r => <div key={r.id}><dt>{r.statusKo}</dt><dd>{r.handlingKo}</dd></div>)}</dl>;
}

const DETAIL_LINKS: Record<string, { index: number; label: string }> = { "사업자 정보": { index: 3, label: "사업자정보 확인" }, "청약철회 및 환불": { index: 2, label: "상세 환불정책 확인" }, "개인정보 처리": { index: 1, label: "개인정보처리방침 확인" } };
export function LegalDocument({ index, onNavigate }: { index: number; onNavigate?: (index: number) => void }) {
  if (index === 0) return <div className={s.legalDocument}><p>{termsPolicyDescriptionKo}</p>{termsPolicySections.map(section => <PolicySection title={section.titleKo} key={section.titleKo}>{section.bodyKo.map(p => <p key={p}>{p}</p>)}{DETAIL_LINKS[section.titleKo] ? <button type="button" className={s.policyCrossLink} onClick={() => onNavigate?.(DETAIL_LINKS[section.titleKo].index)}>{DETAIL_LINKS[section.titleKo].label}</button> : null}</PolicySection>)}</div>;
  // 개인정보처리방침(최종3): 원문 sections를 그대로 그린다(/privacy 예전 화면과 같은 원본).
  if (index === 1) return <div className={s.legalDocument}>
    <p>{privacyPolicyProcessingScopeKo}</p>
    {privacyPolicySections.map(section => <PolicySection title={section.titleKo} key={section.titleKo}><PolicyBlocks blocks={section.blocks} /></PolicySection>)}
    {/* 운영 Q: 끝의 「개인정보 문의처」(고객센터 전화·이메일) 줄은 뺐다 — 연락처는 원문 8번(권리 행사)·12번(보호책임자)에 그대로 있다. */}
  </div>;
  // 운영 Q(2026-11-07.1): 환불정책 맨 위 3줄(문의·환불 안내는 여기 한 곳). 예전 「문의 방법」 절(전화·이메일)은 뺐다.
  if (index === 2) return <div className={s.legalDocument}>
    <div data-refund-top>{REFUND_POLICY_TOP_LINES.map((line, i) => <p key={line}>{line}{i === REFUND_POLICY_TOP_LINES.length - 1 ? <> <a href={SUPPORT_CHAT_URL} target="_blank" rel="noopener noreferrer">{SUPPORT_CHAT_LABEL} ↗</a></> : null}</p>)}</div>
    <PolicySection title="결제·생성 단계별 처리 기준"><table><caption>취소 및 환불 가능 시점</caption><thead><tr><th scope="col">시점</th><th scope="col">처리 기준</th></tr></thead><tbody>{refundPolicyStateRows.filter(r => ["before_payment", "paid_before_generation", "generation_started", "generated"].includes(r.id)).map(r => <tr key={r.id}><th scope="row">{r.statusKo}</th><td>{r.handlingKo}</td></tr>)}</tbody></table><p>입력값 기반 자동 생성 디지털 콘텐츠로, 결제 후 온라인 열람 방식으로 제공됩니다. 사람 상담이 아닌 자기이해와 참고 목적의 무형재화입니다.</p><p>상품별 가격·제공기간·열람기간은 이용약관과 결제 직전 안내에서 확인할 수 있습니다.</p></PolicySection>
    <PolicySection title="결과 미제공·중복결제·장애 및 회사 귀책"><RefundRows ids={["generation_failed", "duplicate_payment", "system_error", "company_fault"]} /><p>{refundPolicyRequiredNotices[3]}</p></PolicySection>
    {refundPolicyStateRows.filter(r => ["ticket_report", "wrong_input", "minor_cancellation"].includes(r.id)).map(r => <PolicySection title={r.statusKo} key={r.id}><p>{r.handlingKo}</p></PolicySection>)}
    <PolicySection title="시행일">{refundPolicyHistoryLinesKo.map(line => <p key={line}>{line}</p>)}</PolicySection>
  </div>;
  return <div className={s.legalDocument}><p>결리포트를 운영하는 사업자 정보와 고객 문의 채널입니다.</p><BusinessDetails /></div>;
}

export function LegalAccordion({ publicPresentation = false }: { publicPresentation?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const entries = useRef<Array<HTMLDetailsElement | null>>([]);
  useEffect(() => { if (open !== null) entries.current[open]?.scrollIntoView({ block: "start" }); }, [open]);
  return <div className={s.legalAccordion} aria-label="정책 문서 미리보기">
    {!publicPresentation ? <p className={s.hint}>문의 경로 디자인 미리보기 · 아래 법적 문서는 현재 원문입니다.</p> : null}
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
