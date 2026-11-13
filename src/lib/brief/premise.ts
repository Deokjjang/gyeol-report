/**
 * AM2-7 2부(덕짱님 지시 2026-11-13) — 입력 조건: 금지어에서 필요 입력으로(결정론, 호출 0).
 * 한 낱말표(PREMISE)가 「이 말을 쓰려면 고객 입력이 무엇이어야 하는지」를 정한다. 세운·대운의 씨앗 · 처방 종류 · 카드 영역 줄 · 화면 할 일 · 십성 뜻 문구 ·
 * 본문 검사(input_premise) · 입력 행렬 시험이 모두 이 표 하나를 쓴다. 모르는 입력은 「없음」으로 본다(사는 곳은 입력 칸이 없어 늘 없음).
 * - 조건이 맞지 않으면 정한 중립 꼴로 바꾸고(neutral), 중립 꼴이 없으면 그 마디를 뺀다.
 * - 정적 항목(MBTI 씨앗 · 처방 종류 · 화면 할 일)은 꼬리표 표(input-needs.json, 한 번에 전부 매김)에 없으면 쓰지 않는다(기본 거절, needsFor).
 * 4종 작가 입력은 이 파일을 쓰지 않는다(세운·대운 카드 · 화면 · 검사만).
 */
import NEEDS_TABLE from "@/data/knowledge-v5/input-needs.json";

/** 입력 축(덕짱님 지시 2부 1): 일 · 관계 · 자녀 · 사는 곳. */
export type InputJob = "employee" | "business" | "freelancer" | "student" | "seeker" | "resting" | "none";
export type InputRel = "single" | "dating" | "married" | "none";
export type Inputs = { readonly job: InputJob; readonly rel: InputRel; readonly children: "has" | "none"; readonly residence: "none"; readonly shop: boolean };
/** 필요한 입력. work = 돈을 버는 일이 있음(직장인 · 자영업 · 프리랜서). partner = 연애 중 · 기혼. */
export type Need = "job:employee" | "job:work" | "job:active" | "job:earn" | "job:business" | "job:shop" | "job:freelancer" | "job:student" | "job:study" | "rel:single" | "rel:dating" | "rel:married" | "rel:partner" | "children" | "residence" | "other";
export const NEEDS: readonly Need[] = ["job:employee", "job:work", "job:active", "job:earn", "job:business", "job:shop", "job:freelancer", "job:student", "job:study", "rel:single", "rel:dating", "rel:married", "rel:partner", "children", "residence", "other"];

type FactsLike = { readonly relationship: string; readonly children: string; readonly job: { readonly status: string; readonly class?: string; readonly detail?: string } };
const SHOP_DETAIL = /가게|매장|카페|식당|숍|샵|점포|장사|요식|판매|쇼핑몰/;
export function inputsOf(f: FactsLike): Inputs {
  const s = f.job.status;
  const job: InputJob = s === "employee" ? "employee" : /^(self_employed|business_owner)$/.test(s) ? "business" : s === "freelancer" ? "freelancer" : s === "student" || f.job.class === "student" ? "student" : s === "job_seeker" ? "seeker" : /^(unemployed|homemaker)$/.test(s) ? "resting" : "none";
  const rel: InputRel = f.relationship === "single" ? "single" : f.relationship === "dating" ? "dating" : f.relationship === "married" ? "married" : "none";
  return { job, rel, children: f.children === "has" ? "has" : "none", residence: "none", shop: job === "business" && SHOP_DETAIL.test(f.job.detail ?? "") };
}
export function needMet(n: Need, x: Inputs): boolean {
  switch (n) {
    case "job:employee": return x.job === "employee";
    case "job:work": return x.job === "employee" || x.job === "business" || x.job === "freelancer";
    case "job:active": return x.job !== "resting" && x.job !== "none";
    case "job:earn": return needMet("job:work", x) || x.job === "student";
    case "job:business": return x.job === "business";
    case "job:shop": return x.shop;
    case "job:freelancer": return x.job === "freelancer";
    case "job:student": return x.job === "student";
    case "job:study": return x.job === "student" || x.job === "seeker";
    case "rel:single": return x.rel === "single";
    case "rel:dating": return x.rel === "dating";
    case "rel:married": return x.rel === "married";
    case "rel:partner": return x.rel === "dating" || x.rel === "married";
    case "children": return x.children === "has";
    case "residence": case "other": return false;
  }
}

/** 중립 꼴: 입력 무리별 바꿀 말. null = 이 무리에서는 그 마디를 뺀다. */
type Neutral = { readonly work?: string | null; readonly other?: string | null; readonly dating?: string | null; readonly married?: string | null; readonly single?: string | null };
type Row = { readonly word: string; readonly re: RegExp; readonly need: Need; readonly neutral?: Neutral };
const r = (word: string, re: RegExp, need: Need, neutral?: Neutral): Row => ({ word, re, need, ...(neutral ? { neutral } : {}) });
/**
 * 낱말표(덕짱님 지시 2부 5 낱말 + P6 판독 차단 · 참고 + 전수 조사). 긴 말이 먼저(「월급날」 → 「월급」).
 * 「일」 「사람」 「친구」 「가족」 「집」 「모임」 「약속」 「돈」처럼 누구에게나 있는 말은 넣지 않는다.
 */
export const PREMISE: readonly Row[] = [
  // 일 — 직장인만
  r("월급날", /월급날/, "job:employee", { work: "수입이 들어오는 날", other: "돈이 들어오는 날" }),
  r("월급 밖 수입", /월급 밖(의)? (수입|돈|작은 기회|소소한 수입)/, "job:employee", { work: "본업 밖 수입", other: "뜻밖의 작은 수입" }),
  r("월급", /월급(?!날)/, "job:employee", { work: "수입", other: null }),
  r("연봉", /연봉|성과급|보너스|급여 명세서|야근 수당|퇴직연금|연말정산/, "job:employee"), r("승진", /승진/, "job:employee"), r("인사 평가", /인사 ?(평가|발령|팀)|평가 시즌|고과|성과 순위/, "job:employee"),
  r("직함", /직함|직급|직책/, "job:employee"), r("결재", /결재/, "job:employee"), r("사내", /사내(?![가-힣]{0,1}답)|탕비실|사원증/, "job:employee"), r("부서", /부서/, "job:employee"),
  r("팀장", /팀장|(?<![가-힣])부장|(?<![가-힣])과장(?! ?(문구|된|하|광고))|(?<![가-힣])차장|(?<![가-힣])대리(?![점운가-힣])|신입 사원|인턴|수습 (기간|사원)/, "job:employee"), r("야근", /야근|회식/, "job:employee"),
  r("막내", /(?<![가-힣])막내|(?<!동아리 )(?<!동호회 )신입(?!생)|(?<![가-힣])사수(?!하)|입사|(?<!운영 )(?<![가-힣])연차(?! ?(가|를|이) (쌓|늘))|반차/, "job:employee"),
  r("출근", /출근|퇴근|출퇴근/, "job:employee"), r("회사", /(?<![가-힣])회사(?!원|채)|직장(?!인)|사무실|공용 프린터/, "job:employee", { work: "일터", other: null }), r("직장인", /직장인|회사원/, "job:employee"),
  r("동료", /동료/, "job:work", { other: "주변 사람" }), r("윗사람", /윗사람|(?<![가-힣])상사|윗선|상급자/, "job:employee", { work: "함께 일하는 사람", other: "주변 사람" }),
  r("아랫사람", /아랫사람|부하 ?직원|후임/, "job:employee", { work: "함께 일하는 사람", other: "나보다 어린 사람" }),
  r("이직", /(?<!친구 )(?<!후배 )(?<!연인의 )이직|퇴사|헤드헌터|경력기술서|링크드인|직무 전환|사이드 프로젝트|겸업/, "job:employee"),
  // 일 — 돈을 버는 일이 있음
  r("회의", /(?<![가-힣])회의(?!적| 같은)|미팅|킥오프|브리핑|회의록/, "job:work"), r("거래처", /거래처|클라이언트|고객사|의뢰인|발주|납품|납기|외주|협력사|경쟁사|공급 업체|견적서?/, "job:work"),
  r("영업", /(?<![가-힣])영업(?! ?시간)|세일즈|(?<![가-힣])고객(?!센터| 입력|이 적은|이 적어)/, "job:work"), r("출장", /출장|외근|재택|인수인계|워크숍|워크샵/, "job:work"), r("업무", /업무/, "job:work", { work: "업무", other: "할 일" }),
  r("프로젝트", /프로젝트/, "job:work"), r("팀원", /팀원|팀 (회의|미팅)|팀 프로젝트|(?<![가-힣])팀 ?(분위기|목표|간식|합류|메신저|채팅|단톡방?|워크숍|빌딩|대항|사기)|옆 팀/, "job:work"),
  r("보고서", /(?<!지출 )(?<!분석 )보고서|기획서|제안서|주간 보고|보고 타이밍/, "job:work"), r("명함", /명함|네트워킹|협업 (툴|동료|상대)|업무 (메신저|채팅방)/, "job:work"),
  r("실적", /실적|성과 평가|분기 목표|지난 분기/, "job:work"), r("알바", /아르바이트|(?<![가-힣])알바/, "job:earn"), r("고정 수입", /고정 수입|(?<!비)정기 수입/, "job:work", { other: "들어오는 돈" }),
  r("단가", /(?<!건당 )(?<!장보기 )단가/, "job:work"),
  r("일터·사회생활", /일터·사회생활/, "job:work", { work: "일터·사회생활", other: "사회생활" }), r("일터", /일터/, "job:work", { work: "일터", other: "사회생활" }),
  r("거래 트기", /거래를 (트|틀|텄|엽|열|따|성사)/, "job:work"),
  // 일 — 자영업 · 가게 · 프리랜서
  r("가게", /가게 ?(문|매출|재고|진열|직원|신메뉴|이벤트|시스템|오픈|마감|운영|일정|청소|정리|사정)|(?<![가-힣])(내|우리) 가게|가게의 [^.?!]{0,12}(점검|정리|구석|장부|청소)|매장 (열|진열|직원|확장|공간)|셔터|진열대|오픈 준비|마감 정산/, "job:shop"),
  r("손님", /(?<![가-힣])손님(?! 맞)|단골 ?손님|단골 (만들|후기|대상)|단골이 좋아하/, "job:shop"), r("재고", /(?<!을 )(?<!를 )(?<!로 )(?<!서랍 )재고(?! ?(하|해))/, "job:shop"), r("장사", /장사/, "job:shop"),
  r("매출", /매출|사업장|사업자 ?(등록|통장)|부가세|종합소득세|세금계산서|임대료|임대차|권리금|소상공인|동업|지분|사업 (자금|비용)|내 사업|신메뉴/, "job:business"),
  r("직원", /(?<![가-힣])직원(?! ?(분|이 친절))/, "job:business"),
  r("의뢰", /의뢰(?!하)|일감|작업실/, "job:freelancer"),
  // 공부 · 구직
  r("학교", /학교|교내|강의실|교수님|학기|개강|종강|휴학|복학|학점|장학금|기숙사|수강신청|과제 제출|조별|조 모임|팀플|동아리|신입생|시험 기간|중간고사|기말고사|모의고사|담임|급식|교복|반 친구|등굣길|하굣길|시험지|성적표|학원/, "job:student"),
  r("시험", /시험(?! ?삼아| ?해 보| ?적)/, "job:study"), r("면접", /(?<!직원 )(?<!모의 )면접(?! 보는 친구)/, "job:study"), r("취업", /취업|구직|채용 공고|이력서|자기소개서|자소서|입사 지원|지원서|서류 전형|인적성|공채/, "job:study"), r("포트폴리오", /포트폴리오/, "job:active"),
  // 관계
  r("호감 가는 사람", /호감(이)? ?(가는|있는|가던|이 가는) 사람/, "rel:single", { dating: "연인", married: "배우자" }),
  r("좋아하는 사람", /(?<!영화 )좋아하는 사람|마음에 (드는|든|둔) 사람|마음(이)? 가는 사람|관심 가는 사람/, "rel:single", { dating: "연인", married: "배우자" }),
  r("호감", /호감/, "rel:single"), r("소개팅", /소개팅(?! 주선)|소개받|소개 자리|맞선|연애 앱|데이트 앱|데이팅|앱 프로필|연애 상대|이상형/, "rel:single"), r("썸", /(?<![가-힣])썸(?![가-힣])|썸 (상대|단계|타는)/, "rel:single"),
  r("새 인연", /새 인연|새로운 인연|인연이 생기|첫 만남|첫 데이트|처음 만난 날|첫 연락|짝사랑|고백|사귀기 전|사귀자는|처음 사귀|애프터|데이트 신청|프로필 사진|이별 ?(후|뒤)|헤어진 이유/, "rel:single"),
  r("연인", /연인|애인|남자친구|여자친구|남친|여친/, "rel:partner", { married: "배우자" }), r("데이트", /(?<!업)데이트(?! 신청| 앱)|커플|(?<!결혼)기념일|연애 중|둘만의|프러포즈|권태|동거/, "rel:partner"),
  r("배우자", /배우자(?! ?(자리|궁|별|복|운))|(?<![가-힣])(남편|아내|와이프|부부|시댁|처가|시부모|장인어른|장모님|신혼|결혼기념일|맞벌이)|결혼 생활/, "rel:married", { dating: "연인" }),
  // 자녀
  r("자녀", /(?<![가-힣])(아이|아들|딸)(가|를|와|랑|의|에게|는|도|들|이)?(?![가-힣])|자녀(?! ?(별|자리))|육아|어린이집|유치원|학부모|아이 ?방|등원|하원|키즈/, "children"),
  // 사는 곳(입력 칸 없음)
  r("자취", /자취|원룸|오피스텔|하숙|룸메이트|본가|부모님 ?집|분가|독립해 나|혼자 사는|같이 사는|이사 온|이사 (비용|견적)|이삿날|월세|전세|관리비|집주인|텅 빈 집|반상회|베란다|아파트/, "residence"),
  // 그 밖(입력 칸 없음 — 차 · 빚 · 주식 · 반려동물 · 하는 일 상세)
  r("운전", /운전|드라이브|세차|차량|자동차|차 안에서|차를 몰|주차장|자차|정비소/, "other"), r("대출", /대출|학자금/, "other"), r("주식", /주식/, "other"), r("반려동물", /반려견|반려묘|강아지 산책|고양이 밥|고양이나 식물/, "other"),
  r("직군 장면", /촬영 ?(현장|장)|코드 리뷰|버그|에러 로그|공사 현장|(?<![가-힣])도면|배송 동선|장애 (연락|호출)|연습실|수강생|시청자|투자자 앞|설치 기사|미용실 의자|팝업스토어 진열|전시회 부스|슬랙 채널|영상 편집 마감/, "other"),
];
export const PREMISE_VERSION = `premise-${PREMISE.length}-${PREMISE.reduce((h, x) => (h * 31 + [...`${x.word}|${x.re.source}|${x.need}`].reduce((a, ch) => (a * 33 + ch.charCodeAt(0)) >>> 0, 7)) >>> 0, 17).toString(36)}`;

/** 글에 든 전제 말과 그 필요 입력(조건 꼴 「…이라면」도 전제다 — 쓸 수 없는 말이면 조건으로도 쓰지 않는다). */
export function needsOf(text: string): { word: string; need: Need; at: number; len: number }[] {
  const out: { word: string; need: Need; at: number; len: number }[] = [], taken: [number, number][] = [];
  // 가운뎃점으로 이은 주제 이름 목록(장 제목 「일·취업·공부」 · 소제목 틀 「공부·시험·자격」)은 전제가 아니다(그 말이 든 목록 마디 전체가 명사 나열일 때).
  const lists: [number, number][] = [...text.matchAll(/[가-힣]{1,6}(?:·[가-힣]{1,6}){2,}/g)].map(m => [m.index!, m.index! + m[0].length]);
  for (const row of PREMISE) { const re = new RegExp(row.re.source, "g"); for (const m of text.matchAll(re)) { const a = m.index!, b = a + m[0].length; if (taken.some(([x, y]) => a < y && b > x)) continue; if (row.word !== "일터·사회생활" && lists.some(([x, y]) => a >= x && b <= y)) continue; taken.push([a, b]); out.push({ word: row.word, need: row.need, at: a, len: m[0].length }); } }
  return out.sort((p, q) => p.at - q.at);
}
/** 입력과 맞지 않는 전제 말(검사 · 행렬 시험). 고객이 적은 바람 원문(«…»)과 따옴표 대사 안은 보지 않는다. */
export function premiseHits(text: string, x: Inputs): { word: string; need: Need }[] {
  const t = text.replace(/«[^»]*»/g, " ");
  return needsOf(t).filter(h => !needMet(h.need, x)).map(h => ({ word: h.word, need: h.need }));
}
const groupOf = (x: Inputs, need: Need): keyof Neutral => (need.startsWith("rel:") ? (x.rel === "dating" ? "dating" : x.rel === "married" ? "married" : "single") : needMet("job:work", x) ? "work" : "other");
/** 받침에 맞춘 조사(바꾼 말 뒤). */
function josaAfter(word: string, rest: string): string {
  const last = word.replace(/[^가-힣]/g, "").slice(-1); if (!last) return rest;
  const code = last.charCodeAt(0) - 0xac00; if (code < 0 || code > 11171) return rest;
  const b = code % 28 !== 0, rieul = code % 28 === 8;
  const PAIRS: readonly [string, string][] = [["이라는", "라는"], ["이에요", "예요"], ["이었", "였"], ["이라", "라"], ["으로", "로"], ["과", "와"], ["은", "는"], ["이", "가"], ["을", "를"]];
  for (const [withB, noB] of PAIRS) { for (const cur of [withB, noB]) { if (rest.startsWith(cur) && (cur.length > 1 || /^.(?:[\s,.!?」』)]|$)/.test(rest))) { const want = withB === "으로" ? (b && !rieul ? "으로" : "로") : b ? withB : noB; return want + rest.slice(cur.length); } } }
  return rest;
}
/**
 * 입력에 맞춘 글: 맞지 않는 전제 말을 중립 꼴로 바꾼다. 중립 꼴이 없는 말이 하나라도 남으면 null(그 마디를 뺀다).
 * 같은 말이 중립 꼴과 겹치면(「업무」 → 직장인 「업무」) 그대로.
 */
export function neutralize(text: string, x: Inputs): string | null {
  const hits = needsOf(text.replace(/«[^»]*»/g, m => "\u0000".repeat(m.length))).filter(h => !needMet(h.need, x));
  if (!hits.length) return text;
  let out = text;
  for (const h of [...hits].reverse()) {
    const row = PREMISE.find(rw => rw.word === h.word)!, to = row.neutral?.[groupOf(x, h.need)];
    if (to === undefined || to === null) return null;
    const after = out.slice(h.at + h.len);
    out = `${out.slice(0, h.at)}${to}${josaAfter(to, after)}`;
  }
  return premiseHits(out, x).length ? null : out;
}
/** 「 · 」 마디 · 문장 단위로 맞추고, 맞출 수 없는 마디만 뺀다(카드 줄 · 화면 줄). */
export function fitSegments(text: string, x: Inputs, sep: RegExp = /(?<=[.!?])\s+| · /): string {
  const parts = text.split(sep).map(s => s.trim()).filter(Boolean);
  const joiner = / · /.test(text) ? " · " : " ";
  return parts.map(p => neutralize(p, x)).filter((p): p is string => Boolean(p)).join(joiner);
}

// ---------- 정적 항목 꼬리표 표(한 번에 전부 매김 · 없으면 거절) ----------
type Table = { readonly version: string; readonly premise: string; readonly items: Readonly<Record<string, readonly Need[]>> };
const TABLE = NEEDS_TABLE as unknown as Table;
/** 표 키: 출처 + 글(공백 · 부호 뺀 글의 해시). */
export function needsKey(source: string, text: string): string {
  const t = text.replace(/[^가-힣A-Za-z0-9]/g, "");
  let h = 2166136261; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return `${source}:${h.toString(36)}`;
}
/** 표의 꼬리표. 표에 없으면 null(쓰지 않는다). */
export function needsFor(source: string, text: string): readonly Need[] | null { return TABLE.items[needsKey(source, text)] ?? null; }
/** 정적 항목을 써도 되는가: 표에 있고, 필요 입력이 모두 맞는다. */
export function itemFits(source: string, text: string, x: Inputs): boolean { const n = needsFor(source, text); return Boolean(n) && n!.every(nd => needMet(nd, x)); }
export const needsTableInfo = () => ({ version: TABLE.version, premise: TABLE.premise, size: Object.keys(TABLE.items).length });

/**
 * 세운·대운 화면 줄(카드 할 일 · 돌아보기 · 살필 점 · 좋은 것 · 그림 · 열쇠말 · 십성 뜻)을 입력에 맞춘다(buildBrief, 시간표가 있는 책만 — 4종은 시간표가 없다).
 * 맞출 수 없는 줄은 마디째 빼고, 다 빠지면 그 칸을 비운다(할 일은 처방 배분이 먼저 맞는 문형을 고른다).
 */
type EntryLike = { todo?: string; review?: string; caution?: string; good?: string; imageLine: string; keywords: string[]; action: { text: string }; tenGod: { stem: string } };
type TimelineLike = { entries: EntryLike[]; tenGodNotes: Record<string, { meaning: string; caution?: string }> };
export function fitTimelineTexts(t: TimelineLike, x: Inputs, pad?: (e: EntryLike) => readonly string[]): number {
  let n = 0; const fit = (s: string | undefined) => { if (!s) return s; const o = fitSegments(s, x); if (o !== s) n++; return o || undefined; };
  for (const e of t.entries) {
    if (e.todo) { e.todo = fit(e.todo); if (e.todo) e.action = { ...e.action, text: e.todo }; }
    if (e.review) e.review = fit(e.review);
    if (e.caution) e.caution = fit(e.caution);
    if (e.good) e.good = fit(e.good);
    e.imageLine = fit(e.imageLine) ?? e.imageLine;
    // 열쇠말은 2개 이상이어야 한다(스키마) — 맞출 수 없는 말을 빼고 모자라면 그 십성 짧은 뜻(pad)으로 채운다.
    const kw = e.keywords.map(w => neutralize(w, x)).filter((w): w is string => Boolean(w));
    if (kw.join("|") !== e.keywords.join("|")) { n++; for (const w of pad?.(e) ?? []) if (kw.length < 2 && !kw.includes(w)) kw.push(w); if (kw.length >= 2) e.keywords.splice(0, e.keywords.length, ...kw); }
  }
  for (const v of Object.values(t.tenGodNotes)) { const m = fit(v.meaning); if (m !== undefined) v.meaning = m; else { v.meaning = ""; n++; } if (v.caution) { const c = fit(v.caution); if (c) v.caution = c; else delete v.caution; } }
  return n;
}
/** 중립 꼴이 있는 말만 바꾸고(빼지 않는다), 나머지는 그대로 — 작가에게 가는 카드 · 설계도 · 묶음 지시의 마지막 단계(구조 줄을 깨지 않게). */
export function soften(text: string, x: Inputs): string {
  const masked = text.replace(/«[^»]*»/g, m => "\u0000".repeat(m.length));
  let out = text;
  for (const h of needsOf(masked).filter(h2 => !needMet(h2.need, x)).reverse()) {
    const to = PREMISE.find(rw => rw.word === h.word)?.neutral?.[groupOf(x, h.need)];
    if (!to) continue;
    out = `${out.slice(0, h.at)}${to}${josaAfter(to, out.slice(h.at + h.len))}`;
  }
  return out;
}
