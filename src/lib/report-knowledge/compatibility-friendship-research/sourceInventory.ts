/** Static offline friendship research. No runtime registration or customer approval. */
import type { SourceGroup } from "./researchTypes";
export const FRIENDSHIP_SOURCE_GROUPS: readonly SourceGroup[] = [
  {
    "id": "frpr:inventory:personal-natal",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "kind": "natal_definition",
    "manifestRef": "inherited-foundation-audit.json",
    "records": 1036,
    "sourceDefinitionsAreCalculatedEvidence": false,
    "automaticMeaningTransfer": false
  },
  {
    "id": "frpr:inventory:individual-mbti",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "kind": "individual_mbti",
    "manifestRef": "individualMbtiCrosswalk.json",
    "records": 1213,
    "sourceDefinitionsAreCalculatedEvidence": false,
    "automaticMeaningTransfer": false
  },
  {
    "id": "frpr:inventory:individual-fusion",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "kind": "individual_fusion",
    "manifestRef": "fusionCrosswalk.json",
    "records": 164,
    "sourceDefinitionsAreCalculatedEvidence": false,
    "automaticMeaningTransfer": false
  },
  {
    "id": "frpr:inventory:recipient-ten-god",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "kind": "recipient_definition",
    "manifestRef": "recipientTenGodResearch.json",
    "records": 10,
    "sourceDefinitionsAreCalculatedEvidence": false,
    "automaticMeaningTransfer": false
  },
  {
    "id": "frpr:inventory:canonical-pair",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "kind": "canonical_membership",
    "manifestRef": "canonicalRelationCrosswalk.json",
    "records": 64,
    "sourceDefinitionsAreCalculatedEvidence": false,
    "automaticMeaningTransfer": false
  },
  {
    "id": "frpr:inventory:mbti-pair",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "kind": "directed_reference",
    "manifestRef": "mbtiPairCrosswalk.json",
    "records": 256,
    "sourceDefinitionsAreCalculatedEvidence": false,
    "automaticMeaningTransfer": false
  }
];
