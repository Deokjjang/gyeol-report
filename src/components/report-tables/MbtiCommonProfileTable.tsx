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
        "max-w-full overflow-hidden rounded-lg border border-[#d8d1c4] bg-[#fffdf8] shadow-[0_14px_46px_rgba(42,31,24,0.07)]",
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 bg-[#231c1a] px-4 py-3 text-left text-white transition-colors hover:bg-[#342623]"
      >
        <span className="min-w-0 text-base font-extrabold leading-6 break-keep">
          {data.type} {data.titleKo}
        </span>
        <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold">
          {isOpen ? "접기" : "펼치기"}
        </span>
      </button>

      {isOpen ? (
        <div id={contentId} className="divide-y divide-[#eadfce]">
          <TypeHeader data={data} />
          <PreferenceAxesComparison data={data} />
          <FunctionStackTable data={data} />
          <CoreSummary data={data} />
          <KeywordSection
            title="가까운 키워드"
            keywords={data.closeKeywords}
            chipClassName="border-[#d7b56d] bg-[#fff8ea] text-[#5a4633]"
          />
          <KeywordSection
            title="먼 키워드"
            keywords={data.farKeywords}
            chipClassName="border-[#d8d1c4] bg-[#f8f4ed] text-[#6f675d]"
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
    <header className="space-y-3 bg-[#fffaf3] px-4 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-[#231c1a] px-2.5 py-1 text-sm font-extrabold text-white">
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
  );
}

function PreferenceAxesComparison({
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
        "flex min-h-16 items-center justify-center border-l border-[#eadfce] px-1 text-2xl font-extrabold first:border-l-0",
        option.selected
          ? "mbti-preference-selected bg-[#8a2550] text-white"
          : "bg-[#231c1a] text-white",
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
        "flex min-h-16 min-w-0 flex-col justify-center gap-1 border-l border-[#eadfce] px-1.5 py-2 text-center [overflow-wrap:anywhere] sm:px-2",
        option.selected
          ? "mbti-preference-selected bg-[#8a2550] text-white"
          : "bg-[#fffdf8] text-[#3a2f29]",
      )}
    >
      <span className="min-w-0 text-[13px] font-extrabold sm:text-sm">
        {option.nameKo} {option.nameEn}
      </span>
      <span className="text-[11px] leading-5 sm:text-xs">{option.description}</span>
    </div>
  );
}

function FunctionStackTable({
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
          <thead>
            <tr className="bg-[#efe6d8] text-xs font-bold text-[#6f675d]">
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
          <tbody className="divide-y divide-[#eadfce]">
            {data.functionRows.map((row) => (
              <tr key={row.position}>
                <th
                  scope="row"
                  className="bg-[#8a2550] px-2 py-3 text-center text-sm font-extrabold text-white"
                >
                  {row.label}
                </th>
                <td className="px-2 py-3 text-center text-2xl font-extrabold text-[#201a18]">
                  {row.code}
                </td>
                <td className="space-y-1 px-2 py-3 text-[#51453d]">
                  <p className="font-extrabold text-[#201a18]">
                    {row.nameKo}
                  </p>
                  <p className="text-xs font-bold text-[#8b8174]">
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
    <div className="bg-[#fffdf8]">
      <h3 className="bg-[#f5efe5] px-4 py-2 text-sm font-extrabold text-[#5a4633]">
        핵심 요약
      </h3>
      <dl className="grid gap-3 px-4 py-4">
        {data.coreSummary.map((item) => (
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
    <div className="bg-[#fffdf8] px-4 py-4">
      <h3 className="text-sm font-extrabold text-[#5a4633]">{title}</h3>
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
          <span className="text-sm font-bold text-[#b7ab9a]" aria-label="정보 없음">-</span>
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
    <div className="bg-[#fffdf8]">
      <h3 className="bg-[#f5efe5] px-4 py-2 text-sm font-extrabold text-[#5a4633]">
        리포트 활용 포인트
      </h3>
      <div className="grid gap-3 px-4 py-4">
        {notes.length > 0 ? (
          notes.slice(0, 5).map((note, index) => (
            <article
              key={`${note.categoryKey}-${note.id ?? index}`}
              className="space-y-2 border-b border-[#eadfce] pb-3 last:border-b-0 last:pb-0"
            >
              <h4 className="text-sm font-extrabold text-[#201a18]">
                {note.label}
              </h4>
              <UsageLine text={note.plainKo} />
              <UsageLine text={note.strongLine} />
              <UsageLine text={note.positiveUse} />
              <UsageLine text={note.risk} />
            </article>
          ))
        ) : (
          <p className="text-sm font-bold text-[#b7ab9a]" aria-label="정보 없음">-</p>
        )}
      </div>
    </div>
  );
}

function UsageLine({ text }: { readonly text: string | null }) {
  if (!text) {
    return null;
  }

  return <p className="text-sm leading-6 text-[#6f675d] break-keep">{text}</p>;
}

function joinClassNames(
  ...classNames: readonly (string | undefined | false)[]
): string {
  return classNames.filter(Boolean).join(" ");
}
