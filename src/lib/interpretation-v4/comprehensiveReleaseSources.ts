import type { ComprehensiveEditorialPlan, ComprehensivePlanInputs, EditorialCandidate } from "./comprehensivePlanCore";
import type { EvidenceAtom, SemanticAxis } from "./semanticCore";
import { isMeaningfulEvidence } from "./foundationRanking";
import { RELEASE_FACETS, RELEASE_POSITIVE, type ReleaseContext } from "./comprehensiveReleaseMaterials";
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
  const eligible=pool.filter(s=>(context==="positive"?RELEASE_POSITIVE[s.facet]:RELEASE_FACETS[s.facet].applications[context]) && !memory.meanings.has(`${s.facet}:${context}`)
    // Recall applications must use introduced roots/facets (renderer checks
    // both); a new contextual question is not another primary definition.
    && (recall || (memory.rootUses.get(s.atom.id)??0)<3 && (memory.uses.get(s.facet)??0)<5)
    && !plan.debug.conflictGraph.some(edge=>edge.kind==="CONTRADICTORY" && !edge.resolvedBy.length
      && (edge.left===s.candidate.id && memory.chosenCandidates.has(edge.right) || edge.right===s.candidate.id && memory.chosenCandidates.has(edge.left))));
  eligible.sort((a,b)=>Number(preferred.includes(b.facet))-Number(preferred.includes(a.facet))
    || (memory.uses.get(a.facet)??0)-(memory.uses.get(b.facet)??0)
    || (memory.rootUses.get(a.atom.id)??0)-(memory.rootUses.get(b.atom.id)??0)
    || b.candidate.priorityScore-a.candidate.priorityScore || b.atom.weight-a.atom.weight || a.atom.id.localeCompare(b.atom.id));
  const row=eligible[0];
  return row;
}

/** Selection is a proposal. Only a successfully emitted paragraph commits it. */
export function commitReleaseSource(row:ReleaseSource,context:ReleaseContext,memory:ReleaseAllocation,application=false) {
  memory.meanings.add(`${row.facet}:${context}`);
  memory.chosenCandidates.add(row.candidate.id);
  if(!application) {
    memory.rootUses.set(row.atom.id,(memory.rootUses.get(row.atom.id)??0)+1);
    memory.uses.set(row.facet,(memory.uses.get(row.facet)??0)+1);
  }
}
export type ReleaseDemand = {slot:string;context:ReleaseContext;preferred:readonly string[];fixed?:ReleaseSource};
export type ReleasePreflight = {demands:ReleaseDemand[];blocked:Set<string>};
/** Reserve all discovered chapter questions together. Existing primary limits
 * (three/root, five/facet) remain intact. CH05 maintenance, CH07 opportunity
 * and CH12 relationship questions apply introduced proof without redefining it. */
export function allocateReleaseDemands(pool:ReleaseSource[], preflight:ReleasePreflight, plan:ComprehensiveEditorialPlan) {
  const memory=freshReleaseAllocation();preflight.blocked.forEach(k=>memory.meanings.add(k));
  const choices=new Map<string,ReleaseSource>();
  const demands=preflight.demands.filter(d=>!d.slot.startsWith("CH12")&&!d.slot.startsWith("CH13")&&d.slot!=="CH05.P4"&&d.context!=="positive");
  const independent=pool.filter((s,i)=>pool.findIndex(r=>r.facet===s.facet&&r.atom.id===s.atom.id)===i);
  let complete=true;const failures:string[]=[];
  for(const d of demands.filter(d=>d.fixed)) {
    // Discovery already emitted this fixed introduction before later Fusion
    // applications. A later definition reservation cannot erase that owner.
    memory.meanings.delete(`${d.fixed!.facet}:${d.context}`);
    const row=selectReleaseSource([d.fixed!],d.context,memory,plan,d.preferred);
    if(!row){complete=false;failures.push(`FIXED:${d.slot}`);break;}choices.set(d.slot,row);commitReleaseSource(row,d.context,memory);
  }
  const pending=demands.filter(d=>!d.fixed);
  const available=new Map(pending.map(d=>[d.slot,independent.filter(row=>!!selectReleaseSource([row],d.context,memory,plan,d.preferred))]));
  type Edge={to:string;capacity:number;reverse:Edge};
  const graph=new Map<string,Edge[]>();
  const edge=(from:string,to:string,capacity:number)=>{
    const forward={to,capacity} as Edge, reverse={to:from,capacity:0,reverse:forward};forward.reverse=reverse;
    graph.set(from,[...(graph.get(from)??[]),forward]);graph.set(to,[...(graph.get(to)??[]),reverse]);return forward;
  };
  const facetEdges=new Map<string,{facet:string;edge:Edge}[]>(), links=new Set<string>();
  for(const d of pending) {
    edge("start",d.slot,1);
    const rows=available.get(d.slot)!.sort((a,b)=>Number(d.preferred.includes(b.facet))-Number(d.preferred.includes(a.facet))
      ||b.candidate.priorityScore-a.candidate.priorityScore||b.atom.weight-a.atom.weight||a.facet.localeCompare(b.facet));
    const facets=[...new Set(rows.map(s=>s.facet))];
    facetEdges.set(d.slot,facets.map(facet=>({facet,edge:edge(d.slot,`${facet}:${d.context}`,1)})));
    for(const facet of facets) {
      const contextKey=`${facet}:${d.context}`;
      if(!links.has(contextKey)){edge(contextKey,`facet:${facet}`,1);links.add(contextKey);}
      if(!links.has(facet)){edge(`facet:${facet}`,"end",Math.min(Math.max(0,5-(memory.uses.get(facet)??0)),[...new Set(independent.filter(s=>s.facet===facet).map(s=>s.atom.id))].reduce((n,id)=>n+Math.max(0,3-(memory.rootUses.get(id)??0)),0)));links.add(facet);}
    }
  }
  function augment(node:string,seen:Set<string>):boolean {
    if(node==="end")return true;seen.add(node);
    for(const e of graph.get(node)??[])if(e.capacity>0&&!seen.has(e.to)&&augment(e.to,seen)){e.capacity--;e.reverse.capacity++;return true;}
    return false;
  }
  let matched=0;while(augment("start",new Set()))matched++;
  if(matched!==pending.length){complete=false;failures.push(`FACETS:${matched}/${pending.length}`);}
  // Match roots across the entire reserved book too. A locally convenient
  // root must not consume the only usable root of a later paragraph.
  const scheduled=pending.map(d=>({d,facet:facetEdges.get(d.slot)!.find(x=>x.edge.capacity===0)?.facet}));
  graph.clear();links.clear();
  const rootEdges=new Map<string,{row:ReleaseSource;edge:Edge}[]>();
  for(const {d,facet} of scheduled) {
    edge("start",d.slot,1);
    const rows=available.get(d.slot)!.filter(s=>s.facet===facet);
    rootEdges.set(d.slot,rows.map(row=>({row,edge:edge(d.slot,`root:${row.atom.id}`,1)})));
    for(const row of rows)if(!links.has(row.atom.id)){edge(`root:${row.atom.id}`,"end",Math.max(0,3-(memory.rootUses.get(row.atom.id)??0)));links.add(row.atom.id);}
  }
  let rootsMatched=0;while(augment("start",new Set()))rootsMatched++;
  if(rootsMatched!==pending.length){complete=false;failures.push(`ROOTS:${rootsMatched}/${pending.length}`);}
  for(const {d} of scheduled) {
    const proposed=rootEdges.get(d.slot)!.find(x=>x.edge.capacity===0)?.row;
    const row=proposed&&selectReleaseSource([proposed],d.context,memory,plan,d.preferred);
    if(!row){complete=false;failures.push(`ROOT_CONFLICT:${d.slot}:${proposed?.facet}:${proposed?.atom.id}`);continue;}choices.set(d.slot,row);commitReleaseSource(row,d.context,memory);
  }
  // Incomplete/unknown input is not given fabricated proof or a paid failure.
  // Preserve fixed upstream choices and let the renderer safely shorten.
  if(!complete) {choices.clear();for(const d of demands)if(d.fixed)choices.set(d.slot,d.fixed);}
  const socialMemory=freshReleaseAllocation();preflight.blocked.forEach(k=>socialMemory.meanings.add(k));
  for(const d of demands){const row=choices.get(d.slot);if(row)commitReleaseSource(row,d.context,socialMemory);}
  for(const d of preflight.demands.filter(d=>d.slot.startsWith("CH12")||d.slot==="CH05.P4"||d.context==="positive")) {
    const prior=pool.filter(s=>[...choices.entries()].some(([slot,r])=>slot<d.slot&&r.atom.id===s.atom.id&&r.facet===s.facet));
    const row=selectReleaseSource(prior,d.context,socialMemory,plan,d.preferred,true);
    if(row){choices.set(d.slot,row);commitReleaseSource(row,d.context,socialMemory,true);}
  }
  return {choices,complete,failures,attempts:matched,blocked:[...preflight.blocked],demands:preflight.demands.map(d=>({slot:d.slot,context:d.context,reserved:choices.has(d.slot)}))};
}
