"use client";
/** WebGL을 못 쓸 때의 같은 하늘(2D): 같은 별자리 모양 데이터 · 같은 흐름(온도 오르는 별 → 붕괴 → 빅뱅 → 별자리). 기능은 3D와 같다. */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, type RefObject } from "react";
import type { ConstellationShape } from "../../../lib/mirror/constellation";
import { constellationSvg } from "../../../lib/mirror/constellationSvg";
import { seededRandom } from "../../../lib/mirror/hash";
import type { FriendStar } from "../../../lib/mirror/home";
import { heatRGB, type SkyPhase } from "./scene3d";
import s from "../mirror.module.css";

export type Sky2DHandle = { pulse(): void; ring(): void; collapse(): void; orbScreen(): [number, number]; heatColor(): [number, number, number] };
type Props = { phase: SkyPhase; heat: number; shape: ConstellationShape | null; stars: readonly FriendStar[]; newFrom: number; reduce: boolean; flashEl: RefObject<HTMLDivElement | null>; onBang?: () => void; onHome?: () => void };

const rgb = (c: [number, number, number], a = 1) => `rgba(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)},${a})`;
const ORB_Y = 0.4;

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
  useImperativeHandle(ref, () => ({
    pulse: () => setPulse(x => x + 1),
    ring: () => setPulse(x => x + 1),
    collapse: () => undefined,
    orbScreen: () => [innerWidth / 2, innerHeight * ORB_Y],
    heatColor: () => heatRGB(Math.min(1, latest.current.heat + .1)),
  }), []);

  const quiz = p.phase === "quiz" && !collapsing, showShape = banged || p.phase === "home";
  const col = heatRGB(p.heat), size = 60 + 140 * p.heat;
  const growth = Math.min(1, landed / 40);
  const svg = useMemo(() => p.shape ? constellationSvg(p.shape, { size: 320, background: null, friends: p.stars.slice(0, landed) }) : "", [p.shape, p.stars, landed]);
  return <div className={s.sky2d} data-sky2d aria-hidden="true">
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ opacity: quiz ? .25 : showShape ? 1 : .5, transition: "opacity 1.6s" }}>
      {field.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r * .18} fill="#fff" fillOpacity={d.o} />)}
    </svg>
    {growth > 0 ? <div style={{ position: "absolute", inset: 0, background: `radial-gradient(60% 40% at 50% 44%, rgba(160,180,255,${(.18 * growth).toFixed(3)}), transparent 70%)` }} /> : null}
    <div className={s.orb2d} key={pulse} style={{ top: `${ORB_Y * 100}%`, width: collapsing ? 6 : size, height: collapsing ? 6 : size, opacity: (p.phase === "quiz" || collapsing) && !banged ? 1 : 0,
      background: `radial-gradient(circle, #fff 0%, ${rgb(col)} 22%, ${rgb(col, .35)} 45%, transparent 70%)` }} />
    {showShape && p.shape ? <div className={s.shape2d} style={{ position: "absolute", left: "50%", top: "44%", width: "min(86vw, 62vh, 440px)", aspectRatio: "1", transform: "translate(-50%, -50%)", opacity: 1 }}
      dangerouslySetInnerHTML={{ __html: svg.replace("<svg ", '<svg style="width:100%;height:100%" ') }} /> : null}
  </div>;
});
