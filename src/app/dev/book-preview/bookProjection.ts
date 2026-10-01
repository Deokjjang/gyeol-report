import "server-only";
import { projectV4Composition, projectV4Tables, validateV4Publication, type V4RuntimeEvidence } from "../../../lib/interpretation-v4/runtimeProjection";
import { buildV4Evidence, evaluateEvidence } from "../../../lib/interpretation-v4/evidencePolicy";
import { canonicalV4Feature, MATERIAL_BY_FEATURE } from "../../../lib/interpretation-v4/materialRegistry";
import { depthFeature } from "../../../lib/interpretation-v4/materialDepth";
import { adaptCalculation } from "../../../lib/interpretation-v3/evidence";
import { storyFeatureRows } from "../../../lib/interpretation-v3/comprehensiveStoryEvidence";
import { MAJOR_MEANINGS } from "../../../lib/interpretation-v4/majorMaterials";
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
      meaning: material.imagery || material.positiveMeaning,
      manifestation: strong ? seed?.text ?? material.positiveMeaning : `${positions.map(p => labels[p]).filter(Boolean).join(" · ") || "천간·지장간"}에서 확인된 기운입니다. 중심 성향으로 확대하지 않습니다.` } });
  }
  for (const element of packet.symbolicElements) {
    const label = { WOOD: "목 木", FIRE: "화 火", EARTH: "토 土", METAL: "금 金", WATER: "수 水" }[element.element];
    entries.push({ key: element.material.feature, strong: false, display: { name: `${label} · ${{ high: "강함", low: "약함", balanced: "균형" }[element.state]}`, person: name,
      meaning: element.material.imagery, manifestation: element.material.seeds.find(s => s.role === "character")!.text } });
  }
  // Reuse existing V3 relation meanings, with the full canonical placements.
  const relations = storyFeatureRows(adaptCalculation(calc), calc);
  for (const r of e.natalTableEvidence[slot].relations) {
    const copy = relations.find(f => f.label === r.label);
    if (!copy) continue;
    entries.push({ key: r.id, strong: true, display: { name: r.label, person: name, meaning: copy.meaning, manifestation: copy.power } });
  }
  return entries;
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
  const inventory = slots.flatMap((slot, i) => bookFeatureInventory(e, slot, people[i].name));
  const names = people.map(p => p.name).join(" · ");
  const input = e.input;
  const context = input.kind === "compatibility" ? [{ label: "관계", value: CATEGORIES.find(([id]) => id === input.relationshipType)?.[1] ?? "" }]
    : [{ label: "현재 상태", value: JOBS.find(([id]) => id === input.userContext.jobStatus)?.[1] ?? "" },
      { label: "현재 직업", value: input.userContext.detailJob }, { label: "현재 관계", value: RELATIONSHIPS.find(([id]) => id === input.userContext.relationshipStatus)?.[1] ?? "미선택" },
      ...(view.annual ? [{ label: "선택 연도", value: String(view.annual.selectedYear) }] : [])];

  const narrativePage = (heading: string, blocks: readonly NarrativeBlock[], extra: BookNote[] = []): BookPage => {
    const notes: BookNote[] = [];
    const paragraphs = blocks.map(block => {
      const matches = inventory.filter(entry => block.proof.features.some(f => featureKey(f) === entry.key));
      const candidates = matches.map(entry => ({ name: entry.display.name, text: entry.display.meaning }));
      // Period notes are selected from that section's own canonical period only.
      const relevant = [...candidates, ...(block === blocks[0] ? extra : [])];
      const numbers = relevant.map(n => { let index = notes.findIndex(v => v.name === n.name && v.text === n.text); if (index < 0) { index = notes.length; notes.push(n); } return index + 1; });
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
  pages.push(narrativePage(view.headline, c.result.narrative.opening, openingNotes));
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
    pages.push(narrativePage(section.title, section.blocks, extra));
  }
  if (c.product === "saju_mbti_compatibility") {
    const pair = pages.find(p => p.kind === "pair")!;
    pair.directions = (["aToB", "bToA"] as const).map((slot, i) => ({ title: view.compatibility![slot].title,
      effect: c.result.directions[slot].receivedTenGod?.tenGodKo ?? "서로에게 주는 영향", page: sectionPages.get(i === 0 ? "direction-ab" : "direction-ba")! }));
  }
  if (c.product === "major_fortune") {
    const timeline = pages.find(p => p.kind === "timeline")! as Extract<BookPage, { kind: "timeline" }>;
    timeline.years = c.result.years.map(y => ({ year: y.year, age: y.age, cycle: y.cycle.ganji, annual: y.annual.ganji,
      theme: y.protagonist, good: y.goodTheme, caution: y.cautionTheme, title: y.title, time: timeLabel[y.timePosition], page: sectionPages.get(`year-${y.year}`)!,
      transition: c.result.transitions.find(t => t.year === y.year)?.dateLabel ?? null }));
    timeline.transitions = c.result.transitions.map(t => ({ date: t.dateLabel, before: t.before.ganji, after: t.after.ganji, page: sectionPages.get(`transition-${t.year}`)! }));
  }
  if (c.product === "annual_fortune") {
    const overview = pages.find(p => p.kind === "months")! as Extract<BookPage, { kind: "months" }>;
    overview.months = c.result.months.map(m => ({ month: m.month, title: m.title, theme: /[a-z]/i.test(m.strongestTheme) ? MAJOR_MEANINGS[m.god].theme : m.strongestTheme, time: timeLabel[m.time],
      ganji: m.focus.monthPillar.stem + m.focus.monthPillar.branch, gods: `${m.focus.stemTenGod} · ${m.focus.branchTenGod}`,
      markers: unique(c.result.evidence.months.find(v => v.month === m.month)!.transit.accepted.flatMap(f => f.observations.map(o => o.label))), page: sectionPages.get(`month-${m.month}`)! }));
  }
  const items = inventory.map(f => f.display);
  for (let i = 0; i < items.length; i += 10) pages.push({ kind: "appendix", title: "이 책에 사용된 기운", items: items.slice(i, i + 10), from: i + 1, total: items.length });
  pages.push({ kind: "back", title: "이 책 공유하기", finalLine: view.finalLine });
  const share = describeReportShare({ productSlug: e.input.productSlug, draft: view });
  return { bookId, title, names, people, context, pages, readingDate: e.generatedAt.slice(0, 10), share: { title: `${names} · ${title}`, description: share.description } };
}
