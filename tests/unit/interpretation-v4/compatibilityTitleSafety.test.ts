import { describe, it, expect } from "vitest";
import { renderCompatibilityTitle } from "../../../src/lib/interpretation-v4/compatibilityTitle";
import { COMPATIBILITY_READER_CHAPTERS } from "../../../src/lib/interpretation-v4/compatibilityReleaseContracts";

describe("Compatibility explicit display title slots", () => {
  it.each([
    ["지우", "지우가", "지우는", "지우를"],
    ["준호", "준호가", "준호는", "준호를"],
    ["예린", "예린이", "예린은", "예린을"],
  ])("%s subject, topic and object particles", (name, subject, topic, object) => {
    const people = { personA: name, personB: name };
    expect(renderCompatibilityTitle("{{A:subject}} / {{B:subject}}", people)).toBe(`${subject} / ${subject}`);
    expect(renderCompatibilityTitle("{{A:topic}} / {{B:topic}}", people)).toBe(`${topic} / ${topic}`);
    expect(renderCompatibilityTitle("{{A:object}} / {{B:object}}", people)).toBe(`${object} / ${object}`);
  });
  it.each(["Alex", "Bobby", "A&B", "Zoë", "예린☆", "김 예린", "$&", "{{B}}", "예린)", "Alex2"])("%s keeps literal spelling without pronunciation guesses or recursive replacement", name => {
    expect(renderCompatibilityTitle("{{A}} / {{A:subject}} / {{A:topic}} / {{A:object}}", { personA: name, personB: "지우" }))
      .toBe(`${name} / ${name}님이 / ${name}님은 / ${name}님을`);
  });
  it("English words, professional terms and unmarked roles are never slots", () => {
    const title = "MBTI ABC A/B API A→B B→A {{A}} / {{B}}";
    expect(renderCompatibilityTitle(title, { personA: "Bobby", personB: "지우" }))
      .toBe("MBTI ABC A/B API A→B B→A Bobby / 지우");
  });
  it("all declared paragraph templates retain the canonical purpose and use explicit display slots", () => {
    for (const c of COMPATIBILITY_READER_CHAPTERS) for (const p of c.paragraphs) {
      expect(p.titleTemplate).not.toMatch(/\b[AB](?:가|는|의|에게)/u);
      expect(renderCompatibilityTitle(p.titleTemplate, { personA: "예린", personB: "지우" })).not.toMatch(/\{\{[AB]/u);
    }
    expect(COMPATIBILITY_READER_CHAPTERS[0].paragraphs[2].purpose).toBe("MBTI가 보여주는 우리");
    expect(COMPATIBILITY_READER_CHAPTERS[1].paragraphs[1].purpose).toBe("A가 관계에서 중요하게 여기는 것");
  });
});
