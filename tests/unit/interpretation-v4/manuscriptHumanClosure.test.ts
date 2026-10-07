import { describe, expect, it } from "vitest";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { classifyCustomerSentence, humanFirstPenalty, statusVocabulary, workBlockIntent } from "../../../src/lib/interpretation-v4/narrativeHumanFirst";
import { clauseShape, rhythmSignature, rhythmPenalty } from "../../../src/lib/interpretation-v4/narrativeRhythm";
import { classifyRecovery } from "../../../src/lib/interpretation-v4/narrativeRecovery";
import { causalAxes, reasonLink } from "../../../src/lib/interpretation-v4/narrativeCausality";
import { coreRecallSurface, directHumanSurface, fusionHumanSurface } from "../../../src/lib/interpretation-v4/narrativeHumanSurface";
import { auditHumanManuscript } from "../../../src/lib/interpretation-v4/manuscriptHumanAudit";
import { humanDescriptiveness } from "../../../src/lib/interpretation-v4/narrativeValidator";
import { visibleMbtiDomainRank } from "../../../src/lib/interpretation-v4/narrativeMbtiReason";
import { NARRATIVE_PATTERNS, compatiblePatterns } from "../../../src/lib/interpretation-v4/narrativePatterns";
import { editorialRow, schedulerInputs, schedulerPlan } from "./comprehensiveSchedulerFixtures";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";
import { buildIntegratedMyeongliProfile } from "../../../src/lib/interpretation-v4/foundationIntegratedProfile";
import { myAtom } from "./fusionSemanticFixtures";
import type { ComprehensiveManuscriptDraft } from "../../../src/lib/interpretation-v4/comprehensiveManuscriptCore";
import type { NarrativeBlockDraft } from "../../../src/lib/interpretation-v4/narrativeCore";
import type { MeaningSignature } from "../../../src/lib/interpretation-v4/narrativeMeaningSignature";

describe("13D-6A2 human surface contracts",()=>{
  it("classifies person, evidence, scene and system separately",()=>{
    expect(classifyCustomerSentence({role:"DIRECT_CLAIM",text:"현침이 정확성을 보조합니다."})).toBe("META_EXPLANATION");
    expect(classifyCustomerSentence({role:"MYEONGLI_REASON",text:"현침은 작은 틀림을 그냥 넘기지 않는 쪽입니다."})).toBe("EVIDENCE_REASON");
    expect(classifyCustomerSentence({role:"LIFE_SCENE",text:"틀린 줄을 다시 봅니다."})).toBe("SCENE");
    expect(classifyCustomerSentence({role:"DIRECT_CLAIM",text:"틀린 부분이 보이면 다시 확인합니다."})).toBe("HUMAN_PROCESS");
    expect(classifyCustomerSentence({role:"FUSION",text:"틀린 점은 빨리 보지만 사람을 몰아붙이지 않는 쪽입니다."})).not.toBe("SHADOW");
  });
  it("penalizes three meta sentences without relaxing the special cap",()=>{
    const meta={role:"DIRECT_CLAIM" as const,text:"이 특징은 다른 해석에서도 확인됩니다."};
    expect(humanFirstPenalty([meta,meta,meta],"C4")).toBeGreaterThan(humanFirstPenalty([meta,meta,meta],"C2"));
    expect(humanFirstPenalty([{role:"DIRECT_CLAIM",text:"틀린 부분이 보이면 확인합니다."},meta],"C4")).toBe(0);
  });
  it.each(["FREELANCER","BUSINESS_OWNER","STUDENT","JOB_SEEKER","OTHER","UNKNOWN"])("no promotion inference for %s",status=>{
    const result=statusVocabulary("성과가 쌓일수록 승진이나 더 큰 책임을 맡는 방향과 잘 맞습니다.",status);
    expect(result).not.toMatch(/승진|높은 직책/);expect(result).toContain("잘 맞습니다");
  });
  it("employee keeps the original conditional claim",()=>{
    const text="성과가 쌓일수록 승진이나 더 큰 책임을 맡는 방향과 잘 맞습니다.";
    expect(statusVocabulary(text,"EMPLOYEE")).toBe(text);
  });
  it("charm cannot borrow research reasons just because a root is present",()=>{
    const c=editorialRow("charm",{sourceId:"A04_QUIET_CHARM",primaryAxes:["DEPTH"]});
    expect(reasonLink(c,myAtom("research",{DEPTH:2,LEARNING:2}))).toBeUndefined();
    expect(causalAxes(c,myAtom("social",{DEPTH:2,SOCIAL_ATTUNEMENT:1}))).toEqual(["SOCIAL_ATTUNEMENT"]);
  });
  it("work-process is not money even when an upstream context is money",()=>{
    const c=editorialRow("process",{primaryAxes:["ACTION_TEMPO"],conditionSplit:{type:"START_MAINTAIN"} as never});
    expect(workBlockIntent(c)).toBe("WORK_STYLE");
    expect(workBlockIntent(editorialRow("money",{primaryAxes:["RESOURCE_SENSE"]}))).toBe("MONEY_STYLE");
  });
  it("growth alone cannot turn into recovery",()=>{
    expect(classifyRecovery(editorialRow("growth",{primaryAxes:["EXPANSION"],sourceText:"더 성장하고 싶습니다."}))).toEqual({kind:"GENERIC_TRAIT",relevance:0});
    expect(classifyRecovery(editorialRow("rest",{primaryAxes:["RECOVERY_NEED"],sourceText:"혼자 쉬며 생각을 정리할 시간이 필요합니다."})).relevance).toBe(1);
    expect(classifyRecovery(editorialRow("care",{primaryAxes:["CARE"],sourceText:"사람을 함부로 몰아붙이지 않는 편입니다."}))).toEqual({kind:"GENERIC_TRAIT",relevance:0});
  });
  it("role and clause shape distinguish strength from shadow/application/action",()=>{
    expect(clauseShape("작은 틀림이 보이면 먼저 확인합니다.")).toBe("WHEN_A_THEN_B");
    expect(clauseShape("잘 찾지만 말이 날카로워집니다.")).toBe("STRENGTH_SHADOW");
    expect(clauseShape("모두 고치려 하지 말고 중요한 곳부터 보세요.")).toBe("PROBLEM_ACTION");
    const meaning={behaviorFamily:"ERROR_FINDING",traitArcRole:"STRENGTH",section:"C4",candidateId:"p"} as MeaningSignature;
    const block={sentences:[{role:"DIRECT_CLAIM",text:"작은 틀림이 보이면 확인합니다."}],sentenceRoles:["DIRECT_CLAIM"],endingSequence:["FORMAL_DA"]} as NarrativeBlockDraft;
    const a=rhythmSignature(block,meaning);
    expect(rhythmPenalty(a,[a])).toBeGreaterThan(rhythmPenalty({...a,traitArcRole:"SHADOW",clauseShape:"STRENGTH_SHADOW"},[a]));
  });
  it("third-first patterns remain explicit opt-ins, not a second renderer",()=>{
    const p=NARRATIVE_PATTERNS.find(p=>p.id==="P27")!;
    expect(p.roleOrderVariants[0][0]).toBe("CLOSER");
    const request={source:{sourceType:"FUSION",fusionType:"TENSION"},intent:"TENSION"} as never;
    expect(compatiblePatterns(request,["CLOSER","MYEONGLI_REASON","MBTI_REASON"]).some(p=>p.id==="P27")).toBe(false);
  });
  it("surface mapping requires a selected semantic rule and does not use MBTI types",()=>{
    expect(fusionHumanSurface(editorialRow("x",{fusionType:"COMPLEMENT",sourceId:"fusion:COMPLEMENT:C036:work"}))).toContain("확인");
    expect(fusionHumanSurface(editorialRow("x",{fusionType:"TENSION",sourceId:"fusion:TENSION:C036:work"}))).toBeUndefined();
    expect(fusionHumanSurface(editorialRow("x",{fusionType:"COMPLEMENT",sourceId:"fusion:COMPLEMENT:unknown:work"}))).toBeUndefined();
  });
  it("a level-two preference is not promoted to a level-three ability",()=>{
    const c=editorialRow("money",{sourceType:"CLAIM",sourceId:"M03_MONEY_OPPORTUNITY",claimLevel:2});
    expect(directHumanSurface(c)).toBeUndefined();
    expect(directHumanSurface({...c,claimLevel:3})).toContain("기회");
  });
  it("final recall keeps the actual core axes and is not its exact opening",()=>{
    const core=editorialRow("core",{sourceType:"CORE_GYEOL",sourceId:"core-gyeol:A_TO_B:x",primaryAxes:["ADAPTABILITY","STRUCTURE_STYLE"],sourceText:"새로운 생각을 자유롭게 펼친 뒤 계획으로 정리하는 사람입니다."});
    expect(coreRecallSurface(core)).not.toBe(core.sourceText);
    expect(coreRecallSurface({...core,primaryAxes:["DEPTH"]})).toBeUndefined();
    const care={...core,sourceId:"core-gyeol:A_BUT_B:x",primaryAxes:["CARE","BOUNDARY"] as const};
    expect(coreRecallSurface({...care,primaryAxes:[...care.primaryAxes]})).toContain("부탁");
  });
  it("the original surface metric and visible MBTI domain constraints stay unchanged",()=>{
    expect(humanDescriptiveness("강점이 있습니다.",true)).toBe(57);
    expect(visibleMbtiDomainRank("WORK","C8","work")).toBeGreaterThan(visibleMbtiDomainRank("STUDY","C8","work"));
    expect(visibleMbtiDomainRank("PARENTS","C2","identity")).toBe(-1);
    expect(visibleMbtiDomainRank("CHILDREN","C7","social")).toBe(-1);
  });
});

// Explicit review-only export. Neither runtime writers nor customer routes import this tool.
if(process.env.HUMAN_CLOSURE_EXPORT==="1") {
  const root="/private/tmp/gyeol-13d6a2-quality";
  type Review={id:string;name:string;mbti:unknown;draft:ComprehensiveManuscriptDraft};
  // Semantic profiles / scheduling have not changed in this phase. Rebuild that
  // same input to audit the captured before prose, never to replace its text.
  const inputs = new Map(NARRATIVE_FIXTURES.map(f=>{
    const natal=buildIntegratedMyeongliProfile(fixtureInput(f).calculation);
    if(!natal.ok) throw new Error(`Review calculation failed: ${f.id}`);
    const profiles=schedulerInputs(natal.value,f.mbti,f.context);
    return [f.id,{profiles,plan:schedulerPlan(profiles),reportStableKey:f.id}] as const;
  }));
  const summarize=(rows:Review[])=>rows.map(r=>({id:r.id,name:r.name,mbti:r.mbti,scores:r.draft.validation.scores,
    hardViolations:r.draft.validation.hardViolations,warnings:r.draft.validation.warnings,
    audit:auditHumanManuscript(r.draft,inputs.get(r.id))}));
  const before=JSON.parse(readFileSync(`${root}/before/review.json`,"utf8")) as Review[];
  const after=JSON.parse(readFileSync("/tmp/gyeol-13d5b-manuscript/review.json","utf8")) as Review[];
  for(const [phase,rows] of [["before",before],["after",after]] as const){
    mkdirSync(`${root}/${phase}/customer`,{recursive:true});
    writeFileSync(`${root}/${phase}/review.json`,JSON.stringify(rows,null,2));
    for(const r of rows)writeFileSync(`${root}/${phase}/customer/${r.id}.txt`,`${r.name} / ${r.mbti??"모름"}\n\n${r.draft.fullText}\n`);
    writeFileSync(`${root}/${phase}-metrics.json`,JSON.stringify(summarize(rows),null,2));
  }
  const metrics=summarize(after),bm=summarize(before);
  writeFileSync(`${root}/comparison.json`,JSON.stringify(metrics.map((r,n)=>({before:bm[n],after:r})),null,2));
  for(const [filename,key] of [["hd-offenders","hdOffenders"],["reward-analysis","reward"],["c9-analysis","c9"],["c10-analysis","c10"],["mbti-visible-source-analysis","mbti"]] as const)
    writeFileSync(`${root}/${filename}.json`,JSON.stringify(metrics.map(r=>({id:r.id,name:r.name,data:(r.audit as Record<string,unknown>)[key]})),null,2));
}
