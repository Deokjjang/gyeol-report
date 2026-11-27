// 결 보고서(D5 → 명령 3 1-2): 꼭지 열림 경계 · 한 사람이 본 나 · 결정론 · 다음 호 · 근거 숫자 · 조사 + 문장 규칙 a~h(styleFindings) · 반복 점검. 순수 함수만(외부 호출 0).
import { describe, expect, it } from "vitest";
import { MIRROR_FACET_IDS, MIRROR_ITEMS, MIRROR_ITEM_BY_ID, type FacetId } from "../../../src/data/mirror/items";
import {
  ATTACH_CLOSE, ATTACH_ITEM, BAND, BAND_LEVELS, CLOSE, HEDGE, LEADS, MODIFIERS, NEXT_HINT, POINTER, SIDE_NOUN, STORY_KIND_CLOSE, UNKNOWN_QUESTION, bestWord, numIra, numRo as bankNumRo, qIda, qRo,
} from "../../../src/data/mirror/reportBank";
import { facetMatchRates, friendAnswerCount, friendFacets, syncPercent, type Choice, type Closeness, type FriendAnswer, type FriendSession, type SelfAnswers } from "../../../src/lib/mirror/engine";
import { hash32, seededRandom } from "../../../src/lib/mirror/hash";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { ReportView } from "../../../src/components/mirror/report/ReportView";
import { buildReport, endingKey, exactDuplicates, frameOf, ida, numberPairs, numRo, reportToText, REPORT_BRIDGE, REPORT_RULES, sameOwnerSkeletons, sentenceProblems, skeletonOf, styleFindings, withinReportFindings } from "../../../src/lib/mirror/report/engine";
import type { ReportInput, ReportSnapshot, SectionKey } from "../../../src/lib/mirror/report/types";

const ids = (facet: FacetId) => MIRROR_ITEMS.filter(i => i.facet === facet).map(i => i.id);
/** 면마다 A쪽 개수를 정한 자가 답(앞에서부터 A). 기본은 면마다 A 3개(약하게 A). */
function selfWith(aCounts: Partial<Record<FacetId, number>> = {}, fallback = 3): SelfAnswers {
  const out: Record<string, Choice> = {};
  for (const facet of MIRROR_FACET_IDS) ids(facet).forEach((id, k) => { out[id] = k < (aCounts[facet] ?? fallback) ? 0 : 1; });
  return out;
}
const sess = (id: string, answers: FriendAnswer[], closeness: Closeness = 2, ownerDevice = false): FriendSession => ({ id, closeness, ownerDevice, answers });
/** n명이 itemId 하나에 답: agree명은 주인과 같은 답, 나머지는 반대. */
function onItem(self: SelfAnswers, itemId: string, n: number, agree: number, closeness: Closeness = 2, prefix = itemId): FriendSession[] {
  const mine = self[itemId];
  return Array.from({ length: n }, (_, k) => sess(`${prefix}-${k}`, [{ itemId, choice: k < agree ? mine : (1 - mine) as Choice }], closeness));
}
const input = (self: SelfAnswers, sessions: FriendSession[], extra: Partial<ReportInput> = {}): ReportInput => ({
  ownerName: "민지", self, sessions, stories: [], issueNo: 1, seedKey: "k9x2m", issuedAt: "2026-11-27T03:00:00.000Z", nextIssueAt: "2026-12-04T03:00:00.000Z", previous: null, ...extra,
});
const keys = (r: ReportSnapshot): SectionKey[] => r.sections.map(s => s.key);
/** 친구 여러 명이 고르게 답하는 기본 판(문항마다 한 명씩 돌아가며, 정해진 정확도). */
function crowd(self: SelfAnswers, friends: number, perFriend: number, closeness: (k: number) => Closeness = () => 2, accuracy = 0.7): FriendSession[] {
  return Array.from({ length: friends }, (_, k) => {
    const answers: FriendAnswer[] = [];
    for (let j = 0; j < perFriend; j++) {
      const item = MIRROR_ITEMS[(k * 7 + j * 5) % MIRROR_ITEMS.length];
      if (answers.some(a => a.itemId === item.id) || (closeness(k) === 1 && (item.facet === "check" || item.facet === "dist"))) continue;
      const hit = ((k * 31 + j * 17) % 100) / 100 < accuracy;
      answers.push({ itemId: item.id, choice: hit ? self[item.id] : (1 - self[item.id]) as Choice });
    }
    return sess(`c${k}`, answers, closeness(k));
  });
}

describe("꼭지 열림 경계", () => {
  const self = selfWith();
  it("숨길 수 없는 나: 문항당 친구 3명 이상 + 80% 이상 같은 답", () => {
    expect(keys(buildReport(input(self, onItem(self, "soc-1", 3, 3))))).toContain("open");
    expect(keys(buildReport(input(self, onItem(self, "soc-1", 2, 2))))).not.toContain("open");
    expect(keys(buildReport(input(self, onItem(self, "soc-1", 4, 3))))).not.toContain("open");
    expect(keys(buildReport(input(self, onItem(self, "soc-1", 5, 4))))).toContain("open");
  });
  it("나만 모르는 나: 문항당 친구 3명 이상 + 60% 이상 반대", () => {
    expect(keys(buildReport(input(self, onItem(self, "emo-1", 5, 2))))).toContain("blind");
    expect(keys(buildReport(input(self, onItem(self, "emo-1", 5, 3))))).not.toContain("blind");
    expect(keys(buildReport(input(self, onItem(self, "emo-1", 3, 1))))).toContain("blind");
    expect(keys(buildReport(input(self, onItem(self, "emo-1", 2, 0))))).not.toContain("blind");
  });
  it("나만 아는 나: 내 면 뚜렷(4개 이상 한쪽) + 면당 친구 답 6개 이상 + 친구 비율 40~60%", () => {
    const clear = selfWith({ worry: 5 });
    const split = (n: number, a: number) => ids("worry").slice(0, n).map((id, k) => sess(`w${k}`, [{ itemId: id, choice: k < a ? 0 : 1 }])).concat(ids("worry").slice(0, n).map((id, k) => sess(`v${k}`, [{ itemId: id, choice: k < a ? 1 : 0 }])));
    expect(keys(buildReport(input(clear, split(3, 2))))).toContain("hidden"); // 답 6개 · A 3개
    expect(keys(buildReport(input(clear, split(2, 1))))).not.toContain("hidden"); // 답 4개
    expect(keys(buildReport(input(selfWith({ worry: 3 }), split(3, 2))))).not.toContain("hidden"); // 내 면이 약함
    const lean = ids("worry").flatMap((id, k) => [sess(`x${k}`, [{ itemId: id, choice: 0 }]), sess(`y${k}`, [{ itemId: id, choice: k < 2 ? 1 : 0 }])]); // 10개 중 A 8개
    expect(keys(buildReport(input(clear, lean)))).not.toContain("hidden");
  });
  it("가까울수록 보이는 나: 아는 사이 · 가까운 사이 각 3명, 두 묶음이 반대로 봄", () => {
    const soc = ids("soc");
    const g = (c: Closeness, choice: Choice, n: number, tag: string) => Array.from({ length: n }, (_, k) => sess(`${tag}${k}`, [{ itemId: soc[k % 5], choice }, { itemId: soc[(k + 1) % 5], choice }], c));
    expect(keys(buildReport(input(self, [...g(1, 1, 3, "a"), ...g(3, 0, 3, "c")])))).toContain("closer");
    expect(keys(buildReport(input(self, [...g(1, 1, 2, "a"), ...g(3, 0, 3, "c")])))).not.toContain("closer");
    expect(keys(buildReport(input(self, [...g(1, 0, 3, "a"), ...g(3, 0, 3, "c")])))).not.toContain("closer");
  });
  it("가까운 관계의 나: 친구 · 가까운 사이 3명 이상(아는 사이는 세지 않는다)", () => {
    const close = (n: number, c: Closeness) => Array.from({ length: n }, (_, k) => sess(`p${c}${k}`, [{ itemId: "check-1", choice: 0 }, { itemId: "dist-1", choice: 0 }], c));
    expect(keys(buildReport(input(self, [...close(2, 2), ...close(1, 3)])))).toContain("attach");
    expect(keys(buildReport(input(self, [...close(2, 2), ...close(3, 1)])))).not.toContain("attach");
  });
  it("이야기 · 아직 아무도 모르는 나 · 다음 호", () => {
    const base = onItem(self, "soc-1", 3, 3);
    expect(keys(buildReport(input(self, base)))).not.toContain("stories");
    const r = buildReport(input(self, base, { stories: [{ id: "s1", kind: "funny", body: "같이 웃었던 날", closeness: 2, hearts: 0, createdAt: "2026-11-20T00:00:00Z" }] }));
    expect(keys(r)).toContain("stories");
    expect(keys(r).slice(-2)).toEqual(["unknown", "next"]);
    expect(r.sections.find(s => s.key === "unknown")!.ask).toBe(true);
    expect(r.sections.find(s => s.key === "next")!.closing).toMatch(/12월 4일/);
    expect(r.bridge).toEqual(REPORT_BRIDGE);
  });
});

describe("한 사람이 본 나", () => {
  it("친구가 한 명뿐이면 꼭지 2~5 대신 「한 사람이 본 나」 하나 — 다른 장면부터", () => {
    const self = selfWith({ emo: 1 });
    const answers: FriendAnswer[] = MIRROR_ITEMS.map((i, k) => ({ itemId: i.id, choice: i.facet === "emo" ? 0 : k % 4 === 0 ? (1 - self[i.id]) as Choice : self[i.id] }));
    const r = buildReport(input(self, [sess("only", answers)]));
    expect(keys(r)).toContain("one");
    for (const k of ["open", "blind", "hidden", "closer"] as const) expect(keys(r)).not.toContain(k);
    const one = r.sections.find(s => s.key === "one")!;
    // 덕짱님 결정(규칙 d 예외): 장면은 비율 없이 그 친구가 고른 보기 + 작은 줄 「직접 고른 답은 「…」」.
    expect(one.scenes[0].count).toMatch(/^직접 고른 답은 「.+」$/);
    expect(one.scenes.every(s => s.n === 1)).toBe(true);
    expect(one.lead[0]).toMatch(/다르게 골랐어요|다른 답은/);
    expect(one.scenes.every(s => !s.share)).toBe(true);
    expect(r.verdict.summary).toMatch(/친구 한 명이/);
    expect(r.verdict.summary).not.toMatch(/친구들/);
    // 감정 면을 반대로 본 게 가장 크다 → 수식어는 나만 모르는 나(감정 A).
    expect(MODIFIERS.blind.emo.A).toContain(r.verdict.title.split(" ").slice(0, -2).join(" "));
  });
});

describe("결정론 · 다음 호 변형 · 주인 기기 제외", () => {
  const self = selfWith({ soc: 5, emo: 0, worry: 5, plan: 1 });
  const sessions = crowd(self, 14, 24, k => (k % 3 === 0 ? 1 : k % 3 === 1 ? 2 : 3) as Closeness);
  it("같은 입력이면 같은 출력(스냅샷 JSON까지)", () => {
    const a = buildReport(input(self, sessions)), b = buildReport(input(self, sessions));
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(JSON.parse(JSON.stringify(a))).toEqual(a);
  });
  it("같은 사람의 다음 호(호 번호 + 1)에는 다른 문장 변형이 나온다", () => {
    const a = buildReport(input(self, sessions)), b = buildReport(input(self, sessions, { issueNo: 2, previous: a }));
    const linesA = a.sections.flatMap(s => [...s.lead, ...s.body]), linesB = b.sections.flatMap(s => [...s.lead, ...s.body]);
    const same = linesA.filter(l => linesB.includes(l) && !/\d/.test(l));
    expect(same.length).toBeLessThanOrEqual(Math.floor(linesA.filter(l => !/\d/.test(l)).length / 2));
    expect(a.verdict.title).not.toBe(b.verdict.title);
    expect(b.verdict.summary).toMatch(/지난 호/);
  });
  it("주인 기기 세션은 보고서에 들어가지 않는다", () => {
    const withOwner = [...sessions, sess("me", MIRROR_ITEMS.map(i => ({ itemId: i.id, choice: self[i.id] })), 3, true)];
    expect(JSON.stringify(buildReport(input(self, withOwner)))).toBe(JSON.stringify(buildReport(input(self, sessions))));
  });
});

describe("근거 숫자 = D0 엔진 계산", () => {
  it("답 수 · 싱크로율 · 면별 친구 답 · 같게 본 비율, 친밀도별 수는 3명 미만이면 null", () => {
    const self = selfWith({ lead: 4, trust: 1 });
    const sessions = crowd(self, 9, 20, k => (k < 2 ? 1 : k < 6 ? 2 : 3) as Closeness, 0.65);
    const r = buildReport(input(self, sessions));
    expect(r.evidence.answers).toBe(friendAnswerCount(sessions));
    expect(r.verdict.sync).toBe(syncPercent(self, sessions));
    const ff = friendFacets(sessions), fmr = facetMatchRates(self, sessions);
    r.evidence.facets.forEach((f, i) => { expect(f.friendN).toBe(ff[i]?.n ?? 0); expect(f.match).toBe(fmr[i] === null ? null : Math.round(fmr[i]! * 100)); });
    expect(r.evidence.byCloseness).toEqual({ 1: null, 2: 4, 3: 3 });
    // 장면 숫자: 꼭지 2 장면의 「친구 n명 중 m명」이 실제 답과 같다.
    for (const sc of r.sections.find(s => s.key === "open")?.scenes ?? []) {
      const [, n, m] = /친구 (\d+)명 중 (\d+)명/.exec(sc.count)!.map(Number);
      const got = sessions.flatMap(s => s.answers).filter(a => a.itemId === sc.itemId && a.choice !== "skip");
      expect(got.length).toBe(n);
      expect(got.filter(a => a.choice === self[sc.itemId]).length).toBe(m);
    }
  });
  it("장면 공유는 꼭지 2 · 3 장면에만, 문장은 친구용 문장 + 근거", () => {
    const self = selfWith();
    const r = buildReport(input(self, [...onItem(self, "soc-2", 4, 4), ...onItem(self, "emo-3", 3, 0)]));
    for (const s of r.sections) for (const sc of s.scenes) expect(Boolean(sc.share)).toBe(s.key === "open" || s.key === "blind");
    const open = r.sections.find(s => s.key === "open")!.scenes[0];
    expect(open.share!.text).toBe(`친구 4명 중 4명: 민지는 모임이 끝나고 나면 ${self["soc-2"] === 0 ? "아직 텐션이 남아 있다" : "조용히 충전할 시간을 갖고 싶어 한다"}`);
    const blind = r.sections.find(s => s.key === "blind")!.scenes[0];
    expect(blind.share!.text).toMatch(/^친구 3명 중 3명: 민지는 화가 나는 상황에서 /);
  });
});

describe("조사", () => {
  /** 받침에 맞지 않는 「이에요/예요 · 을/를 · 은/는 · 이/가」가 붙은 낱말을 찾는다(한글 바로 뒤만). */
  function josaErrors(text: string): string[] {
    const batchim = (ch: string) => { const c = ch.charCodeAt(0) - 0xac00; return c >= 0 && c <= 11171 && c % 28 !== 0; };
    const errs: string[] = [];
    for (const m of text.matchAll(/([가-힣])(이에요|예요)/g)) if ((m[2] === "이에요") !== batchim(m[1]) && !(m[2] === "예요" && m[1] === "이")) errs.push(m[0]);
    for (const name of ["민지", "서준"]) for (const m of text.matchAll(new RegExp(`${name}(을|를|은|는|이|가)(?=[ ,.])`, "g"))) {
      const want = batchim(name.slice(-1)) ? { 을: "을", 를: "을", 은: "은", 는: "은", 이: "이", 가: "이" } : { 을: "를", 를: "를", 은: "는", 는: "는", 이: "가", 가: "가" };
      if (want[m[1] as "을"] !== m[1]) errs.push(m[0]);
    }
    return errs;
  }
  it("받침 있는 이름 · 없는 이름 모두 조사 오류 0", () => {
    for (const ownerName of ["민지", "서준"]) {
      const self = selfWith({ soc: 5, emo: 0, worry: 5, check: 4, dist: 1 });
      const sessions = crowd(self, 16, 24, k => (k % 3 === 0 ? 1 : k % 3 === 1 ? 2 : 3) as Closeness, 0.6);
      const multi = reportToText(buildReport(input(self, sessions, { ownerName })));
      const one = reportToText(buildReport(input(self, [sess("o", MIRROR_ITEMS.map(i => ({ itemId: i.id, choice: (1 - self[i.id]) as Choice })))], { ownerName })));
      expect(josaErrors(multi)).toEqual([]);
      expect(josaErrors(one)).toEqual([]);
      const share = buildReport(input(self, sessions, { ownerName })).sections.flatMap(s => s.scenes).find(sc => sc.share)?.share?.text ?? "";
      if (share) expect(share).toMatch(new RegExp(`: ${ownerName === "민지" ? "민지는|민지의" : "서준은|서준의"}|: 가까운 사람이 ${ownerName}의`));
    }
    expect(ida("사교")).toBe("사교예요");
    expect(ida("공감")).toBe("공감이에요");
    expect(ida("확인 · 거리")).toBe("확인 · 거리예요");
  });
  it("문항 장면 문장은 실제 문항 문장 그대로", () => {
    const self = selfWith();
    const r = buildReport(input(self, onItem(self, "plan-1", 3, 3)));
    const sc = r.sections.find(s => s.key === "open")!.scenes[0], item = MIRROR_ITEM_BY_ID.get("plan-1")!;
    expect(sc.situation).toBe(item.self.situation);
    expect([item.self.a, item.self.b]).toContain(sc.picked);
  });
});


/* ───────── 명령 3 1-2 문장 규칙 a~h ───────── */
const ALL_FACETS = MIRROR_FACET_IDS;
/** 여러 모양의 무작위 판: 친구 수 · 친밀도 섞임 · 정확도 · 면 치우침 · 이야기 · 2호. */
function randomCase(seed: number) {
  const rand = seededRandom(seed);
  const aCounts = Object.fromEntries(ALL_FACETS.map(f => [f, Math.floor(rand() * 6)])) as Record<FacetId, number>;
  const self = selfWith(aCounts);
  const friends = 2 + Math.floor(rand() * 30), per = [10, 12, 24, 36][Math.floor(rand() * 4)], acc = 0.35 + rand() * 0.6;
  const mix = Math.floor(rand() * 4);
  const sessions = crowd(self, friends, per, k => (mix === 0 ? 2 : mix === 1 ? (k % 2 ? 1 : 3) : mix === 2 ? 3 : ((k % 3) + 1)) as Closeness, acc);
  const stories = Array.from({ length: Math.floor(rand() * 4) }, (_, k) => ({ id: `s${seed}-${k}`, kind: (["funny", "thanks", "cool", "better", "surprise"] as const)[(seed + k) % 5], body: `이야기 ${seed}-${k}`, closeness: ((k % 3) + 1) as Closeness, hearts: Math.floor(rand() * 4), createdAt: `2026-11-${10 + k}T00:00:00Z` }));
  return { self, sessions, stories, seedKey: hash32(`case:${seed}`).toString(36) };
}

describe("규칙 a~h — 무작위 판 40개(1호 · 2호 80개)", () => {
  const cases = Array.from({ length: 40 }, (_, i) => randomCase(1000 + i));
  const built = cases.map(c => {
    const r1 = buildReport(input(c.self, c.sessions, { stories: c.stories, seedKey: c.seedKey }));
    const more = crowd(c.self, 6, 12, k => ((k % 3) + 1) as Closeness, 0.6).map(s => ({ ...s, id: `n${s.id}` }));
    const r2 = buildReport(input(c.self, [...c.sessions, ...more], { stories: c.stories, seedKey: c.seedKey, issueNo: 2, previous: r1, issuedAt: "2026-12-04T03:00:00.000Z", nextIssueAt: "2026-12-11T03:00:00.000Z" }));
    return { r1, r2 };
  });
  it("문장 규칙(styleFindings)은 1호 · 2호 모두 0건", () => {
    expect(built.flatMap(({ r1, r2 }, i) => [...styleFindings(`c${i}`, r1), ...styleFindings(`c${i}b`, r2)])).toEqual([]);
  });
  it("1호 반복 점검 0건 · 2호는 지난 호 피하기를 먼저 지켜 꼭지 안 끝맺음이 겹치는 일이 드물게(80개 중 3개 이하) 남는다", () => {
    expect(built.flatMap(({ r1 }, i) => withinReportFindings(`c${i}`, r1))).toEqual([]);
    // 같은 사람의 2호: 지난 호 뼈대 · 첫머리 피하기와 「꼭지 안 같은 끝맺음 한 번」이 부딪히면 앞의 것을 지킨다(엔진 choose 순서). 무작위 200판 실측 8%.
    const soft = built.flatMap(({ r1, r2 }, i) => [...withinReportFindings(`c${i}b`, r2), ...sameOwnerSkeletons(r1, r2)]);
    expect(soft.length).toBeLessThanOrEqual(3);
  });
});

describe("규칙 a — 애착 유형은 두 면 근거 짝으로", () => {
  const close = (n: number, choice: Choice) => Array.from({ length: n }, (_, k) => sess(`p${k}`, ids("check").concat(ids("dist")).map(itemId => ({ itemId, choice })), 2));
  it("자가 유형 문장 = 「확인 쪽 a/5 · 거리 쪽 b/5라 ~」, 두 면 모두 5/5일 때만 「~이에요」", () => {
    const weak = buildReport(input(selfWith({ check: 1, dist: 1 }), close(3, 1))).sections.find(s => s.key === "attach")!;
    expect(weak.lead[0]).toMatch(/믿고 기다리는 쪽 4\/5 · 혼자 해결하는 쪽 4\/5라 회피형에 가까워요\.$/);
    const strong = buildReport(input(selfWith({ check: 0, dist: 0 }), close(3, 1))).sections.find(s => s.key === "attach")!;
    expect(strong.lead[0]).toMatch(/믿고 기다리는 쪽 5\/5 · 혼자 해결하는 쪽 5\/5라 회피형이에요\.$/);
  });
  it("가까운 사람 눈도 짝으로 · 장면 하나로 유형을 말하지 않는다 · 반반이면 유형을 정하지 않는다", () => {
    const r = buildReport(input(selfWith({ check: 4, dist: 4 }), close(4, 1)));
    const a = r.sections.find(s => s.key === "attach")!;
    expect(a.body[0]).toMatch(/^가까운 사람.* 믿고 기다리는 쪽 20\/20 · 혼자 해결하는 쪽 20\/20이라 회피형이에요\.$/);
    for (const t of [...a.lead, ...a.body, a.closing]) if (/형/.test(t) && /안정형|불안형|회피형/.test(t)) expect(t).not.toMatch(/“/);
    const split = [...close(2, 0), ...close(2, 1)].map((s, k) => ({ ...s, id: `q${k}` }));
    const b = buildReport(input(selfWith({ check: 4, dist: 4 }), split)).sections.find(s => s.key === "attach")!;
    expect(b.body.join(" ")).not.toMatch(/안정형|불안형|회피형/);
  });
});

describe("규칙 b — 말끝 흐림 금지 · 추측은 꼭지당 한 문장 「~일 거예요」", () => {
  it("금지 어미를 모두 잡는다", () => {
    for (const t of ["그럴지도 몰라요.", "그런 편인 듯해요.", "그런 것 같아요.", "편인 듯", "보이는지도 몰라요."]) expect(HEDGE.test(t), t).toBe(true);
    expect(sentenceProblems("모임에서 살아날 거예요.")).toContain("「일 거예요」가 아닌 추측");
    expect(sentenceProblems("모임에서 살아나는 사람일 거예요.")).toEqual([]);
  });
  it("뱅크 전체(마지막 한 줄 · 꼭지 첫 문장 · 애착)에 흐림 말이 없고, 추측 문장은 가까운 관계의 나 한 줄뿐", () => {
    const lines = [...Object.values(CLOSE).flatMap(b => Object.values(b).flatMap(s => [...s.A, ...s.B])), ...Object.values(ATTACH_CLOSE).flat(), ...Object.values(STORY_KIND_CLOSE).flat()];
    for (const l of lines) { expect(HEDGE.test(l), l).toBe(false); expect(l, l).not.toMatch(/거예요\.$/); expect(l, l).toMatch(/요\.$/); }
    for (const v of Object.values(ATTACH_ITEM)) for (const l of [v.A, v.B]) expect(l, l).toMatch(/일 거예요\.$/);
  });
});

describe("규칙 c · f — 첫 문장은 장면의 면 · 장면은 문장 뒤 · 지시어 없음", () => {
  it("장면이 두 면 이상이면 첫 문장은 면을 특정하지 않는다", () => {
    const self = selfWith();
    const r = buildReport(input(self, [...onItem(self, "soc-1", 3, 3), ...onItem(self, "plan-1", 3, 3, 2, "p")]));
    const open = r.sections.find(s => s.key === "open")!;
    expect(new Set(open.scenes.map(s => s.facet)).size).toBe(2);
    expect(open.lead[0]).not.toMatch(/(사교|계획) 면/);
    for (const name of ["사교", "계획"]) expect(open.lead[0]).not.toContain(`「${SIDE_NOUN[name === "사교" ? "soc" : "plan"].A}」`);
  });
  it("지시어(「이 장면 · 이 질문 · 아래에」)를 잡고, 화면 · 평문 모두 문장 → 장면 → 마지막 한 줄 순서", () => {
    expect(POINTER.test("이 장면에서 보면")).toBe(true);
    const self = selfWith({ emo: 1 });
    const r = buildReport(input(self, crowd(self, 12, 24, k => ((k % 3) + 1) as Closeness, 0.6)));
    const html = renderToStaticMarkup(createElement(ReportView, { snapshot: r }));
    for (const s of r.sections.filter(x => x.scenes.length)) {
      const block = html.slice(html.indexOf(`data-section="${s.key}"`), html.indexOf("</section>", html.indexOf(`data-section="${s.key}"`)));
      const lastLine = [...s.lead, ...s.body].at(-1)!;
      expect(block.indexOf(lastLine.slice(0, 8))).toBeLessThan(block.indexOf("data-item"));
      expect(block.indexOf("data-item")).toBeLessThan(block.indexOf("data-closing"));
    }
    const text = reportToText(r);
    for (const s of r.sections) expect(text.indexOf(`▶ ${s.closing}`)).toBeGreaterThan(text.indexOf(`■ ${s.title}`));
  });
});

describe("규칙 d — 장면 문항 친구 답 3개 이상 · 면 문장 6개 이상 · 확인 · 거리는 꼭지 6에서만", () => {
  it("문항당 2명뿐인 장면은 쓰지 않는다(나만 아는 나 예시 장면 포함)", () => {
    const clear = selfWith({ worry: 5 });
    const two = ids("worry").flatMap((id, k) => [sess(`a${k}`, [{ itemId: id, choice: 0 }]), sess(`b${k}`, [{ itemId: id, choice: 1 }])]);
    const r = buildReport(input(clear, two));
    for (const s of r.sections) if (s.key !== "one") for (const sc of s.scenes) expect(sc.n).toBeGreaterThanOrEqual(REPORT_RULES.sceneMinAnswers);
    expect(styleFindings("d", r)).toEqual([]);
  });
  it("확인 · 거리 문항은 숨길 수 없는 나 · 나만 모르는 나 장면에 쓰지 않는다", () => {
    const self = selfWith({ check: 4, dist: 1 });
    const r = buildReport(input(self, [...onItem(self, "check-1", 4, 4), ...onItem(self, "dist-2", 4, 0, 2, "d"), ...onItem(self, "soc-1", 3, 3, 2, "s")]));
    for (const s of r.sections.filter(x => x.key === "open" || x.key === "blind")) for (const sc of s.scenes) expect(["check", "dist"]).not.toContain(sc.facet);
  });
  it("나만 아는 나에 고른 면의 문항은 나만 모르는 나 장면으로 쓰지 않는다", () => {
    const self = selfWith({ worry: 5 });
    const split = ids("worry").flatMap((id, k) => [0, 1, 2].map(j => sess(`w${k}${j}`, [{ itemId: id, choice: (j + k) % 2 === 0 ? 0 : 1 }])));
    const r = buildReport(input(self, split));
    if (r.sections.some(s => s.key === "hidden")) expect(r.sections.find(s => s.key === "blind")?.scenes.some(sc => sc.facet === "worry") ?? false).toBe(false);
  });
});

describe("규칙 e — 숫자 쌍 하나 · 70자 · 쉼표 한 번", () => {
  it("숫자 쌍 세기: N개 중 M개 · N 대 M · a/b 는 각 하나, 애착 근거 짝은 하나", () => {
    expect(numberPairs("친구 답 12개 중 10개가 「쪽」이에요.")).toBe(1);
    expect(numberPairs("5문항 중 4개를 골랐어요.")).toBe(1);
    expect(numberPairs("친구 답이 3 대 2로 갈렸어요.")).toBe(1);
    expect(numberPairs("믿고 기다리는 쪽 4/5 · 혼자 해결하는 쪽 4/5라 회피형에 가까워요.")).toBe(1);
    expect(numberPairs("아는 사이 3개 중 2개 · 가까운 사이 3개 중 3개")).toBe(2);
    expect(sentenceProblems("가".repeat(71) + "요.")).toContain("길이 73자");
    expect(sentenceProblems("하나, 둘, 셋이에요.")).toContain("쉼표 2번");
    expect(sentenceProblems("「가, 나, 다」라고 골랐어요.")).toEqual([]);
  });
});

describe("규칙 g · h — 꼭지 마지막 한 줄 · 요약 첫 문단", () => {
  it("꼭지마다 마지막 한 줄(8~36자, 단정형)", () => {
    const self = selfWith({ soc: 5, emo: 0 });
    const r = buildReport(input(self, crowd(self, 10, 24, k => ((k % 3) + 1) as Closeness, 0.6), { stories: [{ id: "s", kind: "thanks", body: "고마워", closeness: 2, hearts: 1, createdAt: "2026-11-20T00:00:00Z" }] }));
    for (const s of r.sections) { expect(s.closing.length, s.key).toBeGreaterThanOrEqual(8); expect(s.closing.length, s.key).toBeLessThanOrEqual(36); expect(s.closing).not.toMatch(/거예요\.$/); }
  });
  it("요약 = 「친구 N명이 M개를 답했어요.」 + 싱크로율 + 주어가 분명한 총평(친구 한 명이면 「이 친구」) · 2호는 싱크로율 문장이 지난 호 비교", () => {
    const self = selfWith();
    const sessions = crowd(self, 6, 20);
    const r = buildReport(input(self, sessions));
    const s3 = r.verdict.summary.split(/(?<=\.)\s+/);
    expect(s3).toHaveLength(3);
    expect(s3[0]).toBe(`친구 6명이 ${r.evidence.answers}개를 답했어요.`);
    expect(s3[1]).toMatch(/싱크로율.*\d+%/);
    expect(s3[2]).toMatch(/^친구들/);
    const one = buildReport(input(self, [sess("o", MIRROR_ITEMS.map(i => ({ itemId: i.id, choice: self[i.id] })))]));
    expect(one.verdict.summary).toMatch(/^친구 한 명이 60개를 답했어요\. .*싱크로율.* 이 친구/);
    const r2 = buildReport(input(self, crowd(self, 8, 20), { issueNo: 2, previous: r }));
    const t2 = r2.verdict.summary.split(/(?<=\.)\s+/);
    expect(t2).toHaveLength(3); expect(t2[1]).toMatch(/지난 호/);
  });
  it("총평 정도 말은 숫자에 맞춘다: 「정확히」 95% 이상 · 「거의 다」 85% 이상 · 그 밖 「잘」, 「거의 다 알아봤어요」류는 90% 이상만", () => {
    expect([bestWord(100), bestWord(95), bestWord(90), bestWord(80)]).toEqual(["정확히", "정확히", "거의 다", "잘"]);
    for (const f of BAND.high) expect(f({ s: "친구들이", e: "친구들 눈에" })).not.toMatch(/거의 다|거의 없/);
    for (const level of BAND_LEVELS) for (const f of BAND[level]) expect(f({ s: "친구들이", e: "친구들 눈에" })).toMatch(/^친구들/);
  });
});

describe("같은 사람의 다음 호 · 다른 사람 사이 반복", () => {
  it("2호: 지난 호의 같은 꼭지 뼈대 · 이야기를 되풀이하지 않는다(새 이야기가 있으면)", () => {
    const self = selfWith({ soc: 5, emo: 0, worry: 5, check: 4, dist: 4 });
    const s1 = crowd(self, 10, 24, k => ((k % 3) + 1) as Closeness, 0.6);
    const stories = [0, 1, 2, 3].map(k => ({ id: `st${k}`, kind: (["funny", "cool", "thanks", "surprise"] as const)[k], body: `이야기 ${k}`, closeness: 2 as Closeness, hearts: 3 - k, createdAt: `2026-11-1${k}T00:00:00Z` }));
    const r1 = buildReport(input(self, s1, { stories }));
    const r2 = buildReport(input(self, [...s1, ...crowd(self, 6, 24).map(s => ({ ...s, id: `x${s.id}` }))], { stories, issueNo: 2, previous: r1 }));
    expect(sameOwnerSkeletons(r1, r2)).toEqual([]);
    const shown1 = r1.sections.find(s => s.key === "stories")!.stories!.map(s => s.body), shown2 = r2.sections.find(s => s.key === "stories")!.stories!.map(s => s.body);
    expect(shown2.filter(b => shown1.includes(b))).toEqual([]);
    const a2 = r2.sections.find(s => s.key === "attach");
    if (a2) expect(a2.lead[0]).toMatch(/지난 호/);
  });
  it("다른 사람 사이 글자 그대로 점검: 마지막 한 줄 · 형식이 정해진 줄 · 애착 유형 문장은 빼고 본다", () => {
    const self = selfWith();
    const a = buildReport(input(self, onItem(self, "soc-1", 3, 3), { seedKey: "aaa" })), b = buildReport(input(self, onItem(self, "soc-1", 3, 3), { seedKey: "aaa", ownerName: "서준" }));
    const d = exactDuplicates([{ id: "a", snapshot: a }, { id: "b", snapshot: b }]);
    expect(d.some(x => /\|친구 \d+명이 \d+개를 답했어요/.test(x))).toBe(false);
    expect(d.some(x => x.includes(a.sections[0].closing))).toBe(false);
  });
  it("뼈대 · 틀 · 끝맺음 낱말", () => {
    expect(skeletonOf("감정 면은 친구 답 12개 중 10개가 「감정이 바로 드러나는 쪽」이에요.")).toBe("@ 면은 친구 답 #개 중 #개가 「」이에요.");
    expect(frameOf("감정 면은 친구 답 12개 중 10개가 「…」이에요.")).toBe("친구 답");
    expect(endingKey("…「사람 속에서 충전하는 쪽」이에요.")).toBe("쪽");
    expect(endingKey("…5문항 중 4개를 「…」으로 골랐어요.")).toBe("골랐");
  });
});

describe("문장 뱅크 크기 · 조사 도우미", () => {
  it("마지막 한 줄: 4종 × 12면 × 2쪽 × 3개 이상 서로 다른 줄 · 36자 이하", () => {
    for (const kind of ["open", "blind", "hidden", "closer"] as const) for (const f of MIRROR_FACET_IDS) for (const side of ["A", "B"] as const) {
      const lines = CLOSE[kind][f][side];
      expect(new Set(lines).size, `${kind}:${f}${side}`).toBeGreaterThanOrEqual(3);
      for (const l of lines) expect(l.length, l).toBeLessThanOrEqual(36);
    }
    for (const t of Object.keys(ATTACH_CLOSE) as (keyof typeof ATTACH_CLOSE)[]) expect(new Set(ATTACH_CLOSE[t]).size).toBeGreaterThanOrEqual(3);
    for (const k of Object.keys(LEADS) as (keyof typeof LEADS)[]) expect(LEADS[k].length).toBeGreaterThanOrEqual(5);
    expect(Object.values(NEXT_HINT).every(h => h.length === 2 && h[0] !== h[1])).toBe(true);
    expect(Object.keys(UNKNOWN_QUESTION)).toHaveLength(12);
  });
  it("한 줄 판정 수식어: 4종 × 12면 × 2쪽 × 2개 이상, 유형 이름 낱말 없이 관형형", () => {
    for (const kind of ["blind", "hidden", "closer", "open"] as const) for (const f of MIRROR_FACET_IDS) for (const side of ["A", "B"] as const) {
      const mods = MODIFIERS[kind][f][side];
      expect(new Set(mods).size, `${kind}:${f}${side}`).toBeGreaterThanOrEqual(2);
      for (const m of mods) { expect(m).not.toMatch(/다정한|자유로운|단단한|기발한|모험가|해결사|몽상가|장인/); expect((m.charCodeAt(m.length - 1) - 0xac00) % 28, m).toBe(4); }
    }
  });
  it("숫자 · 낫표 뒤 조사", () => {
    expect([numRo(3), numRo(4), numRo(10), numRo(7), bankNumRo(6)]).toEqual(["3으로", "4로", "10으로", "7로", "6으로"]);
    expect([numIra(5), numIra(20), numIra(13), numIra(9)]).toEqual(["5라", "20이라", "13이라", "9라"]);
    expect([qIda("사람 속에서 충전하는 쪽"), qIda("상상과 감성 쪽"), qRo("가까이 기대는 쪽"), qRo("마음")]).toEqual(["「사람 속에서 충전하는 쪽」이에요", "「상상과 감성 쪽」이에요", "「가까이 기대는 쪽」으로", "「마음」으로"]);
  });
});
