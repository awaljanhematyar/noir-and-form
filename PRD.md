# NOIR & FORM — Product Requirements

> ACTIVE AUTHORIZATION (2026-10-22): The user's final autonomous execution override authorizes continuous Phases 1–6, Git initialization/commits/pushes, public GitHub repository `awaljanhematyar/noir-and-form`, Vercel deployment, real screenshots, a screenshot-based 16:9 device cover, and integration into `https://hematyar-professional-portfolio.vercel.app`. Proceed automatically after verification; no routine phase approvals. Authentication, security checks, platform confirmations, permissions, and unrelated data remain protected. This supersedes historical approval gates below. Keep all local writes within this project; inspect existing portfolio read-only and use its authenticated publishing workflow or a project-local checkout if authorized access permits.

Status: Phase 0 completed; documentation corrections approved; Phases 1–6 are authorized for continuous execution. Updated: 2026-10-22.

## Overview and audience

Project 03 is a responsive fashion e-commerce portfolio demo for a fictional luxury brand based in Toronto, Canada. It should demonstrate polished visual design, accessible front-end engineering, and complete shopping journeys to international freelance clients, recruiters, and design-conscious shoppers.

## Objectives and scope

- Present a distinctive editorial identity and a credible, coherent catalog.
- Demonstrate search, filtering, product selection, persistent wishlist/cart, and validated simulated checkout.
- Deliver maintainable React code and evidence of responsive, accessibility, and performance validation.
- Make the fictional brand and simulated transactions clear. Conversion metrics and production revenue are outside scope.

Success means all acceptance journeys pass and the site works without a backend. No accounts, real payments, fulfillment, analytics, newsletter service, or administrative CMS are included.

## Page inventory

| Page | Route | Required content |
| --- | --- | --- |
| Home | `/` | Editorial hero, collection links, new arrivals, brand introduction |
| Shop | `/shop` | Search, category and price filters, sort, result count, reset and empty state |
| Product | `/product/:slug` | Gallery, description, CAD price, sizes, colors, availability, quantity, wishlist, add to cart |
| Wishlist | `/wishlist` | Saved products, remove, product links, empty state |
| Cart | `/cart` | Variant lines, quantities, remove, subtotal, shipping estimate, checkout link |
| Checkout | `/checkout` | Guest delivery form, demo notice, order summary, simulated submission |
| Confirmation | `/order-confirmation` | In-memory order summary and explicit demo receipt; fallback when no order exists |
| About | `/about` | Fictional Toronto brand story and design philosophy |
| Contact | `/contact` | Validated demo form and honest local-only success feedback |
| Collections | `/collections` | Three editorial collection cards and detail links |
| Collection details | `/collections/:slug` | Editorial introduction, matching products, filtered shop link |
| Shipping & returns | `/shipping-returns` | Truthful demo shipping/tax and no-fulfillment explanation |
| Privacy | `/privacy` | Browser-local state, local-only forms, hosting limitations |
| Terms | `/terms` | Fictional catalog, image/reference and transaction limitations |
| Not found | `*` | Custom 404, home/shop recovery; includes unknown product slugs |

Collections have `/collections` and `/collections/:slug` routes. Add informational `/shipping-returns`, `/privacy`, and `/terms` pages with truthful demo-only copy. Wishlist remains required.

## Functional requirements and journeys

1. Discover a collection from Home, open Shop, combine search and filters, open a product, select available options, and add it to Cart.
2. Save a product, reload, revisit Wishlist, open its detail page to select a variant, and add it to Cart. Saving never requires an account.
3. Adjust cart quantities, remove a line, review totals, complete Checkout, and view a clearly simulated confirmation. Refreshing a confirmation shows a safe fallback.
4. Submit an invalid contact form, correct accessible inline errors, and receive local demo feedback without transmitting a message.

Navigation exposes Shop, About, Contact, Wishlist, and Cart. Mobile navigation supports keyboard access, Escape dismissal, and focus return. Cart count is total units; wishlist count is distinct products.

Shop search matches product name, category, and description case-insensitively after trimming. Category is single-select including All; minimum and maximum prices are inclusive CAD amounts. Filters combine with AND. Invalid price ranges show a useful error without crashing. Sort options: featured (default), newest, price ascending/descending, and name A–Z, with stable ID tie-breaking. Search, category, price bounds, and sort live in URL parameters so refresh and browser history preserve the view. Unknown parameters are ignored; invalid values fall back safely. No-results views offer reset filters. Provide Load more in increments of 12, resetting visible count when filters change. Add size and color filters that match a single available variant jointly; include these in URL state.

## Catalog and data requirements

Approved catalog: 30 fictional fashion products across Outerwear, Knitwear, Tailoring, and Essentials; category allocation need not be equal. Use CAD only, integer cents, unique IDs/slugs, descriptions, material/care notes, collection/category, product tags, release date, featured rank, and image alt text. Each product has multiple appropriate images or clearly labeled illustrative detail crops and explicit sellable size/color variants with stable IDs and variant-specific demo stock quantities. Include sold-out and limited-stock examples for testing. Accessories, if later added, must use an explicit One Size option.

Photography and fonts must have documented usage rights before use. Avoid claims of real sustainability certification, real customers, physical stores, or actual inventory. design.md is authoritative for the approved colors and typography; exact assets still need rights verification.

## Wishlist, cart, and checkout behavior

- Wishlist stores product IDs, deduplicates, and persists locally. Removed catalog products are discarded safely on hydration.
- Cart identity is product ID plus variant ID. Adding the same variant merges quantity; different variants remain distinct. Require size/color selection, an available variant, and integer quantity from 1 to the lesser of 10 and simulated stock.
- Quantity changes obey the same cap. Removal uses an explicit action. Recompute prices from catalog data rather than trusting storage; reconcile unavailable or changed variants and explain adjustments.
- Persist only validated cart lines and wishlist IDs under versioned project keys. Storage failure falls back to memory with a nonblocking notice. Never persist checkout/contact personal details or order summaries.
- Approved checkout: CAD and Canadian addresses only, using illustrative CAD 15 shipping below CAD 250 merchandise subtotal, free shipping from CAD 250, and a fictional flat 5% tax on merchandise plus shipping, rounded once to the nearest cent. Use integer cents and an integer 500-basis-point tax rate. Demo total = merchandise subtotal + illustrative shipping + illustrative tax. Display “Illustrative demo calculation — not a tax or shipping quote.” These parameters were selected under the user's autonomous execution authorization; they are not legally authoritative or jurisdictionally accurate rates. Never collect real payment-card information.
- Empty cart blocks checkout submission and offers Shop. Submission validates again, prevents duplicate clicks, creates an in-memory demo reference and summary, clears the cart, and navigates to Confirmation. No card fields, charge, reservation, email, or network order request.
- Contact success states “Demo only — your message has not been sent.” Checkout and confirmation state “Demo order — no payment or fulfillment.”

## Form validation

Checkout requires trimmed first/last names (1–80 characters each), email (valid email syntax, at most 254 characters), street (1–120), city (1–80), Canadian province/territory selection, and a Canadian postal code. Optional unit is at most 40 characters; omit phone to minimize data collection. Normalize postal spacing/case; do not claim address verification. Country is visibly fixed to Canada.

Contact requires name (1–80), email (same rule), subject (1–120), and message (10–2000). Validate on submit and correct errors as fields change after being touched. Retain input after errors; link an error summary to fields, associate inline messages, and focus the first invalid field. Client validation provides demo usability, not backend security.

## Accessibility and responsiveness

Target WCAG 2.2 AA practices with manual checks, without claiming certification. Semantic landmarks, one primary heading per page, skip link, labeled inputs, visible keyboard focus, accessible icon names, meaningful alt text, and status announcements are required. Do not rely on color or hover alone. Dialogs trap focus, support Escape, and restore focus. Route changes update title and focus the main heading. Respect reduced motion and zoom. Maintain contrast and usable controls as specified in design.md.

Validate 320, 375, 768, 1024, and 1440 CSS-pixel viewports; no unintended horizontal overflow. At 200% zoom content remains usable; check reflow at 400% on desktop. Product grids progress from one to four columns as space permits. Touch and keyboard users receive the same core functionality.

## SEO and performance expectations

Each route gets a meaningful title and description; indexable catalog routes get canonical URLs once a deployment origin is approved. Use honest social metadata and brand imagery. Exclude cart, wishlist, checkout, confirmation, and parameter-duplicate shop URLs from indexing. Provide robots and sitemap during Phase 5 using the approved origin; no fabricated ratings or merchant availability claims. A client-rendered SPA has crawler/social preview limitations; do not promise SSR-level discoverability.

Proposed measured targets: median of three production-build mobile Lighthouse runs at least 90 Performance, Accessibility, Best Practices, and SEO on Home, Shop, and representative Product pages. Lab goals: LCP <=2.5 s and CLS <=0.1; INP <=200 ms is a future field goal, not provable without real traffic. Record environment and exceptions. Use responsive compressed images, dimensions, lazy loading below the fold, eager hero loading, route splitting where useful, and limited font weights. Initial route JavaScript target <=200 KB gzip; investigate overruns.

## Acceptance criteria

- Every inventory route and unknown route renders correctly; internal links and direct deep links work after deployment.
- All four journeys above pass with pointer and keyboard, including invalid forms, no results, sold-out variants, empty cart, and confirmation fallback.
- Wishlist/cart survive refresh; corrupt data, stale variants, denied storage, and rapid repeated adds do not crash or violate quantity limits.
- Totals use integer arithmetic and the same illustrative shipping/tax rules on Cart, Checkout, and Confirmation; no personal data survives in storage.
- Responsive, contrast, focus, screen-reader smoke, production build, and performance checks have recorded evidence before release.
- Demo disclosures are visible before submission; no real purchase or contact delivery is implied.

## Demo limitations and approval decisions

Local data can be edited by visitors and differs across devices; stock is simulated, state is browser-local, and there is no authentication, server validation, secure receipt, or real transaction. Closing/reloading the app loses confirmation details. Clearing storage removes cart/wishlist.

The user approved 30 products, final colors/typography in design.md, and CAD/Canada-only simulated checkout. Phases 1–6 and named publishing/integration operations are authorized for continuous execution. Calculation parameters are resolved above, asset sources/rights are documented in docs/ASSETS.md, and the verified production origin is https://noir-and-form-umber.vercel.app. Quality evidence and any remaining validation limits belong in docs/QA.md and memory.md; no routine phase approval remains pending.

## Autonomous execution decisions

The user authorizes ordinary decisions. Use illustrative CAD 15 shipping below CAD 250 merchandise subtotal, free shipping from CAD 250, and a flat illustrative 5% tax on merchandise plus shipping, rounded once to the nearest cent. This is a fictional calculation, not an official Canadian rate or policy. No cards, charges, fulfillment, or personal-data persistence. Collection/policy pages, size/color filters, Load more, screenshot captures, device cover, and portfolio entry are now in scope. Historical statements that Phase 1 is unapproved or calculation parameters require another decision are superseded by this section and the active authorization banner.
