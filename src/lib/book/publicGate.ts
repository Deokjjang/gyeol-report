import "server-only";

// Deliberately no env, request, cookie, query, payload or client override.
// Activation requires a separately reviewed server-code change.
export function bookExperiencePublicEnabled(): boolean { return false; }
