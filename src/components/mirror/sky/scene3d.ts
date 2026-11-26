/**
 * 「남이 본 나」 3D 하늘(docs/mirror/prototype-v4.html의 셰이더 · 빔 과녁 · 충격파 · 빅뱅 · 카메라 동작을 옮김).
 * 별자리 점 · 선은 D0 모양 데이터(src/lib/mirror/constellation.ts)를 그대로 쓴다 — 2D 카드 · 미리보기 이미지와 같은 모양.
 * three는 이 모듈을 쓰는 화면에서만 동적 import로 들어온다(Sky.tsx). 이 파일은 three 타입만 import한다.
 */
import type * as THREEType from "three";
import { facetAngle, SHAPE, type ConstellationShape } from "../../../lib/mirror/constellation";
import { hash32, seededRandom } from "../../../lib/mirror/hash";
import type { FriendStar } from "../../../lib/mirror/home";

type Three = typeof THREEType;
export type SkyPhase = "idle" | "quiz" | "collapse" | "bang" | "home";
export type SkyController = {
  setPhase(phase: SkyPhase): void;
  setHeat(target: number): void;
  pulse(): void;
  ring(): void;
  collapse(): void;
  setShape(shape: ConstellationShape | null): void;
  setFriends(stars: readonly FriendStar[], newFrom: number): void;
  orbScreen(): [number, number];
  heatColor(): [number, number, number];
  dispose(): void;
};
export type SkyOptions = {
  canvas: HTMLCanvasElement; path: SVGPathElement; flash: HTMLElement; reduce: boolean;
  onBang?: () => void; onHome?: () => void; onLand?: (star: FriendStar) => void;
};

/** 단위 원 좌표 → 세계 좌표(시안의 별 반지름 1.15~2.1과 비슷한 크기). */
const WORLD = 2.7;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const ease = (x: number) => 1 - Math.pow(1 - clamp(x, 0, 1), 3);
const HEAT = [[.55, .08, .03], [1, .42, .12], [1, .82, .6], [1, .97, .93], [.75, .85, 1]];
export const heatRGB = (h: number): [number, number, number] => {
  const x = clamp(h, 0, 1) * 4, i = Math.min(3, Math.floor(x)), f = x - i, a = HEAT[i], b = HEAT[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
};

export function createSky3D(THREE: Three, o: SkyOptions): SkyController {
  const rand = Math.random;
  const gauss = () => { let u = 0, v = 0; while (!u) u = rand(); while (!v) v = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2832 * v); };
  const renderer = new THREE.WebGLRenderer({ canvas: o.canvas, antialias: true, powerPreference: "high-performance" });
  let PR = Math.min(window.devicePixelRatio || 1, 1.75);
  renderer.setPixelRatio(PR); renderer.setClearColor(0x000000, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, .1, 600);
  const sky = new THREE.Group(); scene.add(sky);
  const world = new THREE.Group(); scene.add(world);
  const C = new THREE.Group(); C.rotation.x = -.22; world.add(C);
  const mats: THREEType.ShaderMaterial[] = [];
  const geos: THREEType.BufferGeometry[] = [];
  const VS = `attribute float aSize; attribute vec3 aColor; attribute float aSeed;
    uniform float uTime, uPR, uOpacity, uTw;
    varying vec3 vC; varying float vA;
    void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0);
      float tw = 1.0 + uTw * sin(uTime * (1.0 + aSeed * 2.0) + aSeed * 50.0);
      gl_PointSize = min(aSize * uPR * tw * (300.0 / -mv.z), 48.0 * uPR);
      gl_Position = projectionMatrix * mv; vC = aColor; vA = uOpacity; }`;
  const FS = `varying vec3 vC; varying float vA;
    void main(){ float d = length(gl_PointCoord - .5);
      float a = pow(smoothstep(.5, 0.0, d), 2.4) + smoothstep(.08, 0.0, d) * .6;
      gl_FragColor = vec4(vC * a * vA, a * vA); }`;
  const BURST_VS = `attribute float aSize; attribute vec3 aColor; attribute float aSeed;
    uniform float uTime, uPR, uOpacity, uBang; varying vec3 vC; varying float vA;
    void main(){ vec3 dir = normalize(position + vec3(.0001,.0002,.0003));
      vec3 p = dir * (.05 + (4.0 + aSeed * 13.0) * (1.0 - exp(-uBang * 1.4)));
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_PointSize = min(aSize * uPR * (300.0 / -mv.z), 20.0 * uPR);
      gl_Position = projectionMatrix * mv; vC = aColor; vA = uOpacity * exp(-uBang * 1.6); }`;
  function mat(vs: string, extra: Record<string, THREEType.IUniform> = {}) {
    const m = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 }, uPR: { value: PR }, uOpacity: { value: 1 }, uTw: { value: .12 }, ...extra }, vertexShader: vs, fragmentShader: FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    mats.push(m); return m;
  }
  function geo(n: number, fill: (i: number, p: Float32Array, c: Float32Array, s: Float32Array, sd: Float32Array) => void) {
    const g = new THREE.BufferGeometry(), pos = new Float32Array(n * 3), col = new Float32Array(n * 3), size = new Float32Array(n), seed = new Float32Array(n);
    for (let i = 0; i < n; i++) fill(i, pos, col, size, seed);
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1)); g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    geos.push(g); return g;
  }
  const TEMP = [[.74, .82, 1], [.88, .92, 1], [1, 1, 1], [1, .95, .88], [1, .84, .68]];
  const tcol = () => { const r = rand(); return TEMP[r < .18 ? 0 : r < .45 ? 1 : r < .75 ? 2 : r < .92 ? 3 : 4]; };

  // 먼 별 · 은하수 띠
  const farMat = mat(VS);
  sky.add(new THREE.Points(geo(4200, (i, p, c, s, sd) => {
    const th = 6.2832 * rand(), ph = Math.acos(2 * rand() - 1), r = 70 + rand() * 60;
    p[i * 3] = r * Math.sin(ph) * Math.cos(th); p[i * 3 + 1] = r * Math.cos(ph); p[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    const t = tcol(), b = .22 + .7 * Math.pow(rand(), 2.4); c[i * 3] = t[0] * b; c[i * 3 + 1] = t[1] * b; c[i * 3 + 2] = t[2] * b;
    s[i] = .5 + 2.2 * Math.pow(rand(), 8); sd[i] = rand();
  }), farMat));
  const bandMat = mat(VS); bandMat.uniforms.uTw.value = 0;
  const band = new THREE.Points(geo(12000, (i, p, c, s, sd) => {
    const th = rand() * 6.2832, R = 95 + gauss() * 4, y = gauss() * (5 + 4 * Math.abs(Math.sin(th * 1.5)));
    p[i * 3] = Math.cos(th) * R; p[i * 3 + 1] = y; p[i * 3 + 2] = Math.sin(th) * R;
    const warm = Math.max(0, Math.cos(th - 1.2)) * .5, b = .07 + .12 * rand();
    c[i * 3] = (.8 + .2 * warm) * b; c[i * 3 + 1] = (.82 + .08 * warm) * b; c[i * 3 + 2] = (.95 - .2 * warm) * b;
    s[i] = .35 + .6 * rand(); sd[i] = rand();
  }), bandMat); band.rotation.set(1.05, .2, .55); sky.add(band);

  // 질문지의 별(온도가 오르는 구) — 시안 셰이더 그대로
  const orbMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uHeat: { value: 0 }, uPulse: { value: 0 }, uAlpha: { value: 0 }, uCollapse: { value: 0 } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: `uniform float uTime, uHeat, uPulse, uAlpha, uCollapse; varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }
      float fbm(vec2 p){ float v = 0.0, a = .5; for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.03; a *= .5; } return v; }
      vec3 heatCol(float h){ vec3 c1 = vec3(.55,.08,.03), c2 = vec3(1.,.42,.12), c3 = vec3(1.,.82,.6), c4 = vec3(1.,.97,.93), c5 = vec3(.75,.85,1.);
        if (h < .25) return mix(c1, c2, h / .25); if (h < .5) return mix(c2, c3, (h - .25) / .25); if (h < .75) return mix(c3, c4, (h - .5) / .25); return mix(c4, c5, (h - .75) / .25); }
      void main(){ vec2 p = (vUv - .5) * 2.0; float r = length(p);
        float size = mix(.12, .34, uHeat) * (1.0 + .08 * uPulse) * (1.0 - .9 * uCollapse);
        float ang = atan(p.y, p.x);
        float n = fbm(vec2(ang * 1.4 + uTime * .12, r * 3.2 - uTime * .35));
        float core = exp(-pow(r / max(size, .001), 2.0) * 2.4);
        float halo = exp(-r / (size * 2.4 + .001)) * .5 * (.55 + .45 * n);
        float wisp = smoothstep(.5, .95, fbm(p * 2.4 + vec2(uTime * .05, -uTime * .07))) * exp(-r / (size * 3.4 + .001)) * .45 * (.25 + uHeat);
        vec3 col = heatCol(uHeat);
        vec3 c = col * (halo + wisp) * (1.0 + .5 * uPulse) + mix(col, vec3(1.0), .65) * core * (1.1 + uHeat + 2.5 * uCollapse);
        c *= uAlpha * smoothstep(1.0, .62, r);
        gl_FragColor = vec4(c, 1.0); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const orbGeo = new THREE.PlaneGeometry(7, 7);
  const orb = new THREE.Mesh(orbGeo, orbMat); scene.add(orb);
  const burstMat = mat(BURST_VS, { uBang: { value: 0 } }); burstMat.uniforms.uOpacity.value = 0;
  world.add(new THREE.Points(geo(2400, (i, p, c, s, sd) => {
    const th = 6.2832 * rand(), ph = Math.acos(2 * rand() - 1);
    p[i * 3] = Math.sin(ph) * Math.cos(th); p[i * 3 + 1] = Math.cos(ph) * .7; p[i * 3 + 2] = Math.sin(ph) * Math.sin(th);
    const t = tcol(); c[i * 3] = t[0]; c[i * 3 + 1] = t[1]; c[i * 3 + 2] = t[2]; s[i] = .4 + 1.2 * Math.pow(rand(), 3); sd[i] = rand();
  }), burstMat));

  // 별자리 12개 · 성단 · 성운 · 은하(친구 수에 따라 자란다)
  const N = 12;
  const SV = Array.from({ length: N }, () => new THREE.Vector3()), AV = Array.from({ length: N }, () => new THREE.Vector3());
  const present = new Array<boolean>(N).fill(false);
  let edges: [number, number][] = [];
  const clusMat = mat(VS); clusMat.uniforms.uOpacity.value = 0; clusMat.uniforms.uTw.value = .3;
  const clusG = geo(520, (i, p, c, s, sd) => { const t = tcol(), b = .5 + .5 * rand(); c[i * 3] = t[0] * b; c[i * 3 + 1] = t[1] * b; c[i * 3 + 2] = t[2] * b; s[i] = .25 + .45 * Math.pow(rand(), 2); sd[i] = rand(); });
  C.add(new THREE.Points(clusG, clusMat));
  const nebMat = mat(VS); nebMat.uniforms.uTw.value = 0; nebMat.uniforms.uOpacity.value = 0;
  const centers = Array.from({ length: 8 }, (_, k) => ({ a: k * .78 + rand() * .3, r: .8 + rand() * 1.8, sg: .55 + rand() * .7, cool: k % 3 !== 1 }));
  world.add(new THREE.Points(geo(2600, (i, p, c, s, sd) => {
    const cc = centers[i % centers.length];
    p[i * 3] = Math.cos(cc.a) * cc.r + gauss() * cc.sg; p[i * 3 + 1] = Math.sin(cc.a) * cc.r * .8 + gauss() * cc.sg * .7; p[i * 3 + 2] = -1.4 + gauss() * cc.sg * .6;
    const b = .045 + .06 * rand(); if (cc.cool) { c[i * 3] = .5 * b; c[i * 3 + 1] = .66 * b; c[i * 3 + 2] = 1 * b; } else { c[i * 3] = 1 * b; c[i * 3 + 1] = .7 * b; c[i * 3 + 2] = .5 * b; }
    s[i] = 1.3 + 2.4 * rand(); sd[i] = rand();
  }), nebMat));
  const galMat = mat(VS); galMat.uniforms.uTw.value = .06; galMat.uniforms.uOpacity.value = 0;
  const gal = new THREE.Points(geo(14000, (i, p, c, s, sd) => {
    let x, y, z, rr;
    if (i % 5 === 0) { rr = Math.abs(gauss()) * .55; const th = rand() * 6.2832, ph = Math.acos(2 * rand() - 1); x = rr * Math.sin(ph) * Math.cos(th); y = rr * Math.cos(ph) * .45; z = rr * Math.sin(ph) * Math.sin(th); }
    else { const arm = i % 2, t = Math.pow(rand(), .8) * 3.4; rr = .45 * Math.exp(.55 * t); const a = t * 1.15 + arm * Math.PI + gauss() * .28 / (1 + t * .4); x = Math.cos(a) * rr + gauss() * .08 * rr; z = Math.sin(a) * rr + gauss() * .08 * rr; y = gauss() * .06 * (1 + rr * .3); }
    p[i * 3] = x; p[i * 3 + 1] = y; p[i * 3 + 2] = z;
    const k = clamp(rr / 3.2, 0, 1), b = .14 + .34 * rand() * (1 - k * .4);
    c[i * 3] = (1 - .35 * k) * b; c[i * 3 + 1] = (.9 - .05 * k) * b; c[i * 3 + 2] = (.76 + .24 * k) * b;
    s[i] = .3 + .7 * rand(); sd[i] = rand();
  }), galMat); gal.rotation.set(1.18, 0, .3); gal.position.set(0, 0, -1.2); gal.scale.setScalar(1.05); world.add(gal);

  const selfMat = mat(VS); selfMat.uniforms.uOpacity.value = 0; selfMat.uniforms.uTw.value = .06;
  const selfG = geo(N, (i, p, c, s, sd) => { c[i * 3] = 1; c[i * 3 + 1] = .96; c[i * 3 + 2] = .9; s[i] = 0; sd[i] = rand(); });
  C.add(new THREE.Points(selfG, selfMat));
  const CAP = 420;
  const friendMat = mat(VS); friendMat.uniforms.uTw.value = .1;
  const fG = geo(CAP, (i, p, c, s, sd) => { sd[i] = rand(); }); fG.setDrawRange(0, 0);
  C.add(new THREE.Points(fG, friendMat));
  function spikeTex() {
    const cv = document.createElement("canvas"); cv.width = cv.height = 256; const g = cv.getContext("2d")!;
    const r = g.createRadialGradient(128, 128, 0, 128, 128, 128); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(.05, "rgba(255,248,238,.95)"); r.addColorStop(.18, "rgba(255,236,214,.22)"); r.addColorStop(.5, "rgba(200,210,255,.04)"); r.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = r; g.fillRect(0, 0, 256, 256); g.globalCompositeOperation = "lighter";
    ([[0, 1], [1, 0]] as const).forEach(([vx, vy]) => { const lg = g.createLinearGradient(128 - 128 * vx, 128 - 128 * vy, 128 + 128 * vx, 128 + 128 * vy); lg.addColorStop(0, "rgba(255,255,255,0)"); lg.addColorStop(.5, "rgba(255,255,255,.6)"); lg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = lg; if (vx) g.fillRect(0, 127, 256, 2); else g.fillRect(127, 0, 2, 256); });
    return new THREE.CanvasTexture(cv);
  }
  const coreTex = spikeTex();
  const coreMat = new THREE.SpriteMaterial({ map: coreTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const core = new THREE.Sprite(coreMat); core.scale.set(0, 0, 1); C.add(core);
  const ringGeo = new THREE.RingGeometry(.985, 1, 180);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xFFF3E6, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat); scene.add(ring);
  let ringAt = -10, ringCol: [number, number, number] = [1, 1, 1];

  // ---------- 상태 ----------
  const S = { phase: "idle" as SkyPhase, t: 0, heat: 0, heatT: 0, pulse: 0, quizAt: 0, collapseAt: -1, bangAt: -1, lift: .14, zoomZ: 0, clus: 0, clusT: 0, neb: 0, nebT: 0, gal: 0, galT: 0, landedCount: 0 };
  type Star = { data: FriendStar; target: THREEType.Vector3; from: THREEType.Vector3; ctrl: THREEType.Vector3; t0: number; dur: number; col: [number, number, number]; size: number; landed: boolean; landAt: number; animate: boolean };
  const STARS: Star[] = [];

  function setShape(shape: ConstellationShape | null) {
    present.fill(false);
    edges = shape ? shape.edges : [];
    const p = selfG.attributes.position.array as Float32Array, sz = selfG.attributes.aSize.array as Float32Array;
    for (let i = 0; i < N; i++) sz[i] = 0;
    const jr = seededRandom(shape?.seed ?? 1);
    for (const pt of shape?.points ?? []) {
      const i = pt.index; present[i] = true;
      SV[i].set(pt.x * WORLD, pt.y * WORLD, (jr() - .5) * .2);
      // 친구 답이 내 답과 다를 때 별이 놓일 곳: 반대쪽으로 비켜서고 덜 멀리(시안의 AV).
      const a2 = facetAngle(i) + (pt.side === "A" ? -SHAPE.lean : SHAPE.lean), r2 = (SHAPE.inner + SHAPE.span * (1 - pt.strength * .55)) * WORLD;
      AV[i].set(Math.cos(a2) * r2, Math.sin(a2) * r2, SV[i].z);
      p[i * 3] = SV[i].x; p[i * 3 + 1] = SV[i].y; p[i * 3 + 2] = SV[i].z;
      sz[i] = .8 + .9 * pt.brightness;
    }
    selfG.attributes.position.needsUpdate = true; selfG.attributes.aSize.needsUpdate = true;
    const cp = clusG.attributes.position.array as Float32Array, idx = SV.map((_, i) => i).filter(i => present[i]);
    for (let i = 0; i < 520; i++) { const v = SV[idx.length ? idx[i % idx.length] : 0], j = .12 + .3 * Math.pow(rand(), .7); cp[i * 3] = v.x + gauss() * j; cp[i * 3 + 1] = v.y + gauss() * j; cp[i * 3 + 2] = v.z + gauss() * j; }
    clusG.attributes.position.needsUpdate = true;
    for (const st of STARS) placeStar(st);
  }
  function placeStar(st: Star) {
    const r = seededRandom(hash32(`star3d:${st.data.key}`)), g = () => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2832 * v); };
    const base = (st.data.matched ? SV : AV)[st.data.facet], same = STARS.filter(s => s !== st && s.data.facet === st.data.facet && s.data.matched === st.data.matched).length, j = .05 + .02 * Math.sqrt(same);
    st.target.set(base.x + g() * j, base.y + g() * j, base.z + g() * j * 1.5);
    const sa = r() * 6.2832; st.from.set(Math.cos(sa) * 9, Math.sin(sa) * 6, 4 + r() * 4);
    st.ctrl.copy(st.from).add(st.target).multiplyScalar(.5).add(new THREE.Vector3(g() * 1.5, g() * 1.5, 0));
  }
  function setGrowth(n: number) {
    S.clusT = clamp((n - 3) / 3, 0, 1); S.nebT = clamp((n - 8) / 12, 0, 1); S.galT = clamp((n - 25) / 60, 0, 1);
  }
  function setFriends(stars: readonly FriendStar[], newFrom: number) {
    STARS.length = 0;
    stars.slice(0, CAP).forEach((data, i) => {
      const bright = [.66, .82, 1][data.closeness - 1];
      const st: Star = { data, target: new THREE.Vector3(), from: new THREE.Vector3(), ctrl: new THREE.Vector3(), t0: 0, dur: o.reduce ? .2 : 1.2, col: data.golden ? [1, .82, .54] : [bright, bright * .97, 1],
        size: data.golden ? 2.3 : [.75, .95, 1.25][data.closeness - 1], landed: i < newFrom, landAt: -10, animate: i >= newFrom };
      placeStar(st); STARS.push(st);
    });
    // 새 별은 하나씩 날아와 달린다(시안의 「+ 친구」 연출). 이미 본 별은 제자리.
    let delay = 0;
    for (const st of STARS) if (st.animate) { st.t0 = S.t + .6 + delay; delay += STARS.length - newFrom > 12 ? .08 : .45; }
    S.landedCount = Math.min(newFrom, STARS.length);
    setGrowth(S.landedCount);
  }

  const tmp = new THREE.Vector3();
  const toScreen = (v: THREEType.Vector3): [number, number] => { tmp.copy(v); C.localToWorld(tmp); tmp.project(camera); return [(tmp.x * .5 + .5) * innerWidth, (-tmp.y * .5 + .5) * innerHeight]; };
  function drawLines(alpha: number, segs: number) {
    C.updateMatrixWorld();
    let d = "";
    edges.slice(0, segs).forEach(([a, b]) => { const P = toScreen(SV[a]), Q = toScreen(SV[b]); d += `M${P[0].toFixed(1)},${P[1].toFixed(1)}L${Q[0].toFixed(1)},${Q[1].toFixed(1)}`; });
    o.path.setAttribute("d", d); o.path.setAttribute("stroke-opacity", alpha.toFixed(3));
  }
  function bang() {
    S.phase = "bang"; S.bangAt = S.t;
    const f = o.flash; f.style.transition = "none"; f.style.opacity = String(o.reduce ? .3 : .95); void f.offsetWidth; f.style.transition = "opacity 1.5s cubic-bezier(.2,.75,.1,1)"; f.style.opacity = "0";
    o.onBang?.();
  }

  // 드래그로 둘러보기
  const look = { x: 0, y: 0, vx: 0 }; let drag: { x: number; y: number } | null = null;
  const down = (e: PointerEvent) => { drag = { x: e.clientX, y: e.clientY }; o.canvas.setPointerCapture?.(e.pointerId); };
  const move = (e: PointerEvent) => { if (!drag) return; const dx = (e.clientX - drag.x) / innerWidth, dy = (e.clientY - drag.y) / innerHeight; look.vx = dx * 2.5; look.x += dx * 2.5; look.y = clamp(look.y + dy * 1.6, -.5, .5); drag = { x: e.clientX, y: e.clientY }; };
  const up = () => { drag = null; };
  o.canvas.addEventListener("pointerdown", down); o.canvas.addEventListener("pointermove", move); o.canvas.addEventListener("pointerup", up); o.canvas.addEventListener("pointercancel", up);
  function resize() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); o.path.ownerSVGElement?.setAttribute("viewBox", `0 0 ${innerWidth} ${innerHeight}`); }
  addEventListener("resize", resize); resize();

  let last = performance.now(), frames = 0, acc = 0, raf = 0, disposed = false;
  const L = (a: number, b: number, r: number, dt: number) => a + (b - a) * (1 - Math.exp(-dt * r));
  function frame(now: number) {
    if (disposed) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(.05, (now - last) / 1000); last = now; S.t += dt; const t = S.t;
    for (const m of mats) m.uniforms.uTime.value = t;
    orbMat.uniforms.uTime.value = t;
    S.heat = L(S.heat, S.heatT, 1.6, dt); S.pulse *= Math.exp(-dt * 3.2);
    S.neb = L(S.neb, S.nebT, .7, dt); S.gal = L(S.gal, S.galT, .6, dt); S.clus = L(S.clus, S.clusT, .9, dt);
    const tanH = Math.tan((camera.fov * Math.PI) / 360), Rr = 2.35;
    const Z = Math.max(Rr / (.72 * tanH * camera.aspect), Rr / (.42 * tanH)) * (1 + .35 * S.gal);
    const liftT = S.phase === "home" ? -.02 : .14;
    S.lift = L(S.lift, liftT, 2, dt); S.zoomZ = L(S.zoomZ || Z, Z, 2.2, dt);
    camera.position.set(0, 0, S.zoomZ); camera.lookAt(0, 0, 0);
    world.position.y = S.lift * S.zoomZ * tanH;
    if (!drag) { look.x += look.vx * dt; look.vx *= Math.exp(-dt * 2.5); look.x *= Math.exp(-dt * .35); look.y *= Math.exp(-dt * .6); }
    world.rotation.y = look.x + Math.sin(t * .06) * (o.reduce ? .03 : .14); world.rotation.x = look.y * .5;
    sky.rotation.y = world.rotation.y * .2 + t * .003; sky.rotation.x = world.rotation.x * .2;
    gal.rotation.y = t * .025;
    let skyA = .4, orbA = 0, collapseK = 0, selfA = 0, segs = 0, coreS = 0;
    if (S.phase === "quiz") { skyA = .1; orbA = clamp((t - S.quizAt) / 1.4, 0, 1); }
    if (S.phase === "collapse") { const ct = t - S.collapseAt; skyA = .1 * (1 - ease(ct / .8)); collapseK = ease(ct / .8); orbA = ct < .8 ? 1 : Math.max(0, 1 - (ct - .8) / .15); if (ct > 1.25) bang(); }
    if (S.phase === "bang" || S.phase === "home") {
      const bt = S.phase === "bang" ? t - S.bangAt : 99;
      burstMat.uniforms.uBang.value = Math.min(bt, 6); burstMat.uniforms.uOpacity.value = bt < 6 ? 1 : 0;
      if (bt < 2.2) { ringAt = S.bangAt; ringCol = [1, .95, .9]; }
      const growth = 1 + .25 * S.clus + .35 * S.neb + .4 * S.gal;
      const ce = bt < .9 ? ease(bt / .9) * 1.45 : 1.45 - .3 * ease((bt - .9) / 1.2); coreS = ce * growth * (1 + .025 * Math.sin(t * 2));
      skyA = ease((bt - .6) / 2.6); selfA = ease((bt - .7) / 1.2); segs = Math.floor(ease((bt - .9) / 1.6) * edges.length);
      if (S.phase === "bang" && bt > 3.2) { S.phase = "home"; o.onHome?.(); }
    } else burstMat.uniforms.uOpacity.value = 0;
    orb.position.set(0, world.position.y, 0);
    orbMat.uniforms.uHeat.value = S.heat; orbMat.uniforms.uPulse.value = S.pulse; orbMat.uniforms.uAlpha.value = orbA; orbMat.uniforms.uCollapse.value = collapseK;
    const rk = (t - ringAt) / (S.phase === "bang" ? 1.9 : 1.3);
    ringMat.opacity = rk >= 0 && rk < 1 ? .7 * (1 - rk) : 0; const rs = S.phase === "bang" ? .3 + rk * 13 : .5 + rk * 4.5; ring.scale.set(rs, rs, 1); ring.position.copy(orb.position); ringMat.color.setRGB(ringCol[0], ringCol[1], ringCol[2]);
    farMat.uniforms.uOpacity.value = skyA; bandMat.uniforms.uOpacity.value = skyA * .85;
    selfMat.uniforms.uOpacity.value = selfA; core.scale.set(coreS * .9, coreS * .9, 1);
    clusMat.uniforms.uOpacity.value = S.clus * .9; nebMat.uniforms.uOpacity.value = S.neb * .85; galMat.uniforms.uOpacity.value = S.gal * .9;
    // 친구 별: 홈에서만 날아와 달린다.
    const p = fG.attributes.position.array as Float32Array, c = fG.attributes.aColor.array as Float32Array, s = fG.attributes.aSize.array as Float32Array;
    const n = S.phase === "home" || S.phase === "bang" ? STARS.length : 0;
    let drawn = 0;
    for (let i = 0; i < n; i++) {
      const st = STARS[i]; let x: number, y: number, z: number, sz = st.size;
      if (!st.landed) {
        if (S.phase !== "home" || t < st.t0) continue;
        const u = ease((t - st.t0) / st.dur), a = 1 - u;
        x = a * a * st.from.x + 2 * a * u * st.ctrl.x + u * u * st.target.x; y = a * a * st.from.y + 2 * a * u * st.ctrl.y + u * u * st.target.y; z = a * a * st.from.z + 2 * a * u * st.ctrl.z + u * u * st.target.z; sz = st.size * 1.6;
        if (t >= st.t0 + st.dur) { st.landed = true; st.landAt = t; S.landedCount++; setGrowth(S.landedCount); o.onLand?.(st.data); }
      } else { x = st.target.x; y = st.target.y; z = st.target.z; sz = st.size * (1 + 1.4 * Math.exp(-(t - st.landAt) * 5)) * (st.data.golden ? 1 + .08 * Math.sin(t * 2 + i) : 1); }
      p[drawn * 3] = x; p[drawn * 3 + 1] = y; p[drawn * 3 + 2] = z; c[drawn * 3] = st.col[0]; c[drawn * 3 + 1] = st.col[1]; c[drawn * 3 + 2] = st.col[2]; s[drawn] = sz; drawn++;
    }
    fG.setDrawRange(0, drawn); fG.attributes.position.needsUpdate = true; fG.attributes.aColor.needsUpdate = true; fG.attributes.aSize.needsUpdate = true;
    renderer.render(scene, camera);
    if (S.phase === "bang" || S.phase === "home") drawLines(selfA * (S.landedCount >= 3 ? .62 : S.landedCount >= 1 ? .5 : .4), segs);
    else o.path.setAttribute("d", "");
    // 저사양: 50프레임 평균이 느리면 해상도를 낮춘다(시안 규칙, 0.6배까지).
    frames++; acc += dt;
    if (frames === 50) { const avg = acc / frames; if (avg > .028 && PR > .6) { PR = Math.max(.6, PR - .35); renderer.setPixelRatio(PR); resize(); for (const m of mats) m.uniforms.uPR.value = PR; } frames = 0; acc = 0; }
  }
  raf = requestAnimationFrame(frame);

  return {
    setPhase(phase) {
      // 붕괴는 한 번만 시작하고, 그 뒤 빅뱅 → 홈은 이 장면이 스스로 넘어간다.
      if (phase === "collapse") { if (S.phase !== "collapse" && S.phase !== "bang") { S.phase = "collapse"; S.collapseAt = S.t; } return; }
      if (phase === "home" && S.phase === "bang") return;
      if (phase === "quiz" && S.phase !== "quiz") S.quizAt = S.t;
      S.phase = phase;
    },
    setHeat(target) { S.heatT = clamp(target, 0, 1); },
    pulse() { S.pulse = 1; },
    ring() { ringAt = S.t; ringCol = heatRGB(S.heatT); },
    collapse() { S.phase = "collapse"; S.collapseAt = S.t; },
    setShape, setFriends,
    orbScreen() { tmp.copy(orb.position); tmp.project(camera); return [(tmp.x * .5 + .5) * innerWidth, (-tmp.y * .5 + .5) * innerHeight]; },
    heatColor() { return heatRGB(Math.min(1, S.heatT + .1)); },
    dispose() {
      disposed = true; cancelAnimationFrame(raf); removeEventListener("resize", resize);
      o.canvas.removeEventListener("pointerdown", down); o.canvas.removeEventListener("pointermove", move); o.canvas.removeEventListener("pointerup", up); o.canvas.removeEventListener("pointercancel", up);
      for (const g of geos) g.dispose(); for (const m of mats) m.dispose();
      orbGeo.dispose(); orbMat.dispose(); coreTex.dispose(); coreMat.dispose(); ringGeo.dispose(); ringMat.dispose();
      renderer.dispose();
    },
  };
}
