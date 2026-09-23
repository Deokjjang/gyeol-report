import { publicationBirthTimeContexts } from "../../../lib/report-generation/birthTimePublication";
import { ReportCover, ReportContents } from "../../../components/report/ReportReadingFrame";
import readingStyles from "../../../components/report/reportReading.module.css";
import { validateProductPublication } from "../../../lib/report-generation/productPublishGate";
import {
  ManseRyeokCommonTable,
  MbtiCommonProfileTable,
} from "../../../components/report-tables";
import {
  buildManseRyeokCommonTableData,
  buildMbtiCommonProfileTableData,
  getMbtiSourceByType,
  type ManseRyeokFourPillarGridColumnInput,
} from "../../../lib/report-tables";
import type {
  ComprehensiveReportV2Draft,
  ComprehensiveReportV2PillarGridColumn,
  ComprehensiveReportV2ProfileTable,
} from "../../../lib/report-generation/comprehensiveReportDraftTypes";
import { getSajuBranchSymbolEntry } from "../../../lib/report-knowledge/sajuBranchSymbolKnowledge";

type ComprehensiveReportV2ViewProps = {
  readonly draft: ComprehensiveReportV2Draft;
  readonly evidencePacket?: unknown;
  readonly reportId?: string;
  readonly displayName?: string;
};

type FiveElementEnergyItem = {
  readonly element: "wood" | "fire" | "earth" | "metal" | "water";
  readonly label: string;
  readonly count: number;
  readonly title: string;
  readonly body: string;
  readonly practicalUse: string;
};

type SajuFeatureChapterItem = NonNullable<
  ComprehensiveReportV2Draft["sajuFeatureChapter"]
>["items"][number];

const stemHanjaByValue = {
  갑: "甲",
  甲: "甲",
  을: "乙",
  乙: "乙",
  병: "丙",
  丙: "丙",
  정: "丁",
  丁: "丁",
  무: "戊",
  戊: "戊",
  기: "己",
  己: "己",
  경: "庚",
  庚: "庚",
  신: "辛",
  辛: "辛",
  임: "壬",
  壬: "壬",
  계: "癸",
  癸: "癸",
} as const;

export function ComprehensiveReportV2View({
  draft,
  displayName,
  evidencePacket,
}: ComprehensiveReportV2ViewProps) {
  if (evidencePacket !== undefined && !validateProductPublication("saju_mbti_full", draft, evidencePacket).ok) {
    return <p>리포트를 준비하고 있습니다. 잠시 후 다시 확인해 주세요.</p>;
  }
  const birthTimeContext = publicationBirthTimeContexts(evidencePacket)?.person;
  const manseRyeokTableData = buildManseRyeokTableData({
    allowUnknownHour: birthTimeContext?.birthTimePrecision === "unknown",
    profile: draft.profileTable,
    displayName,
  });
  const mbtiTableData = buildMbtiTableData(draft.profileTable);
  const actionGuideLines = buildActionGuideLines(draft);
  const fiveElementEnergyItems = buildFiveElementEnergyItems(draft.profileTable);
  const fiveElementEnergySummary = fiveElementEnergyItems
    .map((item) => `${item.label} ${item.count}`)
    .join(" · ");
  const featureItems = draft.sajuFeatureChapter?.items ?? [];
  const detailedFeatureItems = featureItems.filter((item,index)=>index<3 || isDetailedFeatureLabel(item.rawLabel));
  const quickFeatureItems = featureItems.filter(item=>!detailedFeatureItems.includes(item));
  const groupedQuickFeatureItems = groupQuickFeatureItems(quickFeatureItems);
  const coreReadings = (draft.longformReadings ?? []).filter(r=>r.readingId === "opening");
  const visibleLongformReadings = (draft.longformReadings ?? []).filter(r=>r.readingId !== "opening");

  return (
    <article className="min-w-0 overflow-hidden rounded-[8px] border border-[#ded2c2] bg-[#fffdf8] text-[#2b211b] shadow-[0_18px_60px_rgba(68,44,28,0.10)]">
      <ReportCover product="사주×MBTI 종합 리포트" title={draft.openingTitle} summary={draft.openingSummary} core={draft.coreLine} />
      <ReportContents items={[
        { id: "report-core", label: "나를 관통하는 핵심 결" },
        { id: "report-foundation", label: "나의 원국과 행동 성향" },
        ...(fiveElementEnergyItems.length ? [{ id: "report-elements", label: "오행의 균형" }] : []),
        ...(draft.sajuFeatureChapter ? [{ id: "report-features", label: "명리 특징" }] : []),
        { id: "report-readings", label: "나의 이야기" },
        { id: "report-actions", label: "오늘부터 바꿀 기준" },
        { id: "report-conclusion", label: "마지막 정리" },
      ]} />

      <div className="space-y-8">
        {coreReadings.map(reading=>(
          <section key={reading.readingId} id="report-core" tabIndex={-1} data-reading-section="" className={`space-y-4 p-4 sm:p-5 ${readingStyles.prose}`} aria-label="나를 관통하는 핵심 결">
            <h2 className="text-2xl font-extrabold">{reading.titleKo}</h2>
            <LongformBody body={reading.body} />
          </section>
        ))}
        <section id="report-foundation" tabIndex={-1} className="space-y-4" aria-label="기초 정보">
          <SectionHeading
            title="기초 정보"
            body="만세력표와 MBTI 성향표는 해석의 근거입니다. 신살·귀인·합충·지장간의 의미는 아래 본문에서 따로 풀어 읽습니다."
          />
          {birthTimeContext?.birthTimePrecision === "unknown" && <CompactNotice message="출생시간 모름으로 시주는 확정하지 않았습니다. 연·월·일주를 기준으로 읽어 주세요." />}
          {birthTimeContext?.birthTimePrecision === "approximate" && <CompactNotice message="선택한 시간대 전체에서 동일한 기둥을 확인했습니다. 정확한 출생시각을 확정한 것은 아닙니다." />}
          <div className="grid min-w-0 gap-4">
            {manseRyeokTableData === null ? (
              <CompactNotice message="만세력표는 시주·일주·월주·연주가 모두 연결된 결과에서 표시됩니다." />
            ) : (
              <ManseRyeokCommonTable
                data={manseRyeokTableData}
                defaultOpen={true}
                className="min-w-0"
              />
            )}
            {mbtiTableData === null ? (
              <CompactNotice message="MBTI 성향표는 유효한 MBTI 입력값이 있는 결과에서 표시됩니다." />
            ) : (
              <MbtiCommonProfileTable
                data={mbtiTableData}
                defaultOpen={false}
                variant="compact"
                className="min-w-0"
              />
            )}
          </div>
        </section>

        {fiveElementEnergyItems.length === 0 ? null : (
          <section
            className="space-y-4"
            id="report-elements" tabIndex={-1} data-reading-section="" aria-label="오행 분포로 보는 에너지 구조"
          >
            <SectionHeading
              eyebrow="오행"
              title="오행 분포로 보는 에너지 구조"
              body={`${fiveElementEnergySummary} 기준으로 보면, 이 표는 사건을 예언하는 표가 아니라 생활 에너지의 쏠림과 보완 지점을 보는 지도입니다.`}
            />
            <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {fiveElementEnergyItems.map((item) => (
                <article
                  key={item.element}
                  className="min-w-0 rounded-[8px] border border-[#eadfce] bg-white p-4"
                >
                  <p className="text-sm font-extrabold text-[#8b6d2d]">
                    {item.label} {item.count}
                  </p>
                  <h3 className="mt-2 text-base font-extrabold text-[#2b211b]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#4f433b]">
                    {item.body}
                  </p>
                  <p className="mt-3 text-sm font-bold leading-7 text-[#6f1d35]">
                    {item.practicalUse}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {draft.sajuFeatureChapter === undefined ? null : (
          <section className="space-y-4" id="report-features" tabIndex={-1} data-reading-section="" aria-label="명리 특징 해석">
            <SectionHeading
              eyebrow="본문 챕터"
              title="내 사주의 주요 표식 해석"
              body={draft.sajuFeatureChapter.intro}
            />
            <div className="grid min-w-0 gap-4">
              {detailedFeatureItems.map((item, index) => (
                <article
                  key={`${item.rawLabel}:${item.userTitle}`}
                  className="min-w-0 space-y-4 rounded-[8px] border border-[#eadfce] bg-[#fffaf3] p-4 sm:p-5"
                >
                  <div className="space-y-1">
                    <p className="inline-flex w-fit rounded-full border border-[#d7b56d] bg-[#fffdf8] px-2.5 py-1 text-xs font-extrabold text-[#8b6d2d]">
                      {buildFeatureCategoryLabel(item.rawLabel)}
                    </p>
                    <h3 className="text-xl font-extrabold text-[#2b211b]">
                      {item.rawLabel}
                    </h3>
                    <p className="text-base leading-8 text-[#4f433b]">
                      {item.userTitle}
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <FeatureText label="쉬운 뜻" body={item.plainMeaning} />
                    <FeatureText
                      label="나에게 드러나는 방식"
                      body={item.howItShowsInYou}
                    />
                    <FeatureText label="잘 쓰면 강점" body={item.strength} />
                    <FeatureText label="과하면 피로" body={item.fatiguePoint} />
                  </div>
                  <div className="rounded-[8px] border border-[#d7b56d] bg-[#fffdf8] p-4">
                    <p className="text-sm font-extrabold text-[#6f1d35]">
                      실제로 쓰는 법
                    </p>
                    <p className="mt-2 text-base leading-8 text-[#3a2f29]">
                      {item.practicalUse}
                    </p>
                    {detailedFeatureItems.findIndex(feature => buildFeatureClosingLine(feature.rawLabel) === buildFeatureClosingLine(item.rawLabel)) === index ? (
                      <p className="mt-3 border-t border-[#eadfce] pt-3 text-base font-bold leading-8 text-[#6f1d35]">
                        {buildFeatureClosingLine(item.rawLabel)}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
            {groupedQuickFeatureItems.length === 0 ? null : (
              <div className="space-y-3">
                <h3 className="text-xl font-extrabold text-[#2b211b]">
                  표식 빠른 해석
                </h3>
                <p className="text-sm leading-7 text-[#76685c]">
                  아래 표식은 사건 예언이 아니라 반복되는 반응과 생활 리듬을 보는 보조 신호입니다.
                </p>
                <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                  {groupedQuickFeatureItems.map((item) => (
                    <article
                      key={`${item.rawLabel}:${item.userTitle}:quick`}
                      className="min-w-0 rounded-[8px] border border-[#eadfce] bg-white p-4"
                    >
                      <p className="text-xs font-extrabold text-[#8b6d2d]">
                        {buildFeatureCategoryLabel(item.rawLabel)}
                      </p>
                      <h4 className="mt-1 text-base font-extrabold text-[#2b211b]">
                        {item.rawLabel}
                      </h4>
                      <p className="mt-2 text-sm leading-7 text-[#4f433b]">
                        {item.plainMeaning} {item.practicalUse}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <section className="space-y-4" id="report-readings" tabIndex={-1} data-reading-section="" aria-label="본문 해석">
          <SectionHeading
            eyebrow="본문"
            title="전체 성향 핵심부터 읽기"
            body="명리 구조와 MBTI 행동 발현이 실제 생활에서 어떻게 이어지는지 문단 중심으로 읽습니다."
          />
          <div className={readingStyles.prose}>
            {visibleLongformReadings.map((reading) => (
              <section
                key={reading.readingId}
                className="min-w-0 space-y-3 rounded-[8px] border border-[#eadfce] bg-white p-4 sm:p-5"
              >
                <h3 className="text-xl font-extrabold text-[#2b211b]">
                  {reading.titleKo}
                </h3>
                <LongformBody body={reading.body} />
              </section>
            ))}
          </div>
        </section>

        <section className="space-y-4" id="report-actions" tabIndex={-1} data-reading-section="" aria-label="오늘부터 바꿀 기준">
          <SectionHeading
            eyebrow="실행 기준"
            title="오늘부터 바꿀 기준"
            body="본문에서 반복된 내용을 다시 길게 풀지 않고, 바로 적용할 기준만 짧게 모았습니다."
          />
          {actionGuideLines.length === 0 ? null : (
            <ul className="grid min-w-0 gap-2 text-base leading-7 text-[#4f433b] sm:grid-cols-2">
              {actionGuideLines.map((line) => (
                <li
                  key={line}
                  className="min-w-0 break-words rounded-[8px] border border-[#eadfce] bg-[#fffaf3] px-4 py-3"
                >
                  {line}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="report-conclusion" tabIndex={-1} data-reading-section="" className="rounded-[8px] border border-[#d7b56d] bg-[#fffaf1] p-5">
          <h2 className="text-xl font-extrabold text-[#2b211b]">마지막 정리</h2>
          <p className="mt-3 text-base leading-8 text-[#4f433b]">
            {draft.finalAdvice}
          </p>
          {draft.safetyNotes.length === 0 ? null : (
            <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#76685c]">
              {draft.safetyNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </article>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  readonly eyebrow?: string;
  readonly title: string;
  readonly body: string;
}) {
  return (
    <div className="max-w-4xl space-y-2">
      {eyebrow === undefined ? null : (
        <p className="text-xs font-extrabold tracking-[0.16em] text-[#8b6d2d] uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-extrabold text-[#2b211b]">{title}</h2>
      <p className="text-base leading-8 text-[#5a4d42]">{body}</p>
    </div>
  );
}

function CompactNotice({ message }: { readonly message: string }) {
  return (
    <p className="rounded-[8px] border border-[#eadfce] bg-[#fffaf3] p-4 text-sm leading-6 text-[#76685c]">
      {message}
    </p>
  );
}

function FeatureText({
  label,
  body,
}: {
  readonly label: string;
  readonly body: string;
}) {
  return (
    <div className="min-w-0 rounded-[8px] border border-[#eadfce] bg-white p-3">
      <p className="text-xs font-extrabold text-[#8b6d2d]">{label}</p>
      <p className="mt-1 text-sm leading-7 text-[#4f433b]">{body}</p>
    </div>
  );
}

function LongformBody({ body }: { readonly body: string }) {
  const paragraphs = body
    .split(/\n{2,}/u)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  return (
    <div className="space-y-4 text-base leading-8 text-[#4f433b]">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="min-w-0 break-words">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function buildActionGuideLines(
  draft: ComprehensiveReportV2Draft,
): readonly string[] {
  return [...new Set(draft.chapters.find(chapter=>chapter.chapterId === "final_message")?.solutionLines ?? [])]
    .filter(line=>line.trim().length>0).slice(0, 6);
}

const fiveElementEnergyCopyByLabel = {
  목: {
    element: "wood",
   title: "방향성과 성장 의지",
   body:
      "목은 방향성과 성장을 앞으로 뻗게 하는 힘입니다. 목이 적당히 있으면 하고 싶은 방향을 잡고, 배워서 키우려는 마음이 살아납니다.",
    practicalUse:
      "목의 힘은 아이디어를 실제 계획으로 옮길 때 가장 잘 쓰입니다.",
  },
  화: {
    element: "fire",
    title: "표현 온도와 즐거움",
    body:
      "화는 말의 온도, 즐거움, 즉각적인 감정 표현입니다. 화가 비어 있으면 마음이 없어서가 아니라 따뜻하게 드러내는 속도가 늦을 수 있습니다.",
    practicalUse:
      "칭찬, 리액션, 가벼운 농담처럼 작은 표현을 의식적으로 만들어야 관계 온도가 살아납니다.",
  },
  토: {
    element: "earth",
    title: "책임과 현실 감각",
    body:
      "토는 현실을 붙잡고 쌓아 두는 힘입니다. 토가 강하면 책임감과 안정감은 좋지만, 맡은 일이 쌓이면 마음도 같이 무거워질 수 있습니다.",
    practicalUse:
      "맡을 일과 내려놓을 일을 나누지 않으면 성실함이 부담으로 바뀝니다.",
  },
  금: {
    element: "metal",
    title: "판단과 정리력",
    body:
      "금은 기준, 판단, 정리, 잘라내는 힘입니다. 금이 살아 있으면 틀린 구조와 애매한 기준을 빨리 알아차립니다.",
    practicalUse:
      "일에서는 품질 관리가 되지만, 관계에서는 말의 순서를 조절해야 평가처럼 들리지 않습니다.",
  },
  수: {
    element: "water",
    title: "회복과 감정 완충",
    body:
      "수는 생각을 식히고 감정을 완충하는 힘입니다. 수가 비어 있으면 쉬는 리듬이 자동으로 생기기보다 의식적으로 만들어야 합니다.",
    practicalUse:
      "밤 산책, 수면, 기록, 물 마시기처럼 머리를 식히는 루틴을 일정에 넣는 편이 좋습니다.",
  },
} as const satisfies Record<
  string,
  Omit<FiveElementEnergyItem, "label" | "count">
>;

function buildFiveElementEnergyItems(
  profile: ComprehensiveReportV2ProfileTable,
): readonly FiveElementEnergyItem[] {
  return profile.fiveElementSummary.flatMap((summary) => {
    const match = /^(목|화|토|금|수)\s*(\d+)/u.exec(summary.trim());

    if (match === null) {
      return [];
    }

    const label = match[1]! as keyof typeof fiveElementEnergyCopyByLabel;
    const copy = fiveElementEnergyCopyByLabel[label];

    return [{
      ...copy,
      label,
      count: Number(match[2]!),
    }];
  });
}

function groupQuickFeatureItems(
  items: readonly SajuFeatureChapterItem[],
): readonly SajuFeatureChapterItem[] {
  const hasHwagae = items.some((item) => item.rawLabel === "화개");
  const hasHwagaesal = items.some((item) => item.rawLabel === "화개살");

  if (!hasHwagae || !hasHwagaesal) {
    return items;
  }

  return items.flatMap((item) => {
    if (item.rawLabel === "화개살") {
      return [];
    }

    if (item.rawLabel === "화개") {
      return [{
        ...item,
        rawLabel: "화개·화개살",
        userTitle: "혼자 깊게 정리할 때 빛나는 표식입니다.",
      }];
    }

    return [item];
  });
}

function buildManseRyeokTableData(input: {
  readonly profile: ComprehensiveReportV2ProfileTable;
  readonly displayName?: string;
  readonly allowUnknownHour?: boolean;
}) {
  const profile = input.profile;
  const pillarGrid = profile.fourPillarGrid ?? getFallbackPillarGrid(profile);

  if (!hasCompletePillarGrid(pillarGrid, input.allowUnknownHour)) {
    return null;
  }

  return buildManseRyeokCommonTableData({
    ...(input.displayName === undefined
      ? { title: "나의 만세력" }
      : { displayName: input.displayName }),
    fourPillarGrid: normalizePillarGridForManseRyeokTable(pillarGrid),
  });
}

function buildMbtiTableData(profile: ComprehensiveReportV2ProfileTable) {
  const source = getMbtiSourceByType(profile.mbti);

  return source === null ? null : buildMbtiCommonProfileTableData(source);
}

function getFallbackPillarGrid(
  profile: ComprehensiveReportV2ProfileTable,
): readonly ComprehensiveReportV2PillarGridColumn[] {
  const createColumn = (
    columnId: ComprehensiveReportV2PillarGridColumn["columnId"],
    labelKo: string,
    pillar: string | undefined,
  ) => ({
    columnId,
    labelKo,
    ...(pillar === undefined ? {} : { pillar }),
  });

  return [
    createColumn("hour", "시주", profile.hourPillar),
    createColumn("day", "일주", profile.dayPillar),
    createColumn("month", "월주", profile.monthPillar),
    createColumn("year", "연주", profile.yearPillar),
  ].map((column) => ({
    ...column,
    ...splitProfilePillar(column.pillar),
  }));
}

function hasCompletePillarGrid(
  pillarGrid: readonly ComprehensiveReportV2PillarGridColumn[],
  allowUnknownHour = false,
): boolean {
  const requiredColumns = new Set(allowUnknownHour ? ["day", "month", "year"] : ["hour", "day", "month", "year"]);

  return pillarGrid.every((column) => {
    if (allowUnknownHour && column.columnId === "hour") return !column.pillar;
    const splitPillar = splitProfilePillar(column.pillar);
    const heavenlyStem = column.heavenlyStem ?? splitPillar.heavenlyStem;
    const earthlyBranch = column.earthlyBranch ?? splitPillar.earthlyBranch;

    requiredColumns.delete(column.columnId);

    return heavenlyStem !== undefined && earthlyBranch !== undefined;
  }) && requiredColumns.size === 0;
}

function splitProfilePillar(pillar: string | undefined) {
  if (pillar === undefined) {
    return {};
  }

  const normalized = pillar.replace("일주", "").trim();
  const characters = [...normalized];

  if (characters.length < 2) {
    return {};
  }

  return {
    heavenlyStem: characters[0]!,
    earthlyBranch: characters[1]!,
  };
}

function normalizePillarGridForManseRyeokTable(
  pillarGrid: readonly ComprehensiveReportV2PillarGridColumn[],
): readonly ManseRyeokFourPillarGridColumnInput[] {
  return pillarGrid.map((column) => {
    const splitPillar = splitProfilePillar(column.pillar);
    const heavenlyStem = normalizeStemHanjaForManseRyeokTable(
      column.heavenlyStem ?? splitPillar.heavenlyStem,
    );
    const earthlyBranch = normalizeBranchHanjaForManseRyeokTable(
      column.earthlyBranch ?? splitPillar.earthlyBranch,
    );

    return {
      ...column,
      ...(heavenlyStem === undefined ? {} : { heavenlyStem }),
      ...(earthlyBranch === undefined ? {} : { earthlyBranch }),
    };
  });
}

function normalizeStemHanjaForManseRyeokTable(
  stem: string | undefined,
): string | undefined {
  if (stem === undefined) {
    return undefined;
  }

  return stemHanjaByValue[stem.trim() as keyof typeof stemHanjaByValue] ?? stem;
}

function normalizeBranchHanjaForManseRyeokTable(
  branch: string | undefined,
): string | undefined {
  if (branch === undefined) {
    return undefined;
  }

  return getSajuBranchSymbolEntry(branch)?.branch ?? branch;
}

function buildFeatureClosingLine(rawLabel: string): string {
  if (rawLabel.includes("재고귀인")) {
    return "이 신호는 돈이 저절로 쌓인다는 뜻이 아니라, 들어온 자원을 새지 않게 구조화하라는 뜻입니다.";
  }
  if (rawLabel.includes("현침")) {
    return "이 신호는 말을 줄이라는 뜻이 아니라, 말의 순서를 바꾸라는 뜻입니다.";
  }
  if (rawLabel.includes("홍염") || rawLabel.includes("도화")) {
    return "이 신호는 매력을 과시하라는 뜻이 아니라, 보여지는 장면을 의식적으로 관리하라는 뜻입니다.";
  }
  if (rawLabel.includes("귀인")) {
    return "이 신호는 누군가 대신 해결해 준다는 뜻이 아니라, 도움을 받을 통로를 미리 열어 두라는 뜻입니다.";
  }
  if (rawLabel.includes("지장간")) {
    return "이 신호는 겉으로 보이는 기운 안쪽의 숨은 역할과 회복 포인트를 보라는 뜻입니다.";
  }
  if (
    rawLabel.includes("합") ||
    rawLabel.includes("충") ||
    rawLabel.includes("형") ||
    rawLabel.includes("파") ||
    rawLabel.includes("해")
  ) {
    return "이 신호는 좋고 나쁨보다 관계, 일, 생활 리듬에서 어디가 부딪히고 다시 맞춰지는지를 보라는 뜻입니다.";
  }

  return "이 신호는 운명을 단정하는 말이 아니라, 반복되는 선택 습관을 다루는 기준입니다.";
}

function isDetailedFeatureLabel(rawLabel: string): boolean {
  return (
    rawLabel === "천을귀인" ||
    rawLabel === "현침살" ||
    rawLabel === "갑신일주" ||
    rawLabel === "재다신약" ||
    rawLabel === "토 과다" ||
    rawLabel === "수 부족"
  );
}

function buildFeatureCategoryLabel(rawLabel: string): string {
  if (rawLabel.includes("일주")) {
    return "일주 구조";
  }
  if (rawLabel.includes("과다") || rawLabel.includes("부족")) {
    return "오행 구조";
  }
  if (
    rawLabel.includes("무식상") ||
    rawLabel.includes("무인성") ||
    rawLabel.includes("재다신약")
  ) {
    return "구조 판단";
  }
  if (
    rawLabel.includes("비견") ||
    rawLabel.includes("겁재") ||
    rawLabel.includes("식신") ||
    rawLabel.includes("상관") ||
    rawLabel.includes("편재") ||
    rawLabel.includes("정재") ||
    rawLabel.includes("편관") ||
    rawLabel.includes("정관") ||
    rawLabel.includes("편인") ||
    rawLabel.includes("정인")
  ) {
    return "십성 구조";
  }
  if (rawLabel.includes("지장간")) {
    return "지장간";
  }
  if (
    rawLabel.includes("합") ||
    rawLabel.includes("충") ||
    rawLabel.includes("형") ||
    rawLabel.includes("파") ||
    rawLabel.includes("해")
  ) {
    return "합충형파해";
  }

  return "신살·귀인";
}
