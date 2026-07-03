"use client";

import { useId, useState } from "react";

import type {
  DaeunPillarCard,
  ReportTableElementColorToken,
  SaeunAnnualCompareTableData,
  SaeunFortuneTableData,
  SaeunMonthlyFortuneRow,
  SaeunMonthlyHalfTableData,
} from "../../lib/report-tables/types";

type SaeunFortuneTableProps = {
  readonly data: SaeunFortuneTableData;
  readonly defaultOpen?: boolean;
  readonly className?: string;
};

const ELEMENT_CARD_CLASS_BY_TOKEN = {
  "wood-green":
    "saeun-element-wood-green border-emerald-200 bg-emerald-100 text-emerald-950",
  "fire-red":
    "saeun-element-fire-red border-rose-200 bg-rose-100 text-rose-950",
  "earth-soil":
    "saeun-element-earth-soil border-amber-200 bg-amber-100 text-amber-950",
  "metal-gold":
    "saeun-element-metal-gold border-stone-200 bg-stone-100 text-stone-950",
  "water-sky":
    "saeun-element-water-sky border-sky-200 bg-sky-100 text-sky-950",
} as const satisfies Record<ReportTableElementColorToken, string>;

const DETAIL_ROWS = [
  { key: "hiddenStems", label: "지장간" },
  { key: "twelveLifeStage", label: "십이운성" },
  { key: "twelveSinsal", label: "십이신살" },
  { key: "sinsalAndGwiin", label: "신살·귀인" },
  { key: "interactions", label: "합충형파해" },
] as const;

export default function SaeunFortuneTable({
  data,
  defaultOpen = true,
  className,
}: SaeunFortuneTableProps) {
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
          <SaeunAnnualCompareTable
            selectedYear={data.selectedYear}
            data={data.daeunAnnualCompareTable}
          />
          <SaeunMonthlyHalfTable data={data.firstHalfMonthlyTable} />
          <SaeunMonthlyHalfTable data={data.secondHalfMonthlyTable} />
        </div>
      ) : null}
    </section>
  );
}

export function SaeunAnnualCompareTable({
  selectedYear,
  data,
}: {
  readonly selectedYear: number;
  readonly data: SaeunAnnualCompareTableData;
}) {
  return (
    <div className="bg-white">
      <h3 className="bg-neutral-50 px-4 py-2 text-center text-sm font-extrabold text-neutral-700">
        대운 · 연운
      </h3>
      <div className="grid grid-cols-2 bg-white text-center text-sm font-bold text-neutral-600">
        <div className="px-2 py-2">대운</div>
        <div className="border-l border-neutral-100 px-2 py-2">
          연운 ({selectedYear})
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px bg-white">
        <PillarCard cell={data.daeunStem} ariaLabel="대운 천간" />
        <PillarCard cell={data.annualStem} ariaLabel="연운 천간" />
      </div>
      <div className="grid grid-cols-2 gap-px bg-white">
        <PillarCard cell={data.daeunBranch} ariaLabel="대운 지지" />
        <PillarCard cell={data.annualBranch} ariaLabel="연운 지지" />
      </div>

      {DETAIL_ROWS.map((row) => (
        <div key={row.key} className="bg-white">
          <h4 className="bg-neutral-50 px-3 py-2 text-center text-xs font-bold text-neutral-500">
            {row.label}
          </h4>
          <div className="grid grid-cols-2 text-center text-xs leading-5 text-neutral-600">
            <div className="min-h-10 px-2 py-2 break-keep">
              {formatDetailValues(data[row.key].daeun)}
            </div>
            <div className="min-h-10 border-l border-neutral-100 px-2 py-2 break-keep">
              {formatDetailValues(data[row.key].annual)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SaeunMonthlyHalfTable({
  data,
}: {
  readonly data: SaeunMonthlyHalfTableData;
}) {
  return (
    <div className="bg-white">
      <h3 className="bg-rose-100 px-4 py-2 text-center text-sm font-extrabold text-neutral-800">
        {data.title}
      </h3>
      <p className="bg-white px-4 py-2 text-center text-xs font-bold text-neutral-500">
        {data.monthRangeLabel}
      </p>
      {data.rows.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm font-bold text-neutral-400">
          -
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[42rem]">
            <div className="grid grid-cols-6 bg-white text-center text-sm font-bold text-neutral-600">
              {data.rows.map((row) => (
                <div key={row.month} className="px-2 py-2">
                  {row.monthLabel}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-6 gap-px bg-white">
              {data.rows.map((row) => (
                <PillarCard
                  key={`${row.month}-stem`}
                  cell={row.stemCell}
                  ariaLabel={`${row.monthLabel} 월운 천간`}
                />
              ))}
            </div>
            <div className="grid grid-cols-6 gap-px bg-white">
              {data.rows.map((row) => (
                <PillarCard
                  key={`${row.month}-branch`}
                  cell={row.branchCell}
                  ariaLabel={`${row.monthLabel} 월운 지지`}
                />
              ))}
            </div>
            {DETAIL_ROWS.map((detailRow) => (
              <div key={detailRow.key} className="bg-white">
                <h4 className="bg-neutral-50 px-3 py-2 text-center text-xs font-bold text-neutral-500">
                  {detailRow.label}
                </h4>
                <div className="grid grid-cols-6 text-center text-xs leading-5 text-neutral-600">
                  {data.rows.map((row) => (
                    <div
                      key={`${detailRow.key}-${row.month}`}
                      className="min-h-10 border-l border-neutral-100 px-1.5 py-2 first:border-l-0 break-keep"
                    >
                      {formatDetailValues(row[detailRow.key])}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <MonthlyTextRow label="한 줄" rows={data.rows} field="oneLine" />
            <MonthlyTextRow label="주의" rows={data.rows} field="caution" />
            <MonthlyTextRow label="기준" rows={data.rows} field="basis" />
          </div>
        </div>
      )}
    </div>
  );
}

function MonthlyTextRow({
  label,
  rows,
  field,
}: {
  readonly label: string;
  readonly rows: readonly SaeunMonthlyFortuneRow[];
  readonly field: "oneLine" | "caution" | "basis";
}) {
  return (
    <div className="bg-white">
      <h4 className="bg-neutral-50 px-3 py-2 text-center text-xs font-bold text-neutral-500">
        {label}
      </h4>
      <div className="grid grid-cols-6 text-center text-xs leading-5 text-neutral-600">
        {rows.map((row) => (
          <div
            key={`${field}-${row.month}`}
            className="min-h-10 border-l border-neutral-100 px-1.5 py-2 first:border-l-0 break-keep"
          >
            {row[field] ?? "-"}
          </div>
        ))}
      </div>
    </div>
  );
}

function PillarCard({
  cell,
  ariaLabel,
}: {
  readonly cell: DaeunPillarCard | null;
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
