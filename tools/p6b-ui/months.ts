// 세운 달 카드의 기간 상태 확인(기준일별).
import { join } from "node:path";
import { buildBrief, loadKnowledge } from "../../src/lib/brief";
import { payloadToBriefInput } from "../../src/lib/writer/book";
const base = process.argv[2] ?? "2026-11-03";
const k = loadKnowledge(join(import.meta.dirname, "../../src/data/knowledge-v5"));
const raw = { productKey: "annual_fortune", productSlug: "annual-fortune", person: { name: "하람", birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" }, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: [] }, productOptions: { selectedYear: "2026" } };
const brief = buildBrief(payloadToBriefInput(raw as never, base) as never, k);
for (const e of brief.timeline!.entries) console.log(e.key, e.period, e.when, e.label, e.ganji.hanja);
