import { ATOMIC_REGISTRY } from "../../../src/lib/interpretation-v3/atomicRegistry";
import { buildInventory, STRUCTURED_FAMILIES } from "../../../src/lib/interpretation-v3/inventory";
import { TEN_GOD_PAIR_REVIEW, COMPOUND_RULES } from "../../../src/lib/interpretation-v3/compounds";
import { BRIDGE_SCENE_RULES } from "../../../src/lib/report-knowledge/bridge/interactionSceneRules";
import { EXTRACTOR_DIRECT_IDS, EXTRACTOR_SUPPLIED_IDS } from "../../../src/lib/interpretation-v3/featureCapabilities";
import { LIFE_SCENES, RELATIONSHIP_SCENES, CAREER_RULES } from "../../../src/lib/interpretation-v3/context";

const cell = (text: unknown) => String(text).replaceAll("|", "\\|").replaceAll("\n", " ");
const table = (headers: string[], rows: readonly (readonly unknown[])[]) => [headers, headers.map(() => "---"), ...rows].map(row => `| ${row.map(cell).join(" | ")} |`).join("\n");
const percent = (n: number, total: number) => `${n}/${total} (${(100 * n / total).toFixed(2)}%)`;
const products: Record<string, string> = { saju_mbti_full: "종합", career_money_study: "직업", love_marriage_child: "연애", saju_mbti_compatibility: "궁합", major_fortune: "대운", annual_fortune: "세운" };
export function renderV3Documents(): Readonly<Record<string, string>> {
  const inventory = buildInventory(), reviewed = ATOMIC_REGISTRY.filter(m => m.readiness === "reviewed"), extractor = inventory.filter(r => r.id.startsWith("extractor:"));
  const inventoryDoc = ["# V3 전체 evidence inventory", "", "기준: master edacb1b. 이 문서는 실행 가능한 계산기 목록과 해석 지식 목록을 분리한다. `knowledge-only`는 그 사람에게 있다는 뜻이 아니다. `input`은 upstream 확인 사실을 전달해야 하는 매핑이며 계산기로 간주하지 않는다.", "",
    "현재 상품 열은 현행 evidence/knowledge 라우팅 소비 경로를 뜻한다. 해당 상품의 모든 고객 본문에 각 행이 실제 노출된다는 의미가 아니다. 전 범주 목록 다음에 추출기 전체 출력 가능 ID, literal union, 해석 사전, native detector, MBTI 모든 trait/pair/bridge 레코드를 열거한다. V2 legacy compatibility score는 분석 근거와 V3 해석에서 제외한다.", "",
    `구조화 범주 ${STRUCTURED_FAMILIES.length}/${STRUCTURED_FAMILIES.length} (100%). 총 ${inventory.length}행은 범주·별칭·지식 레코드·열거형을 포함한 감사 행 수이며, 독립 사실의 개수가 아니다.`, "",
    table(["canonical ID / name", "source / producer", "shape", "domain", "현행 소비 상품", "availability / V3 coverage"], inventory.map(r => [`${r.id} / ${r.name}`, `${r.source} / ${r.producer}`, r.shape, r.domains.join(", "), r.currentProducts.map(p => products[p]).join("·"), `${r.availability} / ${r.coverage}`])), ""].join("\n");
  const atomDoc = ["# Atomic coverage / uncovered", "", `명리 재료 ${percent(ATOMIC_REGISTRY.length, ATOMIC_REGISTRY.length)}. 추출기 가능한 ID의 재료 ${percent(extractor.length, new Set([...EXTRACTOR_DIRECT_IDS, ...EXTRACTOR_SUPPLIED_IDS]).size)}. 이 중 V3 문구까지 검토된 추출기 ID는 ${percent(extractor.filter(r => r.coverage === "reviewed-material").length, extractor.length)}. 전체 재료 중 검토 문구 ${percent(reviewed.length, ATOMIC_REGISTRY.length)}.`, "",
    "material은 기존 의미·장면·분야별 활용·주의·태그를 보존한 조합 재료다. reviewed는 V3 확정형/체감 질문/지침/주의 문구까지 있는 항목이다. 빈 배열은 출처에 해당 재료가 없다는 뜻이며 생성해서 채우지 않았다. 원자 재료는 최종 리포트가 아니다. MBTI 16유형의 모든 traits/axes/functions/pairs/hints는 inventory와 별도 source adapter/fusion에서 소비하며, 명리 원자 수에 중복 가산하지 않는다.", "",
    table(["ID", "이름", "상태", "source refs", "적용 domain", "비어 있는 재료"], ATOMIC_REGISTRY.map(m => [m.id, m.name, m.readiness, m.sourceRefs.join(", "), m.contextTags.join(", "), [!m.feltQuestions.length && "feltQuestions", !m.personalityExpression.length && "personalityExpression", !m.strength.length && "strength", !m.overuseRisk.length && "overuseRisk", !m.modernUses.length && "modernUses", !m.directives.length && "directives", ...Object.entries(m.use).filter(([, v]) => !v.length).map(([d]) => `${d}Use`)].filter(Boolean).join(", ")])), "",
    "## 출처/검토가 더 필요한 항목", "", "십이운성 12개는 현재 계산/표시 사실이 있으나 이 레지스트리에 재사용할 해석 출처가 없다. fact-only로 유지하며 임의 의미를 넣지 않는다. 아래 needs-source 목록의 fusion 항목은 의미가 없는 것이 아니라 기존 규칙이 요구하는 strength evidence가 더 필요하다는 뜻이다.", "",
    table(["ID", "필요한 근거"], inventory.filter(r => r.coverage === "needs-source").map(r => [r.id, r.shape])), "",
    "나머지 material 상태 원자는 출처는 있으나 V3 문구 검토가 아직 필요하다. 기존 V2의 조건부/공포성 문구를 단순 치환하여 확정형으로 올리지 않는다. native 신살 코드 별칭과 같은 의미의 taxonomy ID는 동일 lineage로 처리한다.", ""].join("\n");
  const compoundDoc = ["# Compound · MBTI · context contracts", "", "## 십성 45쌍 전체 audit", "",
    `45/45 (100%). meaningful ${TEN_GOD_PAIR_REVIEW.filter(p => p.classification === "meaningful").length}, tension ${TEN_GOD_PAIR_REVIEW.filter(p => p.classification === "tension").length}, no-special ${TEN_GOD_PAIR_REVIEW.filter(p => p.classification === "no-special-compound").length}. 동시 존재는 고전 격국의 성립이나 고객 점수가 아니다. 의미는 두 기존 원자 의미의 조합이며, 강도는 별도 provenance 규칙을 통과해야 한다.`, "",
    table(["pair", "family", "분류", "판정 / no-op 이유", "지침", "출처"], TEN_GOD_PAIR_REVIEW.map(p => [p.pair.join(" + "), p.family, p.classification, p.judgment, p.directive || p.caution, p.sourceRefs.join(", ")])), "",
    "## 일반 조합", "", `실행 규칙 ${COMPOUND_RULES.length}개: 십성 40개 + 혼합 6개. AND-of-OR predicate와 semantic group을 사용한다. 사실 종류는 day master/pillar/season/yinyang/element/hidden stem/ten god/life stage/shinsal/gwiin/structure/relation/spouse palace/fortune/MBTI/context를 수용한다. 출처가 없는 추가 조합은 만들지 않는다. 일간·일주·운성·관계의 개별 복합 문구는 Phase 2 검토 대상으로 남긴다.`, "",
    table(["rule", "필수 근거 (OR / AND)", "domain", "source"], COMPOUND_RULES.filter(r => !r.id.startsWith("pair:")).map(r => [r.id, r.allOf.map(g => g.join(" OR ")).join(" AND "), r.domains.join(", "), r.sourceRefs.join(", ")])), "",
    "## MBTI fusion", "", `기존 ${BRIDGE_SCENE_RULES.length}개 scene을 exact fact predicate + 실제 trait ID로 재사용한다. six interaction types 전부 테스트한다. MBTI 유형 문자열만으로 매칭하지 않고, source trait 전체가 있어야 한다. source scene/meaning은 재료로 유지하며 V3 렌더에는 검토된 원자 판단 + 안전한 구체 장면/행동을 사용한다. 미검토 문구를 일괄 확정형으로 바꾸지 않는다.`, "",
    table(["rule", "MBTI", "interaction", "traits", "context"], BRIDGE_SCENE_RULES.map(r => [r.id, r.mbti, r.type, r.traits.map(t => t.join(":")).join(", "), r.contexts.join(", ")])), "",
    "## 현재 맥락", "", "명리 근거는 그대로 두고 장면과 행동만 바꾼다. 정재+편재는 employee(성과/보상 협상), business_owner(계약/정산/반복 수익), freelancer(고객/단가), student(시간/비용 선택), job_seeker/resting(역할 탐색)별 별도 지침을 갖는다. 관계 상태도 별도 장면을 선택한다.", "",
    table(["status", "scene"], [...Object.entries(LIFE_SCENES), ...Object.entries(RELATIONSHIP_SCENES)]), "",
    "자유 직업 문자열은 industry, roleFamily, customerFacing, analysis/creative/sales/operations/rule/leadership/physicalIntensity, keyWorkModes, outputTypes, successMetrics, stakeholders로 정규화한다. 알려지지 않은 분야는 unknown/null/[]이며 직무의 요구와 실제 개인 능력을 혼동하지 않는다. 규칙이 겹치면 선언 순서로 분야→직무→리더 역할을 보완한다. `CareerContextEnricher`는 동일 shape를 반환하는 미래 인터페이스만 있고 구현/호출이 없다.", "",
    table(["taxonomy rule", "keyword", "fields"], CAREER_RULES.map(r => [r.id, r.pattern.source, Object.keys(r.fields).join(", ")])), ""].join("\n");
  return { "FEATURE_INVENTORY.md": inventoryDoc, "ATOMIC_COVERAGE.md": atomDoc, "COMPOUNDS_MBTI_CONTEXT.md": compoundDoc };
}
