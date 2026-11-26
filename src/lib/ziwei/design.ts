/**
 * ZW-2 3부 — 자미 책 9장 설계도(결정론, 호출 0). 브리프(brief.ts)의 Z 줄 · 짝 · 칸 렌즈 · 장면에서 장 · 소제목 · 소제목 지시 4칸 · 처방 배분을 만든다.
 * - 9장(덕짱님 2026-11-26): 1 내 명반 읽는 법 · 2 나의 칸 · 3 속마음과 나중의 나 · 4 돈과 일의 칸 · 5 사랑과 가족의 칸 · 6 사람의 칸 · 7 몸과 마음의 리듬 ·
 *   8 내 별에 붙은 네 꼬리표 · 9 지금 머무는 10년의 칸. 장마다 소제목 2~3개.
 * - 소제목 지시 4칸: 핵심 · 이 사람 재료 · 짝 또는 장면 하나 · 기조(지킬 것, 본문에 옮기지 않는다 — 할 말로만, 금지 낱말을 적지 않는다: 0부 덕짱님 수정 2).
 * - 근거 집 장: Z 줄마다 집 장 하나(brief.home). 다른 장에서 쓰는 줄은 「새 각도」(away)로만 준다.
 * - 처방(0부 덕짱님 수정 1): 장마다 고정하지 않는다 — 그 장 집 줄의 31차원 합으로 사전 종류의 선호 순서를 매기고(장 주제에 맞는 종류 안에서), 장끼리 겹치지 않게
 *   기존 배분(allocateChapters — 같은 갈래 상한 1 · 이웃 장 같은 갈래 금지)으로 고른다. 1장 없음 · 9장은 「사전 밖의 행동 한 가지」.
 */
import { allocateChapters, type RxKind } from "@/lib/brief/prescriptions";
import { needMet, neutralize, type Inputs } from "@/lib/brief/premise";
import { MUTAGEN_NAMES, PALACE_NAMES, type MutagenId, type PalaceId } from "./ids";
import type { ZiweiBrief, ZLine, ZPair, ZTension } from "./brief";
import { josa } from "@/lib/brief/labels";

export const ZIWEI_DESIGN_VERSION = "ziwei-design-zw2" as const;
export type ZSection = {
  readonly q: string; readonly lines: readonly string[];
  /** 소제목 지시 4칸. */
  readonly core: string; readonly own: string; readonly third?: string; readonly tone: string;
  readonly pair?: string; readonly scene?: string;
};
export type ZChapter = {
  readonly n: number; readonly id: string; readonly title: string; readonly question: string; readonly target: readonly [number, number];
  readonly sections: readonly ZSection[]; readonly home: readonly string[]; readonly away: Readonly<Record<string, number>>;
  readonly rx: { readonly use: RxKind | null; readonly forbid: readonly RxKind[]; readonly label?: string }; readonly rxAt?: number;
};
export type ZiweiDesign = { readonly version: typeof ZIWEI_DESIGN_VERSION; readonly chapters: readonly ZChapter[]; readonly rxScores: Readonly<Record<number, readonly (readonly [RxKind, number])[]>> };

/** 장 목록(제목 · 고객 질문 · 처방 후보). */
export const ZIWEI_CHAPTERS: readonly { readonly n: number; readonly id: string; readonly title: string; readonly question: string; readonly rx: readonly RxKind[] | "none" | "outside" }[] = [
  { n: 1, id: "read", title: "내 명반 읽는 법", question: "나는 어떤 지도를 갖고 태어났을까?", rx: "none" },
  { n: 2, id: "me", title: "나의 칸", question: "나는 어떤 별 아래 태어났을까?", rx: ["말 다듬기·한 박자", "끝까지 듣기", "하루 묵히기", "혼자 시간", "한마디 건네기", "끝낼 일 하나", "적기·목록", "몸 움직이기"] },
  { n: 3, id: "inner", title: "속마음과 나중의 나", question: "겉과 속, 그리고 갈수록 드러나는 나는 어떤 모습일까?", rx: ["혼자 시간", "적기·목록", "쉬기·잠", "몸 움직이기", "한마디 건네기", "끝낼 일 하나"] },
  { n: 4, id: "moneywork", title: "돈과 일의 칸", question: "나는 어디서 벌고 어떻게 일할까?", rx: ["끝낼 일 하나", "값 매기기", "월급날·먼저 떼어 두기", "보내기 전 다시 읽기", "하루 묵히기", "적기·목록"] },
  { n: 5, id: "love", title: "사랑과 가족의 칸", question: "나는 어떤 사랑을 하고 어떤 가족을 꾸릴까?", rx: ["끝까지 듣기", "말 다듬기·한 박자", "한마디 건네기", "연락·안부", "하루 묵히기", "혼자 시간"] },
  { n: 6, id: "people", title: "사람의 칸", question: "나는 누구와 잘 맞고 어디서 지칠까?", rx: ["사람 고르기", "연락·안부", "끝까지 듣기", "한마디 건네기", "말 다듬기·한 박자", "혼자 시간", "하루 묵히기", "적기·목록"] },
  { n: 7, id: "rhythm", title: "몸과 마음의 리듬", question: "나는 언제 지치고 어떻게 회복할까?", rx: ["쉬기·잠", "몸 움직이기", "혼자 시간", "적기·목록"] },
  { n: 8, id: "mutagen", title: "내 별에 붙은 네 꼬리표", question: "나는 어디서 풀리고 어디서 공을 들일까?", rx: ["적기·목록", "하루 묵히기", "끝낼 일 하나", "쉬기·잠", "보내기 전 다시 읽기", "말 다듬기·한 박자", "몸 움직이기"] },
  { n: 9, id: "decade", title: "지금 머무는 10년의 칸", question: "지금 10년은 어느 칸이고, 다음 10년은 어디일까?", rx: "outside" },
];
export const ZIWEI_CHAPTER_TARGET: readonly [number, number] = [1000, 1250];
/** 작가 묶음(세운 · 대운과 같은 방식, 6개): [1+2] [3+4] [5] [6+7] [8] [9]. */
export const ZIWEI_CHUNK_GROUPS: readonly (readonly string[])[] = [["read", "me"], ["inner", "moneywork"], ["love"], ["people", "rhythm"], ["mutagen"], ["decade"]];

/** 처방 종류 → 차원 쏠림(그 끝이 셀수록 이 행동이 필요한 쪽). 사전(prescriptions RX) 종류 이름 그대로. */
export const RX_DIMS: Readonly<Record<RxKind, Readonly<Record<string, number>>>> = {
  "말 다듬기·한 박자": { directness: 1, reactivity: 0.8, verbalOutput: 0.6, conflictApproach: 0.5 },
  "끝까지 듣기": { verbalOutput: 0.8, decisionSpeed: 0.5, controlNeed: 0.5, empathyResponse: -0.6 },
  "하루 묵히기": { decisionSpeed: 1, riskTaking: 0.8, reactivity: 0.6, noveltySeeking: 0.4 },
  "보내기 전 다시 읽기": { detailFocus: -0.8, decisionSpeed: 0.6, verbalOutput: 0.3 },
  "값 매기기": { caretaking: 0.6, boundarySetting: -0.6, statusDrive: -0.4 },
  "월급날·먼저 떼어 두기": { spendingControl: -1, riskTaking: 0.4, noveltySeeking: 0.3 },
  "사람 고르기": { socialEnergy: 0.7, trustThreshold: -0.8, caretaking: 0.4 },
  "쉬기·잠": { persistence: 0.8, perfectionism: 0.6, dutifulness: 0.6, controlNeed: 0.3 },
  "혼자 시간": { socialEnergy: 0.8, caretaking: 0.5, attentionSeeking: 0.4, introspection: -0.4 },
  "끝낼 일 하나": { noveltySeeking: 0.9, persistence: -0.8, planning: -0.4, mobility: 0.4 },
  "연락·안부": { independence: 0.7, socialEnergy: -0.6, trustThreshold: 0.5 },
  "한마디 건네기": { emotionalExpression: -0.9, introspection: 0.5, boundarySetting: 0.3 },
  "몸 움직이기": { introspection: 0.7, mobility: -0.6, planning: 0.3, reactivity: 0.3 },
  "적기·목록": { planning: -0.8, perfectionism: 0.5, introspection: 0.3, noveltySeeking: 0.3, detailFocus: -0.3 },
};
/** 입력이 있어야 하는 종류(월급날 · 값 매기기 = 돈을 버는 일). */
const rxFits = (kd: RxKind, x: Inputs) => (kd === "월급날·먼저 떼어 두기" || kd === "값 매기기" ? needMet("job:work", x) : true);
const sumDims = (ls: readonly ZLine[]) => { const o: Record<string, number> = {}; for (const l of ls) for (const [d, v] of Object.entries(l.dims)) o[d] = (o[d] ?? 0) + v; return o; };
const scoreRx = (dims: Readonly<Record<string, number>>, kd: RxKind) => Object.entries(RX_DIMS[kd]).reduce((s, [d, w]) => s + (dims[d] ?? 0) * w, 0);

const PE = (p: PalaceId) => PALACE_NAMES[p].easy;
/** 짧은 요지: 첫 문장(쉼표 마디에서 끊어 max자 안). */
export function gist(t: string, max = 44): string {
  const s = (t.split(/(?<=[.!?])\s+/)[0] ?? "").replace(/[.!?]$/, "").trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max), at = Math.max(cut.lastIndexOf(", "), cut.lastIndexOf(" · "));
  return (at > 12 ? cut.slice(0, at) : cut.replace(/\s\S*$/, "")).trim();
}
const tensionNote = (ts: readonly ZTension[], ids: readonly string[]) => ts.filter(t => ids.includes(t.a) || ids.includes(t.b)).slice(0, 1).map(t => `${t.a} × ${t.b}의 ${josa(t.dimName, "이가")} 반대 끝 — ${t.kind === "긴장" ? "같은 칸 안의 두 결, 둘 다 이 사람으로 한 문장 안에 함께" : "칸마다 다른 얼굴, 무대를 붙여 함께"}`);

export function buildZiweiDesign(b: ZiweiBrief): ZiweiDesign {
  const L = (pred: (l: ZLine) => boolean) => b.lines.filter(pred);
  const one = (pred: (l: ZLine) => boolean) => b.lines.find(pred);
  const palaceLine = (p: PalaceId) => one(l => l.kind === "palace" && l.palace === p)!;
  const usedScenes = new Set<string>();
  const sceneOf = (p: PalaceId | "body") => { const pool = p === "body" ? b.body.scenes : b.palaces[p].scenes; const s = pool.find(x => !usedScenes.has(x)); if (s) usedScenes.add(s); return s; };
  const pairFor = (() => { const left = [...b.pairs]; return () => left.shift(); })();
  const inp = b.person, rel = inp.relationshipStatus;
  const ids = (ls: readonly (ZLine | undefined)[]) => ls.filter((l): l is ZLine => Boolean(l)).map(l => l.id);
  const sec = (a: { q: string; lines: readonly (ZLine | undefined)[]; core: string; own: string; tone: string; palace?: PalaceId | "body"; pair?: ZPair | undefined; extra?: readonly string[] }): ZSection => {
    const ls = ids(a.lines), pair = a.pair, scene = pair ? undefined : a.palace ? sceneOf(a.palace) : undefined;
    const t = tensionNote(b.tensions, ls);
    return { q: a.q, lines: [...new Set([...ls, ...(pair ? [pair.b] : []), ...(a.extra ?? [])])], core: a.core, own: [a.own, ...t].filter(Boolean).join(" · "), tone: a.tone,
      ...(pair ? { pair: pair.id, third: `짝 ${pair.id}(${pair.reason}) — 묶음 지시의 MBTI 줄 · 짝대로 한 문장` } : scene ? { scene, third: `장면(큰 틀, 조건이나 비유로 다른 문장 안에): ${scene}` } : {}) };
  };
  const angle = (p: PalaceId) => b.palaces[p].angle;
  const relSay = rel === "married" ? "기혼" : rel === "dating" || rel === "marriage_preparing" ? "연애 중" : rel === "some" ? "썸" : rel === "single" ? "솔로" : "연애 상태 미입력";
  const partnerTone = rel === "married" || rel === "dating" || rel === "marriage_preparing" ? "곁의 한 사람과 지내는 방식으로 직설과 따뜻함을 함께" : "만나게 되면 · 가까워지면 꼴로, 끌리는 사람과 마음을 여는 방식으로";
  const childTone = inp.children === "has" ? "기르는 방식의 장점을 먼저, 붙어 살피는 정도와 믿고 맡기는 정도로" : "아랫사람 · 내가 길러 내는 일 · 가르치는 사람으로 읽는다";
  const workTone = /^(employee|freelancer|self_employed|business_owner)$/.test(inp.jobStatus) ? "맡은 몫을 해내는 방식 — 장점은 직설로" : inp.jobStatus === "student" ? "공부와 맡은 몫을 해내는 방식으로" : "일을 대하는 방식과 맡은 몫을 해내는 힘으로";
  const facty = (l: ZLine | undefined) => (l ? `${l.id} ${gist(l.value.replace(/ · 곁의 별:.*$/, ""), 46)}${l.meaning ? ` — ${gist(l.meaning)}` : ""}` : "");
  const lifeP = palaceLine("myeong"), life = b.chart.palaces.find(p => p.id === "myeong")!;
  const empties = b.chart.palaces.filter(p => p.empty);
  const chapters: { n: number; sections: ZSection[]; away: Record<string, number> }[] = [];

  // 1장
  const chart = one(l => l.kind === "chart"), cls = one(l => l.kind === "class"), emp = one(l => l.kind === "empty");
  chapters.push({ n: 1, away: {}, sections: [
    sec({ q: "명반은 무엇이고 어떻게 읽을까?", lines: [chart, cls], core: `${chart?.id}: 명반은 열두 칸 — 칸마다 삶의 무대, 칸에 앉은 별이 그 무대의 나 · ${cls?.id}: ${gist(cls?.value ?? "")}`, own: `${cls?.id} ${gist(cls?.meaning ?? "", 50)}`, tone: "읽는 법은 짧게, 이 사람 명반의 값으로 바로 들어간다" }),
    sec({ q: "내 명궁과 신궁은 어디에 있을까?", lines: [chart], core: `${chart?.id}: 명궁 칸은 「나」, 신궁은 ${PE(b.chart.bodyPalace.palace)} 칸에 겹침`, own: `읽는 각도: ${angle("myeong")} · 신궁: ${b.body.angle || "살아갈수록 무게가 실리는 쪽"}`, tone: "두 자리를 지도 위의 출발점과 갈수록 커지는 쪽으로" }),
    ...(emp ? [sec({ q: "비어 있는 칸은 어떻게 읽을까?", lines: [emp], core: `${emp.id}: 빈 칸 ${empties.length}개는 맞은편 칸의 별을 빌려 읽는다`, own: empties.map(p => `${PE(p.id)} ← ${PE(p.borrowFrom!)}`).join(" · "), tone: "빈 칸은 모자람이 아니라 맞은편 별의 결이 비치는 칸" })] : []),
  ] });
  // 2장
  const essence = L(l => l.kind === "essence"), strengths = L(l => l.kind === "strength"), overuse = L(l => l.kind === "overuse"), minors = L(l => l.kind === "minor");
  const deepMe = one(l => l.kind === "deep" && l.palace === "myeong"), watchMe = one(l => l.kind === "deepWatch" && l.palace === "myeong");
  const p1 = pairFor(), p2 = pairFor();
  chapters.push({ n: 2, away: {}, sections: [
    sec({ q: `${life.empty ? "빌려 읽은 별" : "명궁의 별"}은 나를 어떻게 말할까?`, lines: [lifeP, ...essence], core: facty(lifeP), own: essence.map(l => `${l.id} ${gist(l.meaning)}`).join(" · "), tone: life.empty ? "빈 명궁은 맞은편 별이 비치는 자리 — 장점은 직설 단정으로" : "장점은 직설 단정으로, 이 사람 이야기처럼", palace: "myeong", pair: p1 }),
    sec({ q: minors.length ? "곁의 별과 내가 잘 쓰는 힘은 무엇일까?" : "내가 잘 쓰는 힘은 무엇일까?", lines: [...strengths, ...minors], core: strengths.map(l => `${l.id} ${gist(l.meaning)}`).join(" · "), own: minors.map(l => `${l.id} ${gist(l.value)} — ${gist(l.meaning)}`).join(" · ") || `입력: ${relSay} · 일 ${inp.jobStatus || "미입력"}`, tone: minors.some(l => l.cards.some(c => b.cards.find(x => x.id === c)?.kind === "malefic")) ? "날카로운 별은 쓰임으로 — 근거와 함께 말하고 따뜻하게 닫는다" : "힘은 구체적인 쓰임으로" , palace: "myeong", pair: p2 }),
    sec({ q: "깊이 보면 나는 어떤 사람일까?", lines: [deepMe, watchMe, ...overuse], core: facty(deepMe), own: [...overuse, watchMe].filter((x): x is ZLine => Boolean(x)).map(l => `${l.id} ${gist(l.meaning)}`).join(" · "), tone: "팩폭은 근거 하나로 — 아픈 말 뒤에는 그 힘의 쓸모로 닫는다", palace: "myeong" }),
  ] });
  // 3장
  const bok = palaceLine("bokdeok"), body = one(l => l.kind === "body"), bodyPalace = b.chart.bodyPalace.palace, bodyHome = palaceLine(bodyPalace);
  chapters.push({ n: 3, away: bodyHome && bodyHome.home !== 3 ? { [bodyHome.id]: bodyHome.home } : {}, sections: [
    sec({ q: "속으로 쉬고 즐거워지는 방식은?", lines: [bok], core: facty(bok), own: `읽는 각도: ${angle("bokdeok")}`, tone: "속마음은 따뜻하게, 이 사람만의 쉬는 법으로", palace: "bokdeok" }),
    sec({ q: "갈수록 드러나는 나는 어떤 모습일까?", lines: [body], core: facty(body), own: bodyHome && bodyHome.home !== 3 ? `${bodyHome.id}(집 ${bodyHome.home}장) — 새 각도 한 줄만: 시간이 갈수록 무게가 실리는 쪽` : `${PE(bodyPalace)} 칸이 곧 갈수록 드러나는 나`, tone: "앞날의 일이 아니라 갈수록 힘이 모이는 쪽으로", palace: "body", extra: bodyHome && bodyHome.home !== 3 ? [bodyHome.id] : [] }),
  ] });
  // 4장
  const pal = (p: PalaceId) => palaceLine(p), deep = (p: PalaceId) => one(l => l.kind === "deep" && l.palace === p), dw = (p: PalaceId) => one(l => l.kind === "deepWatch" && l.palace === p);
  chapters.push({ n: 4, away: {}, sections: [
    sec({ q: "나는 돈을 어떻게 벌고 쓰고 모을까?", lines: [pal("jaebaek"), deep("jaebaek"), dw("jaebaek")], core: facty(pal("jaebaek")), own: [`읽는 각도: ${angle("jaebaek")}`, deep("jaebaek") && `${deep("jaebaek")!.id} ${gist(deep("jaebaek")!.meaning)}`].filter(Boolean).join(" · "), tone: "돈은 성향과 원칙으로 — 액수 · 시기 · 결과를 정하지 않는다", palace: "jaebaek" }),
    sec({ q: "나는 어떤 방식으로 일할 때 힘이 날까?", lines: [pal("gwanrok"), deep("gwanrok"), dw("gwanrok")], core: facty(pal("gwanrok")), own: [`읽는 각도: ${angle("gwanrok")}`, deep("gwanrok") && `${deep("gwanrok")!.id} ${gist(deep("gwanrok")!.meaning)}`].filter(Boolean).join(" · "), tone: workTone, palace: "gwanrok" }),
    sec({ q: "집 밖 낯선 무대에서 나는 어떤 사람일까?", lines: [pal("cheoni")], core: facty(pal("cheoni")), own: `읽는 각도: ${angle("cheoni")}`, tone: "바깥에서 열리는 모습을 장점 쪽으로", palace: "cheoni" }),
  ] });
  // 5장
  const love = one(l => l.kind === "love");
  chapters.push({ n: 5, away: {}, sections: [
    sec({ q: "나는 어떤 사랑을 할까?", lines: [pal("bucheo"), deep("bucheo"), dw("bucheo")], core: facty(pal("bucheo")), own: `읽는 각도: ${angle("bucheo")} · 입력: ${relSay}`, tone: partnerTone, palace: "bucheo" }),
    sec({ q: "나는 무엇을 어떻게 길러 낼까?", lines: [pal("janyeo")], core: facty(pal("janyeo")), own: `읽는 각도: ${angle("janyeo")}`, tone: childTone, palace: "janyeo" }),
    sec({ q: "내 터전과 마음이 끌리는 쪽은?", lines: [pal("jeontaek"), love], core: facty(pal("jeontaek")), own: [`읽는 각도: ${angle("jeontaek")}`, love && `${love.id} ${gist(love.value, 60)}`].filter(Boolean).join(" · "), tone: "터전은 가꾸는 방식으로, 끌림은 마음이 가는 쪽으로", palace: "jeontaek" }),
  ] });
  // 6장
  chapters.push({ n: 6, away: {}, sections: (["hyeongje", "nobok", "bumo"] as const).map(p => sec({ q: p === "hyeongje" ? "곁에서 나란히 가는 사람들과 나는?" : p === "nobok" ? "넓게 어울리는 사람들 속에서 나는?" : "부모와 윗사람 앞에서 나는?", lines: [pal(p)], core: facty(pal(p)), own: `읽는 각도: ${angle(p)}`, tone: p === "bumo" ? "윗사람과의 결을 장점부터, 부딪치는 곳은 근거와 함께" : "잘 맞는 사람과 지치는 자리를 함께", palace: p })) });
  // 7장
  const jil = pal("jilaek");
  chapters.push({ n: 7, away: { [bok.id]: 3 }, sections: [
    sec({ q: "내 힘은 언제 차고 언제 빠질까?", lines: [jil], core: facty(jil), own: `읽는 각도: ${angle("jilaek")}`, tone: "힘이 차고 빠지는 리듬과 쉬는 법으로만", palace: "jilaek" }),
    sec({ q: "지쳤을 때 나는 어떻게 회복할까?", lines: [bok], core: `${bok.id}(집 3장) — 새 각도 한 줄만: 마음 쉼터가 회복 쪽으로 쓰이는 모습`, own: `회복의 순서: 컨디션 리듬 칸(${jil.id}) → 마음 쉼터 칸(${bok.id})`, tone: "회복은 이 사람에게 맞는 순서로, 따뜻하게", palace: "jilaek", extra: [] }),
  ] });
  // 8장
  const mut = (m: MutagenId) => one(l => l.kind === "mutagen" && l.facts.mutagens?.[0].mutagen === m);
  const giW = one(l => l.kind === "mutagenWatch");
  const awayOf = (ls: readonly (ZLine | undefined)[]) => Object.fromEntries(ls.filter((l): l is ZLine => Boolean(l) && Boolean(l!.palace)).map(l => { const h = palaceLine(l.palace!); return [h.id, h.home] as const; }));
  const mm = (m: MutagenId) => { const l = mut(m); return l ? `${l.id} ${MUTAGEN_NAMES[m].ko}(${MUTAGEN_NAMES[m].easy}) — ${gist(l.value.split(" · ").slice(1).join(" · "), 40)}` : ""; };
  chapters.push({ n: 8, away: awayOf([mut("rok"), mut("gwon"), mut("gwa"), mut("gi")]), sections: [
    sec({ q: "힘을 덜 들여도 술술 풀리는 칸은?", lines: [mut("rok")], core: mm("rok"), own: mut("rok")?.palace ? `그 칸 줄(${palaceLine(mut("rok")!.palace!).id}) — 새 각도로만: 풀림이 그 무대에서 어떻게 보이는지` : "", tone: "풀리는 쪽을 직설 단정으로", palace: mut("rok")?.palace, extra: mut("rok")?.palace ? [palaceLine(mut("rok")!.palace!).id] : [] }),
    sec({ q: "힘이 붙고 이름이 나는 칸은?", lines: [mut("gwon"), mut("gwa")], core: [mm("gwon"), mm("gwa")].filter(Boolean).join(" / "), own: "두 꼬리표가 붙은 칸을 각자 문장으로, 이 사람의 무대 이름과 함께", tone: "힘과 평판을 장점으로, 결과를 정하지 않고", palace: mut("gwon")?.palace, extra: [mut("gwon"), mut("gwa")].filter((l): l is ZLine => Boolean(l?.palace)).map(l => palaceLine(l.palace!).id) }),
    sec({ q: "마음이 자꾸 가서 공을 들이는 칸은?", lines: [mut("gi"), giW], core: mm("gi"), own: giW ? `${giW.id} ${gist(giW.meaning)}` : "", tone: "정성을 쏟는 칸 — 걱정보다 공들임으로", palace: mut("gi")?.palace, extra: mut("gi")?.palace ? [palaceLine(mut("gi")!.palace!).id] : [] }),
  ] });
  // 9장
  const cur = one(l => l.kind === "decade" && l.facts.decade === "current"), next = one(l => l.kind === "decade" && l.facts.decade === "next");
  chapters.push({ n: 9, away: awayOf([cur, next]), sections: [
    ...(cur ? [sec({ q: "지금 머무는 10년은 어느 칸일까?", lines: [cur], core: `${cur.id} ${gist(cur.value, 50)}`, own: `그 칸의 무대: ${cur.meaning} · 그 칸 줄(${palaceLine(cur.palace!).id}) — 새 각도 한 줄만`, tone: "10년의 무대를 연도 범위로 — 일어날 일을 정하지 않고 힘이 모이는 쪽으로", extra: [palaceLine(cur.palace!).id] })] : []),
    ...(next ? [sec({ q: "다음 10년은 어느 칸으로 옮겨 갈까?", lines: [next], core: `${next.id} ${gist(next.value, 50)}`, own: `그 칸의 무대: ${next.meaning} · 그 칸 줄(${palaceLine(next.palace!).id}) — 새 각도 한 줄만`, tone: "옮겨 갈 무대를 기대 쪽으로, 날짜와 사건 없이", extra: [palaceLine(next.palace!).id] })] : []),
  ] });

  // ---- 처방 배분 ----
  const rxScores: Record<number, (readonly [RxKind, number])[]> = {};
  const table: Record<string, RxKind[]> = {};
  for (const c of ZIWEI_CHAPTERS) {
    if (!Array.isArray(c.rx)) continue;
    const dims = sumDims(b.lines.filter(l => l.home === c.n));
    const order = (c.rx as readonly RxKind[]).filter(kd => rxFits(kd, b.inputs)).map(kd => [kd, Math.round(scoreRx(dims, kd) * 100) / 100] as const).sort((x, y) => y[1] - x[1] || (c.rx as readonly RxKind[]).indexOf(x[0]) - (c.rx as readonly RxKind[]).indexOf(y[0]));
    rxScores[c.n] = order; table[c.id] = order.map(x => x[0]);
  }
  const alloc = allocateChapters(ZIWEI_CHAPTERS.filter(c => Array.isArray(c.rx)).map(c => ({ n: c.n, id: c.id, keyed: false })), new Map(), { table, cap: 1, family: true,
    fallback: (Object.keys(RX_DIMS) as RxKind[]).filter(kd => rxFits(kd, b.inputs)), fits: kd => rxFits(kd, b.inputs) });
  const rxSay = (kd: RxKind) => neutralize(kd, b.inputs) ?? kd.replace(/^[^·]*·/, "");
  return { version: ZIWEI_DESIGN_VERSION, rxScores, chapters: ZIWEI_CHAPTERS.map(meta => {
    const c = chapters.find(x => x.n === meta.n)!;
    const home = b.lines.filter(l => l.home === meta.n).map(l => l.id);
    const rx = meta.rx === "none" ? { use: null, forbid: [] as RxKind[] } : meta.rx === "outside" ? { use: null, forbid: [...new Set([...alloc.values()].map(a => a.use).filter((u): u is RxKind => Boolean(u)))], label: "사전 밖의 행동 한 가지(이 장 근거에 맞게)" } : (() => { const a = alloc.get(meta.n)!; return { use: a.use, forbid: a.forbid.filter(kd => rxFits(kd, b.inputs)), ...(a.use ? { label: rxSay(a.use) } : {}) }; })();
    return { n: meta.n, id: meta.id, title: meta.title, question: meta.question, target: ZIWEI_CHAPTER_TARGET, sections: c.sections, home, away: c.away, rx, ...(meta.rx === "none" ? {} : { rxAt: c.sections.length - 1 }) };
  }) };
}
