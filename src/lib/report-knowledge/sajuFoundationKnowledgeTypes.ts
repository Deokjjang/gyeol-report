/** Research data only. No feature weights, detection rules or customer prose contract. */
export type SajuFoundationCategory =
  | "yin_yang" | "element" | "heavenly_stem" | "earthly_branch"
  | "day_master" | "day_pillar" | "ten_god" | "twelve_stage"
  | "shinsal_gwiin" | "hidden_stem" | "position" | "structure" | "relation";

export type SajuFoundationDomain =
  | "personality" | "career" | "money" | "study"
  | "love" | "marriage" | "family" | "relationships";

export type SajuFoundationSource = {
  readonly id: string;
  readonly kind: "primary_transcription" | "institutional_overview" | "repository";
  readonly title: string;
  readonly lineage: string;
  readonly location: string;
  readonly checkedAt: string;
  readonly verification: "text_accessed" | "transcription_warning" | "repository_inspected";
  readonly scope: string;
  readonly limitations: readonly string[];
};

export type SajuFoundationSourceRef = {
  readonly sourceId: string;
  /** Chapter/section or exact repository symbol; a book title alone is insufficient. */
  readonly locator: string;
};

export type SajuFoundationStatement = {
  readonly text: string;
  /** Source checked means a historical account was read, not empirical validation. */
  readonly review: "source_checked" | "repository_only";
  readonly sourceRefs: readonly SajuFoundationSourceRef[];
};

export type SajuFoundationEntry = {
  readonly id: string;
  readonly category: SajuFoundationCategory;
  readonly key: string;
  readonly labelKo: string;
  /** Aliases are unique within category, never a global unqualified lookup. */
  readonly aliases: readonly string[];
  readonly definition: SajuFoundationStatement;
  readonly traditional: readonly (SajuFoundationStatement & {
    readonly aspect: "symbol" | "positive" | "caution" | "condition" | "difference";
  })[];
  /** Author's conditional applications, explicitly separate from traditional claims. */
  readonly editorial: {
    readonly review: "editorial_example";
    readonly basedOn: readonly string[];
    readonly positive: string;
    readonly caution: string;
    readonly excessOrDeficit: string;
    readonly applications: Partial<Readonly<Record<SajuFoundationDomain, {
      readonly when: string;
      readonly example: string;
    }>>>;
  } | null;
  readonly appliesWhen: readonly string[];
  readonly doNotApply: readonly string[];
  readonly distinctions: readonly string[];
  /** Shared concepts are referenced, not copied to inflate coverage. */
  readonly relatedIds: readonly string[];
  readonly support: {
    readonly calculation: "native" | "projection" | "knowledge_only";
    readonly calculationRefs: readonly string[];
    readonly legacyRefs: readonly string[];
  };
  /** Every unfilled semantic field/domain is identified by the coverage manifest. */
  readonly deferred: readonly string[];
};
