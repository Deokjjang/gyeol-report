import type { ComprehensiveEditorialPlan, ComprehensivePlanInputs, EditorialCandidate } from "./comprehensivePlanCore";
import type { EvidenceAtom, SemanticAxis } from "./semanticCore";
import { isMeaningfulEvidence } from "./foundationRanking";
import { RELEASE_FACETS, type ReleaseContext } from "./comprehensiveReleaseMaterials";
import { TEN_GOD_SEMANTICS } from "./foundationTenGods";

export type ReleaseSource = { candidate: EditorialCandidate; atom: EvidenceAtom; facet: string; axis: SemanticAxis; direction: 1 | -1 };
const stemNames: Record<string, string> = { 甲:"갑목",乙:"을목",丙:"병화",丁:"정화",戊:"무토",己:"기토",庚:"경금",辛:"신금",壬:"임수",癸:"계수" };
const branchNames: Record<string, string> = { 子:"자수",丑:"축토",寅:"인목",卯:"묘목",辰:"진토",巳:"사화",午:"오화",未:"미토",申:"신금",酉:"유금",戌:"술토",亥:"해수" };
const elementNames: Record<string,string> = {WOOD:"목",FIRE:"화",EARTH:"토",METAL:"금",WATER:"수"};
export function releaseAtomName(e: EvidenceAtom): string {
  const position = {year:"년주",month:"월주",day:"일주",hour:"시주"}[String(e.metadata?.pillar)];
  const stem = stemNames[e.sourceKey];
  if(e.sourceType==="heavenly_stem") return `${e.metadata?.isDayMaster===true?"일간":`${position??"원국"} 천간`} ${stem??e.sourceKey}`;
  if(e.sourceType==="earthly_branch") return `${position??"원국"} 지지 ${branchNames[e.sourceKey]??e.sourceKey}`;
  if(e.sourceType==="ten_god") return `${position??"원국"}의 ${TEN_GOD_SEMANTICS[e.sourceKey as keyof typeof TEN_GOD_SEMANTICS]?.label??e.sourceKey}`;
  if(e.sourceType==="element") return `${elementNames[e.sourceKey]??e.sourceKey} 기운`;
  return typeof e.metadata?.label==="string"?e.metadata.label:"원국에서 확인된 성향";
}
/** Only existing MAIN/SIGNATURE candidates with meaningful non-amplifier root
 * proof enter this language pool. No missing element or MBTI prior is promoted. */
export function collectReleaseSources(plan: ComprehensiveEditorialPlan, profiles: ComprehensivePlanInputs): ReleaseSource[] {
  const rows: ReleaseSource[]=[];
  const blocked = new Set(plan.suppressedCandidates.filter(s=>["UNRESOLVED_CONTRADICTION","INVALID_SOURCE"].includes(s.reason)).map(s=>s.candidateId));
  for(const candidate of plan.candidates) {
    if(!candidate.primaryEligible || candidate.invalidReasons.length || blocked.has(candidate.id) || candidate.fortune || candidate.factBomb
      || candidate.internalComplexity || ["GUIDANCE","FUSION","CORE_GYEOL"].includes(candidate.sourceType)) continue;
    const atoms=profiles.myeongli.evidence.filter(e=>candidate.myeongliEvidenceIds.includes(e.id) && isMeaningfulEvidence(e) && e.tier!=="AMPLIFIER");
    for(const [facet, material] of Object.entries(RELEASE_FACETS)) for(const [axis,direction] of material.axes) {
      if(!candidate.primaryAxes.includes(axis) || (profiles.myeongli.axes[axis]??0)*direction<=0) continue;
      for(const atom of atoms.filter(e=>(e.axes[axis]??0)*direction>0)) rows.push({candidate,atom,facet,axis,direction});
    }
  }
  return rows.sort((a,b)=>b.candidate.priorityScore-a.candidate.priorityScore || b.atom.weight-a.atom.weight || a.candidate.id.localeCompare(b.candidate.id) || a.atom.id.localeCompare(b.atom.id));
}
export type ReleaseAllocation = { meanings: Set<string>; rootUses: Map<string,number>; chosenCandidates: Set<string>; uses: Map<string,number> };
export const freshReleaseAllocation = ():ReleaseAllocation=>({meanings:new Set(),rootUses:new Map(),chosenCandidates:new Set(),uses:new Map()});
export function selectReleaseSource(pool: ReleaseSource[], context: ReleaseContext, memory: ReleaseAllocation, plan: ComprehensiveEditorialPlan,
  preferred: readonly string[] = [], recall = false): ReleaseSource | undefined {
  const eligible=pool.filter(s=>RELEASE_FACETS[s.facet].applications[context] && !memory.meanings.has(`${s.facet}:${context}`)
    // The closing only recalls already introduced roots/facets. Its distinct
    // decision/application role does not consume another primary-claim slot.
    && (recall || (memory.rootUses.get(s.atom.id)??0)<3 && (memory.uses.get(s.facet)??0)<5)
    && !plan.debug.conflictGraph.some(edge=>edge.kind==="CONTRADICTORY" && !edge.resolvedBy.length
      && (edge.left===s.candidate.id && memory.chosenCandidates.has(edge.right) || edge.right===s.candidate.id && memory.chosenCandidates.has(edge.left))));
  eligible.sort((a,b)=>Number(preferred.includes(b.facet))-Number(preferred.includes(a.facet))
    || (memory.uses.get(a.facet)??0)-(memory.uses.get(b.facet)??0)
    || (memory.rootUses.get(a.atom.id)??0)-(memory.rootUses.get(b.atom.id)??0)
    || b.candidate.priorityScore-a.candidate.priorityScore || b.atom.weight-a.atom.weight || a.atom.id.localeCompare(b.atom.id));
  const row=eligible[0];
  if(row) {memory.meanings.add(`${row.facet}:${context}`);memory.rootUses.set(row.atom.id,(memory.rootUses.get(row.atom.id)??0)+1);
    memory.chosenCandidates.add(row.candidate.id);memory.uses.set(row.facet,(memory.uses.get(row.facet)??0)+1);}
  return row;
}
