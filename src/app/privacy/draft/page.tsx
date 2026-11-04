import LegalPageLayout from "../../../components/legal/LegalPageLayout";
import {
  PRIVACY_DRAFT_VERSION, privacyDraftCollection, privacyDraftDestructionKo, privacyDraftMarketingKo, privacyDraftProcessors, privacyDraftPurposes,
  privacyDraftRetention, privacyDraftRightsKo, privacyDraftThirdParty,
} from "../../../lib/legal/privacyPolicyDraft";

export const metadata = { title: "개인정보처리방침(개정 초안)", robots: { index: false, follow: false } };

/** P6d-ops 개정 초안(운영 반영 전). 운영 /privacy는 그대로다. */
export default function PrivacyDraftPage() {
  return <LegalPageLayout titleKo="개인정보처리방침 (개정 초안)" descriptionKo={`초안 ${PRIVACY_DRAFT_VERSION} · 배포 때 확정합니다. 지금 적용 중인 방침은 /privacy에 있습니다.`} currentPath="/privacy">
    <section><h2>수집하는 개인정보 항목</h2><table><thead><tr><th scope="col">어디서</th><th scope="col">항목</th></tr></thead><tbody>{privacyDraftCollection.map(r => <tr key={r.sourceKo}><td>{r.sourceKo}</td><td>{r.itemsKo}</td></tr>)}</tbody></table></section>
    <section><h2>수집·이용 목적</h2><ul>{privacyDraftPurposes.map(p => <li key={p}>{p}</li>)}</ul><p>{privacyDraftMarketingKo}</p></section>
    <section><h2>보관 기간</h2><table><thead><tr><th scope="col">항목</th><th scope="col">기간</th></tr></thead><tbody>{privacyDraftRetention.map(r => <tr key={r.categoryKo}><td>{r.categoryKo}</td><td>{r.periodKo}</td></tr>)}</tbody></table></section>
    <section><h2>파기 절차와 방법</h2><ul>{privacyDraftDestructionKo.map(p => <li key={p}>{p}</li>)}</ul></section>
    <section><h2>제3자 제공</h2><table><thead><tr><th scope="col">받는 곳</th><th scope="col">목적</th><th scope="col">항목</th><th scope="col">보유 기간</th></tr></thead><tbody>{privacyDraftThirdParty.map(r => <tr key={r.recipientKo}><td>{r.recipientKo}</td><td>{r.purposeKo}</td><td>{r.itemsKo}</td><td>{r.periodKo}</td></tr>)}</tbody></table></section>
    <section><h2>처리 위탁·국외 처리</h2><table><thead><tr><th scope="col">수탁자</th><th scope="col">업무</th><th scope="col">국외</th></tr></thead><tbody>{privacyDraftProcessors.map(r => <tr key={r.providerKo}><td>{r.providerKo}</td><td>{r.purposeKo}</td><td>{r.overseas ? "예" : "아니오"}</td></tr>)}</tbody></table></section>
    <section><h2>이용자의 권리</h2><p>{privacyDraftRightsKo}</p></section>
  </LegalPageLayout>;
}
