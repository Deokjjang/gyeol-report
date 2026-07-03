"use client";

import { useId, useState } from "react";

import type {
  CompatibilityConnectionSummaryData,
  CompatibilityPersonTableData,
  CompatibilityRelationCategory,
  CompatibilityTableData,
} from "../../lib/report-tables/types";
import ManseRyeokCommonTable from "./ManseRyeokCommonTable";
import MbtiCommonProfileTable from "./MbtiCommonProfileTable";

type CompatibilityTableProps = {
  readonly data: CompatibilityTableData;
  readonly defaultOpen?: boolean;
  readonly className?: string;
};

const RELATION_CATEGORY_LABELS = {
  love: "연애 궁합",
  marriage: "결혼 궁합",
  parentChild: "부모·자식 궁합",
  coworker: "직장 동료 궁합",
  managerReport: "상사·부하 궁합",
  businessPartner: "사업/협업 궁합",
  friendship: "친구/인간관계 궁합",
} as const satisfies Record<CompatibilityRelationCategory, string>;

export default function CompatibilityTable({
  data,
  defaultOpen = true,
  className,
}: CompatibilityTableProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();
  const relationCategoryLabel = RELATION_CATEGORY_LABELS[data.relationCategory];

  return (
    <section
      className={joinClassNames(
        "overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm",
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 bg-fuchsia-800 px-4 py-3 text-left text-white"
      >
        <span className="min-w-0 text-base font-extrabold leading-6 break-keep">
          {data.title}
        </span>
        <span className="shrink-0 text-sm font-bold">
          {isOpen ? "접기" : "펼치기"}
        </span>
      </button>

      {isOpen ? (
        <div id={contentId} className="divide-y divide-neutral-100">
          <header className="bg-white px-4 py-4">
            <span className="rounded-md bg-fuchsia-100 px-2.5 py-1 text-sm font-extrabold text-fuchsia-900">
              {relationCategoryLabel}
            </span>
          </header>

          <PersonTableBlock person={data.personA} />
          <ConnectionSummaryTable data={data.connectionSummary} />
          <PersonTableBlock person={data.personB} />
        </div>
      ) : null}
    </section>
  );
}

function PersonTableBlock({
  person,
}: {
  readonly person: CompatibilityPersonTableData;
}) {
  return (
    <section className="space-y-3 bg-neutral-50 px-3 py-4 sm:px-4">
      <PersonSummary person={person} />
      <ManseRyeokCommonTable data={person.manseRyeok} defaultOpen={true} />
      {person.mbti === null ? (
        <EmptySubTable title={`${person.label} MBTI표`} />
      ) : (
        <MbtiCommonProfileTable data={person.mbti} defaultOpen={true} />
      )}
    </section>
  );
}

function PersonSummary({
  person,
}: {
  readonly person: CompatibilityPersonTableData;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3">
      <p className="text-xs font-extrabold text-neutral-500 break-keep">
        {person.label} 사람 요약
      </p>
      <p className="mt-1 text-base font-extrabold text-neutral-950 break-keep">
        {person.displayName ?? "-"}
      </p>
    </div>
  );
}

export function ConnectionSummaryTable({
  data,
}: {
  readonly data: CompatibilityConnectionSummaryData;
}) {
  return (
    <section className="bg-white">
      <h3 className="bg-fuchsia-50 px-4 py-2 text-center text-sm font-extrabold text-fuchsia-950">
        연결/궁합 요약표
      </h3>
      <dl className="grid gap-0 divide-y divide-neutral-100">
        <SummaryTextRow
          label="궁합 헤드라인"
          value={data.compatibilityHeadline}
        />
        <SummaryTextRow label="전체 톤" value={data.overallTone} />
        <SummaryTextRow
          label="명리 연결 요약"
          value={data.myeongliConnectionSummary}
        />
        <SummaryTextRow
          label="MBTI 연결 요약"
          value={data.mbtiConnectionSummary}
        />
        <SummaryTextRow label="일간 관계" value={data.dayMasterRelation} />
        <SummaryTextRow label="일지 관계" value={data.dayBranchRelation} />
        <SummaryTextRow label="오행 균형" value={data.elementBalance} />
        <SummaryTextRow label="십성 관계" value={data.tenGodRelation} />
        <SummaryListRow label="관계 라벨" values={data.interactionLabels} />
        <SummaryListRow label="공유 강점" values={data.sharedStrengths} />
        <SummaryListRow label="마찰 지점" values={data.frictionPoints} />
        <SummaryTextRow label="회복 전략" value={data.repairStrategy} />
        <SummaryListRow label="타이밍 메모" values={data.timingNotes} />
      </dl>
    </section>
  );
}

function SummaryTextRow({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string | null;
}) {
  return (
    <div className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-3">
      <dt className="font-extrabold text-neutral-700">{label}</dt>
      <dd className="leading-6 text-neutral-600 break-keep">
        {formatText(value)}
      </dd>
    </div>
  );
}

function SummaryListRow({
  label,
  values,
}: {
  readonly label: string;
  readonly values: readonly string[];
}) {
  return (
    <div className="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-3">
      <dt className="font-extrabold text-neutral-700">{label}</dt>
      <dd className="flex flex-wrap gap-1.5">
        {values.length > 0 ? (
          values.map((value) => (
            <span
              key={value}
              className="rounded-full border border-fuchsia-100 bg-fuchsia-50 px-2.5 py-1 text-xs font-bold text-fuchsia-900 break-keep"
            >
              {value}
            </span>
          ))
        ) : (
          <span className="text-sm font-bold text-neutral-400">-</span>
        )}
      </dd>
    </div>
  );
}

function EmptySubTable({ title }: { readonly title: string }) {
  return (
    <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <div className="bg-neutral-950 px-4 py-3 text-base font-extrabold text-white">
        {title}
      </div>
      <div className="px-4 py-4 text-sm font-bold text-neutral-400">-</div>
    </section>
  );
}

function formatText(value: string | null): string {
  return value && value.length > 0 ? value : "-";
}

function joinClassNames(
  ...classNames: readonly (string | undefined | false)[]
): string {
  return classNames.filter(Boolean).join(" ");
}
