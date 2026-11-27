"use client";
/** WebGL을 못 쓸 때의 같은 하늘(2D): 같은 별자리 모양 데이터 · 같은 흐름(온도 오르는 별 → 붕괴 → 빅뱅 → 별자리). 기능은 3D와 같다. */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, type RefObject } from "react";
import type { ConstellationShape } from "../../../lib/mirror/constellation";
import { constellationSvg } from "../../../lib/mirror/constellationSvg";
import { seededRandom } from "../../../lib/mirror/hash";
import type { FriendStar } from "../../../lib/mirror/home";
import { backingAlpha, BACKING, friendDim, GROWTH, growthOf, heatRGB, type SkyPhase } from "./growth";
import s from "../mirror.module.css";

export type Sky2DHandle = { pulse(): void; ring(): void; collapse(): void; orbScreen(): [number, number]; heatColor(): [number, number, number] };
type Props = { phase: SkyPhase; heat: number; shape: ConstellationShape | null; stars: readonly FriendStar[]; newFrom: number; reduce: boolean; flashEl: RefObject<HTMLDivElement | null>; onBang?: () => void; onHome?: () => void };

const rgb = (c: [number, number, number], a = 1) => `rgba(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)},${a})`;
const ORB_Y = 0.4;
/** 별자리 그림 한 변(constellationSvg size 320 · margin 0.12)과 같은 좌표 — 받침이 선 · 별 자리와 정확히 겹치게. */
const BOX = 320, HALF = BOX / 2, SCALE = HALF * (1 - 0.12);
const f1 = (n: number) => n.toFixed(1);

/**
 * 2D 은하(성장 보상, 명령 3 1-3): 3D와 같은 두 팔 나선을 점으로 — 기울인 원반을 좌표에서 직접 눌러(점은 둥근 채로) 그린다.
 * 먼지(크고 옅은 원 — 팔의 은은한 빛) · 기본 점(따뜻한 중심 → 푸른 팔) · 색 있는 별 무리(분홍 · 보라 · 하늘 · 주황).
 */
function galaxyDots() {
  const r = seededRandom(20261203), g = () => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2832 * v); };
  const tilt = -24 * Math.PI / 180, squash = .5, unit = 24;
  const place = (u: number, v: number) => { const vv = v * squash; return { x: 100 + (u * Math.cos(tilt) - vv * Math.sin(tilt)) * unit, y: 100 + (u * Math.sin(tilt) + vv * Math.cos(tilt)) * unit }; };
  const arm = (t: number, k: number, spread: number) => { const rr = .45 * Math.exp(.55 * t), a = t * 1.15 + k * Math.PI + g() * spread / (1 + t * .4); return { ...place(Math.cos(a) * rr + g() * .08 * rr, Math.sin(a) * rr + g() * .08 * rr), rr }; };
  const KNOT = ["#FF6BB8", "#C784FF", "#73C7FF", "#FFB373"];
  const dust = Array.from({ length: 150 }, (_, i) => { const p = arm(.3 + Math.pow(r(), .8) * 3.1, i % 2, .3); return { x: p.x, y: p.y, r: 5 + 8 * r(), o: .14 + .16 * r(), c: i % DUST.length }; });
  const base = Array.from({ length: 560 }, (_, i) => {
    const core = i % 5 === 0, p = core ? { ...place(g() * .45, g() * .45), rr: 0 } : arm(Math.pow(r(), .8) * 3.4, i % 2, .28), k = Math.min(1, p.rr / 3.2);
    return { x: p.x, y: p.y, r: .28 + .4 * r(), o: (.35 + .5 * r()) * (core ? .8 : 1), c: `rgb(${Math.round(255 * (1 - .35 * k))},${Math.round(255 * (.9 - .05 * k))},${Math.round(255 * (.76 + .24 * k))})` };
  });
  const knots = Array.from({ length: 170 }, (_, i) => { const p = arm(.35 + Math.pow(r(), .9) * 3.05, i % 2, .22); return { x: p.x, y: p.y, r: .35 + .55 * Math.pow(r(), 2), o: .5 + .45 * r(), c: KNOT[Math.floor(r() * KNOT.length)] }; });
  return { dust, base, knots };
}
/** 먼지 색(부드러운 원 — 가운데서 가장자리로 사라진다). */
const DUST = ["#7F9CFF", "#A98BFF", "#FFB58A", "#8FD3FF"];
/** 별자리 받침(3D BACKING과 같은 뜻): 선 아래 깃털 띠(굵기 셋을 겹쳐 가장자리를 흐리게) + 별 아래 어두운 원. 은하 전체가 아니라 별자리 둘레만 어둡게. */
function backingSvg(shape: ConstellationShape, alpha: number): string {
  if (alpha <= 0) return "";
  const pts = new Map(shape.points.map(p => [p.index, p])), X = (x: number) => HALF + x * SCALE, Y = (y: number) => HALF - y * SCALE;
  const w = BACKING.halfWidth / 2.7 * SCALE; // 3D 반폭(세계 단위) → 이 그림 단위
  const lines = shape.edges.flatMap(([a, b]) => { const p = pts.get(a), q = pts.get(b); return p && q ? [`M${f1(X(p.x))},${f1(Y(p.y))}L${f1(X(q.x))},${f1(Y(q.y))}`] : []; }).join("");
  const strokes = [[2.4, .22], [1.6, .3], [.9, .38]].map(([k, o]) => `<path d="${lines}" fill="none" stroke="#000" stroke-opacity="${(o * alpha).toFixed(3)}" stroke-width="${f1(w * k)}" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
  const discs = shape.points.map(p => `<circle cx="${f1(X(p.x))}" cy="${f1(Y(p.y))}" r="${f1(w * 2.6)}" fill="url(#bk)" fill-opacity="${alpha.toFixed(3)}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOX} ${BOX}" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible"><defs><radialGradient id="bk" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#000" stop-opacity=".85"/><stop offset=".6" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>${strokes}${discs}</svg>`;
}

export const Sky2D = forwardRef<Sky2DHandle, Props>(function Sky2D(p, ref) {
  const [pulse, setPulse] = useState(0), [collapsing, setCollapsing] = useState(false), [banged, setBanged] = useState(p.phase === "home");
  const [landed, setLanded] = useState(p.newFrom);
  const timers = useRef<number[]>([]);
  const latest = useRef(p); latest.current = p;
  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);
  useEffect(() => { if (p.phase === "home") setBanged(true); }, [p.phase]);
  // 붕괴 → 빅뱅 → 홈(3D와 같은 시간표: 1.25초 뒤 빅뱅, 그 뒤 3.2초에 홈).
  const started = useRef(false);
  useEffect(() => {
    if (p.phase !== "collapse" || started.current) return;
    started.current = true; setCollapsing(true);
    timers.current.push(window.setTimeout(() => {
      const f = latest.current.flashEl.current;
      if (f) { f.style.transition = "none"; f.style.opacity = String(latest.current.reduce ? .3 : .9); void f.offsetWidth; f.style.transition = "opacity 1.5s cubic-bezier(.2,.75,.1,1)"; f.style.opacity = "0"; }
      setBanged(true); latest.current.onBang?.();
    }, latest.current.reduce ? 200 : 1250));
    timers.current.push(window.setTimeout(() => latest.current.onHome?.(), latest.current.reduce ? 600 : 4450));
  }, [p.phase]);
  // 새 친구 별은 하나씩 달린다(3D와 같은 순서).
  useEffect(() => {
    setLanded(p.newFrom);
    if (p.phase !== "home") return;
    const step = p.stars.length - p.newFrom > 12 ? 80 : 450, ids: number[] = [];
    for (let i = p.newFrom; i < p.stars.length; i++) ids.push(window.setTimeout(() => setLanded(n => Math.max(n, i + 1)), 600 + (i - p.newFrom) * step));
    return () => ids.forEach(clearTimeout);
  }, [p.stars, p.newFrom, p.phase]);

  const field = useMemo(() => { const r = seededRandom(20261127); return Array.from({ length: 170 }, () => ({ x: r() * 100, y: r() * 100, r: .4 + Math.pow(r(), 6) * 1.6, o: .25 + .75 * Math.pow(r(), 2) })); }, []);
  const galaxy = useMemo(galaxyDots, []);
  useImperativeHandle(ref, () => ({
    pulse: () => setPulse(x => x + 1),
    ring: () => setPulse(x => x + 1),
    collapse: () => undefined,
    orbScreen: () => [innerWidth / 2, innerHeight * ORB_Y],
    heatColor: () => heatRGB(Math.min(1, latest.current.heat + .1)),
  }), []);

  const quiz = p.phase === "quiz" && !collapsing, showShape = banged || p.phase === "home";
  const col = heatRGB(p.heat), size = 60 + 140 * p.heat;
  // 성장 보상(명령 3 1-3): 3D와 같은 단계 값. 친구가 늘수록 성운 · 은하가 밝고 · 색이 진하고 · 커진다. 별자리는 받침으로 지킨다(명령 2의 밝기 상한은 없앴다).
  const g = growthOf(landed);
  const svg = useMemo(() => p.shape ? constellationSvg(p.shape, { size: 320, background: null, friends: p.stars.slice(0, landed), friendDim: friendDim(p.stars.length), lineOpacity: Math.min(.9, (p.stars.length >= 40 ? .72 : .6) + .1 * growthOf(landed).rich) }) : "", [p.shape, p.stars, landed]);
  const backing = useMemo(() => (p.shape ? backingSvg(p.shape, backingAlpha(growthOf(landed))) : ""), [p.shape, landed]);
  const nebA = g.neb * (GROWTH.neb.base + GROWTH.neb.rich * g.rich), galA = g.gal * (GROWTH.gal.base + GROWTH.gal.rich * g.rich), knotA = g.gal * g.rich * GROWTH.knot.rich;
  const box = "min(86vw, 62vh, 440px)";
  return <div className={s.sky2d} data-sky2d aria-hidden="true">
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ opacity: quiz ? .25 : showShape ? 1 : .5, transition: "opacity 1.6s" }}>
      {field.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r * .18} fill="#fff" fillOpacity={d.o} />)}
    </svg>
    {showShape && nebA > 0 ? <div data-sky2d-nebula style={{ position: "absolute", inset: 0, background: [
      `radial-gradient(${60 + 25 * g.rich}% ${40 + 15 * g.rich}% at 50% 44%, rgba(150,175,255,${(.1 * nebA).toFixed(3)}), transparent 70%)`,
      `radial-gradient(${30 + 18 * g.rich}% ${22 + 12 * g.rich}% at 30% 36%, rgba(196,128,255,${(.16 * nebA * (.35 + .65 * g.rich)).toFixed(3)}), transparent 70%)`,
      `radial-gradient(${28 + 16 * g.rich}% ${20 + 10 * g.rich}% at 72% 54%, rgba(255,150,110,${(.13 * nebA * (.35 + .65 * g.rich)).toFixed(3)}), transparent 70%)`,
    ].join(",") }} /> : null}
    {showShape && galA > 0 ? <svg data-sky2d-galaxy viewBox="0 0 200 200" style={{ position: "absolute", left: "50%", top: "44%", right: "auto", bottom: "auto", width: `calc(${box} * ${(1.2 * (1 + GROWTH.gal.scale * g.rich)).toFixed(3)})`, height: "auto", aspectRatio: "1", transform: "translate(-50%, -50%)", overflow: "visible" }}>
      <defs><radialGradient id="gcore" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#FFE9CF" stopOpacity=".55" /><stop offset=".4" stopColor="#FFD9B0" stopOpacity=".12" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
      {DUST.map((c, k) => <radialGradient key={k} id={`gd${k}`} cx="50%" cy="50%" r="50%"><stop offset="0" stopColor={c} stopOpacity="1" /><stop offset=".45" stopColor={c} stopOpacity=".35" /><stop offset="1" stopColor={c} stopOpacity="0" /></radialGradient>)}</defs>
      <ellipse cx="100" cy="100" rx="34" ry="20" transform="rotate(-24 100 100)" fill="url(#gcore)" opacity={galA} />
      <g opacity={Math.min(1, galA * (1 + g.rich))}>{galaxy.dust.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={`url(#gd${d.c})`} fillOpacity={d.o} />)}</g>
      <g opacity={galA}>{galaxy.base.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} fillOpacity={d.o} />)}</g>
      {knotA > 0 ? <g opacity={knotA}>{galaxy.knots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} fillOpacity={d.o} />)}</g> : null}
    </svg> : null}
    <div className={s.orb2d} key={pulse} style={{ top: `${ORB_Y * 100}%`, width: collapsing ? 6 : size, height: collapsing ? 6 : size, opacity: (p.phase === "quiz" || collapsing) && !banged ? 1 : 0,
      background: `radial-gradient(circle, #fff 0%, ${rgb(col)} 22%, ${rgb(col, .35)} 45%, transparent 70%)` }} />
    {showShape && p.shape ? <div className={s.shape2d} style={{ position: "absolute", left: "50%", top: "44%", width: box, aspectRatio: "1", transform: "translate(-50%, -50%)", opacity: 1 }}
      dangerouslySetInnerHTML={{ __html: backing + svg.replace("<svg ", '<svg style="width:100%;height:100%" ') }} /> : null}
  </div>;
});
