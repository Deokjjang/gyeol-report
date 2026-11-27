"use client";
/**
 * 공유 시트(D4, SPEC 「공유」): 카드 미리보기(별자리 / 내 사진) · 한마디(20자) · 「답해 준 친구 수 보이기」 · 인스타 스토리 · 카카오톡 · 다른 앱 · 링크 복사 · 이미지 저장.
 * 카드는 2D 캔버스로 직접 그린다(src/lib/mirror/card/draw.ts). 사진은 이 기기 안에서만 쓰고 서버로 보내지 않는다.
 * 버튼을 누른 순간의 복사 · 공유는 await 없이 바로 부른다(아이폰 사파리는 기다린 뒤의 클립보드 · 공유를 막는다) — 카드 PNG는 미리 만들어 둔다.
 * 장면 공유(D5 꼭지 2 · 3)는 같은 시트에 scene을 넘긴다.
 */
import Script from "next/script";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cardText, DEFAULT_LINE, LINE_MAX } from "../../../lib/mirror/card/model";
import { CARD_H, CARD_W, drawCard, photoRect, type CardPhoto, type CardScene } from "../../../lib/mirror/card/draw";
import type { ConstellationShape } from "../../../lib/mirror/constellation";
import { charCount, normalizeLine, storyProblem } from "../../../lib/mirror/storyFilter";
import { kakaoShareCard, type KakaoSdk } from "../../../lib/sharing/shareBrowser";
import { copyText, mirrorApi, myLink } from "../client";
import s from "../mirror.module.css";
import f from "../social.module.css";

declare global { interface Window { Kakao?: KakaoSdk } }
const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?.trim();
/** 카카오 공유는 등록된 사이트 도메인에서만 된다(로컬 · 다른 주소에서는 버튼을 막아 둔다). */
const kakaoReady = () => !!kakaoKey && typeof location !== "undefined" && /(^|\.)gyeolreport\.com$/.test(location.hostname);
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
type Share = { line: string | null; showCount: boolean };
export type ShareSheetProps = {
  handle: string; name: string; sync: number | null; friends: number; shape: ConstellationShape | null; share: Share;
  scene?: CardScene | null; onSaved?: (s: Share) => void; onClose: () => void; say: (m: string) => void;
};

/** 장면 문장 앞에 근거 줄이 붙어 오면(「친구 9명 중 9명: …」) 떼어 낸다 — 카드에는 근거 줄을 따로 그린다. */
export const sceneBody = (sc: CardScene) => sc.text.startsWith(`${sc.count}:`) ? sc.text.slice(sc.count.length + 1).trim() : sc.text;

export function ShareSheet(p: ShareSheetProps) {
  const scene = useMemo(() => p.scene ? { count: p.scene.count, text: sceneBody(p.scene) } : null, [p.scene]);
  const [line, setLine] = useState(p.share.line ?? ""), [showCount, setShowCount] = useState(p.share.showCount);
  const [mode, setMode] = useState<"shape" | "photo">("shape"), [photo, setPhoto] = useState<CardPhoto | null>(null);
  const shapeCanvas = useRef<HTMLCanvasElement>(null), photoCanvas = useRef<HTMLCanvasElement>(null), fileInput = useRef<HTMLInputElement>(null);
  const blobs = useRef<{ shape: Blob | null; photo: Blob | null }>({ shape: null, photo: null }), saved = useRef<Share>(p.share);
  const url = useMemo(() => myLink(p.handle), [p.handle]);
  const normalized = normalizeLine(line);
  const text = useMemo(() => cardText({ handle: p.handle, sync: p.sync, friends: p.friends, showCount, line: normalized || null }), [p.handle, p.sync, p.friends, showCount, normalized]);

  // 카드 그리기(글꼴이 준비된 뒤) + PNG 미리 만들기.
  const render = useCallback((which: "shape" | "photo") => {
    const c = which === "shape" ? shapeCanvas.current : photoCanvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    if (which === "photo" && !photo) { ctx.fillStyle = "#07070C"; ctx.fillRect(0, 0, CARD_W, CARD_H); blobs.current.photo = null; return; }
    drawCard(ctx, { text, shape: p.shape, photo: which === "photo" ? photo : null, scene });
    c.toBlob(b => { blobs.current[which] = b; }, "image/png");
  }, [text, p.shape, scene, photo]);
  useEffect(() => { let live = true; void document.fonts.ready.then(() => { if (live) { render("shape"); render("photo"); } }); return () => { live = false; }; }, [render]);

  // 설정 저장(한마디 · 토글): 바뀐 뒤 잠깐 있다가, 시트를 닫을 때도 한 번.
  const onSaved = useRef(p.onSaved); onSaved.current = p.onSaved;
  const persist = useCallback(async () => {
    const next: Share = { line: normalized || null, showCount };
    if (next.line === saved.current.line && next.showCount === saved.current.showCount) return;
    if (normalized && (charCount(normalized) > LINE_MAX || storyProblem(normalized))) return;
    saved.current = next;
    const r = await mirrorApi<{ share: Share }>("share", { method: "POST", body: next });
    if (r.ok) onSaved.current?.(r.data.share);
  }, [normalized, showCount]);
  useEffect(() => { const t = window.setTimeout(() => void persist(), 700); return () => clearTimeout(t); }, [persist]);
  const lineErr = useMemo(() => { const problem = normalized ? storyProblem(normalized) : null; return problem ? problem.message : charCount(normalized) > LINE_MAX ? `${LINE_MAX}자까지 쓸 수 있어요.` : ""; }, [normalized]);
  const close = () => { void persist(); p.onClose(); };

  function file(): File | null {
    const b = blobs.current[mode];
    return b ? new File([b], `gyeol-${p.handle}.png`, { type: "image/png" }) : null;
  }
  function download(f0: File | null) {
    if (!f0) { p.say("카드를 만드는 중이에요. 잠시 후 다시 눌러 주세요."); return; }
    const a = document.createElement("a"), href = URL.createObjectURL(f0);
    a.href = href; a.download = f0.name; document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(href), 4000);
  }
  // 아래 버튼 처리는 모두 클릭 안에서 동기로 시작한다(앞에 await 없음).
  function insta() {
    void copyText(url);
    p.say("링크를 복사했어요 · 스토리에서 링크 스티커에 붙여 넣으세요");
    const f0 = file();
    if (f0 && navigator.canShare?.({ files: [f0] })) { void navigator.share({ files: [f0] }).catch(() => undefined); return; }
    download(f0);
  }
  function kakao() {
    try {
      if (kakaoKey && window.Kakao && !window.Kakao.isInitialized()) window.Kakao.init(kakaoKey);
      if (window.Kakao?.isInitialized()) {
        const title = scene ? `${scene.count}: ${scene.text}` : normalized || `${josaEun(p.name)} 어떤 사람일까?`;
        window.Kakao.Share.sendDefault(kakaoShareCard({ title, description: "질문 12개 · 1분 · 이름은 남지 않아요", url } as Parameters<typeof kakaoShareCard>[0],
          { imageUrl: new URL(`/api/mirror/og/${p.handle}`, location.origin).toString(), width: 1200, height: 630, button: "답하러 가기" }));
        return;
      }
    } catch { /* 아래 다른 앱으로 */ }
    other();
  }
  function other() {
    const data = { url, text: scene ? `${scene.count}: ${scene.text}` : normalized || DEFAULT_LINE };
    if (typeof navigator.share === "function") { void navigator.share(data).catch(e => { if ((e as Error)?.name !== "AbortError") void copyLink(); }); return; }
    void copyLink();
  }
  async function copyLink() { p.say(await copyText(url) ? "복사했어요" : "링크를 복사하지 못했어요"); }

  // 사진: 고르기 · 끌어서 옮기기 · 두 손가락(또는 휠)으로 확대.
  async function pick(fl: FileList | null) {
    const f0 = fl?.[0];
    if (!f0 || !f0.type.startsWith("image/")) return;
    try {
      const bmp = await createImageBitmap(f0);
      setPhoto({ image: bmp, width: bmp.width, height: bmp.height, dx: 0, dy: 0, zoom: 1 }); setMode("photo");
    } catch { p.say("사진을 열지 못했어요. 다른 사진을 골라 주세요."); }
  }
  const pointers = useRef(new Map<number, { x: number; y: number }>()), gesture = useRef<{ dist: number; zoom: number } | null>(null);
  const toCard = (el: HTMLElement) => CARD_W / el.getBoundingClientRect().width;
  function onDown(e: React.PointerEvent<HTMLDivElement>) { if (!photo) return; e.currentTarget.setPointerCapture(e.pointerId); pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pointers.current.size === 2) { const [a, b] = [...pointers.current.values()]; gesture.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom: photo.zoom }; } }
  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!photo || !pointers.current.has(e.pointerId)) return;
    const prev = pointers.current.get(e.pointerId)!, k = toCard(e.currentTarget);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size >= 2 && gesture.current) {
      const [a, b] = [...pointers.current.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
      setPhoto(ph => ph && { ...ph, zoom: Math.min(4, Math.max(1, gesture.current!.zoom * d / gesture.current!.dist)) });
    } else setPhoto(ph => ph && { ...ph, ...clampPhoto({ ...ph, dx: ph.dx + (e.clientX - prev.x) * k, dy: ph.dy + (e.clientY - prev.y) * k }) });
  }
  function onUp(e: React.PointerEvent<HTMLDivElement>) { pointers.current.delete(e.pointerId); if (pointers.current.size < 2) gesture.current = null; }
  function onWheel(e: React.WheelEvent<HTMLDivElement>) { if (!photo) return; setPhoto(ph => ph && { ...ph, zoom: Math.min(4, Math.max(1, ph.zoom * (e.deltaY < 0 ? 1.06 : 0.94))) }); }

  const canKakao = kakaoReady();
  return <>
    {canKakao ? <Script id="gyeol-kakao-sdk" src="https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js" integrity="sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy" crossOrigin="anonymous" strategy="afterInteractive"
      onReady={() => { try { if (kakaoKey && window.Kakao && !window.Kakao.isInitialized()) window.Kakao.init(kakaoKey); } catch { /* 다른 앱으로 */ } }} /> : null}
    <div className={f.sheetBack} onClick={close} aria-hidden="true" />
    <section className={f.sheet} role="dialog" aria-modal="true" aria-label="친구에게 물어보기" data-share-sheet={scene ? "scene" : "ask"}><div className={f.sheetIn}>
      <div className={f.grab} />
      <div className={f.cards}>
        <figure className={f.cardWrap}><div className={cx(f.card, mode === "shape" && f.cardOn)} onClick={() => setMode("shape")} data-card="shape"><canvas ref={shapeCanvas} width={CARD_W} height={CARD_H} aria-label="별자리 카드 미리보기" /></div><figcaption className={cx(f.cardTag, mode === "shape" && f.cardTagOn)}>별자리</figcaption></figure>
        <figure className={f.cardWrap}><div className={cx(f.card, mode === "photo" && f.cardOn)} data-card="photo" onClick={() => { setMode("photo"); if (!photo) fileInput.current?.click(); }}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onWheel={onWheel}>
          <canvas ref={photoCanvas} width={CARD_W} height={CARD_H} aria-label="내 사진 카드 미리보기" />
          {!photo ? <button type="button" className={f.photoPick} onClick={e => { e.stopPropagation(); fileInput.current?.click(); }}><span style={{ fontSize: 26 }}>＋</span>내 사진</button> : null}
        </div><figcaption className={cx(f.cardTag, mode === "photo" && f.cardTagOn)}>내 사진</figcaption></figure>
      </div>
      <input ref={fileInput} type="file" accept="image/*" hidden onChange={e => void pick(e.target.files)} data-photo-input />
      {mode === "photo" ? <p className={f.note}>사진은 이 폰 안에서만 쓰여요{photo ? " · 끌어서 옮기고 두 손가락으로 키울 수 있어요" : ""}</p> : null}
      {mode === "photo" && photo ? <div className={f.minor}><button type="button" className={s.link} onClick={() => fileInput.current?.click()}>다른 사진</button></div> : null}
      {!scene ? <label className={s.field}><span>카드에 들어갈 한마디</span>
        <input className={s.input} value={line} placeholder={DEFAULT_LINE} maxLength={LINE_MAX + 4} onChange={e => setLine(e.target.value)} name="line" />
        {lineErr ? <small className={s.bad}>{lineErr}</small> : <small>{charCount(normalized)} / {LINE_MAX}</small>}</label> : null}
      {!scene ? <div className={f.toggle}><span>답해 준 친구 수 보이기</span>
        <button type="button" role="switch" aria-checked={showCount} className={cx(f.switch, showCount && f.switchOn)} onClick={() => setShowCount(v => !v)} data-toggle-count><i /></button></div> : null}
      <div className={f.actions}>
        <button type="button" className={f.act} onClick={insta} data-share="insta"><i>◎</i>인스타 스토리</button>
        <button type="button" className={cx(f.act, f.actKakao)} onClick={kakao} disabled={!canKakao} data-share="kakao" title={canKakao ? undefined : "카카오 공유 설정 전이에요"}><i><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="rgba(0,0,0,.86)" d="M12 3C6.5 3 2 6.5 2 10.8c0 2.7 1.8 5 4.5 6.5L5.4 21l4.4-2.5c.7.1 1.4.2 2.2.2 5.5 0 10-3.5 10-7.9S17.5 3 12 3Z" /></svg></i>카카오톡</button>
        <button type="button" className={f.act} onClick={other} data-share="other"><i>↗</i>다른 앱</button>
        <button type="button" className={f.act} onClick={() => void copyLink()} data-share="copy"><i>🔗</i>링크 복사</button>
        <button type="button" className={f.act} onClick={() => download(file())} data-share="save"><i>↓</i>이미지 저장</button>
      </div>
      <button type="button" className={s.link} onClick={close} style={{ justifySelf: "center" }}>닫기</button>
    </div></section>
  </>;
}

const josaEun = (name: string) => { const c = name.charCodeAt(name.length - 1) - 0xac00; return name + (c >= 0 && c <= 11171 && c % 28 !== 0 ? "은" : "는"); };
function clampPhoto(ph: CardPhoto) { const r = photoRect(ph); return { dx: r.dx, dy: r.dy }; }
