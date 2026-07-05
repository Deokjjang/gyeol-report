import type {
  LoveMarriageChildReportEvidencePacket,
} from "../../lib/report-knowledge/loveMarriageChildReportTypes";
import {
  buildLoveMarriageChildReportCommonTablesData,
  buildLoveMarriageChildReportManseRyeokTableData,
  buildLoveMarriageChildReportMbtiProfileTableData,
} from "../../lib/report-tables";
import type { ManseRyeokCommonTableData } from "../../lib/report-tables";
import ManseRyeokCommonTable from "./ManseRyeokCommonTable";
import MbtiCommonProfileTable from "./MbtiCommonProfileTable";

type LoveMarriageChildReportTableProps = {
  readonly evidence: LoveMarriageChildReportEvidencePacket;
  readonly defaultOpen?: boolean;
  readonly className?: string;
};

const LOVE_TABLE_SCOPE_CLASS = "love-marriage-child-table-scope";

export function LoveMarriageChildReportManseRyeokTable({
  evidence,
  defaultOpen = true,
  className,
}: LoveMarriageChildReportTableProps) {
  const data = buildLoveMarriageChildReportManseRyeokTableData(evidence);

  return (
    <div className={joinClassNames(LOVE_TABLE_SCOPE_CLASS, "grid gap-3", className)}>
      <LoveMarriageChildTableOverflowStyle />
      <LoveMarriageChildManseRyeokNote data={data} />
      <ManseRyeokCommonTable data={data} defaultOpen={defaultOpen} />
    </div>
  );
}

export function LoveMarriageChildReportMbtiProfileTable({
  evidence,
  defaultOpen = true,
  className,
}: LoveMarriageChildReportTableProps) {
  const data = buildLoveMarriageChildReportMbtiProfileTableData(evidence);

  if (data === null) {
    return null;
  }

  return (
    <div className={joinClassNames(LOVE_TABLE_SCOPE_CLASS, className)}>
      <LoveMarriageChildTableOverflowStyle />
      <MbtiCommonProfileTable
        data={data}
        defaultOpen={defaultOpen}
        variant="compact"
      />
    </div>
  );
}

export default function LoveMarriageChildReportCommonTables({
  evidence,
  defaultOpen = true,
  className,
}: LoveMarriageChildReportTableProps) {
  const data = buildLoveMarriageChildReportCommonTablesData(evidence);

  return (
    <div className={joinClassNames(LOVE_TABLE_SCOPE_CLASS, "grid gap-4 sm:gap-5", className)}>
      <LoveMarriageChildTableOverflowStyle />
      <LoveMarriageChildManseRyeokNote data={data.manseRyeokTableData} />
      <ManseRyeokCommonTable
        data={data.manseRyeokTableData}
        defaultOpen={defaultOpen}
      />
      {data.mbtiProfileTableData === null ? null : (
        <MbtiCommonProfileTable
          data={data.mbtiProfileTableData}
          defaultOpen={defaultOpen}
          variant="compact"
        />
      )}
    </div>
  );
}

function LoveMarriageChildTableOverflowStyle() {
  return (
    <style>{`
      .${LOVE_TABLE_SCOPE_CLASS},
      .${LOVE_TABLE_SCOPE_CLASS} * {
        min-width: 0;
      }

      .${LOVE_TABLE_SCOPE_CLASS} .grid-cols-4 {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .${LOVE_TABLE_SCOPE_CLASS} .break-keep {
        overflow-wrap: anywhere;
      }
    `}</style>
  );
}

function LoveMarriageChildManseRyeokNote({
  data,
}: {
  readonly data: ManseRyeokCommonTableData;
}) {
  if (!isDayPillarOnly(data)) {
    return null;
  }

  return (
    <p className="rounded-md border border-[#eadfce] bg-[#fffaf3] px-3 py-2 text-xs font-bold leading-5 text-[#7a6f63]">
      관계 해석에서는 가까운 관계 반응을 보는 일주·일지 신호를 우선
      표시합니다.
    </p>
  );
}

function isDayPillarOnly(data: ManseRyeokCommonTableData): boolean {
  return data.columns.every((column) => {
    const hasStem = data.stemRow[column.key] !== null;
    const hasBranch = data.branchRow[column.key] !== null;

    if (column.key === "day") {
      return hasStem || hasBranch;
    }

    return !hasStem && !hasBranch;
  });
}

function joinClassNames(
  ...classNames: readonly (string | undefined | false)[]
): string {
  return classNames.filter(Boolean).join(" ");
}
