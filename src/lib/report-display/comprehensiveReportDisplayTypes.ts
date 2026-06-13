import type { MbtiType } from "../report-knowledge/mbtiKnowledgeTypes";
import type { FiveElement, TenGod } from "../report-knowledge/sajuKnowledgeTypes";

export type SajuSummaryCard = {
  readonly dayMaster: {
    readonly label: string;
    readonly description: string;
  };
  readonly dayPillar: {
    readonly label: string;
    readonly image: string;
  };
  readonly fiveElements: {
    readonly counts: Record<FiveElement, number>;
    readonly excessive: readonly FiveElement[];
    readonly missing: readonly FiveElement[];
    readonly useful?: readonly FiveElement[];
  };
  readonly tenGods: {
    readonly primary: readonly {
      readonly id: TenGod;
      readonly labelKo: string;
      readonly strength: string;
    }[];
  };
  readonly specialPatterns: readonly string[];
  readonly sinsal: readonly string[];
  readonly gwiin: readonly string[];
};

export type MbtiSummaryCard = {
  readonly type: MbtiType;
  readonly labelKo: string;
  readonly commonAliasKo: string;
  readonly functionStack: readonly string[];
  readonly coreTraits: readonly string[];
  readonly reportUsage: readonly string[];
};

export type ComprehensiveReportDisplayData = {
  readonly sajuCard: SajuSummaryCard;
  readonly mbtiCard: MbtiSummaryCard;
};
