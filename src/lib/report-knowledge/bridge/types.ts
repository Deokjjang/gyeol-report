import type {
  MbtiMyeongliBridgeHint,
  MbtiRelationshipPair,
  MbtiReportUseCaseKey,
  MbtiSourceProfile,
  MbtiSourceTraitItem,
  MbtiSourceType,
  MbtiTraitArea,
} from "../mbti";

export type BridgeProductContext =
  | "general"
  | "careerMoneyStudy"
  | "loveMarriageChild"
  | "compatibility"
  | "daeun"
  | "saeun";

export type MyeongliSignalKind =
  | "element"
  | "tenGod"
  | "shinsal"
  | "gwiin"
  | "interaction"
  | "pillar"
  | "fortuneCycle";

export type MyeongliSignal = {
  readonly id?: string;
  readonly kind: MyeongliSignalKind;
  readonly label: string;
  readonly value?: string;
  readonly evidence?: string;
  readonly weight?: number;
};

export type MyeongliMbtiBridgeIntensity = "low" | "medium" | "high";

export type MbtiTraitEvidence = {
  readonly area: MbtiTraitArea;
  readonly id: string | null;
  readonly label: string | null;
  readonly plainKo: string | null;
  readonly strongLine: string | null;
  readonly positiveUse: string | null;
  readonly risk: string | null;
  readonly matchingMyeongliSignals: readonly string[];
  readonly productDomains: readonly string[];
  readonly sourceCoverage: string | null;
  readonly source: MbtiSourceTraitItem;
};

export type MyeongliMbtiBridgeEvidence = {
  readonly id: string;
  readonly productContext: BridgeProductContext;
  readonly mbtiType: MbtiSourceType;
  readonly signalKinds: readonly MyeongliSignalKind[];
  readonly mbtiEvidence: {
    readonly titleKo: string;
    readonly archetype: string;
    readonly oneLine: string;
    readonly reportUseCaseKey: MbtiReportUseCaseKey;
    readonly reportUseCases: readonly string[];
    readonly traits: readonly MbtiTraitEvidence[];
    readonly relationshipPair: MbtiRelationshipPair | null;
  };
  readonly myeongliEvidence: {
    readonly signals: readonly MyeongliSignal[];
    readonly bridgeHints: readonly MbtiMyeongliBridgeHint[];
  };
  readonly bridgeSummary: string;
  readonly intensity: MyeongliMbtiBridgeIntensity;
  readonly caution: string | null;
};

export type MyeongliMbtiBridgePacket = {
  readonly productContext: BridgeProductContext;
  readonly reportUseCaseKey: MbtiReportUseCaseKey;
  readonly mbtiType: MbtiSourceType | null;
  readonly sourceProfile: MbtiSourceProfile | null;
  readonly withMbtiType: MbtiSourceType | null;
  readonly relationshipPair: MbtiRelationshipPair | null;
  readonly evidences: readonly MyeongliMbtiBridgeEvidence[];
  readonly isEmpty: boolean;
  readonly unknownType: boolean;
};

export type BuildMyeongliMbtiBridgePacketInput = {
  readonly mbtiType: string | null | undefined;
  readonly productContext: BridgeProductContext;
  readonly myeongliSignals: readonly MyeongliSignal[];
  readonly withMbtiType?: string | null;
};
