import { createRoot } from "react-dom/client";
import { ReportReadingFrame, ReportReentry } from "../../../src/components/report/ReportReadingFrame";
import BusinessFooter from "../../../src/components/legal/BusinessFooter";
import { ComprehensiveReportV2View } from "../../../src/app/reports/[reportId]/ComprehensiveReportV2View";
import { CareerReportView } from "../../../src/app/reports/[reportId]/CareerReportView";
import { LoveMarriageChildReportView } from "../../../src/app/reports/[reportId]/LoveMarriageChildReportView";
import { CompatibilityReportView } from "../../../src/app/reports/[reportId]/CompatibilityReportView";
import { MajorFortuneReportView } from "../../../src/app/reports/[reportId]/MajorFortuneReportView";
import { AnnualFortuneReportView } from "../../../src/app/reports/[reportId]/AnnualFortuneReportView";
import { LoveMarriageChildReportManseRyeokTable, LoveMarriageChildReportMbtiProfileTable } from "../../../src/components/report-tables";
import type { ProductPreviewSnapshot } from "../../../src/lib/report-generation/productPreviewSnapshot";
import type { LoveMarriageChildReportEvidencePacket } from "../../../src/lib/report-knowledge/loveMarriageChildReportTypes";
import "../../../src/app/globals.css";

const localFetch = window.fetch.bind(window);
const reportQA = { externalRequests: 0, pageErrors: [] as string[] };
Object.assign(window, { reportQA });
window.addEventListener("error", (event) => reportQA.pageErrors.push(event.message));
window.addEventListener("unhandledrejection", (event) => reportQA.pageErrors.push(String(event.reason)));
window.fetch = (input, init) => {
  const url = new URL(input instanceof Request ? input.url : String(input), location.href);
  if (url.origin !== location.origin) {
    reportQA.externalRequests += 1;
    return Promise.reject(new Error("External requests forbidden"));
  }
  return localFetch(input, init);
};
const query = new URLSearchParams(location.search);
const key = query.get("fixture") ?? "saju-mbti-full";
const fixtures: Record<string, ProductPreviewSnapshot> = await fetch("/fixtures/snapshots.json").then((r) => r.json());
const snapshot = fixtures[key];
const before = query.get("phase") === "before" ? await fetch(`/fixtures/${key}.html?phase=before`).then((r) => r.text()) : null;

function Content({ value }: { readonly value: ProductPreviewSnapshot }) {
  const props = { draft: value.draft, evidencePacket: value.evidencePacket, reportId: value.reportId };
  switch (value.productType) {
    case "saju_mbti_full": return <ComprehensiveReportV2View {...props as Parameters<typeof ComprehensiveReportV2View>[0]} />;
    case "career_money_study": return <CareerReportView {...props as Parameters<typeof CareerReportView>[0]} />;
    case "love_marriage_child": {
      const evidence = value.evidencePacket as LoveMarriageChildReportEvidencePacket;
      return <LoveMarriageChildReportView {...props as Parameters<typeof LoveMarriageChildReportView>[0]} manseRyeokTable={<LoveMarriageChildReportManseRyeokTable evidence={evidence} />} mbtiProfileTable={<LoveMarriageChildReportMbtiProfileTable evidence={evidence} />} />;
    }
    case "saju_mbti_compatibility": return <CompatibilityReportView {...props as Parameters<typeof CompatibilityReportView>[0]} />;
    case "major_fortune": return <MajorFortuneReportView {...props as Parameters<typeof MajorFortuneReportView>[0]} />;
    case "annual_fortune": return <AnnualFortuneReportView {...props as Parameters<typeof AnnualFortuneReportView>[0]} />;
  }
}

createRoot(document.getElementById("root")!).render(<>
  {before ? <div dangerouslySetInnerHTML={{ __html: before }} /> : <ReportReadingFrame createdAtIso={snapshot.createdAtIso}><Content value={snapshot} /><ReportReentry productSlug={snapshot.productSlug} /></ReportReadingFrame>}
  <BusinessFooter />
</>);
