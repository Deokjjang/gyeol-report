import type { ReportProductKey, CompatibilityRelationshipType, RelationshipStatus } from "../report-generation/reportInputTypes";
import type { ManseRyeokCommonTableData, MbtiCommonProfileTableData } from "../report-tables/types";

/** JSON-only customer contract. Never import a composer from its renderer. */
export type V4CustomerSection = { readonly title: string; readonly paragraphs: readonly string[] };
export type V4CustomerReport = {
  readonly version: "v4-runtime-shadow-1";
  readonly reportVersion: "v4";
  readonly productVersion: "v4";
  readonly productType: ReportProductKey;
  readonly headline: string;
  readonly opening: readonly string[];
  readonly sections: readonly V4CustomerSection[];
  readonly finalLine: string;
  readonly relationshipStatus?: RelationshipStatus;
  readonly compatibility?: {
    readonly category: CompatibilityRelationshipType;
    readonly personA: { readonly name: string; readonly role: string };
    readonly personB: { readonly name: string; readonly role: string };
    readonly aToB: V4CustomerSection;
    readonly bToA: V4CustomerSection;
  };
  readonly major?: {
    readonly currentYear: number;
    readonly years: readonly { readonly year: number; readonly age: number; readonly cycle: string; readonly annual: string; readonly theme: string; readonly goodTheme: string; readonly cautionTheme: string | null; readonly content: V4CustomerSection }[];
    readonly transitions: readonly V4CustomerSection[];
  };
  readonly annual?: {
    readonly selectedYear: number;
    readonly months: readonly { readonly month: number; readonly theme: string; readonly time: "past" | "current" | "future"; readonly content: V4CustomerSection }[];
  };
};
export type V4CustomerTables = readonly {
  readonly name: string;
  readonly manse: Omit<ManseRyeokCommonTableData, "natalEvidence">;
  readonly mbti: MbtiCommonProfileTableData | null;
  readonly elements: readonly { readonly label: string; readonly visible: number; readonly weighted: number; readonly state?: "강함" | "약함" | "균형" | "부분 확인" }[];
}[];
export type V4ShadowView = { readonly createdAtIso: string; readonly productSlug: string; readonly report: V4CustomerReport; readonly tables: V4CustomerTables };
