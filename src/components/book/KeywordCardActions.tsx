"use client";
import { useEffect, useRef, useState } from "react";
import type { BookShareModel } from "../../lib/book/shareModel";
import shareStyle from "./bookShare.module.css";

/**
 * AM 2부 세운 키워드 카드 [이미지 저장] [공유]. 이미지는 공유 링크(토큰) 아래 서버 이미지(1080×1350)를 미리 받아 두고,
 * 버튼을 누른 순간에는 await 없이 바로 저장·공유한다(아이폰 사파리는 fetch를 기다린 뒤의 공유를 막는다, hotfix-share와 같은 원칙).
 * 이름은 선택(기본 끔). 생년월일·사주 원문은 이미지에 넣지 않는다.
 */
export function KeywordCardActions({ owner, local = false }: { owner: { reportId: string }; local?: boolean }) {
  const [url, setUrl] = useState<string | null>(null), [withName, setWithName] = useState(false), [message, setMessage] = useState("");
  const file = useRef<File | null>(null), blobUrl = useRef<string | null>(null);
  useEffect(() => {
    let live = true;
    void fetch(local ? "/dev/book-flow/share" : "/api/book-share", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reportId: owner.reportId }), cache: "no-store" })
      .then(r => r.json().catch(() => null) as Promise<{ model?: BookShareModel } | null>).then(r => { if (live && r?.model?.shareUrl) setUrl(r.model.shareUrl); else if (live) setMessage("이미지를 준비하지 못했어요. 잠시 뒤 다시 열어 주세요."); })
      .catch(() => { if (live) setMessage("이미지를 준비하지 못했어요. 잠시 뒤 다시 열어 주세요."); });
    return () => { live = false; };
  }, [owner.reportId, local]);
  useEffect(() => {
    if (!url) return;
    let live = true; file.current = null;
    void fetch(`${url}/keyword-card${withName ? "?name=1" : ""}`, { cache: "no-store" }).then(r => (r.ok ? r.blob() : null)).then(b => {
      if (!live || !b) return;
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
      blobUrl.current = URL.createObjectURL(b); file.current = new File([b], "gyeol-keywords.png", { type: "image/png" });
    }).catch(() => undefined);
    return () => { live = false; };
  }, [url, withName]);
  useEffect(() => () => { if (blobUrl.current) URL.revokeObjectURL(blobUrl.current); }, []);
  function save() {
    if (!blobUrl.current) { setMessage("이미지를 만드는 중이에요. 잠깐 뒤 다시 눌러 주세요."); return; }
    const a = document.createElement("a"); a.href = blobUrl.current; a.download = "gyeol-keywords.png"; document.body.appendChild(a); a.click(); a.remove();
    setMessage("이미지를 저장했어요. 아이폰은 열린 이미지를 길게 눌러 사진에 저장할 수 있어요.");
  }
  function share() {
    const f = file.current, nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (f && nav.canShare?.({ files: [f] })) { nav.share({ files: [f], title: "나의 키워드" }).catch(() => undefined); return; }
    if (url && nav.share) { nav.share({ url, title: "나의 키워드" }).catch(() => undefined); return; }
    setMessage("이 브라우저는 공유를 지원하지 않아요. [이미지 저장]을 눌러 주세요.");
  }
  return <section className={shareStyle.actions} aria-label="키워드 카드 저장·공유" data-keyword-actions>
    <div className={shareStyle.buttons}><button type="button" onClick={save} data-keyword-save>이미지 저장</button><button type="button" onClick={share} data-keyword-share>공유</button></div>
    <label><input type="checkbox" checked={withName} onChange={e => setWithName(e.target.checked)} /> 카드에 이름 넣기</label>
    <p className={shareStyle.status} role="status">{message}</p>
  </section>;
}
