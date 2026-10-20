import policy from './deployment-policy.json';
export function readerAccess(env: NodeJS.ProcessEnv, host: string | null) {
  if (env.VERCEL) {
    // A URL, client flag or request header cannot activate a deployment. The
    // independent project must first have administrator-verified protection.
    return env.VERCEL_ENV === 'preview' && policy.protectionVerified === true
      && typeof policy.approvedProjectId === 'string' && env.VERCEL_PROJECT_ID === policy.approvedProjectId;
  }
  return env.NODE_ENV === 'development' && host === '127.0.0.1:4318';
}
export function reviewConfiguration(env: NodeJS.ProcessEnv) {
  const key = env.GYEOL_STAGING_REVIEW_PUBLIC_KEY, source = env.VERCEL ? env.VERCEL_GIT_COMMIT_SHA : env.GYEOL_STAGING_SOURCE_COMMIT;
  return key && source && /^[a-f0-9]{40}$/.test(source) ? { key, source } : null;
}
export const reviewHeaders = {
  'Cache-Control': 'private, no-store, max-age=0', 'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Resource-Policy': 'same-origin', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff',
};
