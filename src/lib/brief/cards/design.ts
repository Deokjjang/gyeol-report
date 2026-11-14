/**
 * W3 P3 연결 시스템 3·4·5·6 — 절 설계 카드(결정론, 호출 0). planChapters 결과(절 materials)에서 만든다. 4종만(세운·대운 AM은 만들지 않는다).
 * SectionCard = { q, evidence[{name, where, meaning}](0~3, 자리 이름 포함), link(장당 하나), scene(근거 있는 장면 하나), punch(장당 하나), rx(장당 하나) }.
 * - 근거: trait = 이름·자리(정답지 칸)·뜻(책에서 첫 등장만, 둘째부터 「이번 장에서 새로 보는 쓰임: 영역」). 상품 근거 = 사실 줄. 원국 참조 = 이름·자리·ref(뜻은 chart 칸).
 * - 연결: 장마다 명리 × MBTI 하나(궁합은 두 사람 카드끼리 하나, 방향 A→B·B→A). 근거가 없으면 없음. 같은 연결은 책에서 한 번, 같은 차원은 책에서 두 번까지.
 * - 장면: 절 재료의 첫 장면 하나(씨앗 · 지식 DB · 관계). 소품(장 sceneHint)은 씨앗 장면 옆 배경으로만 붙인다.
 * - 팩폭: 장당 하나(Shadow 근거 있을 때만). 같은 장의 둘째 팩폭 재료는 근거(「지나칠 때」)로 낮춘다.
 * - 처방: 장마다 마지막 절에 종류 하나(prescriptions RX 14종, 상품별 장 선호표, 같은 종류 책에 두 번까지, 시작 자리 = 고객 해시).
 * - 사실 대조(card_fact_drop): 카드 자리·십성·관계·신살·운성이 정답지(buildFactSheet)와 맞지 않으면 그 근거를 빼고 기록한다.
 * 브리프의 materials·plan·ledger는 그대로 둔다(안전망·이전 책 원장·AM이 쓴다). 작가는 절을 {q, card}로 받는다(prompt/index.ts).
 */
import type { FusionRule, MbtiProfile, MyeongriFeature } from "@/data/knowledge-v5/schema";
import type { PersonFacts, Slot } from "@/lib/factsheet/build";
import { TEN_GOD_KO } from "../labels";
import type { FeatureHit } from "../featureTypes";
import type { Knowledge } from "../knowledge";
import { allocateChapters, PRODUCT_CHAPTER_RX, RX, rxKindsOf, type RxKind } from "../prescriptions";
import type { Brief, ChapterBrief, Material, Trait } from "../schema";
import { splitSentences } from "@/lib/writer/safety/patterns";
import { AREA6_OF, connect, connectionKey, mbtiCards, myeongriCard, type Connection, type FeatureCard } from "./features";

export const CARDS_VERSION = "cards-v1" as const;
/** 같은 차원 연결은 책에서 이 횟수까지. */
export const MAX_DIM_LINKS = 2;
/** 같은 처방 종류는 책에서 이 횟수까지. */
export const MAX_RX_KIND = 2;

export type CardEvidence = { name: string; where: string; meaning?: string; facts?: string[]; ref?: string; rule?: string; traitId?: string };
export type SectionCard = { q: string; evidence: CardEvidence[]; link: Connection | null; scene: { text: string; from: "seed" | "knowledge" | "relation"; who?: string; props?: string[] } | null; punch: { text: string; basis: string; warm: string } | null; rx: RxKind | null };
export type CardFactDrop = { chapter: string; section: number; name: string; where: string; reason: string };
export type BookDesign = { version: typeof CARDS_VERSION; cards: FeatureCard[]; links: Connection[]; card_fact_drop: CardFactDrop[] };

export type CardPerson = {
  readonly owner?: "a" | "b";
  readonly callName: string;
  readonly traits: readonly Trait[];
  /** feature id → 엔진 hit(자리·짝). */
  readonly hits: ReadonlyMap<string, FeatureHit>;
  /** 정답지 한 사람분(buildFactSheet). */
  readonly facts: PersonFacts;
  readonly mbti: MbtiProfile | null;
  /** Fusion 사실 조건(시간·성별·맥락). */
  readonly ruleOk: (r: FusionRule) => boolean;
};
export type DesignInput = {
  readonly product: string;
  readonly chapters: ChapterBrief[];
  readonly people: readonly CardPerson[];
  readonly brief: Pick<Brief, "chart" | "mbti" | "shadows" | "compatibility" | "partner" | "ledgerNotes">;
  readonly k: Knowledge;
  /** 고객 해시(처방 시작 자리). */
  readonly spread: number;
  /** 처방 종류를 쓸 수 있는가(입력: 월급날은 직장인만 등). */
  readonly rxFits?: (kind: RxKind) => boolean;
};

const P1: Readonly<Record<string, string>> = { year: "연", month: "월", day: "일", hour: "시" };
const SLOT_KO = (s: Slot) => `${P1[s.replace(/(Stem|Branch)$/, "")]}${s.endsWith("Stem") ? "간" : "지"}`;

/** 카드 자리 이름과 정답지 대조. 맞지 않으면 이유(그 카드 근거를 뺀다). */
export function cardWhere(t: Trait, hit: FeatureHit | undefined, f: PersonFacts): { where: string[]; drop?: string } {
  const [family, code = ""] = t.featureId.split(":");
  const ps = hit?.positions ?? t.positions;
  if (ps.includes("hour") && !f.timeKnown) return { where: [], drop: "시간 미상인데 시 자리" };
  switch (family) {
    case "dayMaster": return f.dayMaster.stem === code ? { where: ["일간"] } : { where: [], drop: `일간 ${f.dayMaster.stem} ≠ ${code}` };
    case "dayPillar": { const d = f.pillars.day; return d && d.stem + d.branch === code ? { where: ["일주"] } : { where: [], drop: `일주 다름(${code})` }; }
    case "stem": { const bad = ps.filter(p => f.pillars[p]?.stem !== code); return bad.length ? { where: [], drop: `천간 ${code} 자리 다름(${bad.join(",")})` } : { where: ps.map(p => `${P1[p]}간`) }; }
    case "branch": { const bad = ps.filter(p => f.pillars[p]?.branch !== code); return bad.length ? { where: [], drop: `지지 ${code} 자리 다름(${bad.join(",")})` } : { where: ps.map(p => `${P1[p]}지`) }; }
    case "tenGod": {
      const ko = TEN_GOD_KO[code as keyof typeof TEN_GOD_KO] ?? code, where: string[] = [];
      for (const p of [...new Set(ps)]) {
        if (p !== "day" && f.tenGods[`${p}Stem` as Slot]?.[0] === ko) where.push(`${P1[p]}간`);
        if (f.tenGods[`${p}Branch` as Slot]?.[0] === ko) where.push(`${P1[p]}지`);
      }
      return where.length ? { where: [...new Set(where)] } : { where: [], drop: `십성 ${ko} 자리 없음(${ps.join(",")})` };
    }
    case "shinsal": case "gwiin": {
      const s = f.shinsal.find(x => x.id === t.featureId);
      if (!s) return { where: [], drop: `정답지에 없는 ${family === "gwiin" ? "귀인" : "신살"}` };
      const bad = ps.filter(p => !s.positions.includes(p));
      return bad.length ? { where: [], drop: `${s.name} 자리 다름(${bad.join(",")})` } : { where: [...new Set(s.slots.map(SLOT_KO))] };
    }
    case "twelveStage": {
      const bad = ps.filter(p => !f.twelveStages.some(x => x.position === p && x.stage === code));
      return bad.length ? { where: [], drop: `운성 ${code} 자리 다름(${bad.join(",")})` } : { where: ps.map(p => `${P1[p]}지`) };
    }
    case "relation": {
      const r = f.relations.find(x => x.kind === code && (!hit?.variantKey || x.key === hit.variantKey)) ?? f.stemClashes.find(x => x.kind === code && (!hit?.variantKey || x.key === hit.variantKey));
      if (!r) return { where: [], drop: `정답지에 없는 관계 ${code}${hit?.variantKey ? `(${hit.variantKey})` : ""}` };
      const suffix = /^STEM_/.test(code) ? "간" : "지";
      return { where: (hit?.pairs ?? [ps]).map(pair => [...new Set(pair)].map(p => `${P1[p]}${suffix}`).join("·")) };
    }
    default: return { where: ["원국 전체"] };
  }
}

const REF_LABEL: Readonly<Record<string, readonly [string, string]>> = {
  "chart.climate": ["태어난 계절", "월지"], "chart.strength": ["내 힘의 세기", "원국 전체"], "chart.elements": ["오행 분포", "원국 전체"], "chart.yinYang": ["음양 비율", "원국 전체"],
  "chart.thisYear": ["올해 운", "그 해"], "chart.currentDayun": ["지금 대운", "대운"], fortunes: ["좋은 기운", "원국 전체"], unused: ["덜 쓴 기운", "원국 전체"],
  "mbti.functions": ["MBTI 기능", "MBTI"], "compatibility.score": ["궁합 점수", "두 사람"], "compatibility.common": ["두 사람 공통", "두 사람"], "compatibility.complement": ["서로 채우는 점", "두 사람"],
  "compatibility.mbtiConvention": ["MBTI 통념 궁합", "두 사람"], "compatibility.tenGodAB": ["A가 보는 B", "두 사람"], "compatibility.tenGodBA": ["B가 보는 A", "두 사람"], "compatibility.dayRelations": ["두 사람 일주 관계", "두 사람"],
  "compatibility.differences": ["두 사람 차이", "두 사람"], "compatibility.a": ["A의 바탕", "A"], "compatibility.b": ["B의 바탕", "B"],
};
/** 상품 근거 사실 줄의 이름(「이름: 뜻」 앞 마디), 없으면 key. */
const evName = (key: string, facts: readonly string[]) => facts[0]?.match(/^([^:—]{2,24})(?::| —) /)?.[1]?.trim() ?? key;

export function designCards(input: DesignInput): BookDesign {
  const { k, brief, people } = input;
  const pair = Boolean(brief.compatibility);
  const name = (p: CardPerson, n: string) => (pair ? `${p.callName}의 ${n}` : n);
  const drops: CardFactDrop[] = [];
  // ① 특징 카드
  const cards: FeatureCard[] = [], byTrait = new Map<string, { card: FeatureCard; drop?: string; person: CardPerson; trait: Trait }>(), mbtiOf = new Map<CardPerson, FeatureCard[]>();
  for (const p of people) {
    for (const t of p.traits) {
      const f: MyeongriFeature | undefined = k.features.get(t.featureId); if (!f) continue;
      const w = cardWhere(t, p.hits.get(t.featureId), p.facts);
      const c0 = myeongriCard(t, f, w.where, k, p.owner), card = { ...c0, name: name(p, c0.name) };
      cards.push(card); byTrait.set(t.id, { card, ...(w.drop ? { drop: w.drop } : {}), person: p, trait: t });
    }
    const mc = p.mbti ? mbtiCards(p.mbti, k, p.owner).map(c => ({ ...c, name: name(p, c.name) })) : [];
    mbtiOf.set(p, mc); cards.push(...mc);
  }
  const cardById = new Map(cards.map(c => [c.id, c]));
  const shadowById = new Map(brief.shadows.map(s => [s.id, s]));
  const rel = brief.compatibility;
  const label = (ref: string): [string, string] => {
    if (ref === "chart.dayMaster") return [brief.chart.dayMaster.name.replace(/\s?\([^)]*\)/g, ""), "일간"];
    if (ref === "mbti") return [brief.mbti?.type ?? "MBTI", "MBTI"];
    const l = REF_LABEL[ref];
    const ab = (s: string) => (rel ? s.replace(/^A/, rel.a.callName).replace(/^B/, rel.b.callName).replace(/(?<=가 보는 )B$/, rel.b.callName).replace(/(?<=가 보는 )A$/, rel.a.callName) : s);
    return l ? [ab(l[0]), ab(l[1])] : [ref.replace(/^(chart|compatibility)\./, ""), ""];
  };

  // ② 절 카드(근거·장면·팩폭)
  type Slot0 = { ch: ChapterBrief; si: number; card: SectionCard; fusionTraits: Set<string> };
  const slots: Slot0[] = [];
  for (const ch of input.chapters) {
    if (ch.id.includes(":") || !ch.sections) continue;
    let punchUsed = false;
    ch.sections.forEach((sec, si) => {
      const card: SectionCard = { q: sec.q, evidence: [], link: null, scene: null, punch: null, rx: null };
      const fusionTraits = new Set<string>();
      const scene = (s: NonNullable<SectionCard["scene"]>) => { if (!card.scene) card.scene = s; };
      const ev: CardEvidence[] = [];
      for (const m of sec.materials as Material[]) {
        if (m.kind === "trait") {
          const x = byTrait.get(m.traitId); if (!x) continue;
          const meaning = m.angle === "first" ? x.trait.meaning : `이번 장에서 새로 보는 쓰임: ${AREA6_OF[m.domain]}${m.angle === "known" ? "(뜻은 다른 책에서 풀었다)" : ""}`;
          if (x.drop) { drops.push({ chapter: ch.id, section: si, name: x.card.name, where: x.card.where.join("·"), reason: x.drop }); }
          else ev.push({ name: x.card.name, where: x.card.where.join("·"), meaning, traitId: m.traitId });
          if (m.scene) scene({ text: m.scene, from: "knowledge" });
        } else if (m.kind === "mbti") {
          if (m.seedId === "prop") continue;
          scene({ text: m.scene, from: m.seedId ? "seed" : "knowledge", ...(m.who ? { who: m.who } : {}) });
        } else if (m.kind === "rel") scene({ text: m.scene, from: "relation", ...(m.who?.length ? { who: m.who.join(" / ") } : {}) });
        // 상품 근거는 사실 줄을 줄마다 그대로(facts) — 줄 단위 재료 바꾸기·복사 검사가 그대로 돈다.
        else if (m.kind === "evidence") ev.push({ name: evName(m.key, m.facts), where: "", facts: [...m.facts], ...(m.note ? { rule: m.note } : {}) });
        else if (m.kind === "ref") {
          const sh = m.ref.match(/^shadows\.(s\d+)$/)?.[1], fu = m.ref.match(/^traits\.([ab]?t\d+)\.fusion$/)?.[1];
          if (sh) {
            const s = shadowById.get(sh); if (!s) continue;
            if (!punchUsed) { card.punch = { text: s.text, basis: s.basis, warm: s.warmTurn }; punchUsed = true; }
            else { const x = byTrait.get(s.traitId); ev.push({ name: `${x?.card.name ?? s.traitId}이 지나칠 때`, where: x?.card.where.join("·") ?? "", meaning: `${s.text} 근거: ${s.basis}` }); }
          } else if (fu) fusionTraits.add(fu);
          else if (m.ref === "mbti.shadows") { if (brief.mbti?.shadows[0]) ev.push({ name: `${brief.mbti.type}의 그늘`, where: "MBTI", meaning: brief.mbti.shadows[0] }); }
          else if (m.ref.startsWith("chapters.")) { const title = input.chapters.find(c => c.id === m.ref.slice(9))?.title ?? ""; ev.push({ name: "앞 장 종합", where: "", meaning: `「${title}」 장의 근거로`, ...(m.note ? { rule: m.note } : {}) }); }
          else { const [n, w] = label(m.ref); ev.push({ name: n, where: w, ref: m.ref, ...(m.note ? { rule: m.note } : {}) }); }
        }
      }
      // 근거는 trait(뜻) → 상품 근거 → 원국 참조 순으로 3개까지.
      card.evidence = [...ev.filter(e => e.traitId), ...ev.filter(e => !e.traitId && !e.ref), ...ev.filter(e => e.ref)].slice(0, 3);
      // 소품은 씨앗 장면 옆 배경으로만(설계 3): 장 소품 힌트를 씨앗 장면에 붙인다.
      if (card.scene?.from === "seed" && ch.sceneHint?.length && !slots.some(s => s.ch === ch && s.card.scene?.props)) card.scene.props = [...ch.sceneHint];
      sec.card = card;
      slots.push({ ch, si, card, fusionTraits });
    });
  }

  // ③ 장마다 연결 하나
  const usedLinks = new Set<string>(), dimUse = new Map<string, number>(), links: Connection[] = [];
  const rank = (c: Connection) => (c.source.startsWith("fusion:") ? 3 : c.source === "mbtiLink" ? 2 : 1);
  // trait.fusion이 고른 Fusion 규칙(일주에 정확한 유형 규칙이 없으면 그 일간 규칙 — enforceMbtiLinks). 이유 문장은 브리프가 거른 것이라 원문과 같지 않을 수 있다.
  const ruleOf = (t: Trait) => {
    if (t.fusion?.source !== "fusion") return null;
    const stem = t.featureId.match(/[甲乙丙丁戊己庚辛壬癸]/)?.[0];
    const rules = [...(k.fusionByFeature.get(t.featureId) ?? []), ...(t.family === "dayPillar" && stem ? k.fusionByFeature.get(`dayMaster:${stem}`) ?? [] : [])].filter(r => r.mbtiTarget === t.fusion!.target);
    const first = splitSentences(t.fusion.why)[0] ?? "";
    return rules.find(r => r.why === t.fusion!.why) ?? rules.find(r => first && r.why.includes(first)) ?? rules[0] ?? null;
  };
  const chapters = [...new Set(slots.map(s => s.ch))];
  for (const ch of chapters) {
    const mine = slots.filter(s => s.ch === ch);
    type Cand = { slot: Slot0; conn: Connection; score: number };
    const cands: Cand[] = [];
    for (const slot of mine) for (const e of slot.card.evidence) {
      const x = e.traitId ? byTrait.get(e.traitId) : undefined; if (!x || x.drop) continue;
      const bonus = slot.fusionTraits.has(x.trait.id) ? 10 : 0;
      if (!pair) {
        const mc = mbtiOf.get(x.person) ?? []; if (!mc.length) continue;
        const t = x.trait, target = t.fusion ? mc.find(c => c.key === t.fusion!.target) ?? mc[0] : mc[0];
        const conn = t.fusion ? connect(x.card, target, k, t.fusion.source === "fusion" ? { rule: ruleOf(t), kind: t.fusion.kind, why: t.fusion.why } : t.fusion.source === "mbtiLink" ? { rule: null, kind: t.fusion.kind, why: t.fusion.why, source: "mbtiLink" } : { rule: null })
          : connect(x.card, mc[0], k, { ruleOk: x.person.ruleOk });
        if (conn) cands.push({ slot, conn, score: bonus + rank(conn) });
      } else {
        // 궁합: 두 사람 카드끼리(상대의 MBTI 유형 카드 → 상대의 명리 카드). 방향은 카드 주인 → 상대.
        const other = people.find(p => p !== x.person); if (!other) continue;
        const targets = [...(mbtiOf.get(other) ?? []).slice(0, 1), ...[...byTrait.values()].filter(y => y.person === other && !y.drop && y.trait.chapters.length).map(y => y.card)];
        for (const target of targets) {
          const conn = connect(x.card, target, k, { ruleOk: x.person.ruleOk });
          if (!conn) continue;
          const d = rel!.score.direction[x.person.owner === "a" ? "aToB" : "bToA"];
          const [from, to] = x.person.owner === "a" ? [rel!.a.callName, rel!.b.callName] : [rel!.b.callName, rel!.a.callName];
          cands.push({ slot, conn: { ...conn, dir: `${from}→${to}: ${d.tenGod}(${d.role})` }, score: bonus + rank(conn) + (target.system === "mbti" ? 0.5 : 0) });
        }
      }
    }
    const best = cands.filter(c => !usedLinks.has(connectionKey(c.conn, cardById)) && (dimUse.get(c.conn.tag) ?? 0) < MAX_DIM_LINKS)
      .sort((a, b) => b.score - a.score || a.slot.si - b.slot.si || a.conn.a.localeCompare(b.conn.a) || a.conn.b.localeCompare(b.conn.b))[0];
    if (!best) continue;
    best.slot.card.link = best.conn; usedLinks.add(connectionKey(best.conn, cardById)); dimUse.set(best.conn.tag, (dimUse.get(best.conn.tag) ?? 0) + 1); links.push(best.conn);
  }

  // ④ 처방: 장마다 마지막 절에 한 종류(같은 종류 책에 두 번까지, 이전 책 처방 종류는 피한다).
  const avoid = new Set((brief.ledgerNotes?.avoidActions ?? []).flatMap(rxKindsOf));
  const table = PRODUCT_CHAPTER_RX[input.product] ?? {};
  const rx = allocateChapters(chapters.map((c, i) => ({ n: i + 1, id: c.id, keyed: false })), new Map(), { table, cap: MAX_RX_KIND, spread: input.spread, avoid, fits: input.rxFits, fallback: RX.map(([kd]) => kd) });
  chapters.forEach((ch, i) => { const use = rx.get(i + 1)?.use ?? null; const last = slots.filter(s => s.ch === ch).at(-1); if (last && use) last.card.rx = use; });

  return { version: CARDS_VERSION, cards, links, card_fact_drop: drops };
}

/** 작가에게 보이는 카드(빈 칸 빼고, 연결 카드 id → 이름). */
export function writerCard(c: SectionCard | import("../schema").SectionCardBrief, cards: ReadonlyMap<string, FeatureCard>, propOk: (h: string) => boolean = () => true): Record<string, unknown> {
  const nm = (id: string) => cards.get(id)?.name ?? id;
  const props = c.scene?.props?.filter(propOk);
  return {
    ...(c.evidence.length ? { evidence: c.evidence.map(e => ({ ...(e.traitId ? { id: e.traitId } : {}), name: e.name, ...(e.where ? { where: e.where } : {}), ...(e.meaning ? { meaning: e.meaning } : {}), ...(e.facts ? { facts: e.facts } : {}), ...(e.ref ? { ref: e.ref } : {}), ...(e.rule ? { rule: e.rule } : {}) })) } : {}),
    ...(c.link ? { link: { kind: c.link.kind, a: nm(c.link.a), b: nm(c.link.b), tag: c.link.tagName, why: c.link.why, ...(c.link.dir ? { dir: c.link.dir } : {}) } } : {}),
    ...(c.scene ? { scene: { text: c.scene.text, ...(c.scene.who ? { who: c.scene.who } : {}), ...(props?.length ? { props } : {}) } } : {}),
    ...(c.punch ? { punch: c.punch } : {}),
    ...(c.rx ? { rx: c.rx } : {}),
  };
}
