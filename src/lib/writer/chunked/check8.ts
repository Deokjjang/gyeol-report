/**
 * AM2-8 검사(뿌리 1 · 2 · 5 · 8). check.ts blockFlags가 부른다.
 * - mbti_trait(차단, 뿌리 1 백업): 짝 없는 key · 소제목에서 MBTI 특성 말(유형 이름 없이 바꿔 쓴 성향 · B 줄 핵심어)이 명리 근거와 한 문장에 이어진다.
 * - template_third(교체 대상, 뿌리 2): 장 안 같은 틀(template.ts 뼈대) 셋째부터 — 그 문단만 다시 쓰기에 올린다(알림이 아니다).
 * - cross_copy8(교체 대상, 뿌리 8): 다른 장 문장과 9어절 넘게 이어서 같은 문장 — 뒤 장 문장을 다시 쓰기에 올린다.
 * - advice_cliche(기록만, 뿌리 5): 상투 권유(「…모습이 어울려요」) — 다시 쓰기 결과에 새로 서면 그 교체를 받지 않는다(accept).
 */
import type { FinalChapter } from "../safety";
import { splitSentences } from "../safety/patterns";
import type { BlockCtx, ChunkFlag } from "./check";
import { templateIndex } from "./template";

const GJ = "[갑을병정무기경신임계][자축인묘진사오미신유술해]";
const TG = "비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인";
/** 명리 근거 말(한 문장 안에 있으면 MBTI 성향과 이어진 것으로 본다). */
export const MYEONGRI_WORD = new RegExp(`${TG}|대운|${GJ}(?:년|월|일주| 대운)|[자축인묘진사오미신유술해]{2,3}(?:합|충|형|파|해|원진)|${"[갑을병정무기경신임계]"}{2}합|반합|방합|삼합|육합|공망|맺힘|부딪침|다듬음|어긋남|(?:나무|불|흙|쇠|물)의? 기운|(?:목|화|토|금|수)국|하늘 글자|땅 글자|이 (?:달|해|10년)의 기운|기운이|기운 속|(?:방해|맺힘|부딪침|다듬음|어긋남|모임)의 기운|${GJ}의 |이 10년`);
/** 앞 문장이 낸 성향을 받는 말(「그 다정함」 「그 감각」) — 짝 없는 곳에서 이 말과 명리 근거가 한 문장이면 이웃 문장 잇기(R-B6). */
const TRAIT_REF = /(?:^|[\s,])(?:그|이런|그런) (?:다정함|감각|성향|버릇|습관|기질|성격|섬세함|꼼꼼함|추진력|호기심|부지런함|솔직함|배려|눈치|재치|열정|여유|집중력|센스|힘|장점|태도|모습)(?:이|가|은|는|을|를|에|에도|도|만큼|과|와)?(?![가-힣])/;
/** 성향 서술 끝(「…쉬운 쪽이에요」 「…먼저 읽고 …수 있어요」) — 이웃 문장 잇기의 앞 문장 단서. */
const TRAIT_TAIL = /(?:쉬운|하는|좋아하는|편한) (?:쪽|편|사람)(?:이에요|입니다)[.!]?$|당신은 [^.?!]{0,40}(?:먼저|부터) [^.?!]{0,30}(?:수 있어요|수 있습니다|편이에요|쪽이에요)[.!]?$/;
/** 대운 성장 곡선 장(7장)의 대운 쪽 소제목에서 MBTI 성장 말. */
const GROWTH_WORD = /성장(?!하는 해|하기 좋은 해)|성격|성향|곡선/;
/** 관계 이름이 주어인데 「…때예요」로 맺음(P7 annual-p6b 12월 「정임합이 … 작용하기 쉬운 때예요」 — 때는 달이지 관계가 아니다). */
export const REL_SUBJECT_TIME = /(?:[자축인묘진사오미신유술해]{2,3}(?:합|충|형|파|원진)|[갑을병정무기경신임계]{2}합|반합|방합|공망)(?:이|가|은|는) [^.?!,]{0,50}(?:때|시기)(?:예요|이에요|입니다)[.!]?$/;
/** 관계가 문장의 주어일 때만(앞에 「7월 · 정미월은 · 이 해는」 같은 때 주어가 없고, 관계 뒤에 쉼표로 나뉜 절이 없을 때). */
export const relSubjectTime = (sen: string) => { const m = REL_SUBJECT_TIME.exec(sen); return Boolean(m) && !/(?:월|년|달|해|10년|대운)(?:은|는)(?![가-힣])/.test(sen.slice(0, m!.index)); };
/**
 * MBTI 특성 말 사전(유형 공통 — 성향을 사람 성질로 단정하는 꼴). 유형 이름이 없어도 「당신은 … 쪽이라」 「… 유형이라」로 성향을 그 시기 기운의 원인 · 배경으로 쓰면 R-B6이다.
 * P7 판독 R-B6 여섯(major-p6b 2032 「당신은 눈앞의 것부터 처리하는 쪽이라」 · major-p6a 7.1 「마음을 읽는 감각을 가진 당신」 「사람 곁에서 힘을 얻는 유형이라」 …).
 */
export const TRAIT_FRAME = /(?:당신은|당신이) [^.?!]{0,40}[가-힣]+는 (?:쪽|편|사람|성향|유형|타입)(?:이라|이니|이어서|이기에)|(?:감각|성향|기질|버릇|습관|재능)을 (?:가진|지닌|타고난) 당신|[가-힣]{2,} (?:유형|성향|타입)이라|타고난 [가-힣 ]{0,12}(?:성향|기질)/;
/** 유형별 B 줄 핵심어(그 책 MBTI 줄 뜻에서 두 낱말 이음 — 조사 뗀 어간). 같은 책 명리 줄에도 나오는 말은 뺀다. */
export function traitStems(b: Pick<BlockCtx, "intake">): string[] {
  const strip = (w: string) => w.replace(/(으로|에서|에게|까지|부터|처럼|보다|이라|이나|에는|과는|와는|은|는|이|가|을|를|과|와|의|에|도|로|만)$/, "");
  const pairs = (t: string) => { const ws = t.replace(/[^가-힣\s]/g, " ").split(/\s+/).filter(w => w.length >= 2).map(strip).filter(w => w.length >= 2); const out: string[] = []; for (let i = 0; i + 1 < ws.length; i++) out.push(`${ws[i]} ${ws[i + 1]}`); return out; };
  const B = b.intake.lines.filter(l => l.subject === "mbti").flatMap(l => pairs(`${l.meaning}`));
  const M = new Set(b.intake.lines.filter(l => l.subject !== "mbti").flatMap(l => pairs(`${l.value} ${l.meaning}`)));
  return [...new Set(B.filter(p => !M.has(p)))];
}
const stemHit = (sen: string, stems: readonly string[]) => { const t = sen.replace(/[^가-힣\s]/g, " ").replace(/\s+/g, " "); return stems.filter(st => { const [a, c] = st.split(" "); return new RegExp(`${a}[가-힣]{0,3} ${c}`).test(t); }); };

/** 상투 권유(뿌리 5): 「…모습이 어울려요 · 어울리는 달」. */
export const ADVICE_CLICHE = /모습이 (?:어울려요|어울립니다|어울리는 (?:달|해|때|시기))/;

/** 어절(달 · 해 이름 목록은 한 덩이 — 같은 달 목록을 두 곳이 다른 뜻으로 쓰는 것은 복사가 아니다). */
const words = (s: string) => s.replace(new RegExp(`(?:20\\d\\d년 )?(?:1[0-2]|[1-9])월 ?· ?${GJ}월|20\\d\\d년(?: ${GJ}년)?`, "g"), "§때").replace(/[⟪⟫.,!?…"'“”‘’「」()·]/g, " ").split(/\s+/).filter(Boolean).filter((w, i, all) => !(w.startsWith("§때") && all[i - 1]?.startsWith("§때")));
/** 두 글이 n어절 넘게 이어서 같은가. */
export function sharesRun(a: string, b: string, n: number): boolean { const A = words(a), B = new Set<string>(); const wb = words(b); for (let i = 0; i + n + 1 <= wb.length; i++) B.add(wb.slice(i, i + n + 1).join(" ")); for (let i = 0; i + n + 1 <= A.length; i++) if (B.has(A.slice(i, i + n + 1).join(" "))) return true; return false; }
export function am28Flags(chapters: readonly FinalChapter[], b: BlockCtx): ChunkFlag[] {
  const out: ChunkFlag[] = [];
  const x = b.intake, plans = new Map(x.chapters.map(c => [c.n, c]));
  const hasMbti = Boolean(b.mbtiType) && x.lines.some(l => l.subject === "mbti");
  const stems = hasMbti ? traitStems(b) : [];
  const names = [b.brief?.person.callName ?? "", b.brief?.person.name ?? ""].filter(n => n.length >= 2);
  for (const c of chapters) {
    const plan = plans.get(c.n); if (!plan) continue;
    c.sections.forEach((sec, si) => {
      const kp = plan.keys?.find(k => k.key === sec.heading), sp = !kp ? plan.sections?.[si] : undefined;
      // 짝이 있는 key · 소제목(짝 두 줄이 다 든 곳)과 MBTI 줄만 있는 소제목(성장 곡선)은 보지 않는다.
      const pairedSec = sp ? x.pairs.some(p => sp.lines.includes(p.myeongri) && sp.lines.includes(p.mbti)) : false;
      const mbtiOnly = sp ? sp.lines.length > 0 && sp.lines.every(id => x.lines.find(l => l.id === id)?.subject === "mbti") : false;
      const guard = hasMbti && !(kp?.pair) && !pairedSec && !mbtiOnly;
      const growthSide = guard && plan.id === "growth";
      const HINT = "이 자리에는 짝이 없다 — 성향(유형 이름 없이 바꿔 쓴 말도)을 이 시기 기운의 원인 · 배경으로 잇지 않는다. 명리 근거만으로 쓴다";
      sec.paragraphs.forEach((p, pi) => { const ss = splitSentences(p); ss.forEach((sen, sj) => {
        const flagT = (s0: string, d: string) => out.push({ chapter: c.n, section: si, paragraph: pi, rule: "mbti_trait", sentence: s0, detail: d, hint: HINT });
        // 달 · 해 key와 7장 대운 쪽 소제목은 문장 전체가 그 시기 기운 이야기다 — 명리 낱말이 없어도 성향 꼴이면 잇는 것으로 본다.
        const whole = Boolean(kp) || growthSide;
        if (guard && (whole || MYEONGRI_WORD.test(sen))) {
          const fr = TRAIT_FRAME.exec(sen), st = stemHit(sen, stems), gw = growthSide ? GROWTH_WORD.exec(sen) : null;
          if (fr || st.length >= 2 || gw) flagT(sen, fr ? fr[0].slice(0, 40) : gw ? `성장 곡선 말 「${gw[0]}」` : st.slice(0, 3).join(" / "));
          // 이웃 문장 잇기: 앞 문장(명리 말 없음)이 성향을 내고, 이 문장이 「그 다정함 · 그 감각」으로 받아 명리 근거에 잇는다.
          const prev = sj > 0 ? ss[sj - 1] : undefined;
          if (prev && !MYEONGRI_WORD.test(prev) && TRAIT_REF.test(sen) && (TRAIT_FRAME.test(prev) || TRAIT_TAIL.test(prev) || stemHit(prev, stems).length >= 1)) { flagT(sen, `이웃 문장 잇기 「${sen.match(TRAIT_REF)![0].trim()}」`); flagT(prev, "이웃 문장 잇기(앞 문장)"); }
        }
        // 짝 있는 소제목: 성향 문장(유형 이름 · 성향 받는 말 · 성향 꼴)이 짝 명리 줄 밖의 명리 말(관계 뜻 · 다른 십성)과 이어지면 짝 범위 밖(P7 annual-p5 2.2 ¶2 「그 다정함 … 방해의 기운」 — 짝은 N11, 방해는 Y15).
        if (hasMbti && pairedSec && sp) {
          // 짝 범위 = 짝 명리 줄(대운 줄이면 그 대운 줄 전부 — 대운 십성 「정재의 10년」 포함).
          const scope = x.pairs.filter(p0 => sp.lines.includes(p0.myeongri) && sp.lines.includes(p0.mbti)).flatMap(p0 => { const l = x.lines.find(l2 => l2.id === p0.myeongri); return l?.subject === "dayun" ? x.lines.filter(l2 => l2.subject === "dayun") : l ? [l] : []; }).map(l => `${l.value} ${l.meaning}`).join(" ");
          const traitish = (b.mbtiType && sen.includes(b.mbtiType)) || TRAIT_REF.test(sen) || TRAIT_FRAME.test(sen);
          const outside = [...sen.matchAll(new RegExp(MYEONGRI_WORD.source, "g"))].map(m => m[0].trim()).filter(w => w.length >= 2 && !/^(기운이|기운 속|이 10년)$/.test(w) && !scope.includes(w.replace(/의$/, "")));
          if (traitish && outside.length) flagT(sen, `짝 범위 밖 「${outside[0]}」`);
        }
        if (ADVICE_CLICHE.test(sen)) out.push({ chapter: c.n, section: si, paragraph: pi, rule: "advice_cliche", sentence: sen, detail: sen.match(ADVICE_CLICHE)![0] });
        if (relSubjectTime(sen)) out.push({ chapter: c.n, section: si, paragraph: pi, rule: "rel_subject_time", sentence: sen, detail: "관계 주어 + 때예요", hint: "관계 이름을 주어로 「…때예요」로 맺지 않는다 — 때는 그 달 · 해다(「이 달은 …」 또는 관계가 하는 일로 맺는다)" });
      }); });
    });
  }
  // AM2-8 4부 뿌리 4: key 본문 문장이 같은 key의 화면 문구(배지 뜻 · 좋은 것 · 살필 점 · 할 일 · 그림 · 돌아보기)와 6어절 넘게 같다(관계 이름 + 뜻 한 마디는 6어절이 안 된다).
  const ent = new Map((b.brief?.timeline?.entries ?? []).map(e => [e.key, e] as const));
  for (const c of chapters) { if (!c.keys) continue;
    c.sections.forEach((sec, si) => { const e = ent.get(sec.heading); if (!e) return;
      const screens = [e.good, e.caution, e.todo, e.imageLine, e.review, ...e.badges.map(bd => bd.line)].filter((t): t is string => Boolean(t));
      sec.paragraphs.forEach((p, pi) => splitSentences(p).forEach(sen => { const hit = screens.find(t => sharesRun(sen, t, 6)); if (hit) out.push({ chapter: c.n, section: si, paragraph: pi, rule: "screen_copy6", sentence: sen, detail: hit.slice(0, 40), hint: "화면 카드 문구를 6어절 넘게 옮겼다 — 관계 이름과 뜻 한 마디만 두고 이 사람에게 갖는 뜻으로 쓴다" }); }));
    }); }
  // 같은 틀 셋째(장 안).
  for (const h of templateIndex(chapters, { names }).filter(h0 => h0.nth >= 3)) out.push({ chapter: h.chapter, section: h.section, paragraph: h.paragraph, rule: "template_third", sentence: h.sentence, detail: `${h.skeleton} · ${h.nth}번째`, hint: `장 안에서 같은 틀 문장이 ${h.nth}번째다 — 첫머리 꼴을 바꿔 쓴다(같은 사실은 그대로)` });
  // 장 사이 9어절 이상 같은 문장(뒤 장 쪽).
  const grams = new Map<string, number>();
  const W = 9;
  for (const c of chapters) {
    const mine = new Set<string>();
    c.sections.forEach((sec, si) => sec.paragraphs.forEach((p, pi) => splitSentences(p).forEach(sen => {
      const ws = words(sen); let hitAt: number | undefined;
      for (let i = 0; i + W <= ws.length; i++) { const g = ws.slice(i, i + W).join(" "); const from = grams.get(g); if (from !== undefined && from !== c.n) { hitAt = from; break; } }
      if (hitAt !== undefined) out.push({ chapter: c.n, section: si, paragraph: pi, rule: "cross_copy8", sentence: sen, detail: `${hitAt}장과 9어절 넘게 같음`, hint: "다른 장 문장과 9어절 넘게 같다 — 이 장의 각도로 새로 쓴다" });
      for (let i = 0; i + W <= ws.length; i++) mine.add(ws.slice(i, i + W).join(" "));
    })));
    for (const g of mine) if (!grams.has(g)) grams.set(g, c.n);
  }
  return out;
}
