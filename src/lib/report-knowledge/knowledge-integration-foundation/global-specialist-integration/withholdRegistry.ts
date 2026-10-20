export function globalWithholdCategory(code: string): string {
  if (/HASH|INTEGRITY/.test(code)) return "SOURCE_HASH_UNVERIFIED";
  if (/GROUP/.test(code)) return "SOURCE_GROUP_INCOMPLETE";
  if (/ANCESTR/.test(code)) return "ANCESTRY_INCOMPLETE";
  if (/DOMAIN/.test(code)) return "DISALLOWED_DOMAIN";
  if (/OWNER/.test(code)) return "OWNER_UNKNOWN";
  if (/DIRECTION|PARTICIPANT/.test(code)) return "DIRECTION_UNKNOWN";
  if (/TIME|PERIOD|TEMPORAL|WINDOW/.test(code)) return "TEMPORAL_SCOPE_UNKNOWN";
  if (/PRODUCER/.test(code)) return "PRODUCER_UNSUPPORTED";
  if (/CONTEXT|USER_STATE|INPUT/.test(code)) return "ACTUAL_USER_CONTEXT_UNKNOWN";
  if (/COUNTEREXAMPLE|PROHIBITION/.test(code)) return "COUNTEREXAMPLE_REVIEW_REQUIRED";
  if (/DISPLAY|INTRODUC|RECALL|REPAIR/.test(code)) return "ACTUAL_DISPLAY_MISSING";
  if (/APPROVAL/.test(code)) return "CUSTOMER_APPROVAL_PENDING";
  if (/SEMANTIC|MEANING|INTERPRETATION/.test(code)) return "SEMANTIC_REVIEW_REQUIRED";
  if (/SOURCE|REFERENCE/.test(code)) return "SOURCE_MISSING";
  return "SPECIALIST_CONTRACT_INCOMPLETE";
}
