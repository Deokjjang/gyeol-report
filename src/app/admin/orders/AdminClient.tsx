"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";
import { refundWarningLines } from "../../../lib/ops/admin/format";

type Result = { ok: boolean; message: string; data?: Record<string, unknown> };
const request = (action: string, body: Record<string, unknown>) =>
  fetch(`/api/admin/orders/${action}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), credentials: "same-origin", cache: "no-store" });
async function post(action: string, body: Record<string, unknown>): Promise<Result> {
  try {
    const res = await request(action, body);
    const data = await res.json().catch(() => null) as { ok?: boolean; message?: string; code?: string } | null;
    const message = data?.code === "ADMIN_SESSION_EXPIRED" ? "관리자 로그인 시간이 지났어요. 새로고침 후 다시 로그인해 주세요." : data?.message ?? (res.ok ? "처리했어요." : `실패했어요 (${res.status}${data?.code ? ` ${data.code}` : ""}).`);
    return { ok: res.ok && data?.ok === true, message, data: data ?? undefined };
  } catch { return { ok: false, message: "네트워크 오류예요. 다시 시도해 주세요." }; }
}

function useAction() {
  const router = useRouter();
  const [busy, setBusy] = useState(false), [result, setResult] = useState<Result | null>(null);
  const run = async (action: string, body: Record<string, unknown>, refresh = true) => {
    setBusy(true); setResult(null);
    const r = await post(action, body);
    setResult(r); setBusy(false);
    if (r.ok && refresh) router.refresh();
    return r;
  };
  const view = result ? <p role="status" className={result.ok ? styles.ok : styles.error}>{result.message}</p> : null;
  return { busy, run, view, setResult };
}

function PinField({ id, value, onChange }: { id: string; value: string; onChange(v: string): void }) {
  return (
    <>
      <label className={styles.note} htmlFor={id}>관리자 PIN 다시 입력</label>
      <input id={id} className={styles.input} type="password" autoComplete="off" maxLength={128} value={value} onChange={e => onChange(e.target.value)} />
    </>
  );
}
const PIN_OFF = "관리자 PIN(ADMIN_ACTION_PIN)이 설정되지 않아 쓸 수 없어요.";

export type OrderActionsProps = {
  orderCode: string; amountLabel: string; buyerLabel: string; pinReady: boolean;
  regenerate: { allowed: boolean; label: string; hint: string };
  grantAllowed: boolean; refundAllowed: boolean; refundHint: string;
  /** 토스 상태 확인(조회만)·외부 환불 기록(결제 완료로 남은 주문만). */
  tossCheckAllowed: boolean; externalRefundAllowed: boolean;
};
type Warnings = { giftUsed: { status: string; at: string | null }[]; giftPendingRevoked: number; bonusSent: boolean };

/** 주문 작업: 다시 만들기 · 이용권 지급(PIN) · 환불(2단계 + PIN). 서버가 매번 관리자·출처·주문 상태·PIN을 다시 확인한다. */
export function OrderActions(p: OrderActionsProps) {
  const regen = useAction(), grant = useAction(), refund = useAction();
  const [quantity, setQuantity] = useState(1), [grantStep, setGrantStep] = useState<0 | 1>(0), [grantPin, setGrantPin] = useState("");
  const grantId = useRef<string | null>(null);
  const [step, setStep] = useState<0 | 1>(0), [reason, setReason] = useState(""), [typed, setTyped] = useState(""), [refundPin, setRefundPin] = useState("");
  const [warnings, setWarnings] = useState<Warnings | null | "error">(null), [ack, setAck] = useState(false);
  const warnLines = warnings && warnings !== "error" ? refundWarningLines(warnings) : [];
  const canRefund = reason.trim().length > 0 && reason.trim().length <= 200 && typed === p.orderCode && refundPin.length > 0 && !refund.busy
    && warnings !== null && warnings !== "error" && (warnLines.length === 0 || ack);
  const openRefund = async () => {
    setStep(1); setAck(false); setWarnings(null);
    const r = await post("refund-warnings", { orderCode: p.orderCode });
    setWarnings(r.ok && r.data?.warnings ? r.data.warnings as Warnings : "error");
  };
  const toss = useAction(), external = useAction();
  const [tossKind, setTossKind] = useState<string | null>(null), [extOpen, setExtOpen] = useState(false), [extTyped, setExtTyped] = useState(""), [extPin, setExtPin] = useState("");
  return (
    <div className={styles.actions}>
      <div className={styles.panel}>
        <h3>다시 만들기</h3>
        <p className={styles.note}>{p.regenerate.hint}</p>
        <div className={styles.row}>
          <button type="button" className={styles.button} disabled={!p.regenerate.allowed || regen.busy}
            onClick={() => { if (window.confirm(`${p.orderCode} Book을 ${p.regenerate.label}할까요?`)) void regen.run("regenerate", { orderCode: p.orderCode }); }}>
            {regen.busy ? "요청 중…" : p.regenerate.label}
          </button>
        </div>
        {regen.view}
      </div>
      <div className={styles.panel} data-toss-check>
        <h3>토스 상태 확인</h3>
        <p className={styles.note}>토스 조회 API만 써요(취소 호출 없음). 토스 상점관리자에서 직접 환불했는데 여기엔 결제 완료로 남았는지 대조해요.</p>
        {!p.tossCheckAllowed ? <p className={styles.note}>결제 키가 없는 주문이라 확인할 수 없어요.</p> : (
          <div className={styles.row}>
            <button type="button" className={styles.button} disabled={toss.busy}
              onClick={async () => { setExtOpen(false); const r = await toss.run("toss-check", { orderCode: p.orderCode }, false); const t = r.data?.toss as { kind?: string } | undefined; setTossKind(r.ok && r.data?.mismatch === true ? "mismatch" : t?.kind ?? null); }}>
              {toss.busy ? "조회 중…" : "토스 상태 확인"}
            </button>
          </div>
        )}
        {toss.view}
        {tossKind === "mismatch" && p.externalRefundAllowed ? (
          !p.pinReady ? <p className={styles.note}>{PIN_OFF}</p> : !extOpen ? (
            <div className={styles.row}><button type="button" className={styles.danger} onClick={() => setExtOpen(true)}>외부 환불로 기록…</button></div>
          ) : (
            <div className={styles.confirm}>
              <p className={styles.note}>서버가 토스를 다시 조회해 전액 취소(CANCELED)일 때만 기록해요. 이 주문은 환불로 바뀌고 Book은 열리지 않아요.</p>
              <label className={styles.note} htmlFor="ext-confirm">확인: 주문코드 <b className={styles.mono}>{p.orderCode}</b>를 그대로 입력</label>
              <input id="ext-confirm" className={styles.input} autoComplete="off" spellCheck={false} value={extTyped} onChange={e => setExtTyped(e.target.value)} />
              <PinField id="ext-pin" value={extPin} onChange={setExtPin} />
              <div className={styles.row}>
                <button type="button" className={styles.danger} disabled={external.busy || extTyped !== p.orderCode || !extPin}
                  onClick={async () => { const r = await external.run("external-refund", { orderCode: p.orderCode, confirmCode: extTyped, pin: extPin }); setExtPin(""); if (r.ok) { setExtOpen(false); setExtTyped(""); setTossKind(null); } }}>
                  {external.busy ? "기록 중…" : "외부 환불로 기록 확정"}</button>
                <button type="button" className={styles.button} disabled={external.busy} onClick={() => { setExtOpen(false); setExtTyped(""); setExtPin(""); }}>취소</button>
              </div>
            </div>
          )
        ) : null}
        {external.view}
      </div>
      <div className={styles.panel}>
        <h3>이용권 지급</h3>
        {!p.grantAllowed ? <p className={styles.note}>비회원 주문이라 지급할 계정이 없어요.</p> : !p.pinReady ? <p className={styles.note}>{PIN_OFF}</p> : grantStep === 0 ? (
          <div className={styles.row}><button type="button" className={styles.button} onClick={() => setGrantStep(1)}>이용권 지급…</button></div>
        ) : (
          <div className={styles.confirm}>
            <label className={styles.row}><span className={styles.note}>수량</span>
              <select value={quantity} onChange={e => setQuantity(Number(e.target.value))} style={{ width: 80 }}>{[1, 2, 3].map(n => <option key={n} value={n}>{n}장</option>)}</select>
            </label>
            <PinField id="grant-pin" value={grantPin} onChange={setGrantPin} />
            <div className={styles.row}>
              <button type="button" className={styles.primary} disabled={grant.busy || !grantPin}
                onClick={async () => {
                  grantId.current ??= crypto.randomUUID();
                  const r = await grant.run("grant", { orderCode: p.orderCode, quantity, requestId: grantId.current, pin: grantPin });
                  setGrantPin("");
                  if (r.ok) { grantId.current = null; setGrantStep(0); }
                }}>{grant.busy ? "지급 중…" : `${quantity}장 지급 확정`}</button>
              <button type="button" className={styles.button} disabled={grant.busy} onClick={() => { setGrantStep(0); setGrantPin(""); }}>취소</button>
            </div>
          </div>
        )}
        {grant.view}
      </div>
      <div className={styles.panel}>
        <h3>환불</h3>
        {!p.refundAllowed ? <p className={styles.note}>{p.refundHint}</p> : !p.pinReady ? <p className={styles.note}>{PIN_OFF}</p> : step === 0 ? (
          <div className={styles.row}><button type="button" className={styles.button} onClick={() => void openRefund()}>환불 진행…</button></div>
        ) : (
          <div className={styles.confirm}>
            <dl className={styles.dl}>
              <dt>주문코드</dt><dd className={styles.mono}>{p.orderCode}</dd>
              <dt>금액</dt><dd>{p.amountLabel}</dd>
              <dt>구매자</dt><dd>{p.buyerLabel}</dd>
            </dl>
            <p className={styles.error}>환불하면 결제가 취소되고 이 Book은 더 이상 열 수 없어요. 되돌릴 수 없어요.</p>
            {warnings === null ? <p className={styles.note} role="status">이벤트 이용권 상태를 확인하는 중…</p>
              : warnings === "error" ? <p className={styles.error} role="alert">이벤트 이용권 상태를 확인하지 못해 환불을 진행할 수 없어요. 취소 후 다시 열어 주세요.</p>
              : warnLines.length ? (
                <div className={styles.warn} role="alert" data-refund-warning>
                  <b>환불 전에 확인해 주세요</b>
                  <ul>{warnLines.map(line => <li key={line}>{line}</li>)}</ul>
                  <label className={styles.row}><input type="checkbox" checked={ack} onChange={e => setAck(e.target.checked)} /> 위 내용을 확인했어요</label>
                </div>
              ) : warnings.giftPendingRevoked > 0 ? <p className={styles.note}>안 쓴 이벤트 이용권 {warnings.giftPendingRevoked}장은 환불과 함께 회수돼요.</p> : null}
            <label className={styles.note} htmlFor="refund-reason">환불 사유(필수, {reason.trim().length}/200자)</label>
            <textarea id="refund-reason" maxLength={200} value={reason} onChange={e => setReason(e.target.value)} />
            <label className={styles.note} htmlFor="refund-confirm">확인: 주문코드 <b className={styles.mono}>{p.orderCode}</b>를 그대로 입력</label>
            <input id="refund-confirm" className={styles.input} autoComplete="off" spellCheck={false} value={typed} onChange={e => setTyped(e.target.value)} />
            <PinField id="refund-pin" value={refundPin} onChange={setRefundPin} />
            <div className={styles.row}>
              <button type="button" className={styles.danger} disabled={!canRefund}
                onClick={async () => { await refund.run("refund", { orderCode: p.orderCode, reason: reason.trim(), confirmCode: typed, pin: refundPin, ...(ack ? { ackWarnings: true } : {}) }); setRefundPin(""); }}>{refund.busy ? "환불 중…" : "환불 확정"}</button>
              <button type="button" className={styles.button} disabled={refund.busy} onClick={() => { setStep(0); setReason(""); setTyped(""); setRefundPin(""); setWarnings(null); setAck(false); }}>취소</button>
            </div>
          </div>
        )}
        {refund.view}
      </div>
    </div>
  );
}

/** 현재 검색 결과 CSV 내보내기(PIN). 이메일·전화는 가린 값. */
export function ExportCsv({ filters, pinReady }: { filters: { q: string; product: string; from: string; to: string }; pinReady: boolean }) {
  const [open, setOpen] = useState(false), [pin, setPin] = useState(""), [busy, setBusy] = useState(false), [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  if (!pinReady) return <p className={styles.note}>CSV 내보내기: {PIN_OFF}</p>;
  const download = async () => {
    setBusy(true); setMessage(null);
    try {
      const res = await request("export", { ...filters, pin });
      if (res.ok && (res.headers.get("content-type") ?? "").startsWith("text/csv")) {
        const url = URL.createObjectURL(await res.blob()), a = document.createElement("a");
        a.href = url; a.download = /filename="([^"]+)"/.exec(res.headers.get("content-disposition") ?? "")?.[1] ?? "gyeol-orders.csv";
        document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        setMessage({ ok: true, text: "내려받았어요(최대 200건, 이메일·전화는 가린 값)." }); setOpen(false);
      } else {
        const data = await res.json().catch(() => null) as { message?: string; code?: string } | null;
        setMessage({ ok: false, text: data?.code === "ADMIN_SESSION_EXPIRED" ? "관리자 로그인 시간이 지났어요. 새로고침 후 다시 로그인해 주세요." : data?.message ?? `실패했어요 (${res.status}).` });
      }
    } catch { setMessage({ ok: false, text: "네트워크 오류예요. 다시 시도해 주세요." }); }
    setPin(""); setBusy(false);
  };
  return (
    <div className={styles.panel} style={{ marginBottom: 12 }}>
      {!open ? <div className={styles.row}><button type="button" className={styles.button} onClick={() => setOpen(true)}>검색 결과 CSV 내보내기…</button></div> : (
        <>
          <PinField id="export-pin" value={pin} onChange={setPin} />
          <div className={styles.row}>
            <button type="button" className={styles.primary} disabled={busy || !pin} onClick={() => void download()}>{busy ? "만드는 중…" : "내보내기"}</button>
            <button type="button" className={styles.button} disabled={busy} onClick={() => { setOpen(false); setPin(""); }}>취소</button>
          </div>
        </>
      )}
      {message ? <p role="status" className={message.ok ? styles.ok : styles.error}>{message.text}</p> : null}
    </div>
  );
}

/** 가린 이메일·전화 + "보기"(서버가 감사 로그를 남긴 뒤에만 값을 준다). */
export function RevealPii({ orderCode, field, masked }: { orderCode: string; field: "email" | "phone"; masked: string }) {
  const a = useAction();
  const [value, setValue] = useState<string | null>(null);
  if (masked === "-") return <>-</>;
  return (
    <span className={styles.row} style={{ display: "inline-flex" }}>
      <span className={styles.mono}>{value ?? masked}</span>
      {value ? null : <button type="button" className={styles.button} style={{ minHeight: 28, padding: "2px 10px" }} disabled={a.busy}
        onClick={async () => { const r = await a.run("reveal", { orderCode, field }, false); if (r.ok && typeof r.data?.value === "string") { setValue(r.data.value); a.setResult(null); } }}>보기</button>}
      {a.view}
    </span>
  );
}

/** 문의 처리 완료(메모 선택). */
export function RequestDoneForm({ id, orderCode }: { id: string; orderCode: string }) {
  const a = useAction();
  const [note, setNote] = useState("");
  return (
    <div className={styles.row} style={{ marginTop: 8 }}>
      <input className={styles.input} style={{ flex: "1 1 180px" }} maxLength={500} placeholder="처리 메모(선택)" aria-label="처리 메모" value={note} onChange={e => setNote(e.target.value)} />
      <button type="button" className={styles.button} disabled={a.busy} onClick={() => void a.run("request-done", { id, orderCode, note: note.trim() })}>{a.busy ? "저장 중…" : "처리 완료"}</button>
      {a.view}
    </div>
  );
}

/** OpenAI(임시본) 경로 다시 켜기. */
export function ProviderEnableButton() {
  const a = useAction();
  return (
    <div className={styles.row}>
      <button type="button" className={styles.button} disabled={a.busy} onClick={() => { if (window.confirm("OpenAI 경로를 다시 켤까요?")) void a.run("provider-enable", {}); }}>{a.busy ? "요청 중…" : "OpenAI 다시 켜기"}</button>
      {a.view}
    </div>
  );
}

type BatchRow = { orderCode: string; amount: number; result: "done" | "canceled" | "partial" | "error"; canceledAt?: string | null; label?: string };
const BATCH_LABEL = { done: "일치", canceled: "토스 취소(우리는 결제 완료)", partial: "일부 취소", error: "확인 실패" } as const;
/** 기존 주문 일괄 확인(조회만, 20건씩 이어서). 토스가 취소인데 우리는 결제 완료인 주문은 상세에서 "외부 환불로 기록"한다. */
export function TossBatchCheck() {
  const a = useAction();
  const [rows, setRows] = useState<BatchRow[]>([]), [next, setNext] = useState<{ afterAt: string; afterId: string } | null>(null), [total, setTotal] = useState<number | null>(null), [started, setStarted] = useState(false), [scope, setScope] = useState<"legacy" | "all">("legacy");
  const run = async (cursor?: { afterAt: string; afterId: string }) => {
    setStarted(true);
    const r = await a.run("toss-check-batch", { scope, ...(cursor ?? {}) }, false);
    if (!r.ok) return;
    const d = r.data as { rows?: BatchRow[]; next?: { afterAt: string; afterId: string } | null; total?: number };
    setRows(prev => cursor ? [...prev, ...(d.rows ?? [])] : d.rows ?? []); setNext(d.next ?? null); setTotal(typeof d.total === "number" ? d.total : null);
  };
  const flagged = rows.filter(r => r.result !== "done");
  return (
    <section className={styles.panel} style={{ marginBottom: 12 }} data-toss-batch>
      <h3>토스 상태 일괄 확인</h3>
      <p className={styles.note}>결제 완료로 남은 토스 주문을 토스 조회 API로만 대조해요(취소 호출 없음). 한 번에 20건씩 이어서 확인해요.</p>
      <div className={styles.row}>
        <label className={styles.note}>대상 <select value={scope} disabled={a.busy || started} onChange={e => setScope(e.target.value === "all" ? "all" : "legacy")}><option value="legacy">기존 주문(주문코드 도입 전)</option><option value="all">결제 완료 전체</option></select></label>
        <button type="button" className={styles.button} disabled={a.busy} onClick={() => void run()}>{a.busy && !next ? "확인 중…" : started ? "처음부터 다시 확인" : "토스 상태 확인"}</button>
        {next ? <button type="button" className={styles.button} disabled={a.busy} onClick={() => void run(next)}>{a.busy ? "확인 중…" : "다음 20건 확인"}</button> : null}
      </div>
      {a.view}
      {started && rows.length ? <p className={styles.note}>지금까지 {rows.length}건{total !== null ? ` / 대상 ${total}건` : ""} 확인 · 확인할 주문 {flagged.length}건</p> : null}
      {flagged.length ? <ul className={styles.list}>{flagged.map(r => (
        <li key={r.orderCode} className={styles.item}>
          <div className={styles.itemHead}><Link className={styles.mono} href={`/admin/orders/${encodeURIComponent(r.orderCode)}`}>{r.orderCode}</Link><span className={r.result === "error" ? styles.note : styles.error}>{BATCH_LABEL[r.result]}</span></div>
          <div className={styles.meta}><span>{r.amount.toLocaleString("ko-KR")}원</span>{r.canceledAt ? <span>토스 취소 {r.canceledAt.slice(0, 16).replace("T", " ")}(UTC)</span> : null}{r.label ? <span>{r.label}</span> : null}</div>
        </li>))}</ul> : started && rows.length && !a.busy ? <p className={styles.ok}>확인한 주문은 모두 토스와 일치해요.</p> : null}
    </section>
  );
}

/** 보상 A 지정(PIN). 환불 완료 주문의 주문코드 또는 토스 주문번호. */
export function CompDesignate({ pinReady }: { pinReady: boolean }) {
  const a = useAction();
  const [q, setQ] = useState(""), [pin, setPin] = useState("");
  if (!pinReady) return <p className={styles.note}>보상 A 지정: {PIN_OFF}</p>;
  return (
    <section className={styles.panel} style={{ marginBottom: 12 }} data-comp-designate>
      <h3>보상 A 지정</h3>
      <p className={styles.note}>결제 후 환불한 고객. 환불 완료 주문의 주문코드(GR-XXXX) 또는 토스 주문번호로 찾아요.</p>
      <label className={styles.note} htmlFor="comp-q">주문코드 · 토스 주문번호</label>
      <input id="comp-q" className={styles.input} autoComplete="off" spellCheck={false} maxLength={64} value={q} onChange={e => setQ(e.target.value)} />
      <PinField id="comp-pin" value={pin} onChange={setPin} />
      <div className={styles.row}>
        <button type="button" className={styles.primary} disabled={a.busy || !q.trim() || !pin}
          onClick={async () => { const r = await a.run("comp-designate", { query: q.trim(), pin }); setPin(""); if (r.ok) setQ(""); }}>{a.busy ? "지정 중…" : "보상 A 지정"}</button>
      </div>
      {a.view}
    </section>
  );
}
