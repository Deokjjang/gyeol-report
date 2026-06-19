import type {
  EarthlyBranch,
  FiveElement,
  HeavenlyStem,
  TenGod,
  YinYang,
} from "./annualFortuneTypes";
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

export interface MajorFortuneEvidencePacket {
  readonly productType: "major_fortune";
  readonly productVersion: "v1";
  readonly personLabel: string;
  readonly userContext: UserContextProfile;
  readonly currentYear: number;
  readonly currentAge: number;
  readonly dayMaster: HeavenlyStem;
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
  readonly strongYearsWithinCycle: readonly {
    readonly year: number;
    readonly ganji: string;
    readonly reason: string;
    readonly area: string;
    readonly action: string;
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
