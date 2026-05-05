# Clinical OS — Release Checklist

Use this before every app store submission and public web deployment.

---

## 1. Code Quality

- [ ] `bun run format` passes (Biome — zero errors)
- [ ] `node --experimental-sqlite scripts/qa-smoke-routes.mjs` — all checks green
- [ ] `node --experimental-sqlite scripts/qa-dims-companies.mjs` — all checks green
- [ ] `node --experimental-sqlite scripts/qa-dims-search-benchmark.mjs` — all checks green
- [ ] `bun run build:db` completes (price normalization runs automatically)
- [ ] `bun run build:web` produces `dist/` without errors
- [ ] No TypeScript errors (`bunx tsc --noEmit`)

---

## 2. Clinical Content

- [ ] All new protocols reviewed by at least one licensed medical professional
- [ ] Drug dosages cross-checked against BNFBD or WHO Essential Medicines List
- [ ] ER drug `warningNote` values reviewed by emergency medicine clinician
- [ ] All new content has a documented source (public domain / government / licensed)
- [ ] `docs/content-import.md` contract satisfied for any new CSV imports
- [ ] No proprietary, scraped, or subscription database content included

---

## 3. Privacy & Data

- [ ] No PII collected or transmitted (verify in network logs)
- [ ] `EXPO_PUBLIC_SURVEILLANCE_ENDPOINT` is **not** hardcoded — only via env var
- [ ] Surveillance sync sends aggregate counts only (spot-check payload in dev)
- [ ] Device hash is non-reversible (Math.random hex, not device UUID or IMEI)
- [ ] Privacy policy screen (`/legal/privacy`) is accessible from Profile tab
- [ ] Privacy policy version date updated if policy text changed

---

## 4. App Store — Android (Google Play)

- [ ] `app.json` version incremented (`version`, `android.versionCode`)
- [ ] App icon: 512×512 PNG, no rounded corners (Play applies mask)
- [ ] Feature graphic: 1024×500 PNG
- [ ] Screenshots: phone (min 2), 7-inch tablet (optional)
- [ ] Short description (≤80 chars) reviewed
- [ ] Full description reviewed — no medical-claim language (e.g. "cures", "diagnoses")
- [ ] Content rating questionnaire: Medical — no user-generated content, no ads
- [ ] Data safety form: no personal data collected, no data shared
- [ ] Target API level ≥ current Play requirement (2024: API 34)
- [ ] `eas build --platform android --profile production` completes

---

## 5. App Store — iOS (App Store Connect)

- [ ] `app.json` version + `ios.buildNumber` incremented
- [ ] App icon: 1024×1024 PNG, no transparency, no rounded corners
- [ ] Screenshots: 6.7-inch (required), 12.9-inch iPad (optional)
- [ ] Category: Medical
- [ ] Age rating: 4+ (no objectionable content)
- [ ] Privacy nutrition labels updated — confirm "No data collected"
- [ ] Export compliance: no encryption beyond standard HTTPS (mark as N/A)
- [ ] `eas build --platform ios --profile production` completes
- [ ] TestFlight internal testing passed before external review

---

## 6. Web Deployment (Vercel)

- [ ] `vercel.json` `buildCommand` includes `node --experimental-sqlite scripts/build-web-db.mjs`
- [ ] `package.json` `engines.node` is `>=22`
- [ ] `EXPO_PUBLIC_SURVEILLANCE_ENDPOINT` env var set in Vercel dashboard (or left unset)
- [ ] `dist/database.sqlite` is served (check network tab in browser)
- [ ] All 4 tabs load without JS errors in browser console
- [ ] Drug search returns results (tests DIMS FTS index is built)
- [ ] Privacy policy page loads at `/legal/privacy`
- [ ] SPA rewrites work (all `/:path*` → `/`)

---

## 7. Medical Governance

- [ ] Medical reviewer sign-off documented (name, credentials, date, scope)
- [ ] Disclaimer shown on first launch (onboarding screen)
- [ ] In-app disclaimer visible in About section (Profile tab)
- [ ] No screen claims diagnostic, prescriptive, or therapeutic authority
- [ ] ER drug doses have a "For reference only — verify before use" warning visible
- [ ] App description on all stores includes: "For qualified medical professionals only"

---

## 8. Credential Rotation (deploy-time)

- [ ] `EXPO_PUBLIC_SURVEILLANCE_ENDPOINT` pointed to current server
- [ ] Server-side `DATABASE_URL` rotated if surveillance DB credentials changed
- [ ] Old API keys / tokens revoked after rotation
- [ ] Vercel project environment variables reviewed — no stale secrets

---

## 9. Post-Release

- [ ] Smoke test the live Vercel URL (all 4 tabs, drug search, condition detail)
- [ ] Monitor Vercel function logs for any 5xx errors in first 24h
- [ ] Tag release in git: `git tag v1.x.x && git push origin v1.x.x`
- [ ] Update `CHANGELOG.md` with version summary
- [ ] Notify medical reviewers of deployment
