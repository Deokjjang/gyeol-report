/**
 * AM2 1부 — 입력 정화: 세운·대운 작가에게 「베껴도 안전한 브리프」를 만든다(결정론, 호출 0).
 * - 근거 카드를 주체별로 나눈다(원국 / 대운 / 세운 / 월운 / MBTI / 고객 입력). 줄마다 엔진 값 + 쉬운 뜻 + 쓸 수 있는 장.
 * - 명리 × MBTI 연결은 「명리 근거 id + MBTI 근거 id + 연결 이유」 짝으로만 준다(짝 없는 연결은 쓰지 못하게 한다).
 * - 브리프 본문에는 고객에게 그대로 나가도 되는 말만 둔다: 제약(note·rule·forbiddenFacts)·내부 약어·라벨·점수·한자·화살표는 뺀다.
 *   제약은 작가 시스템 규칙(prompt.ts) 한 곳에만 있다.
 * - 시점: 「지금·올해·이번 달」을 쓰지 않고 날짜는 절대값(「2027년 정미년」「5월 · 을사월」).
 * - 입력에 맞지 않는 장면·소품(연차 소품·연애 상태·자녀·직업과 부딪치는 씨앗)은 여기서 거른다.
 * 기존 브리프(buildBrief)는 그대로 쓰고, 작가에게 보이는 글만 새로 짓는다(엔진·지식 DB·장 구성 유지).
 */
import type { Knowledge } from "@/lib/brief/knowledge";
import type { Brief, Material, TimelineEntry } from "@/lib/brief/schema";
import { JOB_ASSUME, type WriterChapter } from "../prompt";
import { FARMING, presumedPartner } from "../safety/lint";
import { RURAL_PROP } from "../safety/patterns";
import { readWish } from "@/lib/brief/design/annual";

export type Subject = "natal" | "dayun" | "year" | "month" | "mbti" | "input";
export const SUBJECT_KO: Readonly<Record<Subject, string>> = { natal: "원국(타고난 사주)", dayun: "대운", year: "세운(그 해)", month: "월운(그 달)", mbti: "MBTI", input: "고객 입력" };
const PREFIX: Readonly<Record<Subject, string>> = { natal: "N", dayun: "D", year: "Y", month: "M", mbti: "B", input: "I" };
/** 근거 한 줄: 엔진 값 + 쉬운 뜻 + 쓸 수 있는 장(장 번호). */
export type Line = { readonly id: string; readonly subject: Subject; readonly value: string; readonly meaning: string; readonly use: readonly number[] };
/** 명리 × MBTI 짝. 이 짝만 한 문장 안에서 잇는다. */
export type Pair = { readonly id: string; readonly myeongri: string; readonly mbti: string; readonly why: string };
/** 반복 장 key 하나(세운 달·대운 연도): 그 시기 카드. head는 시스템이 첫 문장으로 넣는 머리 문장(작가는 되풀이하지 않는다). */
export type KeyPlan = { readonly key: string; readonly label: string; readonly head: string; readonly when: "past" | "current" | "future"; readonly lines: readonly string[]; readonly claims: readonly string[]; readonly depth?: "deep" | "short"; readonly scene?: string };
export type SectionPlan = { readonly q: string; readonly lines: readonly string[]; readonly angle?: string; readonly claims: readonly string[]; readonly scene?: string };
export type ChapterPlan = {
  readonly n: number; readonly id: string; readonly title: string; readonly question: string;
  readonly target: readonly [number, number]; readonly useName: boolean;
  readonly sections?: readonly SectionPlan[]; readonly keys?: readonly KeyPlan[];
  /** 이 장의 핵심 주장(엔진 값에서). 다른 장은 되풀이하지 않는다. */
  readonly claims: readonly string[];
  /** 다른 장이 쓰는 주장 가운데 이 장과 근거가 겹치는 것(반복 금지). */
  readonly avoid: readonly string[];
  /** 장면 씨앗 1~2개(입력으로 거른 생활 소품). */
  readonly scenes?: readonly string[];
};
export type Intake = { readonly product: "annual_fortune" | "major_fortune"; readonly person: readonly string[]; readonly lines: readonly Line[]; readonly pairs: readonly Pair[]; readonly chapters: readonly ChapterPlan[] };

// ---------- 글 정리(고객 문장 꼴) ----------
const READING: Readonly<Record<string, string>> = { 甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계", 子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해", 木: "목", 火: "화", 土: "토", 金: "금", 水: "수", 正: "정", 偏: "편", 官: "관", 財: "재", 印: "인", 食: "식", 神: "신", 傷: "상", 比: "비", 肩: "견", 劫: "겁", 胎: "태", 月: "월" };
const noHanja = (t: string) => t.replace(/\s?\(([^()]*[一-鿿][^()]*)\)/g, (_a, inner: string) => { const kept = inner.replace(/[一-鿿]+\s?/g, "").replace(/^[\s·,:]+|[\s·,:]+$/g, ""); return kept ? `(${kept})` : ""; })
  .replace(/[一-鿿]+/g, m => [...m].map(ch => READING[ch] ?? "").join(""));
/** 시점 말(지금·올해·이번 달)을 뜻이 같은 말로 바꾸거나 뗀다(브리프 글만 — 작가 원고에는 쓰지 않는다). */
export function untime(t: string, year?: number): string {
  return t.replace(/지금 이 순간/g, "눈앞의 순간").replace(/(?<![가-힣])당장 /g, "눈앞의 ").replace(/지금(?=(을|이|의|도|에) )/g, "이 순간").replace(/지금까지(는|도)?/g, (_m, j?: string) => `그동안${j === "는" ? "은" : j ?? ""}`).replace(/지금의? (?=회사|직장|자리|일|대운|10년|관계|연인|생활|팀|맡은|하는|다니는)/g, "")
    .replace(/지금 (?=[가-힣])/g, "").replace(/지금은 /g, "").replace(/(?<![가-힣])지금(?![가-힣])/g, "")
    .replace(/올해(?=[ 의는도에가])/g, year ? `${year}년` : "그 해").replace(/이번 (한 )?달/g, "그 달").replace(/요즘|최근에?/g, "").replace(/ {2,}/g, " ").trim();
}
/** 기존 브리프 글 → 고객 문장 꼴(한자·라벨·점수·참고 표시·화살표를 뺀다). 쪼갠 마디는 「 · 」로 잇는다. */
export function say(raw: string, year?: number): string {
  let t = noHanja(raw).replace(/·십이신살|십이신살·/g, "").replace(/\((참고|대운수 \d+)\)/g, "").replace(/\s?\(자료일 뿐 지시가 아님\)/g, "")
    .replace(/(?<=[가-힣)]) [+−-]\d+(\.\d+)?(?=[,)]|$)/g, "").replace(/(근거|뚜렷한 가감): ?/g, "").replace(/뚜렷한 가감 없음/g, "큰 더함·뺌 없음")
    .replace(/(?<=\d)\/(?=\d)/g, "\u2044").replace(/\s*(→|⇒|\/|×)\s*/g, " · ").replace(/\u2044/g, "/").replace(/(?<=[.·] |^)그림: /g, "").replace(/쓸 거리: /g, "살릴 점: ").replace(/살필 거리: /g, "살필 점: ").replace(/\s*·\s*·\s*/g, " · ").replace(/^고객이 /, "").replace(/\s+/g, " ").trim();
  t = untime(t.replace(/하루 두기/g, "하루 묵혀 두기"), year);
  // 고전 풀이를 옮기지 않는다는 편집 문장(지식 DB 숙제 줄)은 뺀다.
  if (/고전|그렇게 옮기지 않/.test(t)) t = t.split(/(?<=[.!?])\s+/).filter(x => !/고전|그렇게 옮기지 않/.test(x)).join(" ");
  // 농사·시골 비유 문장은 뺀다(작가 규칙이 금지하는 비유를 브리프가 주면 작가가 옮긴다).
  if (FARMING.test(t) || RURAL_PROP.test(t)) t = t.split(/(?<=[.!?])\s+| · /).filter(x => !FARMING.test(x) && !RURAL_PROP.test(x)).join(" · ");
  return t.replace(/^[·,:\s]+|[·,:\s]+$/g, "").trim();
}

// ---------- 입력에 맞지 않는 장면·소품 ----------
/** 연차·직급 소품: 입력 직업 글에 연차·직급 말이 없으면 쓰지 않는다(AM: 20대 직장인에게 사수·막내·선배·사원증). */
export const SENIORITY_PROP = /사수|막내|선배|후배|신입|입사 동기|동기 모임|팀장|과장|부장|차장|대리|사원증|연차|인턴|수습|첫 출근|정규직 전환|승진 심사|인사 평가/;
const CHILD_PROP = /(?<![가-힣])(아이|아들|딸)(가|를|와|랑|의|에게|는|도|들)?(?![가-힣])|자녀(?! ?(별|자리))|육아|어린이집|유치원|학부모/;
/** 뜻 문장용 입력 밖 직장 상황(장면의 JOB_ASSUME에서 「투자」 — 「시간을 투자」 같은 일상어 — 를 뺀 것). */
const JOB_ASSUME_MEANING = /팀원|팀 (회의|미팅)|주간 팀|직원|채용|면담|평가 시즌|실적|사업자 통장/;
export function sceneFits(s: string, brief: Brief, meaning = false): boolean {
  const f = brief.person.facts, detail = f.job.detail ?? "";
  if (SENIORITY_PROP.test(s) && !SENIORITY_PROP.test(detail)) return false;
  { const m = s.match(meaning ? JOB_ASSUME_MEANING : JOB_ASSUME); if (m && !detail.includes(m[0])) return false; }
  if (presumedPartner(s, f.relationship)) return false;
  if (CHILD_PROP.test(s) && f.children !== "has") return false;
  if (f.job.class !== "student" && /학교|수업|담임|학기|시험지|성적표|모의고사|학원/.test(s)) return false;
  if (/(사업장|매장|손님|직원|매출)/.test(s) && !/^(self_employed|business_owner)$/.test(f.job.status)) return false;
  return true;
}

// ---------- 주체 분류 ----------
const ANNUAL_SUBJECT: Readonly<Record<string, Subject>> = { yearCard: "year", yearEnergy: "year", yearMbti: "year", wishLink: "input", wish: "input", loveYear: "year", loveMonths: "month", moneyIn: "year", moneyHole: "month", workYear: "year", workCriteria: "month", studyYear: "year", helpers: "year", carePeople: "year", mindPush: "year", mindRest: "month", useDo: "year", useAvoid: "year", lucky: "natal", samjae: "year", dayunBridge: "dayun" };
const MAJOR_SUBJECT: Readonly<Record<string, Subject>> = { dayunHow: "dayun", lifetime: "dayun", pastSummary: "year", pastDayun: "dayun", nowTheme: "dayun", nowRelation: "dayun", nowCards: "dayun", turnWhen: "dayun", turnMind: "dayun", mapWorkMoney: "dayun", mapLovePeople: "dayun", mapMindMove: "dayun", growthCurve: "mbti", growthDayun: "dayun", planNear: "year", planFar: "year" };
const subjectOfFact = (key: string, fact: string, product: Intake["product"]): Subject => {
  if (/^(적어 준|연애 상태|일 상황|고객이|바람)/.test(fact)) return "input";
  if (/달: |달은 /.test(fact) && !/대운/.test(fact)) return "month";
  if (/^\d{4}년 [가-힣]{2}년의/.test(fact)) return "year";
  if (/대운/.test(fact) && !/^이 해/.test(fact)) return "dayun";
  return (product === "annual_fortune" ? ANNUAL_SUBJECT : MAJOR_SUBJECT)[key] ?? (product === "annual_fortune" ? "year" : "dayun");
};
/** 사실 줄을 「값」과 「뜻」으로 나눈다(앞 마디가 이름·값이면 값, 나머지는 뜻). */
function split(fact: string): { value: string; meaning: string } {
  const m = fact.match(/^([^:—]{2,40})(?::| —) (.+)$/);
  return m ? { value: m[1].trim(), meaning: m[2].trim() } : { value: fact, meaning: "" };
}
/** 브리프 근거 줄 가운데 작가에게 줄 필요가 없는 지시 꼴(「짧게 읽는 해」 등). */
const DIRECTIVE_FACT = /^(짧게 읽는 해|연애 상태 미입력|일 상황 미입력|고객이 마음이 많이 힘든)|단정하지 않는다|지시가 아님|쓰지 않는다/;
const DOMAIN_KO: Readonly<Record<string, string>> = { love: "연애 쪽", marriage: "결혼·가족 쪽", work: "일 쪽", money: "돈 쪽", study: "공부 쪽", relationships: "사람 사이", alone: "혼자 있을 때", family: "가족 쪽" };
const SIGNAL_KO = (a: string) => (a === "↑" ? "오름" : a === "↓" ? "내림" : "보통");
const DOMAIN_SIGNAL: Readonly<Record<string, string>> = { love: "연애", money: "돈", work: "일", people: "사람", mind: "마음" };

export function buildIntake(brief: Brief, k: Knowledge, plan: readonly WriterChapter[], wishRaw?: string): Intake {
  const product = brief.product as Intake["product"];
  const year = product === "annual_fortune" ? Number(brief.timeline?.entries.find(e => e.kind === "year")?.key) || brief.chart.thisYear.year : brief.chart.thisYear.year;
  const lines: Line[] = [], pairs: Pair[] = [];
  const counter: Record<Subject, number> = { natal: 0, dayun: 0, year: 0, month: 0, mbti: 0, input: 0 };
  const byText = new Map<string, Line>();
  const use = new Map<string, Set<number>>();
  // 뜻 문장도 입력에 맞지 않는 상황(연차·팀원·직원·자녀·연인 전제·학교)이면 그 마디만 뺀다.
  const fits = (t: string) => t.split(/(?<=[.!?])\s+| · /).filter(x => sceneFits(x, brief, true)).join(" · ");
  const add = (subject: Subject, value: string, meaning = "", n?: number): string | null => {
    const v = say(value, year), m = fits(say(meaning, year));
    if (!v || v.length < 2) return null;
    const sig = `${subject}|${v}|${m}`;
    let l = byText.get(sig);
    // 같은 주체에 이미 같은 말(공백·부호 뺀 글이 포함됨)이 있으면 그 줄을 쓴다(세운 근거 둘이 같은 대운 줄을 따로 가진다).
    if (!l) { const key = `${v}${m}`.replace(/[^가-힣0-9]/g, ""); if (key.length >= 8) l = lines.find(x => x.subject === subject && `${x.value}${x.meaning}`.replace(/[^가-힣0-9]/g, "").includes(key)); }
    if (!l) { l = { id: `${PREFIX[subject]}${++counter[subject]}`, subject, value: v, meaning: m, use: [] }; byText.set(sig, l); lines.push(l); use.set(l.id, new Set()); }
    if (n) use.get(l.id)!.add(n);
    return l.id;
  };
  const c = brief.chart;
  // 원국(장에 배정된 것 + 바탕).
  const natalBase = [
    add("natal", `타고난 바탕: ${c.dayMaster.name}`, c.coreImage.meaning ?? ""),
    add("natal", `내 힘의 세기: ${c.strength.label}`, c.strength.reading),
    add("natal", `가장 강한 기운: ${c.elements.strongest.name}(${c.elements.strongest.level})`, ""),
    add("natal", `가장 약한 기운: ${c.elements.weakest.name}(${c.elements.weakest.level})`, ""),
    c.groups ? add("natal", "다섯 힘의 세기", c.groups.line.split(" — ")[0]) : null,
    add("natal", `음양: 양 ${c.yinYang.yang} · 음 ${c.yinYang.yin}`, c.yinYang.reading ?? ""),
  ].filter(Boolean) as string[];
  const traitId = new Map<string, string>();
  for (const t of brief.traits) {
    if (!t.chapters.length) continue;
    const id = add("natal", t.name, [t.meaning, t.forYou, ...t.good, t.overuse ?? ""].filter(Boolean).join(" · "));
    if (id) traitId.set(t.id, id);
  }
  const shadowId = new Map(brief.shadows.map(s => [s.id, add("natal", `숙제로 볼 점: ${s.text}`, [s.basis, s.warmTurn].join(" · "))] as const));
  // 대운(그 해가 속한 대운 · 다음 대운).
  const cd = c.currentDayun;
  const dayunCur = cd ? add("dayun", `${cd.ganji.hangul} 대운(${cd.period ?? cd.label})`, [`${cd.tenGod}의 10년`, cd.reading ?? "", cd.phase ? `대운 안의 위치: ${cd.phase.yearIndex}번째 해(${cd.phase.label})${cd.phase.remaining ? `, 남은 기간 ${cd.phase.remaining}` : ""}` : ""].filter(Boolean).join(" · ")) : null;
  const dayunNext = cd?.next ? add("dayun", `다음 대운: ${cd.next.ganji.hangul} 대운(${cd.next.start ?? cd.next.label})`, [`${cd.next.tenGod}의 10년`, cd.next.reading ?? ""].filter(Boolean).join(" · ")) : null;
  // MBTI.
  const mbti = brief.mbti;
  const mbtiType = mbti ? add("mbti", `MBTI ${mbti.type}`, (k.mbti.get(mbti.type as never)?.cognitiveFunctions ?? []).map(fn => `${fn.role}: ${fn.easy.split(/(?<=[.!?])\s/)[0]}`).join(" · ")) : null;
  for (const t of brief.traits) if (t.fusion && mbtiType && traitId.get(t.id)) pairs.push({ id: `P${pairs.length + 1}`, myeongri: traitId.get(t.id)!, mbti: mbtiType, why: say(t.fusion.why, year) });
  // 장 재료 → 줄.
  const refLine = (ref: string): string[] => {
    if (ref === "chart.dayMaster") return natalBase.slice(0, 1);
    if (ref === "chart.currentDayun") return [dayunCur, dayunNext].filter(Boolean) as string[];
    if (ref.startsWith("traits.")) { const id = traitId.get(ref.slice(7)); return id ? [id] : []; }
    if (ref.startsWith("shadows.")) { const id = shadowId.get(ref.slice(8)); return id ? [id] : []; }
    return [];
  };
  const matLines = (m: Material, n: number, evidenceKey?: (key: string) => void): string[] => {
    if (m.kind === "trait") { const id = traitId.get(m.traitId); if (id) use.get(id)!.add(n); return id ? [id] : []; }
    if (m.kind === "ref") { const ids = refLine(m.ref); ids.forEach(id => use.get(id)?.add(n)); return ids; }
    if (m.kind === "mbti") { if (!mbtiType) return []; use.get(mbtiType)!.add(n); const id = sceneFits(m.scene, brief) ? add("mbti", `${mbti!.type}의 장면`, m.scene, n) : null; return [mbtiType, ...(id ? [id] : [])]; }
    if (m.kind === "evidence") {
      evidenceKey?.(m.key);
      if (/^(depth|month|bridge):/.test(m.key)) return [];
      if (m.key === "yearMbti" || m.key === "growthDayun") {
        // 명리 × MBTI: 첫 줄(명리 쪽)과 나머지(그 유형의 반응)를 짝으로.
        const [head, ...rest] = m.facts.filter(x => !DIRECTIVE_FACT.test(x));
        const my = head ? add(m.key === "yearMbti" ? "year" : "dayun", split(head).value, split(head).meaning, n) : null;
        if (my && mbtiType) { use.get(mbtiType)!.add(n); for (const r of rest) pairs.push({ id: `P${pairs.length + 1}`, myeongri: my, mbti: mbtiType, why: say(r, year) }); }
        return [my, mbtiType].filter(Boolean) as string[];
      }
      return m.facts.filter(x => !DIRECTIVE_FACT.test(x) && sceneFits(x, brief)).map(x => { const s = split(x); return add(subjectOfFact(m.key, x, product), s.value, s.meaning, n); }).filter(Boolean) as string[];
    }
    return [];
  };
  const entries = new Map((brief.timeline?.entries ?? []).map(e => [e.key, e]));
  const chapters: ChapterPlan[] = plan.map(ch => {
    const cb = brief.chapters.find(x => x.id === ch.id) ?? brief.chapters.find(x => x.id.startsWith(`${ch.id}:`));
    const scene = (hints: readonly string[] | undefined) => (hints ?? []).map(h => say(h, year)).find(h => h && sceneFits(h, brief));
    if (ch.keys) {
      const keys: KeyPlan[] = ch.keys.map(key => {
        const e = entries.get(key)!, kb = brief.chapters.find(x => x.id === `${ch.id}:${key}`);
        return keyPlan(e, kb?.materials ?? [], ch.n, add, matLines, brief, year);
      });
      return { n: ch.n, id: ch.id, title: say(ch.title, year), question: say(ch.question, year), target: ch.targetChars, useName: ch.useName, keys, claims: [], avoid: [] };
    }
    const secs: readonly { q: string; domain: string; materials: readonly Material[] }[] = cb?.sections ?? [{ q: ch.question, domain: "alone", materials: ch.materials }];
    const sections: SectionPlan[] = secs.map(s => {
      const ids = [...new Set(s.materials.flatMap(m => matLines(m, ch.n)))];
      const ev = s.materials.find((m): m is Extract<Material, { kind: "evidence" }> => m.kind === "evidence");
      const claim = ev ? ev.facts.filter(x => !DIRECTIVE_FACT.test(x) && !/^(적어 준|연애 상태|일 상황|고객이)/.test(x) && /: |달: | — /.test(x) && sceneFits(x, brief))[0] : undefined;
      const sc = scene(s.materials.flatMap(m => (m.kind === "trait" && m.scene ? [m.scene] : [])));
      return { q: say(s.q, year), lines: ids, claims: claim ? [say(claim, year)] : [], ...(sc ? { scene: sc } : {}), ...(DOMAIN_KO[s.domain] ? { angle: DOMAIN_KO[s.domain] } : {}) };
    });
    const scenes = (cb?.sceneHint ?? []).map(h => say(h, year)).filter(h => h && sceneFits(h, brief)).slice(0, 2);
    return { n: ch.n, id: ch.id, title: say(ch.title, year), question: say(ch.question, year), target: ch.targetChars, useName: ch.useName, sections, claims: [...new Set(sections.flatMap(s => s.claims))], avoid: [], ...(scenes.length ? { scenes } : {}) };
  });
  // 같은 줄을 여러 장이 쓰면 다른 각도(절 영역)로만 — 각도는 절에 적혀 있다. 근거가 겹치는 다른 장의 주장은 반복 금지 목록으로.
  const linesOf = (p: ChapterPlan) => new Set([...(p.sections ?? []).flatMap(s => s.lines), ...(p.keys ?? []).flatMap(x => x.lines)]);
  const out = chapters.map(p => { const mine = linesOf(p); return { ...p, avoid: [...new Set(chapters.filter(o => o.n !== p.n && [...linesOf(o)].some(id => mine.has(id))).flatMap(o => o.claims.map(cl => `${o.n}장: ${cl}`)))].slice(0, 6) }; });
  const finalLines = lines.map(l => ({ ...l, use: [...(use.get(l.id) ?? [])].sort((a, b) => a - b) }));
  return { product, person: personCard(brief, year, product === "annual_fortune" ? readWish(wishRaw) : null), lines: finalLines, pairs: pairs.filter(p => p.why), chapters: out };
}

function keyPlan(e: TimelineEntry, mats: readonly Material[], n: number, add: (s: Subject, v: string, m?: string, n?: number) => string | null, matLines: (m: Material, n: number) => string[], brief: Brief, year: number): KeyPlan {
  const month = e.kind === "month", subj: Subject = month ? "month" : "year";
  const label = month ? e.label.split(" (")[0] : `${e.key}년 ${e.ganji.hangul}년`;
  const notes = brief.timeline?.tenGodNotes ?? {};
  const stem = e.tenGod.stem, branch = e.tenGod.branch;
  const noteOf = (tg: string) => (notes as Record<string, { meaning: string }>)[tg]?.meaning ?? (Object.entries(notes).find(([k2]) => k2.startsWith(tg.replace(/\(.*$/, "")))?.[1] as { meaning: string } | undefined)?.meaning ?? "";
  const ids: string[] = [];
  const push = (v: string, m = "") => { const id = add(subj, `${label} ${v}`, m, n); if (id) ids.push(id); };
  push(`하늘 글자 ${stem}`, noteOf(stem));
  if (branch && branch !== stem) push(`땅 글자 ${branch}`, noteOf(branch));
  for (const b of e.badges.filter(b => b.kind !== "GONGMANG").slice(0, 3)) push(`${b.label}${b.with ? `(${b.with} 자리와)` : ""}`, b.line);
  const sig = (e as TimelineEntry & { signals?: Record<string, string> }).signals;
  if (sig) push("영역 흐름", Object.entries(DOMAIN_SIGNAL).map(([d, ko]) => `${ko} ${SIGNAL_KO(sig[d] ?? "→")}`).join(" · "));
  for (const d of (e.material?.domains ?? []).filter(x => sceneFits(x, brief))) push("생활", d);
  if (e.fillsLack?.fills && e.fillsLack.elements.length) push("부족한 기운을 채움", "");
  push(`흐름 세기 ${e.flow.score}/5`, e.flow.label);
  if (e.dayun?.position) push("대운 안의 위치", e.dayun.position.replace(/^\d{4}~\d{4} /, ""));
  if (e.dayun?.transition) push(`새 대운 시작: ${e.dayun.ganji}`, e.dayun.tenGod);
  for (const m of mats) if (m.kind === "evidence" && /^(month|bridge):/.test(m.key)) for (const x of m.facts) if (!/^영역 신호/.test(x) && sceneFits(x, brief)) { const s = split(x); push(s.value.replace(/^(연애|돈|일|사람|마음) [↑↓→]$/, "$1 쪽 장면"), s.meaning); }
  for (const m of mats) if (m.kind === "ref") ids.push(...matLines(m, n));
  const deep = mats.find((m): m is Extract<Material, { kind: "evidence" }> => m.kind === "evidence" && m.key.startsWith("depth:"));
  const depth = deep ? (/^핵심 해/.test(deep.facts[0] ?? "") ? "deep" : "short") : undefined;
  if (depth === "deep") push("이 10년에서 눈여겨볼 해", say(deep!.facts[0].replace(/^핵심 해 \d+: /, ""), year));
  const scene = e.material?.scene && sceneFits(e.material.scene, brief) ? say(e.material.scene, year) : undefined;
  const claim = sig ? Object.entries(DOMAIN_SIGNAL).filter(([d]) => sig[d] && sig[d] !== "→").map(([d, ko]) => `${ko} ${SIGNAL_KO(sig[d])}`).join(" · ") : "";
  return { key: e.key, label, head: say(e.head ?? "", year), when: (e.when ?? e.period ?? "future") as KeyPlan["when"], lines: [...new Set(ids)], claims: claim ? [`${label}: ${claim}`] : [], ...(depth ? { depth } : {}), ...(scene ? { scene } : {}) };
}

/** 인물 카드(고객 입력만, 제약 문장 없이 사실만). */
function personCard(brief: Brief, year: number, wish: { kind: string; text?: string; topics?: readonly string[] } | null): string[] {
  const p = brief.person, f = p.facts;
  const JOB: Record<string, string> = { employee: "직장인", job_seeker: "취업 준비 중", student: "학생", self_employed: "자영업", business_owner: "사업", freelancer: "프리랜서", unemployed: "쉬는 중", homemaker: "살림", other: "기타" };
  const REL: Record<string, string> = { single: "솔로", some: "솔로(썸)", dating: "연애 중", marriage_preparing: "연애 중(결혼 준비)", married: "기혼", unknown: "미입력" };
  const book = brief.product === "annual_fortune" ? `「나의 ${year}」(${year}년 ${brief.timeline?.entries.find(e => e.kind === "year")?.ganji.hangul ?? ""}년 신년판)` : "「앞으로의 나」(대운 10년)";
  const base = brief.baseDate.split("-").map(Number);
  return [
    `이름: ${p.name}(부를 때 ${p.callName})`,
    `나이: 만 ${p.age}세(${p.ageBand})${p.gender === "FEMALE" ? " · 여성" : p.gender === "MALE" ? " · 남성" : ""}`,
    `MBTI: ${f.mbti ?? "미입력"}`,
    `출생 시각: ${f.birthTimeKnown ? "앎" : "모름(시주 없음)"}`,
    `일: ${JOB[f.job.status] ?? "적지 않음"}${f.job.detail ? `(${say(f.job.detail)})` : " · 하는 일과 연차는 모름"}`,
    `연애: ${REL[f.relationship] ?? "미입력"} · 자녀: ${f.children === "has" ? "있음" : f.children === "none" ? "없음" : "미입력"}`,
    ...(wish?.kind === "ok" && wish.text ? [`적어 준 바람: «${wish.text}»`] : wish?.kind === "inject" ? [`적어 준 바람의 주제: ${(wish.topics ?? []).map(t => ({ love: "연애", money: "돈", work: "일", study: "공부", people: "사람", mind: "마음" } as Record<string, string>)[t] ?? t).join("·") || "일상"}`] : wish?.kind === "risk" ? ["적어 준 바람: 마음이 많이 지친 시기일 수 있음"] : []),
    `책: ${book} · 이 책을 쓴 날 ${base[0]}년 ${base[1]}월 ${base[2]}일`,
  ];
}
