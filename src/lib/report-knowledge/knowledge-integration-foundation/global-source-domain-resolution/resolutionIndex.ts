import {readGlobalArtifact} from "../global-specialist-integration/artifactReader";
import {digest} from "../global-specialist-integration/candidateEnvelope";
import {bindingCoverage} from "../knowledge-binder/engine";
import type {CandidateEnvelope} from "../global-specialist-integration/types";
import type {KnowledgeBindingReceipt} from "../knowledge-binder/types";
import type {CandidateImpact} from "./types";
export const GLOBAL_DIR = "docs/validation/v4-global-specialist-integration-audit-01";
export type FrozenCase = {engineId: string; fixtureId: string; envelopes: CandidateEnvelope[]; originalReceipts: KnowledgeBindingReceipt[]};
export class ResolutionIndex {
  readonly candidates = new Map<string, CandidateImpact>();
  readonly byCatalog = new Map<string, Set<string>>();
  readonly receiptHashes = new Map<string, string>();
  readonly cases: {name: string; engineId: string; fixtureId: string}[];
  readonly manifest: Record<string, unknown>;
  constructor(readonly root: string) {
    this.manifest = this.read("global-specialist-manifest.json") as Record<string, unknown>;
    this.cases = this.read("global-case-files.json") as typeof this.cases;
    const expected = {engines:12, graphCases:27, evaluations:5073, sourceBefore:10536, sourceAfter:11170, evidenceBefore:917, evidenceAfter:1489, structuralBefore:81, structuralAfter:81, actualCustomerEligible:0, bookAllocations:0};
    for(const [k,v] of Object.entries(expected)) if(this.manifest[k]!==v) throw Error("FROZEN_GLOBAL_BASELINE_CHANGED:"+k);
    const totals={source:0,evidence:0,structural:0};
    for(const c of this.cases) {
      const data=this.read(c.name) as FrozenCase;
      if(data.engineId!==c.engineId||data.fixtureId!==c.fixtureId||data.envelopes.length!==data.originalReceipts.length) throw Error("FROZEN_CASE_SCOPE_OR_COUNT");
      const cov=bindingCoverage(data.originalReceipts);totals.source+=cov.sourceMatchOccurrences;totals.evidence+=cov.actualEvidenceMatchOccurrences;totals.structural+=cov.structurallyMatched;
      for(const [i,e] of data.envelopes.entries()) {
        const r=data.originalReceipts[i];
        if(digest(r)!==e.originalBinderReceipt.hash||digest(r.allTwelveGateResults)!==digest(e.normalizedGateResults)||r.customerApproved||r.operatorApproved) throw Error("FROZEN_RECEIPT_OR_GATE_CHANGED");
        const {identity,engine,productScope,relationshipScope,fixtureScope,questionLinks,readerAddress,actualEvidenceWitnesses,sourceRequirements,sourceGroups,originalBinderReceipt,normalizedGateResults,ownerRequirements,directionRequirements,temporalRequirements}=e;
        this.candidates.set(identity.globalId,{identity,engine,productScope,relationshipScope,fixtureScope,questionLinks,readerAddress,actualEvidenceWitnesses,sourceRequirements,sourceGroups,originalBinderReceipt,normalizedGateResults,ownerRequirements,directionRequirements,temporalRequirements,receiptId:r.receiptId,structural:bindingCoverage([r]).structurallyMatched===1});
        this.receiptHashes.set(originalBinderReceipt.key,originalBinderReceipt.hash);
      }
    }
    const impact=this.read("global-blocker-impact.json") as {sourceImpact: Record<string,string[]>};
    for(const [k,addresses] of Object.entries(impact.sourceImpact)) {
      if(addresses.some(a=>!this.candidates.has(a))) throw Error("BLOCKER_ADDRESS_NOT_IN_FROZEN_COHORT");
      this.byCatalog.set(k,new Set(addresses));
    }
    if(this.candidates.size!==5073||this.cases.length!==27||new Set(this.cases.map(c=>c.engineId)).size!==12||digest(totals)!==digest({source:11170,evidence:1489,structural:81})) throw Error("ORIGINAL_COHORT_CHANGED");
  }
  read(name: string) {return readGlobalArtifact(this.root+"/"+GLOBAL_DIR,name);}
  affected(key: string) {return [...this.byCatalog.get(key)??[]].sort().map(a=>this.candidates.get(a)!);}
}
