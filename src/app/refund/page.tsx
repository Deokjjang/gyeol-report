import LegalPageLayout from "../../components/legal/LegalPageLayout";
import styles from "../../components/legal/legal.module.css";
import { GYEOL_BUSINESS_INFO } from "../../lib/legal/businessInfo";
import {
  refundPolicyRequiredNotices,
  refundPolicyStateRows,
  refundPolicySupportRequestGuidanceKo,
} from "../../lib/legal/refundPolicy";

const summaryRows = refundPolicyStateRows.filter((row) =>
  ["before_payment", "paid_before_generation", "generation_started", "generated"].includes(row.id),
);
const recoveryRows = refundPolicyStateRows.filter((row) =>
  ["generation_failed", "duplicate_payment", "system_error", "company_fault"].includes(row.id),
);
const individualRows = refundPolicyStateRows.filter((row) =>
  ["wrong_input", "minor_cancellation"].includes(row.id),
);

export default function RefundPage() {
  return (
    <LegalPageLayout titleKo="환불정책" descriptionKo="디지털 리포트의 취소, 환불 및 재제공 기준입니다." currentPath="/refund">
      <section>
        <h2>결제·생성 단계별 처리 기준</h2>
        <table>
          <caption>취소 및 환불 가능 시점</caption>
          <thead><tr><th scope="col">시점</th><th scope="col">처리 기준</th></tr></thead>
          <tbody>
            {summaryRows.map((row) => (
              <tr key={row.id}><th scope="row">{row.statusKo}</th><td>{row.handlingKo}</td></tr>
            ))}
          </tbody>
        </table>
        <p>입력값 기반 자동 생성 디지털 콘텐츠로, 결제 후 온라인 열람 방식으로 제공됩니다. 사람 상담이 아닌 자기이해와 참고 목적의 무형재화입니다.</p>
        <p>상품별 가격·제공기간·열람기간은 <a href="/terms">이용약관</a>과 결제 직전 안내에서 확인할 수 있습니다.</p>
      </section>
      <section>
        <h2>결과 미제공·중복결제·장애 및 회사 귀책</h2>
        <dl>
          {recoveryRows.map((row) => (
            <div key={row.id}><dt>{row.statusKo}</dt><dd>{row.handlingKo}</dd></div>
          ))}
        </dl>
        <p>{refundPolicyRequiredNotices[3]}</p>
      </section>
      {individualRows.map((row) => (
        <section key={row.id}><h2>{row.statusKo}</h2><p>{row.handlingKo}</p></section>
      ))}
      <section>
        <h2>문의 방법</h2>
        <p>{refundPolicySupportRequestGuidanceKo}</p>
        <div className={styles.contacts}>
          <a href={`tel:${GYEOL_BUSINESS_INFO.customerServicePhone}`}>고객센터 {GYEOL_BUSINESS_INFO.customerServicePhone}</a>
          <a href={`mailto:${GYEOL_BUSINESS_INFO.supportContactEmail}`}>{GYEOL_BUSINESS_INFO.supportContactEmail}</a>
        </div>
      </section>
    </LegalPageLayout>
  );
}
