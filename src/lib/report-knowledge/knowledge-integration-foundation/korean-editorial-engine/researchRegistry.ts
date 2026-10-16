import { KOREAN_EDITORIAL_FUNCTIONS } from '../../korean-editorial-research/functionResearch';
import { KOREAN_CLAIM_RESEARCH } from '../../korean-editorial-research/claimResearch';
import { KOREAN_EXPRESSION_MATERIALS } from '../../korean-editorial-research/expressionMaterials';
import { KOREAN_PRODUCT_STYLES } from '../../korean-editorial-research/productStyles';
import { KOREAN_RELATIONSHIP_STUDIES } from '../../korean-editorial-research/relationshipStyles';
import { KOREAN_CONDITIONAL_SCENES } from '../../korean-editorial-research/sceneResearch';
import { KOREAN_GRAMMAR_RESEARCH } from '../../korean-editorial-research/grammarResearch';
import { KOREAN_GRAMMAR_FIXTURES } from '../../korean-editorial-research/grammarFixtures';
import { KOREAN_TRANSITION_RESEARCH } from '../../korean-editorial-research/transitionResearch';
import { KOREAN_RHYTHM_RESEARCH } from '../../korean-editorial-research/rhythmResearch';
import { KOREAN_TERM_EXPLANATIONS } from '../../korean-editorial-research/termExplanationResearch';
import { KOREAN_COMPATIBILITY_ROLE_VIEWS } from '../../korean-editorial-research/compatibilityRoleViews';
import { KOREAN_BINDING_INVARIANT_FIXTURES } from '../../korean-editorial-research/invariantFixtures';
import { KOREAN_REJECTED_EXPRESSIONS } from '../../korean-editorial-research/rejectedMaterials';
import { KOREAN_EXPRESSION_BINDING } from '../../korean-editorial-research/bindingDesign';
import { KOREAN_EDITORIAL_SOURCES } from '../../korean-editorial-research/sourceInventory';
import { recordHash } from '../sourceReader';

export const RESEARCH = {
  functions: KOREAN_EDITORIAL_FUNCTIONS, claims: KOREAN_CLAIM_RESEARCH, expressions: KOREAN_EXPRESSION_MATERIALS,
  products: KOREAN_PRODUCT_STYLES, relationships: KOREAN_RELATIONSHIP_STUDIES, scenes: KOREAN_CONDITIONAL_SCENES,
  grammar: KOREAN_GRAMMAR_RESEARCH, grammarFixtures: KOREAN_GRAMMAR_FIXTURES, transitions: KOREAN_TRANSITION_RESEARCH,
  rhythm: KOREAN_RHYTHM_RESEARCH, terms: KOREAN_TERM_EXPLANATIONS, roles: KOREAN_COMPATIBILITY_ROLE_VIEWS,
  invariants: KOREAN_BINDING_INVARIANT_FIXTURES, rejected: KOREAN_REJECTED_EXPRESSIONS,
  stages: KOREAN_EXPRESSION_BINDING, sources: KOREAN_EDITORIAL_SOURCES,
} as const;
export function auditResearchRegistry() {
  const rows = Object.entries(RESEARCH).flatMap(([family, records]) => records.map(r => ({ family, id: r.id, recordHash: recordHash(r), source: 'source' in r ? r.source : null,
    referenceOnly: true, customerApproved: r.approvedForCustomer, connectedToRuntime: r.connectedToRuntime })));
  if (rows.length !== 392 || new Set(rows.map(r => r.id)).size !== 392 || rows.some(r => r.customerApproved || r.connectedToRuntime)) throw Error('ORIGINAL_KOREAN_RESEARCH_BOUNDARY_CHANGED');
  return rows;
}
