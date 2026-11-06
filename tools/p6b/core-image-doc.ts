/** docs/v5/core-image-rules.md 생성: pnpm exec tsx tools/p6b/core-image-doc.ts (규칙 원본은 src/lib/brief/coreImage.ts). */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { CORE_IMAGES } from "../../src/lib/brief/coreImage";

const rows = Object.entries(CORE_IMAGES).map(([stem, t]) => [
  `### ${stem} — ${t.noun}`, "",
  "| 규칙 | 조건 | 줄 |", "|---|---|---|",
  `| R1 | 여름 + 수 없음·부족 | ${t.hot} |`, `| R2 | 겨울 + 화 없음·부족 | ${t.cold} |`,
  `| R3 인성 과다 | 나를 생하는 오행이 가장 많음 | ${t.excess.resource} |`, `| R3 식상 과다 | 내가 생하는 오행이 가장 많음 | ${t.excess.output} |`,
  `| R3 재성 과다 | 내가 극하는 오행이 가장 많음 | ${t.excess.wealth} |`, `| R3 관성 과다 | 나를 극하는 오행이 가장 많음 | ${t.excess.officer} |`,
  `| R4 비겁 과다 | 일간 오행이 가장 많음 | ${t.peer} |`,
  ...(["spring", "summer", "autumn", "winter"] as const).map(s => `| R5 ${({ spring: "봄", summer: "여름", autumn: "가을", winter: "겨울" })[s]} | 신강 / 중화 / 신약 | ${t.place[s]} ${t.subject.strong} / … ${t.subject.medium} / … ${t.subject.weak} |`), "",
].join("\n"));
const doc = `# 핵심 이미지 규칙 (P6b B-4)

일간 + 태어난 계절(월지) + 강약 + 오행 분포로 한 줄을 결정론 합성한다. 원본: \`src/lib/brief/coreImage.ts\`(이 문서는 \`pnpm exec tsx tools/p6b/core-image-doc.ts\`로 생성).
첫 장에서 한 번 소개하고 이후에는 필요할 때만 짧게 되짚는다. 궁합은 두 사람 이미지를 합친 관계 이미지(pairImage) 하나.

## 규칙 (위에서부터 첫 일치)

1. **R1 더위**: 여름(巳午未월) 태생이고 수(물)가 없음·부족 → 더위 줄(조후상 물이 가장 급함)
2. **R2 추위**: 겨울(亥子丑월) 태생이고 화(불)가 없음·부족 → 추위 줄(조후상 불이 가장 급함)
3. **R3 과다**: 가장 강한 오행이 "많음"이고 일간 오행이 아니면, 일간과의 관계(인성·식상·재성·관성)별 줄
4. **R4 비겁 과다**: 가장 강한 오행이 "많음"이고 일간 오행과 같으면 비겁 줄
5. **R5 기본**: 계절 자리 + 강약 주인공(신강 VERY_STRONG·STRONG / 중화 BALANCED / 신약 WEAK·VERY_WEAK)

강약은 엔진 \`structureAnalysis.dayMasterStrength.level\`, 분포는 \`elementBalance\`(많음·보통·부족·없음)를 그대로 쓴다.
금지: 지식 DB 그림 별명(easyName), 농촌·고전 소품, 비유 표지("처럼"·"마치"), 40자 초과(테스트 \`tests/unit/brief/coreImage.test.ts\`).

## 궁합 관계 이미지 (pairImage)

두 일간 오행의 생극으로 정한다: 같으면 "나란히 서 있는 사이", 생하면 "A가 B를 ~ 키우는/데워 주는 사이", 극하면 "A가 B를 ~ 다듬는/잡아 주는 사이".
명사: ${Object.entries(CORE_IMAGES).map(([s, t]) => `${s} ${t.noun}`).join(" · ")}.
생: 목→화 타오르게 돕는 · 화→토 따뜻하게 데워 주는 · 토→금 품어 키우는 · 금→수 맑게 흘려보내는 · 수→목 적셔 키우는.
극: 목→토 뿌리로 붙잡아 주는 · 토→수 물길을 잡아 주는 · 수→화 식혀 주는 · 화→금 달궈 다듬는 · 금→목 다듬어 주는.

## 일간별 표

${rows.join("\n")}`;
writeFileSync(join(import.meta.dirname, "../../docs/v5/core-image-rules.md"), doc);
console.log("docs/v5/core-image-rules.md");
