/**
 * P6e 7 한자 표준 시험: 렌더 단계 용어 사전(writer/render.ts termDictionary)을 손으로 적은 표준 표기표와 전수 대조한다.
 * 사전의 모든 항목이 표준표에 있어야 하고 한자가 같아야 한다(오기 "편인(偏人)"류가 사전에 들어오면 여기서 깨진다).
 * 신살의 "살"은 표준 이체자 殺·煞을 모두 허용한다. 한 이름이 두 한자로 갈리는 "신금"(申金·辛金)은 사전에 넣지 않는다.
 */
import { describe, expect, it } from "vitest";
import { loadKnowledge } from "@/lib/brief";
import { annotateChapter, termDictionary } from "@/lib/writer/render";

const STEMS = "갑을병정무기경신임계", STEM_HAN = "甲乙丙丁戊己庚辛壬癸";
const BRANCHES = "자축인묘진사오미신유술해", BRANCH_HAN = "子丑寅卯辰巳午未申酉戌亥";
const EL: Record<string, string> = { 목: "木", 화: "火", 토: "土", 금: "金", 수: "水" };
const STEM_EL = "목목화화토토금금수수", BRANCH_EL = "수토목목토화화토금금토수";

/** 표준 표기표(한글 → 한자). 정규식 값은 이체자 허용. */
const STANDARD = new Map<string, string | RegExp>([
  // 십성
  ["비견", "比肩"], ["겁재", "劫財"], ["식신", "食神"], ["상관", "傷官"], ["편재", "偏財"], ["정재", "正財"], ["편관", "偏官"], ["정관", "正官"], ["편인", "偏印"], ["정인", "正印"],
  // 십성 묶음·별칭
  ["비겁", "比劫"], ["식상", "食傷"], ["재성", "財星"], ["관성", "官星"], ["인성", "印星"], ["관살", "官殺"], ["칠살", "七殺"],
  // 십이운성
  ["장생", "長生"], ["목욕", "沐浴"], ["관대", "冠帶"], ["건록", "建祿"], ["제왕", "帝旺"], ["쇠", "衰"], ["병", "病"], ["사", "死"], ["묘", "墓"], ["절", "絶"], ["태", "胎"], ["양", "養"],
  // 귀인
  ["천을귀인", "天乙貴人"], ["태극귀인", "太極貴人"], ["문창귀인", "文昌貴人"], ["학당귀인", "學堂貴人"], ["월덕귀인", "月德貴人"], ["천덕귀인", "天德貴人"], ["암록", "暗祿"], ["복성귀인", "福星貴人"], ["천의성", "天醫星"], ["금여록", "金輿祿"], ["문곡귀인", "文曲貴人"], ["재고귀인", "財庫貴人"],
  // 합충형파해
  ["충", "沖"], ["천간합", "天干合"], ["육합", "六合"], ["삼합", "三合"], ["방합", "方合"], ["반합", "半合"], ["형", "刑"], ["파", "破"], ["해", "害"], ["원진", "怨嗔"],
  // 신살(살은 殺·煞)
  ...([["현침살", "懸針"], ["반안살", "攀鞍"], ["장성살", "將星"], ["도화살", "桃花"], ["홍염살", "紅艶"], ["역마살", "驛馬"], ["백호대살", "白虎大"], ["망신살", "亡身"], ["화개살", "華蓋"], ["고신살", "孤辰"], ["과숙살", "寡宿"], ["겁살", "劫"], ["재살", "災"], ["천살", "天"], ["지살", "地"], ["년살", "年"], ["월살", "月"], ["육해살", "六害"], ["괴강살", "魁罡"], ["양인살", "羊刃"], ["원진살", "怨嗔"], ["귀문관살", "鬼門關"], ["음착양차살", "陰錯陽差"]] as const).map(([ko, han]) => [ko, new RegExp(`^${han}[殺煞]$`)] as [string, RegExp]),
  ["화개", "華蓋"], ["양인", "羊刃"], ["공망", "空亡"], ["천문성", "天門星"], ["천라지망", "天羅地網"],
  // 운·기둥 낱말
  ["대운", "大運"], ["세운", "歲運"], ["일주", "日柱"], ["일간", "日干"], ["지장간", "支藏干"],
  // 일간(천간 + 오행), 지지(+ 오행) — "신금"은 두 뜻이라 뺀다
  ...[...STEMS].map((s, i) => [`${s}${STEM_EL[i]}`, `${STEM_HAN[i]}${EL[STEM_EL[i]]}`] as [string, string]).filter(([ko]) => ko !== "신금"),
  ...[...BRANCHES].map((b, i) => [`${b}${BRANCH_EL[i]}`, `${BRANCH_HAN[i]}${EL[BRANCH_EL[i]]}`] as [string, string]).filter(([ko]) => ko !== "신금"),
  // 60갑자
  ...Array.from({ length: 60 }, (_, i) => [`${STEMS[i % 10]}${BRANCHES[i % 12]}`, `${STEM_HAN[i % 10]}${BRANCH_HAN[i % 12]}`] as [string, string]),
]);

const k = loadKnowledge();
const dict = termDictionary(k);

describe("P6e 7 렌더 용어 사전 = 표준 표기표", () => {
  it("사전의 모든 항목이 표준표에 있고 한자가 같다(전수)", () => {
    const wrong: string[] = [];
    for (const [ko, han] of dict) {
      const want = STANDARD.get(ko);
      if (want === undefined) wrong.push(`${ko}(${han}): 표준표에 없음`);
      else if (typeof want === "string" ? want !== han : !want.test(han)) wrong.push(`${ko}(${han}) ≠ ${want}`);
    }
    expect(wrong).toEqual([]);
  });
  it("십성·십이운성·60갑자는 빠짐없이 사전에 있다", () => {
    const must = [...STANDARD.keys()].filter(ko => /^(비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인|장생|목욕|관대|건록|제왕)$/.test(ko) || (ko.length === 2 && STEMS.includes(ko[0]) && BRANCHES.includes(ko[1])));
    expect(must.filter(ko => !dict.has(ko))).toEqual([]);
    expect(must.length).toBe(15 + 60);
  });
  it("두 한자로 갈리는 이름(신금 = 申金·辛金)은 붙이지 않는다", () => {
    expect(dict.has("신금")).toBe(false);
    const r = annotateChapter([{ heading: "h", paragraphs: ["신금 일간은 날이 서 있어요. 편인은 혼자 배우는 힘이에요."] }], { dict, ganji: new Set(), mbtiNames: new Map() });
    expect(r.sections[0].paragraphs[0]).not.toMatch(/신금\(/);
    expect(r.sections[0].paragraphs[0]).toContain("편인(偏印)은 혼자 배우는 힘이에요.");
  });
  it("오기 꼴(偏人·正人·食信·傷宮)은 사전 어디에도 없다", () => {
    expect([...dict.values()].join(" ")).not.toMatch(/偏人|正人|食信|傷宮|劫才|比見/);
  });
});
