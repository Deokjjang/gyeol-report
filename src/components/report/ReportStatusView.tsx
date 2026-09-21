import Link from "next/link";
import GyeolBrandHeader from "../brand/GyeolBrandHeader";
import { GYEOL_BUSINESS_INFO } from "../../lib/legal/businessInfo";
import styles from "./reportStatus.module.css";

type ReportStatusViewProps = {
  readonly state: "preparing" | "delayed" | "attention" | "expired" | "payment-check";
  readonly title?: string;
  readonly message?: string;
  readonly support?: boolean;
};

const copy = {
  preparing: {
    title: "리포트를 준비하고 있습니다",
    message: "입력하신 정보를 바탕으로 나를 이해하는 리포트를 구성하고 있습니다.",
  },
  delayed: {
    title: "리포트를 준비하고 있습니다",
    message: "평소보다 시간이 조금 더 걸리고 있습니다. 완성된 리포트를 보여드릴 수 있도록 준비를 이어가고 있습니다.",
  },
  attention: {
    title: "리포트 준비에 확인이 필요합니다",
    message: "리포트 준비가 예상보다 오래 걸리고 있습니다. 고객센터에 문의해 주시면 결제 내역과 제공 상태를 확인해 드리겠습니다.",
  },
  expired: {
    title: "리포트 열람 기간이 종료되었습니다",
    message: "생성일로부터 90일의 온라인 열람 기간이 지났습니다. 리포트와 입력 정보는 보관 정책에 따라 순차적으로 삭제될 수 있습니다.",
  },
  "payment-check": {
    title: "결제 상태를 확인하고 있습니다",
    message: "확인이 끝나면 리포트 준비 화면으로 이어집니다.",
  },
} as const;

export function ReportStatusView({ state, title, message, support = false }: ReportStatusViewProps) {
  const waiting = state === "preparing" || state === "delayed";
  const paid = waiting || state === "attention";
  const showSupport = support || state === "attention";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <GyeolBrandHeader />
        <section className={styles.content} aria-labelledby="report-status-title">
          <div className={`${styles.visual} ${waiting ? styles.moving : ""}`} aria-hidden="true">
            <svg viewBox="0 0 240 240" fill="none" focusable="false" aria-hidden="true">
              <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                <path d="M24 120H216M120 24V216" opacity=".2" />
                <circle cx="120" cy="120" r="82" opacity=".35" />
                <ellipse cx="120" cy="120" rx="94" ry="42" transform="rotate(-35 120 120)" />
                <ellipse cx="120" cy="120" rx="42" ry="72" transform="rotate(-35 120 120)" opacity=".6" />
                <path d="M62 62L178 178" opacity=".35" />
              </g>
              <g className={styles.nodes}>
                <circle cx="120" cy="120" r="5" fill="currentColor" />
                <circle cx="187" cy="73" r="3.5" fill="currentColor" />
                <circle cx="53" cy="167" r="3" fill="currentColor" />
                <circle cx="120" cy="38" r="3" fill="currentColor" />
              </g>
            </svg>
          </div>
          <div className={styles.body}>
            {paid ? <p className={styles.eyebrow}>결제가 정상적으로 완료되었습니다.</p> : null}
            <div role="status" aria-live="polite" aria-atomic="true">
              <h1 id="report-status-title" className={styles.title}>{title ?? copy[state].title}</h1>
              <p className={styles.message}>{message ?? copy[state].message}</p>
            </div>
            {waiting ? (
              <div className={styles.note}>
                <p>완성되면 이 화면에서 자동으로 보여드립니다.</p>
                <p>페이지를 닫아도 준비는 계속됩니다.<br />이 주소를 저장해 두시면 다시 확인하실 수 있습니다.</p>
              </div>
            ) : null}
            {showSupport ? (
              <div className={styles.note}>
                {state === "attention" ? <p>추가 결제는 필요하지 않습니다.<br />문의하실 때 이 페이지 주소를 함께 알려 주세요.</p> : null}
                <nav className={styles.links} aria-label="고객센터">
                  <a href={`tel:${GYEOL_BUSINESS_INFO.customerServicePhone}`}>{GYEOL_BUSINESS_INFO.customerServicePhone}</a>
                  <a href={`mailto:${GYEOL_BUSINESS_INFO.supportContactEmail}`}>{GYEOL_BUSINESS_INFO.supportContactEmail}</a>
                </nav>
              </div>
            ) : null}
            {state === "expired" ? <nav className={styles.links} aria-label="리포트 탐색"><Link href="/">홈으로 돌아가기 <span aria-hidden="true">↗</span></Link></nav> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
