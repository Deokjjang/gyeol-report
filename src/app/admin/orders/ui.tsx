import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import styles from "../admin.module.css";
import { recentActivity, type OrderRow } from "../../../lib/ops/admin/data";
import { auditActionLabel, bookStatusLabel, kst, maskEmail, ORDER_CODE_RE, paymentStatusLabel, phaseLabel, productLabel, refundStateLabel, won } from "../../../lib/ops/admin/format";
import { createOpsStores } from "../../../lib/ops/store";

/** activity: 맨 위 "최근 관리자 동작" 패널(메일 알림이 없어 이 패널이 알림을 대신한다). */
export function AdminShell({ children, activity = true }: { children: ReactNode; activity?: boolean }) {
  return (
    <div className={styles.root}>
      <header className={styles.header}><Link href="/admin/orders">결리포트 운영</Link><span className={styles.note}>관리자 전용</span></header>
      <main className={styles.wrap}>{activity ? <RecentActivity /> : null}{children}</main>
    </div>
  );
}

/** 관리자 로그인이 12시간(ADMIN_SESSION_HOURS)을 지났을 때: 데이터 없이 다시 로그인만. */
export function ExpiredView() {
  return (
    <AdminShell activity={false}>
      <h1>다시 로그인해 주세요</h1>
      <p className={styles.note}>관리자 화면은 로그인 후 일정 시간(기본 12시간)만 열려요.</p>
      <p><Link className={styles.primary} style={{ display: "inline-block", textDecoration: "none" }} href="/login?next=/admin/orders">다시 로그인</Link></p>
    </AdminShell>
  );
}

async function RecentActivity() {
  const rows = await recentActivity(createOpsStores().db, 20);
  return (
    <details className={styles.activity} open>
      <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 13 }}>최근 관리자 동작{rows ? ` (${rows.length})` : ""}</summary>
      {!rows ? <p className={styles.error}>불러오지 못했어요.</p> : rows.length === 0 ? <p className={styles.note}>아직 없어요.</p> : (
        <ul className={styles.list} style={{ gap: 2, marginTop: 8 }}>{rows.map(r => (
          <li key={r.id} className={styles.meta}>
            <span>{kst(r.created_at)}</span>
            <b style={{ color: r.action === "refund_failed" || r.action === "refund_blocked_cap" || r.action === "admin_pin_failed" ? "#b3261e" : "#111" }}>{auditActionLabel(r.action)}</b>
            {ORDER_CODE_RE.test(r.target) ? <Link className={styles.mono} href={`/admin/orders/${r.target}`}>{r.target}</Link> : <span className={styles.mono}>{r.target}</span>}
            <span>{r.actor === "admin" ? `관리자 ${r.actor_user_id ? `${r.actor_user_id.slice(0, 8)}…` : ""}` : "시스템"}</span>
          </li>
        ))}</ul>
      )}
    </details>
  );
}

export function Dl({ rows }: { rows: readonly (readonly [string, ReactNode])[] }) {
  return <dl className={styles.dl}>{rows.map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v === null || v === undefined || v === "" ? "-" : v}</dd></Fragment>)}</dl>;
}

export function Badge({ children, alert = false }: { children: ReactNode; alert?: boolean }) {
  return <span className={alert ? `${styles.badge} ${styles.alert}` : styles.badge}>{children}</span>;
}

/** 주문 한 줄(검색·지연 목록 공통). 누르면 상세. */
export function OrderItem({ o }: { o: OrderRow }) {
  const attention = o.bookStatus === "FAILED_REQUIRES_ATTENTION" || o.jobStatus === "FAILED_REQUIRES_ATTENTION" || o.edition === "gave_up";
  return (
    <li className={styles.item}>
      <Link href={`/admin/orders/${encodeURIComponent(o.orderCode)}`}>
        <div className={styles.itemHead}><span className={styles.mono}>{o.orderCode}</span><span>{productLabel(o.productType)}</span><span>{won(o.amount)}</span></div>
        <div className={styles.meta}>
          <span>{kst(o.createdAt)}</span>
          <span>{o.buyerName ?? "이름 없음"}{o.buyerEmail ? ` · ${maskEmail(o.buyerEmail)}` : ""}</span>
          {o.providerOrderId ? <span className={styles.mono}>{o.providerOrderId}</span> : null}
        </div>
        <div className={styles.badges}>
          <Badge>{paymentStatusLabel(o.paymentStatus)}</Badge>
          {o.bookStatus ? <Badge alert={attention}>Book {bookStatusLabel(o.bookStatus)}</Badge> : null}
          {o.edition ? <Badge alert={o.edition === "gave_up"}>{phaseLabel(o.edition)}</Badge> : null}
          {o.failures ? <Badge alert>실패 {o.failures}회</Badge> : null}
          {o.refundState ? <Badge alert>환불 {refundStateLabel(o.refundState)}</Badge> : null}
          {o.openRequests > 0 ? <Badge alert>문의 {o.openRequests}</Badge> : null}
          {o.userId ? <Badge>회원</Badge> : <Badge>비회원</Badge>}
          {o.legacy ? <Badge>기존 주문</Badge> : null}
        </div>
        {o.lastReason ? <p className={styles.note}>최근 사유: {o.lastReason}</p> : null}
      </Link>
    </li>
  );
}

export function LoadError({ code }: { code: string }) {
  return <p className={styles.error} role="alert">불러오지 못했어요 ({code}). 잠시 뒤 새로고침해 주세요.</p>;
}
