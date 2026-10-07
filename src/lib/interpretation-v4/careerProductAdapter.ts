import "server-only";
import { createHash } from "node:crypto";
import { buildIntegratedMyeongliProfile } from "./foundationIntegratedProfile";
import { buildMbtiSemanticProfile } from "./mbtiSemanticProfile";
import { buildMyeongliMbtiFusion } from "./fusionSemanticProfile";
import { buildClaimProfile } from "./claimProfile";
import { buildPersonalResonanceProfile } from "./personalResonanceProfile";
import { buildContextualGuidanceProfile } from "./guidanceProfile";
import { selectCareerProductSources, type CareerQuestion } from "./careerProductSelection";
import { createCareerRenderer, careerProof } from "./careerProductNarrative";
import { buildMyeongliMaterialPacket } from "./materialPacket";
import { selectCareerVoice } from "./careerVoices";
import { careerWorkNarrative } from "./careerWorkNarrative";
import { careerRecommendations } from "./careerRecommendations";
import { careerStudy } from "./careerStudy";
import { careerBalance } from "./careerBalance";
import { STRENGTH_USE_RULES, GUIDANCE_SHORT_TITLES } from "./operatingRuleRegistry";
import { chooseNarrativeTitle } from "./narrativeTitleCore";
import { selectedProofAxes } from "./comprehensiveNarrativeAdapter";
import { WORK_APPLICATION } from "./narrativeHumanSurface";
import type { SemanticAxis } from "./semanticCore";
import type { GuidanceStrategyId } from "./guidanceCore";
import type { NarrativeInput, NarrativeState, NarrativeBlock, NarrativeSection, NarrativeProof } from "./narrativeTypes";
import type { CareerNarrative } from "./careerNarrativeTypes";

export const CAREER_PRODUCT_VERSION = "career-product-13d-7a-v1";
const fail = (error: string) => ({ ok: false as const, errors: [error] });
const compact = <T>(a: (T | undefined)[]): T[] => a.filter((v): v is T => v !== undefined);
const routeAxes: Record<string, SemanticAxis[]> = {
  review: ["PRECISION"], investigate: ["DEPTH", "CURIOSITY"], create: ["CREATION", "EXPRESSION"],
  teach: ["LEARNING", "CARE"], lead: ["LEADERSHIP", "DUTY"], manage: ["PERSISTENCE", "STABILITY"],
  market: ["RESOURCE_SENSE", "OPPORTUNITY_SENSE"], experience: ["SOCIAL_ATTUNEMENT", "EXPRESSION"],
};

/** Generation-time product boundary only. Core semantics never receive job text;
 * legacy recommendation ranking stays authoritative. Persisted readers do not call this. */
export function buildV4CareerProduct(input: NarrativeInput) {
  const m = buildIntegratedMyeongliProfile(input.calculation);
  if (!m.ok) return fail("CAREER_SEMANTIC_INVALID");
  const b = buildMbtiSemanticProfile(input.mbti || null);
  if (!b.ok) return fail("CAREER_MBTI_INVALID");
  const f = buildMyeongliMbtiFusion(m.value, b.value);
  if (!f.ok) return fail("CAREER_FUSION_INVALID");
  const c = buildClaimProfile(m.value, b.value, f.value);
  if (!c.ok) return fail("CAREER_CLAIMS_INVALID");
  const r = buildPersonalResonanceProfile(m.value, b.value, f.value, c.value);
  if (!r.ok) return fail("CAREER_RESONANCE_INVALID");
  const shared = { myeongli: m.value, mbti: b.value, fusion: f.value, claims: c.value, resonance: r.value };
  const g = buildContextualGuidanceProfile(shared, input.context);
  if (!g.ok) return fail("CAREER_CONTEXT_INVALID");
  const profiles = { ...shared, guidance: g.value };
  const selection = selectCareerProductSources(profiles);
  const reportStableKey = createHash("sha256").update(JSON.stringify([CAREER_PRODUCT_VERSION, input.name, input.calculation.pillars,
    input.calculation.birthTimeContext, input.mbti || null, input.context.jobStatus, input.context.detailJob])).digest("hex");
  const renderer = createCareerRenderer(profiles, reportStableKey);
  const packet = buildMyeongliMaterialPacket({ calculation: input.calculation, mbti: input.mbti });
  const pillar = packet.selected.find(m => m.material.category === "dayPillar"), master = packet.selected.find(m => m.material.category === "dayMaster");
  if (!pillar || !master) return fail("CAREER_NATAL_MATERIAL_MISSING");
  const state: NarrativeState = { input, packet, pillar, master, usedSeeds: new Set(), featureUses: new Map() };
  const voice = selectCareerVoice(state), context = careerWorkNarrative(input), routes = careerRecommendations(state, voice, context), study = careerStudy(state);
  const contextProof: NarrativeProof = { features: [], seedIds: [], fusionIds: [], sourceRefs: context.sourceRefs };
  const block = (id: string, text: string, proof: NarrativeProof, tone: NarrativeBlock["tone"] = "positive"): NarrativeBlock => ({ id, text, proof, tone, mode: "prose" });
  const blocks = (q: CareerQuestion) => compact(selection.selected.filter(p => p.question === q).map(p => renderer.placement(p)));
  const opening = blocks("K1");
  if (!opening.length) return fail("CAREER_WORK_CORE_MISSING");
  const hero = selection.selected.find(p => p.question === "K1")!.candidate;
  const headline = chooseNarrativeTitle(hero, "C8", [], reportStableKey, g.value.context.lifeStatus).text;
  const sections: NarrativeSection[] = [];
  const add = (id: string, title: string, domain: NarrativeSection["domain"], content: NarrativeBlock[]) => {
    if (content.length) sections.push({ id, title, domain, blocks: content });
  };
  add("strengths", voice.strengthTitle, "strengths", blocks("K2"));
  const unknownContext = g.value.context.lifeStatus === "UNKNOWN";
  add("current", unknownContext ? "익숙하게 해낸 일에서 다음 선택을 찾습니다" : context.currentTitle, "work", context.current.map((text, i) => block(`current-${i}`, text, contextProof, "observation")));
  add("fit", "그 일에서 유난히 내 방식이 드러나는 순간", "work", blocks("K3"));
  add("fortune", "일에서 써볼 만한 좋은 패", "success/fortune", compact(selection.fortunes.map(c => renderer.render(c, "fortune", c.contexts.includes("work") ? "work" : "money"))));
  const earnings = unknownContext ? "수입과 생활비를 함께 보면 다음 선택에 쓸 수 있는 여유도 보입니다." : context.earnings;
  add("money", "시간을 쓰는 사람에서, 값을 남기는 사람으로", "money", [...blocks("K5"), block("earnings-context", earnings, contextProof, "direction")]);
  // No new recommendation algorithm. Names/order/count/legacy evidence stay intact.
  // An additional why is allowed only when an independently selected 13D work
  // source supports the existing direction. Otherwise canonical rationale suffices.
  const recommendationGrounding: { id: string; sourceIds: string[] }[] = [];
  const recommendations = routes.recommendations.map(rec => {
    const source = selection.candidates.find(c => !c.factBomb && !c.fortune && c.sourceType !== "GUIDANCE" && c.contexts.includes("work")
      && routeAxes[rec.id]?.some(axis => c.primaryAxes.includes(axis) && (selectedProofAxes(c, profiles)[axis] ?? 0) > 0));
    const axis = source && routeAxes[rec.id]?.find(a => source.primaryAxes.includes(a) && (selectedProofAxes(source, profiles)[a] ?? 0) > 0 && WORK_APPLICATION[a]);
    const why = axis ? WORK_APPLICATION[axis] : undefined;
    recommendationGrounding.push({ id: rec.id, sourceIds: [...rec.proof.sourceRefs, ...(source && why ? source.evidenceIds : [])] });
    return why && source ? { ...rec, reason: `${rec.reason} ${why}`, proof: { ...rec.proof, sourceRefs: [...rec.proof.sourceRefs, ...source.evidenceIds] } } : rec;
  });
  add("roles", "직업 이름보다, 이런 문제를 맡았을 때", "work", recommendations.map(rec => block(`route-${rec.id}`, `${rec.reason} ${rec.environment}`, rec.proof)));
  add("organization", "소속의 이름보다, 내가 힘을 쓸 수 있는 하루", "work", [...blocks("K4"), ...blocks("K6"), ...routes.avoid.map((a, i) => block(`avoid-${i}`, a.text, a.proof, "direction"))]);
  add("study", "배운 것을 내 실력으로 남기는 방식", "study", [block("study-method", study.text, study.proof)]);
  add("shadow", "장점이 너무 열심히 일할 때 생기는 일", "weaknesses", blocks("K7"));
  const balance = careerBalance(state, voice.id);
  if (balance) add("balance", "나와 똑같이 움직이지 않는 사람이 편할 때", "relationships", [block("symbolic-workplace", balance.text,
    { features: [balance.low.material.feature], seedIds: [], fusionIds: [], sourceRefs: balance.low.sourceRefs }, "direction")]);
  const operating: NarrativeBlock[] = [], ruleHeadings: string[] = [];
  for (const c of selection.operating) {
    const rendered = renderer.render(c, "K10", c.contexts.includes("work") ? "work" : c.contexts.includes("money") ? "money" : c.contexts.includes("learning") ? "learning" : "recovery");
    if (rendered) { operating.push(rendered); ruleHeadings.push(GUIDANCE_SHORT_TITLES[c.strategyIds![0] as GuidanceStrategyId]); }
  }
  // Same existing positive use rules as 6A, licensed by an introduced positive
  // work source. No fabricated problem is needed to make a sparse manual longer.
  for (const rule of STRENGTH_USE_RULES) {
    if (operating.length >= 5) break;
    const source = selection.selected.find(p => p.question !== "K7" && p.candidate.primaryAxes.includes(rule.axis)
      && (selectedProofAxes(p.candidate, profiles)[rule.axis] ?? 0) > 0 && renderer.rendered.some(r => r.source === p.candidate.id));
    if (!source || operating.length >= 3 || ruleHeadings.includes(rule.title)) continue;
    const rendered = renderer.render(source.candidate, "K10", source.context, { text: rule.text, title: rule.title, ref: `strength-use:${rule.axis}` });
    if (rendered) { operating.push(rendered); ruleHeadings.push(rule.title); }
  }
  if (!operating.length) return fail("CAREER_OPERATING_RULES_MISSING");
  add("direction", "다음에는 어떤 일을 맡길 사람으로 남을까", "strengths", operating);
  const order = selection.learning ? ["strengths", "current", "study", "fit", "roles", "fortune", "money", "shadow", "organization", "balance", "direction"]
    : g.value.context.lifeStatus === "BUSINESS_OWNER" ? ["strengths", "current", "fit", "money", "fortune", "roles", "organization", "shadow", "study", "balance", "direction"]
      : ["strengths", "fortune", "current", "fit", "money", "roles", "organization", "study", "shadow", "balance", "direction"];
  sections.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  const finalLine = operating.at(-1)!.text;
  const narrative: CareerNarrative = { version: "v4-career-narrative-1", headline, opening, sections,
    recommendations, avoidEnvironments: routes.avoid, finalLine, finalProof: operating.at(-1)!.proof };
  const text = [...opening, ...sections.flatMap(s => s.blocks)].map(b => b.text).join("\n");
  if (g.value.context.lifeStatus !== "EMPLOYEE" && /승진|상사|부하 직원|현재 회사/.test(text)) return fail("CAREER_CONTEXT_UNSAFE");
  if (/사업하면 성공|무조건 승진|CEO가 됩니다|큰돈을 법니다|반드시 해야|회사생활이 맞지/.test(text)) return fail("CAREER_UNSUPPORTED_DESTINY");
  return { ok: true as const, writerVersion: CAREER_PRODUCT_VERSION, narrative, materials: packet, editorial: [], studyBasis: study.basis,
    selection: { voice: voice.id, workFunction: context.workFunction, workMode: context.workMode },
    integration: { reportStableKey, context: g.value.context, explicitMbtiUsage: renderer.explicitMbtiUsage,
      represented: renderer.rendered, suppressed: renderer.diagnostics, ruleHeadings, recommendationGrounding,
      profileDigests: { claims: createHash("sha256").update(JSON.stringify(c.value)).digest("hex"), resonance: createHash("sha256").update(JSON.stringify(r.value)).digest("hex") },
      questions: { K1: "core", K2: "strengths", K3: "fit", K4: "organization", K5: "money", K6: "organization", K7: "shadow", K8: "current", K9: "roles", K10: "direction" },
      fortuneClaims: selection.fortunes.map(c => ({ id: c.sourceId, level: c.claimLevel, proof: careerProof(c) })) } };
}
export type CareerProduct = Extract<ReturnType<typeof buildV4CareerProduct>, { ok: true }>;
