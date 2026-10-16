import {describe,expect,it} from "vitest";
import {mkdtempSync,readFileSync,writeFileSync,readdirSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {DeterministicArtifactWriter} from "../../../src/lib/report-knowledge/knowledge-integration-foundation/global-specialist-integration/deterministicArtifacts";
import {readGlobalArtifact,SHARD_FORMAT} from "../../../src/lib/report-knowledge/knowledge-integration-foundation/global-specialist-integration/artifactReader";
describe("lossless deterministic audit storage",()=>{
 const value=Array.from({length:6},(_,i)=>({originalId:"fixture-"+i,state:i%2?"UNKNOWN":"NOT_APPLICABLE",payload:"x".repeat(9*1024*1024)}));
 it("reconstructs every array record and gate state without omissions",()=>{
  const out=mkdtempSync(join(tmpdir(),"gyeol-global-array-shards-")),writer=new DeterministicArtifactWriter(out,new Set());writer.write("global-test.json",value);writer.finish();
  expect(JSON.parse(readFileSync(join(out,"global-test.json"),"utf8")).format).toBe(SHARD_FORMAT);
  expect(readGlobalArtifact(out,"global-test.json")).toEqual(value);
  expect(readdirSync(out).filter(f=>f.includes("part"))).toHaveLength(6);
 },30000);
 it("preserves object insertion order and all referenced source lists",()=>{
  const data={sourceImpact:Object.fromEntries(value.map((v,i)=>["source-"+i,v])),actualCustomerEligible:0,sourceGroupSemantics:"UNKNOWN_GROUP_SEMANTICS"};
  const out=mkdtempSync(join(tmpdir(),"gyeol-global-object-shards-")),writer=new DeterministicArtifactWriter(out,new Set());writer.write("global-test.json",data);writer.finish();
  expect(JSON.stringify(readGlobalArtifact(out,"global-test.json"))).toBe(JSON.stringify(data));
 },30000);
 it("rejects a modified source shard instead of returning partial results",()=>{
  const out=mkdtempSync(join(tmpdir(),"gyeol-global-tamper-shards-")),writer=new DeterministicArtifactWriter(out,new Set());writer.write("global-test.json",value);
  const index=JSON.parse(readFileSync(join(out,"global-test.json"),"utf8")) as {parts:{file:string}[]};const f=join(out,index.parts[0].file);writeFileSync(f,readFileSync(f,"utf8").replace("fixture-0","forged-00"));
  expect(()=>readGlobalArtifact(out,"global-test.json")).toThrow("GLOBAL_ARTIFACT_SHARD_HASH_MISMATCH");
 },30000);
 it("rejects an outside-directory reference",()=>{
  const out=mkdtempSync(join(tmpdir(),"gyeol-global-unsafe-shards-"));writeFileSync(join(out,"global-test.json"),JSON.stringify({format:SHARD_FORMAT,shape:"ARRAY",logicalJsonHash:"forged",parts:[{kind:"CHUNK",file:"../private.json",sha256:"forged"}]}));
  expect(()=>readGlobalArtifact(out,"global-test.json")).toThrow("UNSAFE_GLOBAL_ARTIFACT_REFERENCE");
 });
});
