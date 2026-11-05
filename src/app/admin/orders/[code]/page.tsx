import Link from "next/link";
import type { ReactNode } from "react";
import styles from "../../admin.module.css";
import { adminPageGate } from "../../../../lib/ops/admin/access";
import { adminPinConfigured } from "../../../../lib/ops/admin/config";
import { orderDetail, type OrderDetail } from "../../../../lib/ops/admin/data";
import {
  bookStatusLabel, duration, genderLabel, jobLabel, jobStatusLabel, kst, laneLabel, maskEmail, maskKey, maskPhone, ORDER_CODE_RE, outcomeLabel, paymentStatusLabel,
  phaseLabel, productLabel, refundSourceLabel, refundStateLabel, relationshipLabel, relationshipTypeLabel, requestReasonLabel, usd, won,
} from "../../../../lib/ops/admin/format";
import { manseSummary } from "../../../../lib/ops/admin/manse";
import type { Json } from "../../../../lib/ops/admin/rpc";
import { createOpsStores } from "../../../../lib/ops/store";
import { birthTimeSlotLabel } from "../../../../lib/saju/birthTimePrecisionTypes";
import { SAJU_CALENDAR_VERSION } from "../../../../lib/saju/calendarVersion";
import { OrderActions, RequestDoneForm, RevealPii, type OrderActionsProps } from "../AdminClient";
import { AdminShell, Badge, Dl, ExpiredView, LoadError } from "../ui";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" as const };

const s = (v: unknown): string => typeof v === "string" ? v : typeof v === "number" ? String(v) : "";
const obj = (v: unknown): Json | null => v && typeof v === "object" && !Array.isArray(v) ? v as Json : null;

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  if ((await adminPageGate()).kind === "expired") return <ExpiredView />;
  const code = (await params).code.toUpperCase();
  const back = <p className={styles.note}><Link href="/admin/orders">← 주문 목록</Link></p>;
  if (!ORDER_CODE_RE.test(code)) return <AdminShell>{back}<p className={styles.error}>주문코드 형식이 아니에요.</p></AdminShell>;
  const r = await orderDetail(createOpsStores().db, code);
  if (!r.ok) return <AdminShell>{back}{r.code === "ORDER_NOT_FOUND" ? <p className={styles.error}>주문 {code}을(를) 찾지 못했어요.</p> : <LoadError code={r.code} />}</AdminShell>;
  const d = r.value, o = d.order;
  return (
    <AdminShell>
      {back}
      <p className={styles.eyebrow}>ORDER</p>
      <h1 className={styles.mono} style={{ fontSize: 22 }}>{o.orderCode}</h1>
      <div className={styles.badges} style={{ marginBottom: 12 }}>
        <Badge>{paymentStatusLabel(o.status)}</Badge>
        {d.book ? <Badge alert={d.book.status === "FAILED_REQUIRES_ATTENTION"}>Book {bookStatusLabel(d.book.status)}</Badge> : null}
        {d.state ? <Badge alert={d.state.phase === "gave_up"}>{phaseLabel(d.state.phase)}</Badge> : null}
        {d.refund ? <Badge alert>환불 {refundStateLabel(d.refund.state)}</Badge> : null}
      </div>
      <Section title="작업"><OrderActions {...actionProps(d)} /></Section>
      <Section title="주문"><Dl rows={[
        ["상품", productLabel(o.productType)], ["금액", won(o.amount)], ["결제 상태", paymentStatusLabel(o.status)],
        ["토스 주문번호", <span key="p" className={styles.mono}>{s(o.providerOrderId) || "-"}</span>],
        ["결제 주문 id", <span key="i" className={styles.mono}>{o.paymentOrderId}</span>],
        ["결제 키", <span key="k" className={styles.mono}>{maskKey(o.paymentKey)}</span>],
        ["구매자", s(o.buyerName)],
        ["이메일", <RevealPii key="e" orderCode={o.orderCode} field="email" masked={maskEmail(o.buyerEmail)} />],
        ["전화", <RevealPii key="t" orderCode={o.orderCode} field="phone" masked={maskPhone(o.buyerPhone)} />],
        ["계정", o.userId ? <span key="u" className={styles.mono}>{o.userId}</span> : "비회원"],
        ["주문", kst(o.createdAt)], ["결제", kst(o.paidAt)], ["환불", kst(o.refundedAt)],
        ["영수증", s(o.receiptUrl).startsWith("https://") ? <a key="r" href={s(o.receiptUrl)} target="_blank" rel="noreferrer noopener">영수증 열기</a> : "-"],
        ["안내 버전", s(o.noticeVersion)], ["기존 주문", o.legacy === true ? "예(주문코드 나중에 부여)" : "아니요"],
      ]} /></Section>
      <InputSection input={d.input} />
      <Section title="Book">{!d.book ? <p className={styles.note}>Book 기록이 없어요.</p> : <Dl rows={[
        ["열기", o.reportId ? <Link key="b" href={`/reports/${encodeURIComponent(o.reportId)}`}>/reports/{o.reportId}</Link> : "-"],
        ["상태", bookStatusLabel(d.book.status)], ["발행", kst(d.book.publishedAt)], ["열람 기한", d.book.expiresAt === "infinity" ? "기한 없음(v5: 탈퇴·삭제 요청·서비스 종료까지)" : kst(d.book.expiresAt)],
        ["상품 버전", s(d.book.productVersion)], ["작가", writerLabel(d.book.meta)], ["생성 비용", usd(d.book.costUsd)],
      ]} />}</Section>
      <Section title="생성 상태">
        {d.state ? <Dl rows={[
          ["단계", phaseLabel(d.state.phase)], ["경로", s(d.state.origin) === "ticket" ? "이용권" : "결제"], ["실패", `${s(d.state.failures) || 0}회`],
          ["첫 시도", kst(d.state.first_attempt_at)], ["첫 실패", kst(d.state.first_failure_at)], ["다음 시도", kst(d.state.next_at)],
          ["다시 쓸 장", Array.isArray(d.state.rejected_chapters) && d.state.rejected_chapters.length ? d.state.rejected_chapters.join(", ") : "-"],
          ["재생성 요청", kst(d.state.regenerate_requested_at)], ["임시본", kst(d.state.interim_at)], ["정식본", kst(d.state.official_at)], ["포기", kst(d.state.gave_up_at)],
          ["최근 사유", s(d.state.last_reason)],
        ]} /> : <p className={styles.note}>생성 상태 기록이 없어요(이전 경로 주문).</p>}
        {d.job ? <div style={{ marginTop: 12 }}><Dl rows={[
          ["결제 큐", jobStatusLabel(d.job.status)], ["시도", `${s(d.job.attempt_count) || 0}/3 · ${s(d.job.run_number) || 1}회차`],
          ["다음 재시도", kst(d.job.next_retry_at)], ["최근 오류", s(d.job.last_error_code)], ["큐 등록", kst(d.job.created_at)],
        ]} /></div> : null}
      </Section>
      <Section title={`시도 기록 (${d.attempts.length + d.runs.length})`}><Attempts d={d} /></Section>
      <Section title={`보관본 (${d.versions.length})`}>{d.versions.length === 0 ? <p className={styles.note}>없어요.</p> : (
        <ul className={styles.list}>{d.versions.map((v, i) => <li key={i} className={styles.item}><div className={styles.itemHead}>{v.edition === "interim" ? "임시본" : "이전 정식본"}</div>
          <div className={styles.meta}><span>{kst(v.archivedAt)}</span><span>{s(v.reason)}</span></div></li>)}</ul>
      )}</Section>
      <Section title={`고객 요청 (${d.requests.length})`}>{d.requests.length === 0 ? <p className={styles.note}>없어요.</p> : (
        <ul className={styles.list}>{d.requests.map(q => (
          <li key={s(q.id)} className={styles.item}>
            <div className={styles.itemHead}><Badge alert={q.reason === "refund"}>{requestReasonLabel(q.reason)}</Badge><Badge>{q.status === "open" ? "처리 전" : q.resolved_by === "auto" ? "자동 처리 완료" : "처리 완료"}</Badge></div>
            <div className={styles.meta}><span>{kst(q.created_at)}</span>{q.resolved_at ? <span>처리 {kst(q.resolved_at)}</span> : null}</div>
            {s(q.memo) ? <p className={styles.pre}>{s(q.memo)}</p> : null}
            {s(q.admin_note) ? <p className={styles.note}>메모: {s(q.admin_note)}</p> : null}
            {q.status === "open" ? <RequestDoneForm id={s(q.id)} orderCode={o.orderCode} /> : null}
          </li>
        ))}</ul>
      )}</Section>
      <Section title="환불">{!d.refund ? <p className={styles.note}>환불 기록이 없어요.</p> : <Dl rows={[
        ["상태", refundStateLabel(d.refund.state)], ["경로", refundSourceLabel(d.refund.source)], ["사유", s(d.refund.reason)],
        ["금액", won(d.refund.amount)], ["시도", `${s(d.refund.attempts) || 0}회`], ["토스 상태", s(d.refund.provider_status)], ["최근 오류", s(d.refund.last_error)],
        ["요청", kst(d.refund.created_at)], ["첫 시도", kst(d.refund.first_attempt_at)], ["완료", kst(d.refund.completed_at)],
      ]} />}</Section>
      <Section title={`감사 로그 (${d.audit.length})`}>{d.audit.length === 0 ? <p className={styles.note}>없어요.</p> : (
        <ul className={styles.list}>{d.audit.map(a => (
          <li key={s(a.id)} className={styles.item}>
            <div className={styles.itemHead}><span>{s(a.action)}</span><Badge>{a.actor === "admin" ? "관리자" : "시스템"}</Badge></div>
            <div className={styles.meta}><span>{kst(a.created_at)}</span>{s(a.actor_user_id) ? <span className={styles.mono}>{s(a.actor_user_id).slice(0, 8)}…</span> : null}</div>
            {obj(a.detail) && Object.keys(obj(a.detail)!).length ? <p className={`${styles.mono} ${styles.pre}`}>{JSON.stringify(a.detail)}</p> : null}
          </li>
        ))}</ul>
      )}</Section>
    </AdminShell>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className={styles.section}><h2>{title}</h2>{children}</section>;
}

function writerLabel(meta: unknown): string {
  const m = obj(meta);
  return m ? [s(m.provider), s(m.model)].filter(Boolean).join(" · ") || "-" : "-";
}

/** 화면 표시용 판단(서버가 같은 조건을 다시 확인한다). */
function actionProps(d: OrderDetail): OrderActionsProps {
  const o = d.order, published = d.book?.status === "COMPLETED", unpublished = !d.book?.publishedAt && !published;
  const retry = d.job?.status === "FAILED_REQUIRES_ATTENTION" && unpublished;
  const regenerate = !o.reportId ? { allowed: false, label: "다시 만들기", hint: "이 주문에는 Book이 없어요." }
    : o.status !== "paid" ? { allowed: false, label: "다시 만들기", hint: "결제 완료 주문만 다시 만들 수 있어요." }
    : retry ? { allowed: true, label: "결제 큐에 다시 넣기", hint: "공개 전에 실패(확인 필요)한 Book이에요. 결제 큐가 처음부터 다시 만들어요." }
    : published ? { allowed: true, label: "정식본 다시 만들기", hint: "교체 레인이 새 정식본으로 바꿔요. 지금 Book은 보관본으로 남아요." }
    : { allowed: false, label: "다시 만들기", hint: "아직 생성 중이에요. 끝나거나 확인 필요 상태가 되면 다시 만들 수 있어요." };
  const refundState = s(d.refund?.state);
  const refundAllowed = o.status === "paid" && refundState !== "processing" && refundState !== "done";
  const buyer = [s(o.buyerName), o.buyerEmail ? maskEmail(o.buyerEmail) : ""].filter(Boolean).join(" · ") || (o.userId ? `회원 ${o.userId.slice(0, 8)}…` : "정보 없음");
  return {
    orderCode: o.orderCode, amountLabel: won(o.amount), buyerLabel: buyer, pinReady: adminPinConfigured(), regenerate, grantAllowed: Boolean(o.userId), refundAllowed,
    tossCheckAllowed: Boolean(s(o.paymentKey) && s(o.providerOrderId)), externalRefundAllowed: o.status === "paid" && !d.refund,
    refundHint: o.status !== "paid" ? `결제 완료 주문만 환불할 수 있어요(지금: ${paymentStatusLabel(o.status)}).` : refundState === "done" ? "환불이 끝났어요." : "환불 처리 중이에요.",
  };
}

function birthTime(p: Json): string {
  if (p.birthTimeUnknown === true || p.birthTimePrecision === "unknown") return "모름";
  if (p.birthTimePrecision === "approximate") return `대략 · ${birthTimeSlotLabel(p.approximateBirthTimeSlot, SAJU_CALENDAR_VERSION) ?? (s(p.approximateBirthTimeSlot) || "시간대")}`;
  return s(p.birthTime) ? `정확 · ${s(p.birthTime)}` : "-";
}

function InputSection({ input }: { input: Json | null }) {
  if (!input) return <Section title="입력값"><p className={styles.note}>입력 기록이 없어요(탈퇴·만료로 지워졌거나 이전 경로).</p></Section>;
  const compat = input.productKey === "saju_mbti_compatibility";
  const people = (compat ? [["A", input.personA], ["B", input.personB]] : [["주인공", input.person]]) as [string, unknown][];
  const ctx = obj(input.userContext), opts = obj(input.productOptions);
  const extra: [string, ReactNode][] = compat ? [["관계", relationshipTypeLabel(input.relationshipType)]] : [
    ["직업", [jobLabel(ctx?.jobStatus), s(ctx?.detailJob)].filter(x => x && x !== "-").join(" · ")],
    ["연애 상태", relationshipLabel(ctx?.relationshipStatus)],
    ["관심사", Array.isArray(ctx?.focusAreas) && ctx.focusAreas.length ? ctx.focusAreas.join(", ") : "-"],
    ...(opts && s(opts.selectedYear) ? [["선택 연도", s(opts.selectedYear)] as [string, ReactNode]] : []),
  ];
  return (
    <>
      <Section title="입력값">
        {people.map(([role, raw]) => { const p = obj(raw) ?? {}; return (
          <div key={role} style={{ marginBottom: 12 }}><Dl rows={[
            [`${role} 이름`, s(p.name)], ["생년월일(양력)", s(p.birthDate)], ["출생 시각", birthTime(p)], ["성별", genderLabel(p.gender)], ["MBTI", s(p.mbtiType) || "없음"],
          ]} /></div>
        ); })}
        <Dl rows={extra} />
      </Section>
      <Section title="만세력(네 기둥)">
        {people.map(([role, raw]) => { const m = manseSummary(raw); return (
          <div key={role} style={{ marginBottom: 8 }}>
            <p className={styles.note} style={{ margin: "0 0 4px" }}>{role}</p>
            {m.ok ? <Dl rows={m.pillars.map(x => [x.label, <span key={x.label} className={styles.mono}>{x.value}</span>] as const)} /> : <p className={styles.note}>{m.reason}</p>}
          </div>
        ); })}
      </Section>
    </>
  );
}

function Attempts({ d }: { d: OrderDetail }) {
  type Row = { at: string; lane: string; who: string; outcome: string; reason: string; cost: string; took: string; alert: boolean };
  const rows: Row[] = [
    ...d.attempts.map(a => {
      const start = Date.parse(s(a.startedAt)), end = Date.parse(s(a.finishedAt));
      return { at: s(a.startedAt), lane: `${laneLabel("attempt")} ${s(a.run)}-${s(a.attempt)}`, who: "-", outcome: s(a.errorCode) ? "실패" : s(a.finishedAt) ? "완료" : "진행 중",
        reason: [s(a.stage), s(a.errorCode)].filter(Boolean).join(" · "), cost: "-", took: Number.isFinite(start) && Number.isFinite(end) ? duration(end - start) : "-", alert: Boolean(s(a.errorCode)) };
    }),
    ...d.runs.map(x => ({ at: s(x.created_at), lane: `${laneLabel(x.lane)}${x.edition ? ` · ${phaseLabel(x.edition)}` : ""}`, who: [s(x.provider), s(x.model)].filter(Boolean).join(" · ") || "-",
      outcome: outcomeLabel(x.outcome), reason: s(x.reason), cost: usd(x.cost_usd), took: duration(x.duration_ms), alert: x.outcome === "error" || x.outcome === "gave_up" })),
  ].sort((a, b) => (Date.parse(a.at) || 0) - (Date.parse(b.at) || 0));
  if (!rows.length) return <p className={styles.note}>기록이 없어요.</p>;
  return (
    <ul className={styles.list}>{rows.map((r, i) => (
      <li key={i} className={styles.item}>
        <div className={styles.itemHead}><span>{r.lane}</span><Badge alert={r.alert}>{r.outcome}</Badge></div>
        <div className={styles.meta}><span>{kst(r.at)}</span><span>{r.who}</span><span>비용 {r.cost}</span><span>{r.took}</span></div>
        {r.reason ? <p className={`${styles.note} ${styles.pre}`}>{r.reason}</p> : null}
      </li>
    ))}</ul>
  );
}
