import type {
  EarthlyBranch,
  FiveElement,
  HeavenlyStem,
  TenGod,
} from "./annualFortuneTypes";
import type { ProductBridgeEvidencePacket } from "./bridge/types";
import type { UserContextProfile } from "./userContextTypes";

export type CareerReportProductType = "career_money_study";

export type WorkStyleArchetype =
  | "operator_planner"
  | "builder_executor"
  | "specialist_researcher"
  | "sales_networker"
  | "creator_expression"
  | "manager_controller"
  | "independent_freelancer"
  | "system_architect";

export type MoneyStyleArchetype =
  | "salary_stability"
  | "contract_project_income"
  | "business_trade_income"
  | "asset_accumulation"
  | "high_risk_high_volatility"
  | "cost_control_first"
  | "side_income_builder";

export type InvestmentStyleArchetype =
  | "long_term_accumulation"
  | "blue_chip_monthly_dca"
  | "index_diversification"
  | "real_asset_preference"
  | "active_trading_caution"
  | "cashflow_first"
  | "avoid_leverage";

export type StudyStyleArchetype =
  | "certificate_based"
  | "portfolio_based"
  | "practice_repetition"
  | "deep_research"
  | "structured_curriculum"
  | "mentor_feedback"
  | "avoid_cramming";

export interface CareerSignal {
  readonly type:
    | "career_fit"
    | "career_risk"
    | "money_opportunity"
    | "money_risk"
    | "study_fit"
    | "study_risk"
    | "mbti_fit"
    | "myeongli_fit"
    | "timing_hint";
  readonly strength: "low" | "medium" | "high";
  readonly title: string;
  readonly plain: string;
}

export type CareerReportPillarKey = "year" | "month" | "day" | "hour";

export interface CareerReportManseRyeokPillarDetail {
  readonly columnId: CareerReportPillarKey;
  readonly pillar: string;
  readonly heavenlyStem: HeavenlyStem;
  readonly earthlyBranch: EarthlyBranch;
  readonly tenGod: readonly string[];
  readonly hiddenStems: readonly string[];
  readonly twelveLifeStage: readonly string[];
  readonly twelveSinsal: readonly string[];
  readonly sinsal: readonly string[];
  readonly gwiin: readonly string[];
  readonly interactions: readonly string[];
}

export interface CareerReportEvidencePacket {
  readonly productType: CareerReportProductType;
  readonly productVersion: "v1";
  readonly personLabel: string;
  readonly userContext: UserContextProfile;
  readonly dayMaster: HeavenlyStem;
  readonly userPillars: {
    readonly year: string;
    readonly month: string;
    readonly day: string;
    readonly hour?: string;
  };
  readonly manseRyeokPillars?: readonly CareerReportManseRyeokPillarDetail[];
  readonly natalLabels: readonly string[];
  readonly mbtiType?: string | null;
  readonly myeongliCareerBasis: {
    readonly dayMasterPlain: string;
    readonly dominantElements: readonly FiveElement[];
    readonly missingElements: readonly FiveElement[];
    readonly heavyElements: readonly FiveElement[];
    readonly tenGodFocus: readonly TenGod[];
    readonly careerPlain: string;
    readonly moneyPlain: string;
    readonly studyPlain: string;
  };
  readonly mbtiCareerBasis: {
    readonly type: string | null;
    readonly workStylePlain: string;
    readonly strengthPlain: string;
    readonly riskPlain: string;
    readonly moneyBehaviorPlain: string;
    readonly studyPlain: string;
  };
  readonly combinedCareerProfile: {
    readonly headline: string;
    readonly plain: string;
    readonly workStyleArchetypes: readonly WorkStyleArchetype[];
    readonly moneyStyleArchetypes: readonly MoneyStyleArchetype[];
    readonly investmentStyleArchetypes: readonly InvestmentStyleArchetype[];
    readonly studyStyleArchetypes: readonly StudyStyleArchetype[];
  };
  readonly recommendedJobs: readonly {
    readonly title: string;
    readonly fit: "high" | "medium" | "low";
    readonly reason: string;
    readonly caution: string;
  }[];
  readonly careerPaths: readonly {
    readonly label: string;
    readonly fit: "high" | "medium" | "low";
    readonly plain: string;
    readonly examples: readonly string[];
    readonly risk: string;
  }[];
  readonly moneyStrategies: readonly {
    readonly label: string;
    readonly fit: "high" | "medium" | "low";
    readonly plain: string;
    readonly push: readonly string[];
    readonly avoid: readonly string[];
  }[];
  readonly investmentProfile: {
    readonly headline: string;
    readonly preferred: readonly InvestmentStyleArchetype[];
    readonly plain: string;
    readonly suitablePatterns: readonly string[];
    readonly cautionPatterns: readonly string[];
    readonly disclaimer: string;
  };
  readonly studyCertificateStrategy: {
    readonly headline: string;
    readonly plain: string;
    readonly recommendedFields: readonly string[];
    readonly recommendedMethods: readonly string[];
    readonly avoidMethods: readonly string[];
  };
  readonly workRiskWarnings: readonly CareerSignal[];
  readonly opportunitySignals: readonly CareerSignal[];
  readonly timingHints: readonly CareerSignal[];
  readonly bridgeEvidence: ProductBridgeEvidencePacket;
  readonly safetyNotes: readonly string[];
}

export type CareerReportPillars = CareerReportEvidencePacket["userPillars"];

export type CareerReportFixturePerson = {
  readonly label: string;
  readonly birthDate?: string;
  readonly birthTime?: string;
  readonly gender?: string;
  readonly mbti?: string | null;
  readonly userContext: UserContextProfile;
  readonly pillars: CareerReportPillars;
  readonly labels: readonly string[];
};

export type CareerReportFixture = {
  readonly id: string;
  readonly person: CareerReportFixturePerson;
};

export type CareerReportBranchReference = {
  readonly branch: EarthlyBranch;
  readonly plain: string;
};
