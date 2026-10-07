import "server-only";
import { normalizeReportInputPayload } from "../report-generation/reportInputAdapter";
import { JOB_STATUSES, RELATIONSHIP_STATUSES } from "../report-generation/reportInputTypes";
import { isRecord } from "../report-generation/productPublishGate";
import { buildComprehensiveV2EvidenceFromGenerationInput } from "../report-generation/comprehensiveV2GenerationHandler";
import { calculateCareerSaju } from "../report-generation/careerMoneyStudyGenerationHandler";
import { calculateLoveMarriageChildSaju } from "../report-generation/loveMarriageChildGenerationHandler";
import { calculateCompatibilitySaju } from "../report-generation/compatibilityGenerationHandler";
import { buildCanonicalNatalTable, type CanonicalNatalTableEvidence } from "../report-knowledge/natalTableEvidence";
import type { SajuCalcResult } from "../saju/types";
import { buildMbtiCommonProfileTableData } from "../report-tables/mbtiProfileTableData";
import { getMbtiSourceByType } from "../report-tables/mbtiSourceRegistry";
import type { MbtiCommonProfileTableData } from "../report-tables/types";
import type { ProductGenerationResult } from "../report-generation/productGenerationDispatcher";
import { runPaidReportJob, type ProductGenerator } from "../payment/paidReportReliability";
import type { ReliabilityStore } from "../payment/paidReportReliabilityStore";
import { getAnnualPurchasePolicyDate } from "../payment/annualPurchasePolicy";
import { buildV4ComprehensiveProduct } from "./comprehensiveProductAdapter";
import { buildV4CareerProduct } from "./careerProductAdapter";
import { buildV4LoveProduct } from "./loveProductAdapter";
import { buildV4CompatibilityProduct } from "./compatibilityProductAdapter";
import { buildV4MajorProduct } from "./majorProductAdapter";
import { buildV4AnnualProduct } from "./annualProductAdapter";
import { projectV4Composition, validateV4Publication, v4Digest, type V4Composition, type V4RuntimeEvidence } from "./runtimeProjection";
import type { NarrativeInput } from "./narrativeTypes";

export type V4ShadowClock = { readonly evaluatedAt: string; readonly policyDate?: string };
const disabledWriter = { enabled: false as const, reason: "flag_disabled" as const };
const failure = (code: string): ProductGenerationResult => ({ ok: false, externalCalls: [], error: { code: "INVALID_REPORT_INPUT", message: code, validationErrors: [code] } });

/** Deliberately not imported by any route, public dispatcher, worker or action.
 * No flag, env var, browser state or payload property activates this adapter. */
export async function generateV4ShadowReport(payload: unknown, clock: V4ShadowClock): Promise<ProductGenerationResult> {
  if (!clock || !/T.*(?:Z|[+-]\d\d:\d\d)$/.test(clock.evaluatedAt) || !Number.isFinite(Date.parse(clock.evaluatedAt)) ||
    clock.policyDate && !Number.isFinite(Date.parse(clock.policyDate))) return failure("V4_EXPLICIT_CLOCK_REQUIRED");
  // The legacy normalizer tolerates unknown context strings. Shadow generation
  // is fail-closed without changing that legacy input behavior.
  if (isRecord(payload) && payload.productKey !== "saju_mbti_compatibility" && payload.productKey !== "saju_mbti_full") {
    const c = payload.userContext;
    if (!isRecord(c) || !JOB_STATUSES.includes(c.jobStatus as never) || !RELATIONSHIP_STATUSES.includes(c.relationshipStatus as never) ||
      typeof c.detailJob !== "string" || c.detailJob.length > 200) return failure("V4_CONTEXT_INVALID");
  }
  try {
    const normalized = normalizeReportInputPayload(payload, { now: () => new Date(clock.policyDate ?? clock.evaluatedAt) });
    if (!normalized.ok) return failure(normalized.error);
    const input = normalized.value, calculations: Record<string, SajuCalcResult> = {};
    let composition: V4Composition;
    if (input.kind === "compatibility") {
      const pairCalculations = { personA: calculateCompatibilitySaju(input.personA), personB: calculateCompatibilitySaju(input.personB) };
      const result = buildV4CompatibilityProduct(payload, pairCalculations);
      if (!result.ok) return failure("V4_COMPATIBILITY_GENERATION_FAILED");
      composition = { product: "saju_mbti_compatibility", result };
      calculations.personA = pairCalculations.personA;
      calculations.personB = pairCalculations.personB;
    } else if (input.kind === "majorFortune") {
      const result = await buildV4MajorProduct(payload, clock.evaluatedAt);
      if (!result.ok) return failure("V4_MAJOR_GENERATION_FAILED");
      composition = { product: "major_fortune", result }; calculations.person = result.evidence.calculation;
    } else if (input.kind === "annualFortune") {
      const result = await buildV4AnnualProduct(payload, { currentDate: clock.evaluatedAt, ...(clock.policyDate ? { policyDate: clock.policyDate } : {}) });
      if (!result.ok) return failure("V4_ANNUAL_GENERATION_FAILED");
      composition = { product: "annual_fortune", result }; calculations.person = result.evidence.calculation;
    } else {
      const calculation = input.kind === "comprehensiveV2" ? buildComprehensiveV2EvidenceFromGenerationInput(input).calculation
        : input.kind === "careerMoneyStudy" ? calculateCareerSaju(input.person) : calculateLoveMarriageChildSaju(input.person);
      calculations.person = calculation;
      const narrativeInput: NarrativeInput = { calculation, name: input.person.name, mbti: input.person.mbtiType,
        context: { jobStatus: input.userContext.jobStatus, detailJob: input.userContext.detailJob, relationshipStatus: input.userContext.relationshipStatus } };
      if (input.kind === "comprehensiveV2") {
        const result = buildV4ComprehensiveProduct(narrativeInput);
        if (!result.ok) return failure(result.errors.join(";"));
        composition = { product: "saju_mbti_full", result };
      } else if (input.kind === "careerMoneyStudy") {
        const result = buildV4CareerProduct(narrativeInput);
        if (!result.ok) return failure("V4_CAREER_GENERATION_FAILED");
        composition = { product: "career_money_study", result };
      } else {
        const result = buildV4LoveProduct(narrativeInput);
        if (!result.ok) return failure("V4_LOVE_GENERATION_FAILED");
        composition = { product: "love_marriage_child", result };
      }
    }
    const natalTableEvidence: Record<string, CanonicalNatalTableEvidence> = {};
    const mbtiTables: Record<string, MbtiCommonProfileTableData | null> = {};
    for (const [slot, calc] of Object.entries(calculations)) {
      const table = calc.birthTimeContext && buildCanonicalNatalTable(calc.birthTimeContext);
      if (!table) return failure("V4_NATAL_TABLE_REQUIRED");
      natalTableEvidence[slot] = table;
      const person = input.kind === "compatibility" ? input[slot as "personA" | "personB"] : input.person;
      const source = getMbtiSourceByType(person.mbtiType);
      mbtiTables[slot] = source ? buildMbtiCommonProfileTableData(source) : null;
    }
    // Normalize once to exactly the JSON representation persisted by the worker.
    const body = JSON.parse(JSON.stringify({ version: "v4-runtime-evidence-1", mode: "shadow", productType: input.productKey,
      generatedAt: clock.evaluatedAt, input, composition, calculations, natalTableEvidence, mbtiTables })) as Omit<V4RuntimeEvidence, "contentDigest">;
    const evidencePacket: V4RuntimeEvidence = { ...body, contentDigest: v4Digest(body) };
    const draft = projectV4Composition(composition), gate = validateV4Publication(input.productKey, draft, evidencePacket);
    if (!gate.ok) return { ok: false, externalCalls: [], error: { code: "INVALID_REPORT_INPUT", message: "V4_PUBLISH_REJECTED", validationErrors: gate.errors } };
    return { ok: true, kind: input.kind, draft, evidencePacket, externalCalls: [] };
  } catch { return failure("V4_GENERATION_EXCEPTION"); }
}

/** Reuses the exact durable claim/attempt/lease/annual acceptance/first-publish
 * worker. Caller MUST supply a local/mock store; never constructs a DB client. */
export async function runV4ShadowJob(localStore: ReliabilityStore, clock: V4ShadowClock) {
  const generate: ProductGenerator = async (payload, _runtime, _strategy, acceptance) => {
    const policy = acceptance && getAnnualPurchasePolicyDate(acceptance, payload);
    if (acceptance && !policy) return failure("ANNUAL_PURCHASE_CONTEXT_INVALID");
    return generateV4ShadowReport(payload, { evaluatedAt: clock.evaluatedAt, ...(policy ? { policyDate: policy.toISOString() } : {}) });
  };
  return runPaidReportJob(localStore, disabledWriter, generate, validateV4Publication);
}
