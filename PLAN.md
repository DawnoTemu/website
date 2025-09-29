# Task & Context
- Investigate post-commit drop in GA4 tracking by reviewing consent/cookie implementation and GTM/GA4 configuration, and propose actionable fixes.

## Current State (codebase scan)
- Top-level HTML pages load GTM container `GTM-W5WXGDM9`, set Consent Mode v2 defaults (denied) ahead of GTM, and embed duplicated cookie modal markup.
- `scripts/main.js` owns consent modal logic: cookie helpers, `gtag('consent','update')`, UTM storage, debug logs, and event dispatch (`consent_accepted`, `consent_rejected`).
- Helper tooling: `test-ga4-functionality.js` (automated verification), `advanced-ga4-debugger.js`, `start-testing.sh`, `local-testing-server.js`.
- Documentation around analytics (`LOCAL_TESTING_GUIDE.md`, `README_TESTING.md`, `GA4_Audit_Report.md`) describes expected consent flow and debugging steps.
- Latest commit `GA4 fix` heavily rewrote consent logic and removed legacy HTML inline scripts across pages.

## Proposed Changes (files & functions)
- `scripts/main.js`: verify `initCookieConsent` timing, ensure `gtag` availability, add protection for race conditions, revisit UTM event gating, remove or gate console logs, and consider pushing structured events to `dataLayer`.
- `index.html` + other pages: audit inclusion order and duplication of consent modal, consider centralizing to prevent drift, confirm consistent consent defaults.
- `ga4-test-tool.html` / docs: update scenarios if consent flow changes; capture new debugging instructions.
- GTM/GA4 configuration: inspect container for consent state mappings, triggered GA4 config tag, consent mode advanced settings (`default_consent_state`, `wait_for_update`), measurement ID linkage.

## Step-by-Step Plan
1. Reproduce issue locally: run server, load page fresh, capture cookie values, dataLayer events, and network requests before/after granting consent; compare to expected behaviour in docs.
2. Review `scripts/main.js` consent flow to spot regressions (e.g., missing initial `gtag` call, gating of GA4 events), cross-reference with previous commit to isolate changes tied to tracking drop.
3. Inspect HTML templates for consent modal markup consistency, check for missing `data-cookie-manage` hooks or broken button IDs introduced in latest commit.
4. Outline required code adjustments (if any) in `scripts/main.js` and HTML to ensure consent updates fire reliably and dataLayer receives measurement triggers.
5. Document GA4/GTM-side recommendations: verify GA4 config tag uses Consent Mode, ensure `Analytics Storage` mapping, enable cookieless pings, confirm measurement ID, check DebugView.
6. Prepare validation checklist covering automated script (`node test-ga4-functionality.js`), manual DebugView session, and cookie inspection to confirm restoration of tracking.

## Risks & Assumptions
- GA4/GTM configuration issues might be primary cause; we may need user access for confirmation.
- Consent drop could stem from analytics_storage denied by default without cookieless measurement; fixes may require policy decisions.
- Potential differences across HTML pages because modal markup duplicated; risk of partial updates.

## Validation & Done Criteria
- `node test-ga4-functionality.js` passes on local server.
- Manual session shows correct cookie values, consent updates, and GA4 events in DebugView after accepting consent.
- Network traces show appropriate `gtm.js` load order, cookieless ping pre-consent, and `g/collect` hits post-consent.

## Open Questions
- Which GA4 measurement ID and stream should we validate against (not visible in repo)?
- Does GTM container currently enable Consent Mode integration and `wait_for_update`?
- Are there analytics requirements for cookieless measurement (e.g., enabling Google Signals) or additional consent categories?
