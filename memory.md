# NOIR & FORM — release record

Project 03: fictional Toronto fashion e-commerce portfolio demo. Resumed the existing D:\noir-and-form workspace without recreating work. The user's final override authorizes continuous Phases 1–6 and the named GitHub/Vercel/portfolio publishing actions.

## Implemented

React 19, Vite, JavaScript, Tailwind CSS v4, React Router, Lucide React. Thirty variant-stock products; all requested route families; combined URL filters, sorting and Load more; collections, galleries, persistent wishlist/cart; validated local-only forms and memory-only confirmation. Approved editorial visual system, licensed local responsive WebP photography and OFL fonts. Documentation and source comments explain responsibilities and non-obvious rules.

## Verification

Build, lint and 14 unit/integration tests pass. Browser suite covers shopping, persistence, corrupt/denied storage, direct routes, six axe pages, five responsive widths, keyboard dialogs and reduced motion. Three critical live Edge journeys passed. See docs/QA.md and timestamped JSON for final results, failed attempts and measurement limits.

Critical shopping routes now load with the main bundle, removing a slow additional network dependency seen on cold live navigations. Informational routes remain lazy. Main JavaScript is 99.93 KB gzip. Responsive images, local fonts, metadata, 41-URL sitemap, robots and security headers are implemented. Earlier Lighthouse measurements are preserved as earlier-source evidence; aspirational performance targets were not demonstrated. The layout-shift regression was fixed.

## Publishing and portfolio

Initial implementation commit pushed to the public GitHub repository. Git HTTP/2 stalled; HTTP/1.1 succeeded without logging credentials. Vercel production release and public cover verified. Actual production desktop/mobile screenshots and a 3200×1800 device cover are preserved. Portfolio CMS saved the new published/featured entry; count increased from four to five, preserving FlowPilot AI, Ember & Oak Kitchen, Professional Developer Portfolio and 2 Love Tea and Coffee House Website. Public entry, decoded cover, GitHub/live links and desktop/mobile overflow checks passed. Evidence is in docs/portfolio.

- Live: https://noir-and-form-umber.vercel.app
- Source: https://github.com/awaljanhematyar/noir-and-form
- Portfolio: https://hematyar-professional-portfolio.vercel.app/projects/noir-and-form
- Cover: docs/portfolio/noir-and-form-cover.png
- Case study: docs/portfolio/case-study.md

## Constraints and limits

No real payments, card fields, orders, fulfillment, accounts or contact delivery. CAD checkout uses illustrative $15 shipping below $250 and fictional flat 5% tax, never official rates. Only wishlist/cart persist; personal form details and orders do not. Photos are editorial references with disclosed reuse/crops. Human screen-reader, Firefox and Safari review were unavailable. Automated accessibility is not certification. Client metadata and SPA 404 status have crawler limitations. QA records measured performance honestly.

## Final handoff checklist

Final source is publicly verified on Vercel; all 17 local and four final live Chrome cases pass, alongside the three Edge cases. Portfolio integration is verified. Final evidence/documentation is committed with the release handoff. The Vercel API status refresh returned HTTP 403 after deployment creation; public bundle inspection confirms the new critical-route bundle is served, so API status access remains an administrative limitation. Continue from this repository; do not recreate it or the published portfolio record. Keep secrets, authentication files, dependency caches and build output out of Git.
