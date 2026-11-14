/**
 * W3 P3 4절 — 노출 금지(결정론·호출 0). 본문에 나오면 안 되는 두 종류:
 *  - grade: 엔진 판정 등급어(신약·신강·중화·「(오행) 과다」·「세기는 … 약/보통/강」·「힘은 약/보통/강이에요」·「규칙의 힘(관성) 강」).
 *    뜻 문장(「혼자 버티는 힘이 여린 편」「흙 기운이 많은 편」)으로만 쓴다. 형용사 꼴(「세기가 강해요」「힘은 약하고」)은 쉬운 말이라 잡지 않는다.
 *  - rule: 책을 만든 규칙·입력 상태·기준일(「시간 미상이 아니라」「입력된 게 없으니」「가정으로만」「…를 기준으로 썼어요」「기준일」).
 * lintBook이 HARD(grade_leak·rule_leak)로 수리에 보내고, 수리 뒤에도 남으면 그 문장을 지운다. 정보량 지표(info.ts)의 exposure도 이 함수로 센다.
 * 오탐 확인(2026-11-14, 저장소 원고 15권·운영 v5 23권): 「과다 지출」「지난 경험을 기준으로 삼는」「힘은 약속을」「세기는 무엇을 더할까」는 잡지 않는다.
 */
export type ExposureKind = "grade" | "rule";
export type ExposureHit = { readonly kind: ExposureKind; readonly id: string; readonly text: string };

const EL = "목|화|토|금|수|나무|불|흙|쇠|물|비겁|식상|재성|관성|인성|비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인|오행|기운";
const GROUP = "비겁|식상|재성|관성|인성";
/** 명사 꼴 등급어 뒤에 오는 말(이에요·입니다·이라·으로·쉼표·끝). 「강해·약한」 같은 형용사는 뺀다. */
const NOUN_END = "(?=이에요|입니다|이고|이라|이며|이니|이어서|이어도|이지만|인데|으로|,|\\.|\\)|·|\\s(쪽|단계|수준|편|사주|상태)|$)";
export const GRADE_RULES: readonly (readonly [string, RegExp])[] = [
  // 신약·신강(「매우 신약한」「신강이에요」「신강한 쪽」). 「신약성경」「신약 개발」은 뺀다.
  ["strength_label", /(?<![가-힣])(?:매우 |아주 |조금 )?(?:신약|신강)(?!성경|성서|개발|품)/],
  // 중화(일간 강약 판정 이름). 「중화요리」「중화권」「중화시키다」는 뒤 글자로 뺀다.
  ["balanced_label", /(?<![가-힣])중화(?=이에요|입니다|예요|이고|라서|라|이라|는|은|의|,|\.|\)|\s(쪽|사주|상태|단계|에 가까)|$)/],
  // 「목 과다」「수가 과다한」「비겁 과다는」「화 과다의」(오행·십성 이름 + 과다). 「지출 과다」「과다 섭취」는 오행 이름이 없어 뺀다.
  ["excess_label", new RegExp(`(?<![가-힣])(?:${EL})(?:\\([^)]{1,8}\\))?(?:이|가|은|는|의)? ?(?:기운(?:이|의)? )?과다`)],
  // 「세기는 보통이에요」「세기가 매우 신약이라」「관성 세기 보통」(세기 + 등급 명사).
  ["segi_label", new RegExp(`세기(?:는|가|도)? (?:[가-힣]{1,6} ){0,2}?(?:매우 |아주 |조금 )?(?:약|보통|강)${NOUN_END}`)],
  // 「값을 받는 힘은 보통이고」「규칙의 힘은 약입니다」「힘은 강이에요」(힘 + 등급 명사). 「힘은 약속을」「힘은 강하고」는 뺀다.
  ["him_label", new RegExp(`힘(?:은|이|도) (?:매우 |아주 |조금 )?(?:약|보통|강)${NOUN_END}`)],
  // 묶음 단계 표기「규칙의 힘(관성) 강」「관성 강」(브리프 groups.line 꼴).
  ["group_label", new RegExp(`(?:(?<![가-힣])(?:${GROUP})|힘\\((?:${GROUP})\\)) (?:약|보통|강)(?=[,.·)]|\\s|$)`)],
];
export const RULE_RULES: readonly (readonly [string, RegExp])[] = [
  // 입력 상태 라벨(「시간 미상이 아니라」「태어난 시각 미상이라」).
  ["time_unknown", /시(?:간|각) ?미상/],
  // 「자녀는 아직 입력된 게 없으니」「입력하신 정보에 직업이 없어」「입력이 없으니」.
  ["input_state", /(?<![가-힣])(?<!데이터 |자료 |숫자 |정보 )입력(?:이|된|하신|한|해 주신|에|된 게|된 것이|하지)?\s?[^.?!]{0,14}?(?:없(?:어|으니|으므로|어서|는|고|습니다|네요|다)|않(?:아|았|은|으니|으셨))/],
  // 「…가정으로만 그려 볼게요」「가정 아래에서만」.
  ["assume_only", /가정(?:으로만|해서만|하고만| 아래에서만| 아래서만)/],
  // 「2026년 11월 13일을 기준으로 썼어요」「…를 기준으로 봤어요」(만든 기준 말). 「지난 경험을 기준으로 삼는」은 뺀다.
  ["based_on", /(?:을|를) 기준으로 (?:썼|봤|보았|살펴봤|살폈|읽었|풀었|정리했|계산했|잡았|적었)/],
  // 「기준일」「기준 날짜」「11월 13일을 기준으로」「이 책은 … 기준」.
  ["base_date", /기준일|기준 ?날짜|\d{1,2}월 \d{1,2}일(?:을|를)? ?기준|이 책은 [^.?!]{0,24}기준(?:으로|이)/],
];

/** 한 문장의 노출(없으면 빈 목록). 같은 규칙은 한 번만 센다. */
export function exposureHits(sentence: string): ExposureHit[] {
  const s = sentence.replace(/[⟪⟫]/g, "");
  const out: ExposureHit[] = [];
  for (const [id, re] of GRADE_RULES) { const m = s.match(re); if (m) out.push({ kind: "grade", id, text: m[0] }); }
  for (const [id, re] of RULE_RULES) { const m = s.match(re); if (m) out.push({ kind: "rule", id, text: m[0] }); }
  return out;
}
/** 문장의 첫 노출 종류(lint 규칙 고르기). */
export function exposureOf(sentence: string): ExposureHit | null { return exposureHits(sentence)[0] ?? null; }

/** 일간 강약 등급(엔진 level) → 뜻 말(등급 이름 없이). 결정론 작가·안전망 문장이 쓴다(p6e plainWords와 같은 말). */
const PLAIN_STRENGTH: Readonly<Record<string, string>> = {
  VERY_WEAK: "혼자 버티는 힘이 아주 여린 편", WEAK: "혼자 버티는 힘이 여린 편", BALANCED: "세지도 여리지도 않은 가운데",
  STRONG: "스스로 밀고 나가는 힘이 센 편", VERY_STRONG: "스스로 밀고 나가는 힘이 아주 센 편",
};
export const plainStrength = (level: string): string => PLAIN_STRENGTH[level] ?? PLAIN_STRENGTH.BALANCED;
