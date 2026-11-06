import Link from "next/link";
import { SUPPORT_CHAT_LABEL, SUPPORT_CHAT_URL, SUPPORT_PAGE_ADDRESS_HINT } from "../../lib/legal/socialLinks";
import { BookPublishingVisual } from "./BookPublishingVisual";
import styles from "./reportStatus.module.css";

type ReportStatusViewProps = {
  readonly state: "preparing" | "delayed" | "attention" | "expired" | "payment-check" | "reading" | "unavailable" | "refunded";
  readonly title?: string;
  readonly message?: string;
  readonly support?: boolean;
  /** 진행 단계(0~4). 생성 대기 화면에서만 넘긴다. */
  readonly stage?: number;
};

/** 책이 만들어지는 순서(실제 생성 순서와 같다: 계산 → 근거 연결 → 집필 → 검수 → 저장). */
export const PUBLICATION_STAGES = ["원국 분석", "성향 연결", "책 집필", "검수", "제본"] as const;
const WRITING_STAGE = 2;

function PublicationStages({ stage }: { readonly stage: number }) {
  return (
    <ol className={styles.stages} aria-label="책이 만들어지는 순서">
      {PUBLICATION_STAGES.map((label, i) => (
        <li key={label} aria-current={i === stage ? "step" : undefined} data-done={i < stage ? "true" : undefined}>{label}</li>
      ))}
    </ol>
  );
}

/** 책 집필 단계의 장식: 종이에 줄이 한 줄씩 써지는 모습. 진행 표시 자체라 동작 줄이기 설정에서도 움직인다(2-1 #7). */
function WritingPage() {
  return <div className={styles.visual} aria-hidden="true"><div className={styles.writing}>{[0, 1, 2, 3, 4, 5, 6].map(i => <i key={i} />)}</div></div>;
}

const copy = {
  unavailable: { title: "책을 확인하지 못했습니다.", message: "잠시 후 다시 열어 주세요." },
  refunded: { title: "환불된 주문의 책이라 열 수 없어요", message: "환불이 끝난 주문이라 이 책은 더 이상 열 수 없어요." },
  reading: { title: "책장을 펼치고 있습니다.", message: "잠시만 기다려 주세요." },
  preparing: {
    title: "책을 제본하고 있습니다",
    message: "입력하신 정보를 바탕으로 나를 이해하는 리포트를 구성하고 있습니다.",
  },
  delayed: {
    title: "책을 제본하고 있습니다",
    message: "평소보다 조금 더 걸리고 있습니다. 완성된 리포트를 보여드릴 수 있도록 준비를 이어가고 있습니다.",
  },
  attention: {
    title: "리포트 준비에 확인이 필요합니다",
    message: "리포트 준비가 예상보다 오래 걸리고 있어요.",
  },
  expired: {
    // P 추가 B: 기한이 지난 책 링크는 한 줄만(v5 리포트는 기한이 없어 탈퇴·삭제 요청으로만 닫힌다).
    title: "열람 기간이 끝난 리포트예요",
    message: "",
  },
  "payment-check": {
    title: "결제 상태를 확인하고 있습니다",
    message: "확인이 끝나면 리포트 준비 화면으로 이어집니다.",
  },
} as const;

export function ReportStatusView({ state, title, message, support = false, stage }: ReportStatusViewProps) {
  const waiting = state === "preparing" || state === "delayed";
  const showSupport = support || state === "attention";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <p className={styles.brand}><Link href="/" aria-label="결리포트 홈">GYEOL REPORT</Link></p>
        <section className={styles.content} aria-labelledby="report-status-title">
          {waiting && stage === WRITING_STAGE ? <WritingPage /> : waiting || state === "payment-check" || state === "reading" ? <BookPublishingVisual animate={waiting} /> : null}
          <div className={styles.body}>
            <div role="status" aria-live="polite" aria-atomic="true">
              <h1 id="report-status-title" className={styles.title}>{title ?? copy[state].title}</h1>
              {(message ?? copy[state].message) ? <p className={styles.message}>{message ?? copy[state].message}</p> : null}
            </div>
            {waiting && stage !== undefined ? <PublicationStages stage={stage} /> : null}
            {waiting ? (
              <div className={styles.note}>
                <p>완성되면 이 화면에서 자동으로 보여드립니다.</p>
                <p>페이지를 닫아도 준비는 계속됩니다.<br />이 주소를 저장해 두시면 다시 확인하실 수 있습니다.</p>
              </div>
            ) : null}
            {/* 운영 Q: 상담 창구는 카카오톡 채널 링크 하나(전화·이메일 링크 없음). */}
            {showSupport ? (
              <div className={styles.note}>
                {state === "attention" ? <p>추가 결제는 필요 없어요.<br />{SUPPORT_PAGE_ADDRESS_HINT}</p> : null}
                <nav className={styles.links} aria-label="문의">
                  <a href={SUPPORT_CHAT_URL} target="_blank" rel="noopener noreferrer">{SUPPORT_CHAT_LABEL} <span aria-hidden="true">↗</span></a>
                </nav>
              </div>
            ) : null}
            {state === "refunded" ? <nav className={styles.links} aria-label="안내"><Link href="/account">내 서재 <span aria-hidden="true">↗</span></Link><a href={SUPPORT_CHAT_URL} target="_blank" rel="noopener noreferrer">{SUPPORT_CHAT_LABEL} <span aria-hidden="true">↗</span></a></nav> : null}
            {state === "expired" && (message ?? copy[state].message) ? <nav className={styles.links} aria-label="리포트 탐색"><Link href="/">홈으로 돌아가기 <span aria-hidden="true">↗</span></Link></nav> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
