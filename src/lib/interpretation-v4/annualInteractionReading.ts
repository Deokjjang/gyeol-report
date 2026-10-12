import type { AnnualJieRelationFact } from "../report-knowledge/annualMonthJie";
import type { AnnualBranchInteractionType, TenGod } from "../report-knowledge/annualFortuneTypes";
import { withKoreanParticle as p } from "../report-knowledge/koreanCopyUtils";
import type { AnnualEvidence, AnnualMonthEvidence } from "./annualEvidence";
import { MAJOR_MEANINGS } from "./majorMaterials";

const positions = { year: "연지", month: "월지", day: "일지", hour: "시지" } as const;
// Short readings of annualMonthRelationFacts.branchReadings and the reviewed
// foundationRelations semantics. The scope comes from facts, never these words.
const meanings: Record<AnnualBranchInteractionType, string> = {
  충: "기존 리듬과 다른 요구 사이에서 일정과 역할을 조정할 관계입니다.",
  형: "반복되는 부담을 알아차리고 책임의 기준을 다듬을 관계입니다.",
  파: "이미 맞춘 절차나 역할을 다시 확인할 관계입니다.",
  해: "겉으로 드러나지 않은 기대 차이를 확인할 관계입니다.",
  육합: "서로 맞춰 함께 움직일 접점입니다.",
  삼합: "여러 기운이 같은 방향으로 힘을 모을 접점입니다.",
  반합: "일부가 맞닿는 접점이며, 완성된 합의까지 뜻하지는 않아요.",
};
// Same practical questions as annualFortuneReading.relationActions, applied
// to the selected month's topic (or the confirmed natal day relation).
function application(type: AnnualBranchInteractionType, focus: string) {
  const object = p(`‘${focus}’`, "object"), topic = `‘${focus}’`;
  const readings = {
    충: { action: `기존 일정 옆에 ${object} 놓고 바꿀 순서와 담당자를 정해보세요.`, avoid: `${topic} 때문에 계획을 조정하는 일을 실패로 단정하는 것` },
    형: { action: `${topic}에서 되풀이되는 요구와 책임이 끝날 조건을 적어보세요.`, avoid: `${topic}의 부담을 참고 버티는 일로만 푸는 것` },
    파: { action: `${topic}에서 유지할 약속과 손볼 절차를 나눠 작은 변경부터 합의해보세요.`, avoid: `${topic}의 한 부분을 고치다가 모든 약속을 없던 일로 돌리는 것` },
    해: { action: `${topic}에 관해 내가 뜻한 것과 상대가 이해한 것을 각각 말해보세요.`, avoid: `${topic}에 담긴 기대를 말하지 않고 알아주길 바라는 것` },
    육합: { action: `${object} 함께 다룬다면 각자 맡을 범위와 끝낼 기준도 정해보세요.`, avoid: `${topic}의 잘 맞는 부분만 보고 모든 조건에 동의하는 것` },
    삼합: { action: `${object} 공동 목표로 삼는다면 각자의 기여를 먼저 확인해보세요.`, avoid: `${topic}에 마음이 모였다는 이유로 결과까지 보장하는 것` },
    반합: { action: `${topic}에 관해 이미 합의한 부분과 아직 확인하지 못한 조건을 나눠보세요.`, avoid: `${topic}에서 뜻이 맞는 일부를 전체 합의로 보는 것` },
  };
  return readings[type];
}
// Once a relation's meaning has been explained, retain its concrete actors
// and a short reading. The following action supplies the monthly application.
const reminders: Record<AnnualBranchInteractionType, string> = {
  충: "일정과 역할을 조정할 조건입니다.", 형: "되풀이되는 부담을 살필 조건입니다.",
  파: "기존 약속을 다시 맞출 조건입니다.", 해: "숨은 기대 차이를 확인할 조건입니다.",
  육합: "함께 맞춰볼 접점입니다.", 삼합: "같은 방향으로 힘을 모을 접점입니다.", 반합: "일부가 맞닿는 접점입니다.",
};
const harmony = (type: string) => ["육합", "삼합", "반합"].includes(type);
type BranchFact = Exclude<AnnualJieRelationFact, { source: "month_natal_element" }>;

/** Only bind facts carried by the selected canonical segment. An ID alone is
 * insufficient: actors, scope and the active cycle must also agree. */
export function annualMonthInteractions(e: AnnualEvidence, m: AnnualMonthEvidence, god: TenGod, used: Set<string> = new Set()) {
  const s = m.focus;
  const bind = (f: AnnualJieRelationFact) => {
    if (f.source === "month_natal_element" || f.certainty !== "confirmed" || !s.evidenceIds.includes(f.id)
      || f.monthBranch !== s.monthPillar.branch || !f.participants.includes(s.monthPillar.branch)) return null;
    let actor: string, day = false;
    if (f.source === "month_natal_branch") {
      // A canonical fact may list positions occupied by either participant.
      // Name only the natal counterpart, not a duplicate of the transit branch.
      const counterpart = f.participants.filter(b => b !== s.monthPillar.branch);
      const actual = f.affectedPillars.filter(position => {
        const branch = e.calculation.pillars[position]?.branch;
        return branch && (counterpart.length ? counterpart.includes(branch) : f.participants.includes(branch));
      });
      if (!actual.length) return null;
      actor = `원국 ${actual.map(position => `${positions[position]} ${e.calculation.pillars[position]!.branch}`).join("·")}`;
      day = actual.includes("day");
    } else {
      const other = f.counterpart;
      if (f.source === "month_annual_branch") {
        if (other.scope !== "annual" || other.pillar !== s.effectiveAnnualPillar.stem + s.effectiveAnnualPillar.branch) return null;
        actor = `${other.pillar} 세운의 지지 ${other.pillar.slice(-1)}`;
      } else {
        if (other.scope !== "dayun" || s.activeDayunContext.status !== "active"
          || !s.activeDayunContext.cycles.some(c => c.index === other.cycleIndex && c.ganji === other.pillar)) return null;
        actor = `${other.pillar} 대운의 지지 ${other.pillar.slice(-1)}`;
      }
      if (!f.participants.some(b => b === other.pillar.slice(-1))) return null;
    }
    return { fact: f as BranchFact, actor, day };
  };
  const bound = s.relationFacts.map(bind).filter(r => r !== null);
  // Reuse the canonical reading's categorical preference: natal day/month
  // pressure, then period pressure, then an available natal connection.
  const primary = bound.find(r => r.fact.source === "month_natal_branch" && ["충", "형"].includes(r.fact.type)
    && (r.day || r.actor.includes("월지")))
    ?? bound.find(r => r.fact.source === "month_dayun_branch" && ["충", "형"].includes(r.fact.type))
    ?? bound.find(r => r.fact.source === "month_annual_branch" && ["충", "형"].includes(r.fact.type))
    ?? bound.find(r => r.fact.source === "month_natal_branch") ?? bound[0];
  if (!primary) return null;
  const secondary = bound.find(r => r !== primary && harmony(r.fact.type) !== harmony(primary.fact.type));
  const when = s.uncertainty.length ? `${m.month}월 대운 전환 시점이 확정되지 않은` : s.boundaryReason.some(b => b.startsWith("dayun"))
    ? `${m.month}월 ${Number(s.startKst.slice(8, 10))}일 ${s.boundaryReason.includes("dayun_uncertainty_end") ? "전환 가능 범위를 지난 뒤" : "대운 전환 뒤"}`
    : s.boundaryReason.some(b => b.startsWith("jie:")) ? `${m.month}월 절입 뒤` : `${m.month}월 초의 절입 전`;
  const next = m.segments.find(next => next.startKst === s.endKstExclusive && next.boundaryReason.some(b => b.startsWith("dayun")));
  const end = next ? `, ${Number(s.endKstExclusive.slice(8, 10))}일 ${next.boundaryReason.includes("dayun_uncertainty_start") ? "전환 시점의 불확실성이 시작되기 전까지" : next.boundaryReason.includes("dayun_uncertainty_end") ? "전환 가능 범위가 끝나기 전까지" : "대운 전환 직전까지"}` : "";
  const close = e.input.context.relationshipStatus === "married" ? "배우자와 나누는 생활 약속"
    : e.input.context.relationshipStatus === "dating" ? "연인과 맞추는 연락과 일정" : "가까운 사람과 정하는 약속";
  const focus = primary.day ? close : MAJOR_MEANINGS[god].work;
  const describe = (r: typeof primary) => {
    const key = `definition:${r.fact.type}`;
    const meaning = used.has(key) ? reminders[r.fact.type] : meanings[r.fact.type];
    used.add(key);
    return `${r.actor}, 월운 지지 ${s.monthPillar.branch} 사이의 ${r.fact.participants.join("·")} ${p(r.fact.type, "topic")} ${meaning}`;
  };
  const relationKey = (r: typeof primary) => `relation:${r.fact.source}:${r.actor}:${s.monthPillar.branch}:${r.fact.type}`;
  const continued = used.has(relationKey(primary));
  const newSecondary = secondary && !used.has(relationKey(secondary)) ? secondary : undefined;
  const interpretation = continued
    ? `${when}${end} 구간에는 앞서 살펴본 ${primary.actor}, 월운 사이의 ${p(primary.fact.type, "subject")} 이어집니다.`
    : `${when}${end} 구간을 보면 ${describe(primary)}`;
  const connection = newSecondary
    ? ` 한편 ${newSecondary.actor}, 월운 지지 ${s.monthPillar.branch}의 ${newSecondary.fact.participants.join("·")} ${p(newSecondary.fact.type, "topic")} ${harmony(newSecondary.fact.type) ? "함께 활용할 접점" : "따로 조정할 조건"}으로 남아 있어요.` : "";
  used.add(relationKey(primary));
  if (newSecondary) used.add(relationKey(newSecondary));
  const applicationKey = `application:${primary.fact.type}:${focus}`;
  const repeatedApplication = used.has(applicationKey);
  used.add(applicationKey);
  const applied = application(primary.fact.type, focus);
  return { primary: primary.fact, secondary: newSecondary?.fact, text: interpretation + connection,
    action: applied.action, avoid: applied.avoid, repeatedApplication,
    sourceRefs: [primary.fact.id, ...(newSecondary ? [newSecondary.fact.id] : [])] };
}
