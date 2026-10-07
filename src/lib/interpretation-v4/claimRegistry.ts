import { MONEY_CLAIMS } from "./claimRegistryMoney";
import { STATUS_CLAIMS } from "./claimRegistryStatus";
import { SUCCESS_CLAIMS } from "./claimRegistrySuccess";
import { SOCIAL_CLAIMS } from "./claimRegistrySocial";
import { FACT_BOMB_CLAIMS } from "./claimRegistryFactBomb";

export const CLAIM_REGISTRY = [...MONEY_CLAIMS, ...STATUS_CLAIMS, ...SUCCESS_CLAIMS, ...SOCIAL_CLAIMS, ...FACT_BOMB_CLAIMS];
/** Explicit allowlist, not inferred from whichever copy happens to be present. */
export const LEVEL4_CLAIM_IDS = ["M08_GOOD_WEALTH_PATTERN", "S03_HIGH_POSITION", "S04_HONOR_FORTUNE", "S08_MONEY_AND_HONOR", "P01_PEOPLE_LUCK"] as const;
export const FORTUNE_CLAIM_IDS = [...LEVEL4_CLAIM_IDS, "A01_FIRST_IMPRESSION_CHARM", "A02_INTIMATE_CHARM", "A05_ROMANTIC_VISIBILITY"] as const;
