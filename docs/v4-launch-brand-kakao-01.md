# LAUNCH-BRAND-AND-KAKAO-01

Base: `v4/ticket-commerce-04b` / `e32a6a2b3f4be9cd1bc9d3261faefd9352a0ea91`

Branch: `v4/launch-brand-kakao-01`

Date: 2026-10-11 KST

## Scope and protection

- Optional Kakao member onboarding + site book icons only.
- Existing Supabase OAuth, required consent, `next`, account eligibility, reward/payment/publication authority unchanged.
- No Production DB, migration, deployment, real payment/refund, real channel addition, or public gate activation.
- `.gitignore`, `AGENTS.md`, `supabase/.temp/` preserved and excluded.
- No changes to six covers/colors, manuscript, OG image, Kakao share payload/URL, Meta, launch dates, ticket pricing or refund policy.

## Official API and configuration

Reference: [Kakao channel JS guide](https://developers.kakao.com/docs/ko/kakaotalk-channel/js), [SDK Channel reference](https://developers.kakao.com/sdk/reference/js/release/Kakao.Channel.html).

Use **`Kakao.Channel.addChannel({ channelPublicId })`**, not `followChannel`.
Supabase OAuth verifies the member on the server. The browser does not receive a Supabase provider access token or call `Kakao.Auth.setAccessToken`.

SDK 2.8.3 source confirms `addChannel` returns void: desktop opens a channel window; mobile may invoke the app. It cannot prove friendship. UI says “카카오톡에서 채널 추가를 진행해 주세요.” It never says the addition succeeded.

Reuse existing Share SDK identity: `gyeol-kakao-sdk`, CDN 2.8.3, same SRI/crossOrigin/afterInteractive. Next Script deduplicates by the existing identity/source. Share initialization checks `isInitialized`; share logic and payload are unchanged. Local mode never loads the real SDK.

| Setting | Contract / current verification |
| --- | --- |
| `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY` | Existing public JS key contract; absent in this checkout's `.env.local` |
| `NEXT_PUBLIC_KAKAO_CHANNEL_PUBLIC_ID` | New optional public profile ID; absent in this checkout's `.env.local` |
| Kakao app / channel linkage | Administrator verification pending |
| JS SDK allowed domains | Verify `https://gyeolreport.com`, `https://www.gyeolreport.com` in the intended app |
| Channel / API availability | Administrator verification pending; no actual invocation performed |

The existing footer points to `pf.kakao.com/_sbHaX`. This is not proof that the intended app, channel administrator settings, or allowed domains are configured. The search handle `gyeolreport` is not substituted as the public ID. No ID is hardcoded and no environment file or Kakao console was changed. Set the two configuration values only after administrator verification; do not use QA values in deployment. Next public key changes require a new build.

Missing key, missing ID, or malformed profile ID → omit server descriptor and render no prompt. Normal login/purchase remains available.

## Eligibility and optional preference

1. Existing `currentUser()` uses Supabase `getUser`, with the verified provider from `app_metadata`.
2. Existing current-version required consent must resolve to `member`.
3. Only Kakao members receive an optional `channelPrompt` session field. Google, guest, and consent-incomplete responses do not.
4. The server derives a stable SHA-256 preference scope from the verified ID. No raw UUID/email/token is exposed for localStorage keys.
5. Browser preference key: `gyeol-channel-prompt-v1:<opaque scope>`; value: `later` or `add_clicked`.

This is a browser/account preference, not an authentication, consent, reward, or friendship record. Different Kakao accounts have different scopes. Revalidation hides the prompt while checking the current account; old aborted session responses cannot replace the latest response.

Storage unavailable → per-tab memory fallback. Another device, browser, cleared site data, or unavailable persistence may display the prompt again. No new table, RPC, or DB write was added. Cross-tab storage updates close an existing prompt for the same account.

## Timing and accessible presentation

- Display on the account/library screen, Book home, or idle Book input after verified consent.
- First-time and returning eligible members use the same condition.
- Do not mount on a receipt, payment approval page, ticket store, report reading page, or publication state. A login returning directly to such a page defers the optional prompt until a safe surface.
- Existing `next` cookie/redirect and Book draft restoration are not changed.
- Native modal dialog, accessible title/description, explicit Tab/Shift-Tab loop, Escape as “나중에”, native focus restoration with cleanup fallback, 48px buttons.
- White/black thin-rule editorial presentation; no reward badge or required opt-in.
- `addChannel` runs synchronously inside the explicit button click. No async session/API fetch precedes it.
- SDK 2.8.3 hides the desktop popup handle. The helper observes `window.open` only during that synchronous call and restores it in `finally`; null yields a blocked-popup message. Mobile void return is only a request, not success.
- SDK missing/loading/init/call failure leaves “나중에”/“닫기” available. After a click, a safe HTTPS profile link provides a manual fallback. Buttons do not grant rewards or delay consent/purchases.

## Book icon

Canonical source: `src/app/icon.svg` — 96×96 square, black background, two warm-white page silhouettes, central gutter, no orbit/star/gradient.

Generate with `node scripts/generate-book-icons.mjs` using the installed Next dependency Sharp. No independent redraws:

- `favicon.ico`: PNG entries 16, 32, 48, 64px; 32-bit ICO directory verified.
- `apple-icon.png`: 180×180 square.

Installed Next 16 file-convention metadata is used; no metadata override or additional manifest is introduced. The existing header is text branding, and the existing OG asset is unrelated and unchanged.

Chrome head inspection returned hashed `favicon.ico` (64×64 metadata; ICO contains all four entries), `icon.svg` (any), and `apple-icon.png` (180×180). All assets are derived from the same SVG, checked byte-for-byte by tests. Existing browser favicon caches or previously installed home-screen shortcuts may need refresh/reinstallation; real-device home-screen installation was not performed.

## Validation

| Check | Result |
| --- | --- |
| Related account/library/referral/campaign/launch/ledger/share + Commerce 01–04B core | 27 files, **489 PASS / 0 FAIL / 0 SKIP**, includes 21 new tests |
| Final focused channel/Book share/report share | 3 files, **52 PASS / 0 FAIL / 0 SKIP** (overlaps above, not additive) |
| Additional auth/Supabase/Book share rerun | 3 files, 65 PASS (overlaps above) |
| Lint | PASS |
| Build | PASS; unchanged local-fixture NFT tracing paths emit 11 warnings; no build error |
| TypeScript | 390 existing diagnostics, 0 new after normalizing source line locations and union member order |
| Diff check | PASS |
| Production / public gate changes | None |

Unit coverage: verified-provider eligibility, consent, missing key/ID, rejected search handle, opaque account separation, browser preference/reload/blocked storage, gesture-only official signature, popup null/throw/missing SDK, window.open restoration, unchanged Share method, same SDK identity, excluded payment states, exact icon derivatives and automatic metadata.

Chrome QA used the existing local account adapter and a Mock SDK with all external requests blocked. Actual local signup consent and returning login were exercised. Kakao A/B UI separation additionally uses an intercepted session descriptor; real server A/B scope/provider verification is covered in handler tests, not claimed as two real Supabase sign-ins.

QA key/ID were process-local mock values only. After capture the dev server was restarted without these values; no environment file was changed. The normal local configuration remains fail-closed.

- 390 / 430 / 768 / 1440: prompt, primary/later controls, wrapping, focus loop, Escape, no horizontal overflow.
- Later/reload suppressed; separate scope shown; add-click/reload suppressed.
- Guest, incomplete consent, Google, missing ID: no automatic prompt.
- Popup blocked, missing/throwing SDK: safe message, close/fallback available.
- Logout and Google/Kakao login return: correct optional behavior.
- Book input name entered through the form survived OAuth `next` return and dismiss.
- Large text/reduced available height: dialog scroll retains controls.
- Icon 16/32/48/64 actual ICO PNG entries rendered in Chrome with 4× nearest-pixel inspection.
- Browser runtime/console errors: 0; hydration errors: 0; external requests/real Kakao calls: 0.
- Existing `/dev/measurement` local-only interaction capture was observed on Book input; no Production analytics or Meta transmission. Only local auth/consent and existing local interaction requests were allowed; no financial/reward calls.

Local artifacts (not production assets):

- `/private/tmp/gyeol-brand-kakao/screenshots/390-channel-prompt.png`
- `430-channel-prompt.png`, `768-channel-prompt.png`, `1440-channel-prompt.png`
- `1440-account-dismissed.png`, `1440-book-preserved.png`
- `390-popup-blocked.png`, `390-sdk-unavailable.png`, `390-channel-requested.png`
- `390-book-input-return.png`, `390-large-text.png`, `icon-16-32-48-64.png`
- `/private/tmp/gyeol-brand-kakao/browser.json`
- `/private/tmp/gyeol-brand-kakao-browser.mjs` (local-only QA runner; no permanent QA route)

## Remaining operational work

Administrator must verify the intended channel public ID, app linkage, existing JS key, permitted domains and API availability. This task did not access secret pages or make those changes. Real configured channel addition remains unverified, intentionally fail-closed. No other phase or rollout is started.

```text
KAKAO_CHANNEL_PROMPT_READY: YES
KAKAO_CHANNEL_REAL_CONFIG_VERIFIED: NO
BOOK_BRAND_ICON_READY: YES
FAVICON_APPLE_ICON_VERIFIED: YES
VISUAL_QA_COMPLETE: YES
PRODUCTION_ACTIVATED: NO
```
