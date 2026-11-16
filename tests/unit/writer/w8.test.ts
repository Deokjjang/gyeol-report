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
      for (const d of a.drops) expect(view.includes(table.exact.get(d.dropped) ?? d.dropped)).toBe(false);
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
