# Release validation

Recorded 22 October 2026. This is a fictional commerce demonstration, not a production payment system.

## Verified checks

- Production build and ESLint pass; 14 unit/integration tests pass.
- Full local Chrome suite: 17 passed, zero failed. Covers discovery, persistence, variant stock, validated checkout, confirmation refresh, corrupt/denied storage, direct routes, six axe page audits, five responsive widths (320–1440 px), keyboard dialogs and reduced motion.
- Live filters, all direct routes and actual screenshot capture passed on the optimized Vercel release. A live cart assertion exceeded its five-second window; the failure snapshot already showed the correct cart. The isolated shopping/checkout rerun passed. The final combined live run passed all four cases (shopping, filters, direct routes, screenshot capture); results are recorded in qa/browser-live-results.json.
- Microsoft Edge: three critical live journeys passed (complete shopping/checkout, filters, and mobile keyboard dialogs); see qa/browser-edge-results.json.
- Dependency audit: zero known vulnerabilities in the recorded lockfile audit (docs/qa-audit.json).
- Initial JavaScript: 99.93 KB gzip; responsive WebP images and locally hosted Latin fonts. Critical shopping routes load with the shell; informational routes remain lazy.
- Original desktop/mobile screenshots and their production origin are recorded in portfolio/screenshots/capture-manifest.json. The device cover uses these pixels without invented UI.

## Performance evidence and limits

Before the final shopping-route bundling change, three isolated mobile Lighthouse samples per local production route are preserved in qa/performance-local-optimized.json. Median performance scores: Home 85, Shop 87, Product 84. All nine runs scored 100 for accessibility, best practices and SEO. Median LCP: 2.825 s, 3.404 s and 3.445 s respectively. CLS remained below 0.01 after fixing the lazy-route loading height.

The attempted live measurement produced one NO_FCP failure and one valid Home sample: performance 83, accessibility/best-practices/SEO 100, LCP 2.761 s, CLS 0.00293. The incomplete live series is preserved as qa/performance-live-partial.json and is not a three-run median. The aspirational performance score of 90 and 2.5 s LCP were not achieved in these lab measurements. Scores vary with machine and network; no field Core Web Vitals claim is made.

Automated axe results do not establish accessibility certification. Human screen-reader review, Safari and Firefox testing were unavailable. Chrome and Edge use the same engine family; Edge checks do not replace those environments. Client-rendered route metadata and a static SPA 404 have crawler and HTTP-status limitations. No real checkout, payment, message delivery, fulfillment or account service is implemented.

## Reproduce

Run npm ci, npm run lint, npm test, npm run build, then npm run test:browser. The runner manages a preview server automatically. The configured browser executable is Chrome on Windows; override CHROME_PATH for an installed alternative and BASE_URL for the live site. Mobile Lighthouse uses node scripts/measure-performance.mjs. Reports include actual timestamps and origins; do not treat a failed or incomplete run as a pass.


## Release verification

The final public bundle is /assets/index-Awx8h1Mr.js (314622 bytes) and contains cart and shop code without dynamic Commerce/Shop chunk references. The final four live tests pass. Vercel deployment creation returned dpl_7fvvJdGt2AUCXPfE4fbMRdrUfcoX; the subsequent authenticated status refresh returned HTTP 403. Public delivery and behavioral checks verify release success; API status metadata could not be refreshed. The existing portfolio entry was published through its authenticated CMS and verified on desktop/mobile, with all four prior projects preserved. See portfolio/integration-verification.json and portfolio screenshots.
