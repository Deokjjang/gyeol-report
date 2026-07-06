import type {
  EarthlyBranch,
  FiveElement,
  HeavenlyStem,
  TenGod,
  YinYang,
} from "./annualFortuneTypes";
import type { ProductBridgeEvidencePacket } from "./bridge/types";
import type { UserContextProfile } from "./userContextTypes";

export type MajorFortuneCycleBasis =
  | "manse_engine_major_fortune_table"
  | "user_supplied_major_fortune_table"
  | "fixture_precomputed_for_dev_only";

export interface MajorFortuneCycle {
  readonly index: number;
  readonly startAge: number;
  readonly endAge: number;
  readonly startYear: number;
  readonly endYear: number;
  readonly stem: HeavenlyStem;
  readonly branch: EarthlyBranch;
  readonly ganji: string;
  readonly stemElement: FiveElement;
  readonly branchElement: FiveElement;
  readonly stemYinYang: YinYang;
  readonly branchYinYang: YinYang;
}

export interface MajorFortuneCycleAccess {
  readonly currentAge: number;
  readonly currentYear: number;
  readonly currentCycle: MajorFortuneCycle;
  readonly previousCycle?: MajorFortuneCycle;
  readonly nextCycle?: MajorFortuneCycle;
}

export interface MajorFortuneSignal {
  readonly type:
    | "career_shift"
    | "money_responsibility"
    | "relationship_restructure"
    | "family_role"
    | "study_certificate"
    | "health_rhythm"
    | "identity_change"
    | "stability"
    | "movement";
  readonly strength: "low" | "medium" | "high";
  readonly plain: string;
}

export type MajorFortuneDomainFlowKey =
  | "careerWork"
  | "moneyResource"
  | "relationshipLove"
  | "healthRoutine"
  | "socialFamily"
  | "studyGrowth";

export interface MajorFortuneEvidencePacket {
  readonly productType: "major_fortune";
  readonly productVersion: "v1";
  readonly personLabel: string;
  readonly personContext: {
    readonly name: string;
    readonly birthDate?: string;
    readonly gender?: string;
    readonly mbtiType?: string | null;
    readonly currentYear: number;
    readonly currentAge: number;
    readonly userContext: UserContextProfile;
  };
  readonly userContext: UserContextProfile;
  readonly currentYear: number;
  readonly currentAge: number;
  readonly dayMaster: HeavenlyStem;
  readonly baseSaju: {
    readonly dayMaster: HeavenlyStem;
    readonly pillars: {
      readonly year: string;
      readonly month: string;
      readonly day: string;
      readonly hour?: string;
    };
    readonly natalLabels: readonly string[];
  };
  readonly mbtiBasis: {
    readonly type: string | null;
    readonly titleKo: string | null;
    readonly archetype: string | null;
    readonly summary: string;
    readonly coreTraits: readonly string[];
    readonly stressPattern: string;
    readonly decisionPattern: string;
    readonly workPattern: string;
    readonly relationshipPattern: string;
    readonly growthPattern: string;
    readonly reportUseCase: "daeunReport";
    readonly reportUseCases: readonly string[];
  };
  readonly bridgeEvidence?: ProductBridgeEvidencePacket;
  readonly userPillars: {
    readonly year: string;
    readonly month: string;
    readonly day: string;
    readonly hour?: string;
  };
  readonly natalLabels: readonly string[];
  readonly currentCycle: MajorFortuneCycle;
  readonly previousCycle?: MajorFortuneCycle;
  readonly nextCycle?: MajorFortuneCycle;
  readonly majorCycleBasis: {
    readonly basisType: MajorFortuneCycleBasis;
    readonly displayLabel: string;
    readonly explanation: string;
  };
  readonly cyclePosition: {
    readonly cycleIndex: number;
    readonly yearIndexInCycle: number;
    readonly positionLabel: string;
    readonly progressLabel: string;
  };
  readonly calculationBasis: {
    readonly basisType: MajorFortuneCycleBasis;
    readonly displayLabel: string;
    readonly explanation: string;
    readonly ageBasisLabel: string;
    readonly note: string;
  };
  readonly currentMajorFortune: {
    readonly cycleIndex: number;
    readonly ageRange: string;
    readonly yearRange: string;
    readonly ganji: string;
    readonly stem: HeavenlyStem;
    readonly branch: EarthlyBranch;
    readonly stemTenGod: TenGod;
    readonly branchTenGod: TenGod;
    readonly elementFocus: readonly FiveElement[];
    readonly keyTheme: string;
    readonly supportSignals: readonly string[];
    readonly frictionSignals: readonly string[];
    readonly interpretation: string;
  };
  readonly majorFortuneTimeline: readonly {
    readonly cycleIndex: number;
    readonly ageRange: string;
    readonly yearRange: string;
    readonly ganji: string;
    readonly stem: HeavenlyStem;
    readonly branch: EarthlyBranch;
    readonly stemTenGod: TenGod;
    readonly branchTenGod: TenGod;
    readonly elementFocus: readonly FiveElement[];
    readonly isCurrent: boolean;
    readonly supportSignals: readonly string[];
    readonly cautionSignals: readonly string[];
    readonly shortInterpretation: string;
  }[];
  readonly currentAnnualCross: {
    readonly selectedYear: number;
    readonly annualGanji: string;
    readonly annualStemTenGod: TenGod;
    readonly annualBranchTenGod: TenGod;
    readonly cycleToAnnualRelation: string;
    readonly natalToAnnualRelation: string;
    readonly annualFocus: string;
    readonly interpretation: string;
    readonly caution: string;
  };
  readonly tenYearFlowSummary: {
    readonly headline: string;
    readonly summary: string;
    readonly keySignals: readonly string[];
  };
  readonly domainFlows: Record<
    MajorFortuneDomainFlowKey,
    {
      readonly title: string;
      readonly summary: string;
      readonly supportingSignals: readonly string[];
      readonly frictionSignals: readonly string[];
      readonly actionHint: string;
    }
  >;
  readonly riskPatterns: readonly {
    readonly title: string;
    readonly summary: string;
    readonly evidence: readonly string[];
    readonly prevention: string;
  }[];
  readonly actionGuides: readonly {
    readonly title: string;
    readonly action: string;
    readonly timingHint: string;
  }[];
  readonly safetyNotes: readonly string[];
  readonly majorTenGod: {
    readonly stemTenGod: TenGod;
    readonly plain: string;
  };
  readonly elementEffect: {
    readonly strengthens: readonly FiveElement[];
    readonly fillsMissing: readonly FiveElement[];
    readonly overloadsHeavy: readonly FiveElement[];
    readonly plain: string;
  };
  readonly branchInteractions: readonly {
    readonly type: "충" | "육합" | "삼합" | "반합" | "해" | "형" | "파";
    readonly branches: readonly EarthlyBranch[];
    readonly affectedPillars?: readonly ("year" | "month" | "day" | "hour")[];
    readonly plain: string;
  }[];
  readonly lifeAreaSignals: readonly MajorFortuneSignal[];
  readonly difficultySignals: readonly MajorFortuneSignal[];
  readonly opportunitySignals: readonly MajorFortuneSignal[];
  readonly transitionSignals: readonly {
    readonly type: "previous_to_current" | "current_to_next";
    readonly plain: string;
  }[];
  readonly previousToCurrentShift: {
    readonly previousGanji?: string;
    readonly currentGanji: string;
    readonly plain: string;
    readonly whatChanged: readonly string[];
  };
  readonly decadeArchetype: {
    readonly label: string;
    readonly metaphor: string;
    readonly plain: string;
  };
  readonly strategicThemes: readonly {
    readonly label: string;
    readonly metaphor: string;
    readonly plain: string;
    readonly concreteImplications: readonly string[];
    readonly strategy: string;
  }[];
  readonly longRangeRisks: readonly {
    readonly label: string;
    readonly plain: string;
    readonly prevention: string;
  }[];
  readonly longRangeOpportunities: readonly {
    readonly label: string;
    readonly plain: string;
    readonly action: string;
  }[];
  readonly relationshipStatusTranslationHints: readonly string[];
  readonly lifeStageContext: {
    readonly label: string;
    readonly relevantThemes: readonly string[];
    readonly suppressedThemes: readonly string[];
    readonly plain: string;
  };
  readonly myeongliLayers: {
    readonly tenGodLayer: {
      readonly majorStemTenGod: string;
      readonly annualStemTenGodsInCycle: readonly {
        readonly year: number;
        readonly stem: string;
        readonly tenGod: string;
        readonly plain: string;
      }[];
      readonly plain: string;
    };
    readonly elementLayer: {
      readonly majorElements: readonly string[];
      readonly fillMissing: readonly string[];
      readonly overloadHeavy: readonly string[];
      readonly plain: string;
    };
    readonly branchInteractionLayer: {
      readonly interactions: readonly {
        readonly year?: number;
        readonly type:
          | "충"
          | "육합"
          | "삼합"
          | "반합"
          | "형"
          | "파"
          | "해"
          | "원진"
          | "귀문";
        readonly plainType: string;
        readonly plain: string;
        readonly impactArea:
          | "work"
          | "money"
          | "relationship"
          | "love_family"
          | "study"
          | "health"
          | "identity";
      }[];
      readonly plain: string;
    };
    readonly hiddenStemLayer: {
      readonly majorBranchHiddenStems: readonly string[];
      readonly plain: string;
    };
    readonly twelveStageLayer: {
      readonly label: string;
      readonly plain: string;
    } | null;
    readonly auxiliaryStarsLayer: readonly {
      readonly label: string;
      readonly plain: string;
      readonly caution?: string | null;
    }[];
  };
  readonly strongYearsWithinCycle: readonly {
    readonly year: number;
    readonly ganji: string;
    readonly reason: string;
    readonly area: string;
    readonly action: string;
    readonly headline: string;
    readonly whyStrong: string;
    readonly likelyArea:
      | "일·성과"
      | "돈·외부기회"
      | "돈·현실관리"
      | "관계"
      | "연애·가족"
      | "몸·생활"
      | "학업·자격증"
      | "전환";
    readonly pushStrategy: string;
    readonly reduceStrategy: string;
  }[];
  readonly majorFortuneTimelineRows: readonly {
    readonly year: number;
    readonly ageLabel: string | null;
    readonly ageBasisLabel: string | null;
    readonly yearIndexInCycle: number;
    readonly phase: "early" | "middle" | "late";
    readonly isCurrentYear: boolean;
    readonly isCycleStartYear: boolean;
    readonly isCycleEndYear: boolean;
    readonly badges: readonly ("올해" | "전환" | "강함" | "주의" | "정리")[];
    readonly majorGanji: string;
    readonly annualGanji: string;
    readonly annualTenGodLabel: string;
    readonly keyInteractionLabel: string | null;
    readonly oneLine: string;
    readonly strategy: string;
  }[];
  readonly cycleYearTimeline: readonly {
    readonly year: number;
    readonly ganji: string;
    readonly yearIndexInCycle: number;
    readonly phase: "early" | "middle" | "late";
    readonly headline: string;
    readonly annualElementFocus: string;
    readonly roleOfYearInCycle: string;
    readonly plainInterpretation: string;
    readonly strategicFocus: string;
    readonly whyItMatters: string;
  }[];
  readonly warnings: readonly string[];
}
