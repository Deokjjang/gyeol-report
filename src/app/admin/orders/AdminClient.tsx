"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";

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
};

/** 주문 작업: 다시 만들기 · 이용권 지급(PIN) · 환불(2단계 + PIN). 서버가 매번 관리자·출처·주문 상태·PIN을 다시 확인한다. */
export function OrderActions(p: OrderActionsProps) {
  const regen = useAction(), grant = useAction(), refund = useAction();
  const [quantity, setQuantity] = useState(1), [grantStep, setGrantStep] = useState<0 | 1>(0), [grantPin, setGrantPin] = useState("");
  const grantId = useRef<string | null>(null);
  const [step, setStep] = useState<0 | 1>(0), [reason, setReason] = useState(""), [typed, setTyped] = useState(""), [refundPin, setRefundPin] = useState("");
  const canRefund = reason.trim().length > 0 && reason.trim().length <= 200 && typed === p.orderCode && refundPin.length > 0 && !refund.busy;
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
          <div className={styles.row}><button type="button" className={styles.button} onClick={() => setStep(1)}>환불 진행…</button></div>
        ) : (
          <div className={styles.confirm}>
            <dl className={styles.dl}>
              <dt>주문코드</dt><dd className={styles.mono}>{p.orderCode}</dd>
              <dt>금액</dt><dd>{p.amountLabel}</dd>
              <dt>구매자</dt><dd>{p.buyerLabel}</dd>
            </dl>
            <p className={styles.error}>환불하면 결제가 취소되고 이 Book은 더 이상 열 수 없어요. 되돌릴 수 없어요.</p>
            <label className={styles.note} htmlFor="refund-reason">환불 사유(필수, {reason.trim().length}/200자)</label>
            <textarea id="refund-reason" maxLength={200} value={reason} onChange={e => setReason(e.target.value)} />
            <label className={styles.note} htmlFor="refund-confirm">확인: 주문코드 <b className={styles.mono}>{p.orderCode}</b>를 그대로 입력</label>
            <input id="refund-confirm" className={styles.input} autoComplete="off" spellCheck={false} value={typed} onChange={e => setTyped(e.target.value)} />
            <PinField id="refund-pin" value={refundPin} onChange={setRefundPin} />
            <div className={styles.row}>
              <button type="button" className={styles.danger} disabled={!canRefund}
                onClick={async () => { await refund.run("refund", { orderCode: p.orderCode, reason: reason.trim(), confirmCode: typed, pin: refundPin }); setRefundPin(""); }}>{refund.busy ? "환불 중…" : "환불 확정"}</button>
              <button type="button" className={styles.button} disabled={refund.busy} onClick={() => { setStep(0); setReason(""); setTyped(""); setRefundPin(""); }}>취소</button>
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
