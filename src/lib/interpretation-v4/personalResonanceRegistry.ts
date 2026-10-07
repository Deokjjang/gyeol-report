import { THINKING_ACTION_RESONANCE } from "./personalResonanceRegistryThinking";
import { WORK_VALUE_RESONANCE } from "./personalResonanceRegistryValues";
import { RELATIONSHIP_RESONANCE } from "./personalResonanceRegistryRelationships";
import { RECOVERY_IDENTITY_RESONANCE } from "./personalResonanceRegistryIdentity";
import type { ResonanceDefinition } from "./personalResonanceCore";

export const PERSONAL_RESONANCE_REGISTRY: readonly ResonanceDefinition[] = [
  ...THINKING_ACTION_RESONANCE, ...WORK_VALUE_RESONANCE, ...RELATIONSHIP_RESONANCE, ...RECOVERY_IDENTITY_RESONANCE,
];
