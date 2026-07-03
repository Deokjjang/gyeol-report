"use client";

import { useId, useState } from "react";

import type {
  ManseRyeokCommonTableData,
  ManseRyeokStemBranchCell,
  ReportTableElementColorToken,
} from "../../lib/report-tables/types";

type ManseRyeokCommonTableProps = {
  readonly data: ManseRyeokCommonTableData;
  readonly defaultOpen?: boolean;
  readonly className?: string;
};

const ELEMENT_CARD_CLASS_BY_TOKEN = {
  "wood-green":
    "manse-element-wood-green border-emerald-200 bg-emerald-100 text-emerald-950",
  "fire-red":
    "manse-element-fire-red border-rose-200 bg-rose-100 text-rose-950",
  "earth-soil":
    "manse-element-earth-soil border-amber-200 bg-amber-100 text-amber-950",
  "metal-gold":
    "manse-element-metal-gold border-stone-200 bg-stone-100 text-stone-950",
  "water-sky":
    "manse-element-water-sky border-sky-200 bg-sky-100 text-sky-950",
} as const satisfies Record<ReportTableElementColorToken, string>;

export default function ManseRyeokCommonTable({
  data,
  defaultOpen = true,
  className,
}: ManseRyeokCommonTableProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

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
        className="flex w-full items-center justify-between gap-3 bg-teal-600 px-4 py-3 text-left text-white"
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
          <div className="grid grid-cols-4 bg-white text-center text-sm font-bold text-neutral-600">
            {data.columns.map((column) => (
              <div key={column.key} className="px-2 py-2">
                {column.label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-px bg-white">
            {data.columns.map((column) => (
              <StemBranchCard
                key={`stem-${column.key}`}
                cell={data.stemRow[column.key]}
                ariaLabel={`${column.label} 천간`}
              />
            ))}
          </div>

          <div className="grid grid-cols-4 gap-px bg-white">
            {data.columns.map((column) => (
              <StemBranchCard
                key={`branch-${column.key}`}
                cell={data.branchRow[column.key]}
                ariaLabel={`${column.label} 지지`}
              />
            ))}
          </div>

          {data.detailRows.map((row) => (
            <div key={row.key} className="bg-white">
              <h3 className="bg-neutral-50 px-3 py-2 text-center text-xs font-bold text-neutral-500">
                {row.label}
              </h3>
              <div className="grid grid-cols-4 text-center text-xs leading-5 text-neutral-600">
                {data.columns.map((column) => (
                  <div
                    key={`${row.key}-${column.key}`}
                    className="min-h-10 border-l border-neutral-100 px-1.5 py-2 first:border-l-0 break-keep"
                  >
                    {formatDetailValues(row.cells[column.key])}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function StemBranchCard({
  cell,
  ariaLabel,
}: {
  readonly cell: ManseRyeokStemBranchCell | null;
  readonly ariaLabel: string;
}) {
  if (!cell) {
    return (
      <div
        aria-label={ariaLabel}
        className="flex min-h-24 flex-col items-center justify-center gap-1 border border-neutral-100 bg-neutral-50 px-1 py-3 text-center text-neutral-400"
      >
        <span className="text-sm font-bold">-</span>
      </div>
    );
  }

  return (
    <div
      aria-label={ariaLabel}
      className={joinClassNames(
        "flex min-h-24 flex-col items-center justify-center gap-1 border px-1 py-3 text-center",
        ELEMENT_CARD_CLASS_BY_TOKEN[cell.colorToken],
      )}
    >
      <span className="text-3xl font-extrabold leading-none">{cell.hanja}</span>
      <span className="text-xs font-semibold leading-4">{cell.ko}</span>
      <span className="text-xs font-bold leading-4">{cell.tenGod ?? "-"}</span>
    </div>
  );
}

function formatDetailValues(values: readonly string[] | undefined): string {
  if (!values || values.length === 0) {
    return "-";
  }

  return values.join(" · ");
}

function joinClassNames(
  ...classNames: readonly (string | undefined | false)[]
): string {
  return classNames.filter(Boolean).join(" ");
}
