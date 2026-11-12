/** AM2: 세운·대운 장 묶음 작가 — 입력 정화·브리프 검사·묶음 계획·차단 검사·실행기·발행(가짜 작가, 호출 0). */
import { FLOW_DESC } from "@/lib/brief/labels";
import { describe, expect, it } from "vitest";
import { buildBrief } from "@/lib/brief";
import { payloadToBriefInput } from "@/lib/writer/book";
import { buildWriterPrompt } from "@/lib/writer/prompt";
import { kstDate, writerKnowledge } from "@/lib/writer/publish";
import { buildIntake, say, sceneFits, shiftPhase, untime } from "@/lib/writer/chunked/intake";
import { adviceRepeats, blockFlags, briefCheck, crossRepeats, headPair, PIGGYBACK_RULES, skyGroundIssue } from "@/lib/writer/chunked/check";
import { blockCtxFor } from "@/lib/writer/chunked/publish";
import { nativeNumbers } from "@/lib/writer/safety/p6e";
import { cutFlagged } from "@/lib/writer/chunked/cut";
import { reviewLine } from "@/lib/brief/timeline";
import { bookNotice } from "@/lib/writer/safety/p6e";
import { chunkHeaders, chunkPlan, chunkUser, renderCard } from "@/lib/writer/chunked/prompt";
import { chunkDone, mergeParts, partsOf } from "@/lib/writer/chunked/run";
import { writerModeOf } from "@/lib/writer/mode";
import { anthropicDriver } from "@/lib/llm/providers";
import type { FinalChapter } from "@/lib/writer/safety";

const AT = "2026-12-02T03:00:00.000Z";
const payload = (productKey: "annual_fortune" | "major_fortune", over: Record<string, unknown> = {}) => ({
  productKey, productSlug: productKey === "annual_fortune" ? "annual-fortune" : "major-fortune",
  person: { name: "한서윤", birthDate: "1998-04-17", birthTime: "08:20", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "FEMALE", mbtiType: "ENFP" },
  userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "", focusAreas: [] },
  productOptions: productKey === "annual_fortune" ? { selectedYear: "2027", wish: "지금 회사에서 인정받고 싶어요" } : {}, ...over,
});
function setup(productKey: "annual_fortune" | "major_fortune") {
  const { k } = writerKnowledge(), p = payload(productKey);
  const brief = buildBrief(payloadToBriefInput(p as never, kstDate(AT), AT) as never, k);
  const plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
  return { k, brief, plan, intake: buildIntake(brief, k, plan, (p.productOptions as { wish?: string }).wish) };
}

describe("AM2 상품별 작가 방식", () => {
  it("세운·대운만 장 묶음, 4종은 책 1권 = 작가 1회", () => {
    expect(writerModeOf("annual_fortune")).toBe("chunked"); expect(writerModeOf("major_fortune")).toBe("chunked");
    for (const p of ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"]) expect(writerModeOf(p)).toBe("book");
  });
});

describe("AM2 1부 입력 정화", () => {
  it("시점 말·라벨·화살표·점수를 뺀다(고객 바람 «»은 그대로)", () => {
    expect(untime("지금 회사에서 올해 이번 달", 2027)).toBe("회사에서 2027년 그 달");
    expect(say("흐름 세기 3/5(참고) → 고르게 다질 해 — 근거: 이미 많은 기운이 더 들어옴 -1, 태어난 날 기둥과 합 +0.5")).toBe("흐름이 보통인 편 · 고르게 다질 해 — 이미 많은 기운이 더 들어옴, 태어난 날 기둥과 합");
    expect(say("장바구니는 하루 두기")).toBe("장바구니는 하루 묵혀 두기");
    expect(say("텃밭 흙처럼 돌봅니다. 꼼꼼히 챙깁니다.")).toBe("꼼꼼히 챙깁니다.");
    const { intake } = setup("annual_fortune");
    expect(intake.person.join("\n")).toContain("«지금 회사에서 인정받고 싶어요»");
  });
  it("입력에 맞지 않는 장면(연차 소품·연인·자녀·학교)은 거른다", () => {
    const { brief } = setup("annual_fortune");
    expect(sceneFits("사수에게 물어볼 질문", brief)).toBe(false);
    expect(sceneFits("막내 업무를 맡는 날", brief)).toBe(false);
    expect(sceneFits("연인과 주말 데이트", brief)).toBe(false);
    expect(sceneFits("아이 어린이집 등원", brief)).toBe(false);
    expect(sceneFits("점심 메뉴를 고르는 시간", brief)).toBe(true);
  });
  it("브리프 검사: 세운·대운 카드·설계도에 위반 0, 심어 둔 제약·시점·약어·한자는 잡는다", () => {
    for (const p of ["annual_fortune", "major_fortune"] as const) expect(briefCheck(setup(p).intake)).toEqual([]);
    const { intake } = setup("major_fortune");
    const bad = { ...intake, lines: [...intake.lines, { id: "D99", subject: "dayun" as const, value: "지금 대운", meaning: "사건은 단정하지 않는다", use: [] }, { id: "N99", subject: "natal" as const, value: "하루 두기", meaning: "甲木 → 성장", use: [] }] };
    expect(briefCheck(bad).map(x => x.rule).sort()).toEqual(["abbr", "hanja", "notice", "time"]);
    expect(renderCard(intake)).not.toMatch(/"rule"|forbiddenFacts|\(참고\)|act::/);
  });
  it("명리 × MBTI 연결은 짝으로만(MBTI가 없으면 짝도 없다)", () => {
    const { intake } = setup("annual_fortune");
    expect(intake.pairs.length).toBeGreaterThan(0);
    for (const p of intake.pairs) { expect(intake.lines.find(l => l.id === p.mbti)?.subject).toBe("mbti"); expect(intake.lines.find(l => l.id === p.myeongri)?.subject).not.toBe("mbti"); }
    const { k } = writerKnowledge(), np = payload("annual_fortune", { person: { ...payload("annual_fortune").person, mbtiType: "" } });
    const b2 = buildBrief(payloadToBriefInput(np as never, kstDate(AT), AT) as never, k);
    expect(buildIntake(b2, k, buildWriterPrompt(b2, { knowledge: k }).chapters).pairs).toEqual([]);
  });
});

describe("AM2 2부 장 묶음", () => {
  it("세운 6묶음·대운 6묶음이 모든 장·key를 정확히 한 번씩 덮고, 1장 묶음이 먼저", () => {
    for (const p of ["annual_fortune", "major_fortune"] as const) {
      const { intake, plan } = setup(p), chunks = chunkPlan(intake);
      expect(chunks).toHaveLength(6);
      expect(chunks[0].parts.some(x => x.n === 1)).toBe(true);
      const keyed = plan.find(c => c.keys)!, keys = chunks.flatMap(c => c.parts.filter(x => x.n === keyed.n).flatMap(x => x.keys ?? []));
      expect(keys).toEqual(keyed.keys);
      expect(chunks.flatMap(c => c.parts.filter(x => !x.keys).map(x => x.n)).sort((a, b) => a - b)).toEqual(plan.filter(c => !c.keys).map(c => c.n));
      for (const c of chunks) { expect(c.chars[1]).toBeLessThanOrEqual(4300); expect(chunkUser(intake, c)).toContain(chunkHeaders(intake, c)); }
    }
  });
  it("두 묶음이 쓴 달 key를 한 장으로 합치고, 끝난 묶음을 알아본다", () => {
    const { intake, plan } = setup("annual_fortune"), chunks = chunkPlan(intake);
    const a = chunks[2], b = chunks[3], keyed = plan.find(c => c.keys)!;
    const textOf = (keys: readonly string[]) => `## ${keyed.n}. ${keyed.title}\n${keys.map(k => `### ${k}\n문단 하나입니다. 둘째 문장입니다.\n\n[그림] 창가에 앉은 오후의 그림 한 줄\n`).join("\n")}`;
    const drafts = new Map();
    mergeParts(drafts, partsOf(textOf(a.parts.find(x => x.keys)!.keys!), a, plan), plan, "writer");
    mergeParts(drafts, partsOf(textOf(b.parts[0].keys!), b, plan), plan, "writer");
    expect(drafts.get(keyed.n).chapter.sections.map((s: { heading: string }) => s.heading)).toEqual(keyed.keys!.slice(0, 9));
    expect(chunkDone(b, drafts)).toBe(true); expect(chunkDone(chunks[4], drafts)).toBe(false);
  });
  it("Anthropic 요청: 시스템 덩어리마다 캐시 표시(작가 규칙 · 인물 카드)", () => {
    const body = anthropicDriver.body({ provider: "anthropic", model: "claude-sonnet-5-5", system: "규칙\n\n카드", systemParts: ["규칙", "카드"], user: "u", maxOutputTokens: 100, timeoutMs: 1000, thinking: "adaptive-low" }) as { system: { text: string; cache_control?: unknown }[]; thinking: unknown };
    expect(body.system.map(x => x.text)).toEqual(["규칙", "카드"]); expect(body.system.every(x => x.cache_control)).toBe(true); expect(body.thinking).toEqual({ type: "adaptive" });
  });
});

describe("AM2 3부 차단 검사", () => {
  const fc = (n: number, ps: string[], keys?: string[]): FinalChapter => ({ n, id: `c${n}`, title: "t", source: "writer", chars: 0, sections: keys ? keys.map((k, i) => ({ heading: k, paragraphs: [ps[i] ?? ""] })) : [{ heading: "h", paragraphs: ps }], ...(keys ? { keys } : {}) });
  it("근거 id·내부 약어·곧 넘어가는 대운(멀 때)·근거 주인", () => {
    const { intake } = setup("annual_fortune");
    const owner = intake.lines.find(l => l.subject === "natal" && l.meaning.length > 30 && !intake.pairs.some(p => p.myeongri === l.id))!;
    const phrase = owner.meaning.replace(/[^가-힣 ]/g, "").slice(0, 18);
    const flags = blockFlags([fc(1, ["N7 근거로 보면 좋아요. 하루 두기를 지키세요.", `ENFP는 ${phrase} 쪽이에요. 곧 임자 대운으로 넘어가요.`])], [], { intake, mbtiAnchor: /ENFP/, yearsToNextDayun: 5 });
    expect(flags.map(f => f.rule)).toEqual(expect.arrayContaining(["code_leak", "abbr_leak", "evidence_owner", "dayun_soon"]));
    expect(blockFlags([fc(1, ["곧 임자 대운으로 넘어가요."])], [], { intake, yearsToNextDayun: 1 })).toEqual([]);
  });
  it("장 사이 반복은 다른 장끼리만(같은 장 안 비슷한 문장은 보지 않는다)", () => {
    const s = "이 시기에는 작은 약속 하나를 끝까지 지키는 쪽이 마음을 가장 편하게 해 줍니다.";
    expect(crossRepeats([fc(1, [s, s])])).toEqual([]);
    expect(crossRepeats([fc(1, [s]), fc(2, [s])]).map(f => f.chapter)).toEqual([2]);
  });
});

describe("AM2 P 판독 고침(2026-11-11, 저장된 P 원문의 결함 문장)", () => {
  const fc = (n: number, ps: string[], keys?: string[]): FinalChapter => ({ n, id: `c${n}`, title: "t", source: "writer", chars: 0, sections: keys ? keys.map((k, i) => ({ heading: k, paragraphs: [ps[i] ?? ""] })) : [{ heading: "h", paragraphs: ps }], ...(keys ? { keys } : {}) });
  it("하늘·땅 배치: 「X 위에 Y가 앉아」·「X가 하늘에」를 머리 문장과 대조", () => {
    const p = headPair("2029년 기유는 정재가 하늘에, 정관이 땅에 들어오는 해예요.")!;
    expect(p).toEqual({ sky: "정재", ground: "정관" });
    expect(skyGroundIssue("정해진 돈이 들어오는 정재 위에 소속과 역할을 또렷하게 해 주는 정관이 앉아서, 평판이 쌓여요.", p)).toMatch(/정재 위에 정관/);
    expect(skyGroundIssue("정관 위에 정재가 앉아 규칙을 지킨 만큼 돈이 따라와요.", p)).toBeNull();
    expect(skyGroundIssue("작고 확실한 돈에 눈이 가는 정재가 하늘에, 규칙을 두는 정관이 땅에 있어요.", p)).toBeNull();
    expect(skyGroundIssue("정관의 기준이 하늘에 걸려 평가가 또렷해져요.", p)).toMatch(/정관/);
  });
  it("대운: 앞날 씨앗 사건 단정 · 지난 3년 단정 · 짝 없는 MBTI · 읽기 지시를 잡고, 부드러운 꼴은 통과", () => {
    const { intake } = setup("major_fortune");
    const ch = intake.chapters.find(c => c.keys)!, kp = ch.keys!.find(k => k.when === "future" && k.scene)!;
    const past = intake.chapters.find(c => c.id === "past")!;
    const flags = blockFlags([
      fc(past.n, ["지난 세 해가 그런 결이었어요. 도움받던 자리에서 내 이름을 걸고 겨루는 자리로 옮겨 온 3년이에요. 그때 마음이 먼저 움직였다면 그 결을 기억해 두세요. 2024년 갑진년은 비견이 들어온 해였어요."]),
      fc(ch.n, [`${kp.scene!.replace(/[.!]$/, "")}는 해입니다. ENFP답게 깊이 들어갑니다.`], [kp.key]),
      fc(9, ["아직 솔로이니, 이런 사람이 생기면 하는 이야기로 읽어 주세요."]),
    ], [], { intake, mbtiType: "ENFP", mbtiAnchor: /ENFP/ });
    const rules = flags.map(f => `${f.chapter}:${f.rule}`);
    expect(rules.filter(r => r === `${past.n}:past_assert`)).toHaveLength(2);
    expect(rules).toEqual(expect.arrayContaining([`${ch.n}:future_event`, `${ch.n}:evidence_owner`, "9:reader_directive"]));
    expect(blockFlags([fc(ch.n, [`${kp.scene!.replace(/[.!]$/, "")}는 모습이 어울려요.`], [kp.key])], [], { intake }).filter(f => f.rule !== "must_miss")).toEqual([]);
  });
  it("세운: 명사구 비문 · 일주 꼴 · 카드에 없는 「가장」 · 「이번 한 해」 · 머리 문장 되풀이(경미)", () => {
    const { intake, brief } = setup("annual_fortune");
    // AM2-3: 카드가 동률 끝값 달을 모두 적으므로(「흐름이 가장 잔잔한 달(같은 세기): …」) 목록 밖 달(5월 · 을사월)로 본다.
    const ch = intake.chapters.find(c => c.keys)!, kp = ch.keys![4], pair = headPair(kp.head)!;
    const flows = new Map(ch.keys!.map((k, i) => [k.key, { score: i === 4 ? 2 : i === 5 ? 1 : 3, ganji: k.label.split("· ")[1]?.replace(/월$/, "") ?? "" }]));
    const day = brief.chart.pillars.day.hangul;
    const flags = blockFlags([
      fc(2, ["약속 시간과 돈 계산이 정확한 모습은 믿음을 주는 시기입니다. 답답함은 말로 먼저 터져 나오기 쉬운 때입니다. 이때는 마음이 식은 게 아니라 흐름이 쉬어 가는 때예요.", `태어난 날 ${day}일주의 ${day[1]}화가 여름 불 위에 앉은 구조라 열을 식혀야 해요. 청소가 끝나면 이번 한 해 끝낸 일을 적어 보세요.`]),
      fc(ch.n, [`${pair.sky}가 하늘에, ${pair.ground}가 땅에 있는 달이라 바빠요. 흐름은 가장 잔잔합니다.`], [kp.key]),
    ], [], { intake, dayPillar: day, flows });
    const rules = flags.map(f => f.rule);
    expect(rules.filter(r => r === "noun_predicate")).toHaveLength(2);
    expect(rules).toEqual(expect.arrayContaining(["time_extra", "degree", "head_repeat"]));
    if (day[1] === "오") expect(rules).toContain("pillar_shape");
    expect(PIGGYBACK_RULES.has("head_repeat")).toBe(true);
  });
  it("지우기: 기대는 다음 문장·답을 잃은 물음을 함께, 빈 소제목은 빼고 걸린 소제목은 틀로, 빈 key만 결정론 몫", () => {
    const chapters: FinalChapter[] = [
      { n: 6, id: "mind", title: "t", source: "writer", chars: 0, sections: [
        { heading: "쉴 달은 2월과 3월", paragraphs: ["한 해를 시작하자마자 쉬라니 낯설죠. 하지만 이 두 달에 숨을 고른 사람이 8월도 버팁니다. 그래서 2월에는 일정을 비워요. 물가를 걸으면 열이 내려갑니다."] },
        { heading: "둘째", paragraphs: ["지울 문장 하나뿐입니다."] },
        { heading: "셋째", paragraphs: ["남는 문단입니다. 그대로 둡니다."] } ] },
      { n: 7, id: "month", title: "t", source: "writer", chars: 0, keys: ["2027-M01"], sections: [{ heading: "2027-M01", paragraphs: ["걸린 한 문장입니다."] }] },
    ];
    const flag = (chapter: number, section: number, paragraph: number, sentence: string) => ({ chapter, section, paragraph, rule: "calendar_month", sentence });
    const r = cutFlagged(chapters, [flag(6, 0, 0, "하지만 이 두 달에 숨을 고른 사람이 8월도 버팁니다."), flag(6, 0, -1, "쉴 달은 2월과 3월"), flag(6, 1, 0, "지울 문장 하나뿐입니다."), flag(7, 0, 0, "걸린 한 문장입니다.")], (n, si) => (n === 6 && si === 0 ? "쉬어 갈 때는 언제일까?" : null));
    const six = r.chapters.find(c => c.n === 6)!;
    expect(six.sections.map(s => s.heading)).toEqual(["쉬어 갈 때는 언제일까?", "셋째"]);
    expect(six.sections[0].paragraphs[0]).toBe("물가를 걸으면 열이 내려갑니다.");
    expect(r.cut.map(c => c.why).sort()).toEqual(["flagged", "flagged", "flagged", "leans", "question"]);
    expect(r.emptyKeys).toEqual([{ chapter: 7, key: "2027-M01" }]);
  });
  it("세운 대운 위치는 책의 해 기준 · 돌아보기·끝 안내 문구(세운·대운 전용, 4종 그대로)", () => {
    expect(shiftPhase("대운 안의 위치: 5번째 해(중간), 남은 기간 약 5년 4개월(2032년 4월 무렵까지)", 2027, 1)).toBe("대운 안의 위치: 2027년은 6번째 해(중간), 이 대운은 2032년 4월 무렵까지");
    expect(shiftPhase("앞쪽(3번째 해), 남은 기간 약 7년(2034년 2월 무렵까지)", 2027, 1)).toBe("2027년은 4번째 해(중간), 이 대운은 2034년 2월 무렵까지");
    expect(shiftPhase("마지막 해(10번째 해), 남은 기간 약 3개월(2027년 2월 무렵까지)", 2027, 1)).toContain("10번째 해");
    const { intake } = setup("annual_fortune");
    expect(intake.lines.filter(l => /대운 안의 위치/.test(`${l.value} ${l.meaning}`)).every(l => /2027년은 \d+번째 해/.test(`${l.value} ${l.meaning}`))).toBe(true);
    for (let i = 0; i < 3; i++) expect(reviewLine(["정인", "도움"], i)).not.toMatch(/지금/);
    expect(bookNotice("annual_fortune")).not.toMatch(/타고난 성향/);
    expect(bookNotice("major_fortune")).not.toMatch(/타고난 성향/);
    expect(bookNotice("saju_mbti_full")).toBe("이 책은 타고난 성향을 풀이한 것이라 앞으로의 일을 단정하지 않아요.");
  });
});

describe("AM2 P2 판독 고침(2026-11-11, 무료 고침 2차)", () => {
  const fc = (n: number, ps: string[], keys?: string[]): FinalChapter => ({ n, id: `c${n}`, title: "t", source: "writer", chars: 0, sections: keys ? keys.map((k, i) => ({ heading: k, paragraphs: [ps[i] ?? ""] })) : [{ heading: "h", paragraphs: ps }], ...(keys ? { keys } : {}) });
  it("key별 값 대조: 다른 key의 흐름 세기·땅 글자·관계 이름·장면 씨앗을 잡고, 제 key 값은 통과", () => {
    const { intake, brief, k } = setup("annual_fortune");
    const ctx = blockCtxFor(brief, k, intake), ch = intake.chapters.find(c => c.keys)!;
    const [a, b2] = [ch.keys![3], ch.keys![4]], pa = headPair(a.head)!, pb = headPair(b2.head)!;
    const fa = ctx.flows!.get(a.key)!, fb = ctx.flows!.get(b2.key)!;
    const relA = [...(ctx.keyRels!.get(a.key) ?? [])].find(r => !(ctx.keyRels!.get(b2.key) ?? new Set()).has(r));
    const wrong = [`흐름 세기는 ${fa.score}/5예요.`, ...(pa.ground !== pb.ground ? [`땅 글자 ${pa.ground} 덕에 바빠요.`] : []), ...(relA ? [`태어난 해 자리와 ${relA}이 걸려요.`] : []), ...(a.scene ? [a.scene] : [])];
    const flags = blockFlags([fc(ch.n, ["", wrong.join(" ")], [a.key, b2.key])], [], ctx).filter(f => f.rule === "key_value");
    if (fa.score !== fb.score) expect(flags.some(f => /흐름/.test(f.detail ?? ""))).toBe(true);
    expect(flags.length).toBeGreaterThanOrEqual(wrong.length - (fa.score === fb.score ? 1 : 0) - 1);
    // AM2-3: 흐름은 숫자 대신 단어(제 key 단어는 통과, 숫자는 어느 key든 걸린다).
    expect(blockFlags([fc(ch.n, ["", `${FLOW_DESC[fb.score]}이에요. 땅 글자 ${pb.ground}가 들어와요.`], [a.key, b2.key])], [], ctx).filter(f => f.rule === "key_value")).toEqual([]);
    expect(blockFlags([fc(ch.n, ["", `흐름 세기는 ${fb.score}/5예요.`], [a.key, b2.key])], [], ctx).some(f => f.rule === "key_value" && /숫자/.test(f.detail ?? ""))).toBe(true);
  });
  it("따옴표 대사 속 시점 말 · 작은 비문 · 기능 칸 이름 · 공용 표면 정리 「1/5 잔잔함」", () => {
    const { intake } = setup("annual_fortune");
    const rules = blockFlags([fc(9, ['월급날에 "올해는 뭘 해 볼까" 하고 적어 보세요. 흐름이 도우는 달이에요. 지기 싫은 마음이 의욕이 되는 대신 지침이 되지 않게 쓰세요. 다만 열등기능이 늦게 와요. «지금 회사에서 인정받고 싶어요»라고 적어 주셨어요.'])], [], { intake }).map(f => f.rule);
    expect(rules).toEqual(expect.arrayContaining(["time_quote", "grammar", "code_leak"]));
    expect(rules.filter(r => r === "time_quote")).toHaveLength(1);
    expect(nativeNumbers("흐름 세기는 1/5 잔잔함입니다. 커피 2잔을 마셔요.").text).toBe("흐름 세기는 1/5 잔잔함입니다. 커피 두 잔을 마셔요.");
  });
  it("같은 처방·상투구는 책에서 한 번(받는 틀은 장마다 한 번 · 책 네 번까지 — AM2-3), key끼리 같은 문장도 반복으로", () => {
    const flags = adviceRepeats([fc(3, ["쉬는 날을 먼저 달력에 적어 넣으세요. 쉬는 날은 일정보다 먼저예요."]), fc(4, ["주말 하루는 쉬는 날로 두세요. 걷는 모습이 어울려요. 읽는 모습이 어울려요. 쓰는 모습이 어울려요. 웃는 모습이 어울려요."])]);
    expect(flags.filter(f => /쉬는 날/.test(f.detail ?? ""))).toHaveLength(2);
    expect(flags.filter(f => /어울려요/.test(f.detail ?? ""))).toHaveLength(3);
    const s = "일에서는 평가와 기준이 또렷해져 인정받을 기회가 생기고 돈에서는 고정 지출을 정리하기 좋습니다.";
    expect(crossRepeats([fc(7, [s, s], ["2026-M12", "2027-M10"])]).map(f => f.section)).toEqual([1]);
  });
  it("카드: 신살 줄에 자리 · 일반론(「일주에 있을 때」) 뺌 · 같은 생활 결 · 할 일 씨앗 · 기능 칸 이름 없음 · 대운 관계 뜻", () => {
    const a = setup("annual_fortune"), m = setup("major_fortune");
    const all = [...a.intake.lines, ...m.intake.lines];
    expect(all.some(l => /\(태어난 (해|달|날|시각)( · [가-힣]{2})?\)/.test(l.value))).toBe(true);
    expect(all.every(l => !/(일주|월주|연주|시주)에 (있을 때|있으면)/.test(l.meaning))).toBe(true);
    expect(all.every(l => !/주기능|부기능|3차기능|열등기능/.test(`${l.value} ${l.meaning}`))).toBe(true);
    // 할 일 씨앗: 입력에 맞는 문형이 없으면 비울 수 있다(1월 다리 달) — 대부분의 key는 있어야 한다.
    const ks = a.intake.chapters.find(c => c.keys)!.keys!.filter(x => x.when !== "past");
    expect(ks.filter(x => x.todo).length).toBeGreaterThanOrEqual(ks.length - 1);
    expect(new Set(ks.filter(x => x.todo).map(x => x.todo)).size).toBe(ks.filter(x => x.todo).length);
    const rel = m.intake.lines.filter(l => /^이 대운 기둥과/.test(l.value));
    expect(rel.every(l => / — /.test(l.meaning))).toBe(true);
  });
  it("화면 카드: 「(올해)」 대신 「(이 책을 쓴 해)」, 지난 해 [살필 점] 없음, 틀 문자열 없음, 문형에 시점 말 없음", () => {
    const { brief } = setup("major_fortune");
    const es = brief.timeline!.entries;
    expect(es.some(e => /\(올해\)/.test(e.label))).toBe(false);
    expect(es.filter(e => e.period === "past").every(e => !e.caution)).toBe(true);
    expect(es.every(e => !e.caution || !/살피기|걸리는 해:/.test(e.caution))).toBe(true);
    expect(es.every(e => !/(?<![가-힣])(지금|올해|요즘)/.test(e.action.text))).toBe(true);
  });
});

describe("AM2 발행(가짜 작가, 호출 0)", () => {
  it("세운: 묶음 6회로 쓰고 수리·검수 없이 발행, 1장부터 저장, 브리프 검사 기록", async () => {
    const { buildV5Snapshot } = await import("@/lib/writer/publish");
    const { devMockStream } = await import("@/lib/ops/generation/devMock");
    const { memorySink } = await import("@/lib/ops/generation/sinks");
    const p = payload("annual_fortune"), saved: number[] = [], sink = memorySink();
    const built = await buildV5Snapshot({ payload: p as never, reportId: "report_am2testannual0001", policyAt: AT, sink: { save: async c => { saved.push(c.n); return sink.save(c); }, load: () => sink.load() }, deps: { provider: "anthropic", model: "claude-sonnet-5-5", fallback: null, stream: devMockStream("ok", p as never, AT), people: async () => [] } });
    const meta = built.meta, review = meta.review as Record<string, unknown>;
    expect(review.mode).toBe("chunked"); expect((review.briefCheck as { ok: boolean }).ok).toBe(true);
    expect(meta.calls.filter(c => c.kind === "first")).toHaveLength(6);
    expect(meta.calls.some(c => c.kind === "repair" || c.kind === "review")).toBe(false);
    expect(saved[0]).toBe(1);
    // AM2-3: 가짜 작가 글(결정론 문단)은 「반드시 쓸 것」(흐름 단어·관계 이름)을 담지 않는다 — 그 밖의 차단은 0.
    expect((review.remainingHard as { rule: string }[]).filter(f => f.rule !== "must_miss")).toEqual([]);
  }, 120_000);
});
