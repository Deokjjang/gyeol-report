import { JOB_STATUSES, RELATIONSHIP_STATUSES } from "../report-generation/reportInputTypes";
import { buildMyeongliMaterialPacket } from "./materialPacket";
import { paragraph, proof } from "./copyRealizer";
import { reviewNarrative } from "./editorialGuard";
import { selectCareerVoice } from "./careerVoices";
import { careerWorkNarrative } from "./careerWorkNarrative";
import { careerRecommendations } from "./careerRecommendations";
import { careerStudy } from "./careerStudy";
import { careerFortune } from "./careerFortune";
import { careerBalance } from "./careerBalance";
import { careerNatalMoney } from "./careerNatalMoney";
import { composeEvidenceChapters } from "./contentSynthesis";
import type { NarrativeInput, NarrativeState, NarrativeSection, NarrativeProof, NarrativeBlock } from "./narrativeTypes";
import type { CareerNarrative } from "./careerNarrativeTypes";

const known = (v: unknown, values: readonly string[]) => typeof v === "string" && values.includes(v);

/** Offline only: no route, product generation, persistence, network or clock. */
export function composeCareerNarrative(input: NarrativeInput) {
  if (!input || typeof input.name !== "string" || !input.name.trim() || input.name.length > 80 || !input.context ||
    typeof input.context.detailJob !== "string" || input.context.detailJob.length > 200 || (input.mbti != null && typeof input.mbti !== "string") ||
    !known(input.context.jobStatus, JOB_STATUSES) || !known(input.context.relationshipStatus, RELATIONSHIP_STATUSES) || !input.calculation) {
    return { ok: false as const, errors: ["INVALID_NARRATIVE_INPUT"] };
  }
  const packet = buildMyeongliMaterialPacket({ calculation: input.calculation, mbti: input.mbti });
  const pillar = packet.selected.find(m => m.material.category === "dayPillar"), master = packet.selected.find(m => m.material.category === "dayMaster");
  if (!pillar || !master) return { ok: false as const, errors: ["UNVERIFIED_NATAL_PROFILE"] };
  const state: NarrativeState = { input, packet, pillar, master, usedSeeds: new Set(), featureUses: new Map() };
  const voice = selectCareerVoice(state), context = careerWorkNarrative(input), routes = careerRecommendations(state, voice, context);
  const study = careerStudy(state), fortune = careerFortune(state, voice.id);
  const natalMoney = voice.id === "natal" ? careerNatalMoney(state) : undefined;
  const section = (id: string, title: string, domain: NarrativeSection["domain"], blocks: NarrativeBlock[]): NarrativeSection => ({ id, title, domain, blocks });
  const b = (id: string, text: string, source: NarrativeProof, tone: NarrativeBlock["tone"] = "positive", scene?: string) => paragraph(id, text, source, tone, scene);
  const contextProof = proof([], [], [], context.sourceRefs);
  const sections: NarrativeSection[] = [];
  const dayWork = pillar.material.seeds.find(s => s.role === "work")!;
  const opening = [b("career-character", `${input.name.trim()}님은 ${voice.opening}`, voice.proof),
    b("career-everyday", voice.id === "natal" ? `${master.material.seeds.find(s => s.role === "strength")!.text} ${master.material.seeds.find(s => s.role === "character")!.text}` : dayWork.text, proof([pillar, master], [dayWork]), "positive", "work-instinct")];
  const strengths = [b("career-strength", voice.strength, voice.proof)];
  if (voice.id === "natal") {
    const material = packet.selected.find(m => m.material.category === "tenGod" && m.material.seeds.some(s => s.role === "work"));
    if (material) {
      const seeds = material.material.seeds.filter(s => ["strength", "work", "scene"].includes(s.role));
      strengths.push(b("natal-work-strength", seeds.map(s => s.text).join(" "), proof([material], seeds), "positive", "natal-working-style"));
    }
  }
  sections.push(section("strengths", voice.strengthTitle, "strengths", strengths));
  sections.push(section("current", context.currentTitle, "work", context.current.map((text, i) => b(`current-${i}`, text, contextProof, "observation", `current-${i}`))));
  // The interpretation is conditional on the chosen task, never on industry alone.
  sections.push(section("fit", "그 일에서 유난히 내 방식이 드러나는 순간", "work", [
    b("fit-reaction", voice.reaction, voice.proof, "observation", "work-response"),
  ]));
  const careerFusions = packet.fusions.filter(f => f.kind !== "overlap" && ["work", "identity", "study", "money"].includes(f.domain));
  const careerFusion = careerFusions.find(f => f.kind === "complement") ?? careerFusions[0];
  if (careerFusion) {
    const manifestations: Readonly<Record<string, string>> = {
      "enfp-expression": "혼자 정리할 때 막히던 생각도 누군가 반응해주면 말과 표정으로 풀립니다. 표현이 저절로 많이 나오는 원국은 아니어도 ENFP의 관심을 주고받는 방식이 실제 통로가 됩니다. 초안을 혼자 완벽하게 끝내기보다 사람에게 설명하며 모양을 잡는 일이 힘을 줄 수 있습니다.",
      "intp-expression": "말할 것이 없는 사람과 아무 때나 말하지 않는 사람은 다릅니다. 표현 신호가 적어도 관심 있는 주제를 만나면 INTP의 질문과 설명이 길을 엽니다. 전문 분야의 짧은 사례 발표처럼 주제가 분명한 자리에서는 평소보다 내 생각이 잘 드러날 수 있습니다.",
      "enfj-expression": "혼자 빈 종이를 보고 있을 때보다 누군가 어려워하는 것을 들을 때 설명할 말이 살아납니다. 명리에서 덜 드러난 표현을 ENFJ의 사람 앞에서 풀어내는 방식으로 만나는 모습입니다. 같은 내용을 써도 누구에게 도움이 될지 보이면 첫 문장이 달라집니다.",
      "esfp-expression": "완벽한 설명을 다 준비해야만 내 생각을 전할 수 있는 것은 아닙니다. 표현의 신호가 적더라도 ESFP의 먼저 보여주고 반응을 나누는 행동이 통로를 엽니다. 직접 시연하고 상대와 이야기하며 내용을 다듬는 경험이 조용히 준비하는 시간과 다른 힘을 줍니다.",
      "estp-study": "먼저 알고 싶다는 마음과 일단 해보고 싶다는 마음이 함께 있습니다. 인성의 배워두려는 힘은 ESTP의 빠른 시도와 반대만 되는 것이 아닙니다. 해본 뒤 궁금해진 것을 다시 확인할 때, 행동이 빠른 사람 안에 제법 탄탄한 이해가 남습니다.",
      "enfp-alone": "사람과 아이디어를 나누는 시간은 즐거운데, 마무리할 때는 혼자 들어가고 싶습니다. 깊이 몰입하는 명리의 결이 ENFP의 바깥으로 향하는 행동과 다른 리듬을 갖는 모습입니다. 대화하는 날과 만드는 시간을 모두 가질 때 활발함과 깊이 중 하나를 버리지 않아도 됩니다.",
      "entj-alone": "앞에서는 방향을 말해도 중요한 판단은 혼자 다시 정리하고 싶습니다. 화개의 안쪽으로 들어가는 시간과 ENTJ의 앞에서 이끄는 행동이 서로 다른 일을 맡는 셈입니다. 사람을 잘 움직이는 순간 뒤에 생각을 조용히 점검하는 시간이 있어도 모순은 아닙니다.",
      "entp-rules": "약속을 지킬 생각은 있는데 정해진 방법까지 그대로 따라야 하는지는 별개입니다. 정관의 책임을 지키려는 결에 ENTP의 다른 길을 찾는 행동이 붙으면 이런 긴장이 생깁니다. 바꿔도 되는 방식과 반드시 지킬 결과가 구분되는 환경이면 둘 다 장점으로 쓸 수 있습니다.",
      "enfp-budget": "돈을 남겨두고 싶은 마음 옆에 새로운 경험을 해보고 싶은 마음도 큽니다. 정재의 꾸준함과 ENFP의 경험에 쓰는 성향이 서로 다른 선택을 부릅니다. 생활의 바탕을 지킬 돈과 새 작업을 위해 시험해볼 돈을 나누면 어느 한쪽을 포기하는 느낌이 줄어듭니다.",
    };
    if (manifestations[careerFusion.ruleId]) sections.push(section("fusion-turn", "겉에서 보인 속도가 내 전부는 아닙니다", careerFusion.domain, [
      b("fusion-turn", manifestations[careerFusion.ruleId], proof([], [], [careerFusion], [`v4:career-fusion:${careerFusion.ruleId}`]), "observation", "different-rhythm"),
    ]));
  }
  sections.push(section("fortune", fortune.title, "success/fortune", fortune.paragraphs.map((text, i) => b(`career-fortune-${i}`, text, fortune.proof))));
  sections.push(section("money", voice.id === "precise" ? "조용히 막아낸 손해도 내 보상의 이야기입니다" : voice.id === "creative" ? "잘할수록 싸지는 일은 오래 하기 어렵습니다" : "시간을 쓰는 사람에서, 값을 남기는 사람으로", "money", [
    b("money-character", natalMoney?.text ?? voice.money, natalMoney?.proof ?? voice.proof, "observation", "value-of-skill"), b("money-setting", context.earnings, contextProof, "direction", "earnings-and-buffer"),
  ]));
  sections.push(section("roles", "직업 이름보다, 이런 문제를 맡았을 때", "work", routes.recommendations.map(r =>
    b(`route-${r.id}`, `${r.reason} ${r.environment}`, r.proof, "positive", `role-${r.id}`))));
  sections.push(section("organization", "소속의 이름보다, 내가 힘을 쓸 수 있는 하루", "work", [b("independence", voice.independence, voice.proof, "observation", "organization-choice"),
    ...routes.avoid.map((a, i) => b(`avoid-${i}`, a.text, a.proof, "direction", `environment-${i}`)),
  ]));
  sections.push(section("study", voice.id === "inquiry" ? "한 문제를 다르게 풀어보는 시간이 전문성을 만듭니다" : voice.id === "field" ? "먼저 해본 뒤 다시 읽으면 다른 공부가 됩니다" : "배운 것을 내 실력으로 남기는 방식", "study", [b("study-method", study.text, study.proof, "positive", "learning-method")]));
  sections.push(section("shadow", "장점이 너무 열심히 일할 때 생기는 일", "weaknesses", [b("overuse", voice.shadow, voice.proof, "shadow", "overused-strength")]));
  const balance = careerBalance(state, voice.id);
  if (balance) {
    const { low, text } = balance;
    sections.push(section("balance", "나와 똑같이 움직이지 않는 사람이 편할 때", "relationships", [b("symbolic-environment", text, { features: [low.material.feature], seedIds: [], fusionIds: [], sourceRefs: [...low.sourceRefs, "v4:career-element-symbol"] }, "direction", "symbolic-workplace")]));
  }
  sections.push(section("direction", "다음에는 어떤 일을 맡길 사람으로 남을까", "strengths", [b("career-direction", voice.direction, voice.proof)]));
  const order = context.status === "student" || context.status === "job_seeker" ? ["strengths", "current", "study", "fit", "fusion-turn", "roles", "fortune", "money", "shadow", "organization", "balance", "direction"] :
    context.status === "business_owner" || context.status === "self_employed" ? ["strengths", "current", "fit", "money", "fortune", "roles", "organization", "shadow", "study", "fusion-turn", "balance", "direction"] :
      voice.id === "inquiry" && packet.fortuneComposites.some(f => f.ruleId === "learning-depth") ? ["strengths", "study", "fortune", "current", "fit", "roles", "money", "fusion-turn", "organization", "shadow", "balance", "direction"] :
      packet.fortuneComposites.some(f => f.ruleId === "wealth-and-name" || f.ruleId === "created-value-accumulates") ? ["strengths", "fortune", "current", "money", "fit", "roles", "organization", "study", "shadow", "fusion-turn", "balance", "direction"] :
      ["strengths", "fortune", "current", "fit", "fusion-turn", "money", "roles", "organization", "study", "shadow", "balance", "direction"];
  const narrative: CareerNarrative = { version: "v4-career-narrative-1", headline: voice.headline, opening,
    sections: sections.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id)), recommendations: routes.recommendations, avoidEnvironments: routes.avoid,
    finalLine: voice.final, finalProof: voice.proof };
  const composed = composeEvidenceChapters(input, packet, narrative, "career");
  return { ok: true as const, ...composed, materials: packet, studyBasis: study.basis, selection: { voice: voice.id, workFunction: context.workFunction, workMode: context.workMode }, editorial: reviewNarrative(composed.narrative) };
}
