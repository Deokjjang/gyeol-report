/**
 * AM2-9 3부(덕짱님 결정 2026-11-16): 세운·대운의 차단은 네 갈래뿐 — 사실 · 잘못된 연결 · 모순 · 깨진 문장. 그 밖의 꼴은 모두 개선 대상(점수 · 기록만).
 *   사실       = 엔진(십성 · 관계 · 자리 · 대운 위치 · 월운) · 고객 입력과 다른 정보. 입력과 반대되는 전제(기혼에 새 인연 · 쉬는 중에 월급날). 입력이 비어 있을 뿐인 것은 아니다.
 *   잘못된 연결 = 근거가 잇지 않는 것을 이음(짝 범위 밖 명리×MBTI, MBTI 성향이 그 시기 운 때문에 생기거나 바뀐다고 씀). 그 시기에 그 성향이 쓰이는 장면은 아니다.
 *   모순       = 같은 책 다른 곳과 반대. 본문 검사는 없다(4종 contradiction 검사는 brief.design이 있는 책만) — 재료 단계(브리프 검사 · 4부 반대 쌍 정리)가 막는다.
 *   깨진 문장   = 문장이 서지 않음 · 고아 지시어.
 * 규칙 하나가 두 몫을 함께 잡는 것은 detail · 입력(입력함 / 미입력) · 그 자리의 짝으로 가르고, 가를 수 없는 것은 기록으로 둔다(내리면 오탐이 생기지 않는다).
 * 분류 근거: docs/v5/annual-major/rubric.md 2절(네 갈래 표 · 옛 꼴 id 대응표). 안전 규칙(확정 예언 · 건강 단정 · 이별 권유)은 덕짱님 답(11-16)대로 기록만 — 보고에 따로 적는다.
 */
import type { Brief } from "@/lib/brief/schema";
import { inputsOf, premiseHits } from "@/lib/brief/premise";
import type { Intake } from "./intake";

export type Branch = "fact" | "link" | "contra" | "broken";
export const BRANCH_KO: Readonly<Record<Branch, string>> = { fact: "사실", link: "잘못된 연결", contra: "모순", broken: "깨진 문장" };
type FlagLike = { readonly chapter: number; readonly section: number; readonly rule: string; readonly sentence: string; readonly detail?: string; readonly hint?: string };

/** 규칙째 네 갈래(나누지 않는 것). */
const WHOLE: Readonly<Record<string, Branch>> = {
  // 사실(R-B1 · R-B2 · R-B5 가운데 입력과 반대인 것)
  // group_claim · dayun_claim · dayun_order · fact_dayun · relation_scope는 전수 대조 오탐(「2028년 1월」을 해 기둥으로 읽음 · 창을 걸친 다음 대운 · 참인 부정 견줌)으로 기록(rubric.md 2-3).
  yinyang_claim: "fact", element_claim: "fact", element_count: "fact", dayun_year: "fact", dayun_soon: "fact",
  fact_ganji: "fact", fact_none: "fact", fact_term: "fact", fact_relation: "fact", fact_meaning: "fact", fact_season: "fact", fact_count: "fact",
  star_claim: "fact", ten_god_direction: "fact", negative_claim: "fact", pillar_claim: "fact", pillar_shape: "fact", glyph_list: "fact", sky_ground: "fact", key_tengod: "fact",
  seat_claim: "fact", seat_badge: "fact", intensity_claim: "fact", presumed_single: "fact", fn_role: "fact", mbti_absent: "fact", wish_absent: "fact",
  // 잘못된 연결(R-B6)
  owner_reverse: "link",
  // 깨진 문장(R-B3 · R-G13)
  // fragment · orphan_ref · orphan_deictic · rel_subject_time은 전수 대조 오탐(주제 생략 · 앞앞 문장 지시 · 안긴 절 주어)으로 기록(rubric.md 2-3).
  orphan_start: "broken", empty_preview: "broken", noun_predicate: "broken", subject_unit: "broken", relation_frame: "broken", grammar: "broken", pair_text: "broken",
  // AM2-10 4부(broken.ts): 깨진 갈래 좁힌 꼴 넷 + 짝 key 백업 연결 검사 — 저장 책 48권 전수 대조 걸림 19곳 모두 참 · 오탐 0(rubric.md 2-6).
  dayun_orphan: "broken", mbti_do_orphan: "broken", cut_clause: "broken", dup_phrase: "broken", bad_char: "broken", pair_outside: "link",
  // AM2-11 1부 6(claims.ts): 엔진 주장 대조 셋 — 저장 책 52권 전수 대조 걸림 4곳 모두 참 · 오탐 0(am2.md 21절).
  seat_ref: "fact", month_dir: "fact", flow_claim: "fact", prev_month: "fact", list_full: "fact",
  // AM2-12 2부(claims.ts): P9~P11 판독 엔진 틀림 가운데 놓친 꼴 — 저장 책 57권 전수 대조 걸림 참 18(year_dir 2 · list_shape 3 · status_claim 7 · verdict_dir 4 · month_dir 늘림 3 · list_full 늘림 2 · prev_month 늘림 1 — 겹침 셈) · 오탐 0(am2.md 22절).
  year_dir: "fact", list_shape: "fact", status_claim: "fact", verdict_dir: "fact",
  // AM2-13 1부(broken.ts memo_leak): 작성 메모 노출 — 저장 책 118권 전수 대조 참 7 · 오탐 0(am2.md 23절).
  memo_leak: "broken",
  // AM2-13 2부(S-final 측정 중 고침): 관계 없음 주장(claims.ts rel_none) · 「유형의 때」 깨진 꼴(broken.ts mbti_time) — 저장 책 전수 대조 am2.md 23절.
  rel_none: "fact", mbti_time: "broken",
  // AM2-13 5부(majorClaims.ts): 대운 9장 엔진 주장 — 저장 대운 책 42권 전수 대조 걸림 year_list 2 모두 참 · 오탐 0(am2.md 23절).
  chapter_title: "fact", fill_claim: "fact", dayun_timing: "fact", age_claim: "fact", prev_year: "fact", year_list: "fact",
};
/** AM2-14 2부: 장면을 사건으로 못 박지 않은 꼴 — 양보(…와도 · …때도 · …더라도) · 비유(…때처럼 · …처럼). 저장 대운 책 future_event 오탐 3곳의 꼴. */
const SCENE_HEDGE = /때도|때처럼|처럼|더라도|(?:와|어|아|여|해|져|워|러|서)도(?:,|\s)/;
/** 인과 · 변화 꼴(성향을 그 시기 운의 결과로 쓰는 말). 장면(「…할 때」 「…라면」)은 들지 않는다. */
/** 명리 말(십성 · 신살 · 일주 · 간지 · 합충 · 대운 · 기운) — 짝 없는 절이 이것과 한 문장에 묶일 때만 잘못된 연결(성향만 말하고 조언하는 절은 아니다). */
const SAJU_TERM = /(비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인|도화살|홍염살|역마살|화개살|귀문관살|백호대살|괴강살|양인살|원진살|일주|대운|세운|월운|기운|반합|삼합|육합|천간합|(?<![가-힣])[갑을병정무기경신임계][자축인묘진사오미신유술해](?=일주|월|년|대운|의 |과 |와 |이 |가 |은 |는 )|[자축인묘진사오미신유술해]{2}[충형파합])/;
/** 입력 전제(사실) 가운데 차단으로 남기는 낱말 — 저장 책 40권 전수 대조(AM2-9 3부)에서 오탐 0 · 참 1 이상인 것만, 본 입력 무리에만. 나머지 낱말은 기록. */
const PREMISE_JOB_FOUR: ReadonlySet<string> = new Set(["거래처", "영업", "출장", "회의"]); // 쉬는 중 · 구직 중에게 일터 장면
const PREMISE_REL_FOUR: ReadonlySet<string> = new Set(["호감 가는 사람", "소개팅"]); // 연애 중 · 기혼에게 연애 시작 장면
/** key_value 견줌 꼴: 앞·다른 key 값을 그 key 것으로 견준다. */
const KEY_COMPARE = /(에서 [가-힣]+(으로|로) (바뀌|내려|올라|넘어)|(?<![가-힣])앞의 |앞선 |[과와] 달리|이었다면|였다면|같은 결)/;
const monthsIn = (s: string) => { const g = new Set(s.match(/[갑을병정무기경신임계][자축인묘진사오미신유술해]월/g) ?? []); return g.size || new Set(s.match(/(?<![0-9])\d{1,2}월/g) ?? []).size; };
/** 대운 위치 말 가운데 엔진 위치(N번째 해)에 맞는 말 — 문장에 맞는 위치 말이 함께 있으면(「한가운데로 들어서는 앞쪽」) 틀린 주장이 아니다. */
const POSITION_FITS: readonly (readonly [RegExp, (n: number) => boolean])[] = [[/앞쪽|초반/, n => n <= 3], [/한가운데|중반/, n => n >= 4 && n <= 7], [/끝 무렵|막바지|끝자락|후반/, n => n >= 8], [/첫해/, n => n === 1], [/마지막 해/, n => n === 10]];
const LINK_CAUSAL = /(이라서|라서|이라 |이라,|이니까|이니 |니까|기 때문|때문에|덕분에|탓에|그래서|그만큼|만큼|일수록|와 만나|과 만나|를 만나|을 만나|가 더해|이 더해|겹쳐|바뀌|달라지|생겨나|커지|자라나)/;

export type FourCtx = {
  /** 입력함(true) / 미입력(false) — 축마다. */
  readonly entered: { readonly job: boolean; readonly rel: boolean; readonly children: boolean };
  readonly relationship: string;
  readonly inputs: ReturnType<typeof inputsOf>;
  readonly mbtiType: string | null;
  /** 그 자리(달·해 key 또는 소제목)에 짝이 있나. */
  readonly pairedAt: (chapter: number, section: number) => boolean;
  /** AM2-14 2부: 상품(대운만 거는 갈래 — future_event 장면 씨앗). */
  readonly product?: string;
};
export function fourCtxOf(brief: Brief, intake: Intake, headingOf: (chapter: number, section: number) => string): FourCtx {
  const f = brief.person.facts;
  const job = f.job?.status ?? "";
  const keys = new Map(intake.chapters.flatMap(c => (c.keys ?? []).map(k => [`${c.n}|${k.key}`, Boolean(k.pair)] as const)));
  const secs = new Map(intake.chapters.flatMap(c => (c.sections ?? []).map((sp, si) => [`${c.n}|${si}`, intake.pairs.some(p => sp.lines.includes(p.myeongri) && sp.lines.includes(p.mbti))] as const)));
  return {
    entered: { job: Boolean(job) && job !== "unknown", rel: f.relationship !== "unknown", children: f.children !== "unknown" },
    relationship: f.relationship, inputs: inputsOf(f), mbtiType: brief.mbti?.type ?? null, product: brief.product,
    pairedAt: (chapter, section) => { const h = headingOf(chapter, section); return keys.get(`${chapter}|${h}`) ?? secs.get(`${chapter}|${section}`) ?? false; },
  };
}

/** 깃발 하나의 갈래(네 갈래가 아니면 null = 개선 대상 · 기록만). */
export function branchOf(f: FlagLike, c: FourCtx): Branch | null {
  const w = WHOLE[f.rule]; if (w) return w;
  const d = f.detail ?? "", s = f.sentence, mbti = c.mbtiType ? new RegExp(c.mbtiType) : null;
  switch (f.rule) {
    case "fact_strength": return /다른 저울/.test(d) ? null : "fact";
    case "key_value": {
      if (/장면 씨앗|흐름 숫자|\)의 [^ ]+ 뜻\(/.test(d)) return null;
      if (/\)의 [^()]*자리와 [^ ]+ 뜻\(/.test(d)) return null; // 관계 뜻(충 = 부딪쳐 바꿀 계기)은 같은 관계 종류가 함께 쓴다 — 다른 key에서 빌린 증거가 아니다
      return KEY_COMPARE.test(s) ? null : "fact"; // 앞 key와 견줌(「앞의 을경합이 …였다면」 「느림에서 거셈으로」)은 그 key 값을 이 key 것으로 쓴 것이 아니다
    }
    case "month_list": return monthsIn(s) >= 2 ? "fact" : null; // 목록 = 달 둘 이상(한 달과 자리를 견준 문장은 목록이 아니다)
    case "dayun_position": { const n = Number(/≠ (\d+)번째 해/.exec(d)?.[1] ?? NaN); return Number.isFinite(n) && POSITION_FITS.some(([re, ok]) => re.test(s) && ok(n)) ? null : "fact"; }
    case "count_mismatch": return d ? "fact" : null; // 수 지시어(detail 없음)는 전수 대조 오탐 8/8 — 기록
    // presumed_partner · future_assert · degree: 전수 대조 오탐(바람 되풀이 · 「연인이 없어도」 · 「가장 큰 쪽」 = 맨 위 칸) — 기록
    case "school_scene": return c.entered.job ? "fact" : null;
    case "input_premise": return premiseHits(s, c.inputs).some(h => (PREMISE_JOB_FOUR.has(h.word) && c.entered.job && (c.inputs.job === "resting" || c.inputs.job === "seeker"))
      || (PREMISE_REL_FOUR.has(h.word) && (c.inputs.rel === "dating" || c.inputs.rel === "married"))) ? "fact" : null;
    case "safety": {
      if (/^(hour_pillar|mbti_absent|stage_glyph)/.test(d)) return "fact";
      const m = /^fact_(spouse|partner|children|job)/.exec(d);
      if (m) return (m[1] === "job" ? c.entered.job : m[1] === "children" ? c.entered.children : c.entered.rel) ? "fact" : null;
      return null; // 확정 예언 · 건강 단정 · 이별 권유 · 내부 말 — 기록만(덕짱님 답 11-16)
    }
    case "evidence_owner": return /MBTI 주어로/.test(d) ? "link" : null;
    case "mbti_trait": return / \/ |^성장 곡선 말|쪽이라$/.test(d) ? null : "link"; // 「당신은 …쪽이라」(유형 이름 없는 장면 · 십성 뜻)는 기록
    case "pair_link": {
      if (/앞 문장/.test(d)) return "link";
      if (/이웃/.test(d)) return mbti?.test(s) || /유형|성향|성격|기질/.test(s) ? "link" : null; // 이웃 문장 잇기는 이 문장이 성향을 말할 때만
      if (/그 해의 성질로/.test(d)) return mbti?.test(s) || /성향|성격|기질/.test(s) ? "link" : null;
      return LINK_CAUSAL.test(s) ? "link" : null;
    }
    case "pair_scope": return null; // 짝의 까닭 안 잇기와 밖 잇기를 가르지 못함(전수 대조 1/3) — 기록
    // AM2-14 2부(덕짱님 결정 4 — D1 D3 2035 「…원서를 내고, 마감 전날 밤을 새웁니다」): 대운 앞날 key의 장면 씨앗을 그때의 사건으로 옮긴 문장.
    // 저장 대운 47권 전수 대조 걸림 9 = 참 2 · 오탐 7(「~기 좋음」 갈래 4 · 양보 · 조건 · 비유 꼴 3) → 이 좁힌 꼴(장면 갈래 · 대운 · SCENE_HEDGE 없음)만 사실로 차단(참 2 · 오탐 0). 그 밖 · 세운은 기록.
    case "future_event": return c.product === "major_fortune" && /장면 씨앗을 그때의 사건으로 단정/.test(d) && !SCENE_HEDGE.test(s) ? "fact" : null;
    case "pair_causal": return c.pairedAt(f.chapter, f.section) ? null : "link";
    case "pair_clause": return LINK_CAUSAL.test(s) && SAJU_TERM.test(s) ? "link" : null;
    default: return null;
  }
}
/** 브리프 검사(작가 호출 전) 이슈 가운데 네 갈래 — 이것만 작가를 부르지 않는 까닭이 된다. 나머지는 기록. */
export const BRIEF_FOUR: Readonly<Record<string, Branch>> = { card_engine: "fact", yinyang: "fact", tie: "fact", mbti_absent: "fact", pair_section: "link", rest_conflict: "contra", wish_conflict: "contra", wish_chip: "fact", link_seat: "fact" };
export const briefBranchOf = (rule: string): Branch | null => BRIEF_FOUR[rule] ?? null;
