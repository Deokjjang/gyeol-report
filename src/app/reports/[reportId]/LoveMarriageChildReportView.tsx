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

function pickTenGodSignals(
  evidencePacket: LoveMarriageChildReportEvidencePacket,
  targets: readonly string[],
): readonly string[] {
  return uniqueValues(
    [
      ...evidencePacket.sajuBasis.loveTenGodSignals,
      ...evidencePacket.sajuBasis.marriageTenGodSignals,
      ...evidencePacket.sajuBasis.parentingTenGodSignals,
    ]
      .filter((signal) => targets.includes(signal.tenGod))
      .map((signal) => signal.tenGod),
  );
}

function pickSignalLabels(
  signals: readonly LoveMarriageChildSajuSignal[],
): readonly string[] {
  return uniqueValues(signals.map((signal) => signal.label));
}

function buildMyeongliSignalGroups(
  evidencePacket: LoveMarriageChildReportEvidencePacket | undefined,
): readonly SignalGroup[] {
  if (evidencePacket === undefined) {
    return [];
  }

  const allTenGodSignals = [
    ...evidencePacket.sajuBasis.loveTenGodSignals,
    ...evidencePacket.sajuBasis.marriageTenGodSignals,
    ...evidencePacket.sajuBasis.parentingTenGodSignals,
  ];
  const groups: SignalGroup[] = [];
  const wealthSignals = pickTenGodSignals(evidencePacket, ["편재", "정재"]);
  const officerSignals = pickTenGodSignals(evidencePacket, ["편관", "정관"]);
  const outputSignals = pickTenGodSignals(evidencePacket, ["식신", "상관"]);
  const resourceSignals = pickTenGodSignals(evidencePacket, ["편인", "정인"]);
  const peerSignals = pickTenGodSignals(evidencePacket, ["비견", "겁재"]);
  const attractionSignals = pickSignalLabels(evidencePacket.sajuBasis.attractionSignals);
  const conflictSignals = pickSignalLabels(evidencePacket.sajuBasis.conflictSignals);
  const supportSignals = pickSignalLabels(evidencePacket.sajuBasis.supportSignals);
  const interactionSignals = pickSignalLabels(
    evidencePacket.sajuBasis.relationInteractionSignals,
  );

  if (hasTenGod(allTenGodSignals, ["편재", "정재"])) {
    groups.push({
      title: "재성",
      signals: wealthSignals,
      body:
        "관계 안에서 생활 감각, 돈의 기준, 현실 책임을 확인하는 근거로 씁니다. 감정만 보지 않고 약속과 자원 배분을 함께 봅니다.",
    });
  }
  if (hasTenGod(allTenGodSignals, ["편관", "정관"])) {
    groups.push({
      title: "관성",
      signals: officerSignals,
      body:
        "약속, 책임, 기준, 평가에 민감한 관계 구조입니다. 안정적인 관계일수록 역할과 경계가 선명해야 합니다.",
    });
  }
  if (hasTenGod(allTenGodSignals, ["식신", "상관"])) {
    groups.push({
      title: "식상",
      signals: outputSignals,
      body:
        "마음이 말과 행동으로 드러나는 방식입니다. 애정 표현, 돌봄, 갈등 후 회복 행동을 볼 때 씁니다.",
    });
  }
  if (hasTenGod(allTenGodSignals, ["편인", "정인"])) {
    groups.push({
      title: "인성",
      signals: resourceSignals,
      body:
        "정서적 안전감, 보호, 배움형 돌봄을 보는 근거입니다. 관계에서 안심되는 언어와 회복 방식을 함께 봅니다.",
    });
  }
  if (hasTenGod(allTenGodSignals, ["비견", "겁재"])) {
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
      <p className="mt-4 text-base leading-8 text-[#4f453f]">
        {input.section.body}
      </p>
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
      <p className="mt-4 text-base leading-8 text-[#4f453f]">
        {input.section.body}
      </p>
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
      <p className="mt-4 text-base leading-8 text-[#4f453f]">{section.body}</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {renderList(section.parentingRolePattern, "부모 역할 패턴")}
        {renderList(section.avoidProjection, "주의할 투사")}
      </div>
    </section>
  );
}

function renderBreakupReunion(section: LoveMarriageChildBreakupReunionPatternSection) {
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
      <p className="mt-4 text-base leading-8 text-[#4f453f]">{section.body}</p>
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
          {renderTableSlot("공통 만세력표", manseRyeokTable)}
          {renderTableSlot("공통 MBTI표", mbtiProfileTable)}
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
              이번 화면에서는 draft 본문을 중심으로 관계 기준을 읽습니다. 명리
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
