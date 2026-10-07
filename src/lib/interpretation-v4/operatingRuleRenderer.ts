import type { ManuscriptInput, ComprehensiveManuscriptDraft, RenderedComprehensiveSection } from "./comprehensiveManuscriptCore";
import { GYEOL_COMPREHENSIVE_MANUSCRIPT_VERSION } from "./comprehensiveManuscriptCore";
import { buildOperatingRules } from "./operatingRuleBuilder";
import { renderNarrativeBlock } from "./narrativeBlockRenderer";
import type { NarrativeSourceUnit } from "./narrativeCore";

export function renderOperatingManual(input:ManuscriptInput,draft:ComprehensiveManuscriptDraft){
  const {eligible,selected}=buildOperatingRules(input,draft);
  const core = input.plan.candidates.find(c=>c.sourceType==="CORE_GYEOL" && draft.sections.C1?.sourceCandidateIds.includes(c.id));
  const closingRule = selected[0];
  const ordered = [...selected.slice(1), ...selected.slice(0,1)];
  const section:RenderedComprehensiveSection={sectionId:"C10",sectionKind:"OPERATING_MANUAL",title:selected.find(r=>!Object.values(draft.sections).some(s=>s.title===r.shortTitle))?.shortTitle??"앞에서 찾은 나의 사용법",blocks:[],plainText:"",sourceCandidateIds:[],evidenceIds:[],semanticThemes:[],explicitMbtiCount:0,sceneIds:[],terminologyUsed:[],operatingRules:[],validation:{hardViolations:[],warnings:[]}};
  let memory=structuredClone(draft.narrativeMemory);
  for(const rule of ordered){
    const refs={evidenceIds:rule.evidenceIds,claimIds:rule.sourceClaimIds,fusionIds:rule.sourceFusionIds,resonanceIds:rule.sourceResonanceIds,guidanceIds:rule.sourceGuidanceIds.length?rule.sourceGuidanceIds:[rule.id],mbtiSourceNodeIds:rule.mbtiSourceNodeIds};
    const source:NarrativeSourceUnit={id:rule.id,sourceType:"GUIDANCE",semanticTheme:rule.semanticTheme,primaryAxes:[],contexts:["identity"],confidence:rule.confidence,directnessLevel:2,metadata:{problemAlreadyExplained:true},phrases:[{id:`${rule.id}:action`,role:"ACTION",text:rule.ruleText,semanticTheme:rule.semanticTheme,primaryAxes:[],contexts:["identity"],refs,directnessLevel:2,origin:"GUIDANCE"}]};
    if(rule.id===closingRule?.id && core && /사람입니다[.]$/.test(core.sourceText)) {
      source.phrases=[...source.phrases,{id:`${rule.id}:core-recall`,role:"DIRECT_CLAIM",text:core.sourceText.replace(/사람입니다[.]$/,"사람이라는 점을 잊지 않는 게 중요합니다."),
        semanticTheme:rule.semanticTheme,primaryAxes:[],contexts:["identity"],directnessLevel:2,origin:"SYNTHESIS",
        refs:{evidenceIds:core.myeongliEvidenceIds,claimIds:core.claimIds,fusionIds:core.fusionIds,resonanceIds:core.resonanceIds,guidanceIds:[],mbtiSourceNodeIds:core.mbtiSourceNodeIds}}];
    }
    let result=renderNarrativeBlock({source,reportStableKey:input.reportStableKey,sectionId:"C10",intent:"GUIDANCE",context:"identity",depthIntent:"SHORT",presentationIntent:"HIDDEN",explicitMbtiBudget:7,engineVersion:GYEOL_COMPREHENSIVE_MANUSCRIPT_VERSION},memory.language);
    if(!result.ok || source.phrases.length>1)result=renderNarrativeBlock({source,reportStableKey:input.reportStableKey,sectionId:"C10",intent:"GUIDANCE",context:"identity",depthIntent:"SHORT",presentationIntent:"HIDDEN",explicitMbtiBudget:7,engineVersion:GYEOL_COMPREHENSIVE_MANUSCRIPT_VERSION,patternId:"P17"},memory.language);
    if(source.phrases.length>1) {
      for(let variant=0;variant<12;variant++) {
        const r=renderNarrativeBlock({source,reportStableKey:input.reportStableKey,sectionId:"C10",intent:"GUIDANCE",context:"identity",depthIntent:"SHORT",presentationIntent:"HIDDEN",explicitMbtiBudget:7,engineVersion:GYEOL_COMPREHENSIVE_MANUSCRIPT_VERSION,patternId:variant%2?"P17":"P12",occurrenceIndex:variant},memory.language);
        if(r.ok && r.block.sentences[0]?.sourcePhraseId.endsWith(":core-recall") && r.block.sentences.length<=3){result=r;break;}
      }
      if(!result.block.sentences.some(s=>s.sourcePhraseId.endsWith(":core-recall")))section.validation.warnings.push({code:"CORE_RECALL_NOT_REALIZED",refs:[rule.id]});
    }
    if(!result.ok){section.validation.warnings.push({code:"OPERATING_RULE_NOT_REALIZED",refs:[rule.id]});continue;}
    memory={...memory,language:result.nextMemory};section.blocks.push(result.block);
    section.evidenceIds.push(...rule.evidenceIds);section.semanticThemes.push(rule.semanticTheme);
    section.evidenceIds.push(...result.block.sentences.flatMap(s=>s.evidenceIds));
    section.operatingRules!.push({candidateId:rule.id,text:result.block.plainText,antecedentCandidateIds:rule.antecedentCandidateIds,source:rule});
    draft.debug.sources[`C10:${rule.id}`]={source,rule};
  }
  section.evidenceIds=[...new Set(section.evidenceIds)];section.semanticThemes=[...new Set(section.semanticThemes)];
  section.plainText=section.blocks.map(b=>b.plainText).join("\n\n");
  draft.debug.operatingRules={eligible,rendered:section.operatingRules!.map(r=>r.candidateId)};
  if(section.operatingRules!.length<Math.min(3,eligible.length))section.validation.warnings.push({code:"ELIGIBLE_OPERATING_RULES_NOT_RENDERED",refs:[]});
  return{section,memory};
}
