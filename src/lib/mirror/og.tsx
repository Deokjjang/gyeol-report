import "server-only";
/**
 * /@아이디 링크 미리보기 이미지(1200×630, next/og). 별자리는 화면 · 카드와 같은 모양 데이터(constellationSvg)로 그린다.
 * 사진은 절대 쓰지 않는다(사진은 폰 밖으로 나가지 않는다). 한글은 서브셋 글꼴(src/lib/mirror/fonts, 197KB) — 없는 글자가 있을 때만 원본 글꼴을 함께 넘긴다.
 */
import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import bookCoverage from "../book/fonts/coverage.json";
import { cardText } from "./card/model";
import type { ConstellationShape } from "./constellation";
import { constellationSvg } from "./constellationSvg";
import coverage from "./fonts/coverage.json";
import { mirrorTrialOrigin } from "./trial";
/** 로컬 시험 모드에서만 터널 호스트(그 밖에는 undefined → gyeolreport.com). */
const trialHost = (): string | undefined => { const o = mirrorTrialOrigin(); return o ? new URL(o).host : undefined; };

let subset: Promise<Buffer> | undefined, full: Promise<Buffer> | undefined;
const covered = (ranges: readonly number[][], c: string) => { const p = c.codePointAt(0)!; return ranges.some(([a, b]) => p >= a && p <= b); };
/** 서브셋에 없는 글자가 있는가(있으면 원본 글꼴을 함께 넘긴다). */
export const needsFullFont = (text: string) => Array.from(text).some(c => !covered(coverage, c));
/** 원본에도 없는 글자는 □(Next OG가 원격 글꼴을 부르지 않게). */
export const mirrorOgText = (text: string) => Array.from(text).map(c => covered(coverage, c) || covered(bookCoverage, c) ? c : "□").join("");

export const MIRROR_OG_HEADERS = { "Cache-Control": "public, max-age=300, s-maxage=300", "X-Robots-Tag": "noindex, nofollow, noarchive" };
export type MirrorOgInput = { name: string; handle: string; title: string; sync: number | null; friends: number; showCount: boolean; line: string | null; shape: ConstellationShape | null };

export async function renderMirrorOg(o: MirrorOgInput): Promise<ImageResponse> {
  subset ??= readFile(`${process.cwd()}/src/lib/mirror/fonts/NotoSansKR-Mirror.woff`);
  const t = cardText({ handle: o.handle, sync: o.sync, friends: o.friends, showCount: o.showCount, line: o.line, host: trialHost() });
  const title = mirrorOgText(o.title), handle = mirrorOgText(t.handle), link = mirrorOgText(t.link), count = t.count ? mirrorOgText(t.count) : null;
  const all = [title, handle, link, count ?? "", t.sync, t.syncLabel, "결리포트 GYEOL REPORT"].join("");
  const fonts: { name: string; data: Buffer; weight: 700; style: "normal" }[] = [{ name: "Mirror", data: await subset, weight: 700, style: "normal" }];
  if (needsFullFont(all)) { full ??= readFile(`${process.cwd()}/src/lib/book/fonts/NotoSansKR-Book.woff`); fonts.push({ name: "MirrorFull", data: await full, weight: 700, style: "normal" }); }
  const svg = o.shape ? constellationSvg(o.shape, { size: 560, background: null, lineOpacity: 0.6 }) : null;
  return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", background: "radial-gradient(90% 120% at 28% 45%, #0B0B16 0%, #000 70%)", color: "#F4F4F7", fontFamily: "Mirror, MirrorFull", padding: "35px 70px 35px 40px", alignItems: "center", gap: 40 }}>
    <div style={{ display: "flex", width: 560, height: 560, flex: "none" }}>
      {/* next/og(satori)는 <img>만 그린다 — next/image를 쓸 수 없다. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {svg ? <img width={560} height={560} src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`} alt="" /> : null}
    </div>
    <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", justifyContent: "space-between", padding: "20px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22, color: "#A9A9B1" }}>
        <span>{handle}</span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.1 }}><span style={{ fontSize: 22, color: "#F4F4F7", letterSpacing: -1 }}>결리포트</span><span style={{ fontSize: 11, letterSpacing: 2 }}>GYEOL REPORT</span></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", fontSize: title.length > 14 ? 46 : 54, lineHeight: 1.25, letterSpacing: -2, flexWrap: "wrap" }}>{title}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}><span style={{ fontSize: 64, letterSpacing: -2 }}>{t.sync}</span><span style={{ fontSize: 22, color: "#A9A9B1" }}>{t.syncLabel}</span></div>
        {count ? <div style={{ display: "flex", fontSize: 22, color: "#CAD7FF" }}>{count}</div> : null}
      </div>
      <div style={{ display: "flex", fontSize: 22, color: "#A9A9B1" }}>{link}</div>
    </div>
  </div>, { width: 1200, height: 630, fonts, headers: MIRROR_OG_HEADERS });
}
