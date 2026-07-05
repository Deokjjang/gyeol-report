"use client";

import { useId, useState } from "react";

import type {
  CompatibilityConnectionSummaryData,
  CompatibilityPersonTableData,
  CompatibilityRelationCategory,
  CompatibilityTableData,
  ManseRyeokCommonTableData,
  ManseRyeokStemBranchCell,
  MbtiCommonProfileTableData,
  ReportTableElementColorToken,
} from "../../lib/report-tables/types";

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

const COMPACT_ELEMENT_CARD_CLASS_BY_TOKEN = {
  "wood-green": "border-emerald-200 bg-emerald-100/90 text-emerald-950",
  "fire-red": "border-rose-200 bg-rose-100/90 text-rose-950",
  "earth-soil": "border-amber-200 bg-amber-100/90 text-amber-950",
  "metal-gold": "border-stone-200 bg-stone-100/90 text-stone-950",
  "water-sky": "border-sky-200 bg-sky-100/90 text-sky-950",
} as const satisfies Record<ReportTableElementColorToken, string>;

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
        "overflow-hidden rounded-lg border border-[#d8d1c4] bg-[#fffdf8] shadow-[0_18px_50px_rgba(42,31,24,0.08)]",
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
        <span className="shrink-0 text-sm font-bold">
          {isOpen ? "접기" : "펼치기"}
        </span>
      </button>

      {isOpen ? (
        <div id={contentId} className="divide-y divide-[#eadfce]">
          <header className="bg-[#fffaf3] px-4 py-4">
            <span className="rounded-md border border-[#d7b56d]/40 bg-[#fff8ea] px-2.5 py-1 text-sm font-extrabold text-[#5a4633]">
              {relationCategoryLabel}
            </span>
          </header>

          <PersonTableBlock person={data.personA} />
          <CompatibilityConnectionBridge
            personA={data.personA}
            personB={data.personB}
            summary={data.connectionSummary}
          />
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
    <section className="space-y-3 bg-[#fffaf3] px-3 py-4 sm:px-4">
      <PersonSummary person={person} />
      <CompatibilityManseCompactPanel data={person.manseRyeok} />
      {person.mbti === null ? (
        <EmptySubTable title={`${person.label} MBTI표`} />
      ) : (
        <CompatibilityMbtiCompactPanel data={person.mbti} />
      )}
    </section>
  );
}

function CompatibilityManseCompactPanel({
  data,
}: {
  readonly data: ManseRyeokCommonTableData;
}) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const detailContentId = useId();
  const visibleDetailRows = data.detailRows.filter((row) =>
    data.columns.some((column) => row.cells[column.key].length > 0),
  );

  return (
    <section className="max-w-full overflow-hidden rounded-lg border border-[#d8d1c4] bg-[#fffdf8] shadow-[0_14px_46px_rgba(42,31,24,0.07)]">
      <header className="bg-[#7f1d38] px-4 py-3 text-white">
        <h3 className="text-base font-extrabold leading-6 break-keep">
          {data.title}
        </h3>
      </header>

      <div className="divide-y divide-[#eadfce]">
        <div className="grid grid-cols-4 bg-[#fffaf3] text-center text-sm font-extrabold text-[#5a4633]">
          {data.columns.map((column) => (
            <div key={column.key} className="px-2 py-2">
              {column.label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-px bg-[#f5efe5]">
          {data.columns.map((column) => (
            <CompactStemBranchCard
              key={`stem-${column.key}`}
              cell={data.stemRow[column.key]}
              ariaLabel={`${column.label} 천간`}
            />
          ))}
        </div>

        <div className="grid grid-cols-4 gap-px bg-[#f5efe5]">
          {data.columns.map((column) => (
            <CompactStemBranchCard
              key={`branch-${column.key}`}
              cell={data.branchRow[column.key]}
              ariaLabel={`${column.label} 지지`}
            />
          ))}
        </div>

        {visibleDetailRows.length === 0 ? null : (
          <div className="bg-[#fffdf8] px-4 py-3">
            <button
              type="button"
              aria-expanded={isDetailOpen}
              aria-controls={detailContentId}
              onClick={() => setIsDetailOpen((current) => !current)}
              className="inline-flex w-full items-center justify-center rounded-md border border-[#d8d1c4] bg-[#fffaf3] px-3 py-2 text-sm font-extrabold text-[#5a4633] transition-colors hover:bg-[#f5efe5] sm:w-auto"
            >
              {isDetailOpen
                ? "지장간·신살·합충 상세 접기"
                : "지장간·신살·합충 상세 보기"}
            </button>
          </div>
        )}

        {isDetailOpen ? (
          <div id={detailContentId} className="divide-y divide-[#eadfce]">
            {visibleDetailRows.map((row) => (
              <div key={row.key} className="bg-[#fffdf8]">
                <h4 className="bg-[#f5efe5] px-3 py-2 text-center text-xs font-extrabold text-[#7a6f63]">
                  {row.label}
                </h4>
                <div className="grid grid-cols-4 text-center text-xs leading-5 text-[#5d544d]">
                  {data.columns.map((column) => (
                    <div
                      key={`${row.key}-${column.key}`}
                      className="min-h-10 border-l border-[#efe6d8] px-1.5 py-2 first:border-l-0 break-keep"
                    >
                      {formatDetailValues(row.cells[column.key])}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function CompactStemBranchCard({
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
        className="flex min-h-20 flex-col items-center justify-center gap-1 border border-[#efe6d8] bg-[#f8f4ed] px-1 py-3 text-center text-[#b7ab9a]"
      >
        <span className="text-sm font-bold" aria-label="정보 없음">
          -
        </span>
      </div>
    );
  }

  return (
    <div
      aria-label={ariaLabel}
      className={joinClassNames(
        "flex min-h-20 flex-col items-center justify-center gap-1 border px-1 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
        COMPACT_ELEMENT_CARD_CLASS_BY_TOKEN[cell.colorToken],
      )}
    >
      <span className="text-2xl font-extrabold leading-none">{cell.hanja}</span>
      <span className="text-[11px] font-semibold leading-4">{cell.ko}</span>
      {cell.tenGod === null ? null : (
        <span className="text-[11px] font-bold leading-4">{cell.tenGod}</span>
      )}
    </div>
  );
}

function CompatibilityMbtiCompactPanel({
  data,
}: {
  readonly data: MbtiCommonProfileTableData;
}) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const detailContentId = useId();

  return (
    <section className="max-w-full overflow-hidden rounded-lg border border-[#d8d1c4] bg-[#fffdf8] shadow-[0_14px_46px_rgba(42,31,24,0.07)]">
      <header className="space-y-3 bg-[#fffaf3] px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-[#d7b56d]/50 bg-[#fff8ea] px-2.5 py-1 text-sm font-extrabold text-[#7f1d38]">
            {data.type}
          </span>
          <span className="text-base font-extrabold text-[#201a18]">
            {data.titleKo}
          </span>
        </div>
        <p className="text-sm font-bold leading-6 text-[#3a2f29] break-keep">
          {data.archetype}
        </p>
        <p className="text-sm leading-6 text-[#6f675d] break-keep">
          {data.oneLine}
        </p>
      </header>

      <div className="divide-y divide-[#eadfce]">
        <CompatibilityMbtiCoreSummary data={data} />
        <CompatibilityMbtiKeywords
          title="가까운 키워드"
          keywords={data.closeKeywords}
          chipClassName="border-[#d7b56d] bg-[#fff8ea] text-[#5a4633]"
        />
        <CompatibilityMbtiKeywords
          title="먼 키워드"
          keywords={data.farKeywords}
          chipClassName="border-[#d8d1c4] bg-[#f8f4ed] text-[#6f675d]"
        />
        <div className="bg-[#fffdf8] px-4 py-3">
          <button
            type="button"
            aria-expanded={isDetailOpen}
            aria-controls={detailContentId}
            onClick={() => setIsDetailOpen((current) => !current)}
            className="inline-flex w-full items-center justify-center rounded-md border border-[#d8d1c4] bg-[#fffaf3] px-3 py-2 text-sm font-extrabold text-[#5a4633] transition-colors hover:bg-[#f5efe5] sm:w-auto"
          >
            {isDetailOpen
              ? "선호 지표와 기능 서열 접기"
              : "선호 지표와 기능 서열 자세히 보기"}
          </button>
        </div>
        {isDetailOpen ? (
          <div id={detailContentId} className="divide-y divide-[#eadfce]">
            <CompatibilityMbtiPreferenceRows data={data} />
            <CompatibilityMbtiFunctionRows data={data} />
            <CompatibilityMbtiUsageNotes data={data} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function CompatibilityMbtiCoreSummary({
  data,
}: {
  readonly data: MbtiCommonProfileTableData;
}) {
  return (
    <div className="bg-[#fffdf8]">
      <h3 className="bg-[#f5efe5] px-4 py-2 text-sm font-extrabold text-[#5a4633]">
        핵심 요약
      </h3>
      <dl className="grid gap-3 px-4 py-4">
        {data.coreSummary.slice(0, 3).map((item) => (
          <div key={item.key} className="grid gap-1">
            <dt className="text-sm font-extrabold text-[#201a18]">
              {item.label}
            </dt>
            <dd className="text-sm leading-6 text-[#6f675d] break-keep">
              {item.text}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function CompatibilityMbtiKeywords({
  title,
  keywords,
  chipClassName,
}: {
  readonly title: string;
  readonly keywords: readonly string[];
  readonly chipClassName: string;
}) {
  if (keywords.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#fffdf8] px-4 py-4">
      <h3 className="text-sm font-extrabold text-[#5a4633]">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {keywords.slice(0, 6).map((keyword) => (
          <span
            key={keyword}
            className={joinClassNames(
              "rounded-full border px-3 py-1 text-xs font-bold break-keep",
              chipClassName,
            )}
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}

function CompatibilityMbtiPreferenceRows({
  data,
}: {
  readonly data: MbtiCommonProfileTableData;
}) {
  return (
    <div className="bg-[#fffdf8]">
      <h3 className="bg-[#f5efe5] px-4 py-2 text-sm font-extrabold text-[#5a4633]">
        선호 지표 비교
      </h3>
      <div className="divide-y divide-[#eadfce]">
        {data.preferenceRows.map((row) => (
          <div
            key={row.axisKey}
            className="grid grid-cols-[2.35rem_minmax(0,1fr)_minmax(0,1fr)_2.35rem] text-center text-sm sm:grid-cols-[2.75rem_minmax(0,1fr)_minmax(0,1fr)_2.75rem]"
          >
            {[row.left, row.right].map((option) => (
              <div
                key={`${row.axisKey}-${option.code}`}
                aria-current={option.selected ? "true" : undefined}
                className={joinClassNames(
                  "col-span-2 flex min-h-16 min-w-0 flex-col justify-center gap-1 border-l border-[#eadfce] px-1.5 py-2 text-center [overflow-wrap:anywhere] first:border-l-0 sm:px-2",
                  option.selected
                    ? "bg-[#8a2550] text-white"
                    : "bg-[#fffdf8] text-[#3a2f29]",
                )}
              >
                <span className="min-w-0 text-[13px] font-extrabold sm:text-sm">
                  {option.code} · {option.nameKo}
                </span>
                <span className="text-[11px] leading-5 sm:text-xs">
                  {option.description}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function CompatibilityMbtiFunctionRows({
  data,
}: {
  readonly data: MbtiCommonProfileTableData;
}) {
  return (
    <div className="bg-[#fffdf8]">
      <h3 className="bg-[#f5efe5] px-4 py-2 text-sm font-extrabold text-[#5a4633]">
        기능 서열
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <tbody className="divide-y divide-[#eadfce]">
            {data.functionRows.map((row) => (
              <tr key={row.position}>
                <th
                  scope="row"
                  className="w-[5.5rem] bg-[#8a2550] px-2 py-3 text-center text-sm font-extrabold text-white"
                >
                  {row.label}
                </th>
                <td className="w-[4rem] px-2 py-3 text-center text-2xl font-extrabold text-[#201a18]">
                  {row.code}
                </td>
                <td className="space-y-1 px-2 py-3 text-[#51453d]">
                  <p className="font-extrabold text-[#201a18]">
                    {row.nameKo}
                  </p>
                  <p className="leading-6 break-keep">{row.description}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompatibilityMbtiUsageNotes({
  data,
}: {
  readonly data: MbtiCommonProfileTableData;
}) {
  if (data.reportUsageNotes.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#fffdf8] px-4 py-4">
      <h3 className="text-sm font-extrabold text-[#5a4633]">
        리포트 활용 포인트
      </h3>
      <div className="mt-3 grid gap-3">
        {data.reportUsageNotes.map((note) => (
          <article
            key={`${note.categoryKey}-${note.id}`}
            className="rounded-lg border border-[#eadfce] bg-[#fffaf3] px-3 py-3"
          >
            <p className="text-sm font-extrabold text-[#201a18]">
              {note.label}
            </p>
            <p className="mt-1 text-sm leading-6 text-[#6f675d] break-keep">
              {note.plainKo}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function PersonSummary({
  person,
}: {
  readonly person: CompatibilityPersonTableData;
}) {
  return (
    <div className="rounded-lg border border-[#eadfce] bg-[#fffdf8] px-4 py-3">
      <p className="text-xs font-extrabold text-[#7b6a58] break-keep">
        {person.label} 사람 요약
      </p>
      <p className="mt-1 text-base font-extrabold text-[#201a18] break-keep">
        {person.displayName ?? "-"}
      </p>
    </div>
  );
}

function CompatibilityConnectionBridge({
  personA,
  personB,
  summary,
}: {
  readonly personA: CompatibilityPersonTableData;
  readonly personB: CompatibilityPersonTableData;
  readonly summary: CompatibilityConnectionSummaryData;
}) {
  const headline =
    summary.compatibilityHeadline ?? summary.overallTone ?? "두 사람 연결 지점";

  return (
    <section className="bg-[#fffaf3] px-4 py-5" aria-label="두 사람 연결 표시">
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
        <div className="flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-[#d8c6a4]" />
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#d7b56d] bg-[#fff8ea] text-4xl font-black text-[#7f1d38] shadow-sm">
            ♡
          </span>
          <span className="h-px flex-1 bg-[#d8c6a4]" />
        </div>
        <p className="text-sm font-extrabold text-[#7f1d38]">
          {personA.label} × {personB.label} · 두 사람 연결
        </p>
        <p className="max-w-sm text-sm font-bold leading-6 text-[#3a2f29] break-keep">
          {headline}
        </p>
      </div>
    </section>
  );
}

export function ConnectionSummaryTable({
  data,
}: {
  readonly data: CompatibilityConnectionSummaryData;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#d8d1c4] bg-[#fffdf8] shadow-sm">
      <h3 className="bg-[#fff8ea] px-4 py-2 text-center text-sm font-extrabold text-[#7f1d38]">
        두 사람 연결 요약
      </h3>
      <dl className="grid gap-0 divide-y divide-[#eadfce]">
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
      <dt className="font-extrabold text-[#5a4633]">{label}</dt>
      <dd className="leading-6 text-[#3a2f29] break-keep">
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
              className="rounded-full border border-[#eadfce] bg-[#fff8ea] px-2.5 py-1 text-xs font-bold text-[#7f1d38] break-keep"
            >
              {value}
            </span>
          ))
        ) : (
          <span className="text-sm font-bold text-[#9a8a76]">-</span>
        )}
      </dd>
    </div>
  );
}

function EmptySubTable({ title }: { readonly title: string }) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#d8d1c4] bg-[#fffdf8] shadow-sm">
      <div className="bg-[#fff8ea] px-4 py-3 text-base font-extrabold text-[#7f1d38]">
        {title}
      </div>
      <div className="px-4 py-4 text-sm font-bold text-[#9a8a76]">-</div>
    </section>
  );
}

function formatDetailValues(values: readonly string[] | undefined): string {
  return values && values.length > 0 ? values.join(" · ") : "-";
}

function formatText(value: string | null): string {
  return value && value.length > 0 ? value : "-";
}

function joinClassNames(
  ...classNames: readonly (string | undefined | false)[]
): string {
  return classNames.filter(Boolean).join(" ");
}
