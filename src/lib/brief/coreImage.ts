/**
 * 핵심 이미지(P6b B-4): 일간 + 태어난 계절 + 강약 + 오행 분포(과다·결핍)로 한 줄을 결정론으로 합성한다.
 * 첫 장에서 한 번 소개하고 이후에는 필요할 때만 짧게 되짚는다. 규칙 표 문서: docs/v5/core-image-rules.md(이 파일에서 생성).
 * 규칙(위에서부터 첫 일치):
 *  R1 더위: 여름 태생 + 수(물) 없음·부족 → HOT
 *  R2 추위: 겨울 태생 + 화(불) 없음·부족 → COLD
 *  R3 과다: 가장 강한 오행이 "많음"이고 일간 오행이 아니면, 일간과의 관계(인성·식상·재성·관성)별 EXCESS
 *  R4 비겁 과다: 가장 강한 오행이 "많음"이고 일간 오행과 같으면 PEER
 *  R5 기본: 계절 자리(PLACE) + 강약 주인공(SUBJECT: 신강·중화·신약)
 * 그림 별명(지식 DB easyName)과 농촌·고전 소품은 쓰지 않는다(테스트로 고정).
 */
import type { ElementLevel } from "@/lib/saju/detections/elementBalance";
import type { FiveElement, HeavenlyStem } from "@/lib/saju/types";

export type Season = "spring" | "summer" | "autumn" | "winter";
export type StrengthClass = "strong" | "medium" | "weak";
type Relation = "resource" | "output" | "wealth" | "officer";
type StemImages = {
  readonly noun: string;
  readonly hot: string; readonly cold: string; readonly peer: string;
  readonly excess: Readonly<Record<Relation, string>>;
  readonly place: Readonly<Record<Season, string>>;
  readonly subject: Readonly<Record<StrengthClass, string>>;
};

export const CORE_IMAGES: Readonly<Record<HeavenlyStem, StemImages>> = {
  甲: { noun: "큰 나무", hot: "한여름 도시 아스팔트 위에 선 큰 나무", cold: "해 짧은 한겨울 빌딩 그늘에 선 큰 나무", peer: "빽빽한 숲 한가운데 선 큰 나무",
    excess: { resource: "넓은 대지에 뿌리 내린 오래된 고목", output: "햇볕을 받아 잎을 한껏 펼친 큰 나무", wealth: "넓은 공터를 홀로 지키는 큰 나무", officer: "공사장 철골 사이에 곧게 선 큰 나무" },
    place: { spring: "봄비 그친 공원에", summer: "한여름 가로수길에", autumn: "단풍 든 가을 산책로에", winter: "눈 쌓인 겨울 공원에" },
    subject: { strong: "굵게 뿌리 내린 큰 나무", medium: "곧게 선 큰 나무", weak: "막 자리를 잡은 어린 나무" } },
  乙: { noun: "덩굴", hot: "한여름 땡볕 아래 담벼락을 타는 덩굴", cold: "한겨울 창가에 놓인 작은 화초", peer: "담장을 빽빽하게 덮은 덩굴",
    excess: { resource: "물 넉넉한 개울가에 무성하게 자란 풀", output: "햇살 가득한 온실에서 꽃을 피운 화초", wealth: "넓은 화단을 혼자 덮어 가는 덩굴", officer: "철제 펜스를 감고 오르는 덩굴" },
    place: { spring: "봄볕 드는 베란다에", summer: "한여름 담장 위에", autumn: "가을바람 부는 화단에", winter: "겨울 창가 화분에" },
    subject: { strong: "힘차게 뻗은 덩굴", medium: "줄기를 뻗어 가는 화초", weak: "새로 싹을 낸 여린 화초" } },
  丙: { noun: "해", hot: "구름 한 점 없는 한여름 한낮의 해", cold: "한겨울 빌딩 사이로 짧게 드는 햇살", peer: "온 하늘을 달군 한낮의 해",
    excess: { resource: "울창한 숲 위로 높이 뜬 해", output: "넓은 운동장을 고루 데우는 햇살", wealth: "유리 빌딩에 부딪혀 번쩍이는 햇빛", officer: "비구름 사이로 얼굴을 내민 해" },
    place: { spring: "봄 하늘에", summer: "한여름 하늘에", autumn: "맑게 갠 가을 하늘에", winter: "한겨울 아침 하늘에" },
    subject: { strong: "높이 뜬 해", medium: "떠오르는 해", weak: "구름 사이로 비치는 해" } },
  丁: { noun: "불빛", hot: "열대야 도시를 밝힌 네온 불빛", cold: "한겨울 밤 골목을 밝히는 가로등", peer: "축제 밤거리를 채운 수많은 불빛",
    excess: { resource: "나무를 넉넉히 쌓은 캠프파이어 불꽃", output: "넓은 광장을 은은하게 밝히는 조명", wealth: "작업실에서 쇠를 다듬는 작은 용접 불꽃", officer: "빗속에서도 꺼지지 않는 캠핑 랜턴" },
    place: { spring: "봄밤 테라스에", summer: "여름밤 해변에", autumn: "가을밤 서재에", winter: "겨울밤 창가에" },
    subject: { strong: "환하게 밝혀 둔 조명", medium: "따뜻하게 켜진 스탠드 불빛", weak: "작게 흔들리는 초 불빛" } },
  戊: { noun: "큰 산", hot: "한여름 볕에 달궈진 바위산", cold: "눈 덮인 한겨울 바위산", peer: "겹겹이 이어진 산맥",
    excess: { resource: "햇볕을 듬뿍 받아 단단해진 큰 산", output: "속에 광맥을 품은 큰 산", wealth: "큰 호수를 품은 산", officer: "숲이 빽빽하게 덮은 큰 산" },
    place: { spring: "봄 안개가 걷힌 도시 곁에", summer: "한여름 초록 숲 너머에", autumn: "단풍 든 가을 하늘 아래", winter: "눈 내린 겨울 하늘 아래" },
    subject: { strong: "듬직하게 선 큰 산", medium: "우뚝 선 산", weak: "나지막이 이어진 언덕" } },
  己: { noun: "흙", hot: "한여름 볕에 바짝 마른 화단 흙", cold: "한겨울 꽁꽁 언 화단 흙", peer: "넓게 다져진 공원 흙길",
    excess: { resource: "햇볕에 따뜻하게 데워진 정원 흙", output: "광물을 품은 고운 흙", wealth: "물을 흠뻑 머금은 화분 흙", officer: "나무뿌리가 촘촘히 박힌 숲속 흙" },
    place: { spring: "봄비 지난 옥상 정원에", summer: "한여름 공원 화단에", autumn: "가을볕 드는 주말농장에", winter: "겨울 베란다 화분에" },
    subject: { strong: "넉넉히 쌓인 기름진 흙", medium: "고르게 다져진 흙", weak: "얇게 깔린 부드러운 흙" } },
  庚: { noun: "강철", hot: "한여름 볕에 달궈진 철골", cold: "한겨울 바람에 차갑게 식은 철교", peer: "철골이 겹겹이 선 공사 현장",
    excess: { resource: "바위 속에 묻힌 큰 원석", output: "빗물에 씻겨 반짝이는 강철 다리", wealth: "목재소에서 돌아가는 커다란 강철 톱날", officer: "용광로 불 속에서 달궈지는 쇳덩이" },
    place: { spring: "봄 햇살 아래", summer: "한여름 햇볕 아래", autumn: "맑은 가을 하늘 아래", winter: "찬 바람 부는 겨울 거리에" },
    subject: { strong: "단단히 버틴 강철 기둥", medium: "곧게 선 철제 기둥", weak: "아직 다듬기 전의 쇳덩이" } },
  辛: { noun: "보석", hot: "한여름 햇볕에 뜨겁게 달아오른 금속 장신구", cold: "한겨울 진열장 속에서 차갑게 빛나는 보석", peer: "보석이 가득 찬 진열장",
    excess: { resource: "흙 속에 깊이 묻힌 원석", output: "맑은 물에 씻겨 빛나는 보석", wealth: "원목 진열대 위에서 빛나는 보석", officer: "작업 조명 아래 세공 중인 보석" },
    place: { spring: "봄 햇살 드는 쇼윈도에", summer: "한여름 쇼윈도에", autumn: "가을 저녁 진열장에", winter: "겨울밤 진열장에" },
    subject: { strong: "선명하게 빛나는 보석", medium: "곱게 다듬어진 보석", weak: "작게 반짝이는 보석" } },
  壬: { noun: "큰 강", hot: "한여름 가뭄에 물이 줄어든 큰 강", cold: "한겨울 꽁꽁 언 큰 강", peer: "여러 물줄기가 모여 넓어진 바다",
    excess: { resource: "바위 계곡에서 끝없이 물이 흘러드는 큰 강", output: "강변 숲을 적시며 흐르는 큰 강", wealth: "노을을 받아 붉게 빛나는 큰 강", officer: "댐에 막혀 깊게 고인 큰 호수" },
    place: { spring: "봄비로 불어나 도시를 가로질러", summer: "한여름 도시 옆을", autumn: "가을 하늘을 비추며", winter: "겨울 빌딩 숲 사이로" },
    subject: { strong: "힘차게 흐르는 큰 강", medium: "유유히 흐르는 강", weak: "가늘게 이어지는 물줄기" } },
  癸: { noun: "빗물", hot: "한여름 아스팔트에 닿자마자 마르는 소나기", cold: "한겨울 유리창에 얼어붙은 물방울", peer: "그칠 줄 모르고 내리는 장맛비",
    excess: { resource: "철제 난간을 타고 맺히는 물방울", output: "여린 잎을 적시는 가랑비", wealth: "햇살 아래 반짝이며 흩어지는 물보라", officer: "흙에 스며들어 사라지는 빗물" },
    place: { spring: "봄 새벽 공원에", summer: "한여름 오후 거리에", autumn: "가을 아침 창가에", winter: "겨울 저녁 골목에" },
    subject: { strong: "쏟아지는 소나기", medium: "조용히 내리는 비", weak: "살짝 맺힌 이슬" } },
};

const STEM_ELEMENT: Readonly<Record<HeavenlyStem, FiveElement>> = { 甲: "WOOD", 乙: "WOOD", 丙: "FIRE", 丁: "FIRE", 戊: "EARTH", 己: "EARTH", 庚: "METAL", 辛: "METAL", 壬: "WATER", 癸: "WATER" };
const GENERATES: Readonly<Record<FiveElement, FiveElement>> = { WOOD: "FIRE", FIRE: "EARTH", EARTH: "METAL", METAL: "WATER", WATER: "WOOD" };
const CONTROLS: Readonly<Record<FiveElement, FiveElement>> = { WOOD: "EARTH", EARTH: "WATER", WATER: "FIRE", FIRE: "METAL", METAL: "WOOD" };
const LACK: readonly ElementLevel[] = ["없음", "부족"];

/** 일간에서 본 다른 오행의 관계. 같으면 null. */
function relationOf(day: FiveElement, other: FiveElement): Relation | null {
  if (day === other) return null;
  if (GENERATES[other] === day) return "resource";
  if (GENERATES[day] === other) return "output";
  if (CONTROLS[day] === other) return "wealth";
  return "officer";
}

export function strengthClass(level: string): StrengthClass {
  return level === "VERY_STRONG" || level === "STRONG" ? "strong" : level === "WEAK" || level === "VERY_WEAK" ? "weak" : "medium";
}

export type CoreImageInput = {
  readonly stem: HeavenlyStem; readonly season: Season; readonly strength: string;
  readonly levels: Readonly<Record<FiveElement, ElementLevel>>;
  readonly strongest: { readonly element: FiveElement; readonly level: ElementLevel };
};
export type CoreImage = { readonly line: string; readonly ruleId: string };

export function coreImage(i: CoreImageInput): CoreImage {
  const t = CORE_IMAGES[i.stem], day = STEM_ELEMENT[i.stem];
  if (i.season === "summer" && LACK.includes(i.levels.WATER)) return { line: t.hot, ruleId: `R1:${i.stem}:hot` };
  if (i.season === "winter" && LACK.includes(i.levels.FIRE)) return { line: t.cold, ruleId: `R2:${i.stem}:cold` };
  if (i.strongest.level === "많음") {
    const rel = relationOf(day, i.strongest.element);
    return rel ? { line: t.excess[rel], ruleId: `R3:${i.stem}:${rel}` } : { line: t.peer, ruleId: `R4:${i.stem}:peer` };
  }
  const s = strengthClass(i.strength);
  return { line: `${t.place[i.season]} ${t.subject[s]}`, ruleId: `R5:${i.stem}:${i.season}:${s}` };
}

/** 받침이 있으면 앞, 없으면 뒤. */
const josa = (word: string, pair: "이가" | "을를" | "와과") => {
  const c = word.charCodeAt(word.length - 1) - 0xac00;
  const has = c >= 0 && c <= 11171 && c % 28 !== 0;
  return word + ({ 이가: has ? "이" : "가", 을를: has ? "을" : "를", 와과: has ? "과" : "와" })[pair];
};
const GEN_VERB: Readonly<Record<FiveElement, string>> = { WOOD: "타오르게 돕는", FIRE: "따뜻하게 데워 주는", EARTH: "품어 키우는", METAL: "맑게 흘려보내는", WATER: "적셔 키우는" };
const CTRL_VERB: Readonly<Record<FiveElement, string>> = { WOOD: "뿌리로 붙잡아 주는", EARTH: "물길을 잡아 주는", WATER: "식혀 주는", FIRE: "달궈 다듬는", METAL: "다듬어 주는" };

/** 궁합 관계 이미지(pairImage): 두 일간 오행의 생극을 한 줄로. a·b는 각자의 핵심 이미지 줄. */
export function pairImage(a: { stem: HeavenlyStem; image: CoreImage }, b: { stem: HeavenlyStem; image: CoreImage }): { line: string; a: string; b: string; ruleId: string } {
  const ea = STEM_ELEMENT[a.stem], eb = STEM_ELEMENT[b.stem];
  const na = CORE_IMAGES[a.stem].noun, nb = CORE_IMAGES[b.stem].noun;
  let line: string, rule: string;
  if (ea === eb) { line = na === nb ? `${na} 둘이 나란히 서 있는 사이` : `${josa(na, "와과")} ${josa(nb, "이가")} 나란히 서 있는 사이`; rule = "same"; }
  else if (GENERATES[ea] === eb) { line = `${josa(na, "이가")} ${josa(nb, "을를")} ${GEN_VERB[ea]} 사이`; rule = "a-gen-b"; }
  else if (GENERATES[eb] === ea) { line = `${josa(nb, "이가")} ${josa(na, "을를")} ${GEN_VERB[eb]} 사이`; rule = "b-gen-a"; }
  else if (CONTROLS[ea] === eb) { line = `${josa(na, "이가")} ${josa(nb, "을를")} ${CTRL_VERB[ea]} 사이`; rule = "a-ctrl-b"; }
  else { line = `${josa(nb, "이가")} ${josa(na, "을를")} ${CTRL_VERB[eb]} 사이`; rule = "b-ctrl-a"; }
  return { line, a: a.image.line, b: b.image.line, ruleId: `P:${a.stem}${b.stem}:${rule}` };
}
