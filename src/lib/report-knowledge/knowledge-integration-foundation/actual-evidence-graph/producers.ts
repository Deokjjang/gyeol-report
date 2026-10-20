import type { V4RuntimeEvidence } from "../../../interpretation-v4/runtimeProjection";
import { buildIntegratedMyeongliProfile } from "../../../interpretation-v4/foundationIntegratedProfile";
import { buildMbtiSemanticProfile } from "../../../interpretation-v4/mbtiSemanticProfile";
import { buildMyeongliMbtiFusion } from "../../../interpretation-v4/fusionSemanticProfile";
import type { ActualProfiles } from "./types";
/** The persisted packet omits the full semantic profiles. Reproject those exact
 * existing producers from the same stored calculation; never recalculate birth
 * calendars, invoke a writer, or alter the packet. The caller may supply captured
 * profiles instead. These outputs are observations, not customer claims. */
export function observeActualProfiles(e: V4RuntimeEvidence) {
  const profiles: Partial<Record<"person" | "personA" | "personB", ActualProfiles>> = {};
  const failures: string[] = [];
  const slots = e.input.kind === "compatibility" ? ["personA", "personB"] as const : ["person"] as const;
  for (const slot of slots) {
    const person = e.input.kind === "compatibility" ? e.input[slot as "personA" | "personB"] : e.input.person;
    const m = buildIntegratedMyeongliProfile(e.calculations[slot]), b = buildMbtiSemanticProfile(person.mbtiType || null);
    if (!m.ok || !b.ok) { failures.push(`MISSING_PRODUCER_OUTPUT:${slot}`); continue; }
    const f = buildMyeongliMbtiFusion(m.value, b.value);
    if (!f.ok) { failures.push(`MISSING_FUSION_ROOT:${slot}`); continue; }
    profiles[slot] = { myeongli: m.value, mbti: b.value, fusion: f.value };
  }
  return { profiles, failures, birthCalendarRecalculations: 0 as const, mode: "EXISTING_PROFILE_REPROJECTION_FROM_SAME_CALCULATION" as const };
}
