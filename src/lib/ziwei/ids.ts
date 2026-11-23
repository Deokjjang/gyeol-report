/**
 * ZW-1 자미두수 id · 이름 · 계산 라이브러리 이름 매핑(순수 데이터, 클라이언트에서도 써도 된다).
 * - id는 한국어 로마자(zw:star:jami의 jami). 고객에게는 name(한글(한자))과 easy(쉬운 이름)만 보인다.
 * - ZH_*는 계산 라이브러리 출력(간체 중국어 이름) → id. 빠진 이름이 있으면 어댑터가 오류를 내고 시험이 실패한다.
 */

export const MAJOR_STARS = ["jami", "cheongi", "taeyang", "mugok", "cheondong", "yeomjeong", "cheonbu", "taeeum", "tamrang", "geomun", "cheonsang", "cheonryang", "chilsal", "pagun"] as const;
export const HELPER_STARS = ["jwabo", "ubil", "munchang", "mungok", "cheongoe", "cheonwol", "nokjon", "cheonma"] as const;
export const MALEFIC_STARS = ["gyeongyang", "tara", "hwaseong", "yeongseong", "jigong", "jigeop"] as const;
export const LOVE_STARS = ["hongnan", "cheonhui", "cheonyo", "hamji"] as const;
export type MajorStarId = (typeof MAJOR_STARS)[number];
export type HelperStarId = (typeof HELPER_STARS)[number];
export type MaleficStarId = (typeof MALEFIC_STARS)[number];
export type LoveStarId = (typeof LOVE_STARS)[number];
export type MinorStarId = HelperStarId | MaleficStarId;
export type StarId = MajorStarId | MinorStarId | LoveStarId;
export type StarKind = "major" | "helper" | "malefic" | "love";

export type StarName = { readonly ko: string; readonly hanja: string; readonly easy: string; readonly kind: StarKind };
/** 쉬운 이름은 0부 초안(덕짱 확인 2026-11-24). DB(src/data/knowledge-v5/ziwei)의 easyName이 같아야 한다(시험). */
export const STAR_NAMES: Readonly<Record<StarId, StarName>> = {
  jami: { ko: "자미", hanja: "紫微", easy: "이끄는 별", kind: "major" },
  cheongi: { ko: "천기", hanja: "天機", easy: "궁리하는 별", kind: "major" },
  taeyang: { ko: "태양", hanja: "太陽", easy: "비추는 별", kind: "major" },
  mugok: { ko: "무곡", hanja: "武曲", easy: "해내는 별", kind: "major" },
  cheondong: { ko: "천동", hanja: "天同", easy: "누리는 별", kind: "major" },
  yeomjeong: { ko: "염정", hanja: "廉貞", easy: "선 긋는 별", kind: "major" },
  cheonbu: { ko: "천부", hanja: "天府", easy: "지키는 별", kind: "major" },
  taeeum: { ko: "태음", hanja: "太陰", easy: "살피는 별", kind: "major" },
  tamrang: { ko: "탐랑", hanja: "貪狼", easy: "바라는 별", kind: "major" },
  geomun: { ko: "거문", hanja: "巨門", easy: "따지는 별", kind: "major" },
  cheonsang: { ko: "천상", hanja: "天相", easy: "돕는 별", kind: "major" },
  cheonryang: { ko: "천량", hanja: "天梁", easy: "감싸는 별", kind: "major" },
  chilsal: { ko: "칠살", hanja: "七殺", easy: "밀고 가는 별", kind: "major" },
  pagun: { ko: "파군", hanja: "破軍", easy: "새로 짜는 별", kind: "major" },
  jwabo: { ko: "좌보", hanja: "左輔", easy: "왼손 받침", kind: "helper" },
  ubil: { ko: "우필", hanja: "右弼", easy: "오른손 받침", kind: "helper" },
  munchang: { ko: "문창", hanja: "文昌", easy: "글 솜씨", kind: "helper" },
  mungok: { ko: "문곡", hanja: "文曲", easy: "말 솜씨", kind: "helper" },
  cheongoe: { ko: "천괴", hanja: "天魁", easy: "앞에서 끄는 손", kind: "helper" },
  cheonwol: { ko: "천월", hanja: "天鉞", easy: "뒤에서 미는 손", kind: "helper" },
  nokjon: { ko: "녹존", hanja: "祿存", easy: "모으는 힘", kind: "helper" },
  cheonma: { ko: "천마", hanja: "天馬", easy: "움직이는 힘", kind: "helper" },
  gyeongyang: { ko: "경양", hanja: "擎羊", easy: "곧은 뿔", kind: "malefic" },
  tara: { ko: "타라", hanja: "陀羅", easy: "도는 팽이", kind: "malefic" },
  hwaseong: { ko: "화성", hanja: "火星", easy: "확 붙는 불", kind: "malefic" },
  yeongseong: { ko: "영성", hanja: "鈴星", easy: "오래 타는 불", kind: "malefic" },
  jigong: { ko: "지공", hanja: "地空", easy: "비워 두는 별", kind: "malefic" },
  jigeop: { ko: "지겁", hanja: "地劫", easy: "덜어 내는 별", kind: "malefic" },
  hongnan: { ko: "홍란", hanja: "紅鸞", easy: "인연 신호", kind: "love" },
  cheonhui: { ko: "천희", hanja: "天喜", easy: "기쁜 소식", kind: "love" },
  cheonyo: { ko: "천요", hanja: "天姚", easy: "끌림의 별", kind: "love" },
  hamji: { ko: "함지", hanja: "咸池", easy: "설렘의 별", kind: "love" },
};

/** 12궁 순서: 명궁에서 시계 반대 방향(지지 번호가 하나씩 줄어드는 쪽)으로 형제궁 · 부처궁 …. */
export const PALACES = ["myeong", "hyeongje", "bucheo", "janyeo", "jaebaek", "jilaek", "cheoni", "nobok", "gwanrok", "jeontaek", "bokdeok", "bumo"] as const;
export type PalaceId = (typeof PALACES)[number];
export const PALACE_NAMES: Readonly<Record<PalaceId, { readonly ko: string; readonly hanja: string; readonly easy: string }>> = {
  myeong: { ko: "명궁", hanja: "命宮", easy: "나" },
  hyeongje: { ko: "형제궁", hanja: "兄弟宮", easy: "형제와 곁의 동료" },
  bucheo: { ko: "부처궁", hanja: "夫妻宮", easy: "짝" },
  janyeo: { ko: "자녀궁", hanja: "子女宮", easy: "내가 기르는 것" },
  jaebaek: { ko: "재백궁", hanja: "財帛宮", easy: "돈" },
  jilaek: { ko: "질액궁", hanja: "疾厄宮", easy: "컨디션 리듬" },
  cheoni: { ko: "천이궁", hanja: "遷移宮", easy: "바깥 무대" },
  nobok: { ko: "노복궁", hanja: "奴僕宮", easy: "어울리는 사람들" },
  gwanrok: { ko: "관록궁", hanja: "官祿宮", easy: "일" },
  jeontaek: { ko: "전택궁", hanja: "田宅宮", easy: "터전" },
  bokdeok: { ko: "복덕궁", hanja: "福德宮", easy: "마음 쉼터" },
  bumo: { ko: "부모궁", hanja: "父母宮", easy: "부모와 윗사람" },
};
export const BODY_PALACE_NAME = { ko: "신궁", hanja: "身宮", easy: "갈수록 드러나는 나" } as const;

export const MUTAGENS = ["rok", "gwon", "gwa", "gi"] as const;
export type MutagenId = (typeof MUTAGENS)[number];
export const MUTAGEN_NAMES: Readonly<Record<MutagenId, { readonly ko: string; readonly hanja: string; readonly easy: string }>> = {
  rok: { ko: "화록", hanja: "化祿", easy: "술술 풀림" },
  gwon: { ko: "화권", hanja: "化權", easy: "힘이 붙음" },
  gwa: { ko: "화과", hanja: "化科", easy: "이름이 남" },
  gi: { ko: "화기", hanja: "化忌", easy: "공들이는 칸" },
};

export const FIVE_CLASSES = ["water2", "wood3", "metal4", "earth5", "fire6"] as const;
export type FiveClassId = (typeof FIVE_CLASSES)[number];
export const FIVE_CLASS_INFO: Readonly<Record<FiveClassId, { readonly ko: string; readonly hanja: string; readonly number: 2 | 3 | 4 | 5 | 6 }>> = {
  water2: { ko: "수이국", hanja: "水二局", number: 2 },
  wood3: { ko: "목삼국", hanja: "木三局", number: 3 },
  metal4: { ko: "금사국", hanja: "金四局", number: 4 },
  earth5: { ko: "토오국", hanja: "土五局", number: 5 },
  fire6: { ko: "화육국", hanja: "火六局", number: 6 },
};

export const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;
export type Stem = (typeof STEMS)[number];
export type Branch = (typeof BRANCHES)[number];
export const STEM_KO: Readonly<Record<Stem, string>> = { 甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계" };
export const BRANCH_KO: Readonly<Record<Branch, string>> = { 子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해" };

/** 쌍성 24: 자미 · 무곡 · 염정 × 천부 · 탐랑 · 천상 · 칠살 · 파군, 천기 · 태양 · 천동 × 태음 · 거문 · 천량. id는 MAJOR_STARS 순서로 앞 별-뒤 별. */
const PAIR_HEADS_A = ["jami", "mugok", "yeomjeong"] as const;
const PAIR_TAILS_A = ["cheonbu", "tamrang", "cheonsang", "chilsal", "pagun"] as const;
const PAIR_HEADS_B = ["cheongi", "taeyang", "cheondong"] as const;
const PAIR_TAILS_B = ["taeeum", "geomun", "cheonryang"] as const;
export const pairIdOf = (a: MajorStarId, b: MajorStarId): string => {
  const [x, y] = MAJOR_STARS.indexOf(a) < MAJOR_STARS.indexOf(b) ? [a, b] : [b, a];
  return `${x}-${y}`;
};
export const STAR_PAIRS: readonly string[] = [
  ...PAIR_HEADS_A.flatMap(h => PAIR_TAILS_A.map(t => pairIdOf(h, t))),
  ...PAIR_HEADS_B.flatMap(h => PAIR_TAILS_B.map(t => pairIdOf(h, t))),
];

// ---------- 계산 라이브러리 출력(간체 중국어) → id ----------
export const ZH_STAR: Readonly<Record<string, StarId>> = {
  紫微: "jami", 天机: "cheongi", 太阳: "taeyang", 武曲: "mugok", 天同: "cheondong", 廉贞: "yeomjeong", 天府: "cheonbu",
  太阴: "taeeum", 贪狼: "tamrang", 巨门: "geomun", 天相: "cheonsang", 天梁: "cheonryang", 七杀: "chilsal", 破军: "pagun",
  左辅: "jwabo", 右弼: "ubil", 文昌: "munchang", 文曲: "mungok", 天魁: "cheongoe", 天钺: "cheonwol", 禄存: "nokjon", 天马: "cheonma",
  擎羊: "gyeongyang", 陀罗: "tara", 火星: "hwaseong", 铃星: "yeongseong", 地空: "jigong", 地劫: "jigeop",
  红鸾: "hongnan", 天喜: "cheonhui", 天姚: "cheonyo", 咸池: "hamji",
};
export const ZH_PALACE: Readonly<Record<string, PalaceId>> = {
  命宫: "myeong", 兄弟: "hyeongje", 夫妻: "bucheo", 子女: "janyeo", 财帛: "jaebaek", 疾厄: "jilaek",
  迁移: "cheoni", 仆役: "nobok", 官禄: "gwanrok", 田宅: "jeontaek", 福德: "bokdeok", 父母: "bumo",
};
export const ZH_MUTAGEN: Readonly<Record<string, MutagenId>> = { 禄: "rok", 权: "gwon", 科: "gwa", 忌: "gi" };
export const ZH_FIVE_CLASS: Readonly<Record<string, FiveClassId>> = { 水二局: "water2", 木三局: "wood3", 金四局: "metal4", 土五局: "earth5", 火六局: "fire6" };
export const ZH_BRIGHTNESS: Readonly<Record<string, Brightness7>> = { 庙: "묘", 旺: "왕", 得: "득", 利: "리", 平: "평", 不: "불", 陷: "함" };
/** 간체 천간 · 지지는 번체와 글자가 같다. */
export const ZH_STEM: Readonly<Record<string, Stem>> = Object.fromEntries(STEMS.map(s => [s, s]));
export const ZH_BRANCH: Readonly<Record<string, Branch>> = Object.fromEntries(BRANCHES.map(b => [b, b]));

export type Brightness7 = "묘" | "왕" | "득" | "리" | "평" | "불" | "함";
export type Brightness3 = "bright" | "normal" | "dark";
export const BRIGHTNESS3_OF: Readonly<Record<Brightness7, Brightness3>> = { 묘: "bright", 왕: "bright", 득: "normal", 리: "normal", 평: "normal", 불: "dark", 함: "dark" };
