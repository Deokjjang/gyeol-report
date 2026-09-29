import { notFound } from "next/navigation";
import { ReportReadingFrame, ReportReentry } from "../../../components/report/ReportReadingFrame";
import { createAnnualV3 } from "../../../lib/report-generation/annualV3Generation";
import { validateNewProductPublication } from "../../../lib/report-generation/productPublishGate";
import { ANNUAL_V3_FIXTURES } from "../../../lib/interpretation-v3/annualFixtures";
import { AnnualFortuneReportV3View } from "../../reports/[reportId]/AnnualFortuneReportV3View";

export const dynamic = "force-dynamic";
/** Local-only deterministic QA: no database, provider, payment or production. */
export default async function AnnualPreview({ searchParams }: { searchParams: Promise<{ fixture?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { fixture = "gaon" } = await searchParams;
  const entry = ANNUAL_V3_FIXTURES.find(f => f.id === fixture); if (!entry) notFound();
  const now = new Date(), result = await createAnnualV3(entry.input, { now: () => now });
  if (!result || !validateNewProductPublication("annual_fortune", result.draft, result.evidencePacket, entry.input).ok) notFound();
  return <ReportReadingFrame createdAtIso={now.toISOString()}><AnnualFortuneReportV3View {...result} now={now} /><ReportReentry productSlug="annual-fortune" /></ReportReadingFrame>;
}
