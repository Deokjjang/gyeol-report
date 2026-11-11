/**
 * 렌더 단계 표기(P6e 7, 최종판 1-6, 결정론·호출 0): 작가는 한자를 쓰지 않고 한글 이름만 쓴다.
 * 조립 직전에 용어 사전(지식 DB 특성 이름의 한자)·엔진 간지로 한자를 장마다 첫 등장에만 붙인다.
 * MBTI 약어(Te 등)는 붙이지 않는다(최종판: P6d처럼 작가가 "쉬운 이름(Te)"으로 쓴다 — 렌더가 붙이는 방식은 옮기지 않았다).
 * 사전은 tests/unit/writer/p6e-terms.test.ts가 표준 표기표와 전수 대조한다(오기 "편인(偏人)"이 구조적으로 0).
 * 한 이름이 두 한자로 갈리면("신금" = 申金 땅 글자 / 辛金 일간) 문맥 없이 고를 수 없어 붙이지 않는다.
 */
import type { Knowledge } from "@/lib/brief/knowledge";
import type { BookSection } from "./format";

/** 천간·지지·오행 한자 → 한글 읽기(작가 출력에 괄호 밖 한자가 남았을 때 읽기로 바꾼다). */
export const HANJA_READING: Readonly<Record<string, string>> = {
  甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계",
  子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해",
  木: "목", 火: "화", 土: "토", 金: "금", 水: "수",
};
/** 용어 사전에 넣는 지식 DB 특성 갈래(그 사람 원고에 나오는 명리 용어). 오행 과다·조후·구조 같은 설명 이름은 넣지 않는다. */
const DICT_FAMILIES = new Set(["tenGod", "twelveStage", "shinsal", "gwiin", "relation", "dayPillar", "stem", "dayMaster", "branch"]);
/** 사전 밖에서 더하는 용어(지식 DB 이름에 없는 표기). AM 1부: 「세운」은 뺐다 — 동사 「세운(세우다)」에 歲運이 붙었다(「처음 세운(歲運) 기준」, 운영 판독). */
const EXTRA: Readonly<Record<string, string>> = { 비겁: "比劫", 식상: "食傷", 재성: "財星", 관성: "官星", 인성: "印星", 관살: "官殺", 칠살: "七殺", 반합: "半合", 원진: "怨嗔", 화개살: "華蓋殺", 양인: "羊刃", 대운: "大運", 일주: "日柱", 일간: "日干", 지장간: "支藏干" };

/** 한글 이름 → 한자(사전). 지식 DB 특성 이름 "식신(食神)" 꼴에서 만든다. "망신살(亡身殺)·십이신살"처럼 꼬리가 붙은 이름은 앞만. */
export function termDictionary(k: Pick<Knowledge, "features">): Map<string, string> {
  const out = new Map<string, string>(), ambiguous = new Set<string>();
  for (const f of k.features.values()) {
    if (!DICT_FAMILIES.has(f.family)) continue;
    const m = f.name.match(/^([가-힣]{1,8})\(([一-鿿]{1,6})\)/); if (!m) continue;
    const had = out.get(m[1]);
    if (had === undefined) out.set(m[1], m[2]); else if (had !== m[2]) ambiguous.add(m[1]);
  }
  for (const ko of ambiguous) out.delete(ko);
  for (const [ko, han] of Object.entries(EXTRA)) if (!out.has(ko) && !ambiguous.has(ko)) out.set(ko, han);
  return out;
}

/** 일상어와 겹치는 짧은 용어: 뒤에 조사·문장부호가 와야 용어로 본다. 간지(60갑자)는 간지 문맥에서만(기사·임신·정사는 일상어). */
const AFTER = "(?=[은는이가을를의에과와도로만처]|\\s|[,.?!)·]|$)";
const GANJI_CONTEXT = "(?=\\s?(일주|대운|년|월|일|기둥|의 해|해|월주|일간|\\())";
/** 한 글자 용어(충·형·파·해·쇠·병·사·묘·절·태·양)는 너무 흔해 붙이지 않는다(문맥 없이 오탐). */
const isGanji = (ko: string, han: string) => ko.length === 2 && han.length === 2 && /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/.test(han);

export type AnnotateCtx = {
  readonly dict: ReadonlyMap<string, string>;
  /** 이 책 사람들의 엔진 간지(원국 네 기둥·대운·세운 연도·궁합 상대). 간지 이름은 이 안의 것만 붙인다. */
  readonly ganji: ReadonlySet<string>;
  /** MBTI 기능 쉬운 이름 → 약어. 최종판에서는 넘기지 않는다(작가가 약어를 쓴다). */
  readonly mbtiNames?: ReadonlyMap<string, string>;
};

function patternsOf(ctx: AnnotateCtx): { ko: string; tag: string; re: RegExp }[] {
  const pats: { ko: string; tag: string; re: RegExp }[] = [];
  for (const [ko, han] of ctx.dict) {
    if (ko.length < 2) continue;
    if (isGanji(ko, han)) { if (!ctx.ganji.has(ko)) continue; pats.push({ ko, tag: han, re: new RegExp(`(?<![가-힣])${ko}${GANJI_CONTEXT}`) }); continue; }
    // "~하는 편인 사람"의 편인(P3.6 오탐)·"정관념"은 용어가 아니다.
    const before = ko === "편인" ? "(?<![은는던한인운른큰진된간난] )" : "";
    pats.push({ ko, tag: han, re: new RegExp(`(?<![가-힣])${before}${ko}${AFTER}`) });
  }
  for (const [ko, code] of ctx.mbtiNames ?? []) pats.push({ ko, tag: code, re: new RegExp(ko.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) });
  // 긴 이름 먼저(천을귀인 > 귀인, 망신살 > 신살).
  return pats.sort((a, b) => b.ko.length - a.ko.length);
}

/** 장마다 용어의 첫 등장 뒤에 "(한자)"·"(약어)"를 붙인다. 이미 괄호가 붙어 있으면 그대로 둔다. 소제목·카드 줄에는 붙이지 않는다. */
export function annotateChapter(sections: readonly BookSection[], ctx: AnnotateCtx, pats = patternsOf(ctx)): { sections: BookSection[]; count: number } {
  const seen = new Set<string>(); let count = 0;
  const out = sections.map(s => ({ ...s, paragraphs: s.paragraphs.map(p => {
    let text = p;
    // 이미 다른 긴 용어 안에 든 자리(천을귀인 안의 귀인)는 건너뛰려고 붙인 자리를 기억한다.
    const taken: [number, number][] = [];
    for (const { ko, tag, re } of pats) {
      if (seen.has(ko)) continue;
      const m = re.exec(text); if (!m) continue;
      const at = m.index, end = at + ko.length;
      if (taken.some(([a, b]) => at < b && end > a)) continue;
      // 괄호 안(쉬운 이름 뒤 묶음 이름 "내 방식의 힘(비겁)", "나무 땔감(갑목)")에는 붙이지 않는다(겹친 괄호 방지).
      if (text.lastIndexOf("(", at) > text.lastIndexOf(")", at)) continue;
      seen.add(ko);
      if (text[end] === "(") continue;
      // AM 7부(세운 판독 56곳): 달 머리 줄 「신축월(辛丑月)은」의 「신축」에 또 붙여 「신축(辛丑)월(辛丑月)」이 됐다 — 바로 뒤가 「월(…月)」이면 이미 한자가 있다.
      if (/^월\([^)]*月\)/.test(text.slice(end))) continue;
      text = `${text.slice(0, end)}(${tag})${text.slice(end)}`; count++;
      const shift = tag.length + 2;
      for (const t of taken) if (t[0] >= end) { t[0] += shift; t[1] += shift; }
      taken.push([at, end + shift]);
    }
    return text;
  }) }));
  return { sections: out, count };
}
