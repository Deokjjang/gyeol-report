import { expect } from "vitest";
import { integrateMyeongliFoundation, type MyeongliSemanticProfile } from "../../../src/lib/interpretation-v4/foundationIntegratedProfile";
import { SHINSAL_SEMANTICS } from "../../../src/lib/interpretation-v4/foundationShinsal";
import type { EvidenceAtom, FoundationSynthesisCandidate, SemanticSignature } from "../../../src/lib/interpretation-v4/semanticCore";
import { buildClaimProfile } from "../../../src/lib/interpretation-v4/claimProfile";
import type { MbtiSemanticProfile } from "../../../src/lib/interpretation-v4/mbtiSemanticProfile";
import { myAtom, realMbti, fuse } from "./fusionSemanticFixtures";

export function marker(key: keyof typeof SHINSAL_SEMANTICS): EvidenceAtom {
  const d = SHINSAL_SEMANTICS[key];
  return myAtom(`marker:${key}`, { ...d.axes }, { sourceType: d.sourceType, sourceKey: key, family: d.family, tier: "AMPLIFIER", strength: "MEDIUM", weight: .5,
    fortuneTags: { ...d.fortuneTags }, dynamicTags: [...d.dynamicTags], contexts: [...d.contexts] });
}
export function integrated(evidence: EvidenceAtom[], synthesisCandidates: FoundationSynthesisCandidate[] = []): MyeongliSemanticProfile {
  const r = integrateMyeongliFoundation({ evidence, synthesisCandidates });
  if (!r.ok) return expect.unreachable(JSON.stringify(r.diagnostics)); return r.value;
}
export function strong(axes: SemanticSignature, extras: EvidenceAtom[] = []) {
  return integrated([myAtom("core-a", axes, { family: "explicit:A" }), myAtom("core-b", axes, { family: "explicit:B" }), ...extras]);
}
export const wealth = () => myAtom("wealth", { RESOURCE_SENSE: 2, PRACTICALITY: 2, STABILITY: 1 }, { sourceKey: "正財", family: "WEALTH" });
export const officer = () => myAtom("officer", { DUTY: 2, STATUS_DRIVE: 2, LEADERSHIP: 1 }, { sourceKey: "正官", family: "OFFICER" });
export function withComposite(m: MyeongliSemanticProfile, theme = "WEALTH_AND_STATUS", axes: FoundationSynthesisCandidate["primaryAxes"] = ["RESOURCE_SENSE", "STATUS_DRIVE"]) {
  return integrated(m.evidence, [{ id: `explicit:composite:${theme}`, source: "TEN_GOD_FAMILY_PAIR", semanticTheme: theme, primaryAxes: axes,
    evidenceIds: m.evidence.filter(e => e.tier !== "AMPLIFIER").map(e => e.id), contexts: ["identity", "work", "money", "social"],
    strength: "MAIN", exclusivityGroup: "explicit-composite", priority: 50, humanDescription: "명시적 정규화 합성 fixture" }]);
}
export function claims(m: MyeongliSemanticProfile, b: MbtiSemanticProfile = realMbti(null)) {
  const r = buildClaimProfile(m, b, fuse(m, b)); if (!r.ok) return expect.unreachable(JSON.stringify(r.diagnostics.hardErrors)); return r.value;
}
export const claim = (m: MyeongliSemanticProfile, prefix: string, b?: MbtiSemanticProfile) => claims(m, b).candidates.find(c => c.id.startsWith(`${prefix}_`));

/** Independently specified positive semantic fixtures, not DOB or runtime mocks. */
export const CLAIM_SCENARIOS: [string, SemanticSignature, EvidenceAtom[]?][] = [
  ["M01", { RESOURCE_SENSE: 2, PRACTICALITY: 2 }], ["M02", { RESOURCE_SENSE: 2, STABILITY: 2 }],
  ["M03", { OPPORTUNITY_SENSE: 2, RESOURCE_SENSE: 1 }], ["M04", { OPPORTUNITY_SENSE: 2, EXPANSION: 2, AUTONOMY: 1, RESOURCE_SENSE: 2 }],
  ["M05", { STABILITY: 2, RESOURCE_SENSE: 2, DUTY: 1 }], ["M06", { EXPANSION: 2, RESOURCE_SENSE: 2, GOAL_DRIVE: 2 }],
  ["M07", { RESOURCE_SENSE: 2, MEANING: 2 }], ["M08", { RESOURCE_SENSE: 2, CREATION: 2 }, [wealth(), marker("JAEGO")]],
  ["M09", { OPPORTUNITY_SENSE: 2 }, [wealth()]], ["M10", { OPPORTUNITY_SENSE: 2, CHANGE_ORIENTATION: 2 }],
  ["S01", { LEADERSHIP: 2 }], ["S02", { LEADERSHIP: 2, DUTY: 2 }],
  ["S03", { STATUS_DRIVE: 2, LEADERSHIP: 2 }, [officer(), marker("BANAN")]],
  ["S04", { STATUS_DRIVE: 2 }, [officer(), marker("JANGSEONG")]],
  ["S05", { DUTY: 2, STATUS_DRIVE: 2, PRACTICALITY: 1 }, [officer()]],
  ["S06", { CHARISMA: 2, EXPRESSION: 1 }], ["S07", { STATUS_DRIVE: 2 }],
  ["S08", { RESOURCE_SENSE: 2, STATUS_DRIVE: 2, GOAL_DRIVE: 2 }, [wealth(), officer(), marker("BANAN")]],
  ["S09", { LEADERSHIP: 2 }, [marker("JANGSEONG"), marker("BANAN")]],
  ["SU01", { GOAL_DRIVE: 2, PERSISTENCE: 2 }], ["SU02", { EXPANSION: 2, GOAL_DRIVE: 1 }],
  ["SU03", { EXPANSION: 2, OPPORTUNITY_SENSE: 2, GOAL_DRIVE: 1 }], ["SU04", { DEPTH: 2, PRECISION: 2, LEARNING: 2 }],
  ["SU05", { LEADERSHIP: 2, STRUCTURE_STYLE: 2, DUTY: 2 }], ["SU06", { AUTONOMY: 2, OPPORTUNITY_SENSE: 2, RESOURCE_SENSE: 2, RISK_STYLE: 1 }],
  ["P01", { CARE: 2, SOCIAL_ATTUNEMENT: 2 }, [marker("CHEONEUL")]], ["P02", { CARE: 2, SOCIAL_ATTUNEMENT: 2 }],
  ["P03", { RELATION_STYLE: 2, OPPORTUNITY_SENSE: 2 }],
  ["A01", { CHARISMA: 2 }, [marker("DOHWA")]], ["A02", { CARE: 2 }, [marker("HONGYEOM")]],
  ["A03", { EXPRESSION: 2, CHARISMA: 2 }], ["A04", { ENERGY_DIRECTION: -2, DEPTH: 2, CHARISMA: 1 }],
  ["A05", { CHARISMA: 2 }, [marker("DOHWA")]],
  ["F01", { PERSISTENCE: 2, AUTONOMY: 2, BOUNDARY: 2 }], ["F02", { PRECISION: 2, COMMUNICATION_STYLE: 2 }],
  ["F03", { PRECISION: 2, STRUCTURE_STYLE: 2 }], ["F04", { GOAL_DRIVE: 2, DUTY: 2, PERSISTENCE: 2 }],
  ["F05", { DEPTH: 2, CURIOSITY: 2, ACTION_TEMPO: -1 }], ["F06", { ACTION_TEMPO: 2, DECISION_STYLE: 2 }],
  ["F07", { CARE: 2, DUTY: 2 }], ["F08", { OPPORTUNITY_SENSE: 2, ADAPTABILITY: 2 }],
];
