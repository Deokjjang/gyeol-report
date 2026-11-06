"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import s from "./ops.module.css";
import status from "../report/reportStatus.module.css";

type Peek = { ok: boolean; status?: string; expiresAt?: string; mine?: boolean; received?: boolean; member?: boolean; profile?: string; message?: string; code?: string };
/** 로그인·가입 과정 내내 선물 링크를 기억한다(AccountScreen이 가입 정보를 마치면 이 화면으로 돌려보낸다). */
const GIFT_PENDING_KEY = "gyeol-gift-pending-v1";
const kstDay = (iso?: string) => { const ms = Date.parse(iso ?? ""); if (!Number.isFinite(ms)) return ""; const d = new Date(ms + 9 * 3_600_000); return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일`; };
const remember = (token: string) => { try { localStorage.setItem(GIFT_PENDING_KEY, JSON.stringify({ token, at: Date.now() })); } catch { /* 선택 */ } };
const forget = () => { try { localStorage.removeItem(GIFT_PENDING_KEY); } catch { /* 선택 */ } };
const GONE = "기한이 지났거나 이미 받은 선물이에요";

/**
 * 선물 받는 화면(P 추가 F). 「결리포트 이용권 1장을 선물받았어요」 [로그인하고 받기].
 * 로그인(신규면 가입 동의·정보 입력까지)을 마치고 돌아오면 자동으로 받는다. 이미 회원인 친구도 같은 화면에서 자동으로 받는다.
 * 기한이 지났거나 이미 받은 링크는 한 줄만. 보낸 사람 본인이 열면 받지 않는다(기존 규칙).
 */
export function GiftClaim({ token }: { token: string }) {
  const [peek, setPeek] = useState<Peek | null>(null), [claim, setClaim] = useState<"idle" | "busy" | "done" | "failed">("idle"), [message, setMessage] = useState("");
  const started = useRef(false);
  useEffect(() => {
    void (token ? fetch(`/auth/gift?token=${token}`, { cache: "no-store" }).then(async r => setPeek(await r.json())) : Promise.reject(new Error("token")))
      .catch(() => setPeek({ ok: false, code: token ? "NETWORK" : "GIFT_NOT_FOUND" }));
  }, [token]);
  const claimable = Boolean(peek?.ok && peek.status === "gifted" && !peek.mine && peek.member && peek.profile === "complete");
  useEffect(() => {
    if (!claimable || started.current) return;
    started.current = true; setClaim("busy");
    void fetch("/auth/gift", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ op: "claim", token }) })
      .then(async r => { const b = await r.json().catch(() => ({})); if (r.ok) { forget(); setClaim("done"); } else { setClaim("failed"); setMessage(b.code === "GIFT_USED" || b.code === "GIFT_EXPIRED" || b.code === "GIFT_NOT_FOUND" ? GONE : b.message ?? "받지 못했어요. 새로고침해 주세요."); } })
      .catch(() => { setClaim("failed"); setMessage("받지 못했어요. 새로고침해 주세요."); });
  }, [claimable, token]);
  const title = (text: string) => <h1 id="gift-title" className={status.title}>{text}</h1>;
  if (!peek) return <p role="status" className={status.message}>선물을 확인하고 있어요.</p>;
  if (!peek.ok) return peek.code === "NETWORK" ? <p role="alert" className={status.message}>잠시 후 다시 열어 주세요.</p> : title(GONE);
  // 내가 받은 사람이면(다시 열어도) 받은 상태로.
  if (claim === "done" || (peek.status === "claimed" && peek.received)) return <>{title("이용권 1장이 서재에 들어왔어요")}<p className={status.message}>{kstDay(peek.expiresAt) ? `${kstDay(peek.expiresAt)}까지 쓸 수 있어요.` : ""}</p><p><Link className={`${s.button} ${s.dark}`} href="/">책 고르러 가기 →</Link></p></>;
  if (peek.status !== "gifted") return peek.status === "claimed" && peek.mine ? title("친구가 이 선물을 받았어요") : title(GONE);
  if (peek.mine) return <>{title("내가 보낸 선물 링크예요")}<p className={status.message}>친구에게 이 주소를 보내 주세요.</p></>;
  const head = title("결리포트 이용권 1장을 선물받았어요");
  if (!peek.member) return <>{head}<p><a className={`${s.button} ${s.dark}`} onClick={() => remember(token)} href={`/login?next=${encodeURIComponent(`/gift/${token}`)}`}>로그인하고 받기 →</a></p></>;
  if (peek.profile !== "complete") return <>{head}<p className={status.message}>가입 정보(이름·이메일)를 마치면 바로 받아요.</p><p><a className={`${s.button} ${s.dark}`} onClick={() => remember(token)} href="/account">가입 정보 입력하기 →</a></p></>;
  return <>{head}{claim === "failed" ? <p className={status.message} role="alert">{message}</p> : <p role="status" className={status.message}>이용권을 받고 있어요.</p>}</>;
}
