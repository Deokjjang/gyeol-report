// W4 Q2 1단계 공사(외부 호출 0, 합성 문장만): 원재료 복구·정제, 소품 힌트, 예시 분리, 금지 규칙(틀 말·물음 상한·예시 세 어절·남의 성격 문장·기혼 호칭),
// 지식 DB 수정 뒤 연결 계산(합충 제외·자기모순·열등 기능·같은 틀), 사실 대조 보강(두 사람 공통·배우자/자녀 별 성별·해마다 십성·자리 나열·쓰기 전 대조),
// 공통 결함(한자 동음 낱말·만나기 좋은 곳 기운별).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildBrief, loadKnowledge, type Brief, type BriefInput, type BriefPersonInput } from "@/lib/brief";
import { buildFactSheet } from "@/lib/factsheet/build";
import { factCheck, factCtxOf } from "@/lib/factsheet/check";
import { buildWriterPrompt, renderWriterBrief, easySlot } from "@/lib/writer/prompt";
import { AM_STYLE_EXAMPLES, STYLE_EXAMPLES } from "@/lib/writer/prompt/examples";
import { WRITER_PROMPT_VERSION, WRITER_SYSTEM } from "@/lib/writer/prompt/system";
import { chunkExamples } from "@/lib/writer/chunked/prompt";
import { exposureHits } from "@/lib/writer/safety/exposure";
import { dropNoticeSentences, HARD_RULES, lintBook, readerQuestion, QUESTION_TAIL_MAX, type LintCtx } from "@/lib/writer/safety/p6c";
import { exampleTrigram, normWords } from "@/lib/writer/safety/sentences";
import { presumedPartner } from "@/lib/writer/safety/lint";
import { personaDims, personaHit, type PersonaCtx } from "@/lib/writer/safety/persona";
import { annotateChapter, termDictionary } from "@/lib/writer/render";
import { personNames } from "@/lib/writer/publish";
import { splitSentences } from "@/lib/writer/safety";

const ROOT = join(__dirname, "../../..");
const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));
const evalIn = JSON.parse(readFileSync(join(ROOT, "docs/eval/inputs.json"), "utf8"));
const baseDate = "2026-11-14";
const person = (key: string, ctx?: string, mbti?: string): BriefPersonInput => {
  const p = evalIn.persons[key]; const c = ctx ? evalIn.contexts[ctx] : undefined;
  return { ...p, ...(mbti ? { mbtiType: mbti } : {}), ...(c ? { context: { relationshipStatus: c.relationshipStatus, jobStatus: c.jobStatus, detailJob: c.detailJob } } : {}) };
};
const inputs: { label: string; input: BriefInput }[] = [
  { label: "종합 기혼", input: { product: "saju_mbti_full", baseDate, person: person("minjun", "c3", "ESFJ") } },
  { label: "연애", input: { product: "love_marriage_child", baseDate, person: person("seoyun", "c2", "INTJ") } },
  { label: "커리어", input: { product: "career_money_study", baseDate, person: person("haram", "c1", "ENTJ") } },
  { label: "궁합", input: { product: "saju_mbti_compatibility", baseDate, person: person("doyun", "c2", "ISTJ"), partner: person("jiwoo", "c2", "ENFP"), relationshipType: "love" } as BriefInput },
];
const books = inputs.map(x => ({ ...x, brief: buildBrief(x.input, k) }));
type WriterJson = { traits: Record<string, unknown>[]; chapters: { sceneHint?: string[]; sections?: { materials?: { kind: string; scene?: string }[]; act?: string; card?: unknown }[] }[]; shadows?: unknown[]; bookRules: string[] };
const writer = (b: Brief) => renderWriterBrief(b, { knowledge: k }) as unknown as WriterJson;
const ch = (n: number, sections: string[][]) => ({ n, id: `c${n}`, title: `장 ${n}`, source: "writer" as const, chars: 0, sections: sections.map((ps, i) => ({ heading: `소제목 ${i}`, paragraphs: ps })) });
const baseCtx = (extra: Partial<LintCtx> = {}): LintCtx => ({
  facts: { birthTimeKnown: true, mbti: "ESFJ", relationship: "single", children: "unknown", job: "employee" }, jobDetail: "", schoolStage: "none", coreImage: "x",
  nicknames: [], corpus: new Set(), prior: [], jobProps: [], noJobChapters: new Set(), parentingChapters: new Set(), monthChapters: new Set(), compat: false, mbtiPlain: {}, ...extra,
} as LintCtx);

describe("Q2-1·2 원재료 복구·정제 · 소품 힌트(4종)", () => {
  it("절 = {q, materials, act?}(카드 없음) · 특성 지식 DB 장면 없음 · 장 소품 힌트 남음 · shadows 감 · 판정어·묶음 등급·내부 코드·trait 세기 등급 없음", () => {
    for (const { label, brief } of books) {
      const w = writer(brief), text = JSON.stringify(w);
      const secs = w.chapters.flatMap(c => c.sections ?? []);
      expect(secs.length, label).toBeGreaterThan(20);
      for (const s of secs) { expect(s.card, label).toBeUndefined(); expect(Array.isArray(s.materials), label).toBe(true); for (const m of s.materials ?? []) if (m.kind === "trait") expect(m.scene, label).toBeUndefined(); }
      expect(secs.filter(s => s.act).length, label).toBe(w.chapters.length);
      expect(text, label).not.toMatch(/신강|신약|중화|과다/);
      expect(text, label).not.toMatch(/(비겁|식상|재성|관성|인성)(\([^)]*\))?\)? (강함|강|보통|약함|약)(?![가-힣])/);
      expect(text, label).not.toMatch(/WONJIN|CHUNG|HYEONG|YUKHAP|SAMHAP/);
      expect(w.shadows, label).toBeDefined();
      for (const t of w.traits) { expect(t, label).not.toHaveProperty("strength"); expect(["뚜렷하게 드러남", "드러남", "옅게 있음"], label).toContain(t.show); }
      if (brief.product !== "saju_mbti_compatibility") expect(w.chapters.filter(c => c.sceneHint?.length).length, label).toBeGreaterThan(3);
    }
  });
  it("특성 자리 = 정답지로 맞춘 카드 자리의 쉬운 이름(at). 합충형해는 짝 자리 문장(where)", () => {
    expect(easySlot("월지")).toBe("태어난 달 땅 글자(월지)"); expect(easySlot("연간")).toBe("태어난 해 하늘 글자(연간)"); expect(easySlot("일주")).toBe("태어난 날 기둥(일주)"); expect(easySlot("원국 전체")).toBe("");
    for (const { label, brief } of books) {
      const w = writer(brief);
      expect(w.traits.filter(t => typeof t.at === "string").length, label).toBeGreaterThan(1);
      for (const t of w.traits) if (t.at) expect(t.at as string, label).toMatch(/^태어난 (해|달|날|시각) (하늘 글자|땅 글자|기둥)\([연월일시][간지주]\)/);
    }
  });
  it("기혼이면 책 규칙에 「배우자」 호칭 줄, 그 밖에는 없다", () => {
    expect(writer(books[0].brief).bookRules.some(r => /기혼이다/.test(r))).toBe(true);
    expect(writer(books[1].brief).bookRules.some(r => /기혼이다/.test(r))).toBe(false);
  });
  it("작가 요청: 지침 v5-27(자리·두 근거 엮기·물음 한 번·구조 말 금지) · 4종 예시는 새 가상 인물, 세운·대운 예시는 운영 그대로", () => {
    const w = buildWriterPrompt(books[0].brief, { knowledge: k });
    expect(WRITER_PROMPT_VERSION).toBe("writer-prompt-v5-27");
    for (const x of ["traits[].at", "근거 둘을 한 원인으로", "장마다 한 번까지", "구조 말", "다음 대운"]) expect(WRITER_SYSTEM).toContain(x);
    expect(w.system).toContain("예시 1 — 가상 인물(정시·ESFJ·간호사·기혼)");
    expect(w.system).not.toContain("정시·ESTP·영업직");
    expect(AM_STYLE_EXAMPLES.map(e => e.label)).toEqual(["예시 1 — 가상 인물(정시·ESTP·영업직·솔로)의 표지 한 줄과 종합 2장", "예시 2 — 가상 인물(정시·INTJ·연애 중)의 연애 3장"]);
    expect(chunkExamples().map(e => e.label).join(" ")).not.toContain("ESFJ");
    // 4종 예시 자신이 새 규칙을 지킨다: 틀 말·판정어 0, 장마다 물음 하나 이하.
    for (const e of STYLE_EXAMPLES.slice(0, 2)) {
      for (const s of splitSentences(e.text.replace(/^#.*$/gm, ""))) expect(exposureHits(s), s).toEqual([]);
      for (const c of e.text.split(/^## /m).slice(1)) expect(splitSentences(c).filter(s => readerQuestion(s)).length).toBeLessThanOrEqual(1);
    }
  });
});

describe("Q2-4 금지 규칙(결정론)", () => {
  it("틀 말은 rule 노출(HARD): 「이번 장에서는 … 읽어요」「이 절에서 … 살펴볼게요」「이 장에서 건넬」「여기까지 읽으셨다면」. 「이 장면」「이 장에서 본 것처럼」은 아님", () => {
    const ids = (s: string) => exposureHits(s).map(h => h.id);
    expect(ids("가람님의 상관은 이번 장에서 날카로운 말의 힘으로 읽어요.")).toContain("frame_talk");
    expect(ids("이 절에서 돈 쓰는 습관을 살펴볼게요.")).toContain("frame_talk");
    expect(ids("그래서 이 장에서 건넬 한 가지는 하루를 두는 거예요.")).toContain("frame_talk2");
    expect(ids("여기까지 읽으셨다면 두 사람의 마찰이 보이실 거예요.")).toContain("frame_talk2");
    expect(ids("이 장면에서 당신은 먼저 웃어요.")).toEqual([]);
    expect(ids("이 장에서 본 것처럼 당신은 빨라요.")).toEqual([]);
  });
  it("물음 상한: 장마다 첫 물음만, 같은 꼬리는 책 6번까지, 「떠올려 보세요」는 3번까지. 인용 대사 속 물음은 세지 않는다. 수리 뒤 남으면 그 문장만 뗀다", () => {
    expect(readerQuestion("혼자 정리하는 시간이 꼭 필요한 편이죠?")).toBe("죠");
    expect(readerQuestion("거절은 \"다음 주 목요일 어때?\"처럼 다른 날을 붙이세요.")).toBeNull();
    const book = [ch(1, [["첫 물음이 있는 편이죠? 그다음 문장이에요. 또 묻는 편이죠? 마무리 문장이에요."]]), ...Array.from({ length: 8 }, (_, i) => ch(i + 2, [[`장 ${i + 2}의 문장이에요. 이 꼬리도 그런 편이죠? 다른 문장이에요.`]]))];
    const f = lintBook(book, baseCtx({ questionCap: true })).filter(x => x.rule === "question_excess");
    // 1장 물음 2개(둘째는 장 상한) + 2~9장 하나씩 → 같은 꼬리 누적 3~10번째 가운데 7번째부터.
    expect(f.map(x => x.detail)).toEqual(["이 장 물음 2번째", ...[1, 2, 3, 4].map(i => `꼬리 「죠?」 책 ${QUESTION_TAIL_MAX + i}번째`)]);
    expect(HARD_RULES.has("question_excess")).toBe(false);
    expect(lintBook(book, baseCtx()).some(x => x.rule === "question_excess")).toBe(false); // 세운·대운·옛 책은 걸지 않는다
    const imag = [ch(1, [Array.from({ length: 5 }, (_, i) => `그 장면 ${i}을 떠올려 보세요. 그다음 문장이에요. 또 다른 문장이에요.`)])];
    expect(lintBook(imag, baseCtx({ questionCap: true })).filter(x => x.rule === "question_excess").length).toBe(2);
    const dropped = dropNoticeSentences(book, f);
    expect(JSON.stringify(dropped.chapters)).not.toContain("또 묻는 편이죠?");
    expect(JSON.stringify(dropped.chapters)).toContain("첫 물음이 있는 편이죠?");
  });
  it("예시 세 어절 복사(HARD): 내용 낱말 둘 이상인 세 어절만, 브리프에도 있는 구절(공백·문장부호 뺀 꼴)은 복사 아님", () => {
    expect(exampleTrigram("당신은 혼자 우뚝 서기보다 같이 가는 쪽이에요.")).toBe("혼자 우뚝 서기보다");
    expect(exampleTrigram("태어난 해 땅 글자에 편인이 있어요.")).toBeNull(); // 자리 말(글자·자리·기둥)은 내용 낱말로 치지 않는다
    expect(exampleTrigram("그런 말이 있을 수 있어요.")).toBeNull(); // 이음말뿐
    const brief = normWords("{\"forYou\":\"혼자 우뚝 서기보다 함께\"}");
    expect(exampleTrigram("당신은 혼자 우뚝 서기보다 같이 가요.", key => brief.includes(key))).toBeNull();
    expect(exampleTrigram("감정이 큰 자리에서는 주변 마음 살피기(Fe)가 약해요.", key => normWords("주변 마음 살피기(Fe)").includes(key))).toBeNull(); // 괄호 약어·조사만 다름
    expect(HARD_RULES.has("example_words")).toBe(true);
  });
  it("남의 성격 문장: 차원 설명의 방향이 주인(MBTI·특성) 값과 반대면 HARD, 같거나 모르면 그대로 복사만 SOFT", () => {
    const dims = personaDims(k);
    const se = k.ontology.dimensions.find(d => d.id === "socialEnergy")!;
    const ctx: PersonaCtx = { dims, owners: [{ label: "ESFJ", re: /ESFJ/, tags: { socialEnergy: 0.8 } }], self: [{ label: "ESFJ", re: /ESFJ/, tags: { socialEnergy: 0.8 } }] };
    expect(personaHit(`당신은 ${se.poles.minus.description}`, ctx)?.rule).toBe("persona_mismatch");
    expect(personaHit(`ESFJ는 ${se.poles.plus.description}`, ctx)?.rule).toBe("persona_copy");
    expect(personaHit("당신은 사람을 만나면 힘이 나요.", ctx)).toBeNull();
    expect(HARD_RULES.has("persona_mismatch")).toBe(true); expect(HARD_RULES.has("persona_copy")).toBe(false);
    // 지식 DB 수정(덕짱 태그 검토 4): 사교 에너지 + 설명은 외향으로 읽힌다.
    expect(se.poles.plus.description).toBe("사람들과 어울리고 나면 오히려 기운이 나는 편입니다.");
  });
  it("기혼에게 연애 호칭(연인·애인·남자친구·썸)은 관계 전제(HARD)", () => {
    expect(presumedPartner("연인과 쌓인 불만을 혼자 정리하는 편이에요.", "married")).toBe("연인");
    expect(presumedPartner("배우자와 하루를 나누는 시간이 필요해요.", "married")).toBeNull();
    expect(presumedPartner("연인과 쌓인 불만을 혼자 정리하는 편이에요.", "dating")).toBeNull();
  });
});

describe("Q2-5 지식 DB 수정 뒤 연결 계산", () => {
  it("합·충·형·해·파 특성은 성격 연결(fusion)이 없고 카드 연결에도 쓰이지 않는다", () => {
    for (const { label, brief } of books) {
      for (const t of brief.traits.filter(x => x.family === "relation")) expect(t.fusion, `${label} ${t.featureId}`).toBeUndefined();
      const rel = new Set(brief.traits.filter(x => x.family === "relation").map(x => `m:${x.id}`));
      for (const l of brief.design?.links ?? []) { expect(rel.has(l.a), label).toBe(false); expect(rel.has(l.b), label).toBe(false); }
    }
  });
  it("계산 연결 이유는 한 방향만(「같은 쪽으로 겹칩니다」와 「…쪽인데 …는」을 섞지 않음), 같은 차원 설명은 책에서 한 번", () => {
    for (const { label, brief } of books) {
      const whys = brief.traits.filter(t => t.fusion?.source === "computed").map(t => t.fusion!.why);
      for (const w of whys) expect(/같은 쪽으로 겹칩니다/.test(w) && /쪽인데 /.test(w), `${label}: ${w}`).toBe(false);
      const descs = k.ontology.dimensions.flatMap(d => [d.poles.plus.description, d.poles.minus.description]);
      for (const d of descs) expect(whys.filter(w => w.includes(d.replace(/ 편입니다\.$/, ""))).length, `${label}: ${d}`).toBeLessThanOrEqual(1);
    }
  });
  it("지정 고침: 음착양차살은 계획성·공감 태그가 없고, 양(養)은 챙김 태그가 없고, 임술은 위험 감수 태그가 없다", () => {
    expect(k.features.get("shinsal:EUMCHAK_YANGCHA")!.dimensionTags).not.toHaveProperty("planning");
    expect(k.features.get("shinsal:EUMCHAK_YANGCHA")!.dimensionTags).not.toHaveProperty("empathyResponse");
    expect(k.features.get("twelveStage:養")!.dimensionTags).not.toHaveProperty("caretaking");
    expect(k.features.get("dayPillar:壬戌")!.dimensionTags).not.toHaveProperty("riskTaking");
  });
});

describe("Q2-6 사실 대조 보강", () => {
  const pair = books[3];
  const pairInput = inputs[3].input, sheet = buildFactSheet(pairInput, null, k), ctx = factCtxOf(sheet, k, personNames(pair.brief));
  const [A, B] = sheet.people;
  it("두 사람 공통 주장: 한 사람에게만 있는 신살을 「두 사람 모두」로 쓰면 걸린다(문장 또는 문단의 공통 말)", () => {
    const only = A.shinsal.find(s => !B.shinsal.some(x => x.name === s.name) && ctx.aliases.some(a => a.name === s.name)) ?? B.shinsal.find(s => !A.shinsal.some(x => x.name === s.name) && ctx.aliases.some(a => a.name === s.name));
    if (!only) return;
    expect(factCheck(`두 사람 모두 ${only.name}이 있어 힘든 때 도움이 와요.`, ctx)?.detail).toMatch(/두 사람 공통 아님/);
    const para = `이때 두 사람에게 있는 기운이 힘이 돼요. ${only.name}은 무게를 덜어 주는 덕이에요.`;
    expect(factCheck(`${only.name}은 무게를 덜어 주는 덕이에요.`, ctx, para)?.detail).toMatch(/두 사람 공통 아님/);
    const both = A.shinsal.find(s => B.shinsal.some(x => x.name === s.name) && ctx.aliases.some(a => a.name === s.name));
    if (both) expect(factCheck(`두 사람 모두 ${both.name}이 있어요.`, ctx)?.detail ?? "").not.toMatch(/두 사람 공통 아님/);
  });
  it("배우자 별·자녀 별의 성별 기준(남 = 배우자 재성·자녀 관성, 여 = 배우자 관성·자녀 식상): 십성 이름·자리로 반대를 쓰면 걸린다", () => {
    const single = (p: typeof A) => factCtxOf({ ...sheet, people: [p] }, k, [[p.name]]);
    const male = [A, B].find(p => p.gender === "MALE")!, female = [A, B].find(p => p.gender === "FEMALE")!;
    expect(factCheck("당신의 배우자 별은 관성이라 믿음직한 사람에게 끌려요.", single(male))?.detail).toMatch(/재성\(편재·정재\)/);
    expect(factCheck("당신의 배우자 별은 재성이라 끌려요.", single(male))).toBeNull();
    expect(factCheck("당신의 배우자 별인 재성이 드러나 있어요.", single(female))?.detail).toMatch(/관성\(편관·정관\)/);
    expect(factCheck("당신의 자녀 별인 관성이 보여요.", single(female))?.detail).toMatch(/식상\(식신·상관\)/);
  });
  it("해마다 십성: 「YYYY년은 X의 해」「YYYY년 …은 X, YYYY년 …은 Y가 들어오는 해」를 정답지 해 십성과 견준다(원국 십성 말은 안 봄)", () => {
    const single = factCtxOf({ ...sheet, people: [A] }, k, [[A.name]]);
    const y1 = A.annual.find(a => a.year === 2032)!, y2 = A.annual.find(a => a.year === 2033)!;
    const wrong = (a: typeof y1) => ["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"].find(t => t !== a.stemTenGod && t !== a.branchTenGod)!;
    expect(factCheck(`2032년은 ${wrong(y1)}이 들어오는 해예요.`, single)?.rule).toBe("fact_dayun");
    expect(factCheck(`2032년은 ${y1.stemTenGod}이 들어오는 해예요.`, single)).toBeNull();
    expect(factCheck(`2032년 ${y1.ganjiKo}년은 ${y1.stemTenGod}, 2033년 ${y2.ganjiKo}년은 ${wrong(y2)}이 들어오는 해예요.`, single)?.detail).toMatch(/^2033년/);
    expect(factCheck(`2030년에는 당신의 ${wrong(y1)}가 힘을 받아요.`, single)).toBeNull();
  });
  it("쓰기 전 대조: 원재료 문장 중 정답지와 어긋난 것은 빼고 design.card_fact_drop(chapter materials)에 남긴다. 남은 특성 글은 대조를 통과한다", () => {
    for (const { label, brief, input } of books.map((b, i) => ({ ...b, input: inputs[i].input }))) {
      const c = factCtxOf(buildFactSheet(input, null, k), k, personNames(brief));
      const drops = (brief.design?.card_fact_drop ?? []).filter(d => d.chapter === "materials");
      for (const d of drops) expect(d.reason, label).toMatch(/^(fact_|input_outside|common_split|label_leak|time_fixed|render_dup)/);
      for (const t of brief.traits) for (const s of splitSentences(t.forYou)) {
        const h = factCheck(s, c, s);
        if (h) expect(drops.some(d => d.name === `${t.id}.forYou`), `${label} ${t.id}: ${h.detail}`).toBe(true); // 칸이 다 빠지면 원문을 두고 기록만
      }
    }
  });
});

describe("Q2-7 공통 결함", () => {
  it("한자 주석은 낱말 경계·동음 일상어에서 붙이지 않는다(「처음 세운 기준」「상관이 없어요」「정관념」)", () => {
    const dict = termDictionary(k);
    const run = (p: string) => annotateChapter([{ heading: "h", paragraphs: [p] }], { dict, ganji: new Set() }).sections[0].paragraphs[0];
    expect(run("처음 세운 기준에서 방향을 다시 잡아요.")).not.toMatch(/歲運/);
    expect(run("그런 일과는 상관이 없어요.")).not.toMatch(/傷官/);
    expect(run("정관념에 매이지 않아요.")).not.toMatch(/正官/);
    expect(run("상관이 가진 힘은 말에서 나와요.")).toMatch(/상관\(傷官\)/);
  });
  it("연애 「만나기 좋은 곳」: 부족한 기운이 둘 이상이면 기운마다 따로 한 줄", () => {
    for (const { brief } of books.filter(b => b.brief.product === "love_marriage_child")) {
      const ev = JSON.stringify(brief.chapters.flatMap(c => [...c.materials, ...(c.sections ?? []).flatMap(s => s.materials)]).filter(m => m.kind === "evidence" && (m as { key?: string }).key === "meetingPlaces"));
      if (!ev.includes("새 인연을 만나기 좋은 곳")) continue;
      const lines = ev.match(/새 인연을 만나기 좋은 곳 — [^"]+/g) ?? [];
      for (const l of lines) expect((l.match(/기운을 채우는 곳/g) ?? []).length).toBe(1);
    }
  });
});
