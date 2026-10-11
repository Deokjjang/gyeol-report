import { withKoreanParticle, type KoreanParticle } from "../report-knowledge/koreanCopyUtils";

/** Only explicit role tokens are display slots. A callback keeps names literal
 * and prevents a name containing another token from being replaced again. */
export function renderCompatibilityTitle(template: string, people: { personA: string; personB: string }): string {
  return template.replace(/\{\{([AB])(?::(subject|topic|object))?\}\}/g,
    (_, role: "A" | "B", kind?: KoreanParticle) => {
      const name = role === "A" ? people.personA : people.personB;
      if (!kind) return name;
      // Foreign or unusual spelling: attach the particle to 님, never guess pronunciation.
      return withKoreanParticle(/^[가-힣]+$/u.test(name) ? name : `${name}님`, kind);
    });
}
