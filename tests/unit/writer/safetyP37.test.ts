import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge, type BriefInput } from "@/lib/brief";
import { balanceHolds } from "@/lib/brief/balance";
import { MAX_GROUP_CHAPTERS } from "@/lib/brief/chapters";
import { meaningGroup } from "@/lib/brief/groups";
import type { Brief } from "@/lib/brief/schema";
import { LOVE_TIMING } from "@/lib/writer/safety/patterns";
import { sentenceViolation, styleWarnings } from "@/lib/writer/safety/sentences";
import { PEOPLE } from "../../../tools/p35/people";
import { P36_PEOPLE as P36 } from "../../../tools/p36/people";

const k = loadKnowledge();
const base = "2026-10-29";
const facts = { birthTimeKnown: true, mbti: "ENTJ", relationship: "single", children: "none", job: "employed" } as const;
const PRODUCTS = ["saju_mbti_full", "career_money_study", "love_marriage_child", "major_fortune", "annual_fortune"] as const;
const briefs: [string, Brief][] = [
  ...PRODUCTS.flatMap(product => Object.entries(PEOPLE).map(([n, person]) => [`${product}:${n}`, buildBrief({ product, person, baseDate: base } as BriefInput, k)] as [string, Brief])),
  ["pair-parent", buildBrief({ product: "saju_mbti_compatibility", baseDate: base, person: P36.parent, partner: P36.child, relationshipType: "parentChild" }, k)],
  ["pair-boss", buildBrief({ product: "saju_mbti_compatibility", baseDate: base, person: P36.boss, partner: PEOPLE.c1, relationshipType: "managerReport" }, k)],
];

describe("P3.7 원고 보강", () => {
  it("1-1: 연·월 항목의 trait는 그해·그달 글자가 건드리는 것만, 없으면 넣지 않는다(배지에 원국 자리)", () => {
    for (const [name, b] of briefs.filter(([n]) => /major|annual/.test(n))) {
      for (const c of b.chapters.filter(c => c.id.includes(":"))) {
        const key = c.id.split(":")[1], e = b.timeline!.entries.find(x => x.key === key)!;
        const traits = c.materials.flatMap(m => m.kind === "trait" ? [m.traitId] : []);
        expect(traits.length, `${name} ${key}`).toBeLessThanOrEqual(1);
        expect((e.touched ?? []).map(t => t.traitId).sort(), `${name} ${key}`).toEqual([...traits].sort());
      }
      const relBadges = b.timeline!.entries.flatMap(e => e.badges.filter(x => x.kind !== "GONGMANG"));
      expect(relBadges.length && relBadges.every(x => /태어난 (해|달|날|시각)/.test(x.with ?? "")), name).toBeTruthy();
    }
    const x = briefs.find(([n]) => n === "major_fortune:x")![1];
    const y2027 = x.timeline!.entries.find(e => e.key === "2027")!;
    expect(y2027.badges.find(b => b.label === "축미충")?.with).toBe("태어난 달·태어난 날");
  });

  it("1-2: 강약·균형 단정은 엔진 판단과 맞는 문장만, 일간 강약과 오행 쏠림은 note로 구분", () => {
    const weak = { strength: "WEAK", excess: ["WATER"], lacking: ["METAL"] } as const;
    expect(balanceHolds("신약한 구성에서 쉬는 날이 사라지면 체력이 먼저 바닥납니다.", weak)).toBe(true);
    expect(balanceHolds("신강한데 괴강까지 겹치면 세게 나갑니다.", weak)).toBe(false);
    expect(balanceHolds("물이 많아 땅이 식으면 온기가 흩어집니다.", weak)).toBe(true);
    expect(balanceHolds("불이 많아 마음이 뜨겁습니다.", weak)).toBe(false);
    expect(balanceHolds("쇠 기운이 부족하면 맺고 끊기가 어렵습니다.", weak)).toBe(true);
    expect(balanceHolds("기운이 어느 쪽으로도 기울지 않았습니다.", weak)).toBe(false);
    expect(balanceHolds("목 중화", weak)).toBe(true);
    expect(balanceHolds("수 중화", weak)).toBe(false);
    for (const [name, b] of briefs.filter(([n]) => !n.startsWith("pair"))) {
      const level = b.chart.strength.level, ctx = { strength: /WEAK/.test(level) ? "WEAK" : /STRONG/.test(level) ? "STRONG" : "BALANCED", excess: b.chart.elements.strongest.level === "많음" ? [b.chart.elements.strongest.element] : [], lacking: [] } as const;
      for (const t of b.traits) for (const text of [t.positionNote, t.strengthNote, ...t.good]) if (text && /신강|신약/.test(text)) expect(balanceHolds(text, ctx), `${name} ${t.featureId}: ${text}`).toBe(true);
      if (b.chart.elements.strongest.level === "많음") expect(b.chart.strength.note, name).toMatch(/다른 저울/);
    }
  });

  it("1-3: 같은 의미 그룹은 책 전체 2장, 한 장에 둘 없음, 이미지 계열은 대표 하나", () => {
    for (const [name, b] of briefs) {
      const group = (id: string) => { const t = b.traits.find(x => x.id === id)!; return `${t.id[0] === "a" || t.id[0] === "b" ? t.id[0] : ""}${meaningGroup(t.featureId)}`; };
      const byGroup = new Map<string, Set<string>>();
      for (const c of b.chapters) {
        const ids = c.materials.flatMap(m => m.kind === "trait" ? [m.traitId] : m.kind === "ref" && /^shadows\./.test(m.ref) ? [b.shadows.find(s => `shadows.${s.id}` === m.ref)!.traitId] : m.kind === "ref" && /^traits\..+\.fusion$/.test(m.ref) ? [m.ref.split(".")[1]] : []);
        const inChapter = c.materials.flatMap(m => m.kind === "trait" ? [group(m.traitId)] : []);
        expect(new Set(inChapter).size, `${name} ${c.id}`).toBe(inChapter.length);
        for (const id of ids) { const g = group(id); byGroup.set(g, (byGroup.get(g) ?? new Set()).add(c.id)); }
      }
      for (const [g, chs] of byGroup) expect(chs.size, `${name} ${g}`).toBeLessThanOrEqual(MAX_GROUP_CHAPTERS);
      for (const t of b.traits.filter(t => t.sameImageAs)) expect(b.traits.find(x => x.id === t.sameImageAs)?.chapters.length, name).toBeGreaterThan(0);
    }
    const career = briefs.find(([n]) => n === "career_money_study:c1")![1];
    const climate = career.traits.find(t => t.family === "climate"), core = career.traits.find(t => t.family === "dayPillar" || t.family === "dayMaster")!;
    if (climate?.chapters.length) { expect(climate.sameImageAs).toBe(core.id); expect(career.chart.dayMaster.metaphor).toBe(core.image.metaphor); }
  });

  it("1-4: 커리어 직무 8~12개(근거 한 줄)·지금 직업 적합도·키울 역할·투자 원칙, 연애 호감·연락·밀당 재료", () => {
    const career = briefs.find(([n]) => n === "career_money_study:c1")![1];
    const ev = (b: Brief, key: string) => b.chapters.flatMap(c => c.materials).find(m => m.kind === "evidence" && m.key === key) as { facts: string[] } | undefined;
    const picks = ev(career, "jobPicks")!.facts.slice(1);
    expect(picks.length).toBeGreaterThanOrEqual(8); expect(picks.length).toBeLessThanOrEqual(12);
    for (const p of picks) expect(p).toMatch(/^[^—]{2,20} — [^:]+: .{6,}/);
    expect(new Set(picks.map(p => p.split(" — ")[0])).size).toBe(picks.length);
    const current = ev(career, "currentJob")!.facts.join(" ");
    expect(current).toMatch(/지금 직업 적합도: (잘 맞는 편|절반쯤 맞는 편|다른 힘으로 하는 일)/); expect(current).toMatch(/이 일 안에서 키울 역할: /);
    const inv = ev(career, "investment")!.facts.join(" ");
    expect(inv).toMatch(/돈 굴리는 성향: /); expect(inv).toMatch(/운영 원칙: .*적립/); expect(inv).not.toMatch(/\d+ ?(%|원|주)|종목명|코인|주식 [가-힣]+ 사/);
    expect(career.chapters.find(c => c.id === "fit")!.materials.some(m => m.kind === "evidence" && m.key === "jobPicks")).toBe(true);
    expect(career.chapters.find(c => c.id === "timing-risk")!.materials.some(m => m.kind === "evidence" && m.key === "investment")).toBe(true);
    for (const n of ["c1", "y", "c2"]) {
      const love = briefs.find(([x]) => x === `love_marriage_child:${n}`)![1];
      const sig = ev(love, "loveSignals")!.facts.join(" "), pp = ev(love, "pushPull")!.facts.join(" ");
      expect(sig).toMatch(/호감 표현: .* 쪽은/); expect(sig).toMatch(/연락 패턴: /); expect(pp).toMatch(/밀당: /);
      expect(love.chapters.find(c => c.id === "expression")!.title).toBe("표현하는 방식과 밀당");
    }
  });

  it("1-5: 인연 시기 말 금지·첫 그림 정체 경고·궁합 두 사람 자리 문장", () => {
    for (const t of ["인연이 일찍 열리는 편입니다.", "늦게 만나는 인연이 깊습니다.", "서른쯤 결혼하기 좋습니다.", "20대 후반에 좋은 인연이 옵니다."]) {
      expect(LOVE_TIMING.test(t), t).toBe(true); expect(sentenceViolation(t, facts)).toBe("love_timing");
    }
    for (const t of ["배우자가 늦게 들어오는 날 불을 켜 둡니다.", "밤늦게 같은 영화를 봅니다.", "늦게까지 일하는 편입니다."]) expect(LOVE_TIMING.test(t), t).toBe(false);
    for (const [name, b] of briefs) expect(JSON.stringify(b), name).not.toMatch(/늦게·스스로|인연이 일찍/);
    expect(styleWarnings(1, ["당신에게는 풍경 같은 기운이 있습니다."], [], new Set()).some(w => w.kind === "image_unnamed")).toBe(true);
    expect(styleWarnings(1, ["당신에게는 촛불 같은 섬세한 불(정화)이 있습니다."], [], new Set()).some(w => w.kind === "image_unnamed")).toBe(false);
    for (const [name, b] of briefs.filter(([n]) => n.startsWith("pair"))) {
      const c = b.compatibility!;
      expect(c.dayRelations.length, name).toBeGreaterThan(0);
      for (const r of c.dayRelations) expect(r, name).toMatch(new RegExp(`^${c.a.callName}의 태어난 (해|달|날|시각) (하늘|땅) 글자 .+ ${c.b.callName}의 태어난 (해|달|날|시각) (하늘|땅) 글자 .+: `));
    }
  });
});
