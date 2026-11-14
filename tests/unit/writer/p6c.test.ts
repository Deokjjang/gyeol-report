/**
 * P6c-content 회귀 시험: 다양성·반복(A)·사실 정합(B)·개인화(C)·별명(D)·상품 구조(E)·카드(F)·표지(G)·강조(H)·안전망(I).
 * 사례: 하람 6:2(B1), 장덕민 겉 0 물·불(B2·C1), 도현 대학생(C1·C2), 수진 대운 2022~2031(B5).
 */
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import { starFacts } from "@/lib/brief/chart";
import { customerProps } from "@/lib/brief/props";
import { parseChapters, renderChapter } from "@/lib/writer/format";
import { buildWriterPrompt, chapterClaims, renderWriterBrief } from "@/lib/writer/prompt";
import { WRITER_SYSTEM } from "@/lib/writer/prompt/system";
import { coverProblem } from "@/lib/writer/publish";
import { applyRepairs, parseRepair, repairTargets } from "@/lib/writer/repair";
import { coverOf } from "@/lib/writer/runner";
import { applySafetyNet, type FinalChapter } from "@/lib/writer/safety";
import * as L from "@/lib/writer/safety/lint";
import { enforce, lintBook, lintCards, tenGodDirection, tidyBook, type LintCtx } from "@/lib/writer/safety/p6c";
import { splitSentences } from "@/lib/writer/safety/patterns";
import { headSentence, withKeySpan } from "@/lib/writer/book";
import { calculateSaju } from "@/lib/saju/calculateSaju";
import { analyzeChartDetections } from "@/lib/saju/detections";
import { PEOPLE } from "../../../tools/p35/people";

const k = loadKnowledge();
const BASE = "2026-11-03";
const ME = { name: "장덕민", gender: "MALE" as const, birthDate: "1999-07-31", birthTime: "08:27", birthTimeUnknown: false, mbtiType: "ENTJ" as const, context: { relationshipStatus: "single", jobStatus: "business_owner", detailJob: "사업" } };
const brief = (product: string, person: object, extra: object = {}) => buildBrief({ product, person, baseDate: BASE, selectedYear: 2026, ...extra } as never, k);
const ctx0 = (over: Partial<LintCtx> = {}): LintCtx => ({
  facts: { birthTimeKnown: true, mbti: "ENTJ", relationship: "single", children: "unknown", job: "business" }, jobDetail: "사업", schoolStage: "none", coreImage: "한여름 도시 아스팔트 위에 선 큰 나무",
  nicknames: [...k.features.values()].map(f => f.easyName).concat(L.NICKNAME_KEYS), corpus: new Set(), prior: [], jobProps: [], noJobChapters: new Set(), parentingChapters: new Set(), monthChapters: new Set(), compat: false, mbtiPlain: { Te: "일 되게 하는 판단", Ni: "멀리 보는 직관" }, ...over,
});
const fin = (n: number, sections: { heading: string; paragraphs: string[]; card?: object }[], extra: Partial<FinalChapter> = {}): FinalChapter => ({ n, id: `c${n}`, title: `${n}장`, sections, source: "writer", chars: 0, ...extra } as FinalChapter);

describe("P6c B 사실 정합", () => {
  it("B1 하람 6:2: 음 과다 설명이 붙고, 균형 설명은 비율 어긋남으로 잡는다", () => {
    const b = brief("saju_mbti_full", PEOPLE.c1);
    expect([b.chart.yinYang.yin, b.chart.yinYang.yang]).toEqual([6, 2]);
    expect(b.chart.yinYang.reading).toBe(k.features.get("yinYang:YIN_HEAVY")!.forYou.base);
    expect(L.yinYangClaim("음이 많은 사람은 밀어야 할 때와 기다려야 할 때를 상황에 맞게 고르는 감각이 있습니다.", 6, 2)).toBe("false_balance");
    expect(L.yinYangClaim("음과 양은 4대 4로 균형이 잡혀 있어요.", 6, 2)).toBe("false_balance");
    expect(L.yinYangClaim("음과 양은 4대 4로 균형이 잡혀 있어요.", 4, 4)).toBeNull();
    expect(L.yinYangClaim("음이 양보다 훨씬 많은 쪽이에요.", 4, 4)).toBe("false_skew");
  });
  it("B2 장덕민: 겉 0·땅속에 있는 물을 '없다'고 하면 잡고, '겉에는 없고 땅속에 조금'은 둔다", () => {
    const b = brief("saju_mbti_full", ME);
    const p = b.chart.elements.presence as L.ElementPresence;
    expect(p.WATER).toEqual({ surface: 0, hidden: true });
    expect(L.elementAbsenceClaims("여름이라서 빠르고, 물이 없어서 마르기 쉬운 사람", p)).toEqual(["WATER"]);
    expect(L.elementAbsenceClaims("흙은 많고 물은 없는 사주", p)).toEqual(["WATER"]);
    expect(L.elementAbsenceClaims("물(수)은 겉에는 없고 땅속에 조금 있어요.", p)).toEqual([]);
    expect(L.elementAbsenceClaims("할 수 없어요.", p)).toEqual([]);
  });
  it("B3 십성 누름 방향: 역방향 문장을 잡고 지식 DB에는 남지 않았다", () => {
    expect(tenGodDirection("원국에 식신이 있어 생각이 실행을 막기 쉬운 구조예요.")).toBe(true);
    expect(tenGodDirection("관성이 식상을 눌러 표현이 줄어요.")).toBe(true);
    expect(tenGodDirection("편인이 식신을 누르면 하던 일의 재미가 식어요.")).toBe(false);
    expect(tenGodDirection("재성이 인성을 누르면 배움이 밀려요.")).toBe(false);
    const texts = [...k.tenGodPeriod.values()].flatMap(e => e.year.caution.map(c => c.text));
    expect(texts.filter(tenGodDirection)).toEqual([]);
  });
  it("B4 배우자·자녀 별을 성별 기준 사실 하나로 주고, 어긋난 문장을 잡는다", () => {
    const saju = calculateSaju({ birthDate: PEOPLE.c1.birthDate, birthTime: PEOPLE.c1.birthTime, birthTimeUnknown: false, approximateBirthTimeSlot: "" as never, calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul" });
    const s = starFacts(saju, analyzeChartDetections(saju), "MALE");
    expect(s.spouse.star).toMatch(/^배우자 별\(편재·정재\)$/); expect(s.child.star).toMatch(/^자녀 별\(편관·정관\)$/);
    expect(brief("love_marriage_child", PEOPLE.c1).chart.stars?.spouse.where).toBe(s.spouse.where);
    expect(L.starClaim("배우자 별이 원국에 없어서 스스로 찾는 인연이에요.", "배우자", "surface")).toBe("배우자_absent_claim");
    expect(L.starClaim("배우자 별이 뚜렷하게 드러나 있어요.", "배우자", "none")).toBe("배우자_present_claim");
  });
  it("B5 수진 대운 2022~2031: 2026년은 5번째 해(중간), '마지막 해'는 잡는다", () => {
    const b = brief("major_fortune", PEOPLE.x);
    expect(b.chart.currentDayun?.years).toBe("2022~2031");
    // 최종 A-4: 남은 기간은 교운 시각 기준(다음 교운 2032년 겨울 → 2026-11-03에서 6년 남짓). 몇 번째 해는 연도 카드와 같은 달력 연차.
    expect(b.chart.currentDayun?.phase).toMatchObject({ yearIndex: 5, label: "중간", yearsLeft: 6 });
    expect(b.chart.currentDayun?.phase?.remaining).toMatch(/^약 6년/);
    expect(L.dayunPhaseClaim("지금 대운의 마지막 해이기도 합니다.", "middle")).toBe("late");
    expect(L.dayunPhaseClaim("이번 10년 흐름의 한가운데예요.", "middle")).toBeNull();
  });
});

describe("P6c C 개인화", () => {
  it("C1 장덕민(사업)·도현(대학생): 학교 장면 금지 범위와 생활 단계 소품", () => {
    expect(L.schoolHit("모의고사 점수가 오르면 다음 목표를 적어요.", "none")).toBe("모의고사");
    expect(L.schoolHit("새 학원의 규정 안내를 듣다가 손을 들어요.", "college")).toBe("학원");
    expect(L.schoolHit("필기 노트를 빌려 달라고 하기 전에 사진을 보내요.", "college")).toBeNull();
    expect(L.schoolHit("필기 노트를 빌려 달라고 하기 전에 사진을 보내요.", "none")).toBe("필기 노트");
    const doh = brief("love_marriage_child", PEOPLE.y);
    expect(doh.person.lifeStage).toMatch(/대학생 이상/);
    const props = customerProps({ detailJob: "대학생", jobStatus: "student", age: 22 }, { relationship: "single", children: "unknown", job: "student" } as never);
    expect(props.stage.props.some(x => /매점|성적표|필기 노트/.test(x))).toBe(false);
    // 장덕민 종합 브리프의 장면(재료)에 학교 장면이 없다.
    const me = JSON.stringify(brief("saju_mbti_full", ME).chapters);
    expect(me).not.toMatch(L.SCHOOL_SCENE);
  });
  it("C2 솔로·미입력에게 연인·부부 전제를 잡고, 조건형은 둔다", () => {
    expect(L.presumedPartner("좋아하는 사람 앞에서는 그 손이 유난히 바빠져요.", "single")).toBeTruthy();
    expect(L.presumedPartner("부부 사이가 편하고 생활의 즐거움을 나눠요.", "single")).toBeTruthy();
    expect(L.presumedPartner("좋아하는 사람이 생기면 먼저 연락하는 쪽이에요.", "single")).toBeNull();
    expect(L.presumedPartner("좋아하는 사람에게 짧은 메모를 건네 보세요.", "dating")).toBeNull();
    expect(L.presumedPartner("부부 사이가 편해요.", "married")).toBeNull();
  });
  it("C3 입력 없는 과거·지인 사건은 잡고, 질문형은 둔다", () => {
    expect(L.pastAssertion("상한을 정해 두면 막내 시절의 빠듯함을 되풀이하지 않아요.")).toBeTruthy();
    expect(L.pastAssertion("그 말에 진로를 튼 친구도 있고요.")).toBeTruthy();
    expect(L.pastAssertion("막내 시절에 빠듯했던 적이 있지 않나요?")).toBeNull();
  });
  it("C5 괄호 밖 MBTI 약어는 책에서 처음 한 번 쉬운 이름(약어), 그 뒤로는 쉬운 이름(P6d 그대로), 기능 이어 쓰기는 '~와 ~'(최종판 1-14)", () => {
    const { chapters } = tidyBook([fin(1, [{ heading: "h", paragraphs: ["주기능 Te는 효율을 봐요. 그리고 Te가 앞서면 Ni도 따라와요."] }])], ctx0());
    // P6d: 바뀐 낱말의 받침으로 조사를 다시 고른다("판단는"·"판단가" → "판단은"·"판단이").
    expect(chapters[0].sections[0].paragraphs[0]).toBe("주기능 일 되게 하는 판단(Te)은 효율을 봐요. 그리고 일 되게 하는 판단이 앞서면 멀리 보는 직관(Ni)도 따라와요.");
    const j = tidyBook([fin(1, [{ heading: "h", paragraphs: ["이 솜씨는 Te-Ni 감각과 겹쳐요."] }])], ctx0()).chapters[0].sections[0].paragraphs[0];
    expect(j).toBe("이 솜씨는 일 되게 하는 판단(Te)과 멀리 보는 직관(Ni) 감각과 겹쳐요.");
    expect(L.bareFunctionCodes(chapters[0].sections[0].paragraphs[0])).toEqual([]);
  });
});

describe("P6c A·D 문형·별명·겹침", () => {
  it("A4 '명리학에서'는 결정론으로 떼고, 뜻 공식 5번째·'앞에서 본' 3번째부터 수리 대상", () => {
    expect(L.dropMyeongriPrefix("식신(食神)은 명리학에서 꾸준히 만드는 힘을 뜻해요.")).toBe("식신(食神)은 꾸준히 만드는 힘을 뜻해요.");
    const f = (t: string) => `${t}(食神)은 꾸준히 만드는 힘을 뜻해요.`;
    const book = [fin(1, [{ heading: "a", paragraphs: [["가식", "나식", "다식", "라식", "마식"].map(f).join(" ")] }, { heading: "b", paragraphs: ["앞에서 본 힘이 커요. 앞에서 본 힘이 또 커요. 앞에서 본 힘이 다시 커져요."] }])];
    const flags = lintBook(book, ctx0());
    expect(flags.filter(x => x.rule === "formula_excess").map(x => x.sentence)).toEqual([f("마식")]);
    expect(flags.filter(x => x.rule === "backref_excess")).toHaveLength(1);
  });
  it("A1 브리프 글 20자 복사·A2 같은 특성 뜻 두 번·같은 장면 반복·A3 이전 책과 겹침", () => {
    const corpus = L.copyWindows(["차와 시계, 집 주소를 고를 때 남의 눈을 계산하고 돈을 씁니다"]);
    const book = [fin(1, [{ heading: "a", paragraphs: ["당신은 집 주소를 고를 때 남의 눈을 계산하고 돈을 씁니다.", "편관(偏官)은 압박 속 결단을 뜻해요."] }, { heading: "b", paragraphs: ["편관(偏官)은 책임을 맡는 힘을 뜻해요.", "밤에 현관문을 잠그고 가스 밸브를 하나씩 짚어 확인해요."] }]),
      fin(2, [{ heading: "c", paragraphs: ["밤에 현관문을 잠그고 가스 밸브를 하나씩 짚어 확인해요!"] }])];
    const flags = lintBook(book, ctx0({ corpus, prior: ["회의가 끝나면 혼자 정리 메모를 남깁니다."] }));
    expect(flags.map(x => x.rule).sort()).toEqual(["db_copy", "meaning_repeat", "scene_repeat"]);
    expect(lintBook([fin(1, [{ heading: "a", paragraphs: ["회의가 끝나면 혼자 정리 메모를 남겨요."] }])], ctx0({ prior: ["회의가 끝나면 혼자 정리 메모를 남깁니다."] })).map(x => x.rule)).toEqual(["prior_overlap"]);
    expect(L.overlapping(["회의가 끝나면 혼자 정리 메모를 남깁니다."], ["회의가 끝나면 혼자 정리 메모를 남겨요."])).toHaveLength(1);
  });
  it("D1 그림 별명(머리말 그림 낱말 포함)·농사 비유, D2 1장 두 번째 그림", () => {
    expect(L.nicknameHits("다만 안장은 무겁습니다.", ctx0().nicknames)).toContain("안장");
    expect(L.nicknameHits("한여름 도시 아스팔트 위에 선 큰 나무", ctx0().nicknames, ["한여름 도시 아스팔트 위에 선 큰 나무"])).toEqual([]);
    for (const s of ["씨를 뿌리듯 시작해요", "구석의 잡초", "밭흙은 무엇이든 키워요", "김장하듯 모아 둬요"]) expect(L.FARMING.test(s), s).toBe(true);
    expect(L.FARMING.test("밤에 산책을 해요")).toBe(false);
    expect(L.secondImage("가을 쇠 위에 선 큰 나무", "한여름 도시 아스팔트 위에 선 큰 나무")).toBe(true);
    expect(L.secondImage("한여름 도시 아스팔트 위에 선 큰 나무", "한여름 도시 아스팔트 위에 선 큰 나무")).toBe(false);
  });
  it("작가 지침: 명리학에서 금지·뜻 공식 4번·앞에서 본 2번·재료·카드·표지·⟪⟫를 담는다", () => {
    for (const x of ["명리학에서·명리학적으로·명리에서는", "4번까지", "2번까지", "[그림]", "[해 볼 것]", "[돌아보기]", "[살필 점]", "⟪ ⟫", "chart.elements.presence", "chart.currentDayun.phase", "chart.stars"]) expect(WRITER_SYSTEM).toContain(x);
  });
});

describe("P6c E 상품 구조", () => {
  it("E1 → P6d G 커리어 9장 = 일의 엔진·지금 자리·맞는 일과 길·보여 주는 법·일터의 사람·평가와 문서·돈의 길·투자 성향·타이밍과 3년, 서비스 기획은 실제 업무 단위", () => {
    const b = brief("career_money_study", PEOPLE.c1);
    expect(b.chapters.map(c => c.id)).toEqual(["engine", "now", "paths", "show", "people", "docs", "money", "invest", "roadmap"]);
    expect(b.person.workScenes?.plan).toEqual(["PRD 초안", "로드맵 우선순위"]);
    const ev = (key: string) => b.chapters.flatMap(c => c.materials).find(m => m.kind === "evidence" && m.key === key) as { facts: string[] } | undefined;
    // 하람 2026 = 임인 대운(2017~2026)의 마지막 해, 다음 대운 2027 계묘.
    expect(ev("timingNow")!.facts.join(" ")).toMatch(/10번째 해\(마지막 해, 남은 기간 약 \d개월\(2027년 \d{1,2}월 무렵까지\)\)/); // 최종 A-4: 남은 기간은 교운 시각 기준
    expect(ev("timingNow")!.facts.join(" ")).toMatch(/다음 대운: [가-힣]{2} 대운: 2027년 \d{1,2}월 무렵부터/);
    // P6e 14: 다섯 힘은 쉬운 이름(묶음 이름)으로.
    expect(ev("engineGroups")!.facts[0]).toBe("다섯 힘(만세력 가중값): 내 방식의 힘(비겁) 보통 · 만드는 힘(식상) 보통 · 값을 받는 힘(재성) 약 · 규칙의 힘(관성) 강 · 배우는 힘(인성) 약"); // 최종판3 1: 비겁은 일간 자신을 뺀다
  });
  it("E2 종합 가족 장은 뿌리·부모 자리·인성·식상·비겁 근거, E3 자녀 장 장면에 결혼·양가 이야기 없음", () => {
    const full = brief("saju_mbti_full", PEOPLE.c1);
    const fam = full.chapters.find(c => c.id === "family")!;
    expect(fam.sections!.map(s => s.materials.find(m => m.kind === "evidence")?.kind === "evidence" ? (s.materials.find(m => m.kind === "evidence") as { key: string }).key : null)).toEqual(["familyRoots", "careReceive", "careGive"]);
    const love = brief("love_marriage_child", PEOPLE.c1);
    const parenting = JSON.stringify(love.chapters.find(c => c.id === "parenting")!.sections!.slice(1));
    expect(parenting).not.toMatch(/결혼|시댁|처가|양가|상견례|신혼/);
  });
  // AM 3부: 대운 「지난 시간」은 지난 세 해를 한 흐름 + 그 시기 대운으로(예전 「패턴:」 한 줄 대신). AM 2부: 세운은 「눈여겨볼 세 달」 대신 영역마다 달(연애 달·돈 흐름) 근거.
  it("E4 대운 지난 세 해는 한 흐름 + 그 시기 대운, E5 세운 영역별 달 근거", () => {
    const major = brief("major_fortune", PEOPLE.x);
    const past = major.chapters.flatMap(c => c.materials).find(m => m.kind === "evidence" && m.key === "pastSummary") as { facts: string[] };
    expect(past.facts[0]).toMatch(/^지난 세 해: \d{4}년 [가-힣]{2} .+ → \d{4}년 /);
    const annual = brief("annual_fortune", PEOPLE.c2);
    const keys = annual.chapters.flatMap(c => c.materials).flatMap(m => m.kind === "evidence" ? [(m as { key: string }).key] : []);
    expect(keys).toEqual(expect.arrayContaining(["yearCard", "loveMonths", "moneyIn", "moneyHole", "mindRest"]));
    expect(keys).not.toContain("keyMonthsLink");
  });
});

describe("P6c F·G·H 카드·표지·강조", () => {
  const text = "[표지] 서비스 기획 4년 차가 여는 다음 10년\n\n## 1. 연도별 지침\n### 2026\n문단 하나예요. ⟪핵심 문장이에요.⟫\n\n문단 둘이에요.\n\n[그림] 마감 전 화이트보드를 지우는 해\n[해 볼 것] 이번 분기 목표 하나를 적어 두세요\n[살필 점] 없음\n### 2027\n본문이에요.\n[돌아보기] 그때 무엇을 붙잡았나요?\n";
  it("F1 카드 줄은 문단이 아니라 card로 빠지고, 표지 줄은 장 앞에서 읽는다", () => {
    const ch = parseChapters(text);
    expect(ch[0].sections[0].paragraphs).toEqual(["문단 하나예요. ⟪핵심 문장이에요.⟫", "문단 둘이에요."]);
    expect(ch[0].sections[0].card).toEqual({ image: "마감 전 화이트보드를 지우는 해", todo: "이번 분기 목표 하나를 적어 두세요", caution: null });
    expect(ch[0].sections[1].card).toEqual({ review: "그때 무엇을 붙잡았나요?" });
    expect(coverOf(text)).toBe("서비스 기획 4년 차가 여는 다음 10년");
    expect(renderChapter(ch[0])).toContain("[해 볼 것] 이번 분기 목표 하나를 적어 두세요");
    expect(splitSentences("문단 하나예요. ⟪핵심 문장이에요.⟫ 다음.")).toEqual(["문단 하나예요.", "⟪핵심 문장이에요.⟫", "다음."]);
  });
  it("F1·F2 카드 검사: 빠짐·꼴(지난 기간은 질문형)·같은 필드끼리 겹침", () => {
    const keyed = (cards: object[]) => [fin(4, cards.map((c, i) => ({ heading: `20${23 + i}`, paragraphs: ["본문"], card: c })), { keys: cards.map((_, i) => `20${23 + i}`) })];
    const periods = { 2023: "past", 2024: "current", 2025: "future" } as const;
    // P6d D: 살필 점도 작가가 key마다 쓴다(빠지면 card_missing).
    const flags = lintCards(keyed([{ image: "지난 계절의 창고를 정리하는 해", review: "그때 무엇을 정리했나요", caution: "정리한 것을 다시 쌓지 않게 살피기" }, { image: "새 노트 첫 장에 계획을 적는 해", todo: "계획 한 줄을 적어 두세요", caution: "계획만 세우고 시작을 미루지 않기" }, { image: "새 노트 첫 장에 계획을 적는 해!", todo: "운동 일정을 먼저 잡아 두세요" }]), ctx0({ periods }));
    expect(flags.map(f => `${f.section}:${f.card}:${f.rule}`).sort()).toEqual(["0:review:card_form", "2:caution:card_missing", "2:image:card_overlap"]);
  });
  it("G → 최종판 1-7 표지 한 줄 = 작가가 지은 핵심 이미지: 16~26자·설명문·명리학에서·연차·사실 규칙·피할 이미지 명사 금지", () => {
    const b = brief("saju_mbti_full", ME);
    // 최종판2 1-1: 길이는 공백을 빼고 센다(16~26자). 벗어나도 30자 이내면 작가 표지를 쓴다(level "length").
    expect(coverProblem("물길을 여는 한여름 큰 나무의 작은 등불", b, [])).toBeNull();
    // 최종판3 2g: 종합 표지는 직업·나이 금지(입력 직업 낱말·직함·나이).
    expect(coverProblem("물길을 여는 한여름 큰 나무의 작은 사업", b, [])).toMatch(/직업·나이/);
    expect(coverProblem("물길을 여는 한여름 큰 나무의 등불", b, [])).toMatch(/공백 뺌/);
    expect(coverProblem("짧아요", b, [])).toMatch(/길이/);
    expect(coverProblem("스물일곱, 물길을 여는 큰 나무의 사업이에요.", b, [])).toMatch(/설명문/);
    expect(coverProblem("서비스 기획 7년 차, 물길을 여는 큰 나무", b, [])).toMatch(/연차/);
    expect(coverProblem("명리학에서 보면 물길을 여는 큰 나무", b, [])).toBeTruthy();
    expect(coverProblem("빗속에서도 꺼지지 않는 캠핑 랜턴", b, ["랜턴"])).toMatch(/피할 이미지\(랜턴\)/);
    expect(coverProblem(null, b, [])).toBe("없음");
  });
  it("H 소제목마다 핵심 문장 하나: 위치를 남기고 기호는 지운다, 둘째 기호와 짝 없는 기호는 정리", () => {
    const s = withKeySpan({ heading: "h", paragraphs: ["첫 문장이에요. ⟪핵심 문장이에요.⟫ 끝이에요.", "둘째 ⟪문단⟫이에요."] });
    expect(s.paragraphs).toEqual(["첫 문장이에요. 핵심 문장이에요. 끝이에요.", "둘째 문단이에요."]);
    // 화면 계약(P6c-ui2 g): 문단마다 [시작, 끝) 또는 null, 소제목당 하나.
    expect(s.keySpans).toEqual([[9, 18], null]);
    expect(s.paragraphs[0].slice(s.keySpans![0]![0], s.keySpans![0]![1])).toBe("핵심 문장이에요.");
    const t = tidyBook([fin(1, [{ heading: "h", paragraphs: ["⟪하나⟫ 그리고 ⟪둘⟫.", "⟪짝 없음."] }])], ctx0());
    expect(t.chapters[0].sections[0].paragraphs).toEqual(["⟪하나⟫ 그리고 둘.", "짝 없음."]);
  });
  it("F3 머리 문장은 문장 단위(중간에서 자르지 않는다)", () => {
    expect(headSentence("첫 문장은 아주 길어서 예전에는 육십 자에서 잘렸던 바로 그 문장이고 끝까지 남아야 합니다. 둘째 문장.")).toBe("첫 문장은 아주 길어서 예전에는 육십 자에서 잘렸던 바로 그 문장이고 끝까지 남아야 합니다.");
  });
});

describe("P6c A5 수리 패스 · I 안전망", () => {
  it("수리 응답 [P번호]를 걸린 자리에 넣고, 그래도 사실 규칙에 걸리면 문단째 뺀다(P6d B: 문장 삭제 없음)", () => {
    const book = [fin(1, [{ heading: "흙은 많고 물은 없는 사주", paragraphs: ["좋은 문장이에요. 그 말에 진로를 튼 친구도 있고요."] }])];
    const flags = lintBook(book, ctx0({ presence: { WOOD: { surface: 2, hidden: true }, FIRE: { surface: 0, hidden: true }, EARTH: { surface: 4, hidden: true }, METAL: { surface: 2, hidden: true }, WATER: { surface: 0, hidden: true } } }));
    expect(flags.map(f => `${f.paragraph}:${f.rule}`)).toEqual(["-1:element_claim", "0:past_assertion"]);
    const targets = repairTargets(flags, book);
    const fixes = parseRepair("[P1] 흙은 많고 물은 땅속에만 있는 사주\n\n[P2] 좋은 문장이에요. 그 말에 마음이 움직인 적, 있지 않나요?");
    const { chapters, applied } = applyRepairs(book, targets, fixes);
    expect(applied).toBe(2);
    expect(chapters[0].sections[0].heading).toBe("흙은 많고 물은 땅속에만 있는 사주");
    expect(lintBook(chapters, ctx0())).toEqual([]);
    const book2 = [fin(1, [{ heading: "h", paragraphs: ["좋은 문장이에요. 그 말에 진로를 튼 친구도 있고요.", "다른 문단은 그대로예요."] }])];
    const e = enforce(book2, lintBook(book2, ctx0()));
    expect(e.chapters[0].sections[0].paragraphs).toEqual(["다른 문단은 그대로예요."]); expect(e.removed).toBe(0); expect(e.droppedParagraphs).toBe(1);
  });
  it("I 안전망 문장: 명리학에서·따옴표 인용·안내 문장 없이, 장 질문은 존댓말", () => {
    for (const [product, person] of [["saju_mbti_full", PEOPLE.c1], ["career_money_study", PEOPLE.c1], ["annual_fortune", PEOPLE.c2], ["saju_mbti_compatibility", PEOPLE.c1]] as const) {
      const b = brief(product, person, product === "saju_mbti_compatibility" ? { partner: PEOPLE.c2, relationshipType: "love" } : {});
      const { chapters, report } = applySafetyNet(b, buildWriterPrompt(b).chapters, new Map());
      const all = chapters.flatMap(c => c.sections.flatMap(s => s.paragraphs)).join(" ");
      expect(report.deletions, product).toEqual([]);
      expect(all, product).not.toMatch(/명리학에서|이 장에서는 이 질문에 답해 볼게요|점수 쪽에 적어 두었어요|'[^']{6,}'(에 가깝|이라는 뜻|예요|이에요)/);
      expect(all).not.toMatch(/(?<![가-힣])님는|달예요/);
    }
  });
  it("작가 입력은 지식 DB가 있으면 재료로 바꿔 보낸다(재료 표가 비면 원문 그대로)", () => {
    const b = brief("saju_mbti_full", PEOPLE.c1);
    const raw = JSON.stringify(renderWriterBrief(b));
    const swapped = JSON.stringify(renderWriterBrief(b, { knowledge: k }));
    // P6e 10: 지식 DB가 있으면 장마다 앞 장 주장(before·tension)이 더해진다. 그 몫을 빼고 견준다.
    const claims = JSON.stringify([...chapterClaims(b, k).values()]).length;
    expect(swapped.length).toBeLessThanOrEqual(raw.length + claims);
  });
});
