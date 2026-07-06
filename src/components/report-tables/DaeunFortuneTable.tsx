"use client";

import { useId, useState } from "react";

import type {
  DaeunAnnualCompareTableData,
  DaeunFortuneTableData,
  DaeunPillarCard,
  DaeunTimelineRow,
  ReportTableElementColorToken,
} from "../../lib/report-tables/types";

type DaeunFortuneTableProps = {
  readonly data: DaeunFortuneTableData;
  readonly defaultOpen?: boolean;
  readonly className?: string;
};

const ELEMENT_CARD_CLASS_BY_TOKEN = {
  "wood-green":
    "daeun-element-wood-green border-emerald-200 bg-emerald-100 text-emerald-950",
  "fire-red":
    "daeun-element-fire-red border-rose-200 bg-rose-100 text-rose-950",
  "earth-soil":
    "daeun-element-earth-soil border-amber-200 bg-amber-100 text-amber-950",
  "metal-gold":
    "daeun-element-metal-gold border-stone-200 bg-stone-100 text-stone-950",
  "water-sky":
    "daeun-element-water-sky border-sky-200 bg-sky-100 text-sky-950",
} as const satisfies Record<ReportTableElementColorToken, string>;

const COMPARE_DETAIL_ROWS = [
  {
    key: "hiddenStems",
    label: "지장간",
  },
  {
    key: "twelveLifeStage",
    label: "십이운성",
  },
  {
    key: "twelveSinsal",
    label: "십이신살",
  },
  {
    key: "sinsalAndGwiin",
    label: "신살·귀인",
  },
  {
    key: "interactions",
    label: "합충형파해",
  },
] as const;

export default function DaeunFortuneTable({
  data,
  defaultOpen = true,
  className,
}: DaeunFortuneTableProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <section
      className={joinClassNames(
        "max-w-full overflow-hidden rounded-lg border border-[#ded2c2] bg-[#fffaf1] shadow-[0_16px_40px_rgba(62,45,35,0.08)]",
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 bg-[#6f1d35] px-4 py-3 text-left text-white"
      >
        <span className="min-w-0 text-base font-extrabold leading-6 break-keep">
          {data.title}
        </span>
        <span className="shrink-0 text-sm font-bold">
          {isOpen ? "접기" : "펼치기"}
        </span>
      </button>

      {isOpen ? (
        <div id={contentId} className="divide-y divide-[#eadfce]">
          <DaeunTimelineTable rows={data.timelineRows} />
          <DaeunAnnualCompareTable
            selectedYear={data.selectedYear}
            data={data.annualCompareTable}
          />
        </div>
      ) : null}
    </section>
  );
}

export function DaeunTimelineTable({
  rows,
}: {
  readonly rows: readonly DaeunTimelineRow[];
}) {
  return (
    <div className="bg-[#fffaf1]">
      <h3 className="bg-[#f3eadc] px-4 py-2 text-center text-sm font-extrabold text-[#5a4d42]">
        대운 타임라인
      </h3>
      <div className="divide-y divide-[#eadfce]">
        {rows.map((row) => (
          <TimelineRow key={row.year} row={row} />
        ))}
      </div>
    </div>
  );
}

function TimelineRow({
  row,
}: {
  readonly row: DaeunTimelineRow;
}) {
  return (
    <div
      className={joinClassNames(
        "grid grid-cols-[4.75rem_minmax(0,1fr)] gap-3 px-3 py-3 text-sm sm:grid-cols-[5.5rem_minmax(0,1fr)]",
        row.isCurrentYear
          ? "daeun-current-year-row border-l-4 border-[#b88932] bg-[#fff6df]"
          : "bg-[#fffaf1]",
      )}
    >
      <div className="flex flex-col justify-center gap-1">
        <span className="text-base font-extrabold text-[#2b211b]">
          {row.year}년
        </span>
        <span className="text-xs font-bold text-[#8a7c70]">
          {row.ageLabel ?? "-"}
        </span>
      </div>
      <div className="grid min-w-0 gap-2">
        <div className="flex flex-wrap items-center gap-1">
          {row.badges.length > 0 ? (
            row.badges.map((badge) => (
              <span
                key={badge}
                className={joinClassNames(
                  "rounded px-1.5 py-0.5 text-[0.68rem] font-extrabold",
                  badge === "올해"
                    ? "bg-[#6f1d35] text-white"
                    : badge === "전환"
                      ? "bg-[#9f7a2d] text-white"
                      : "bg-[#f1e6d7] text-[#5a4d42]",
                )}
              >
                {badge}
              </span>
            ))
          ) : (
            <span className="text-xs font-bold text-[#aa9f93]">-</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <TimelinePillar label="대운" row={row.daeunPillar} />
          <TimelinePillar label="연운" row={row.annualPillar} />
        </div>

        <div className="grid gap-1 leading-5 text-[#5a4d42]">
          <p className="text-xs font-bold text-[#8a7c70] break-keep">
            {row.keyInteractionLabel ?? "-"}
          </p>
          <p className="text-sm font-semibold text-[#2b211b] break-keep">
            {row.oneLine ?? "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

function TimelinePillar({
  label,
  row,
}: {
  readonly label: string;
  readonly row: DaeunTimelineRow["daeunPillar"];
}) {
  return (
    <div className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-1 rounded-md border border-[#eadfce] bg-[#fffdf8] px-2 py-1.5">
      <span className="text-xs font-bold text-[#9c8d7d]">{label}</span>
      <span className="truncate text-sm font-extrabold text-[#2b211b]">
        {row.ganji ?? "-"}
      </span>
    </div>
  );
}

export function DaeunAnnualCompareTable({
  selectedYear,
  data,
}: {
  readonly selectedYear: number;
  readonly data: DaeunAnnualCompareTableData;
}) {
  return (
    <div className="bg-[#fffaf1]">
      <h3 className="bg-[#f3eadc] px-4 py-2 text-center text-sm font-extrabold text-[#5a4d42]">
        대운 · 연운
      </h3>
      <div className="grid grid-cols-2 bg-[#fffaf1] text-center text-sm font-bold text-[#5a4d42]">
        <div className="px-2 py-2">대운</div>
        <div className="border-l border-[#eadfce] px-2 py-2">
          연운 ({selectedYear})
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-[#eadfce]">
        <PillarCard cell={data.daeunStem} ariaLabel="대운 천간" />
        <PillarCard cell={data.annualStem} ariaLabel="연운 천간" />
      </div>
      <div className="grid grid-cols-2 gap-px bg-[#eadfce]">
        <PillarCard cell={data.daeunBranch} ariaLabel="대운 지지" />
        <PillarCard cell={data.annualBranch} ariaLabel="연운 지지" />
      </div>

      {COMPARE_DETAIL_ROWS.map((row) => (
        <div key={row.key} className="bg-[#fffaf1]">
          <h4 className="bg-[#f7efe5] px-3 py-2 text-center text-xs font-bold text-[#8a7c70]">
            {row.label}
          </h4>
          <div className="grid grid-cols-2 text-center text-xs leading-5 text-[#5a4d42]">
            <div className="min-h-10 px-2 py-2 break-keep">
              {formatDetailValues(data[row.key].daeun)}
            </div>
            <div className="min-h-10 border-l border-[#eadfce] px-2 py-2 break-keep">
              {formatDetailValues(data[row.key].annual)}
            </div>
          </div>
        </div>
      ))}
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
        className="flex min-h-24 flex-col items-center justify-center gap-1 border border-[#eadfce] bg-[#fffdf8] px-1 py-3 text-center text-[#aa9f93]"
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
