import type { ReactNode } from "react";
import Link from "next/link";
import { SUPPORT_CHAT_LABEL, SUPPORT_CHAT_URL, SUPPORT_PAGE_ADDRESS_HINT } from "../../lib/legal/socialLinks";
import { GENERATION_STAGES, type GenerationStage, type WaitingTone } from "./generationProgress";
import { BookPublishingVisual } from "./BookPublishingVisual";
import styles from "./reportStatus.module.css";

/** 생성 대기 화면(state="waiting")만 넘긴다: 문구 갈래 · 실제 단계 · 바뀌는 숫자 줄(n/전체 장 · 경과 시간) · 1장 먼저 읽기. */
export type WaitingView = { readonly tone: WaitingTone; readonly stage: GenerationStage; readonly numbers: string | null; readonly preview?: ReactNode };
type ReportStatusViewProps = {
  /** attention = 발행된 책이 이번 열람 검사에 걸림(readRejected) — 안내와 문의만. 생성 대기·자동 환불은 waiting. */
  readonly state: "waiting" | "attention" | "expired" | "payment-check" | "reading" | "unavailable" | "refunded";
  readonly title?: string;
  readonly message?: string;
  readonly support?: boolean;
  readonly waiting?: WaitingView;
};

/** 쓰는 중인 화면(단계·숫자·그림을 보인다). 확인 중·환불·반환은 그림 없이 문구만. */
const MAKING_TONES: ReadonlySet<WaitingTone> = new Set(["start", "delay", "apology", "ready"]);

function PublicationStages({ stage }: { readonly stage: GenerationStage }) {
  const at = GENERATION_STAGES.findIndex(s => s.key === stage);
  return (
    <ol className={styles.stages} aria-label="책이 만들어지는 순서">
      {GENERATION_STAGES.map(({ key, label }, i) => (
        <li key={key} aria-current={i === at ? "step" : undefined} data-done={i < at ? "true" : undefined}>{label}</li>
      ))}
    </ol>
  );
}

/** 책 쓰기 단계의 그림: 종이에 줄이 한 줄씩 써지는 모습. 동작 줄이기 설정이면 줄이 다 그려진 종이로 멈춘다(빈 종이 없음, CSS). */
function WritingPage() {
  return <div className={styles.visual} aria-hidden="true"><div className={styles.writing} data-writing>{[0, 1, 2, 3, 4, 5, 6].map(i => <i key={i} />)}</div></div>;
}
function StageVisual({ stage }: { readonly stage: GenerationStage }) {
  return stage === "writing" ? <WritingPage /> : <BookPublishingVisual stage={stage} />;
}

const copy = {
  unavailable: { title: "책을 확인하지 못했습니다.", message: "잠시 후 다시 열어 주세요." },
  refunded: { title: "환불된 주문의 책이라 열 수 없어요", message: "환불이 끝난 주문이라 이 책은 더 이상 열 수 없어요." },
  reading: { title: "책장을 펼치고 있습니다.", message: "잠시만 기다려 주세요." },
  waiting: { title: "책을 쓰고 있어요", message: "보통 3분 안팎 걸려요. 창을 닫아도 계속 만들고, 다 되면 내 서재에 들어가요." },
  attention: { title: "리포트를 여는 데 확인이 필요합니다", message: "책은 저장돼 있어요. 문의해 주시면 바로 확인해 드릴게요." },
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

export function ReportStatusView({ state, title, message, support: supportProp = false, waiting }: ReportStatusViewProps) {
  const view = state === "waiting" ? waiting ?? { tone: "start" as const, stage: "compute" as const, numbers: null } : null;
  const making = view !== null && MAKING_TONES.has(view.tone);
  const library = view !== null && (view.tone === "refunded" || view.tone === "returned");
  const support = supportProp || state === "attention";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <p className={styles.brand}><Link href="/" aria-label="결리포트 홈">GYEOL REPORT</Link></p>
        <section className={styles.content} aria-labelledby="report-status-title" {...(view ? { "data-waiting": view.tone } : {})}>
          {making ? <StageVisual stage={view.stage} /> : state === "payment-check" || state === "reading" ? <BookPublishingVisual /> : null}
          <div className={styles.body}>
            <div role="status" aria-live="polite" aria-atomic="true">
              <h1 id="report-status-title" className={styles.title}>{title ?? copy[state].title}</h1>
              {(message ?? copy[state].message) ? <p className={styles.message}>{message ?? copy[state].message}</p> : null}
            </div>
            {/* 바뀌는 숫자(장 수·경과 시간)는 알림 영역 밖에 둔다 — 화면 읽기 프로그램이 매초 읽지 않게. */}
            {making && view.numbers ? <p className={styles.numbers} data-chapter-progress>{view.numbers}</p> : null}
            {making ? <PublicationStages stage={view.stage} /> : null}
            {making && view.preview ? view.preview : null}
            {/* 운영 Q: 상담 창구는 카카오톡 채널 링크 하나(전화·이메일 링크 없음). */}
            {support ? (
              <div className={styles.note}>
                {state === "attention" ? <p>추가 결제는 필요 없어요.<br />{SUPPORT_PAGE_ADDRESS_HINT}</p> : view ? <p>{SUPPORT_PAGE_ADDRESS_HINT}</p> : null}
                <nav className={styles.links} aria-label="문의">
                  <a href={SUPPORT_CHAT_URL} target="_blank" rel="noopener noreferrer">{SUPPORT_CHAT_LABEL} <span aria-hidden="true">↗</span></a>
                </nav>
              </div>
            ) : null}
            {library ? <nav className={styles.links} aria-label="안내"><Link href="/account">내 서재 <span aria-hidden="true">↗</span></Link></nav> : null}
            {state === "refunded" ? <nav className={styles.links} aria-label="안내"><Link href="/account">내 서재 <span aria-hidden="true">↗</span></Link><a href={SUPPORT_CHAT_URL} target="_blank" rel="noopener noreferrer">{SUPPORT_CHAT_LABEL} <span aria-hidden="true">↗</span></a></nav> : null}
            {state === "expired" && (message ?? copy[state].message) ? <nav className={styles.links} aria-label="리포트 탐색"><Link href="/">홈으로 돌아가기 <span aria-hidden="true">↗</span></Link></nav> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
