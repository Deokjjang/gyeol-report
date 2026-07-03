"use client";

import { useId, useState } from "react";

import type {
  MbtiCommonProfileTableData,
  MbtiPreferenceAxisOption,
  MbtiReportUsageNote,
} from "../../lib/report-tables/types";

type MbtiCommonProfileTableProps = {
  readonly data: MbtiCommonProfileTableData;
  readonly defaultOpen?: boolean;
  readonly className?: string;
};

export default function MbtiCommonProfileTable({
  data,
  defaultOpen = true,
  className,
}: MbtiCommonProfileTableProps) {
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
        className="flex w-full items-center justify-between gap-3 bg-neutral-950 px-4 py-3 text-left text-white"
      >
        <span className="min-w-0 text-base font-extrabold leading-6 break-keep">
          {data.type} {data.titleKo}
        </span>
        <span className="shrink-0 text-sm font-bold">
          {isOpen ? "접기" : "펼치기"}
        </span>
      </button>

      {isOpen ? (
        <div id={contentId} className="divide-y divide-neutral-100">
          <TypeHeader data={data} />
          <PreferenceAxesComparison data={data} />
          <FunctionStackTable data={data} />
          <CoreSummary data={data} />
          <KeywordSection
            title="가까운 키워드"
            keywords={data.closeKeywords}
            chipClassName="border-emerald-200 bg-emerald-50 text-emerald-800"
          />
          <KeywordSection
            title="먼 키워드"
            keywords={data.farKeywords}
            chipClassName="border-neutral-200 bg-neutral-50 text-neutral-600"
          />
          <ReportUsageNotes notes={data.reportUsageNotes} />
        </div>
      ) : null}
    </section>
  );
}

function TypeHeader({
  data,
}: {
  readonly data: MbtiCommonProfileTableData;
}) {
  return (
    <header className="space-y-3 bg-white px-4 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-neutral-950 px-2.5 py-1 text-sm font-extrabold text-white">
          {data.type}
        </span>
        <span className="text-base font-extrabold text-neutral-950">
          {data.titleKo}
        </span>
      </div>
      <p className="text-sm font-bold leading-6 text-neutral-800 break-keep">
        {data.archetype}
      </p>
      <p className="text-sm leading-6 text-neutral-600 break-keep">
        {data.oneLine}
      </p>
    </header>
  );
}

function PreferenceAxesComparison({
  data,
}: {
  readonly data: MbtiCommonProfileTableData;
}) {
  return (
    <div className="bg-white">
      <h3 className="bg-neutral-50 px-4 py-2 text-sm font-extrabold text-neutral-700">
        선호 지표 비교
      </h3>
      <div className="divide-y divide-neutral-100">
        {data.preferenceRows.map((row) => (
          <div
            key={row.axisKey}
            className="grid grid-cols-[2.75rem_minmax(0,1fr)_minmax(0,1fr)_2.75rem] text-center text-sm"
          >
            <PreferenceCodeCell option={row.left} />
            <PreferenceDescriptionCell option={row.left} />
            <PreferenceDescriptionCell option={row.right} />
            <PreferenceCodeCell option={row.right} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PreferenceCodeCell({
  option,
}: {
  readonly option: MbtiPreferenceAxisOption;
}) {
  return (
    <div
      aria-current={option.selected ? "true" : undefined}
      className={joinClassNames(
        "flex min-h-16 items-center justify-center border-l border-neutral-100 px-1 text-2xl font-extrabold first:border-l-0",
        option.selected
          ? "mbti-preference-selected bg-rose-700 text-white"
          : "bg-neutral-950 text-white",
      )}
    >
      {option.code}
    </div>
  );
}

function PreferenceDescriptionCell({
  option,
}: {
  readonly option: MbtiPreferenceAxisOption;
}) {
  return (
    <div
      aria-current={option.selected ? "true" : undefined}
      className={joinClassNames(
        "flex min-h-16 flex-col justify-center gap-1 border-l border-neutral-100 px-2 py-2 text-center break-keep",
        option.selected
          ? "mbti-preference-selected bg-rose-700 text-white"
          : "bg-white text-neutral-800",
      )}
    >
      <span className="text-sm font-extrabold">
        {option.nameKo} {option.nameEn}
      </span>
      <span className="text-xs leading-5">{option.description}</span>
    </div>
  );
}

function FunctionStackTable({
  data,
}: {
  readonly data: MbtiCommonProfileTableData;
}) {
  return (
    <div className="bg-white">
      <h3 className="bg-neutral-50 px-4 py-2 text-sm font-extrabold text-neutral-700">
        기능 서열
      </h3>
      <div className="overflow-hidden">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <thead>
            <tr className="bg-neutral-100 text-xs font-bold text-neutral-600">
              <th scope="col" className="w-[5.5rem] px-2 py-2 text-center">
                순서
              </th>
              <th scope="col" className="w-[4rem] px-2 py-2 text-center">
                기능
              </th>
              <th scope="col" className="px-2 py-2">
                설명
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {data.functionRows.map((row) => (
              <tr key={row.position}>
                <th
                  scope="row"
                  className="bg-rose-700 px-2 py-3 text-center text-sm font-extrabold text-white"
                >
                  {row.label}
                </th>
                <td className="px-2 py-3 text-center text-2xl font-extrabold text-neutral-900">
                  {row.code}
                </td>
                <td className="space-y-1 px-2 py-3 text-neutral-700">
                  <p className="font-extrabold text-neutral-900">
                    {row.nameKo}
                  </p>
                  <p className="text-xs font-bold text-neutral-500">
                    {row.attitude} · {row.domain}
                  </p>
                  <p className="text-sm leading-6 break-keep">
                    {row.description}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CoreSummary({
  data,
}: {
  readonly data: MbtiCommonProfileTableData;
}) {
  return (
    <div className="bg-white">
      <h3 className="bg-neutral-50 px-4 py-2 text-sm font-extrabold text-neutral-700">
        핵심 요약
      </h3>
      <dl className="grid gap-3 px-4 py-4">
        {data.coreSummary.map((item) => (
          <div key={item.key} className="grid gap-1">
            <dt className="text-sm font-extrabold text-neutral-900">
              {item.label}
            </dt>
            <dd className="text-sm leading-6 text-neutral-600 break-keep">
              {item.text}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function KeywordSection({
  title,
  keywords,
  chipClassName,
}: {
  readonly title: string;
  readonly keywords: readonly string[];
  readonly chipClassName: string;
}) {
  return (
    <div className="bg-white px-4 py-4">
      <h3 className="text-sm font-extrabold text-neutral-700">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {keywords.length > 0 ? (
          keywords.map((keyword) => (
            <span
              key={keyword}
              className={joinClassNames(
                "rounded-full border px-3 py-1 text-xs font-bold break-keep",
                chipClassName,
              )}
            >
              {keyword}
            </span>
          ))
        ) : (
          <span className="text-sm font-bold text-neutral-400">-</span>
        )}
      </div>
    </div>
  );
}

function ReportUsageNotes({
  notes,
}: {
  readonly notes: readonly MbtiReportUsageNote[];
}) {
  return (
    <div className="bg-white">
      <h3 className="bg-neutral-50 px-4 py-2 text-sm font-extrabold text-neutral-700">
        리포트 활용 포인트
      </h3>
      <div className="grid gap-3 px-4 py-4">
        {notes.length > 0 ? (
          notes.map((note, index) => (
            <article
              key={`${note.categoryKey}-${note.id ?? index}`}
              className="space-y-2 border-b border-neutral-100 pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-bold text-neutral-600">
                  {note.categoryKey}
                </span>
                <h4 className="text-sm font-extrabold text-neutral-950">
                  {note.label}
                </h4>
              </div>
              <UsageLine text={note.plainKo} />
              <UsageLine text={note.strongLine} />
              <UsageLine text={note.positiveUse} />
              <UsageLine text={note.risk} />
              {note.productDomains.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {note.productDomains.map((domain) => (
                    <span
                      key={domain}
                      className="rounded-full bg-neutral-50 px-2 py-0.5 text-[11px] font-bold text-neutral-500"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))
        ) : (
          <p className="text-sm font-bold text-neutral-400">-</p>
        )}
      </div>
    </div>
  );
}

function UsageLine({ text }: { readonly text: string | null }) {
  if (!text) {
    return null;
  }

  return <p className="text-sm leading-6 text-neutral-600 break-keep">{text}</p>;
}

function joinClassNames(
  ...classNames: readonly (string | undefined | false)[]
): string {
  return classNames.filter(Boolean).join(" ");
}
