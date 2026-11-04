/**
 * P6d-content 회귀 시험: 지난 판독(P6c 최종 7권)에 나온 결함 문장이 새 검사에 걸리고, 원인 계층(엔진·브리프·설계기)이 고쳐졌음을 증명한다.
 * A 묶음 세기 단일 기준 · B 조각 문장 · C 사실·위치 · D 카드 · E 시점 · F 아이디어 원장 · G 커리어·연애 재설계 · H 저장된 P6c 책 재검사.
 * 대운·세운은 원고를 생성하지 않고 저장된 P6c 책 + 새 브리프·검사로 본다.
 */
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import type { Brief } from "@/lib/brief/schema";
import { CAREER_REQUIRED } from "@/lib/brief/design/career";
import { LOVE_REQUIRED } from "@/lib/brief/design/love";
import { groupStrength } from "@/lib/saju/groupStrength";
import { calculateSaju } from "@/lib/saju/calculateSaju";
import { parseChapters } from "@/lib/writer/format";
import { buildWriterPrompt, renderWriterBrief, type WriterChapter } from "@/lib/writer/prompt";
import { insertFixedLines, lintContext } from "@/lib/writer/publish";
import { ledgerOf, newEvidenceShare, usedScenesOf } from "@/lib/writer/prior";
import type { FinalChapter } from "@/lib/writer/safety";
import * as L from "@/lib/writer/safety/lint";
import * as D from "@/lib/writer/safety/p6d";
import { enforce, lintBook, lintCards, type LintFlag } from "@/lib/writer/safety/p6c";
import { splitSentences } from "@/lib/writer/safety/patterns";
import { PEOPLE } from "../../../tools/p35/people";

const k = loadKnowledge();
const BASE = "2026-11-04";
const ROOT = resolve(import.meta.dirname, "../../..");
const ME = { name: "장덕민", gender: "MALE" as const, birthDate: "1999-07-31", birthTime: "08:27", birthTimeUnknown: false, mbtiType: "ENTJ" as const, context: { relationshipStatus: "single", jobStatus: "business_owner", detailJob: "사업" } };
const C2_APPROX = { ...PEOPLE.c2, birthTimeUnknown: false, approximateBirthTimeSlot: "OSI", birthTime: "" };
const brief = (product: string, person: object, extra: object = {}) => buildBrief({ product, person, baseDate: BASE, ...extra } as never, k);

/** 저장된 P6c 원고(.final.md)를 FinalChapter로: 장 번호로 계획(id·keys)을 붙인다. */
function stored(file: string, b: Brief): { chapters: FinalChapter[]; plan: readonly WriterChapter[] } {
  const plan = buildWriterPrompt(b).chapters;
  const text = readFileSync(join(ROOT, "docs/v5/trial/p6c/final", file), "utf8").replace(/⟪|⟫/g, "");
  const chapters = parseChapters(text).map(c => { const p = plan.find(x => x.n === c.n)!; return { n: c.n, id: p.id, title: c.title, sections: c.sections, source: "writer" as const, chars: 0, ...(p.keys ? { keys: p.keys } : {}) }; });
  return { chapters, plan };
}
const flagged = (flags: readonly LintFlag[], rule: string, part: string) => flags.some(f => f.rule === rule && (f.sentence.includes(part) || (f.paragraph >= 0 && f.detail?.includes(part))));
const lintStored = (file: string, b: Brief) => { const { chapters, plan } = stored(file, b); return { flags: lintBook(chapters, lintContext(b, k, plan, [])), chapters }; };

describe("P6d A 십성 묶음 세기 = 만세력 오행 칸 가중값 하나", () => {
  it("하람 회귀: 관성 강 · 비겁 강 · 식상 보통 · 인성 약 · 재성 약(브리프·커리어 근거·검사가 같은 값)", () => {
    const s = calculateSaju({ birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "" as never, calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul" });
    const g = groupStrength(s);
    expect([g.OFFICER.level, g.PEER.level, g.OUTPUT.level, g.RESOURCE.level, g.WEALTH.level]).toEqual(["strong", "strong", "medium", "weak", "weak"]);
    expect([g.OFFICER.value, g.PEER.value, g.OUTPUT.value]).toEqual([s.elements.weighted.WATER, s.elements.weighted.FIRE, s.elements.weighted.EARTH].map(v => Math.round(v * 100) / 100));
    for (const product of ["saju_mbti_full", "career_money_study", "love_marriage_child"]) expect(brief(product, PEOPLE.c1).chart.groups!.levels).toEqual({ 비겁: "강", 식상: "보통", 재성: "약", 관성: "강", 인성: "약" });
    // 진로 판정(직무·진로 다섯 갈래)도 같은 값: "관성 강함".
    const career = brief("career_money_study", PEOPLE.c1);
    const facts = career.chapters.flatMap(c => (c.sections ?? []).flatMap(x => x.materials)).flatMap(m => m.kind === "evidence" ? m.facts : []).join(" ");
    expect(facts).toMatch(/관성\(책임·규칙\) 강함/); expect(facts).not.toMatch(/관성[^ ]{0,8} 보통|식상[^ ]{0,8} (옅|약)/);
    // 하람: 엔진 구조 판정은 "식상 강한 구조"였지만 만세력 칸은 보통 → 그 특성을 고르지 않는다.
    expect(brief("saju_mbti_full", PEOPLE.c1).traits.map(t => t.featureId)).not.toContain("structure:OUTPUT_HEAVY");
  });
  it("세기 말이 엔진 단계와 다르면 실패(같은 책·같은 고객의 다른 책 모두 같은 단계)", () => {
    const lv = brief("saju_mbti_full", PEOPLE.c1).chart.groups!.levels;
    expect(L.groupClaimMismatch("책임·규칙의 힘(관성)이 하람님에게는 보통 수준이라", lv)).toBe("관성:보통≠강");
    expect(L.groupClaimMismatch("표현을 담당하는 기운(식상)이 옅어서, 말보다 행동으로 챙겨요.", lv)).toBe("식상:약≠보통");
    expect(L.groupClaimMismatch("만들어 내는 힘(식상)이 보통 수준이어서 꾸준히 밀고 가요.", lv)).toBeNull();
    // 같은 고객 세 상품의 브리프 단계가 한 값이라, 원고마다 엔진 단계로 검사하면 책끼리도 같다.
    const books = ["saju_mbti_full", "career_money_study", "love_marriage_child"].map(p => brief(p, PEOPLE.c1).chart.groups!.line);
    expect(new Set(books).size).toBe(1);
  });
});

describe("P6d B 조각 문장 금지(삭제 → 수리, 사실·금지 규칙만 문단째)", () => {
  it("인용 물음 뒤 받는 말은 같은 문장(\"…?\" 하는 물음), 앞 구절이 빠진 문장·예고·개수 지시는 걸린다", () => {
    expect(splitSentences('2028년은 "이게 맞나?" 하는 물음이 자주 올라와요. 다음 문장이에요.')).toEqual(['2028년은 "이게 맞나?" 하는 물음이 자주 올라와요.', "다음 문장이에요."]);
    expect(D.fragmentSentence("하는 물음이 자주 올라와요.")).toBe(true);
    expect(D.fragmentSentence("이 달은 정리하는 달이에요.")).toBe(false);
    expect(D.emptyPreview("한 달 뒤에는 이런 변화가 있을 거예요.", "작아 보여도 이 세 가지가 패턴을 끊어 줘요.")).toBe(true);
    expect(D.emptyPreview("한 달 뒤에는 이런 변화가 있을 거예요.", "첫째, 아침이 가벼워져요.")).toBe(false);
    expect(D.countMismatch("관계 쪽에서는 한 가지만 바꿔 보세요. 결론 전에 안부를 붙이는 거예요. 한 달 뒤에는 이런 변화가 있을 거예요. 작아 보여도 이 세 가지가 패턴을 끊어 줘요.")).toEqual(["이 세 가지"]);
    expect(D.countMismatch("정리 하나, 말 한마디, 쉬는 하루만 붙잡으세요. 그 세 가지면 충분해요.")).toEqual([]);
  });
  it("수리 뒤 남은 사실 규칙은 문단째 빼고(조각 문장 0), 문체 규칙은 문단을 둔다", () => {
    const ch: FinalChapter = { n: 2, id: "x", title: "x", source: "writer", chars: 0, sections: [{ heading: "h", paragraphs: ["좋은 문장이에요. 하는 물음이 자주 올라와요.", "같은 장면 문장이 반복돼요.", "세 번째 문단이에요."] }] };
    const flags: LintFlag[] = [{ chapter: 2, section: 0, paragraph: 0, rule: "fragment", sentence: "하는 물음이 자주 올라와요.", hint: "" }, { chapter: 2, section: 0, paragraph: 1, rule: "scene_repeat", sentence: "같은 장면 문장이 반복돼요.", hint: "" }];
    const e = enforce([ch], flags);
    expect(e.chapters[0].sections[0].paragraphs).toEqual(["같은 장면 문장이 반복돼요.", "세 번째 문단이에요."]);
    expect(e.removed).toBe(0);
  });
});

describe("P6d C·E 사실·위치·시점", () => {
  it("대운 연도마다 '대운 안 몇 번째 해': 수진 2031 = 마지막 해, '중간쯤'은 실패", () => {
    const b = brief("major_fortune", PEOPLE.x);
    const e2031 = b.timeline!.entries.find(e => e.key === "2031")!;
    expect(e2031.dayun).toMatchObject({ yearIndex: 10, total: 10 }); expect(e2031.dayun!.position).toMatch(/10번째 해\(마지막 해\)/);
    expect(D.dayunYearClaim("지금 대운(2022~2031)의 중간쯤을 지나는 시기라, 판을 넓혀요.", 10)).toBe("middle≠10/10");
    expect(D.dayunYearClaim("대운의 마지막 해라 정리가 먼저예요.", 10)).toBeNull();
    expect(D.dayunYearClaim("이번 10년 흐름의 마지막 해예요.", 9)).toBe("last≠9/10");
    // 전환 해 머리 문장은 새 대운 이름과 십성.
    expect(b.timeline!.entries.find(e => e.key === "2032")!.head).toBe("2032년 임자(壬子)는 정관(正官)이 하늘에, 편관(偏官)이 땅에 들어오는 해예요. 이 해부터 경신(庚申) 대운이 시작되고, 10년의 중심 기운은 정재(正財)예요.");
  });
  it("궁합 '둘 다 X'는 두 사람 엔진 값으로: 하람×서윤 '둘 다 재성이 부족'·'둘 다 태가 있고'·'둘 다 관살혼잡'", () => {
    const b = brief("saju_mbti_compatibility", PEOPLE.c1, { partner: PEOPLE.c2, relationshipType: "love" });
    const ctx = lintContext(b, k, buildWriterPrompt(b).chapters, []);
    const claims = D.pairBothClaims("두 사람은 닮은 점이 꽤 있습니다. 둘 다 재성이 부족하고, 둘 다 속뜻을 읽는 천문성이 있으며, 둘 다 태가 있고, 둘 다 관살혼잡입니다.", ctx.pair!);
    expect(claims).toContain("재성:약");
    const has = (i: 0 | 1, name: string) => ctx.pair!.features[i].has(name);
    if (!(has(0, "태") && has(1, "태"))) expect(claims).toContain("feature:태");
    if (!(has(0, "관살혼잡") && has(1, "관살혼잡"))) expect(claims).toContain("feature:관살혼잡");
  });
  it("자기 정정·장 번호·오행 부재('원국에 없어서')·시점('지금 우리가 있는')·세운 달력월('1월에 본 결')", () => {
    expect(D.selfCorrection("처음에는 정인(正人이 아니라 正印)의 속도로 다가가요.")).toBe(true);
    expect(D.selfCorrection("정인(正印)은 받는 기운이에요.")).toBe(false);
    expect(D.CHAPTER_REF.test("6장에서 본 것처럼 두 사람은 속상해도 티를 내지 않아요.")).toBe(true);
    expect(D.dropChapterRef("8장에서 본 것처럼 서운함은 나눠 말해요.")).toBe("서운함은 나눠 말해요.");
    const me = brief("saju_mbti_full", ME);
    expect(L.elementAbsenceClaims("계수 같은 물 기운이 원국에 없어서 일은 되는데 사람이 먼저 바닥납니다.", me.chart.elements.presence as L.ElementPresence)).toEqual(["WATER"]);
    expect(L.elementAbsenceClaims("물 기운은 겉에는 없고 땅속에 조금 있어요.", me.chart.elements.presence as L.ElementPresence)).toEqual([]);
    expect(D.timeDeictic("무술월은 지금 우리가 있는 달이에요.", true)).toBe(true);
    expect(D.timeDeictic("올해 남은 두 달은 정리해요.", false)).toBe(true);
    expect(D.timeDeictic("지금 하는 일과 잘 맞아요.", false)).toBe(false);
    expect(D.calendarMonth("앞서 1월에 한 번 본 결이에요.")).toBe(true);
    expect(D.calendarMonth("이 책은 2026년 11월 4일 기준으로 썼어요.")).toBe(false);
  });
  it("MBTI 통념 궁합표: 흔히 도는 표대로 ENTJ×INFP 좋음(천생연분), NF×S 노력, 표는 대칭", () => {
    const fit = (a: string, b: string) => k.mbti.get(a as never)!.conventionalCompat.find(x => x.type === b)!.fit;
    expect(fit("ENTJ", "INFP")).toBe("좋음"); expect(fit("INFP", "ENTJ")).toBe("좋음");
    expect(fit("INFP", "ESTJ")).toBe("노력"); expect(fit("ENFJ", "ISFP")).toBe("좋음"); expect(fit("INTJ", "ISTJ")).toBe("보통");
    for (const p of k.mbti.values()) for (const c of p.conventionalCompat) expect(fit(c.type, p.type), `${p.type}↔${c.type}`).toBe(c.fit);
  });
});

describe("P6d D 카드(대운·세운)", () => {
  it("살필 점 결정론 값은 그 해 조합에서 고르고 같은 문장을 다시 쓰지 않는다(수진 2023 ≠ 2033, 같은 癸 편관 해)", () => {
    const b = brief("major_fortune", PEOPLE.x);
    const c = (key: string) => b.timeline!.entries.find(e => e.key === key)!.caution;
    expect(c("2023")).toBeTruthy(); expect(c("2033")).toBeTruthy(); expect(c("2023")).not.toBe(c("2033"));
    const all = b.timeline!.entries.map(e => e.caution).filter(Boolean);
    expect(new Set(all).size).toBe(all.length);
  });
  it("작가 카드: 살필 점 필수, 같은 천간 십성 key끼리 더 엄격한 겹침, 발행일 전은 돌아보기 질문형", () => {
    const ch: FinalChapter = { n: 5, id: "yearly", title: "x", source: "writer", chars: 0, keys: ["2023", "2033"], sections: [
      { heading: "2023", paragraphs: ["본문"], card: { image: "혼자 서류를 넘기는 늦은 밤", todo: "도움 청할 사람 한 명을 정하세요", caution: "혼자 짊어진 책임이 쉬는 날을 지우지 않게" } },
      { heading: "2033", paragraphs: ["본문"], card: { image: "새 책임표가 붙은 책상 앞", todo: "일정표에 쉬는 날부터 적어 두세요", caution: "혼자 짊어진 책임이 쉬는 날까지 지우지 않게" } },
    ] };
    const base = lintContext(brief("major_fortune", PEOPLE.x), k, buildWriterPrompt(brief("major_fortune", PEOPLE.x)).chapters, []);
    const flags = lintCards([ch], { ...base, periods: { 2023: "past", 2033: "future" } });
    expect(flags.map(f => `${f.section}:${f.card}:${f.rule}`)).toEqual(expect.arrayContaining(["0:review:card_missing", "0:review:card_form", "1:caution:card_overlap"]));
  });
  it("머리 문장(결정론)·1장 기준 날짜·투자 안내를 조립 직전에 넣고, 작가가 쓴 머리 문장은 뗀다", () => {
    const b = brief("major_fortune", PEOPLE.x);
    const chs: FinalChapter[] = [{ n: 1, id: "a", title: "a", source: "writer", chars: 0, sections: [{ heading: "h", paragraphs: ["첫 문단이에요."] }] },
      { n: 5, id: "yearly", title: "y", source: "writer", chars: 0, keys: ["2028"], sections: [{ heading: "2028", paragraphs: ["2028년 무신(戊申)은 상관(傷官)이 하늘에, 정재(正財)가 땅에 들어오는 해예요. 말이 날카로워지는 해예요."] }] }];
    const out = insertFixedLines(chs, b);
    expect(out[0].sections[0].paragraphs[0]).toBe("이 책은 2026년 11월 4일 기준으로 썼어요. 첫 문단이에요.");
    expect(out[1].sections[0].paragraphs[0]).toBe(`${b.timeline!.entries.find(e => e.key === "2028")!.head} 말이 날카로워지는 해예요.`);
    const c = brief("career_money_study", PEOPLE.c1);
    const inv = insertFixedLines([{ n: 1, id: "engine", title: "e", source: "writer", chars: 0, sections: [{ heading: "h", paragraphs: ["엔진이에요."] }] }, { n: 8, id: "invest", title: "i", source: "writer", chars: 0, sections: [{ heading: "h", paragraphs: ["원칙이에요."] }] }], c);
    expect(inv[1].sections[0].paragraphs[0]).toBe(`${D.INVEST_NOTICE} 원칙이에요.`);
    expect(insertFixedLines(inv, c)[1].sections[0].paragraphs[0]).toBe(`${D.INVEST_NOTICE} 원칙이에요.`); // 한 번만
    const own = insertFixedLines([inv[0], { ...inv[1], sections: [{ heading: "h", paragraphs: ["이 장은 투자 권유가 아니라 성향을 읽는 이야기예요. 원칙이에요."] }] }], c);
    expect(own[1].sections[0].paragraphs[0]).toBe("이 장은 투자 권유가 아니라 성향을 읽는 이야기예요. 원칙이에요."); // 작가가 쓴 안내가 있으면 넣지 않는다
  });
});

describe("P6d F 아이디어 원장(같은 고객의 다음 책은 쓴 각도·씨앗을 쓰지 않는다)", () => {
  const full = brief("saju_mbti_full", PEOPLE.c1);
  const l1 = ledgerOf(full);
  const nextOpts = (ls: ReturnType<typeof ledgerOf>[], prev: Brief[]) => ({ excludeAngles: ls.flatMap(l => l.angles), excludeSeeds: ls.flatMap(l => l.seeds), priorEvidence: ls.flatMap(l => l.evidence), excludeScenes: prev.flatMap(usedScenesOf) });
  const career = brief("career_money_study", PEOPLE.c1, nextOpts([l1], [full]));
  const l2 = ledgerOf(career);
  const pair = brief("saju_mbti_compatibility", PEOPLE.c1, { partner: PEOPLE.c2, relationshipType: "love", ...nextOpts([l1, l2], [full, career]) });
  it("하람 종합이 쓴 '서운함이 터진다'(丁×ENTJ)·'식신은 따라간다'(식신×ENTJ)·설거지 장면은 커리어·궁합에 다시 가지 않는다", () => {
    expect(l1.angles).toEqual(expect.arrayContaining(["tenGod:食神:fusion:ENTJ"]));
    expect(l1.angles.some(a => /^day(Pillar|Master):丁/.test(a) && a.endsWith(":fusion:ENTJ"))).toBe(true);
    for (const b of [career, pair]) {
      const w = JSON.stringify(renderWriterBrief(b));
      for (const t of b.traits.filter(t => t.id.startsWith("a") || !t.id.startsWith("b"))) if (t.fusion) expect(l1.angles, `${b.product} ${t.featureId}`).not.toContain(`${t.featureId}:fusion:${t.fusion.target}`);
      expect(w, b.product).not.toMatch(/설거지/);
      expect(w, b.product).not.toMatch(/정해진 대로 따라가는 (편|쪽)/);
    }
    expect(JSON.stringify(renderWriterBrief(full))).toMatch(/설거지|정해진 대로 따라가는/); // 종합(첫 책)에는 있었다
  });
  it("심화 상품 근거 항목의 60% 이상은 종합에서 쓰지 않은 것, MBTI 씨앗은 겹치지 않는다", () => {
    expect(newEvidenceShare(l2, l1)).toBeGreaterThanOrEqual(0.6);
    const love = ledgerOf(brief("love_marriage_child", PEOPLE.c1, nextOpts([l1], [full])));
    expect(newEvidenceShare(love, l1)).toBeGreaterThanOrEqual(0.6);
    expect(l2.seeds.filter(x => l1.seeds.includes(x))).toEqual([]);
    expect(l1.seeds.length + l2.seeds.length).toBeGreaterThan(0);
  });
  it("MBTI 씨앗은 유형 × 영역 30개 이상, 명리 근거·입력 맥락이 있는 절에만 놓인다", () => {
    for (const [type, seeds] of k.mbtiSeeds) for (const d of ["work", "money", "love", "relationships", "alone"]) expect(seeds[d]?.length ?? 0, `${type}.${d}`).toBeGreaterThanOrEqual(30);
    for (const b of [full, career]) for (const c of b.chapters) for (const s of c.sections ?? []) if (s.materials.some(m => m.kind === "mbti" && m.seedId)) expect(s.materials.some(m => m.kind === "trait" || m.kind === "evidence" || m.kind === "ref" || m.kind === "rel"), `${c.id} ${s.q}`).toBe(true);
  });
  it("소품 원장: 같은 소품은 책당 1회(힌트 1장), 연애 책 전체·종합 연애·가족 장은 직업 소품 금지", () => {
    for (const b of [full, career]) for (const n of Object.values(b.usedProps ?? {})) expect(n).toBe(1);
    const love = brief("love_marriage_child", PEOPLE.c1);
    const ctx = lintContext(love, k, buildWriterPrompt(love).chapters, []);
    expect(ctx.noJobChapters.size).toBe(9);
  });
});

describe("P6d G 커리어·연애 재설계", () => {
  it("커리어 9장·연애 9장, 장마다 필수 근거가 브리프에 있다", () => {
    for (const [product, req] of [["career_money_study", CAREER_REQUIRED], ["love_marriage_child", LOVE_REQUIRED]] as const) for (const p of [PEOPLE.c1, PEOPLE.x, PEOPLE.y, ME]) {
      const b = brief(product, p);
      expect(b.chapters.map(c => c.id)).toEqual(Object.keys(req));
      for (const c of b.chapters) { const keys = (c.sections ?? []).flatMap(s => s.materials).flatMap(m => m.kind === "evidence" ? [m.key] : []); for (const e of req[c.id].evidence) expect(keys, `${product} ${p.name} ${c.id} ${e}`).toContain(e); }
    }
  });
  it("상태마다 2·3·4·6·7장(연애 3·4·7·8·9장) 절이 달라지고, 상태 미입력은 단정하지 않는다", () => {
    const qOf = (b: Brief) => b.chapters.flatMap(c => (c.sections ?? []).map(s => `${c.id}:${s.q}`)).join("|");
    const withStatus = (s: string, r = "single") => ({ ...PEOPLE.c1, context: { relationshipStatus: r, jobStatus: s, detailJob: s === "job_seeker" ? "" : "서비스 기획자" } });
    const qs = ["employee", "business_owner", "freelancer", "student", "job_seeker", "homemaker", "other", ""].map(s => qOf(brief("career_money_study", withStatus(s))));
    expect(new Set(qs).size).toBe(8);
    const unknown = brief("career_money_study", withStatus(""));
    const note = unknown.chapters.find(c => c.id === "now")!.sections![1].materials.find(m => m.kind === "evidence")!;
    expect(JSON.stringify(note)).toMatch(/단정하지 말고/);
    const ls = ["single", "some", "dating", "married", ""].map(r => qOf(brief("love_marriage_child", withStatus("employee", r))));
    expect(new Set(ls).size).toBe(5);
  });
  it("투자 장: 종목·상품·시점 금지 검사, 근거에 지시 없음", () => {
    expect(D.INVEST_DIRECTIVE.test("지금 사 두세요")).toBe(true); expect(D.INVEST_DIRECTIVE.test("장기 분산형이 맞는 성향")).toBe(false);
    const c = brief("career_money_study", PEOPLE.c1);
    const inv = c.chapters.find(x => x.id === "invest")!;
    const facts = (inv.sections ?? []).flatMap(s => s.materials).flatMap(m => m.kind === "evidence" ? m.facts : []);
    expect(facts.length).toBeGreaterThan(5);
    for (const f of facts) expect(f).not.toMatch(D.INVEST_DIRECTIVE);
  });
});

describe("P6d H 지난 판독 문장 회귀(저장된 P6c 책을 새 검사로)", () => {
  it("커리어 하람 '관성이 하람님에게는 보통 수준' · 종합 하람 '식상이 옅어서'", () => {
    expect(flagged(lintStored("c1-career.final.md", brief("career_money_study", PEOPLE.c1)).flags, "group_claim", "관성)이 하람님에게는 보통 수준")).toBe(true);
    expect(flagged(lintStored("c1-full.final.md", brief("saju_mbti_full", PEOPLE.c1)).flags, "group_claim", "식상)이 옅어서")).toBe(true);
  });
  it("대운 수진 '하는 물음이 자주 올라와요'(조각) · 2031 '중간쯤'(위치)", () => {
    const { flags } = lintStored("x-major.final.md", brief("major_fortune", PEOPLE.x));
    expect(flagged(flags, "fragment", "하는 물음이 자주 올라와요")).toBe(true);
    expect(flags.some(f => f.rule === "dayun_year" && f.sentence.includes("중간쯤"))).toBe(true);
  });
  it("연애 도현 '정인(正人이 아니라 正印)'", () => {
    expect(flagged(lintStored("y-love.final.md", brief("love_marriage_child", PEOPLE.y)).flags, "self_correction", "正人이 아니라")).toBe(true);
  });
  it("궁합 하람×서윤 '둘 다 태가 있고, 둘 다 관살혼잡' · '둘 다 재성이 부족'", () => {
    const { flags } = lintStored("pair-love.final.md", brief("saju_mbti_compatibility", PEOPLE.c1, { partner: PEOPLE.c2, relationshipType: "love" }));
    expect(flagged(flags, "pair_both", "둘 다 재성이 부족")).toBe(true);
  });
  it("세운 서윤 '지금 우리가 있는 달' · '1월에 한 번 본 결'", () => {
    const { flags } = lintStored("c2-annual.final.md", brief("annual_fortune", C2_APPROX, { selectedYear: 2026 }));
    expect(flagged(flags, "time_deictic", "지금 우리가 있는 달")).toBe(true);
    expect(flagged(flags, "calendar_month", "1월에 한 번 본 결")).toBe(true);
  });
  it("종합 장덕민 '원국에 없어서' · '이런 변화가 있을 거예요.'(예고) · '이 세 가지'(개수)", () => {
    const { flags } = lintStored("me-full.final.md", brief("saju_mbti_full", ME));
    expect(flagged(flags, "element_claim", "원국에 없어서")).toBe(true);
    expect(flagged(flags, "empty_preview", "이런 변화가 있을 거예요")).toBe(true);
    expect(flags.some(f => f.rule === "count_mismatch" && f.sentence.includes("세 가지"))).toBe(true);
  });
});
