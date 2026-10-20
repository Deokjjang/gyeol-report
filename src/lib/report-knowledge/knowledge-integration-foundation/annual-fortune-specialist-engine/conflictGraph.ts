import type { AnnualDiagnostic, AnnualResult, RelationCheck, TransitCheck } from "./types";
/** Machine-checkable exclusions are kept separate from unresolved meaning pairs.
 * A temporal/producer hold is a verified guard, not a semantic contradiction. */
export function annualStructuralConflicts(diagnostics: readonly AnnualDiagnostic[], relations: readonly RelationCheck[], transit: readonly TransitCheck[]): AnnualResult["structuralConflicts"] {
 const rows: AnnualResult["structuralConflicts"] = [];
 for (const r of relations) if (r.state === "WITHHELD") rows.push({ subject: r.originalEvidenceId, kind: r.reasons.some(r=>/DAYUN|TRANSITION|CONDITIONAL/.test(r)) ? "UNKNOWN_TRANSITION" : "MISSING_PARTICIPANT_OR_SCOPE", reasons: r.reasons, state: "VERIFIED_STRUCTURAL_BLOCK" });
 for (const t of transit) if (t.state === "WITHHELD") rows.push({ subject: t.originalEvidenceId, kind: "UNSUPPORTED_TRANSIT_OR_ANCESTRY", reasons: t.reasons, state: "VERIFIED_STRUCTURAL_BLOCK" });
 for (const d of diagnostics) for (const gate of d.receipt.allTwelveGateResults) if (gate.state === "FAIL") rows.push({ subject: d.catalogKey, kind: gate.gate === "ALL_ANCESTOR_DOMAINS" ? "MISSING_SOURCE_ANCESTRY_OR_DOMAIN" : gate.gate, reasons: gate.reasons, state: "VERIFIED_STRUCTURAL_BLOCK" });
 return rows.sort((a,b)=>a.subject.localeCompare(b.subject,"en")||a.kind.localeCompare(b.kind,"en"));
}
