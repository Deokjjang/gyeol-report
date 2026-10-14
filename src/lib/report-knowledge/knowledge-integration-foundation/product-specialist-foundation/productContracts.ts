import type { ProductKey } from "../types";
export const READER_MODULES: {
    product: ProductKey;
    file: string;
    exportName: string;
    versionExport: string;
}[] = [
    { product: "saju_mbti_full", file: "src/lib/interpretation-v4/comprehensiveReleaseContracts.ts", exportName: "COMPREHENSIVE_READER_CHAPTERS", versionExport: "COMPREHENSIVE_RELEASE_VERSION" },
    { product: "career_money_study", file: "src/lib/interpretation-v4/careerReleaseContracts.ts", exportName: "CAREER_READER_CHAPTERS", versionExport: "CAREER_RELEASE_VERSION" },
    { product: "love_marriage_child", file: "src/lib/interpretation-v4/loveReleaseContracts.ts", exportName: "LOVE_READER_CHAPTERS", versionExport: "LOVE_RELEASE_VERSION" },
    { product: "saju_mbti_compatibility", file: "src/lib/interpretation-v4/compatibilityReleaseContracts.ts", exportName: "COMPATIBILITY_READER_CHAPTERS", versionExport: "COMPATIBILITY_RELEASE_VERSION" },
];
export const PRODUCT_KEYS: ProductKey[] = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"];
