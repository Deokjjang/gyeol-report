// W8 합치기(외부 호출 0, 가상 인물 + 합성 문장만): 작가 입력 바꿔치기·짝 정리 · 십성 자리 사실 검사 · 검사 오탐 2 · 대운 괄호 되풀이 · 처방 이름 노출 · 같은 문장 둘 첫 문장 지킴.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge, type BriefInput, type BriefPersonInput } from "@/lib/brief";
import { buildFactSheet } from "@/lib/factsheet/build";
import { factCheck, factCtxOf } from "@/lib/factsheet/check";
import { pieceAudit, renderWriterBrief } from "@/lib/writer/prompt";
import { materialTable, materialKey } from "@/lib/writer/prompt/materials";
import { tidyPieces } from "@/lib/writer/prompt/pairTidy";
import { renderMarks } from "@/lib/writer/marks";
import { rxLabel } from "@/lib/writer/safety/p6c";
import { countMismatch } from "@/lib/writer/safety/p6d";
import { dropBookTwins } from "@/lib/writer/repairPlan";
import { gateClassOf } from "@/lib/writer/gate";
import { careerGroupNames } from "@/lib/writer/safety/p6e";
import { applyRepair3 } from "@/lib/writer/repair3";
import { postRepairTidy } from "@/lib/writer/repairPlan";
import { lintBook, type LintCtx } from "@/lib/writer/safety/p6c";
import { personNames } from "@/lib/writer/publish";
import type { Mark } from "@/lib/writer/marks";

const ROOT = join(__dirname, "../../..");
const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
const evalIn = JSON.parse(readFileSync(join(ROOT, "docs/eval/inputs.json"), "utf8"));
const baseDate = "2026-11-14";
const person = (key: string, ctx?: string, mbti?: string): BriefPersonInput => {
  const p = evalIn.persons[key]; const c = ctx ? evalIn.contexts[ctx] : undefined;
  return { ...p, ...(mbti ? { mbtiType: mbti } : {}), ...(c ? { context: { relationshipStatus: c.relationshipStatus, jobStatus: c.jobStatus, detailJob: c.detailJob } } : {}) };
};
const fullIn: BriefInput = { product: "saju_mbti_full", baseDate, person: person("minjun", "c3", "ESFJ") };
const compatIn = { product: "saju_mbti_compatibility", baseDate, person: person("doyun", "c2", "ISTJ"), partner: person("jiwoo", "c2", "ENFP"), relationshipType: "love" } as BriefInput;
const make = (input: BriefInput) => { const brief = buildBrief(input, k); const sheet = buildFactSheet(input, brief, k); return { brief, sheet }; };
const F = make(fullIn), C = make(compatIn);
const ch = (n: number, sections: string[][]) => ({ n, title: `${n}장`, source: "writer" as const, sections: sections.map((paragraphs, i) => ({ heading: `소제목 ${i + 1}`, paragraphs })) });
const strings = (o: unknown, out: string[] = []): string[] => { if (typeof o === "string") out.push(o); else if (Array.isArray(o)) o.forEach(x => strings(x, out)); else if (o && typeof o === "object") Object.values(o).forEach(x => strings(x, out)); return out; };

describe("W8 작가 입력 재료 정리(4종)", () => {
  const table = materialTable(k);
  it("꼬리표 rw(결정 2 관계 줄·건강 줄)는 바꾼 글을 보내고, 원래 빈 글 칸은 그대로 둔다", () => {
    const orig = [...table.origOf.values()].find(t => k.personaTags.get(materialKey(t))?.rw)!;
    expect(orig).toBeTruthy();
    const out = tidyPieces({ person: { facts: { job: { status: "", detail: "" } } }, x: orig }, table, F.brief, k).out as { person: { facts: { job: Record<string, string> } }; x: string };
    expect(out.x).toBe(k.personaTags.get(materialKey(orig))!.rw);
    expect(out.person.facts.job).toEqual({ status: "", detail: "" });
  });
  it("짝 정리: 뺀 줄은 작가 입력에 없고, 남은 줄에는 같은 사람·같은 차원·같은 조건 반대 끝(세기 2 이상) 짝이 없다(유일한 재료로 지킨 줄 제외)", () => {
    for (const X of [F, C]) {
      const a = pieceAudit(X.brief, { knowledge: k, facts: X.sheet })!;
      const view = strings(renderWriterBrief(X.brief, { knowledge: k, facts: X.sheet })).join("\n");
      // W8.1: 궁합은 같은 DB 줄이 주인(0·1·−1)마다 따로 나오고 정리도 주인별이다 → 한 주인에만 나오는 줄만 글로 확인한다.
      const owners = new Map<string, Set<number>>(); for (const p of a.pieces) owners.set(p.key, (owners.get(p.key) ?? new Set()).add(p.owner));
      for (const d of a.drops) if ((owners.get(materialKey(d.dropped))?.size ?? 1) === 1) expect(view.includes(table.exact.get(d.dropped) ?? d.dropped)).toBe(false);
      const gone = new Set(a.drops.map(d => `${d.owner}|${materialKey(d.dropped)}`));
      const poles = new Map<string, Set<number>>();
      for (const p of a.pieces) {
        if (p.owner < 0 || p.sole || gone.has(`${p.owner}|${p.key}`)) continue;
        const t = k.personaTags.get(p.key); if (!t || (t.k !== "trait" && t.k !== "situ")) continue;
        for (const [dim, pole, s] of t.d) if (s >= 2) { const key = `${p.owner}|${dim}|${t.c?.who ?? ""}|${t.c?.sit ?? ""}`; poles.set(key, (poles.get(key) ?? new Set()).add(pole)); }
      }
      expect([...poles.values()].filter(v => v.size > 1)).toHaveLength(0);
    }
  });
  it("세운·대운(4종 아님)은 재료 정리를 하지 않는다", () => {
    const annual = buildBrief({ product: "annual_fortune", baseDate, person: person("minjun", "c3", "ESFJ") } as BriefInput, k);
    expect(pieceAudit(annual, { knowledge: k })).toBeNull();
  });
});

describe("W8 검사(W7 9-2)", () => {
  const ctx = factCtxOf(F.sheet, k, [[F.brief.person.callName]]);
  const tg = F.sheet.people[0].tenGods;
  it("십성 자리: 주어 십성이 말한 자리(땅 글자는 지장간 전부)에 없으면 fact_term, 있으면 통과", () => {
    const at = tg.monthBranch ?? [];
    const absent = ["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"].find(x => !at.includes(x) && Object.values(tg).some(v => v?.includes(x)))!;
    expect(factCheck(`${absent}은 태어난 달 땅 글자에 자리해 있어요.`, ctx)?.rule).toBe("fact_term");
    expect(factCheck(`${at[0]}은 태어난 달 땅 글자에 자리해 있어요.`, ctx)).toBeNull();
    expect(factCheck(`${absent}이 태어난 달 땅 글자에 있다면 결이 달라져요.`, ctx)).toBeNull();
  });
  it("오탐 ①: 「모두 양인 속도」의 양인(양 + 이다)은 양인살이 아니다", () => {
    const hit = factCheck("음 하나 없이 모두 양인 속도에서 보이듯, 기준이 단단한 사람이에요.", ctx);
    expect(hit?.detail ?? "").not.toContain("양인살");
  });
  it("오탐 ②: 이어진 두 문장이 「… 하나」를 하나씩 들면 「이 두 가지」는 맞는 개수", () => {
    expect(countMismatch("일에서는 미뤄 둔 일 하나를 정해 끝까지 닫아 보세요. 돈에서는 자동 이체 하나를 설정해 두는 겁니다. 작게 시작해도 이 두 가지가 쌓이면 달라져요.")).toEqual([]);
    expect(countMismatch("일에서는 미뤄 둔 일 하나를 정해 끝까지 닫아 보세요. 작게 시작해도 이 세 가지가 쌓이면 달라져요.")).toEqual(["이 세 가지"]);
  });
  it("대운 구절 괄호의 십성을 바로 뒤에서 또 말하면 괄호를 뗀다", () => {
    const tb = new Map([["un:now", { key: "un:now", kind: "un" as const, text: "정유 대운(정인의 10년)", short: "이 대운" }]]);
    const r = renderMarks("지금 ⟦un:now⟧은 정인이라 배우기 좋은 때예요.", tb);
    expect(r).not.toContain("(정인의 10년)");
    expect(r).toContain("정유 대운은 정인이라");
    expect(renderMarks("지금 ⟦un:now⟧이 이어져요.", tb)).toContain("(정인의 10년)");
  });
  it("처방 갈래 이름 노출은 개선 갈래(rx_label)", () => {
    for (const s of ["연락과 안부를 처방으로 삼아 보세요.", "쉬기와 잠을 처방으로 삼아 보세요.", "「적기·목록」으로 정리해 보세요."]) expect(rxLabel(s)).toBe(true);
    for (const s of ["끝까지 듣기가 어려운 날도 있어요.", "혼자 시간을 꼭 챙기세요."]) expect(rxLabel(s)).toBe(false);
    expect(gateClassOf("rx_label")).toBe("improve");
  });
  it("수리 뒤 같은 문장 둘: 문단 첫 문장은 떼지 않는다", () => {
    const s = "식신은 좋아하는 일을 꾸준히 해 결과로 만드는 힘이에요.";
    const book = [ch(1, [["일이 쌓일 때가 있어요. " + s + " 그래서 오래 가요."]]), ch(2, [[s + " 아이를 돌보는 일에도 이 힘이 쓰여요."]])];
    const r = dropBookTwins(book);
    expect(r.chapters[1].sections[0].paragraphs[0].startsWith(s)).toBe(true);
  });
});

describe("W8 측정 중 고침(m2 — 3단계 직접 읽기에서 확인한 실질 결함의 꼴)", () => {
  it("① 관계 표시 앞 같은 문장에 그 관계의 글자 목록(순서 무관)이 있으면 관계 이름 꼴만", () => {
    const m: Mark = { key: "in:1", kind: "in", text: "태어난 해·날·시각 땅 글자 술·인·오가 모인 삼합(세 글자가 한 기운으로 모임)", short: "이 관계", glyph: "술·인·오가 모인 삼합(세 글자가 한 기운으로 모임)" } as Mark;
    const t = new Map([["in:1", m]]);
    const r = renderMarks("술·인·오가 모여 불의 기운으로 쏠리는 구성인데, 이 모임은 ⟦in:1⟧으로 힘을 한쪽에 모아요.", t);
    expect(r).toContain("이 모임은 삼합(세 글자가 한 기운으로 모임)으로");
    expect(r.match(/술·인·오/g)?.length).toBe(1);
    expect(renderMarks("인·오·술이 모여 불로 쏠려요. 그래서 ⟦in:1⟧이 힘을 모아요.", t)).toContain("술·인·오가 모인 삼합");
  });
  it("② 커리어 다섯 힘 쉬운 이름 뒤 「의 힘」 겹침을 뗀다", () => {
    expect(careerGroupNames("식상의 힘이 남은 상태에서 다듬어 보세요.", new Set()).text).toBe("만드는 힘(식상)이 남은 상태에서 다듬어 보세요.");
    expect(careerGroupNames("만드는 힘의 힘이 남은 상태예요.", new Set(["식상"])).text).not.toContain("힘의 힘");
  });
  it("③ 이름으로 여는 문장 (삭제)는 다음 문장이 주어를 잃으면 받지 않는다", () => {
    const p = "가람님의 태어난 날 기둥은 기토예요. 남의 사정을 먼저 살피는 손이 있어요. 다음 문장이에요.";
    const items = [{ id: 1, kind: "sentence" as const, chapter: 1, section: 0, paragraph: 0, original: "가람님의 태어난 날 기둥은 기토예요.", problems: ["x"], source: ["lint" as const] }];
    const r = applyRepair3([ch(1, [[p]])], items, new Map([[1, "(삭제)"]]));
    expect(r.applied).toEqual([]); expect(r.chapters[0].sections[0].paragraphs[0]).toBe(p);
    const q = "가람님의 태어난 날 기둥은 기토예요. 가람님은 남의 사정을 먼저 살펴요.";
    expect(applyRepair3([ch(1, [[q]])], items, new Map([[1, "(삭제)"]])).applied.length).toBe(1);
  });
  it("④ 수리 답이 이웃 문장과 같은 머리(괄호 풀이·공백 무시 14자+)로 시작하면 원문으로", () => {
    const before = "확장형 기질은 고객 인터뷰에서도 드러나요.", after = "다만 편재가 이끄는 확장은 사람도 일도 한꺼번에 늘기 쉬우니, 새로 맡기 전에 역할부터 글로 정해 두세요.";
    const p = `한 명의 이야기에서 가능성을 읽어요. 다만 편재(偏財)가 이끄는 확장은 사람도 일도 한꺼번에 늘어 관리가 느슨해지기 쉬워요. ${after}`;
    const applied = [{ id: 1, kind: "sentence" as const, at: "1.0.0", before, after, source: ["lint"] }];
    const r = postRepairTidy([ch(1, [[p]])], applied as never);
    expect(r.chapters[0].sections[0].paragraphs[0]).toContain(before);
    expect(r.chapters[0].sections[0].paragraphs[0]).not.toContain(after);
  });
  it("⑤ 「하나도 없다」인데 원국(지장간 포함)에 있으면 fact_none · 겉 글자만 말하면 통과", () => {
    const ctx = factCtxOf(F.sheet, k, [[F.brief.person.callName]]);
    const tg = Object.values(F.sheet.people[0].tenGods).flat();
    const present = ["편재", "정재", "편관", "정관", "편인", "정인"].find(x => tg.includes(x))!, absent = ["식신", "상관"].find(x => !tg.includes(x));
    expect(factCheck(`${present}은 사주 안에 하나도 자리 잡지 못했어요.`, ctx)?.rule).toBe("fact_none");
    expect(factCheck(`${present}은 겉으로는 하나도 드러나지 않아요.`, ctx)).toBeNull();
    if (absent) expect(factCheck(`${absent}은 사주 안에 하나도 없어요.`, ctx)).toBeNull();
    expect(gateClassOf("fact_none")).toBe("block");
  });
  it("⑤ 공통 신살을 한 사람 절에 넣고 「두 사람 모두」는 다른 절이면 common_split", () => {
    const cctx = factCtxOf(C.sheet, k, personNames(C.brief));
    const common = C.sheet.pair!.common.shinsal, a = C.sheet.people[0] as unknown as { shinsal: { name: string }[] }, b = C.sheet.people[1] as unknown as { shinsal: { name: string }[] };
    const aOnly = a.shinsal.map(x => x.name).find(x => !common.includes(x) && !b.shinsal.some(y => y.name === x))!, c0 = common.find(x => !/화개/.test(x))!, c1 = common.find(x => x !== c0 && !/화개/.test(x))!;
    const call = C.brief.compatibility!.a.callName;
    expect(factCheck(`${aOnly}과 ${c0}은 ${call}에게 있고, ${c1}은 두 사람 모두에게 있어요.`, cctx)?.rule).toBe("common_split");
    expect(factCheck(`${aOnly}은 ${call}에게 있고, ${c1}은 두 사람 모두에게 있어요.`, cctx)).toBeNull();
  });
  it("⑤ 연애 중·기혼 입력에서 새 만남을 전제한 조언은 presumed_single(차단 · 떼기)", () => {
    const ctx = (relationship: string) => ({ facts: { birthTimeKnown: true, mbti: "ENTJ", relationship, children: "unknown", job: "employee" }, jobDetail: "", schoolStage: "none", coreImage: "x", nicknames: [], corpus: new Set(), prior: [], jobProps: [], noJobChapters: new Set(), parentingChapters: new Set(), monthChapters: new Set(), compat: false, mbtiPlain: {} } as unknown as LintCtx);
    const book = [{ ...ch(1, [["사랑을 시작한다면 처음 석 달은 천천히 만나 보세요. 대화가 길어지면 좋아요."]]), id: "c1", chars: 0 }];
    expect(lintBook(book as never, ctx("dating")).map(f => f.rule)).toContain("presumed_single");
    expect(lintBook(book as never, ctx("single")).map(f => f.rule)).not.toContain("presumed_single");
    expect(gateClassOf("presumed_single")).toBe("block");
  });
});

describe("W8 측정 중 고침(m3 — m2 다시 발행 읽기에서 확인한 수리 답 결함의 꼴)", () => {
  it("대운이 넘어가는 때를 해의 앞·가운데·뒤로 말하면 교운 달과 맞댄다(문단의 「N년」을 「이 해」로)", () => {
    const ctx = factCtxOf(F.sheet, k, [[F.brief.person.callName]]);
    const c = F.sheet.people[0].dayun.cycles.find(x => x.startSolarKst && x.startYear > 2026)!;
    const y = c.startSolarKst!.slice(0, 4), mo = Number(c.startSolarKst!.slice(5, 7));
    const wrong = mo <= 6 ? "후반에" : "초반에", right = mo >= 4 && mo <= 8 ? "중반에" : mo <= 6 ? "상반기에" : "하반기에";
    const para = (w: string) => `${y}년은 정리의 해예요. 이 해의 ${w} 대운도 다음 흐름으로 넘어가요.`;
    expect(factCheck(`이 해의 ${wrong} 대운도 다음 흐름으로 넘어가요.`, ctx, para(wrong))?.rule).toBe("fact_dayun");
    expect(factCheck(`이 해의 ${right} 대운도 다음 흐름으로 넘어가요.`, ctx, para(right))).toBeNull();
    expect(factCheck(`이 해의 ${wrong} 일이 많아져요.`, ctx, para(wrong))).toBeNull();
  });
});
