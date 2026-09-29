import type { MbtiCommonProfileTableData } from "../../lib/report-tables/types";

export function V3NarrativeIdentity({ data }: { readonly data?: MbtiCommonProfileTableData | null }) {
  return <div data-mbti-identity className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-[#ded2c2] pt-4 text-sm">
    <span className="text-xs font-semibold tracking-wider text-[#9f7a2d]">MBTI</span>
    <span className="font-semibold text-[#6f1d35]">{data?.type ?? "모름"}</span>
    {data ? <span className="text-[#756658]">{data.titleKo}</span> : null}
  </div>;
}
