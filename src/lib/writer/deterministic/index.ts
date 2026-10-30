/**
 * 결정론 작가(P3 E, 최후 폴백). 브리프만으로 장을 조립한다(호출 0).
 * 재료(특성 이미지·장면·좋은 면·Fusion·팩폭·상품 근거·타임라인)를 장의 질문 순서대로 배치하고, 이어 주는 문장은 여러 변형 중 시드로 고른다.
 * 새 문체(직설·이미지)만 쓴다. V4 문장은 쓰지 않는다. 결과도 안전망 문장 검사를 통과해야 한다(테스트).
 * 분량(P3.5 A7): 비반복 장이 DET_MIN_CHARS 미만이면 보충 재료(그 장 특성의 둘째 장점·세기·과사용, MBTI 기능, 쓰지 않은 원국·궁합 절)를 더한다. 책 안 같은 문장은 넣지 않는다.
 */
import { createRng, fnv1a, type Rng } from "@/lib/brief/seed";
import { josa } from "@/lib/brief/labels";
import type { Brief, Material, Trait } from "@/lib/brief/schema";
import { chapterChars, type BookChapter, type BookSection } from "../format";
import type { WriterChapter } from "../prompt";
import { splitSentences } from "../safety/patterns";
import { norm } from "../safety/sentences";

const noHan = (s: string) => s.replace(/\s*\([^)]*[一-鿿][^)]*\)/g, "").replace(/[一-鿿]+/g, "").replace(/\s{2,}/g, " ").trim();
const sentence = (s: string) => { const t = s.trim(); return !t ? "" : /[.!?]$/.test(t) ? t : `${t}.`; };
const join = (...parts: (string | null | undefined | false)[]) => parts.filter((p): p is string => Boolean(p && p.trim())).map(sentence).join(" ");
/** '…'예요/'…'이에요: 따옴표 안 마지막 글자의 받침으로 고른다. */
const yeyo = (quoted: string) => `'${quoted}'${(((quoted.charCodeAt(quoted.length - 1) - 0xac00) % 28) !== 0) ? "이에요" : "예요"}`;
const DOMAIN_KO: Record<string, string> = { work: "일할 때", money: "돈 앞에서", study: "배울 때", love: "사랑할 때", marriage: "함께 살게 되면", relationships: "사람들 사이에서", alone: "혼자 있을 때" };
const EVIDENCE_HEAD: Record<string, string> = { spouseStar: "끌리는 상대를 비추는 별", spousePalace: "곁에 둘 사람의 자리", childStar: "아이를 키우게 된다면", childPalace: "아이 자리에 놓인 기운", partnerMatch: "잘 맞는 사람의 모습", meetingPlaces: "만나기 좋은 곳", jobFit: "잘 맞는 일의 모양", investment: "돈을 다루는 방식" };

type Ctx = { readonly brief: Brief; readonly rng: Rng; readonly you: string; readonly used: Set<string> };
/** 결정론 장 최소 분량(공백 포함, 소제목 포함). */
export const DET_MIN_CHARS = 900;
/** 보충 재료: heading이 있는 소제목에 붙이거나(append), 새 소제목으로 더한다. */
type Extra = { readonly heading: string; readonly text: string; readonly append: boolean };
const WARM = ["알고 있으면 충분히 조절할 수 있는 결이에요", "이걸 알아차리는 순간부터는 오히려 무기가 됩니다", "속도를 한 번만 늦추면 장점 쪽으로 돌아옵니다"];

function pick<T>(ctx: Ctx, label: string, list: readonly T[]): T { return ctx.rng.fork(label).pick(list); }
const traitOf = (b: Brief, id: string): Trait | undefined => b.traits.find(t => t.id === id);

function traitSection(ctx: Ctx, m: Extract<Material, { kind: "trait" }>, chapterId: string): BookSection | null {
  const t = traitOf(ctx.brief, m.traitId); if (!t) return null;
  const name = noHan(t.name), easy = t.easyName;
  const first = m.angle === "first";
  const heading = first
    ? pick(ctx, `${chapterId}:${t.id}:h`, [`${easy} 같은 힘`, `당신 안의 ${easy}`, `${josa(easy, "이가")} 보이는 순간`, `${easy}, 이렇게 씁니다`])
    : `${DOMAIN_KO[m.domain] ?? "다른 자리에서"}의 ${easy}`;
  const intro = first
    ? pick(ctx, `${chapterId}:${t.id}:i`, [
      `당신에게는 ${t.image.metaphor} 같은 기운(${name})이 있습니다`,
      `당신을 한 장면으로 그리면 ${t.image.metaphor}입니다. 이것이 ${easy}(${name})의 모습이에요`,
      `${t.image.metaphor}. 당신 안에 놓인 ${easy}(${name})를 그림으로 그리면 이렇습니다`,
    ])
    : pick(ctx, `${chapterId}:${t.id}:i2`, [`앞에서 본 ${josa(easy, "은는")} ${DOMAIN_KO[m.domain] ?? "다른 자리에서"} 또 다른 얼굴을 보입니다`, `${DOMAIN_KO[m.domain] ?? "다른 자리에서"}도 ${josa(easy, "이가")} 그대로 드러납니다`]);
  const fusion = first && t.fusion && !ctx.used.has(`fusion:${t.id}`) ? (ctx.used.add(`fusion:${t.id}`), t.fusion) : undefined;
  const p1 = join(intro, first ? `한마디로 '${t.oneLiner}'입니다` : undefined, first ? t.good[0] : t.good[1] ?? t.good[0], first ? t.positionNote?.replace(/^[^:]+:\s*/, "") : undefined);
  const p2 = join(m.scene, fusion?.why, fusion?.scene, !first && t.good[1] ? t.good[0] : undefined);
  return { heading, paragraphs: [p1, p2].filter(Boolean) };
}

function mbtiSection(ctx: Ctx, m: Extract<Material, { kind: "mbti" }>, chapterId: string): BookSection | null {
  const p = ctx.brief.mbti; if (!p) return null;
  const heading = pick(ctx, `${chapterId}:mbti:${m.domain}`, [`${p.type}다운 장면`, `${DOMAIN_KO[m.domain] ?? ""}의 ${p.easyName}`.trim(), `${p.easyName}의 습관`]);
  return { heading, paragraphs: [join(`${p.type}(${p.easyName})인 당신은 ${DOMAIN_KO[m.domain] ?? "이런 순간"} 티가 납니다`, m.scene, p.functions[0]?.replace(/^\w+\([^)]*\):\s*/, ""))] };
}

function refSection(ctx: Ctx, ref: string, chapterId: string): BookSection | null {
  const b = ctx.brief, c = b.chart;
  if (ctx.used.has(`ref:${ref}`)) return null;
  ctx.used.add(`ref:${ref}`);
  if (ref === "chart.dayMaster") return { heading: `타고난 바탕, ${c.dayMaster.easyName}`, paragraphs: [join(`태어난 날의 기운은 ${c.dayMaster.easyName}(${noHan(c.dayMaster.name)})입니다`, c.dayMaster.metaphor && `${c.dayMaster.metaphor} 같은 사람이에요`, `타고난 힘의 세기는 ${c.strength.label} 쪽입니다`)] };
  if (ref === "mbti" && b.mbti) return { heading: `${b.mbti.type}, ${b.mbti.easyName}`, paragraphs: [join(`MBTI는 ${b.mbti.type}, ${b.mbti.easyName}입니다`, `한마디로 ${yeyo(b.mbti.oneLiner)}`, b.mbti.functions[0]?.replace(/^\w+\([^)]*\):\s*/, ""), b.mbti.functions[1]?.replace(/^\w+\([^)]*\):\s*/, ""))] };
  if (ref === "chart.elements") return { heading: "가장 강한 기운과 가장 약한 기운", paragraphs: [join(`다섯 기운 가운데 ${josa(c.elements.strongest.name, "이가")} 가장 셉니다`, c.elements.strongest.reason, `반대로 ${josa(c.elements.weakest.name, "은는")} ${c.elements.weakest.reason}`, ...c.elements.reading.map(r => `그래서 '${r}'에 가깝습니다`))] };
  if (ref === "chart.yinYang") return { heading: "음과 양의 균형", paragraphs: [join(`음의 글자 ${c.yinYang.yin}개, 양의 글자 ${c.yinYang.yang}개입니다`, c.yinYang.reading && `'${c.yinYang.reading}'이라는 뜻이에요`)] };
  if (ref === "chart.climate") return { heading: `${c.climate.season}에 태어난 사람`, paragraphs: [join(`당신은 ${c.climate.season}에 태어났습니다`, c.climate.reading && `이 계절의 당신은 '${c.climate.reading}'에 가깝습니다`)] };
  if (ref === "chart.thisYear") return { heading: `${c.thisYear.year}년의 기운`, paragraphs: [join(c.thisYear.effect, `올해 들어오는 힘은 ${noHan(c.thisYear.tenGod)} 쪽이에요`)] };
  if (ref === "chart.currentDayun" && c.currentDayun) return { heading: "지금 지나는 큰 흐름", paragraphs: [join(`지금은 ${c.currentDayun.ages}에 걸친 ${noHan(c.currentDayun.tenGod)}의 큰 흐름(대운) 위에 있습니다`, c.currentDayun.reading, c.currentDayun.next && `${c.currentDayun.next.startYear}년부터는 ${noHan(c.currentDayun.next.tenGod)} 쪽 흐름으로 넘어갑니다`)] };
  if (ref === "chart.strength") return { heading: "타고난 힘의 세기", paragraphs: [join(`타고난 힘의 세기는 ${c.strength.label} 쪽입니다`, `그래서 기댈 곳과 쓸 곳을 함께 보는 게 중요해요`)] };
  if (ref === "fortunes" && b.fortunes.length) return { heading: "타고난 좋은 패", paragraphs: b.fortunes.slice(0, 2).map(f => join(`${f.image.metaphor} 같은 기운(${noHan(f.name)})이 있습니다`, f.direct)) };
  if (ref.startsWith("shadows.")) {
    const s = b.shadows.find(x => x.id === ref.slice(8)); if (!s) return null;
    const t = traitOf(b, s.traitId);
    return { heading: pick(ctx, `${chapterId}:${ref}`, ["한 가지 짚고 갈 점", "알아 두면 덜 지치는 습관", "속도를 한 번 늦출 자리"]), paragraphs: [join(s.text, t && `${t.easyName}(${noHan(t.name)}) 때문에 생기는 결이에요`, s.warmTurn)] };
  }
  if (ref.startsWith("traits.") && ref.endsWith(".fusion")) {
    const t = traitOf(b, ref.split(".")[1]); if (!t?.fusion || ctx.used.has(`fusion:${t.id}`)) return null;
    ctx.used.add(`fusion:${t.id}`);
    return { heading: "기운과 성격이 반대로 당기는 곳", paragraphs: [join(t.fusion.why, t.fusion.scene)] };
  }
  if (ref === "unused" && b.unused.length) return { heading: "아직 쓰지 못한 기운", paragraphs: b.unused.slice(0, 2).map(u => join(`당신에게 아직 비어 있는 자리는 ${u.easyName}(${noHan(u.name)})입니다`, `'${u.oneLiner}'에 가까워요`, u.actions[0], u.places.length ? `${u.places.slice(0, 3).join(", ")} 같은 곳이 이 기운을 채워 줍니다` : undefined)) };
  if (ref === "timeline.cycles" && b.timeline) return { heading: "큰 흐름의 지도", paragraphs: [join(...b.timeline.cycles.map(x => `${x.years}는 ${noHan(x.tenGod)}의 흐름${x.current ? "이고, 지금 여기에 있습니다" : "입니다"}`))] };
  if (ref === "timeline.keyEntries" && b.timeline) {
    const keys = b.timeline.keyEntries.map(k => b.timeline!.entries.find(e => e.key === k)).filter((e): e is NonNullable<typeof e> => Boolean(e));
    return { heading: "눈여겨볼 때", paragraphs: [join(...keys.map(e => `${noHan(e.label)}에는 ${e.keywords.join("·")}이 앞에 섭니다. ${e.action.text}`))] };
  }
  const x = b.compatibility; if (!x) return null;
  const A = x.a.callName, B = x.b.callName;
  if (ref === "compatibility.a" || ref === "compatibility.b") { const p = ref.endsWith("a") ? x.a : x.b; return { heading: `${p.callName}이라는 사람`, paragraphs: [join(`${p.callName}을 한 장면으로 그리면 ${p.image}입니다`, p.mbti && `MBTI는 ${p.mbti}예요`)] }; }
  if (ref === "compatibility.differences" && x.differences.length) return { heading: "같은 장면, 다른 반응", paragraphs: x.differences.slice(0, 2).map(d => join(`${d.dimension}에서 ${josa(A, "은는")} ${d.a} 쪽이고, ${josa(B, "은는")} ${d.b} 쪽입니다`)) };
  if (ref === "compatibility.tenGodAB") return { heading: `${A}이 ${B}에게 주는 것`, paragraphs: [join(x.tenGodAB.reading)] };
  if (ref === "compatibility.tenGodBA") return { heading: `${B}이 ${A}에게 주는 것`, paragraphs: [join(x.tenGodBA.reading)] };
  if (ref === "compatibility.complement" && x.complement.length) return { heading: "서로 채워 주는 기운", paragraphs: [join(...x.complement.slice(0, 3))] };
  if (ref === "compatibility.mbtiConvention" && x.mbtiConvention) return { heading: "흔히 하는 MBTI 궁합 이야기", paragraphs: [join(`흔히 하는 말(통념)로는 '${x.mbtiConvention.fit}'인 조합입니다`, x.mbtiConvention.why)] };
  if (ref === "compatibility.dayRelations" && x.dayRelations.length) return { heading: "두 사람의 날이 만나는 방식", paragraphs: [join(...x.dayRelations.slice(0, 2))] };
  if (ref === "compatibility.lens") return { heading: x.lens.focus, paragraphs: [join(`이 관계에서는 ${x.lens.focus}이 가장 중요합니다`, x.lens.tone)] };
  if (ref === "compatibility.common" && x.common.length) return { heading: "둘이 닮은 곳", paragraphs: [join(`두 사람은 ${x.common.slice(0, 3).join(", ")}이라는 점이 같습니다`)] };
  if (ref === "compatibility.elements" && b.partner) { const pc = b.partner.chart; return { heading: "두 사람의 강한 기운과 약한 기운", paragraphs: [join(`${A}에게는 ${josa(c.elements.strongest.name, "이가")} 가장 세고 ${josa(c.elements.weakest.name, "이가")} 가장 약합니다`, `${B}에게는 ${josa(pc.elements.strongest.name, "이가")} 가장 세고 ${josa(pc.elements.weakest.name, "이가")} 가장 약합니다`, c.elements.strongest.element === pc.elements.weakest.element ? `${A}의 넉넉한 쪽이 ${B}의 빈 곳과 맞닿아 있어요` : pc.elements.strongest.element === c.elements.weakest.element ? `${B}의 넉넉한 쪽이 ${A}의 빈 곳과 맞닿아 있어요` : "강한 쪽과 약한 쪽이 서로 엇갈려 있어, 각자 잘하는 몫을 나누기 좋습니다")] }; }
  if (ref === "compatibility.yinYang" && b.partner) { const py = b.partner.chart.yinYang; return { heading: "두 사람의 음과 양", paragraphs: [join(`${A}는 음 ${c.yinYang.yin}·양 ${c.yinYang.yang}, ${B}는 음 ${py.yin}·양 ${py.yang}입니다`, c.yinYang.reading && `${A} 쪽은 '${c.yinYang.reading}'에 가깝고`, py.reading && `${B} 쪽은 '${py.reading}'에 가깝습니다`)] }; }
  if (ref === "compatibility.parts") return { heading: "점수를 만든 여섯 가지", paragraphs: [join(...x.score.components.filter(c => c.level !== "보통").map(c => c.line))] };
  if (ref === "compatibility.direction") return { heading: "서로에게 어떤 사람인가", paragraphs: [join(x.score.direction.aToB.role, x.score.direction.aToB.gives, x.score.direction.bToA.role, x.score.direction.bToA.gives)] };
  if (ref === "compatibility.score") {
    const s = x.score, good = s.components.filter(c => c.level === "좋음"), adjust = s.components.filter(c => c.level === "조율");
    return { heading: `${s.value}점, ${s.band.label} 사이`, paragraphs: [
      join(`두 사람의 타고난 맞물림은 ${s.value}점입니다`, s.band.verdict, ...good.slice(0, 2).map(c => c.line)),
      join(...adjust.slice(0, 2).map(c => c.line), adjust.length ? "이런 자리는 다투기 전에 둘만의 약속 하나를 정해 두면 훨씬 편해집니다" : "맞춰 갈 자리가 크지 않으니, 좋은 점을 일상에서 자주 꺼내 쓰면 됩니다"),
    ].filter(Boolean) };
  }
  return null;
}

function evidenceSection(m: Extract<Material, { kind: "evidence" }>): BookSection | null {
  const facts = m.facts.filter(f => !/보류|보지 않습니다/.test(f)).map(f => noHan(f));
  if (!facts.length) return null;
  return { heading: EVIDENCE_HEAD[m.key] ?? "타고난 근거", paragraphs: [join(...facts)] };
}

function timelineSection(ctx: Ctx, key: string, extra: readonly Material[]): BookSection {
  const b = ctx.brief, e = b.timeline?.entries.find(x => x.key === key);
  if (!e) return { heading: key, paragraphs: [] };
  const note = b.timeline?.tenGodNotes[e.tenGod.stem];
  const unit = e.kind === "year" ? "이 해" : "이 달";
  const trait = extra.find((m): m is Extract<Material, { kind: "trait" }> => m.kind === "trait");
  const t = trait ? traitOf(b, trait.traitId) : undefined;
  return { heading: key, paragraphs: [join(
    `${josa(unit, "은는")} ${e.material.image} 같은 때입니다`, note?.meaning, note?.caution,
    e.badges[0] && e.badges[0].line, e.fillsLack.fills ? "원래 부족한 기운을 채워 주는 쪽이라 숨이 한결 편해집니다" : undefined,
    `${unit}의 열쇠말은 ${e.keywords.join("·")}입니다`, e.action.text, e.material.scene, t && trait ? `${t.easyName}의 결이 ${DOMAIN_KO[trait.domain] ?? "이때"} 드러납니다` : undefined,
  )] };
}

/** 그 장의 특성·MBTI 소제목에 붙일 보충 재료와, 아직 안 쓴 원국·궁합 절. 순서 = 넣는 우선순위. */
function extrasOf(ctx: Ctx, ch: WriterChapter, sections: readonly { heading: string; traitId?: string; mbti?: boolean }[]): Extra[] {
  const b = ctx.brief, out: Extra[] = [];
  for (const s of sections) {
    if (s.traitId) {
      const t = traitOf(b, s.traitId); if (!t) continue;
      out.push({ heading: s.heading, append: true, text: join(t.strengthNote, ...t.good) });
      if (t.fusion && !ctx.used.has(`fusion:${t.id}`)) { ctx.used.add(`fusion:${t.id}`); out.push({ heading: s.heading, append: true, text: join(t.fusion.why, t.fusion.scene) }); }
      if (t.overuse) out.push({ heading: s.heading, append: true, text: join(t.overuse, pick(ctx, `${ch.id}:${t.id}:warm`, WARM)) });
    }
    if (s.mbti && b.mbti) out.push({ heading: s.heading, append: true, text: join(...b.mbti.functions.slice(0, 2).map(f => f.replace(/^\w+\([^)]*\):\s*/, "")), b.mbti.shadows[0] && `${b.mbti.shadows[0]}`, pick(ctx, `${ch.id}:mbti:warm`, WARM)) });
  }
  const refs = b.compatibility
    ? ["compatibility.common", "compatibility.complement", "compatibility.differences", "compatibility.dayRelations", "compatibility.mbtiConvention", "compatibility.parts", "compatibility.direction", "compatibility.lens", "compatibility.tenGodAB", "compatibility.tenGodBA", "compatibility.elements", "compatibility.yinYang"]
    : ["chart.elements", "chart.climate", "chart.yinYang", "fortunes", "unused", "chart.strength", "chart.dayMaster", "chart.currentDayun", "chart.thisYear"];
  for (const ref of refs) { const s = refSection(ctx, ref, ch.id); if (s?.paragraphs.length) out.push({ heading: s.heading, append: false, text: s.paragraphs.join(" ") }); }
  for (const t of b.traits) out.push({ heading: `${t.easyName}의 다른 얼굴`, append: false, text: join(t.positionNote?.replace(/^[^:]+:\s*/, ""), ...t.good, t.strengthNote, t.where && `이 기운은 ${t.where}에 걸려 있어요`, t.image.visual, !ctx.used.has(`fusion:${t.id}`) && t.fusion?.why, t.overuse && `${t.overuse} ${pick(ctx, `${ch.id}:${t.id}:warm2`, WARM)}`) });
  return out;
}

/** 분량 보충: 목표에 닿을 때까지 보충 재료를 넣는다. 소제목은 5개까지, 넘으면 마지막 소제목에 붙인다. */
function pad(sections: readonly BookSection[], extras: readonly Extra[], avoid: ReadonlySet<string>, n: number): BookSection[] {
  const local = new Set(sections.flatMap(s => s.paragraphs.flatMap(p => splitSentences(p).map(norm))));
  const out = sections.map(s => ({ heading: s.heading, paragraphs: [...s.paragraphs] }));
  const chars = () => chapterChars({ n, title: "", sections: out });
  for (const x of extras) {
    if (chars() >= DET_MIN_CHARS) break;
    const text = splitSentences(x.text).filter(s => { const k = norm(s); if (local.has(k) || (k.length >= 20 && avoid.has(k))) return false; local.add(k); return true; }).join(" ");
    if (!text) continue;
    const target = x.append ? out.find(s => s.heading === x.heading) : undefined;
    if (target) target.paragraphs.push(text);
    else if (out.length < 5) out.push({ heading: x.heading, paragraphs: [text] });
    else out[out.length - 1].paragraphs.push(text);
  }
  return out;
}

/** 책 안에서 이미 나온 문장(avoid)과 이 장에서 이미 쓴 문장은 뺀다. 반복 장(keepEmpty)은 키를 지우지 않고, 다 빠진 키는 원래 문단을 둔다. */
function dedupe(sections: readonly BookSection[], avoid: ReadonlySet<string>, keepEmpty: boolean): BookSection[] {
  const local = new Set<string>();
  const out = sections.map(s => {
    const paragraphs = s.paragraphs.map(p => splitSentences(p).filter(x => { const k = norm(x); if (k.length >= 20 && (avoid.has(k) || local.has(k))) return false; local.add(k); return true; }).join(" ")).filter(Boolean);
    return { ...s, paragraphs: keepEmpty && !paragraphs.length ? s.paragraphs : paragraphs };
  });
  return keepEmpty ? out : out.filter(s => s.paragraphs.length);
}

/** 장 하나를 결정론으로 쓴다. keys가 주어지면 그 key만(반복 장 누락 보충). avoid: 책 안에서 이미 쓴 문장(정규화). */
export function writeDeterministicChapter(brief: Brief, ch: WriterChapter, opts: { keys?: readonly string[]; avoid?: ReadonlySet<string> } = {}): BookChapter {
  const { chapter, extras } = writeChapter(brief, ch, opts);
  const avoid = opts.avoid ?? new Set<string>();
  const sections = dedupe(chapter.sections, avoid, Boolean(ch.keys));
  return { ...chapter, sections: ch.keys ? sections : pad(sections, extras, avoid, ch.n) };
}

function writeChapter(brief: Brief, ch: WriterChapter, opts: { keys?: readonly string[] }): { chapter: BookChapter; extras: Extra[] } {
  const ctx: Ctx = { brief, rng: createRng(fnv1a(`${brief.seed}:${ch.id}:deterministic`)), you: brief.person.callName, used: new Set() };
  if (ch.keys) {
    const keys = opts.keys ?? ch.keys;
    return { chapter: { n: ch.n, title: ch.title, sections: keys.map(k => timelineSection(ctx, k, ch.perKey?.[k] ?? [])) }, extras: [] };
  }
  const sections: BookSection[] = [];
  const origin: { heading: string; traitId?: string; mbti?: boolean }[] = [];
  for (const m of ch.materials) {
    const s = m.kind === "trait" ? traitSection(ctx, m, ch.id) : m.kind === "mbti" ? mbtiSection(ctx, m, ch.id) : m.kind === "ref" ? refSection(ctx, m.ref, ch.id) : m.kind === "evidence" ? evidenceSection(m) : m.kind === "rel" ? { heading: `${m.topic} 앞의 두 사람`, paragraphs: [m.scene] } : null;
    if (s && s.paragraphs.length) { sections.push(s); origin.push({ heading: s.heading, ...(m.kind === "trait" ? { traitId: m.traitId } : {}), ...(m.kind === "mbti" ? { mbti: true } : {}) }); }
  }
  // 소제목 3개 미만이면 원국 요약으로 채운다(이미 쓴 절은 다시 쓰지 않음).
  for (const ref of ["chart.elements", "chart.thisYear", "chart.climate", "fortunes", "chart.yinYang", "chart.currentDayun"]) {
    if (sections.length >= 3) break;
    const s = refSection(ctx, ref, ch.id); if (s && s.paragraphs.length) sections.push(s);
  }
  const top = sections.slice(0, 5);
  if (ch.useName && top[0]) top[0] = { ...top[0], paragraphs: [`${brief.person.callName}, 이 장에서는 이 질문에 답해 볼게요. ${/[?？]$/.test(ch.question) ? ch.question : `${ch.question}?`} ${top[0].paragraphs[0]}`, ...top[0].paragraphs.slice(1)] };
  return { chapter: { n: ch.n, title: ch.title, sections: top }, extras: extrasOf(ctx, ch, origin) };
}
