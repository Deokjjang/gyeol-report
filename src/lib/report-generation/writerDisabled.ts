// The OpenAI report writer was removed; every product draft is deterministic.
// Workers keep a runtime argument so call sites and the claim_job audit stay stable.
export type NoWriterRuntime = { readonly enabled: false; readonly reason: string };

export const WRITER_DISABLED_RUNTIME: NoWriterRuntime = { enabled: false, reason: "flag_disabled" };
