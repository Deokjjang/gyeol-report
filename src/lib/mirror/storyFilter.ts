/**
 * 이야기 · 카드 한마디 거르기(브라우저 · 서버 공용, SPEC 「걸러내기」). 보내기 전에 잡아 고치게 하고, 서버가 같은 함수로 한 번 더 본다.
 * 저장소에 기존 욕설 · 개인정보 필터가 없어 새로 둔다(계정 쪽 src/lib/account/contact.ts는 입력칸 형식 검사라 글 속 탐지에는 쓰지 않는다).
 * 원칙: 친구 이야기에 흔한 말("미친 듯이 웃었다", "시발점")은 막지 않고, 욕설 · 비하 · 연락처 · 계좌 · 주소 · 이메일 · 주민번호만 잡는다.
 */

export type StoryProblem = { code: "abuse" | "phone" | "account" | "email" | "address" | "rrn"; message: string };

const MESSAGES: Readonly<Record<StoryProblem["code"], string>> = {
  abuse: "다른 사람이 상처받을 수 있는 말이 있어요. 고운 말로 바꿔 주세요.",
  phone: "전화번호는 빼 주세요. 이야기가 「모두의 이야기」에 올라갈 수도 있어요.",
  account: "계좌번호처럼 보이는 숫자는 빼 주세요.",
  email: "이메일 주소는 빼 주세요.",
  address: "사는 곳 주소는 빼 주세요.",
  rrn: "주민등록번호처럼 보이는 숫자는 빼 주세요.",
};

/** 욕설 · 비하(공백 · 기호 · 숫자를 지운 글자열에서 찾는다). 흔한 말과 겹치는 낱말은 넣지 않는다. */
const ABUSE = [
  "씨발", "시발", "씨빨", "시빨", "씨바", "시바새", "씨팔", "시팔", "ㅅㅂ", "ㅆㅂ", "ㅅㅂㄹㅁ", "병신", "븅신", "빙신", "ㅂㅅ", "좆", "존나", "졸라", "ㅈㄴ",
  "개새끼", "개새기", "개색기", "개색히", "개세끼", "새끼야", "ㅅㄲ", "지랄", "ㅈㄹ", "닥쳐", "엿먹", "꺼져라", "썅", "쌍놈", "쌍년", "미친놈", "미친년", "또라이", "돌아이",
  "니애미", "느금마", "느금", "니미", "애미", "애비없", "엠창", "앰창", "창녀", "걸레년", "찐따", "한남충", "한남", "김치녀", "된장녀", "틀딱", "급식충", "맘충", "애자", "장애새끼",
  "꼴통", "등신", "멍청한년", "멍청한놈", "죽어버려", "뒤져", "뒈져", "자살해",
];
/** 낱말 속에 욕설 글자가 우연히 들어가는 흔한 말(먼저 지운다). */
const SAFE = ["시발점", "시발역", "시바견", "시바이누", "한남동", "한남대교", "한남역", "애자일", "등신대", "니미츠"];

const stripForAbuse = (text: string) => {
  let t = text.toLowerCase();
  for (const w of SAFE) t = t.split(w).join(" ");
  return t.replace(/[\s\p{P}\p{S}0-9a-z]/gu, "");
};

/** 하이픈으로 이은 숫자 묶음(계좌 꼴) 또는 11자리 이상 이어진 숫자. 날짜(2026.11.27)는 점이라 잡지 않는다. */
const DIGITS = /\d{2,6}\s?[-–]\s?\d{2,6}\s?[-–]\s?\d{2,8}(?:\s?[-–]\s?\d{1,6})?|\d{11,}/g;
const EMAIL = /[A-Za-z0-9._%+-]+\s?@\s?[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/;
const RRN = /\d{6}\s?[-–]\s?[1-4]\d{6}/;
const PHONE = /(?<!\d)(?:\+?82[\s.-]?)?0?1[016789][\s.\-]?\d{3,4}[\s.\-]?\d{4}|0(?:2|[3-6][1-5])[\s.\-]\d{3,4}[\s.\-]\d{4}|공일공\s?[-–]?/;
/** 도로명 · 지번 · 동호수 주소. 「○○로 12」 「○○길 3-4」 「○○동 123-4」 「101동 1203호」. */
const UNIT = "(?!\\s?(?:번|시|분|초|명|개|살|년|월|일|주|층|등|차|판|잔|권|줄|배|위|점|퍼|%|km|kg|cm))";
const ADDRESS = new RegExp([
  `[가-힣]{1,10}(?:로|길)\\s?\\d{1,4}(?:\\s?[-–]\\s?\\d{1,4})?(?:번길)?${UNIT}(?=\\s|$|[,.)])`,
  "\\d{1,4}\\s?동\\s?\\d{1,5}\\s?호",
  "[가-힣]{1,8}(?:동|읍|면)\\s?\\d{1,5}\\s?[-–]\\s?\\d{1,5}",
  "[가-힣]{1,8}(?:동|읍|면|리)\\s?\\d{1,5}\\s?번지",
  "(?:아파트|빌라|오피스텔)\\s?\\d{1,4}\\s?동",
].join("|"));
/** 계좌: 은행 이름 + 숫자, 또는 하이픈으로 이어진 긴 숫자(10자리 이상). */
const BANKS = /(?:국민|신한|우리|하나|농협|기업|카카오뱅크|카뱅|토스뱅크|케이뱅크|새마을|우체국|수협|부산|대구|광주|전북|경남|제주|씨티|sc제일|산업)(?:은행)?\s?[\d\s-]{8,}/i;

export function storyProblem(text: string): StoryProblem | null {
  const t = text.normalize("NFC");
  const flat = stripForAbuse(t);
  if (ABUSE.some(w => flat.includes(w))) return { code: "abuse", message: MESSAGES.abuse };
  if (EMAIL.test(t)) return { code: "email", message: MESSAGES.email };
  if (RRN.test(t)) return { code: "rrn", message: MESSAGES.rrn };
  if (PHONE.test(t)) return { code: "phone", message: MESSAGES.phone };
  if (BANKS.test(t) || /계좌/.test(t) && /\d{4,}/.test(t)) return { code: "account", message: MESSAGES.account };
  for (const m of t.match(DIGITS) ?? []) if (m.replace(/\D/g, "").length >= 10) return { code: "account", message: MESSAGES.account };
  if (ADDRESS.test(t)) return { code: "address", message: MESSAGES.address };
  return null;
}

/** 이야기 본문 정리: 앞뒤 공백 · 제어 문자 · 꺾쇠를 지우고 줄바꿈은 두 줄까지만. */
export const normalizeStory = (value: string): string =>
  value.normalize("NFC").replace(/[\u0000-\u0009\u000b-\u001f\u007f<>]/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
/** 카드 한마디 정리(한 줄, 20자). */
export const normalizeLine = (value: string): string => value.normalize("NFC").replace(/[\u0000-\u001f\u007f<>]/g, "").replace(/\s+/g, " ").trim();
export const charCount = (value: string): number => [...value].length;
