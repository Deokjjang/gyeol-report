import "server-only";
import { projectV4Composition, projectV4Tables, validateV4Publication, type V4RuntimeEvidence } from "../../../lib/interpretation-v4/runtimeProjection";
import { buildV4Evidence, evaluateEvidence } from "../../../lib/interpretation-v4/evidencePolicy";
import { canonicalV4Feature, MATERIAL_BY_FEATURE } from "../../../lib/interpretation-v4/materialRegistry";
import { depthFeature } from "../../../lib/interpretation-v4/materialDepth";
import { shortDefinition } from "../../../lib/interpretation-v4/contentWhy";
import { projectYinYang } from "../../../lib/interpretation-v4/contentEvidence";
import { adaptCalculation } from "../../../lib/interpretation-v3/evidence";
import { storyFeatureRows } from "../../../lib/interpretation-v3/comprehensiveStoryEvidence";
import { MAJOR_MEANINGS } from "../../../lib/interpretation-v4/majorMaterials";
import { friendlyTransition } from "../../../lib/interpretation-v4/periodPlanner";
import { godEffects } from "../../../lib/interpretation-v4/compatibilityInteractions";
import { composeBookNavigation } from "./bookNavigation";
import { comprehensiveBookContents, COMPREHENSIVE_PLAIN_MEANINGS, COMPREHENSIVE_STAGE_MEANINGS } from "./comprehensiveBook";
import { comprehensiveRuleHeadings, comprehensiveProductContents } from "../../../lib/book/comprehensiveBookAdapter";
import { describeReportShare } from "../../../lib/sharing/reportShareMetadata";
import type { NarrativeBlock, MaterialPacket } from "../../../lib/interpretation-v4/narrativeTypes";
import type { GenerationPersonInput } from "../../../lib/report-generation/reportInputAdapter";
import { BIRTH_TIME_SLOT_DEFINITIONS } from "../../../lib/saju/birthTimePrecisionTypes";
import { BOOKS, JOBS, RELATIONSHIPS, CATEGORIES, readerTitle } from "./model";
import type { BookData, BookFeature, BookNote, BookPage, BookPerson } from "./bookTypes";

const timeLabel = { past: "돌아보기", current: "지금", future: "앞으로" };
const featureKey = (id: string) => depthFeature(canonicalV4Feature(id));
const unique = <T,>(values: readonly T[]) => [...new Set(values)];
const safeLabel = (s: string) => !/[a-z]{2,}[_:]|sourceRefs|provenance|망신|문곡|복성|천의성/.test(s);

type Entry = { key: string; display: BookFeature; strong: boolean };
function materialPacket(e: V4RuntimeEvidence, slot: "person" | "personA" | "personB"): MaterialPacket {
  const c = e.composition;
  return c.product === "saju_mbti_compatibility" ? c.result.persons[slot as "personA" | "personB"].materials : c.result.materials;
}

/** Full confirmed inventory, not a short list of hero features. Weak observed
 * ten-gods remain presence-only; no unsupported structures or DB-only markers. */
export function bookFeatureInventory(e: V4RuntimeEvidence, slot: "person" | "personA" | "personB", name: string): Entry[] {
  const packet = materialPacket(e, slot), calc = e.calculations[slot];
  const entries: Entry[] = [];
  for (const decision of buildV4Evidence(calc, slot).map(evaluateEvidence)) {
    if (!["confirmed/calculated", "derived-but-supported"].includes(decision.status)) continue;
    const key = featureKey(decision.evidence.feature), material = MATERIAL_BY_FEATURE.get(key);
    if (!material || !safeLabel(material.label) || entries.some(f => f.key === key)) continue;
    const bound = packet.selected.find(f => featureKey(f.feature) === key);
    const strong = decision.usable && decision.strength === "strong" && Boolean(bound);
    const seed = bound?.material.seeds.find(s => s.role === "character");
    const positions = unique(e.natalTableEvidence[slot].features.filter(f => featureKey(f.id) === key).flatMap(f => f.positions));
    const labels: Record<string, string> = { year: "연주", month: "월주", day: "일주", hour: "시주" };
    entries.push({ key, strong, display: { name: material.label, person: name,
      group: key.startsWith("ten_god_") ? "십성" : key.startsWith("v4_structure:") ? "주요 구조" : /day_|dayMaster/.test(key) ? "일간·일주" : "신살·귀인",
      meaning: bound ? shortDefinition(bound) : material.imagery || material.positiveMeaning,
      manifestation: strong ? seed?.text ?? material.positiveMeaning : `${positions.map(p => labels[p]).filter(Boolean).join(" · ") || "천간·지장간"}에서 확인된 기운입니다. 중심 성향으로 확대하지 않습니다.` } });
  }
  for (const element of packet.symbolicElements) {
    const label = { WOOD: "목 木", FIRE: "화 火", EARTH: "토 土", METAL: "금 金", WATER: "수 水" }[element.element];
    entries.push({ key: element.material.feature, strong: false, display: { name: `${label} · ${{ high: "강함", low: "약함", balanced: "균형" }[element.state]}`, person: name, group: "오행·음양",
      meaning: element.material.imagery, manifestation: element.material.seeds.find(s => s.role === "character")!.text } });
  }
  // Reuse existing V3 relation meanings, with the full canonical placements.
  const relations = storyFeatureRows(adaptCalculation(calc), calc);
  for (const r of e.natalTableEvidence[slot].relations) {
    const copy = relations.find(f => f.label === r.label);
    if (!copy) continue;
    if (!entries.some(v => v.display.name === r.label)) entries.push({ key: r.id, strong: true, display: { name: r.label, person: name, group: "합·충·형·파·해", meaning: copy.meaning, manifestation: copy.power } });
  }
  const yy = projectYinYang(calc);
  if (yy.total) entries.push({ key: "natal:yin-yang", strong: false, display: { name: `음 ${yy.yin} · 양 ${yy.yang}`, person: name, group: "오행·음양", meaning: `${yy.complete ? "네 기둥" : "확인된 기둥"}의 천간·지지를 한 번씩 센 음양 분포.`, manifestation: "" } });
  for (const row of e.natalTableEvidence[slot].pillars) {
    for (const hidden of row.hiddenStems ?? []) if (!entries.some(v => v.key === `hidden:${hidden}`)) entries.push({ key: `hidden:${hidden}`, strong: false,
      display: { name: hidden, person: name, group: "지장간", meaning: [...MATERIAL_BY_FEATURE.values()].find(m => m.label === hidden.split(" ")[1])?.positiveMeaning ?? "표의 해당 기둥 안에 함께 담긴 기운.", manifestation: "" } });
    for (const stage of row.twelveLifeStage ?? []) if (!entries.some(v => v.key === `stage:${stage}`)) entries.push({ key: `stage:${stage}`, strong: false,
      display: { name: stage, person: name, group: "십이운성", meaning: "일간과 지지의 관계를 성장의 단계에 빗대어 보는 이름.", manifestation: "" } });
  }
  return e.composition.product === "saju_mbti_full" ? entries.map(entry => ({ ...entry, display: { ...entry.display,
    meaning: (entry.display.group === "십이운성" ? COMPREHENSIVE_STAGE_MEANINGS[entry.display.name] : COMPREHENSIVE_PLAIN_MEANINGS[entry.key]) ?? entry.display.meaning } })) : entries;
}

function personView(p: GenerationPersonInput, role: string, table: BookPerson["table"]): BookPerson {
  return { name: p.name, role, birth: p.birthDate, gender: p.gender, precision: p.birthTimePrecision ?? (p.birthTimeUnknown ? "unknown" : "exact"),
    time: p.birthTime ?? "", mbti: p.mbtiType ?? "", timeLabel: p.birthTimePrecision === "unknown" ? "출생시간 모름" : p.birthTimePrecision === "approximate" ? `대략 · ${BIRTH_TIME_SLOT_DEFINITIONS.find(s => s.value === p.approximateBirthTimeSlot)?.labelKo ?? "입력 시간대"}` : `정확 · ${p.birthTime}`, table };
}

/** Pure reading projection: validated frozen packet in, allowlisted pages out.
 * Never changes composer copy, calculation, snapshot, public gate or share SDK. */
export function projectBook(e: V4RuntimeEvidence): BookData | null {
  const c = e.composition, view = projectV4Composition(c);
  if (!validateV4Publication(c.product, view, e).ok) return null;
  const book = BOOKS.find(b => b.productKey === c.product)!, bookId = book.id;
  const title = readerTitle(book, String(view.annual?.selectedYear ?? "2026"));
  const tables = projectV4Tables(e);
  // The canonical table is unchanged. V4's disputed marker is presentation-held.
  const safeTables = tables.map(t => ({ ...t, manse: { ...t.manse, detailRows: t.manse.detailRows.map(r => ({ ...r,
    cells: { hour: r.cells.hour.filter(v => !v.includes("망신")), day: r.cells.day.filter(v => !v.includes("망신")), month: r.cells.month.filter(v => !v.includes("망신")), year: r.cells.year.filter(v => !v.includes("망신")) } })) } }));
  const people = e.input.kind === "compatibility" ? [personView(e.input.personA, view.compatibility!.personA.role, safeTables[0]), personView(e.input.personB, view.compatibility!.personB.role, safeTables[1])]
    : [personView(e.input.person, "주인공", safeTables[0])];
  const slots = e.input.kind === "compatibility" ? ["personA", "personB"] as const : ["person"] as const;
  const personalInventories = slots.map((slot, i) => bookFeatureInventory(e, slot, people[i].name));
  const inventory = personalInventories.flat();
  const names = people.map(p => p.name).join(" · ");
  const input = e.input;
  const context = input.kind === "compatibility" ? [{ label: "관계", value: CATEGORIES.find(([id]) => id === input.relationshipType)?.[1] ?? "" }]
    : [{ label: "현재 상태", value: JOBS.find(([id]) => id === input.userContext.jobStatus)?.[1] ?? "" },
      { label: "현재 직업", value: input.userContext.detailJob }, { label: "현재 관계", value: RELATIONSHIPS.find(([id]) => id === input.userContext.relationshipStatus)?.[1] ?? "미선택" },
      ...(view.annual ? [{ label: "선택 연도", value: String(view.annual.selectedYear) }] : [])];

  const definedTerms = new Set<string>();
  const narrativePage = (heading: string, blocks: readonly NarrativeBlock[], extra: BookNote[] = []): BookPage => {
    const notes: BookNote[] = [];
    const paragraphs = blocks.map(block => {
      const matches = inventory.filter(entry => block.proof.features.some(f => featureKey(f) === entry.key));
      const candidates = matches.filter(entry => !definedTerms.has(entry.display.name) && block.text.includes(entry.display.name))
        .map(entry => ({ name: entry.display.name, text: entry.display.meaning }));
      // Period notes are selected from that section's own canonical period only.
      const uniqueCandidates = [...new Map([...candidates, ...(block === blocks[0] ? extra.filter(n => blocks.some(b => b.text.includes(n.name))) : [])].map(n => [n.name, n])).values()];
      // An explanation already given in this chapter needs no identical note.
      // Mark it defined so a later chapter does not introduce a redundant one.
      for (const note of uniqueCandidates) if (blocks.some(b => b.text.includes(note.text))) definedTerms.add(note.name);
      const relevant = uniqueCandidates.filter(n => !definedTerms.has(n.name)).slice(0, Math.max(0, 2 - notes.length));
      const numbers = relevant.map(n => { definedTerms.add(n.name); notes.push(n); return notes.length; });
      return { text: block.text, notes: unique(numbers) };
    });
    return { kind: "narrative", title: heading, paragraphs, notes };
  };
  const pages: BookPage[] = [{ kind: "cover", title, names, headline: view.headline }];
  if (c.product !== "saju_mbti_compatibility") pages.push({ kind: "input", title: "이 책의 주인공" });
  if (c.product === "saju_mbti_compatibility") {
    pages.push({ kind: "pair", title: "우리라는 사이", category: context[0].value,
      characters: [c.result.persons.personA, c.result.persons.personB].map(p => ({ name: p.name, core: p.core, strength: p.strength, relationship: p.relationship })),
      directions: [], relations: unique(c.result.evidence.relations.map(r => r.labelKo)) });
    const index = c.result.compatibilityIndex;
    if (index) pages.push({ kind: "score", id: "compatibility-index", title: "결리포트 궁합 지수", total: index.total,
      scores: index.scores.map(({ label, value, max }) => ({ label, value, max })), verdict: index.verdict, notice: index.notice, limitations: index.limitations });
  }
  people.forEach((p, i) => { pages.push({ kind: "manse", title: `${p.name}의 만세력`, person: i }, { kind: "mbti", title: `${p.name}의 MBTI`, person: i }); });
  const openingNotes: BookNote[] = [];
  if (c.product === "major_fortune") {
    const active = c.result.evidence.horizon.activeCycle!;
    openingNotes.push({ name: `${active.ganji} 대운 · ${active.tenGod}`, text: MAJOR_MEANINGS[active.tenGod].theme });
  }
  if (c.product === "annual_fortune") {
    const raw = c.result.evidence.raw;
    openingNotes.push({ name: `${raw.selectedYear}년 · ${raw.annualGanji.ganji} 세운`, text: `${raw.annualFortune.stemTenGod} · ${MAJOR_MEANINGS[raw.annualFortune.stemTenGod].theme}` });
  }
  pages.push({ ...narrativePage(view.headline, c.result.narrative.opening, openingNotes), id: "core" });
  const sectionPages = new Map<string, number>();
  // Insert the compact overview before narrative details, not instead of them.
  if (c.product === "major_fortune") pages.push({ kind: "timeline", title: "시간의 흐름", years: [], transitions: [] });
  if (c.product === "annual_fortune") pages.push({ kind: "months", title: "올해의 12장면", months: [] });
  for (const section of c.result.narrative.sections) {
    const extra: BookNote[] = [];
    if (c.product === "major_fortune") {
      const year = c.result.years.find(y => section.id === `year-${y.year}`);
      if (year) {
        extra.push({ name: `${year.year}년 · ${year.annual.tenGod}`, text: `${year.annual.ganji} 세운 · ${year.cycle.ganji} 대운 · ${year.protagonist}` });
        for (const r of [year.selectedRelation.harmony, year.selectedRelation.tension]) if (r) extra.push({ name: `${r.branches.join("")} ${r.type}`, text: r.plain });
      }
      const transition = c.result.transitions.find(t => section.id === `transition-${t.year}`);
      if (transition) extra.push({ name: `${transition.before.ganji} → ${transition.after.ganji} 대운`, text: `${transition.dateLabel} · ${MAJOR_MEANINGS[transition.before.tenGod].theme} → ${MAJOR_MEANINGS[transition.after.tenGod].theme}` });
    }
    if (c.product === "annual_fortune") {
      if (section.id === "dayun-cross") for (const period of c.result.evidence.crossPeriods) for (const cycle of period.cycles) {
        extra.push({ name: `${cycle.cycle.ganji} 대운 · ${cycle.god}`, text: `${MAJOR_MEANINGS[cycle.god].theme} / ${period.segment.effectiveAnnualPillar.stem}${period.segment.effectiveAnnualPillar.branch} 세운 · ${period.annualGod}` });
      }
      const month = c.result.months.find(m => section.id === `month-${m.month}`);
      if (month) {
        extra.push({ name: `${month.month}월 · ${month.focus.stemTenGod} / ${month.focus.branchTenGod}`, text: `${month.focus.monthPillar.stem}${month.focus.monthPillar.branch} 월운` });
        // A shared month provenance reference does not prove a marker was used.
        // Only the composer's explicitly selected transit can become a note.
        for (const fact of month.selectedTransit ? [month.selectedTransit] : []) {
          const material = MATERIAL_BY_FEATURE.get(fact.feature);
          if (material && safeLabel(material.label)) extra.push({ name: `${month.month}월 · ${material.label}`, text: material.imagery });
        }
      }
    }
    sectionPages.set(section.id, pages.length);
    pages.push({ ...narrativePage(section.title, section.blocks, extra), id: `chapter-${section.id}` });
  }
  if (c.product === "saju_mbti_compatibility") {
    const pair = pages.find(p => p.kind === "pair")!;
    pair.directions = (["aToB", "bToA"] as const).map((slot, i) => ({ title: view.compatibility![slot].title,
      effect: godEffects[c.result.directions[slot].receivedTenGod?.tenGodKo ?? ""] ?? "서로에게 주는 영향", term: c.result.directions[slot].receivedTenGod?.tenGodKo, page: sectionPages.get(i === 0 ? "direction-ab" : "direction-ba")! }));
  }
  if (c.product === "major_fortune") {
    const timeline = pages.find(p => p.kind === "timeline")! as Extract<BookPage, { kind: "timeline" }>;
    timeline.years = c.result.years.map(y => ({ year: y.year, age: y.age, cycle: y.cycle.ganji, annual: y.annual.ganji,
      theme: y.protagonist, good: y.goodTheme, caution: y.cautionTheme, title: y.title, time: timeLabel[y.timePosition], page: sectionPages.get(`year-${y.year}`)!,
      importance: y.importance, transition: c.result.transitions.find(t => t.year === y.year) ? friendlyTransition(c.result.transitions.find(t => t.year === y.year)!.dateLabel) : null }));
    timeline.transitions = c.result.transitions.map(t => ({ date: friendlyTransition(t.dateLabel), exact: t.dateLabel, before: t.before.ganji, after: t.after.ganji, page: sectionPages.get(`transition-${t.year}`)! }));
  }
  if (c.product === "annual_fortune") {
    const overview = pages.find(p => p.kind === "months")! as Extract<BookPage, { kind: "months" }>;
    overview.map = c.result.yearMap;
    overview.months = c.result.months.map(m => ({ month: m.month, title: m.title, theme: /[a-z]/i.test(m.strongestTheme) ? MAJOR_MEANINGS[m.god].theme : m.strongestTheme, time: timeLabel[m.time],
      ganji: m.focus.monthPillar.stem + m.focus.monthPillar.branch, gods: `${m.focus.stemTenGod} · ${m.focus.branchTenGod}`,
      good: MAJOR_MEANINGS[m.god].gift, caution: m.action?.avoid, importance: m.plan?.importance, boundary: m.boundary,
      markers: unique(c.result.evidence.months.find(v => v.month === m.month)!.transit.accepted.flatMap(f => f.observations.map(o => o.label))), page: sectionPages.get(`month-${m.month}`)! }));
  }
  const used = new Set([...c.result.narrative.opening, ...Array.from(c.result.narrative.sections).flatMap(s => s.blocks)].flatMap(b => b.proof.features.map(featureKey)));
  const ordered = (entries: Entry[]) => entries.map(f => ({ ...f.display, core: used.has(f.key) })).sort((a, b) => (a.group ?? "").localeCompare(b.group ?? "") || a.name.localeCompare(b.name));
  // One compact appendix per person, not one page per ten definitions.
  let from = 1;
  for (const [i, person] of people.entries()) {
    const personal = ordered(personalInventories[i]);
    pages.push({ kind: "appendix", title: people.length > 1 ? `${person.name}의 모든 기운` : "내 모든 기운", items: personal, from, total: inventory.length });
    from += personal.length;
  }
  pages.push({ kind: "back", title: "이 책 공유하기", finalLine: view.finalLine });
  const share = describeReportShare({ productSlug: e.input.productSlug, draft: view });
  const integration = c.product === "saju_mbti_full" && "integration" in c.result ? c.result.integration : null;
  // The closing manual's own title must not replace its first rule subtitle
  // when the preceding chapter happens to be short. Legacy books are unchanged.
  const navigation = composeBookNavigation(integration ? comprehensiveRuleHeadings(pages, integration.represented) : pages, integration ? ["chapter-direction"] : []);
  return { bookId, title, names, people, context, pages: integration ? comprehensiveProductContents(navigation) : c.product === "saju_mbti_full" ? comprehensiveBookContents(navigation) : navigation, readingDate: e.generatedAt.slice(0, 10), share: { title: `${names} · ${title}`, description: share.description } };
}
