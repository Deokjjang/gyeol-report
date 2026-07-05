import type {
  LoveMarriageChildReportEvidencePacket,
} from "../../lib/report-knowledge/loveMarriageChildReportTypes";
import {
  buildLoveMarriageChildReportCommonTablesData,
  buildLoveMarriageChildReportManseRyeokTableData,
  buildLoveMarriageChildReportMbtiProfileTableData,
} from "../../lib/report-tables";
import ManseRyeokCommonTable from "./ManseRyeokCommonTable";
import MbtiCommonProfileTable from "./MbtiCommonProfileTable";

type LoveMarriageChildReportTableProps = {
  readonly evidence: LoveMarriageChildReportEvidencePacket;
  readonly defaultOpen?: boolean;
  readonly className?: string;
};

export function LoveMarriageChildReportManseRyeokTable({
  evidence,
  defaultOpen = true,
  className,
}: LoveMarriageChildReportTableProps) {
  const data = buildLoveMarriageChildReportManseRyeokTableData(evidence);

  return (
    <ManseRyeokCommonTable
      data={data}
      defaultOpen={defaultOpen}
      className={className}
    />
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
    <MbtiCommonProfileTable
      data={data}
      defaultOpen={defaultOpen}
      className={className}
      variant="compact"
    />
  );
}

export default function LoveMarriageChildReportCommonTables({
  evidence,
  defaultOpen = true,
  className,
}: LoveMarriageChildReportTableProps) {
  const data = buildLoveMarriageChildReportCommonTablesData(evidence);

  return (
    <div className={joinClassNames("grid gap-4 sm:gap-5", className)}>
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

function joinClassNames(
  ...classNames: readonly (string | undefined | false)[]
): string {
  return classNames.filter(Boolean).join(" ");
}
