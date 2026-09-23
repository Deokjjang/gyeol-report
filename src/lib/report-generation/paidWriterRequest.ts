import { buildOpenAIComprehensiveReportWriterMessages } from "./openaiReportWriterPrompt";
import { withComprehensiveWriterValidationContract } from "./openaiComprehensiveReportWriter";
import { buildOpenAICareerReportWriterMessages } from "./openaiCareerReportWriterPrompt";
import { buildOpenAILoveMarriageChildReportWriterMessages } from "./openaiLoveMarriageChildReportWriterPrompt";
import { buildOpenAICompatibilityReportWriterMessages } from "./openaiCompatibilityReportWriterPrompt";
import { buildOpenAIMajorFortuneReportWriterMessages } from "./openaiMajorFortuneReportWriterPrompt";
import { buildOpenAIAnnualFortuneReportWriterMessages } from "./openaiAnnualFortuneReportWriterPrompt";
import { openAIComprehensiveReportV2NarrativeDraftJsonSchema } from "./comprehensiveReportDraftSchema";
import { careerReportDraftJsonSchema } from "./careerReportDraftTypes";
import { loveMarriageChildReportDraftJsonSchema } from "./openaiLoveMarriageChildReportWriter";
import { compatibilityReportDraftJsonSchema } from "./compatibilityReportDraftSchema";
import { majorFortuneReportDraftJsonSchema } from "./majorFortuneReportDraftTypes";
import { annualFortuneReportDraftJsonSchema } from "./annualFortuneReportDraftTypes";
import type { ProductGenerationSuccessResult } from "./productGenerationDispatcher";
import type { WriterProduct } from "./reportWriterCallGuard";

// Use the existing product prompts/schemas, with the EXACT packet that already
// produced a publishable fallback. No second calculation or moving runtime clock.
export function buildPaidWriterRequest(prepared: ProductGenerationSuccessResult, userDisplayName?: string) {
  const packet = prepared.evidencePacket;
  switch (prepared.kind) {
    case "comprehensiveV2": {
      const evidencePacket = packet as Parameters<typeof buildOpenAIComprehensiveReportWriterMessages>[0]["evidencePacket"];
      return { product: "comprehensive" as WriterProduct, jsonSchema: openAIComprehensiveReportV2NarrativeDraftJsonSchema,
        messages: withComprehensiveWriterValidationContract(buildOpenAIComprehensiveReportWriterMessages({ evidencePacket, mbtiType: evidencePacket.mbtiType, userDisplayName })) };
    }
    case "careerMoneyStudy": return { product: "career" as WriterProduct, jsonSchema: careerReportDraftJsonSchema,
      messages: buildOpenAICareerReportWriterMessages({ evidencePacket: packet as Parameters<typeof buildOpenAICareerReportWriterMessages>[0]["evidencePacket"] }) };
    case "loveMarriageChild": return { product: "love" as WriterProduct, jsonSchema: loveMarriageChildReportDraftJsonSchema,
      messages: buildOpenAILoveMarriageChildReportWriterMessages({ evidencePacket: packet as Parameters<typeof buildOpenAILoveMarriageChildReportWriterMessages>[0]["evidencePacket"] }) };
    case "compatibility": return { product: "compatibility" as WriterProduct, jsonSchema: compatibilityReportDraftJsonSchema,
      messages: buildOpenAICompatibilityReportWriterMessages({ evidencePacket: packet as Parameters<typeof buildOpenAICompatibilityReportWriterMessages>[0]["evidencePacket"] }) };
    case "majorFortune": return { product: "major" as WriterProduct, jsonSchema: majorFortuneReportDraftJsonSchema,
      messages: buildOpenAIMajorFortuneReportWriterMessages({ evidencePacket: packet as Parameters<typeof buildOpenAIMajorFortuneReportWriterMessages>[0]["evidencePacket"] }) };
    case "annualFortune": return { product: "annual" as WriterProduct, jsonSchema: annualFortuneReportDraftJsonSchema,
      messages: buildOpenAIAnnualFortuneReportWriterMessages({ evidencePacket: packet as Parameters<typeof buildOpenAIAnnualFortuneReportWriterMessages>[0]["evidencePacket"] }) };
  }
}
