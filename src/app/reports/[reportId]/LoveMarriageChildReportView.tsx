import type { ReactNode } from "react";

import type {
  LoveMarriageChildReportDraft,
  LoveMarriageChildTextSection,
  LoveMarriageChildPatternSection,
  LoveMarriageChildParentModeSection,
  LoveMarriageChildBreakupReunionPatternSection,
} from "../../../lib/report-generation/loveMarriageChildReportDraftTypes";
import type {
  LoveMarriageChildReportEvidencePacket,
  LoveMarriageChildSajuSignal,
  LoveMarriageChildTenGodSignal,
} from "../../../lib/report-knowledge/loveMarriageChildReportTypes";

type LoveMarriageChildReportViewProps = {
  readonly draft: LoveMarriageChildReportDraft;
  readonly evidencePacket?: LoveMarriageChildReportEvidencePacket;
  readonly manseRyeokTable?: ReactNode;
  readonly mbtiProfileTable?: ReactNode;
};

type SignalGroup = {
  readonly title: string;
  readonly body: string;
  readonly signals: readonly string[];
};

type RelationshipFitGroup = {
  readonly title: string;
  readonly body: string;
  readonly tags: readonly string[];
};

function uniqueValues(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function joinLabels(values: readonly string[]): string {
  return values.length === 0 ? "관계 기준" : values.join(" · ");
}

function hasTenGod(
  signals: readonly LoveMarriageChildTenGodSignal[],
  targets: readonly string[],
): boolean {
  return signals.some((signal) => targets.includes(signal.tenGod));
}

function pickTenGodLabels(
  evidencePacket: LoveMarriageChildReportEvidencePacket,
  targets: readonly string[],
): readonly string[] {
  const tenGodSignalLabels = [
    ...evidencePacket.sajuBasis.loveTenGodSignals,
    ...evidencePacket.sajuBasis.marriageTenGodSignals,
    ...evidencePacket.sajuBasis.parentingTenGodSignals,
  ]
    .filter((signal) => targets.includes(signal.tenGod))
    .map((signal) => signal.tenGod);
  const fullPillarLabels = evidencePacket.sajuBasis.fullPillars.flatMap(
    (pillar) => [
      pillar.stemTenGod ?? "",
      pillar.branchTenGod ?? "",
      ...(pillar.hiddenStems ?? []),
    ],
  );

  return uniqueValues(
    [
      ...tenGodSignalLabels,
      ...targets.filter((target) =>
        fullPillarLabels.some((label) => label.includes(target)),
      ),
    ],
  );
}

function pickSignalLabels(
  signals: readonly LoveMarriageChildSajuSignal[],
): readonly string[] {
  return uniqueValues(signals.map((signal) => signal.label));
}

function pickInteractionSignalLabels(
  signals: readonly LoveMarriageChildSajuSignal[],
): readonly string[] {
  return normalizeInteractionLabels(pickSignalLabels(signals));
}

function normalizeInteractionLabels(labels: readonly string[]): readonly string[] {
  const uniqueLabels = uniqueValues(labels);

  return uniqueLabels.filter((label) => {
    if (!label.endsWith("합")) {
      return true;
    }

    const relationChars = label.replace("합", "");

    return !uniqueLabels.some(
      (candidate) =>
        candidate !== label &&
        candidate.includes("천간합") &&
        [...relationChars].every((char) => candidate.includes(char)),
    );
  });
}

function splitParagraphs(value: string): readonly string[] {
  return value
    .split(/\n{2,}/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function renderParagraphs(
  value: string,
  className = "mt-4 text-base leading-8 text-[#4f453f]",
) {
  const paragraphs = splitParagraphs(value);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className={`${className} space-y-4`}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

function buildMyeongliSignalGroups(
  evidencePacket: LoveMarriageChildReportEvidencePacket | undefined,
): readonly SignalGroup[] {
  if (evidencePacket === undefined) {
    return [];
  }

  const groups: SignalGroup[] = [];
  const wealthSignals = pickTenGodLabels(evidencePacket, ["편재", "정재"]);
  const officerSignals = pickTenGodLabels(evidencePacket, ["편관", "정관"]);
  const outputSignals = pickTenGodLabels(evidencePacket, ["식신", "상관"]);
  const resourceSignals = pickTenGodLabels(evidencePacket, ["편인", "정인"]);
  const peerSignals = pickTenGodLabels(evidencePacket, ["비견", "겁재"]);
  const attractionSignals = pickSignalLabels(
    evidencePacket.sajuBasis.attractionSignals,
  );
  const conflictSignals = pickSignalLabels(
    evidencePacket.sajuBasis.conflictSignals,
  );
  const supportSignals = pickSignalLabels(evidencePacket.sajuBasis.supportSignals);
  const interactionSignals = pickInteractionSignalLabels(
    evidencePacket.sajuBasis.relationInteractionSignals,
  );

  if (wealthSignals.length > 0) {
    groups.push({
      title: "재성",
      signals: wealthSignals,
      body:
        "관계 안에서 생활 감각, 돈의 기준, 현실 책임을 확인하는 근거로 씁니다. 감정만 보지 않고 약속과 자원 배분을 함께 봅니다.",
    });
  }
  if (officerSignals.length > 0) {
    groups.push({
      title: "관성",
      signals: officerSignals,
      body:
        "약속, 책임, 기준, 평가에 민감한 관계 구조입니다. 안정적인 관계일수록 역할과 경계가 선명해야 합니다.",
    });
  }
  if (outputSignals.length > 0) {
    groups.push({
      title: "식상",
      signals: outputSignals,
      body:
        "마음이 말과 행동으로 드러나는 방식입니다. 애정 표현, 돌봄, 갈등 후 회복 행동을 볼 때 씁니다.",
    });
  }
  if (resourceSignals.length > 0) {
    groups.push({
      title: "인성",
      signals: resourceSignals,
      body:
        "정서적 안전감, 보호, 배움형 돌봄을 보는 근거입니다. 관계에서 안심되는 언어와 회복 방식을 함께 봅니다.",
    });
  }
  if (peerSignals.length > 0) {
    groups.push({
      title: "비겁",
      signals: peerSignals,
      body:
        "독립성, 동등성, 자존심이 관계에서 강하게 작동하는 근거입니다. 대등하면 힘이 되고, 과하면 경쟁처럼 느껴질 수 있습니다.",
    });
  }
  if (attractionSignals.length > 0) {
    groups.push({
      title: "도화·홍염",
      signals: attractionSignals,
      body:
        "호감, 분위기, 표현성을 보는 근거입니다. 끌림을 단정하지 않고 관계에서 어떻게 존재감이 드러나는지만 봅니다.",
    });
  }
  if (conflictSignals.length > 0) {
    groups.push({
      title: "현침·화개",
      signals: conflictSignals,
      body:
        "말의 날카로움, 혼자 정리하는 시간, 관계의 거리 조절을 보는 근거입니다. 갈등 결론이 아니라 회복 리듬으로 읽습니다.",
    });
  }
  if (supportSignals.length > 0) {
    groups.push({
      title: "귀인",
      signals: supportSignals,
      body:
        "조언자, 완충자, 협업 구조가 관계 피로를 낮추는 근거입니다. 혼자 결론내기보다 조율 구조를 쓰는 쪽이 좋습니다.",
    });
  }
  if (interactionSignals.length > 0) {
    groups.push({
      title: "합충형파해",
      signals: interactionSignals,
      body:
        "생활 기준, 거리, 속도, 말투를 조율해야 하는 지점입니다. 관계의 끝을 말하지 않고 조정해야 할 기준으로 씁니다.",
    });
  }

  return groups;
}

function buildRelationshipFitGroups(
  evidencePacket: LoveMarriageChildReportEvidencePacket | undefined,
): readonly RelationshipFitGroup[] {
  if (evidencePacket === undefined) {
    return [];
  }

  const mbtiType = evidencePacket.personContext.mbtiType?.toUpperCase() ?? "";
  const tenGodSignals = [
    ...evidencePacket.sajuBasis.loveTenGodSignals,
    ...evidencePacket.sajuBasis.marriageTenGodSignals,
    ...evidencePacket.sajuBasis.parentingTenGodSignals,
  ];
  const hasWealthOrOfficer = hasTenGod(tenGodSignals, [
    "편재",
    "정재",
    "편관",
    "정관",
  ]);
  const conflictSignals = pickSignalLabels(
    evidencePacket.sajuBasis.conflictSignals,
  );
  const supportSignals = pickSignalLabels(
    evidencePacket.sajuBasis.supportSignals,
  );
  if (mbtiType !== "ENTJ") {
    return [
      {
        title: "생각이 깊고 독립적인 사람",
        tags: ["자율성", "깊은 대화", "생활 기준"],
        body:
          "당신의 속도를 무조건 꺾지 않으면서 자기 생각과 생활 리듬이 있는 사람이 편합니다. 감정만으로 흔드는 사람보다 기준을 두고 대화하는 사람이 덜 피곤합니다.",
      },
      {
        title: "생기와 감정 표현을 보태 주는 사람",
        tags: ["표현", "분위기", "완충"],
        body:
          "당신이 관계를 기준과 책임으로 정리할 때, 감정 표현과 분위기를 보태 주는 사람이 균형을 만듭니다. 다만 책임감이 없으면 생기는 금방 피로로 바뀝니다.",
      },
      {
        title: "책임 기준이 흐리지 않은 사람",
        tags: ["약속", "돈과 시간", "역할 분담"],
        body:
          "명리적으로는 당신의 현실 기준을 무겁게 받아 줄 사람이 좋습니다. 좋아한다는 말보다 약속, 돈, 시간, 역할을 함께 정리할 수 있는 사람이 오래 갑니다.",
      },
    ];
  }

  return [
    {
      title: "생각이 깊고 독립적인 사람",
      tags: ["INTJ", "INTP", "자율성"],
      body:
        "INTJ·INTP처럼 자기 세계가 있고, 감정으로 휘두르기보다 논리와 기준으로 대화하는 사람은 당신에게 덜 피곤합니다. 당신이 기준을 세울 때 바로 반발하기보다 그 기준의 이유를 같이 검토할 수 있기 때문입니다.",
    },
    {
      title: "생기와 감정 표현을 보태 주는 사람",
      tags: ["ENFP", "표현", "생기"],
      body:
        "ENFP처럼 분위기를 살리고 감정을 말로 풀어주는 사람은 당신의 딱딱함을 누그러뜨릴 수 있습니다. 단, 책임감이 없으면 금방 피곤해집니다. 생기는 좋지만 약속과 실행이 같이 있어야 오래 갑니다.",
    },
    {
      title: "말의 온도를 낮춰 주는 사람",
      tags: ["ISFP", "부드러움", "완충"],
      body:
        "ISFP처럼 부드럽고 감각적인 사람은 당신의 직설성을 완충해 줄 수 있습니다. 대신 너무 침묵하거나 회피하면 답답함이 커집니다. 부드러움과 회피는 다르다는 기준을 분명히 봐야 합니다.",
    },
    {
      title: "책임 기준이 흐리지 않은 사람",
      tags: uniqueValues([
        hasWealthOrOfficer ? "재성·관성 기준" : "생활 기준",
        supportSignals.length > 0 ? "귀인형 완충" : "정서적 완충",
        conflictSignals.length > 0 ? "말의 온도 조절" : "대화 리듬",
        "식상·인성 보완",
      ]),
      body:
        "명리적으로는 당신의 책임감과 현실 기준을 무겁게 받아 줄 사람, 동시에 식상·인성처럼 표현과 완충을 보태 주는 사람이 좋습니다. 흐릿한 다정함보다 기준이 있는 다정함, 감정 표현은 부드럽되 책임 기준은 흐리지 않은 사람이 오래 갑니다.",
    },
  ];
}

function buildRelationshipFatigueGroups(
  evidencePacket: LoveMarriageChildReportEvidencePacket | undefined,
): readonly RelationshipFitGroup[] {
  if (evidencePacket === undefined) {
    return [];
  }

  return [
    {
      title: "감정 확인만 반복하는 사람",
      tags: ["감정 과부하", "행동 기준 약함"],
      body:
        "감정 확인은 계속 요구하지만 실제 행동 기준은 흐린 사람과 있으면 빨리 지칩니다. 당신은 말보다 반복 행동을 보기 때문에, 확인만 많고 약속이 약한 관계에서는 마음이 금방 닫힙니다.",
    },
    {
      title: "말은 많은데 책임이 약한 사람",
      tags: ["약속 약함", "실행 부족"],
      body:
        "말은 많은데 약속과 책임이 약한 사람은 당신에게 오래 맞기 어렵습니다. 초반에는 매력적으로 보여도, 시간이 지나면 당신이 관계를 혼자 운영하는 느낌을 받기 쉽습니다.",
    },
    {
      title: "기준을 전부 통제로 받는 사람",
      tags: ["통제 프레임", "방어적 반응"],
      body:
        "당신의 기준 제시를 전부 통제로 받아들이는 사람과는 갈등이 빨리 커집니다. 당신도 말투를 조절해야 하지만, 상대도 기준과 공격을 구분할 수 있어야 관계가 유지됩니다.",
    },
    {
      title: "침묵과 회피로 버티는 사람",
      tags: ["회피", "느린 회복"],
      body:
        "갈등 때 대화보다 침묵이나 회피로 버티는 사람은 당신의 답답함을 키웁니다. 현침·화개 흐름이 있을수록 말의 순서는 조절하되, 대화 자체를 피하는 관계는 오래 피곤합니다.",
    },
    {
      title: "돈과 역할을 흐릿하게 두는 사람",
      tags: ["돈 기준", "역할 분담"],
      body:
        "돈과 역할 분담을 흐릿하게 두려는 사람도 소모가 큽니다. 당신은 사랑과 책임을 완전히 분리하지 않기 때문에, 생활 기준이 정리되지 않으면 관계 안정감도 같이 흔들립니다.",
    },
  ];
}

function renderList(items: readonly string[], label?: string) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {label === undefined ? null : (
        <p className="text-sm font-extrabold text-[#7f1d38]">{label}</p>
      )}
      <ul className="space-y-2 text-sm leading-6 text-[#51453d]">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b88932]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function renderTableSlot(label: string, slot: ReactNode) {
  if (slot === undefined || slot === null) {
    return null;
  }

  return (
    <section className="rounded-[1.5rem] border border-[#e3d8c7] bg-[#fffaf1] p-3 shadow-[0_18px_50px_rgba(47,32,24,0.08)] sm:p-5">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[#8b8174]">
        {label}
      </p>
      {slot}
    </section>
  );
}

function renderTextSection(input: {
  readonly id: string;
  readonly title: string;
  readonly section: LoveMarriageChildTextSection;
}) {
  return (
    <section
      data-love-marriage-child-report-section={input.id}
      className="rounded-[1.65rem] border border-[#e4d8c8] bg-white/85 p-5 shadow-[0_18px_48px_rgba(48,34,25,0.07)] sm:p-7"
    >
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a8d7d]">
        {input.title}
      </p>
      <h2 className="text-2xl font-black leading-tight text-[#241c19]">
        {input.section.headline}
      </h2>
      {renderParagraphs(input.section.body)}
      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_0.75fr]">
        {renderList(input.section.keyPoints, "핵심 기준")}
        {input.section.caution === null ? null : (
          <div className="rounded-2xl border border-[#eadfce] bg-[#fbf4e8] p-4 text-sm leading-7 text-[#6a5145]">
            <strong className="text-[#7f1d38]">주의</strong>
            <p>{input.section.caution}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function renderPatternSection(input: {
  readonly id: string;
  readonly title: string;
  readonly section: LoveMarriageChildPatternSection;
}) {
  return (
    <section
      data-love-marriage-child-report-section={input.id}
      className="rounded-[1.65rem] border border-[#e4d8c8] bg-white/85 p-5 shadow-[0_18px_48px_rgba(48,34,25,0.07)] sm:p-7"
    >
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a8d7d]">
        {input.title}
      </p>
      <h2 className="text-2xl font-black leading-tight text-[#241c19]">
        {input.section.headline}
      </h2>
      {renderParagraphs(input.section.body)}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {renderList(input.section.repeatedPattern, "반복 패턴")}
        {renderList(input.section.betterUse, "더 나은 사용법")}
      </div>
    </section>
  );
}

function renderParentMode(section: LoveMarriageChildParentModeSection) {
  return (
    <section
      data-love-marriage-child-report-section="parent_mode"
      className="rounded-[1.65rem] border border-[#e4d8c8] bg-white/85 p-5 shadow-[0_18px_48px_rgba(48,34,25,0.07)] sm:p-7"
    >
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a8d7d]">
        내가 부모가 되었을 때
      </p>
      <h2 className="text-2xl font-black leading-tight text-[#241c19]">
        {section.headline}
      </h2>
      {renderParagraphs(section.body)}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {renderList(section.parentingRolePattern, "부모 역할 패턴")}
        {renderList(section.avoidProjection, "주의할 투사")}
      </div>
    </section>
  );
}

function renderBreakupReunion(
  section: LoveMarriageChildBreakupReunionPatternSection,
) {
  return (
    <section
      data-love-marriage-child-report-section="breakup_reunion_pattern"
      className="rounded-[1.65rem] border border-[#e4d8c8] bg-white/85 p-5 shadow-[0_18px_48px_rgba(48,34,25,0.07)] sm:p-7"
    >
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a8d7d]">
        이별/재회 고민이 있을 때
      </p>
      <h2 className="text-2xl font-black leading-tight text-[#241c19]">
        {section.headline}
      </h2>
      {renderParagraphs(section.body)}
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {renderList(section.myLoop, "내 반복 패턴")}
        {renderList(section.emotionalProcessing, "감정 처리")}
        {renderList(section.repairBoundary, "회복 경계선")}
      </div>
    </section>
  );
}

export function LoveMarriageChildReportView({
  draft,
  evidencePacket,
  manseRyeokTable,
  mbtiProfileTable,
}: LoveMarriageChildReportViewProps) {
  const resolvedEvidencePacket = evidencePacket ?? draft.evidencePacket;
  const signalGroups = buildMyeongliSignalGroups(resolvedEvidencePacket);
  const relationshipFitGroups =
    buildRelationshipFitGroups(resolvedEvidencePacket);
  const relationshipFatigueGroups =
    buildRelationshipFatigueGroups(resolvedEvidencePacket);

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[#f6f0e7] text-[#241c19]">
      <article className="mx-auto flex w-full min-w-0 max-w-[22.5rem] flex-col gap-8 px-0 py-8 sm:max-w-5xl sm:px-6 lg:px-8">
        <header
          data-love-marriage-child-report-section="report_header"
          className="rounded-[2rem] border border-[#e2d6c4] bg-[#2a211f] p-6 text-[#fff8ed] shadow-[0_24px_80px_rgba(32,22,17,0.24)] sm:p-9"
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#d8b36a]">
            연애·결혼·자녀 리포트
          </p>
          <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
            {draft.personLabel}님의 관계 리포트
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[#f3e7d8]">
            {draft.headline}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d9c8b7]">
            상담이나 예언이 아니라, 명리 근거와 MBTI 행동층을 함께 읽어
            관계에서 반복되는 기준과 선택 방식을 정리합니다.
          </p>
        </header>

        <section
          data-love-marriage-child-report-section="common_tables"
          className="grid gap-5"
        >
          {renderTableSlot("기초 만세력", manseRyeokTable)}
          {renderTableSlot("MBTI 성향표", mbtiProfileTable)}
        </section>

        <section
          data-love-marriage-child-report-section="myeongli_signal_basis"
          className="rounded-[1.65rem] border border-[#e2d6c4] bg-[#fffaf1] p-5 shadow-[0_18px_48px_rgba(48,34,25,0.08)] sm:p-7"
        >
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a8d7d]">
            명리 핵심 근거
          </p>
          <h2 className="text-2xl font-black text-[#241c19]">
            표에 나온 신호를 관계 장면으로 풀어 읽습니다
          </h2>
          {signalGroups.length === 0 ? (
            <p className="mt-4 text-base leading-8 text-[#4f453f]">
              이번 화면에서는 본문을 중심으로 관계 기준을 읽습니다. 명리
              상세 근거가 전달되면 십성, 매력 신호, 갈등 신호, 귀인, 조율
              지점을 함께 보여줍니다.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {signalGroups.map((group) => (
                <section
                  key={group.title}
                  className="rounded-2xl border border-[#eadfce] bg-white/75 p-4"
                >
                  <p className="text-sm font-extrabold text-[#7f1d38]">
                    {group.title}
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#8b8174]">
                    {joinLabels(group.signals)}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#51453d]">
                    {group.body}
                  </p>
                </section>
              ))}
            </div>
          )}
        </section>

        <section
          data-love-marriage-child-report-section="opening_summary"
          className="rounded-[1.65rem] border border-[#e4d8c8] bg-white/85 p-5 shadow-[0_18px_48px_rgba(48,34,25,0.07)] sm:p-7"
        >
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a8d7d]">
            핵심 요약
          </p>
          <h2 className="text-2xl font-black leading-tight text-[#241c19]">
            {draft.headline}
          </h2>
          <p className="mt-4 text-base leading-8 text-[#4f453f]">
            {draft.openingSummary}
          </p>
        </section>

        {renderTextSection({
          id: "love_style",
          title: "사랑 방식",
          section: draft.loveStyle,
        })}
        {renderPatternSection({
          id: "attraction_pattern",
          title: "끌리는 사람과 반복 패턴",
          section: draft.attractionPattern,
        })}
        {relationshipFitGroups.length === 0 ? null : (
          <section
            data-love-marriage-child-report-section="relationship_fit_profile"
            className="rounded-[1.65rem] border border-[#e2d6c4] bg-[#fffaf1] p-5 shadow-[0_18px_48px_rgba(48,34,25,0.08)] sm:p-7"
          >
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a8d7d]">
              잘 맞기 쉬운 관계 스타일
            </p>
            <h2 className="text-2xl font-black leading-tight text-[#241c19]">
              당신은 이런 결의 사람과 오래 갑니다
            </h2>
            <p className="mt-4 text-base leading-8 text-[#4f453f]">
              이 블록은 특정 상대를 판정하는 궁합표가 아닙니다. 당신의 명리
              기준과 MBTI 행동층을 놓고, 어떤 관계 스타일이 편하고 어떤 결이
              오래 가기 쉬운지 직설적으로 정리한 기준입니다.
              INTJ·INTP·ENFP·ISFP 후보는 당신이 덜 피곤해지기 쉬운 행동
              언어로만 봅니다.
            </p>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {relationshipFitGroups.map((group) => (
                <section
                  key={group.title}
                  className="rounded-2xl border border-[#eadfce] bg-white/75 p-4"
                >
                  <p className="text-sm font-extrabold text-[#7f1d38]">
                    {group.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#51453d]">
                    {group.body}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#d7b56d] bg-[#fff8ea] px-3 py-1 text-xs font-bold text-[#5a4633]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              ))}
            </div>
            <p className="mt-5 rounded-2xl border border-[#eadfce] bg-white/75 p-4 text-sm leading-7 text-[#6a5145]">
              실제 특정 상대와 맞는지는 상대의 사주와 MBTI까지 함께 보는
              궁합 리포트의 영역입니다. 여기서는 당신이 덜 소모되고 더 오래
              안정되는 상대의 결만 봅니다.
            </p>
          </section>
        )}
        {relationshipFatigueGroups.length === 0 ? null : (
          <section
            data-love-marriage-child-report-section="relationship_fatigue_profile"
            className="rounded-[1.65rem] border border-[#e2d6c4] bg-white/85 p-5 shadow-[0_18px_48px_rgba(48,34,25,0.07)] sm:p-7"
          >
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a8d7d]">
              피로해지는 관계 스타일
            </p>
            <h2 className="text-2xl font-black leading-tight text-[#241c19]">
              이런 관계는 오래 버티기 어렵습니다
            </h2>
            <p className="mt-4 text-base leading-8 text-[#4f453f]">
              잘 맞는 사람만큼 피해야 할 패턴도 분명합니다. 당신은 기준과
              책임을 관계 안정감의 일부로 보기 때문에, 말은 많은데 행동이
              흐리거나 갈등을 회피하는 관계에서 빠르게 소모됩니다.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {relationshipFatigueGroups.map((group) => (
                <section
                  key={group.title}
                  className="rounded-2xl border border-[#eadfce] bg-[#fbf4e8] p-4"
                >
                  <p className="text-sm font-extrabold text-[#7f1d38]">
                    {group.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#51453d]">
                    {group.body}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#d8c9b5] bg-white/75 px-3 py-1 text-xs font-bold text-[#5a4633]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        )}
        {renderTextSection({
          id: "love_strengths",
          title: "연애에서 강한 점",
          section: draft.loveStrengths,
        })}
        {renderPatternSection({
          id: "love_friction",
          title: "연애에서 자주 막히는 점",
          section: draft.loveFriction,
        })}
        {renderTextSection({
          id: "marriage_rhythm",
          title: "결혼 생활 리듬",
          section: draft.marriageRhythm,
        })}
        {renderTextSection({
          id: "household_money_and_role_split",
          title: "돈/가사/역할 분담",
          section: draft.householdMoneyAndRoleSplit,
        })}
        {renderTextSection({
          id: "conflict_recovery",
          title: "갈등 회복 방식",
          section: draft.conflictRecovery,
        })}
        {renderParentMode(draft.parentMode)}
        {renderBreakupReunion(draft.breakupReunionPattern)}

        <section
          data-love-marriage-child-report-section="relationship_timing_hints"
          className="rounded-[1.65rem] border border-[#e4d8c8] bg-white/85 p-5 shadow-[0_18px_48px_rgba(48,34,25,0.07)] sm:p-7"
        >
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a8d7d]">
            관계 타이밍 힌트
          </p>
          <div className="mt-5 grid gap-4">
            {draft.relationshipTimingHints.map((hint) => (
              <section
                key={`${hint.label}-${hint.headline}`}
                className="rounded-2xl border border-[#eadfce] bg-[#fffaf1] p-4"
              >
                <p className="text-sm font-extrabold text-[#7f1d38]">
                  {hint.label}
                </p>
                <h3 className="mt-1 text-lg font-black text-[#241c19]">
                  {hint.headline}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#51453d]">
                  {hint.body}
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {renderList(hint.push, "밀어볼 기준")}
                  {renderList(hint.avoid, "피할 기준")}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section
          data-love-marriage-child-report-section="action_plan"
          className="rounded-[1.65rem] border border-[#e4d8c8] bg-white/85 p-5 shadow-[0_18px_48px_rgba(48,34,25,0.07)] sm:p-7"
        >
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a8d7d]">
            실행 기준
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {draft.actionPlan.map((item) => (
              <section
                key={item.label}
                className="rounded-2xl border border-[#eadfce] bg-[#fffaf1] p-4"
              >
                <p className="text-sm font-extrabold text-[#7f1d38]">
                  {item.label}
                </p>
                <h3 className="mt-1 text-lg font-black text-[#241c19]">
                  {item.headline}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#51453d]">
                  {item.body}
                </p>
                <p className="mt-3 rounded-xl bg-white/75 px-3 py-2 text-sm font-bold text-[#3a2f29]">
                  바로 할 일: {item.firstAction}
                </p>
              </section>
            ))}
          </div>
        </section>

        <section
          data-love-marriage-child-report-section="risk_management"
          className="rounded-[1.65rem] border border-[#e4d8c8] bg-white/85 p-5 shadow-[0_18px_48px_rgba(48,34,25,0.07)] sm:p-7"
        >
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a8d7d]">
            리스크 관리
          </p>
          <div className="mt-5 grid gap-4">
            {draft.riskManagement.map((risk) => (
              <section
                key={risk.title}
                className="rounded-2xl border border-[#eadfce] bg-[#fbf4e8] p-4"
              >
                <h3 className="text-lg font-black text-[#241c19]">
                  {risk.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#51453d]">
                  {risk.body}
                </p>
                <p className="mt-3 text-sm leading-7 text-[#6a5145]">
                  <strong className="text-[#7f1d38]">줄이는 방법</strong>{" "}
                  {risk.prevention}
                </p>
              </section>
            ))}
          </div>
        </section>

        <section
          data-love-marriage-child-report-section="safety_notes"
          className="rounded-[1.65rem] border border-[#e6d8c5] bg-[#2a211f] p-5 text-[#fff8ed] shadow-[0_18px_48px_rgba(48,34,25,0.16)] sm:p-7"
        >
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#d8b36a]">
            안전 안내
          </p>
          {renderList(draft.safetyNotes)}
        </section>
      </article>
    </main>
  );
}
