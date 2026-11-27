/**
 * 공유 카드 9:16(1080×1920) — 브라우저 2D 캔버스로 직접 그린다(SPEC 「만드는 방식」). WebGL 화면을 캡처하지 않는다.
 * 별자리는 D0 모양 데이터(ConstellationShape)를 그대로 쓴다 — 화면 · 미리보기 이미지와 같은 모양.
 * 내 사진은 이 기기 안에서만 합성한다(서버로 보내지 않는다). 사진 아래쪽 45%에 그라데이션을 깔고, 그 자리 밝기를 재서 밝을수록 진하게 한다.
 */
import type { ConstellationShape } from "../constellation";
import { seededRandom } from "../hash";
import type { CardText } from "./model";

export const CARD_W = 1080, CARD_H = 1920;
/** 사진 위치: 카드 가운데 기준 이동(카드 픽셀) · 확대(1 = 카드를 꽉 채우는 크기). */
export type CardPhoto = { image: CanvasImageSource; width: number; height: number; dx: number; dy: number; zoom: number };
export type CardScene = { count: string; text: string };
export type CardInput = { text: CardText; shape: ConstellationShape | null; photo?: CardPhoto | null; scene?: CardScene | null; font?: string };

const FONT = '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif';
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

/** 사진을 카드에 꽉 채우는 기본 크기 × zoom, 가운데 + 이동. 이동은 사진이 카드 밖으로 비지 않게 막는다. */
export function photoRect(p: Pick<CardPhoto, "width" | "height" | "dx" | "dy" | "zoom">, W = CARD_W, H = CARD_H) {
  const cover = Math.max(W / p.width, H / p.height) * Math.max(1, p.zoom), w = p.width * cover, h = p.height * cover;
  const mx = (w - W) / 2, my = (h - H) / 2;
  const dx = clamp(p.dx, -mx, mx), dy = clamp(p.dy, -my, my);
  return { x: (W - w) / 2 + dx, y: (H - h) / 2 + dy, w, h, dx, dy };
}

/** 아래 45% 평균 밝기(0~1) → 그라데이션 진하기. 밝은 사진일수록 진하게(0.55~0.9). */
export const gradientAlpha = (luma: number) => clamp(0.55 + 0.4 * luma, 0.55, 0.9);

export function drawCard(ctx: CanvasRenderingContext2D, o: CardInput): { luma: number | null } {
  const W = CARD_W, H = CARD_H, font = o.font ?? FONT;
  ctx.save();
  ctx.clearRect(0, 0, W, H);
  let luma: number | null = null;
  if (o.photo) {
    const r = photoRect(o.photo);
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
    ctx.drawImage(o.photo.image, r.x, r.y, r.w, r.h);
    luma = regionLuma(ctx, 0, Math.round(H * 0.55), W, Math.round(H * 0.45));
    const a = gradientAlpha(luma ?? 0.5), g = ctx.createLinearGradient(0, H * 0.55, 0, H);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(0.35, `rgba(0,0,0,${(a * 0.7).toFixed(3)})`); g.addColorStop(1, `rgba(0,0,0,${a.toFixed(3)})`);
    ctx.fillStyle = g; ctx.fillRect(0, H * 0.55, W, H * 0.45);
    const top = ctx.createLinearGradient(0, 0, 0, 260); top.addColorStop(0, "rgba(0,0,0,.45)"); top.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = top; ctx.fillRect(0, 0, W, 260);
  } else {
    const bg = ctx.createRadialGradient(W / 2, H * 0.4, 0, W / 2, H * 0.4, H * 0.75);
    bg.addColorStop(0, "#0B0B16"); bg.addColorStop(1, "#000"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    field(ctx, W, H);
  }
  // 별자리: 사진 카드는 위쪽에 작게, 별자리 카드는 가운데 크게.
  if (o.shape && o.photo) {
    // 밝은 사진 위에서도 작은 별자리가 보이게 뒤에 옅은 어둠을 깐다.
    const d = ctx.createRadialGradient(W - 210, 470, 0, W - 210, 470, 210);
    d.addColorStop(0, "rgba(0,0,0,.5)"); d.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = d; ctx.beginPath(); ctx.arc(W - 210, 470, 210, 0, Math.PI * 2); ctx.fill();
    drawShape(ctx, o.shape, W - 210, 470, 300);
  } else if (o.shape) drawShape(ctx, o.shape, W / 2, H * 0.4, 960);

  ctx.textBaseline = "alphabetic"; ctx.fillStyle = "#F4F4F7";
  shadow(ctx, !!o.photo);
  // 위: @아이디 · 로고
  ctx.font = `500 40px ${font}`; ctx.textAlign = "left"; ctx.fillStyle = "#D9D9E0"; ctx.fillText(o.text.handle, 72, 150);
  ctx.textAlign = "right"; ctx.fillStyle = "#F4F4F7"; ctx.font = `800 46px ${font}`; ctx.fillText("결리포트", W - 72, 140);
  ctx.font = `500 22px ${font}`; ctx.fillStyle = "#C9C9D0"; letterSpaced(ctx, "GYEOL REPORT", W - 72, 176, 4.2, "right");

  // 아래(위에서부터): 싱크로율 → (토글) 친구 수 → 한마디 → 링크. 장면 공유면 근거 줄 + 장면 문장 → 링크.
  ctx.textAlign = "left";
  const x = 72, bottom = H - 120;
  ctx.font = `400 34px ${font}`; ctx.fillStyle = "#C9C9D0"; ctx.fillText(o.text.link, x, bottom);
  let y = bottom - 92;
  if (o.scene) {
    ctx.font = `500 58px ${font}`; ctx.fillStyle = "#F4F4F7";
    const lines = wrap(ctx, o.scene.text, W - 2 * x).slice(0, 4);
    for (let i = lines.length - 1; i >= 0; i--) { ctx.fillText(lines[i], x, y); y -= 80; }
    ctx.font = `500 40px ${font}`; ctx.fillStyle = "#CAD7FF"; ctx.fillText(o.scene.count, x, y - 6);
  } else {
    ctx.font = `500 60px ${font}`; ctx.fillStyle = "#F4F4F7";
    const lines = wrap(ctx, o.text.line, W - 2 * x).slice(0, 2);
    for (let i = lines.length - 1; i >= 0; i--) { ctx.fillText(lines[i], x, y); y -= 82; }
    if (o.text.count) { ctx.font = `400 42px ${font}`; ctx.fillStyle = "#CAD7FF"; ctx.fillText(o.text.count, x, y - 4); y -= 84; }
    ctx.font = `300 190px ${font}`; ctx.fillStyle = "#F4F4F7";
    const sw = ctx.measureText(o.text.sync).width; ctx.fillText(o.text.sync, x - 6, y - 40);
    ctx.font = `400 40px ${font}`; ctx.fillStyle = "#C9C9D0"; ctx.fillText(o.text.syncLabel, x + sw + 18, y - 48);
  }
  ctx.restore();
  return { luma };
}

function shadow(ctx: CanvasRenderingContext2D, on: boolean) { ctx.shadowColor = on ? "rgba(0,0,0,.45)" : "rgba(0,0,0,0)"; ctx.shadowBlur = on ? 18 : 0; ctx.shadowOffsetY = on ? 2 : 0; }
function letterSpaced(ctx: CanvasRenderingContext2D, t: string, x: number, y: number, sp: number, align: "left" | "right") {
  const chars = [...t], w = chars.reduce((s, c) => s + ctx.measureText(c).width + sp, -sp);
  let cx = align === "right" ? x - w : x;
  ctx.textAlign = "left";
  for (const c of chars) { ctx.fillText(c, cx, y); cx += ctx.measureText(c).width + sp; }
  ctx.textAlign = align;
}
/** 한국어 줄바꿈: 띄어쓰기 단위로, 한 낱말이 너무 길면 글자 단위. */
export function wrap(ctx: Pick<CanvasRenderingContext2D, "measureText">, text: string, max: number): string[] {
  const out: string[] = []; let cur = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = cur ? `${cur} ${word}` : word;
    if (ctx.measureText(next).width <= max) { cur = next; continue; }
    if (cur) out.push(cur);
    if (ctx.measureText(word).width <= max) { cur = word; continue; }
    cur = "";
    for (const ch of word) { if (ctx.measureText(cur + ch).width > max && cur) { out.push(cur); cur = ch; } else cur += ch; }
  }
  if (cur) out.push(cur);
  return out;
}
function regionLuma(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): number | null {
  try {
    const d = ctx.getImageData(x, y, w, h).data; let sum = 0, n = 0;
    for (let i = 0; i < d.length; i += 4 * 37) { sum += (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255; n++; }
    return n ? sum / n : null;
  } catch { return null; }
}
function field(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const r = seededRandom(20261127);
  for (let i = 0; i < 240; i++) {
    const x = r() * W, y = r() * H, rad = 0.8 + Math.pow(r(), 6) * 3.2, o = 0.18 + 0.6 * Math.pow(r(), 2);
    ctx.fillStyle = `rgba(255,255,255,${o.toFixed(2)})`; ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
  }
}
/** 별자리(constellationSvg와 같은 규칙): 선 → 빛무리 → 별. cx · cy = 가운데, size = 한 변. */
export function drawShape(ctx: CanvasRenderingContext2D, shape: ConstellationShape, cx: number, cy: number, size: number) {
  const half = size / 2, scale = half * 0.88, X = (x: number) => cx + x * scale, Y = (y: number) => cy - y * scale, k = size / 320;
  const pts = new Map(shape.points.map(p => [p.index, p]));
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.22);
  core.addColorStop(0, "rgba(255,243,230,.9)"); core.addColorStop(0.25, "rgba(255,230,204,.25)"); core.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = core; ctx.beginPath(); ctx.arc(cx, cy, scale * 0.22, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = Math.max(1.4, 1.1 * k); ctx.lineCap = "round";
  for (const [a, b] of shape.edges) { const p = pts.get(a), q = pts.get(b); if (!p || !q) continue; ctx.beginPath(); ctx.moveTo(X(p.x), Y(p.y)); ctx.lineTo(X(q.x), Y(q.y)); ctx.stroke(); }
  for (const p of shape.points) {
    const r = (2.2 + 2.6 * p.brightness) * k, glow = ctx.createRadialGradient(X(p.x), Y(p.y), 0, X(p.x), Y(p.y), r * 3.2);
    const a = 0.35 + 0.5 * p.brightness;
    glow.addColorStop(0, `rgba(255,255,255,${a.toFixed(2)})`); glow.addColorStop(0.35, `rgba(255,241,226,${(a * 0.9).toFixed(2)})`); glow.addColorStop(1, "rgba(202,215,255,0)");
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), r * 3.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), r, 0, Math.PI * 2); ctx.fill();
  }
}
