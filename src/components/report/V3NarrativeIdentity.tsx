import type { MbtiCommonProfileTableData } from "../../lib/report-tables/types";
import MbtiCommonProfileTable from "../report-tables/MbtiCommonProfileTable";

export function V3NarrativeIdentity({ data, detailed = false }: { readonly data?: MbtiCommonProfileTableData | null; readonly detailed?: boolean }) {
  if (detailed && data) return <div data-mbti-identity data-mbti-detail><MbtiCommonProfileTable data={{ ...data, reportUsageNotes: [] }} showUsageNotes={false} defaultOpen={false} /></div>;
  return <div data-mbti-identity className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-[#ded2c2] pt-4 text-sm">
    <span className="text-xs font-semibold tracking-wider text-[#9f7a2d]">MBTI</span>
    <span className="font-semibold text-[#6f1d35]">{data?.type ?? "모름"}</span>
    {data ? <span className="text-[#756658]">{data.titleKo}</span> : null}
  </div>;
}
