// 결 보고서(D5): 꼭지 열림 경계 · 한 사람이 본 나 · 결정론 · 다음 호 변형 · 근거 숫자 · 문장 뱅크 크기 · 조사. 순수 함수만(외부 호출 0).
import { describe, expect, it } from "vitest";
import { MIRROR_FACET_IDS, MIRROR_ITEMS, MIRROR_ITEM_BY_ID, type FacetId } from "../../../src/data/mirror/items";
import {
  ATTACH_DIFF_FRONT, ATTACH_FRIEND, ATTACH_ITEM, ATTACH_SAME, ATTACH_SAME_FRONT, ATTACH_SELF_FRONT, ATTACH_SELF_TYPE, ATTACH_SPLIT_BOTH, ATTACH_SPLIT_ONE, BAND, BAND_LEVELS, BAND_WORD, BLIND_LINES, CLOSER_FRONT,
  CLOSER_LINES, CLOSER_NEXT_FRONT, HIDDEN_BACK, HIDDEN_FRONT, HIDDEN_PLAIN, HIDDEN_TRAIT, MODIFIERS, MODIFIER_FALLBACK, NEXT_GROWTH, OPEN_LINES, SIDE_NOUN, SPLIT_FRONT, UNKNOWN_QUESTION, bandLevel, halfWord, hiddenBucket, hiddenLines, isEven, isTight, RATIO_WORDS, SECTION_TITLE, softEndings, vsHalf,
} from "../../../src/data/mirror/reportBank";
import { facetMatchRates, friendAnswerCount, friendFacets, syncPercent, type Choice, type Closeness, type FriendAnswer, type FriendSession, type SelfAnswers } from "../../../src/lib/mirror/engine";
import { buildReport, endingKey, endingOf, exactDuplicates, frameOf, ida, sharedWords, numRo, repetitionFindings, reportToText, REPORT_BRIDGE, sameOwnerSkeletons, segmentsOf, skeletonOf, vsKeysOf, withinReportFindings } from "../../../src/lib/mirror/report/engine";
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

describe("문장 뱅크 크기", () => {
  it("꼭지 2~5 풀이: 12면 × 2쪽 × 서로 다른 변형 3개 이상, 모두 해요체 한 문장 마디(「친구들」 없음)", () => {
    const hiddenAll = Object.fromEntries(MIRROR_FACET_IDS.map(f => [f, { A: [0.4, 0.5, 0.6].flatMap(x => hiddenLines(f, "A", x)).concat(hiddenLines(f, "A", 0.5, "반반")), B: [0.4, 0.5, 0.6].flatMap(x => hiddenLines(f, "B", x)).concat(hiddenLines(f, "B", 0.5, "반반")) }])) as typeof OPEN_LINES;
    for (const bank of [OPEN_LINES, BLIND_LINES, hiddenAll, CLOSER_LINES]) for (const f of MIRROR_FACET_IDS) for (const side of ["A", "B"] as const) {
      const lines = bank[f][side];
      expect(new Set(lines).size, `${f}${side}`).toBeGreaterThanOrEqual(3);
      for (const l of lines) { expect(l, l).toMatch(/요[.]$/); expect(l.split(/(?<=[.?!])\s/).length, l).toBe(1); expect(l, l).not.toMatch(/친구들/); }
    }
  });
  it("한 줄 판정 수식어: 4종 × 12면 × 2쪽 × 2개 이상, 유형 이름 낱말을 쓰지 않는다", () => {
    for (const kind of ["blind", "hidden", "closer", "open"] as const) for (const f of MIRROR_FACET_IDS) for (const side of ["A", "B"] as const) {
      const mods = MODIFIERS[kind][f][side];
      expect(new Set(mods).size, `${kind}:${f}${side}`).toBeGreaterThanOrEqual(2);
      for (const m of mods) {
        expect(m).not.toMatch(/다정한|자유로운|단단한|기발한|모험가|해결사|몽상가|장인/);
        const last = m.charCodeAt(m.length - 1) - 0xac00;
        expect(last % 28, m).toBe(4); // 관형형 「-ㄴ/-는」으로 끝나 뒤에 유형 이름이 붙는다
      }
    }
  });
  it("애착 4유형 × (내가 본 / 가까운 사람이 본) 3개 이상, 확인 · 거리 10문항 장면 줄이 다 있다", () => {
    for (const t of ["secure", "anxious", "avoidant", "fearful"] as const) { expect(ATTACH_SAME[t].length).toBeGreaterThanOrEqual(3); expect(ATTACH_FRIEND[t].length).toBeGreaterThanOrEqual(3); }
    for (const i of MIRROR_ITEMS.filter(x => x.facet === "check" || x.facet === "dist")) { expect(ATTACH_ITEM[i.id]?.A).toMatch(/거예요\.$/); expect(ATTACH_ITEM[i.id]?.B).toMatch(/거예요\.$/); }
    for (const f of MIRROR_FACET_IDS) { expect(SIDE_NOUN[f].A).toMatch(/쪽$/); expect(SIDE_NOUN[f].B).toMatch(/쪽$/); expect(UNKNOWN_QUESTION[f]).toMatch(/지$/); }
    for (const level of BAND_LEVELS) expect(BAND[level].length).toBeGreaterThanOrEqual(8);
  });
});

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
    expect(r.sections.find(s => s.key === "next")!.lead[0]).toMatch(/12월 4일/);
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
    expect(one.scenes[0].count).toMatch(/^\S+ 면 · (직접 고른 답과 다름|이 친구는 다른 답|본인 답과 엇갈림|이 친구 답은 반대쪽)$/);
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
      expect(one).toMatch(new RegExp(`${ownerName === "민지" ? "민지를" : "서준을"}|이 친구가 맞힌 비율`));
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

describe("틀 문장 원칙(검사 기준)", () => {
  it("문항 하나만 엇갈리고 면 전체는 본인 쪽이면 면 단위로 말하지 않고, 판정 수식어로도 쓰지 않는다", () => {
    const self = selfWith({ imag: 1 }); // 상상 면 본인은 B(현실) 4개
    const aItem = ids("imag").find(id => self[id] === 0)!; // 본인이 A를 고른 예외 문항
    const r = buildReport(input(self, onItem(self, aItem, 3, 0)));
    const blind = r.sections.find(s => s.key === "blind")!;
    expect(blind.body[0]).toMatch(/상상 면/);
    expect(blind.body[0]).toMatch(/4개/);
    expect(blind.body[0]).toContain("「현실과 감각 쪽」");
    for (const l of BLIND_LINES.imag.B) expect(blind.body[0]).not.toContain(l.slice(0, -1));
    expect(r.verdict.title.startsWith("본인만 현실적인 줄 아는") || r.verdict.title.startsWith("알고 보면 감성 충만한")).toBe(false);
  });
  it("면 전체 친구 답이 반반(40~60%)이면 단정하지 않는다", () => {
    const self = selfWith({ emo: 5 });
    const emo = ids("emo");
    // 문항 하나는 3명 모두 반대, 면 전체는 반반(11개 중 A 6개).
    const sessions = [...onItem(self, emo[0], 3, 0), ...[1, 2, 3, 4].flatMap(k => [sess(`e${k}a`, [{ itemId: emo[k], choice: k % 2 ? 0 : 1 }]), sess(`e${k}b`, [{ itemId: emo[k], choice: 0 }])])];
    const r = buildReport(input(self, sessions));
    const body = r.sections.find(s => s.key === "blind")!.body[0];
    expect(body).toMatch(/반|팽팽|기울지 않/);
    for (const l of BLIND_LINES.emo.B) expect(body).not.toContain(l.slice(0, -1));
  });
  it("가까운 사람 답이 반반이면 애착 유형을 단정하지 않는다", () => {
    const self = selfWith({ check: 4, dist: 4 });
    const half = (f: FacetId, k: number) => ids(f).slice(0, 2).map((id, j) => ({ itemId: id, choice: ((k + j) % 2) as Choice }));
    const sessions = Array.from({ length: 4 }, (_, k) => sess(`h${k}`, [...half("check", k), ...half("dist", k)], 3));
    const r = buildReport(input(self, sessions));
    const attach = r.sections.find(s => s.key === "attach")!;
    expect(attach.body.join(" ")).toMatch(/반반|팽팽|엇비슷|갈려/);
    for (const t of ["secure", "anxious", "avoidant", "fearful"] as const) for (const l of [...ATTACH_SAME[t], ...ATTACH_FRIEND[t]]) expect(attach.body.join(" ")).not.toContain(l.slice(0, -1));
  });
  it("나만 아는 나 · 가까울수록 보이는 나의 두 문단은 서로 다른 틀, 면 이름은 면 정의 순서", () => {
    const self = selfWith({ trust: 5, worry: 0 });
    const split = (f: FacetId, tag: string) => ids(f).flatMap((id, k) => [sess(`${tag}${k}a`, [{ itemId: id, choice: 0 }]), sess(`${tag}${k}b`, [{ itemId: id, choice: 1 }])]);
    const r = buildReport(input(self, [...split("trust", "t"), ...split("worry", "w")]));
    const hidden = r.sections.find(s => s.key === "hidden")!;
    expect(hidden.body).toHaveLength(2);
    expect(skeletonOf(hidden.body[0]).slice(0, 12)).not.toBe(skeletonOf(hidden.body[1]).slice(0, 12));
    expect(endingOf(hidden.body[0])).not.toBe(endingOf(hidden.body[1]));
    expect(hidden.lead).toEqual([]);
  });
  it("숫자 뒤 「로/으로」", () => {
    expect([1, 2, 3, 6, 7, 8, 10, 13, 20, 100].map(numRo)).toEqual(["1로", "2로", "3으로", "6으로", "7로", "8로", "10으로", "13으로", "20으로", "100으로"]);
  });
});

describe("2차 검사 기준(근거 · 반복)", () => {
  it("꼭지 2는 그 면 전체 같게 본 비율 70% 이상일 때만 면 이름을 말한다", () => {
    const self = selfWith({ soc: 5 });
    const soc = ids("soc");
    // soc-1은 3명 모두 같은 답(장면), 면 전체는 반반 → 면 이름을 쓰지 않는다.
    const weak = [...onItem(self, soc[0], 3, 3), ...soc.slice(1).flatMap((id, k) => [sess(`w${k}a`, [{ itemId: id, choice: 0 }]), sess(`w${k}b`, [{ itemId: id, choice: 1 }])])];
    const r1 = buildReport(input(self, weak)), open1 = r1.sections.find(s => s.key === "open")!;
    expect(open1.lead).toEqual([]);
    expect(open1.scenes).toHaveLength(1);
    // 면 전체도 같은 쪽(5문항 모두 4명이 같은 답) → 면 이름을 쓴다.
    const strong = soc.flatMap(id => onItem(self, id, 4, 4, 2, `s-${id}`));
    const open2 = buildReport(input(self, strong)).sections.find(s => s.key === "open")!;
    expect(open2.lead[0]).toMatch(/사교 면/);
  });
  it("다음 호 안내 괄호는 조건에 맞는 묶음 인원(1~2명은 「3명 미만」)", () => {
    const self = selfWith();
    const sessions = [...onItem(self, "soc-1", 3, 3, 1, "acq"), ...onItem(self, "lead-1", 2, 2, 3, "close")];
    const next = buildReport(input(self, sessions)).sections.find(s => s.key === "next")!.body.join(" ");
    expect(next).toMatch(/지금 아는 사이 3명 · 가까운 사이 3명 미만/);
    expect(next).toMatch(/지금 친구 · 가까운 사이 3명 미만/);
    expect(next).not.toMatch(/지금 친구 \d+명\)/);
  });
  it("아직 아무도 모르는 나: 동률이면 같이 부른다(「가장」 단독 지목 없음)", () => {
    const self = selfWith();
    // 열두 면 중 사교 · 공감 · 탐구만 답이 1개, 나머지는 2개.
    const one2 = (f: FacetId) => (["soc", "emp", "inq"].includes(f) ? 1 : 2);
    const sessions = MIRROR_FACET_IDS.flatMap(f => ids(f).slice(0, one2(f)).map((id, k) => sess(`${f}${k}`, [{ itemId: id, choice: self[id] }], 2)));
    const unknown = buildReport(input(self, sessions)).sections.find(s => s.key === "unknown")!.lead[0];
    expect(unknown).toMatch(/사교 · 공감 · 탐구 면/);
  });
  it("뼈대 점검: 숫자 · 「…」 · “…” · 면 이름만 다른 문장은 같은 뼈대로 잡는다", () => {
    expect(skeletonOf("사교 면은 친구 답 12개 중 9개가 「사람 속에서 충전하는 쪽」이라, “모임이 끝나고”")).toBe(skeletonOf("감정 면은 친구 답 30개 중 21개가 「감정이 바로 드러나는 쪽」이라, “화가 나면”"));
    const r = buildReport(input(selfWith(), onItem(selfWith(), "soc-1", 3, 3)));
    // 같은 사람의 두 호를 같은 내용으로 만들면(호 번호만 다름) (b) 점검기가 뼈대 겹침을 잡는다.
    expect(sameOwnerSkeletons(r, r).length).toBeGreaterThan(0);
  });
  it("같은 사람의 1호 · 2호는 같은 꼭지 뼈대가 겹치지 않게 돌아간다(장면 · 숫자 제외)", () => {
    const self = selfWith({ soc: 5, emo: 0, worry: 5, plan: 1 });
    const sessions = crowd(self, 14, 24, k => (k % 3 === 0 ? 1 : k % 3 === 1 ? 2 : 3) as Closeness);
    const a = buildReport(input(self, sessions)), b = buildReport(input(self, sessions, { issueNo: 2 }));
    expect(sameOwnerSkeletons(a, b).length).toBeLessThanOrEqual(1);
  });
});

describe("3차 검사 기준", () => {
  /** 싱크로율이 대략 target이 되게: 문항마다 친구 3명, 맞힌 비율을 맞춘다. */
  function atSync(target: number) {
    const self = selfWith();
    const sessions = MIRROR_ITEMS.flatMap((item, i) => Array.from({ length: 4 }, (_, k) => sess(`${item.id}-${k}`, [{ itemId: item.id, choice: ((i * 4 + k) * 37 % 100) / 100 < target ? self[item.id] : (1 - self[item.id]) as Choice }], 2)));
    return { self, sessions };
  }
  it("요약 구간 말은 싱크로율 구간과 맞고, 판정 수식어와 반대로 읽히지 않는다", () => {
    for (const t of [0.9, 0.72, 0.6, 0.5, 0.3]) {
      const { self, sessions } = atSync(t), r = buildReport(input(self, sessions));
      const level = bandLevel(r.verdict.sync);
      expect(r.verdict.summary, `${r.verdict.sync}%`).toMatch(BAND_WORD[level]);
      if (level === "high" || level === "good" || level === "more") for (const w of [...MODIFIER_FALLBACK.low, ...MODIFIER_FALLBACK.half]) expect(r.verdict.title.startsWith(w), r.verdict.title).toBe(false);
    }
    expect([80, 79, 65, 64, 55, 54, 45, 44].map(bandLevel)).toEqual(["high", "good", "good", "more", "more", "half", "half", "low"]);
  });
  it("가까울수록 보이는 나: 「친해질수록 · 가까울수록」류 문장에는 아는 사이 · 가까운 사이 숫자가 함께 있다", () => {
    const self = selfWith();
    const soc = ids("soc"), worry = ids("worry");
    const g = (c: Closeness, choice: Choice, n: number, tag: string, items: string[]) => Array.from({ length: n }, (_, k) => sess(`${tag}${k}`, items.map(id => ({ itemId: id, choice })), c));
    for (const seed of ["a1", "b2", "c3", "d4", "e5", "f6"]) {
      const r = buildReport(input(self, [...g(1, 1, 3, "a", [soc[0], soc[1], worry[0]]), ...g(3, 0, 3, "c", [soc[0], soc[1], worry[0]])], { seedKey: seed }));
      for (const line of r.sections.find(s => s.key === "closer")?.body ?? []) {
        expect(line).toMatch(/아는 사이[^,]*\d+개/);
        expect(line).toMatch(/가까운 사이[^,]*\d+개/);
      }
    }
  });
  it("나만 아는 나: 「만」은 절반 미만일 때만, 「본인만」은 쓰지 않는다", () => {
    for (const seed of ["a1", "b2", "c3", "d4", "e5", "f6", "g7", "h8"]) {
      const self = selfWith({ trust: 5, worry: 0 });
      const split = (f: FacetId, tag: string, extraA: number) => ids(f).flatMap((id, k) => [sess(`${tag}${k}a`, [{ itemId: id, choice: 0 }]), sess(`${tag}${k}b`, [{ itemId: id, choice: k < extraA ? 0 : 1 }])]);
      const r = buildReport(input(self, [...split("trust", "t", 1), ...split("worry", "w", 1)], { seedKey: seed }));
      for (const line of r.sections.find(s => s.key === "hidden")?.body ?? []) {
        for (const m of line.matchAll(/(\d+)개 중 (\d+)개만/g)) expect(Number(m[2]) * 2, line).toBeLessThan(Number(m[1]));
        expect(line).not.toMatch(/본인만/);
      }
    }
  });
  it("끝맺음 낱말: 「쪽이에요」 · 「쪽일 거예요」는 같은 끝, 한 보고서 안 연달음 · 세 번 이상 0", () => {
    expect(endingKey("가까울수록 받쳐 주는 쪽이에요.")).toBe(endingKey("친한 사이에선 한발 물러서는 쪽일 거예요."));
    expect(endingKey("…덜 보였을 거예요.")).toBe("보였");
    const self = selfWith({ soc: 5, emo: 0, worry: 5, plan: 1, check: 4, dist: 1 });
    for (const seed of ["k9x2m", "zz1", "q7", "p0p"]) {
      const sessions = crowd(self, 18, 24, k => (k % 3 === 0 ? 1 : k % 3 === 1 ? 2 : 3) as Closeness, 0.62);
      expect(withinReportFindings(seed, buildReport(input(self, sessions, { seedKey: seed })))).toEqual([]);
    }
  });
  it("글자 그대로 점검: 쉼표 마디까지 비교하고, 다른 사람 사이 같은 마디를 잡는다", () => {
    expect(segmentsOf("가까운 사람 답이 확인 면에서 6개 중 4개, 거리 면에서 5개 중 3개라, 믿고 기대는 게 자연스러운 쪽이에요.")).toEqual(["가까운 사람 답이 확인 면에서 6개 중 4개", "거리 면에서 5개 중 3개라", "믿고 기대는 게 자연스러운 쪽이에요"]);
    const r = buildReport(input(selfWith(), onItem(selfWith(), "soc-1", 3, 3)));
    expect(exactDuplicates([{ id: "a", snapshot: r }, { id: "b", snapshot: r }]).length).toBeGreaterThan(0);
    expect(exactDuplicates([{ id: "a", snapshot: r }])).toEqual([]);
    expect(repetitionFindings([{ id: "a", snapshot: r }])).toEqual([]);
  });
});

describe("4차 검사 기준", () => {
  const seeds = ["k9x2m", "zz1", "q7", "p0p", "a1", "b2"];
  /** 친구 · 친밀도 · 맞힌 비율을 섞은 보고서들(호 1 · 2). */
  const mixed = () => seeds.flatMap((seed, i) => {
    const self = selfWith({ soc: 5, emo: 0, worry: 5, plan: 1, check: 4, dist: 1 });
    const sessions = crowd(self, 6 + i * 3, 18 + i * 2, k => (k % 3 === 0 ? 1 : k % 3 === 1 ? 2 : 3) as Closeness, 0.5 + i * 0.07);
    return [1, 2].map(issueNo => buildReport(input(self, sessions, { seedKey: seed, issueNo })));
  });
  it("요약에는 맞힌 개수를 쓰지 않는다: 숫자는 친구 수 · 답 수뿐(싱크로율은 면별 평균이라 합계 개수와 어긋난다)", () => {
    for (const r of mixed()) {
      const nums = [...r.verdict.summary.matchAll(/\d+/g)].map(m => Number(m[0]));
      for (const n of nums) expect([r.stats.friends, r.stats.answers], r.verdict.summary).toContain(n);
      expect(r.verdict.summary).not.toMatch(/개가 (같|본인|직접)|개를 맞|개만 /);
    }
    const one = buildReport(input(selfWith(), [sess("only", MIRROR_ITEMS.map(i => ({ itemId: i.id, choice: 0 as Choice })))]));
    expect([...one.verdict.summary.matchAll(/\d+/g)].map(m => Number(m[0]))).toEqual([60]);
  });
  it("가까운 관계의 나 첫 줄: 앞마디 × 유형 문장 모든 짝에서 「답」은 두 번까지(장면 · 고른 답 원문 제외)", () => {
    for (const f of ATTACH_SELF_FRONT) for (const t of ATTACH_SELF_TYPE) for (const near of [true, false]) {
      const line = f({ scene: "장면", ans: "고른 것" }) + t({ label: "안정형", near });
      expect((line.replace(/「[^」]*」|“[^”]*”/g, "").match(/답/g) ?? []).length, line).toBeLessThanOrEqual(2);
    }
  });
  it("반반 말: 「반으로 · 반씩」 없이 실제 수로, 같은 수일 때만 「딱 반반」", () => {
    expect(vsHalf(2, 3)).toBe("2 대 3으로 팽팽한 편");
    expect(vsHalf(3, 3)).toBe("3 대 3으로 딱 반반");
    const banks = [
      ...SPLIT_FRONT.map(f => f({ name: "감정", n: 7, a: 4, b: 3 })),
      ...HIDDEN_FRONT.map(f => f({ name: "감정", k5: 5, side: "감정이 바로 드러나는 쪽", n: 7, m: 3 })),
      ...ATTACH_SPLIT_BOTH.map(f => f({ n: 4, both: "확인 면 3 대 2, 거리 면 3 대 3으로 둘 다 팽팽한 편" })),
      ...ATTACH_SPLIT_ONE.map(f => f({ n: 4, clear: "확인", cn: 6, ck: 5, cside: "자주 확인하고 싶은 쪽", split: "거리", sp: vsHalf(3, 2) })),
    ];
    for (const t of banks) expect(t).not.toMatch(/반으로|반씩/);
    for (const r of mixed()) for (const line of [r.verdict.summary, ...r.sections.flatMap(s => [...s.lead, ...s.body])]) {
      expect(line).not.toMatch(/반으로 (나뉘|갈)|반씩 (나뉘|갈)/);
      for (const m of line.matchAll(/(\d+) 대 (\d+)(?:으로|로)? (딱|거의) 반반/g)) expect(m[3] === "딱", line).toBe(m[1] === m[2]);
    }
  });
  it("두 묶음을 잇는 앞마디는 「…」 뒤에 늘 토씨 · 서술이 붙는다(「~쪽, 가까운 사이…」 · 「~쪽으로 가까운 사이…」 없음)", () => {
    const v = { name: "공감", s1: "마음부터 챙기는 쪽", n1: 5, k1: 4, s3: "해결부터 찾는 쪽", n3: 12, k3: 11 };
    const av = { n: 4, label: "안정형", near: false, cn: 6, ck: 5, cs: "믿고 기다리는 쪽", dn: 6, dk: 4, ds: "기대는 쪽" };
    for (const t of [...CLOSER_FRONT.map(f => f(v)), ...CLOSER_NEXT_FRONT.map(f => f(v)), ...ATTACH_SAME_FRONT.map(f => f(av)), ...ATTACH_DIFF_FRONT.map(f => f(av))]) {
      expect(t, t).not.toMatch(/」(\([^)]*\))?, /);
      expect(t, t).not.toMatch(/」(으로|로) (아는|가까운|거리|확인)/);
    }
  });
  it("한 꼭지 안 똑같은 줄 0(장면 근거 줄 포함) · 「이 질문도」 없음 — 점검기도 잡는다", () => {
    const self = selfWith({ trust: 5, dist: 0 });
    // 숨길 수 없는 나: 세 문항 모두 친구 3명 중 3명 같은 답 → 근거 줄 꼴이 서로 달라야 한다.
    const sessions = [...onItem(self, "soc-1", 3, 3), ...onItem(self, "lead-1", 3, 3), ...onItem(self, "inq-1", 3, 3),
      ...ids("trust").flatMap((id, k) => [sess(`t${k}a`, [{ itemId: id, choice: 0 }]), sess(`t${k}b`, [{ itemId: id, choice: 1 }])]),
      ...ids("dist").flatMap((id, k) => [sess(`d${k}a`, [{ itemId: id, choice: 0 }], 3), sess(`d${k}b`, [{ itemId: id, choice: 1 }], 3)])];
    for (const seed of seeds) {
      const r = buildReport(input(self, sessions, { seedKey: seed }));
      for (const s of r.sections) {
        const lines = [...s.lead, ...s.body, ...s.scenes.map(sc => sc.count)];
        expect(new Set(lines).size, `${seed} ${s.key} ${lines.join(" / ")}`).toBe(lines.length);
        for (const sc of s.scenes) expect(sc.count).not.toMatch(/질문도/);
      }
      expect(withinReportFindings(seed, r)).toEqual([]);
      expect(r.sections.find(s => s.key === "open")!.scenes.length).toBe(3);
    }
    const r = buildReport(input(self, sessions));
    const open = r.sections.find(s => s.key === "open")!;
    const copy: ReportSnapshot = { ...r, sections: r.sections.map(s => (s === open ? { ...s, scenes: s.scenes.map(sc => ({ ...sc, count: open.scenes[0].count })) } : s)) };
    expect(withinReportFindings("x", copy).some(f => f.includes("같은 줄 두 번"))).toBe(true);
    for (const m of mixed()) for (const s of m.sections) { const c = s.scenes.map(sc => sc.count); expect(new Set(c).size, c.join(" / ")).toBe(c.length); }
  });
  it("다음 호 안내: 문항당 인원은 「질문당 최대 n명」", () => {
    const self = selfWith();
    const r = buildReport(input(self, [...onItem(self, "soc-1", 2, 2), ...onItem(self, "emo-1", 2, 1)]));
    const next = r.sections.find(s => s.key === "next")!.body.join(" ");
    expect(next).toMatch(/\(지금 질문당 최대 2명\)/);
    expect(next).not.toMatch(/최대 \d+개/);
  });
});

describe("5차 검사 기준(규칙)", () => {
  const seeds = ["k9x2m", "zz1", "q7", "p0p", "a1", "b2", "c3", "d4"];
  const mixed = () => seeds.flatMap((seed, i) => {
    const self = selfWith({ soc: 5, emo: 0, worry: 5, plan: 1, check: 4, dist: 1, trust: 4 });
    const sessions = crowd(self, 6 + i * 4, 18 + i * 2, k => (k % 3 === 0 ? 1 : k % 3 === 1 ? 2 : 3) as Closeness, 0.5 + (i % 4) * 0.08);
    return [1, 2].map(issueNo => buildReport(input(self, sessions, { seedKey: seed, issueNo })));
  });
  const sentences = (r: ReportSnapshot) => [r.verdict.summary, ...r.sections.flatMap(s => [...s.lead, ...s.body])].flatMap(l => l.split(/(?<=[.?!])\s+/)).filter(Boolean);
  it("규칙 1: 「거예요」 끝맺음은 문장의 3분의 1 이하, 이어진 두 문장이 같이 「거예요」로 끝나지 않는다 — 점검기도 잡는다", () => {
    for (const r of mixed()) {
      const geo = sentences(r).map(x => /거예요[.]$/.test(x));
      expect(geo.filter(Boolean).length * 3, reportToText(r)).toBeLessThanOrEqual(geo.length);
      geo.forEach((g, i) => expect(g && i > 0 && geo[i - 1], sentences(r)[i]).toBeFalsy());
      expect(withinReportFindings("m", r)).toEqual([]);
    }
    expect(softEndings("가까울수록 받쳐 주는 쪽일 거예요.")).toEqual(expect.arrayContaining(["가까울수록 받쳐 주는 쪽으로 보여요.", "가까울수록 받쳐 주는 쪽일지도 몰라요.", "가까울수록 받쳐 주는 쪽인 듯해요.", "가까울수록 받쳐 주는 쪽일 가능성이 커요."]));
    expect(softEndings("숫자 근거 뒤 여유로운 편일 거예요.")).toContain("숫자 근거 뒤 여유로운 편이에요.");
    expect(softEndings("가까운 사람만 알아챌 거예요.")).toEqual(["가까운 사람만 알아챌지도 몰라요.", "가까운 사람만 알아챌 듯해요.", "가까운 사람만 알아챌 가능성이 커요."]);
    expect(softEndings("곁에서는 기분을 먼저 읽은 거예요.")).toEqual(["곁에서는 기분을 먼저 읽은 셈이에요."]);
    expect(softEndings("이미 다 보여요.")).toEqual([]);
    const r = buildReport(input(selfWith(), onItem(selfWith(), "soc-1", 3, 3)));
    const open = r.sections.find(s => s.key === "open")!;
    const bad: ReportSnapshot = { ...r, sections: r.sections.map(s => (s === open ? { ...s, body: ["하나는 그럴 거예요.", "둘도 그럴 거예요."] } : s)) };
    expect(withinReportFindings("x", bad).some(f => f.includes("「거예요」"))).toBe(true);
  });
  it("규칙 1: 꼭지 5 둘째 면은 첫 면과 다른 틀(「~도 · 역시 · 에서도」)", () => {
    let seen = 0;
    for (const r of mixed()) {
      const body = r.sections.find(s => s.key === "closer")?.body ?? [];
      if (body.length < 2) continue;
      seen++;
      expect(frameOf(body[1], [r.ownerName])).not.toBe(frameOf(body[0], [r.ownerName]));
      expect(body[1]).toMatch(/면도|면 역시|면에서도|또 하나 갈린/);
    }
    const self = selfWith();
    const soc = ids("soc"), worry = ids("worry");
    const g = (c: Closeness, choice: Choice, n: number, tag: string) => Array.from({ length: n }, (_, k) => sess(`${tag}${k}`, [soc[0], soc[1], worry[0], worry[1]].map(id => ({ itemId: id, choice })), c));
    const r = buildReport(input(self, [...g(1, 1, 3, "a"), ...g(3, 0, 3, "c")]));
    const body = r.sections.find(s => s.key === "closer")!.body;
    expect(body).toHaveLength(2);
    expect(body[1]).toMatch(/면도|면 역시|면에서도|또 하나 갈린/);
    expect(seen + 1).toBeGreaterThan(0);
  });
  it("규칙 2: 나만 아는 나 결론은 밖에서 알아본 비율 구간에 맞는다(45% 미만 · 45~55% · 55% 초과)", () => {
    expect([0.4, 0.44, 0.45, 0.5, 0.55, 0.56, 0.6].map(hiddenBucket)).toEqual(["low", "low", "half", "half", "half", "high", "high"]);
    const marker = { low: /절반이 안|많지 않|덜 띄었|절반 가까이만|열에 넷/, half: /절반쯤|절반 정도|엇비슷|둘 중 하나꼴/, high: /절반을 넘|절반 넘|열에 여섯|조금 더 많/ } as const;
    for (const b of ["low", "half", "high"] as const) for (const f of HIDDEN_BACK[b]) {
      const line = f("시험 결");
      expect(line, line).toMatch(marker[b]);
      for (const o of (["low", "half", "high"] as const).filter(x => x !== b)) expect(line, `${b}: ${line}`).not.toMatch(marker[o]);
      expect(line).not.toMatch(/가까운 사람만|일부만/);
    }
    // 본인 신뢰 5/5 「확인하고 믿는 쪽」(B), 친구 답 10개 중 B가 4 · 5 · 6개.
    for (const [bCount, b] of [[4, "low"], [5, "half"], [6, "high"]] as const) for (const seed of ["a1", "b2", "c3"]) {
      const self = selfWith({ trust: 0 });
      const sessions = ids("trust").flatMap((id, k) => [sess(`t${k}a`, [{ itemId: id, choice: k * 2 < bCount ? 1 : 0 }]), sess(`t${k}b`, [{ itemId: id, choice: k * 2 + 1 < bCount ? 1 : 0 }])]);
      const hidden = buildReport(input(self, sessions, { seedKey: seed })).sections.find(s => s.key === "hidden")!;
      // 앞마디가 이미 고른 정도를 말했으면 뒤 마디는 비율 없이 뜻만, 아니면 구간 말.
      const [head, tail] = [hidden.body[0].slice(0, hidden.body[0].indexOf(", ")), hidden.body[0].slice(hidden.body[0].indexOf(", ") + 2)];
      if (RATIO_WORDS.test(head)) expect(tail, hidden.body[0]).not.toMatch(/절반|반만|반쯤/);
      else expect(tail, hidden.body[0]).toMatch(marker[b]);
    }
  });
  it("규칙 3: 나만 아는 나 마디는 면 뜻 이름(HIDDEN_TRAIT) × 구간 말(HIDDEN_BACK)로만 만든다", () => {
    for (const r of mixed()) for (const line of r.sections.find(s => s.key === "hidden")?.body ?? []) {
      const tail = line.slice(line.indexOf(", ") + 2);
      const allForms = MIRROR_FACET_IDS.flatMap(f => (["A", "B"] as const).flatMap(side => [0.4, 0.5, 0.6].flatMap(x => hiddenLines(f, side, x)).concat(hiddenLines(f, side, 0.5, "반반"))));
      expect(allForms.flatMap(x => [x, ...softEndings(x)]), tail).toContain(tail);
    }
    for (const f of MIRROR_FACET_IDS) for (const side of ["A", "B"] as const) expect(HIDDEN_TRAIT[f][side].length).toBeGreaterThanOrEqual(3);
  });
  it("규칙 4(7차에 좁힘): 같은 「N 대 M」은 한 보고서에서 숫자로 한 번만, 둘째부터는 말로 — 점검기도 잡는다", () => {
    for (const r of mixed()) {
      const n = new Map<string, number>();
      for (const k of sentences(r).flatMap(vsKeysOf)) n.set(k, (n.get(k) ?? 0) + 1);
      for (const [k, c] of n) expect(c, `${k} ${reportToText(r)}`).toBeLessThanOrEqual(1);
    }
    // 확인 · 거리 면 모두 반반: 꼭지 3 · 4에서 같은 수가 이미 나왔으면 꼭지 6은 「앞서 본 것처럼」 · 말로.
    const self = selfWith({ check: 0, dist: 5 });
    const half = (f: FacetId, tag: string) => ids(f).flatMap((id, k) => [sess(`${tag}${k}a`, [{ itemId: id, choice: 0 }], 3), sess(`${tag}${k}b`, [{ itemId: id, choice: 1 }], 3)]);
    const extra = [...onItem(self, ids("check")[0], 3, 0, 2, "xc"), ...onItem(self, "soc-1", 3, 3, 2, "xs")];
    const r = buildReport(input(self, [...half("check", "c"), ...half("dist", "d"), ...extra]));
    const text = reportToText(r);
    const n = new Map<string, number>();
    for (const k of sentences(r).flatMap(vsKeysOf)) n.set(k, (n.get(k) ?? 0) + 1);
    for (const [k, c] of n) expect(c, `${k} ${text}`).toBeLessThanOrEqual(1);
    expect(withinReportFindings("v", r)).toEqual([]);
    const open = r.sections.find(s => s.key === "attach")!;
    const bad: ReportSnapshot = { ...r, sections: r.sections.map(s => (s === open ? { ...s, body: ["3 대 2, 2 대 3이에요."] } : s)) };
    expect(withinReportFindings("x", bad).some(f => f.includes("N 대 M"))).toBe(true);
  });
  it("그 밖: 한 사람이 본 나 「추려 보여 드려요」 · 꼭지 5 관형절 꼴 없음 · 다음 호 첫 줄 「%인 이번 호」 없음", () => {
    const self = selfWith();
    const one = buildReport(input(self, [sess("only", MIRROR_ITEMS.map((i, k) => ({ itemId: i.id, choice: (k % 3 === 0 ? 1 - self[i.id] : self[i.id]) as Choice })))]));
    const lead = one.sections.find(s => s.key === "one")!.lead.join(" ");
    expect(lead).not.toMatch(/골랐어요/);
    expect(lead).toMatch(/추려|모아 보여/);
    const v = { name: "공감", s1: "마음부터 챙기는 쪽", n1: 3, k1: 3, s3: "해결부터 찾는 쪽", n3: 3, k3: 2 };
    for (const t of [...CLOSER_FRONT, ...CLOSER_NEXT_FRONT].map(f => f(v))) expect(t, t).not.toMatch(/」(으로|로) 본 .* 봤으니/);
    for (const r of mixed()) expect(r.sections.find(s => s.key === "next")!.lead[0]).not.toMatch(/%인|기준으로/);
  });
});

describe("6차 검사 기준", () => {
  it("다음 호 「늘어난 답」 문장은 기준점(지난 호)을 문장 안에 담고, 앞 문장에 기대는 지시어로 시작하지 않는다", () => {
    for (const f of NEXT_GROWTH) {
      const t = f({ d: 12 });
      expect(t, t).toMatch(/지난 호/);
      expect(t, t).not.toMatch(/^(그사이|그동안|그때|이때|그래서|그러니|그만큼|이렇게|그렇게)/);
    }
  });
  /** 고른 정도 말 → 그 말을 써도 되는지(엔진 전체 기준). */
  const allowed = (t: string, a: number, b: number) => {
    if (/반반|엇비슷|어느 쪽으로도 기울지 않/.test(t)) expect(isEven(a, b), `${a}:${b} ${t}`).toBe(true);
    if (/팽팽/.test(t)) expect(isTight(a, b), `${a}:${b} ${t}`).toBe(true);
    if (/딱 반반/.test(t)) expect(a, t).toBe(b);
  };
  it("「반반 · 거의 반반 · 엇비슷 · 어느 쪽으로도 기울지 않」은 45~55%만, 「팽팽」은 그때나 차이 1 이하만 — 뱅크 전 변형", () => {
    expect(isEven(19, 18)).toBe(true); expect(isEven(5, 4)).toBe(false); expect(isEven(4, 6)).toBe(false); expect(isEven(9, 11)).toBe(true);
    expect(isTight(3, 2)).toBe(true); expect(isTight(7, 10)).toBe(false); expect(isTight(9, 7)).toBe(false);
    expect([halfWord(3, 3), halfWord(19, 18), halfWord(3, 2), halfWord(7, 10)]).toEqual(["딱 반반", "거의 반반", "팽팽한 편", "조금 기운 편"]);
    expect(vsHalf(7, 10)).toBe("7 대 10으로 조금 기운 편");
    const pairs: [number, number][] = [[4, 6], [6, 4], [7, 10], [6, 9], [3, 2], [2, 3], [19, 18], [3, 3], [9, 7], [10, 8], [5, 5], [8, 7]];
    for (const [a, b] of pairs) {
      for (const f of SPLIT_FRONT) allowed(f({ name: "감정", n: a + b, a, b }), a, b);
      for (const f of HIDDEN_FRONT) allowed(f({ name: "감정", k5: 5, side: "감정이 바로 드러나는 쪽", n: a + b, m: a }), a, b);
      for (const f of ATTACH_SPLIT_ONE) allowed(f({ n: 4, clear: "확인", cn: 6, ck: 5, cside: "자주 확인하고 싶은 쪽", split: "거리", sp: vsHalf(a, b) }), a, b);
    }
  });
  it("40%대 초반 · 50%대 후반으로 갈린 면은 꼭지 3 · 4 · 6 모두 「반반 · 팽팽 · 엇비슷」을 쓰지 않는다", () => {
    const even = /반반|엇비슷|팽팽|어느 쪽으로도 기울지 않/;
    for (const seed of ["a1", "b2", "c3", "d4", "e5", "f6", "g7", "h8"]) {
      // 꼭지 3: 감정 면 본인 A 5개, 친구 답 10개 중 A 4개(40%) + 문항 하나는 3명 모두 반대.
      const s3 = selfWith({ emo: 5 }), emo = ids("emo");
      const blindS = [...onItem(s3, emo[0], 3, 0), ...[1, 2, 3].flatMap(k => [sess(`e${k}a`, [{ itemId: emo[k], choice: k === 1 ? 0 : 1 }]), sess(`e${k}b`, [{ itemId: emo[k], choice: k === 3 ? 1 : 0 }])]), sess("e4", [{ itemId: emo[4], choice: 0 }])];
      const blind = buildReport(input(s3, blindS, { seedKey: seed })).sections.find(s => s.key === "blind")!;
      expect(blind.body.join(" "), blind.body.join(" ")).not.toMatch(even);
      // 꼭지 4: 신뢰 면 본인 B 5개, 친구 답 10개 중 B 4개 · 6개.
      for (const bCount of [4, 6]) {
        const s4 = selfWith({ trust: 0 });
        const hs = ids("trust").flatMap((id, k) => [sess(`t${k}a`, [{ itemId: id, choice: k * 2 < bCount ? 1 : 0 }]), sess(`t${k}b`, [{ itemId: id, choice: k * 2 + 1 < bCount ? 1 : 0 }])]);
        const hidden = buildReport(input(s4, hs, { seedKey: seed })).sections.find(s => s.key === "hidden")!;
        expect(hidden.body.join(" "), hidden.body.join(" ")).not.toMatch(even);
      }
      // 꼭지 6: 가까운 사이 5명, 확인 면 4 대 6 · 거리 면은 한쪽.
      const s6 = selfWith({ check: 4, dist: 4 }), ck = ids("check"), dt = ids("dist");
      const as = Array.from({ length: 5 }, (_, k) => sess(`c${k}`, [{ itemId: ck[0], choice: (k < 2 ? 0 : 1) as Choice }, { itemId: ck[1], choice: (k < 2 ? 0 : 1) as Choice }, { itemId: dt[0], choice: 0 as Choice }, { itemId: dt[1], choice: 0 as Choice }], 3));
      const attach = buildReport(input(s6, as, { seedKey: seed })).sections.find(s => s.key === "attach")!;
      expect(reportToText(buildReport(input(s6, as, { seedKey: seed }))), attach.body.join(" ")).toMatch(/4 대 6|6 대 4/);
      expect(attach.body.join(" "), attach.body.join(" ")).not.toMatch(even);
    }
  });
  it("보고서 전체: 「N 대 M」 · 「N개 중 M개로」 바로 뒤 고른 정도 말이 기준에 맞는다", () => {
    for (const [i, seed] of ["k9x2m", "zz1", "q7", "p0p", "a1", "b2", "c3", "d4"].entries()) {
      const self = selfWith({ soc: 5, emo: 0, worry: 5, plan: 1, check: 4, dist: 1, trust: 4 });
      const sessions = crowd(self, 6 + i * 4, 18 + i * 2, k => (k % 3 === 0 ? 1 : k % 3 === 1 ? 2 : 3) as Closeness, 0.5 + (i % 4) * 0.08);
      const r = buildReport(input(self, sessions, { seedKey: seed }));
      for (const line of r.sections.flatMap(s => [...s.lead, ...s.body])) {
        for (const m of line.matchAll(/(\d+) 대 (\d+)(?:으로|로)? ([^,.]*)/g)) allowed(m[3].split(/ 「| \(/)[0], Number(m[1]), Number(m[2]));
        for (const m of line.matchAll(/(\d+)개 중 (\d+)개로 ([^,.]*)/g)) allowed(m[3], Number(m[2]), Number(m[1]) - Number(m[2]));
      }
    }
  });
});

describe("7차 검사 기준", () => {
  const seeds = ["k9x2m", "zz1", "q7", "p0p", "a1", "b2", "c3", "d4"];
  const mixed = () => seeds.flatMap((seed, i) => {
    const self = selfWith({ soc: 5, emo: 0, worry: 5, plan: 1, check: 4, dist: 1, trust: 4 });
    const sessions = crowd(self, 6 + i * 4, 18 + i * 2, k => (k % 3 === 0 ? 1 : k % 3 === 1 ? 2 : 3) as Closeness, 0.5 + (i % 4) * 0.08);
    return [1, 2].map(issueNo => buildReport(input(self, sessions, { seedKey: seed, issueNo })));
  });
  it("친구가 한 명이면 이야기 꼭지 제목은 「친구가 남긴 이야기」(다음 호 안내도 같은 이름)", () => {
    const self = selfWith();
    const story = { id: "s1", kind: "funny" as const, body: "이야기", closeness: 2 as Closeness, hearts: 0, createdAt: "2026-11-20T00:00:00Z" };
    const one = buildReport(input(self, [sess("only", MIRROR_ITEMS.map(i => ({ itemId: i.id, choice: 0 as Choice })))], { stories: [story] }));
    expect(one.sections.find(s => s.key === "stories")!.title).toBe(SECTION_TITLE.storiesOne);
    const oneNo = buildReport(input(self, [sess("only", MIRROR_ITEMS.map(i => ({ itemId: i.id, choice: 0 as Choice })))]));
    expect(oneNo.sections.find(s => s.key === "next")!.body.join(" ")).not.toMatch(/친구들이 남긴/);
    const many = buildReport(input(self, crowd(self, 6, 20), { stories: [story] }));
    expect(many.sections.find(s => s.key === "stories")!.title).toBe(SECTION_TITLE.stories);
  });
  it("판정 제목과 바로 아래 요약은 같은 낱말을 쓰지 않는다", () => {
    expect(sharedWords("큰 줄기가 벌써 보이는 기발한 해결사", "친구 3명이 답해 준 67개에 비춰 보면 큰 줄기는 꽤 들킨 편이에요.")).toContain("줄기");
    const reports = [...mixed()];
    for (const t of [0.9, 0.72, 0.6, 0.5, 0.3]) for (const seed of seeds) {
      const self = selfWith();
      const sessions = MIRROR_ITEMS.flatMap((item, i) => Array.from({ length: 4 }, (_, k) => sess(`${item.id}-${k}`, [{ itemId: item.id, choice: ((i * 4 + k) * 37 % 100) / 100 < t ? self[item.id] : (1 - self[item.id]) as Choice }], 2)));
      reports.push(buildReport(input(self, sessions, { seedKey: seed })));
    }
    for (const r of reports) {
      const first = r.verdict.summary.split(/(?<=[.])\s+/)[0];
      expect(sharedWords(r.verdict.title, first), `${r.verdict.title} / ${first}`).toEqual([]);
      expect(first).toMatch(BAND_WORD[bandLevel(r.verdict.sync)]);
      expect(withinReportFindings("t", r)).toEqual([]);
    }
  });
  it("나만 아는 나 조립: 「알아본 답」 · 「답은 … 알아본」 꼴 없음, 앞마디에 고른 정도 말이 있으면 뒤 마디에 「절반 · 반만 · 반쯤」 없음, 「만」은 절반 미만만", () => {
    const pairs: [number, number][] = [[4, 6], [6, 4], [5, 5], [7, 8], [8, 7], [6, 9], [19, 18], [25, 23], [3, 3], [5, 6]];
    for (const [m, rest] of pairs) for (const f of MIRROR_FACET_IDS) for (const side of ["A", "B"] as const) for (const front of HIDDEN_FRONT) {
      const n = m + rest, head = front({ name: "면", k5: 5, side: SIDE_NOUN[f][side], n, m });
      for (const tail of hiddenLines(f, side, m / n, head)) {
        const line = head + tail;
        expect(line, line).not.toMatch(/알아본 답|답[은이가] [^,]*알아본|본인만/);
        if (RATIO_WORDS.test(head)) expect(tail, line).not.toMatch(/절반|반만|반쯤/);
        if (/가까이만|개만|명만|절반만|반만/.test(tail)) expect(m * 2, line).toBeLessThan(n);
      }
    }
    for (const g of HIDDEN_PLAIN) expect(g("시험 결")).not.toMatch(/절반|반만|반쯤|반반|많지 않|일부만/);
  });
});
