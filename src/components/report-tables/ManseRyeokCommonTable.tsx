"use client";

import { useId, useState, type ReactNode } from "react";

import type {
  ManseRyeokCommonTableData,
  ManseRyeokFiveElementDistribution,
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
    "manse-element-wood-green border-emerald-200 bg-emerald-100/90 text-emerald-950",
  "fire-red":
    "manse-element-fire-red border-rose-200 bg-rose-100/90 text-rose-950",
  "earth-soil":
    "manse-element-earth-soil border-amber-200 bg-amber-100/90 text-amber-950",
  "metal-gold":
    "manse-element-metal-gold border-stone-200 bg-stone-100/90 text-stone-950",
  "water-sky":
    "manse-element-water-sky border-sky-200 bg-sky-100/90 text-sky-950",
} as const satisfies Record<ReportTableElementColorToken, string>;

export default function ManseRyeokCommonTable({
  data,
  defaultOpen = true,
  className,
}: ManseRyeokCommonTableProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();
  const visibleDetailRows = data.detailRows.filter((row) =>
    data.columns.some((column) => row.cells[column.key].length > 0),
  );

  return (
    <section
      className={joinClassNames(
        "max-w-full overflow-hidden rounded-lg border border-[#d8d1c4] bg-[#fffdf8] shadow-[0_14px_46px_rgba(42,31,24,0.07)]",
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 bg-[#7f1d38] px-4 py-3 text-left text-white transition-colors hover:bg-[#6f1830]"
      >
        <span className="min-w-0 text-base font-extrabold leading-6 break-keep">
          {data.title}
        </span>
        <span className="shrink-0 rounded-full bg-white/12 px-2.5 py-1 text-xs font-bold">
          {isOpen ? "접기" : "펼치기"}
        </span>
      </button>

      {isOpen ? (
        <div id={contentId} className="divide-y divide-[#eadfce]">
          <div role="table" aria-label={`${data.title} 사주 원국`}>
            <div role="row" className="grid grid-cols-4 bg-[#fffaf3] text-center text-sm font-extrabold text-[#5a4633]">
              {data.columns.map((column) => (
                <div role="columnheader" key={column.key} className="px-2 py-2">
                  {column.label}
                </div>
              ))}
            </div>

            <div role="row" aria-label="천간" className="grid grid-cols-4 gap-px bg-[#f5efe5]">
              {data.columns.map((column) => (
                <StemBranchCard
                  key={`stem-${column.key}`}
                  cell={data.stemRow[column.key]}
                  ariaLabel={`${column.label} 천간`}
                />
              ))}
            </div>

            <div role="row" aria-label="지지" className="grid grid-cols-4 gap-px bg-[#f5efe5]">
              {data.columns.map((column) => (
                <StemBranchCard
                  key={`branch-${column.key}`}
                  cell={data.branchRow[column.key]}
                  ariaLabel={`${column.label} 지지`}
                />
              ))}
            </div>
          </div>

          {data.natalEvidence ? <p className="px-3 py-3 text-xs leading-5 text-[#7a6f63]">
            {data.natalEvidence.precision === "exact" ? "입력한 정확한 출생시각의 원국입니다." : data.natalEvidence.precision === "approximate" ? "선택한 시간대 전체에서 확정되는 원국입니다." : "출생시간 미상 · 확정된 연·월·일주만 표시합니다. 시주에 따라 달라질 수 있는 표식은 포함하지 않습니다."}
          </p> : null}
          <FiveElementDistribution data={data.fiveElementDistribution} />

          {visibleDetailRows.map((row) => (
            <div key={row.key} className="bg-[#fffdf8]">
              <h3 className="bg-[#f5efe5] px-3 py-2 text-center text-xs font-extrabold text-[#7a6f63]">
                {row.label}
              </h3>
              <div className="grid grid-cols-4 text-center text-xs leading-5 text-[#5d544d]">
                {data.columns.map((column) => (
                  <div
                    key={`${row.key}-${column.key}`}
                    className="min-h-10 border-l border-[#efe6d8] px-1.5 py-2 first:border-l-0 break-keep [overflow-wrap:anywhere]"
                  >
                    {formatDetailValues(row.cells[column.key])}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {data.natalEvidence ? <details className="px-4 py-3 text-sm text-[#5d544d]">
            <summary className="min-h-11 cursor-pointer py-3 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f1d38]">전체 원국 표식과 해석 근거</summary>
            <p className="mb-3 text-xs leading-5 text-[#7a6f63]">기둥별 표식과 원국 전체에서 파생된 근거를 함께 확인할 수 있습니다. 십이신살은 연지·일지 기준을 구분하며, 대운·세운의 표식은 이 목록에 섞지 않습니다.</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {data.natalEvidence.features.filter(feature => ["sinsal", "gwiin", "twelve_sinsal"].includes(feature.category)).map(feature => <li key={feature.id} className="min-w-0 border-t border-[#eadfce] pt-3 [overflow-wrap:anywhere]">
                <p className="font-bold">{feature.label}</p>
                <p className="mt-1 text-xs leading-5">{feature.basis}{feature.positions.length ? ` · ${feature.positions.map(position => data.columns.find(c => c.key === position)?.label).filter(Boolean).join("·")}` : " · 기둥 한 곳에 배정하지 않음"}</p>
              </li>)}
            </ul>
          </details> : null}
        </div>
      ) : null}
    </section>
  );
}

function FiveElementDistribution({
  data,
}: {
  readonly data: ManseRyeokFiveElementDistribution;
}) {
  return (
    <section
      className="space-y-3 bg-[#fffdf8] px-3 py-4"
      aria-label="오행 분포"
    >
      <div className="space-y-1">
        <h3 className="text-sm font-extrabold text-[#5a4633]">오행 분포</h3>
      </div>
      <div className="manse-five-element-grid grid grid-cols-5 gap-2">
        {data.items.map((item) => (
          <div
            key={item.element}
            aria-label={`${item.label} ${item.count}`}
            className={joinClassNames(
              "min-w-0 rounded-[8px] border px-2 py-2 text-center",
              ELEMENT_CARD_CLASS_BY_TOKEN[item.colorToken],
            )}
          >
            <p className="text-xs font-extrabold leading-4">{item.label}</p>
            <p className="mt-1 text-xl font-black leading-none">{item.count}</p>
          </div>
        ))}
      </div>
      <p className="min-w-0 break-words text-xs font-bold text-[#8b7c70]">
        기준: {data.basisLabel}
      </p>
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
        role="cell"
        aria-label={ariaLabel}
        className="flex min-h-24 flex-col items-center justify-center gap-1 border border-[#efe6d8] bg-[#f8f4ed] px-1 py-3 text-center text-[#b7ab9a]"
      >
        <span className="text-sm font-bold" aria-label="정보 없음">-</span>
      </div>
    );
  }

  return (
    <div
      role="cell"
      aria-label={`${ariaLabel} ${cell.hanja} ${cell.ko} ${cell.tenGod ?? ""}`.trim()}
      className={joinClassNames(
        "flex min-h-24 flex-col items-center justify-center gap-1 border px-1 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
        ELEMENT_CARD_CLASS_BY_TOKEN[cell.colorToken],
      )}
    >
      <span className="text-3xl font-extrabold leading-none">{cell.hanja}</span>
      <span className="text-xs font-semibold leading-4">{cell.ko}</span>
      {cell.tenGod === null ? null : (
        <span className="text-xs font-bold leading-4">{cell.tenGod}</span>
      )}
    </div>
  );
}

function formatDetailValues(values: readonly string[] | undefined): ReactNode {
  if (!values || values.length === 0) {
    return (
      <span className="font-bold text-[#b7ab9a]" aria-label="정보 없음">
        -
      </span>
    );
  }

  return values.join(" · ");
}

function joinClassNames(
  ...classNames: readonly (string | undefined | false)[]
): string {
  return classNames.filter(Boolean).join(" ");
}
