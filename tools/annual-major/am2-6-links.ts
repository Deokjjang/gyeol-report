/** AM2-6 1부 보기(호출 0): 고리 재료 · 둘째 핵심 · 바람 고리와 그 엔진 값 · 입력 출처. NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-6-links.ts <case> [key 이름 …] */
import { intakeOf } from "./am2-brief";
import { payloadFor } from "./am2-6-books";
import { verifyLinks } from "../../src/lib/writer/chunked/link";
const [id, ...want] = process.argv.slice(2);
const { brief, intake } = intakeOf(payloadFor(id));
const keys = intake.chapters.flatMap(c => c.keys ?? []);
for (const k of keys.filter(x => !want.length || want.includes(x.label))) for (const l of k.links ?? []) console.log(`${k.label} [${l.kind}${l.nth ? ` · ${l.nth}번째` : ""}${l.dir ? ` · ${l.dir}` : ""}] ${l.text}\n   엔진: ${l.engine.join(", ")} · 입력: ${l.input.join(", ")}${k.areas ? ` · key 영역 ${k.areas.join(",")}` : ""}${k.scene ? ` · 장면(${k.sceneArea}) ${k.scene}` : ""}`);
console.log("verifyLinks:", JSON.stringify(verifyLinks(brief, keys)), "· 바람 고리:", JSON.stringify(intake.chapters.find(c => c.id === "big")?.wishLinks ?? []));
