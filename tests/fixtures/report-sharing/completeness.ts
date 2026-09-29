import assert from "node:assert/strict";
import type { ProductPreviewSnapshot } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { isComprehensiveV3Draft } from "../../../src/lib/interpretation-v3/comprehensive";
import { isCareerV3Draft } from "../../../src/lib/interpretation-v3/careerEditorial";
import { isLoveV3Draft } from "../../../src/lib/interpretation-v3/loveEditorial";
import { isCompatibilityV3Draft } from "../../../src/lib/interpretation-v3/compatibilityEditorial";
import { isMajorFortuneV3Draft } from "../../../src/lib/interpretation-v3/majorFortuneEditorial";
import { isAnnualV3Draft } from "../../../src/lib/interpretation-v3/annualEditorial";
import { LOVE_STATUS_LABELS } from "../../../src/lib/interpretation-v3/loveEditorialContext";
import { CATEGORY_LABELS } from "../../../src/lib/interpretation-v3/compatibilityEditorialCopy";
import type { PairCalculations } from "../../../src/lib/interpretation-v3/compatibilityEditorialEvidence";

// Test-only projection of the actual V3 render contracts. This is not a second
// publish architecture: existing versioned replay validators remain authoritative.
export function completenessManifest(snapshot: ProductPreviewSnapshot) {
  const d = snapshot.draft;
  const sections: { id: string; selector: string; text: readonly string[] }[] = [];
  const collections: Record<string, number> = {};
  let years: number[] = [], ageLabels: string[] = [], transitionYears: number[] = [];
  let currentMonths = 0, finalSelector = "";
  const add = (id: string, selector: string, text: readonly string[]) => {
    assert(text.length > 0, id + ": empty section");
    text.forEach(t => assert(typeof t === "string" && t.trim() && !/^(?:undefined|null|\.{3}|…|\[truncated\])$|\[object Object\]|CONTENT_TRUNCATED|내용 생략/iu.test(t.trim()), id + ": placeholder"));
    assert(!sections.some(s => s.id === id), id + ": duplicate section");
    sections.push({ id, selector, text }); collections[id] = text.length;
  };
  if (isComprehensiveV3Draft(d)) {
    const blocks = (bs: typeof d.opening) => bs.flatMap(b => [b.headline ?? "", ...(b.paragraphs ?? []), ...(b.ideas ?? []), b.action ?? ""].filter(Boolean));
    assert(d.opening.length && d.sections.length && d.patterns.length && d.direction.trim());
    add("opening", "#v3-core", blocks(d.opening));
    d.sections.forEach(s => { assert(s.blocks.length); add(s.id, "#v3-" + s.id, blocks(s.blocks)); collections[s.id + ".blocks"] = s.blocks.length; });
    add("patterns", "#v3-patterns", d.patterns.flatMap(p => [p.risk, ...(p.why ? p.why.split("\n\n") : []), p.repair]));
    add("direction", "#v3-direction", d.direction.split("\n\n"));
    finalSelector = "#v3-direction";
  } else if (isCareerV3Draft(d) || isLoveV3Draft(d) || isCompatibilityV3Draft(d)) {
    if (isCareerV3Draft(d)) {
      const basis = (snapshot.evidencePacket as { inputBasis: { person: { mbtiType: string }; userContext: { detailJob: string } } }).inputBasis;
      assert(basis.userContext.detailJob);
      add("input", "[data-career-input]", [d.personLabel + "님의 입력 정보", "현재 상태", basis.userContext.detailJob, basis.person.mbtiType]);
    } else if (isLoveV3Draft(d)) {
      add("input", "[data-love-input]", [LOVE_STATUS_LABELS[d.relationshipStatus], d.mbti || "모름", ...(d.familyFocus ? ["가족"] : [])]);
    } else {
      const { calculations } = (snapshot.evidencePacket as { compatibilityV3: { calculations: PairCalculations } }).compatibilityV3;
      add("input", "[data-compatibility-input]", [CATEGORY_LABELS[d.relationshipType], ...(["personA", "personB"] as const).flatMap(slot => [d.people[slot].name, d.people[slot].mbti || "모름", calculations[slot].input.birthDate])]);
    }
    const prefix = isCareerV3Draft(d) ? "career" : isLoveV3Draft(d) ? "love" : "pair";
    const required = isCareerV3Draft(d) ? ["portrait", "strength", "current", "money", "growth", "fortune", "next", "direction"]
      : isLoveV3Draft(d) ? ["portrait", "present", "attraction", "charm", "expression", "friction", "home", "parent", "direction"]
        : ["chemistry", "directions", "life-0", "life-1", "life-2", "assets", "ending"];
    required.forEach(id => assert.equal(d.chapters.filter(c => c.id === id).length, 1, id));
    d.chapters.forEach(c => {
      assert(c.scenes.length);
      c.scenes.forEach(s => assert(s.parts.length));
      add(c.id, "#" + prefix + "-" + c.id, c.scenes.flatMap(s => [s.headline, ...s.parts.map(p => p.text)]));
      collections[c.id + ".scenes"] = c.scenes.length;
    });
    finalSelector = "#" + prefix + "-" + (isCompatibilityV3Draft(d) ? "ending" : "direction");
    assert.equal(sections.at(-1)?.selector, finalSelector);
    if (isCompatibilityV3Draft(d)) {
      assert(d.people.personA.name && d.people.personB.name && d.relationshipType);
      const directions = d.chapters.find(c => c.id === "directions")!.scenes;
      assert(directions.some(s => s.subject === "personA" && s.toward === "personB"));
      assert(directions.some(s => s.subject === "personB" && s.toward === "personA"));
      assert(!/\d+\s*점|[SABC][+-]?\s*등급/u.test(sections.flatMap(s => s.text).join(" ")));
    }
  } else if (isMajorFortuneV3Draft(d)) {
    assert(d.horizon);
    const expected = Array.from({ length: 14 }, (_, i) => d.horizon!.currentYear - 3 + i);
    years = d.editorialYears.map(y => y.year);
    assert.deepEqual(years, expected);
    assert.deepEqual(d.horizon.rows.map(r => r.year), expected);
    assert.equal(d.editorialYears.filter(y => y.timePosition === "future").length, 10);
    ageLabels = d.editorialYears.map(y => { assert(y.ageLabel); return y.ageLabel; });
    transitionYears = d.horizon.transitions.map(t => t.year);
    add("opening", "[data-major-opening]", d.opening);
    d.editorialSections.forEach(s => add(s.id, "#horizon-" + s.id, s.paragraphs));
    d.editorialYears.forEach(y => { assert(y.paragraphs.length >= (y.timePosition === "past" ? 1 : 3)); add("year-" + y.year, "#year-" + y.year, y.paragraphs); });
    add("finale", "[data-major-finale]", d.finale);
    finalSelector = "[data-major-finale]";
    collections.years = years.length; collections.timeline = d.horizon.rows.length;
  } else if (isAnnualV3Draft(d)) {
    assert(d.hook && d.spoiler && d.inputSummary.some(r => r.label === "선택 연도"));
    assert.deepEqual(d.editorialMonths.map(m => m.month), Array.from({ length: 12 }, (_, i) => i + 1));
    currentMonths = d.editorialMonths.filter(m => m.timePosition === "current").length;
    const selectedYear = Number(d.inputSummary.find(r => r.label === "선택 연도")!.value.slice(0, 4));
    assert.equal(currentMonths, selectedYear === Number(d.evaluatedAtKst.slice(0, 4)) ? 1 : 0);
    add("input", '[aria-label="' + d.personLabel + '님의 입력 정보"]', d.inputSummary.flatMap(row => [row.label, row.value]));
    add("spoiler", '[aria-label="한 해의 스포일러"]', [d.hook, d.spoiler]);
    add("dayun", '[aria-label="세운과 대운"]', [selectedYear + "년", "대운"]);
    add("opening", "[data-annual-opening]", d.opening);
    d.annualSections.forEach(s => add(s.id, "#annual-" + s.id, s.paragraphs));
    d.editorialMonths.forEach(m => {
      assert(m.paragraphs.length >= 4);
      // Latest customer UX has one main story per month; legacy sub-period
      // prose remains stored internally, not a required second visible story.
      add("month-" + m.month, "#annual-month-" + m.month, m.paragraphs);
      collections["month-" + m.month + ".segments"] = 1 + m.segments.length;
    });
    add("finale", "#annual-finale", d.finale);
    finalSelector = "#annual-finale"; collections.months = 12;
  } else assert.fail("Latest V3 required for release fixtures");
  return { product: snapshot.productType, version: d.version, sections, collections, finalSelector,
    finalText: sections.at(-1)!.text.at(-1)!, years, ageLabels, transitionYears, currentMonths };
}

export function visibleHtmlText(html: string) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<[^>]*>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&lt;", "<").replaceAll("&gt;", ">")
    .replace(/\s+/gu, " ").trim();
}
export function assertDeliveredHtml(html: string, manifest: ReturnType<typeof completenessManifest>) {
  const text = visibleHtmlText(html);
  assert(html.includes('data-report-version="' + manifest.version + '"'));
  for (const section of manifest.sections) {
    const marker = section.selector.startsWith("#") ? 'id="' + section.selector.slice(1) + '"' : section.selector.slice(1, -1);
    assert(html.includes(marker), "Missing section: " + section.id);
    section.text.forEach(t => assert(text.includes(t.replace(/\s+/gu, " ").trim()), "Missing customer text in " + section.id + ": " + t.slice(0, 60)));
  }
  assert.equal((html.match(/aria-label="리포트 공유하기"/g) ?? []).length, 1);
  assert(html.indexOf('aria-label="리포트 공유하기"') > html.lastIndexOf("</article>"));
  assert(!/<footer\b/.test(html));
  assert(!/sourceRefs|narrativeAudit|month-v2:/.test(html));
  assert(html.includes("나도 내 리포트 보기"));
  assert(html.includes("data-story-tables") && html.includes("data-story-signals") && html.includes("data-mbti-detail"));
  if (manifest.collections.months) {
    assert.equal((html.match(/data-month-position=/g) ?? []).length, 12);
    assert.equal((html.match(/data-current-month="true"/g) ?? []).length, manifest.currentMonths);
    assert(html.includes('aria-label="12개월 월운표"'));
  }
  manifest.ageLabels.forEach(age => assert(text.includes(age)));
  manifest.transitionYears.forEach(year => assert(text.includes(year + "년") && text.includes("대운 전환")));
}
