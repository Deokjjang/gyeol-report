export type CalendarType = "SOLAR" | "LUNAR";

export type Gender = "MALE" | "FEMALE" | "OTHER_OR_UNSPECIFIED";

export type GenerationStatus = "PENDING" | "GENERATING" | "READY" | "FAILED";

export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

export type PaymentProvider = "TOSS";

export type ProviderPaymentStatus =
  | "READY"
  | "PAID"
  | "FAILED"
  | "CANCELED"
  | "REFUNDED";

export type BlockTone = "SOFT" | "DIRECT" | "BALANCED";
