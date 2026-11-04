"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import s from "./ops.module.css";

type Peek = { ok: boolean; status?: string; mine?: boolean; received?: boolean; member?: boolean; profile?: string; message?: string };
export function GiftClaim({ token }: { token: string }) {
  const [peek, setPeek] = useState<Peek | null>(null), [message, setMessage] = useState(""), [done, setDone] = useState(false), [busy, setBusy] = useState(false);
  useEffect(() => {
    void (token ? fetch(`/auth/gift?token=${token}`, { cache: "no-store" }).then(async r => setPeek(await r.json())) : Promise.reject(new Error("token")))
      .catch(() => setPeek({ ok: false, message: token ? "잠시 후 다시 열어 주세요." : "선물 링크를 찾지 못했어요." }));
  }, [token]);
  async function claim() {
    setBusy(true); setMessage("");
    try { const r = await fetch("/auth/gift", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ op: "claim", token }) }); const b = await r.json(); if (r.ok) setDone(true); else setMessage(b.message ?? "받지 못했어요."); }
    catch { setMessage("받지 못했어요. 다시 시도해 주세요."); } finally { setBusy(false); }
  }
  if (!peek) return <p role="status">선물을 확인하고 있어요.</p>;
  if (!peek.ok) return <p className={s.message} role="alert">{peek.message}</p>;
  // 받았다는 문구는 내가 받은 사람일 때만. 다른 사람이 이미 받은 링크는 아래에서 안내한다.
  if (done || peek.status === "claimed" && peek.received) return <><p className={s.message} role="status">이용권 1장을 받았어요.</p><p><Link className={`${s.button} ${s.dark}`} href="/">책 고르러 가기 →</Link></p></>;
  if (peek.status !== "gifted") return <p className={s.message} role="alert">{peek.status === "expired" ? "선물 기간이 지났어요." : peek.status === "claimed" && peek.mine ? "친구가 이 선물을 받았어요." : "이미 받았거나 쓸 수 없는 선물이에요."}</p>;
  if (peek.mine) return <p className={s.message}>내가 보낸 선물 링크예요. 친구에게 이 주소를 보내 주세요.</p>;
  if (!peek.member) return <p><a className={`${s.button} ${s.dark}`} href={`/login?next=${encodeURIComponent(`/gift/${token}`)}`}>로그인하고 받기 →</a></p>;
  if (peek.profile !== "complete") return <><p className={s.message}>선물을 받으려면 가입 정보(이름·이메일)를 먼저 입력해 주세요.</p><p><a className={`${s.button} ${s.dark}`} href="/account">가입 정보 입력하기 →</a></p></>;
  return <><button type="button" className={`${s.button} ${s.dark}`} disabled={busy} onClick={() => void claim()}>이용권 받기</button>{message ? <p className={s.message} role="alert">{message}</p> : null}</>;
}
