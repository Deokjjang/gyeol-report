import type { CareerReportEvidencePacket } from "../../lib/report-knowledge/careerReportTypes";
import {
  buildCareerReportManseRyeokTableData,
  buildCareerReportMbtiProfileTableData,
  buildCareerReportCommonTablesData,
} from "../../lib/report-tables";
import ManseRyeokCommonTable from "./ManseRyeokCommonTable";
import MbtiCommonProfileTable from "./MbtiCommonProfileTable";

type CareerReportTableProps = {
  readonly evidence: CareerReportEvidencePacket;
  readonly defaultOpen?: boolean;
  readonly className?: string;
};

export function CareerReportManseRyeokTable({
  evidence,
  defaultOpen = true,
  className,
}: CareerReportTableProps) {
  const data = buildCareerReportManseRyeokTableData(evidence);

  return (
    <ManseRyeokCommonTable
      data={data}
      defaultOpen={defaultOpen}
      className={className}
    />
  );
}

export function CareerReportMbtiProfileTable({
  evidence,
  defaultOpen = true,
  className,
}: CareerReportTableProps) {
  const data = buildCareerReportMbtiProfileTableData(evidence);

  if (data === null) {
    return null;
  }

  return (
    <MbtiCommonProfileTable
      data={data}
      defaultOpen={defaultOpen}
      className={className}
    />
  );
}

export default function CareerReportCommonTables({
  evidence,
  defaultOpen = true,
  className,
}: CareerReportTableProps) {
  const data = buildCareerReportCommonTablesData(evidence);

  return (
    <div className={joinClassNames("grid gap-4", className)}>
      <ManseRyeokCommonTable
        data={data.manseRyeokTableData}
        defaultOpen={defaultOpen}
      />
      {data.mbtiProfileTableData === null ? null : (
        <MbtiCommonProfileTable
          data={data.mbtiProfileTableData}
          defaultOpen={defaultOpen}
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
