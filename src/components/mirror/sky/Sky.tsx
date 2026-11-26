"use client";
/**
 * 하늘 한 장: WebGL이 되면 3D(scene3d.ts, three는 여기서만 동적 import), 안 되면 같은 별자리를 2D로(Sky2D).
 * WebGL 컨텍스트가 끊기면 그동안 2D를 덮어 보여 주고, 되살아나면 3D로 돌아간다. prefers-reduced-motion이면 움직임을 줄인다.
 * ?sky=2d 로 2D 화면을 직접 볼 수 있다(확인용 · 저사양 사용자 선택).
 */
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { ConstellationShape } from "../../../lib/mirror/constellation";
import type { FriendStar } from "../../../lib/mirror/home";
import type { SkyController, SkyPhase } from "./scene3d";
import { Sky2D, type Sky2DHandle } from "./Sky2D";
import s from "../mirror.module.css";

export type SkyHandle = { pulse(): void; ring(): void; collapse(): void; orbScreen(): [number, number]; heatColor(): [number, number, number] };
export type SkyProps = { phase: SkyPhase; heat: number; shape: ConstellationShape | null; stars: readonly FriendStar[]; newFrom: number; onBang?: () => void; onHome?: () => void };

export function webglAvailable(): boolean {
  try { const c = document.createElement("canvas"); return Boolean(c.getContext("webgl2") ?? c.getContext("webgl")); } catch { return false; }
}

export const Sky = forwardRef<SkyHandle, SkyProps>(function Sky(props, ref) {
  const canvas = useRef<HTMLCanvasElement>(null), path = useRef<SVGPathElement>(null), flash = useRef<HTMLDivElement>(null);
  const ctl = useRef<SkyController | null>(null), flat = useRef<Sky2DHandle>(null);
  const [mode, setMode] = useState<"pending" | "3d" | "2d">("pending");
  const [lost, setLost] = useState(false);
  const latest = useRef(props); latest.current = props;
  const reduce = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    let cancelled = false;
    const forced2d = new URLSearchParams(location.search).get("sky") === "2d";
    if (forced2d || !webglAvailable()) { setMode("2d"); return; }
    const el = canvas.current!;
    const onLost = () => setLost(true), onRestored = () => setLost(false);
    el.addEventListener("webglcontextlost", onLost); el.addEventListener("webglcontextrestored", onRestored);
    (async () => {
      try {
        const [THREE, { createSky3D }] = await Promise.all([import("three"), import("./scene3d")]);
        if (cancelled) return;
        ctl.current = createSky3D(THREE, { canvas: el, path: path.current!, flash: flash.current!, reduce, onBang: () => latest.current.onBang?.(), onHome: () => latest.current.onHome?.() });
        setMode("3d");
      } catch { if (!cancelled) setMode("2d"); }
    })();
    return () => { cancelled = true; el.removeEventListener("webglcontextlost", onLost); el.removeEventListener("webglcontextrestored", onRestored); ctl.current?.dispose(); ctl.current = null; };
  }, [reduce]);

  // 선언형 값 → 3D 제어기
  useEffect(() => { ctl.current?.setPhase(props.phase); }, [props.phase, mode]);
  useEffect(() => { ctl.current?.setHeat(props.heat); }, [props.heat, mode]);
  useEffect(() => { ctl.current?.setShape(props.shape); }, [props.shape, mode]);
  useEffect(() => { ctl.current?.setFriends(props.stars, props.newFrom); }, [props.stars, props.newFrom, mode]);

  const use2d = mode === "2d" || lost;
  useImperativeHandle(ref, () => ({
    pulse: () => { ctl.current?.pulse(); flat.current?.pulse(); },
    ring: () => { ctl.current?.ring(); flat.current?.ring(); },
    collapse: () => undefined,
    orbScreen: () => (!use2d && ctl.current ? ctl.current.orbScreen() : flat.current?.orbScreen() ?? [innerWidth / 2, innerHeight * .4]),
    heatColor: () => ctl.current?.heatColor() ?? flat.current?.heatColor() ?? [1, .8, .6],
  }), [use2d]);

  return <>
    <canvas ref={canvas} className={s.gl} aria-hidden="true" data-sky-mode={use2d ? "2d" : mode} style={mode === "2d" ? { display: "none" } : undefined} />
    <svg className={s.graph} aria-hidden="true"><path ref={path} d="" fill="none" stroke="#FFFFFF" strokeOpacity="0" strokeWidth="1" strokeLinecap="round" /></svg>
    {use2d ? <Sky2D ref={flat} {...props} reduce={reduce} flashEl={flash} /> : null}
    <div ref={flash} className={s.flash} />
  </>;
});
