import { buildComprehensiveReportEvidencePacket } from "./comprehensiveReportEvidenceBuilder";
import type { ComprehensiveReportEvidencePacket } from "./comprehensiveReportEvidenceTypes";
import type { MbtiType } from "./mbtiKnowledgeTypes";
import {
  mapComputedSajuFactsToKnowledgeEntryIds,
  type MappedSajuKnowledgeInput,
} from "./sajuComputedFactsMapper";
import type { ComputedSajuFacts } from "./sajuComputedFactsTypes";

export function buildComprehensiveReportEvidencePacketFromComputedFacts(input: {
  readonly mbtiType: MbtiType;
  readonly sajuFacts: ComputedSajuFacts;
}): {
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly mappedSaju: MappedSajuKnowledgeInput;
} {
  const mappedSaju = mapComputedSajuFactsToKnowledgeEntryIds(input.sajuFacts);
  const packet = buildComprehensiveReportEvidencePacket({
    mbtiType: input.mbtiType,
    sajuEntryIds: mappedSaju.sajuEntryIds,
  });

  return {
    packet: {
      ...packet,
      globalWarnings: [...packet.globalWarnings, ...mappedSaju.warnings],
    },
    mappedSaju,
  };
}
