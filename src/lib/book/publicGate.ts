import "server-only";

// Deliberately no env, request, cookie, query, payload or client override.
// Approved direct-sales release. Paid ticket commerce remains separately OFF.
export function bookExperiencePublicEnabled(): boolean { return true; }
