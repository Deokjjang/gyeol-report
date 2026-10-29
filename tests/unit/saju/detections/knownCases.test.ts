/**
 * 교과서·통용 사례 40건. 각 사례 주석에 출처 구분(통용/고전 명칭/본 DB 규칙)을 적는다.
 */
import { describe, expect, it } from "vitest";
import {
  analyzeChartDetections,
  analyzeClimate,
  detectRelations,
  getGongmang,
  getTwelveStage,
  type ExtraShinsalCode,
  type RelationHit,
} from "@/lib/saju/detections";
import { chartOf, natalOf, P } from "./chartFixture";

const rel = (text: string) => detectRelations(natalOf(text));
const find = (hits: readonly RelationHit[], kind: RelationHit["kind"], key?: string) =>
  hits.filter((h) => h.kind === kind && (key === undefined || h.key === key));
const extra = (text: string) => analyzeChartDetections(chartOf(text)).extraShinsal;
const extraCode = (text: string, code: ExtraShinsalCode) => extra(text).find((h) => h.code === code);

describe("known cases: 공망", () => {
  it("1 甲子순 공망 = 戌亥 (통용 순공표)", () => expect(getGongmang(P("甲子")).branches).toEqual(["戌", "亥"]));
  it("2 甲戌 일주 = 甲戌순 申酉 공망 (통용)", () => expect(getGongmang(P("甲戌")).branches).toEqual(["申", "酉"]));
  it("3 癸亥 일주 = 甲寅순 子丑 공망 (통용)", () => expect(getGongmang(P("癸亥"))).toEqual({ xun: "甲寅", branches: ["子", "丑"] }));
  it("4 일주 甲子 + 년지 戌 → 년 자리 공망, 일주 기준이 기본 (통용)", () => {
    const det = analyzeChartDetections(chartOf("壬戌 癸丑 甲子 丙寅"));
    expect(det.gongmang).toHaveLength(1);
    expect(det.gongmang[0]).toMatchObject({ basis: "day", xun: "甲子", positions: ["year"] });
  });
});

describe("known cases: 십이운성", () => {
  it("5 甲 일간 亥 = 長生 (통용, 甲木長生在亥)", () => expect(getTwelveStage("甲", "亥")).toBe("長生"));
  it("6 甲 일간 午 = 死 (통용)", () => expect(getTwelveStage("甲", "午")).toBe("死"));
  it("7 乙 일간 午 = 長生 (음간 역행, 통용)", () => expect(getTwelveStage("乙", "午")).toBe("長生"));
  it("8 戊 일간 寅 = 長生, 己 일간 酉 = 長生 (화토동법)", () => {
    expect(getTwelveStage("戊", "寅")).toBe("長生");
    expect(getTwelveStage("己", "酉")).toBe("長生");
  });
  it("9 丙 일간 午 = 帝旺, 壬 일간 子 = 帝旺 (통용)", () => {
    expect(getTwelveStage("丙", "午")).toBe("帝旺");
    expect(getTwelveStage("壬", "子")).toBe("帝旺");
  });
  it("10 庚 일간 申 = 建祿(臨官), 辛 일간 酉 = 建祿 (녹 표와 일치)", () => {
    expect(getTwelveStage("庚", "申")).toBe("建祿");
    expect(getTwelveStage("辛", "酉")).toBe("建祿");
  });
});

describe("known cases: 합충형파해", () => {
  it("11 甲己합 → 土 (통용 천간합)", () => {
    const hit = find(rel("甲子 己丑 丙寅 丁卯"), "STEM_HAP", "甲己")[0];
    expect(hit).toMatchObject({ element: "EARTH", adjacent: true });
  });
  it("12 申子辰 수국 삼합 3자 = full WATER (통용)", () => {
    const hit = find(rel("甲申 丙子 戊辰 庚午"), "SAMHAP", "申子辰");
    expect(hit).toHaveLength(1);
    expect(hit[0]).toMatchObject({ completeness: "full", element: "WATER" });
  });
  it("13 子+辰 = 申子辰 반합(왕지 포함) (통용)", () => {
    const hit = find(rel("甲子 丙辰 戊午 庚午"), "SAMHAP", "申子辰");
    expect(hit.map((h) => h.completeness)).toEqual(["half"]);
  });
  it("14 申+辰(생지+고지)은 기본 반합 아님 (본 DB 규칙: 왕지 포함 2자만)", () => {
    expect(find(rel("甲申 丙辰 戊午 庚午"), "SAMHAP")).toHaveLength(0);
  });
  it("15 亥子丑 방합 3자 = WATER (통용 방합)", () => {
    expect(find(rel("乙亥 丙子 丁丑 戊午"), "BANGHAP", "亥子丑")[0]).toMatchObject({ element: "WATER", completeness: "full", adjacent: true });
  });
  it("16 亥子 2자는 방합 아님 (본 DB 규칙: 3자 완성만)", () => {
    expect(find(rel("乙亥 丙子 丁卯 戊午"), "BANGHAP")).toHaveLength(0);
  });
  it("17 子午충 (통용 육충)", () => {
    expect(find(rel("甲子 丙午 戊寅 庚申"), "CHUNG", "子午")[0].members.map((m) => m.position)).toEqual(["year", "month"]);
  });
  it("18 寅巳申 삼형 3자 = full (통용 무은지형)", () => {
    expect(find(rel("甲寅 己巳 庚申 丙子"), "HYEONG", "寅巳申")[0]).toMatchObject({ subtype: "삼형", completeness: "full" });
  });
  it("19 寅巳만 = 삼형 partial + 寅巳해 (통용)", () => {
    const hits = rel("甲寅 己巳 庚午 丙子");
    expect(find(hits, "HYEONG", "寅巳申")[0]).toMatchObject({ completeness: "partial" });
    expect(find(hits, "HAE", "寅巳")).toHaveLength(1);
  });
  it("20 丑戌未 삼형 3자 = full (통용 지세지형)", () => {
    expect(find(rel("乙丑 丙戌 丁未 戊子"), "HYEONG", "丑戌未")[0]).toMatchObject({ completeness: "full" });
  });
  it("21 子卯 상형 (통용 무례지형)", () => {
    expect(find(rel("甲子 丁卯 戊午 庚申"), "HYEONG", "子卯")[0]).toMatchObject({ subtype: "상형" });
  });
  it("22 午午 자형 (통용 자형 辰午酉亥)", () => {
    expect(find(rel("甲午 庚午 戊寅 庚申"), "HYEONG", "午午")[0]).toMatchObject({ subtype: "자형", adjacent: true });
  });
  it("23 子酉파 (통용 육파)", () => expect(find(rel("甲子 癸酉 戊寅 庚午"), "PA", "子酉")).toHaveLength(1));
  it("24 子未 = 육해 + 원진 동시 (통용)", () => {
    const hits = rel("甲子 辛未 戊寅 庚午");
    expect(find(hits, "HAE", "子未")).toHaveLength(1);
    expect(find(hits, "WONJIN", "子未")).toHaveLength(1);
  });
  it("25 巳申 = 육합·파·삼형 partial 모두 보고 (본 DB 규칙: 합 우선이나 동시 보고)", () => {
    const kinds = rel("癸巳 庚申 戊寅 庚午").map((h) => h.kind);
    expect(kinds).toEqual(expect.arrayContaining(["YUKHAP", "PA", "HYEONG"]));
  });
  it("26 卯戌합 → 火, 午未합 오행은 학파차이라 미지정", () => {
    expect(find(rel("乙卯 甲戌 戊寅 庚子"), "YUKHAP", "卯戌")[0].element).toBe("FIRE");
    expect(find(rel("甲午 辛未 戊寅 庚子"), "YUKHAP", "午未")[0].element).toBeUndefined();
  });
});

describe("known cases: 신살·귀인 확장", () => {
  it("27 庚辰 일주 = 괴강 (통용 괴강일)", () => expect(extraCode("甲子 丙寅 庚辰 丁亥", "GOEGANG")?.positions).toEqual(["day"]));
  it("28 壬戌 일주는 괴강 아님 (본 DB: 壬戌·戊辰 미채택)", () => expect(extraCode("甲子 丙寅 壬戌 丁未", "GOEGANG")).toBeUndefined());
  it("29 丙 일간 午 = 양인 (자평 양인)", () => expect(extraCode("甲子 甲午 丙寅 己亥", "YANGIN")?.positions).toEqual(["month"]));
  it("30 乙 일간 辰은 양인 아님 (본 DB: 음간 양인 미채택)", () => expect(extraCode("甲子 戊辰 乙丑 丙子", "YANGIN")).toBeUndefined());
  it("31 甲 일간 亥 = 암록, 문곡 (본 DB 현대 통용표)", () => {
    const hits = extra("癸亥 甲子 甲寅 丙寅");
    expect(hits.find((h) => h.code === "AMROK")?.positions).toEqual(["year"]);
    expect(hits.find((h) => h.code === "MUNGOK")?.positions).toEqual(["year"]);
  });
  it("32 甲 일간 辰 = 금여(祿前二辰), 재고(土庫 辰) (본 DB 규칙)", () => {
    const hits = extra("戊辰 甲子 甲午 丙寅");
    expect(hits.find((h) => h.code === "GEUMYEO")?.positions).toEqual(["year"]);
    expect(hits.find((h) => h.code === "JAEGO")?.positions).toEqual(["year"]);
    expect(hits.every((h) => h.family === (["GEUMYEO", "JAEGO", "AMROK", "BOKSEONG", "CHEON_EUI", "MUNGOK"].includes(h.code) ? "gwiin" : "shinsal"))).toBe(true);
  });
  it("33 寅월 → 丑 천의 (현대 통용: 월지 바로 앞 지지)", () => expect(extraCode("乙丑 戊寅 甲午 丙子", "CHEON_EUI")?.positions).toEqual(["year"]));
  it("34 丙子·辛酉 일주 = 음착양차 (통용 12간지)", () => {
    expect(extraCode("甲午 丙寅 丙子 戊戌", "EUMCHAK_YANGCHA")?.positions).toEqual(["day"]);
    expect(extraCode("甲午 丙寅 辛酉 戊戌", "EUMCHAK_YANGCHA")?.positions).toEqual(["day"]);
  });
  it("35 戌·亥 동시 = 지망, 辰·巳 동시 = 천라 (본 DB 명명. 고전 일부는 戌亥=天羅로 반대)", () => {
    expect(extraCode("甲戌 乙亥 丙寅 丁卯", "CHEONRA_JIMANG")?.basis).toBe("지망(戌亥)");
    expect(extraCode("丙辰 癸巳 甲子 丁卯", "CHEONRA_JIMANG")?.basis).toBe("천라(辰巳)");
  });
  it("36 귀문 子酉: 월-일 인접은 성립, 년-월은 불성립 (본 DB 현대 적용)", () => {
    expect(extraCode("甲寅 丙子 癸酉 丁巳", "GWIMUN")?.positions).toEqual(["month", "day"]);
    expect(extraCode("甲子 癸酉 丙寅 丁巳", "GWIMUN")).toBeUndefined();
  });
  it("37 천문성 亥·卯·未·戌 (본 DB 현대 통용표)", () => expect(extraCode("乙亥 戊寅 丙子 庚寅", "CHEONMUN")?.positions).toEqual(["year"]));
  it("38 甲 일간 寅 = 복성귀인 (본 DB 현대 표)", () => expect(extraCode("丙寅 庚子 甲午 丙子", "BOKSEONG")?.positions).toEqual(["year"]));
});

describe("known cases: 조후", () => {
  it("39 丁 일간 겨울 = 甲(1순위)·庚(2순위) 필요, 둘 다 있으면 strong (궁통보감 계열 통용)", () => {
    const weak = analyzeClimate(natalOf("壬子 壬子 丁丑 癸卯"));
    expect(weak.featureKey).toBe("丁:winter");
    expect(weak.needs.filter((n) => n.role !== "support").map((n) => n.stem)).toEqual(["甲", "庚"]);
    expect(weak.level).toBe("weak");
    expect(weak.lackingElements).toEqual(["WOOD", "METAL"]);
    const strong = analyzeClimate(natalOf("甲寅 庚子 丁卯 丙午"));
    expect(strong.level).toBe("strong");
  });
  it("40 丙 일간 여름 물 0 = weak, 壬+庚 = strong (궁통보감 계열 통용)", () => {
    expect(analyzeClimate(natalOf("丙午 甲午 丙寅 丁巳")).level).toBe("weak");
    expect(analyzeClimate(natalOf("壬申 甲午 丙寅 庚寅")).level).toBe("strong");
  });
});
