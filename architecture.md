# NOIR & FORM — Architecture

> ACTIVE AUTHORIZATION (2026-10-22): The user's final autonomous execution override authorizes continuous Phases 1–6, Git initialization/commits/pushes, public GitHub repository `awaljanhematyar/noir-and-form`, Vercel deployment, real screenshots, a screenshot-based 16:9 device cover, and integration into `https://hematyar-professional-portfolio.vercel.app`. Proceed automatically after verification; no routine phase approvals. Authentication, security checks, platform confirmations, permissions, and unrelated data remain protected. This supersedes historical approval gates below. Keep all local writes within this project; inspect existing portfolio read-only and use its authenticated publishing workflow or a project-local checkout if authorized access permits.

Status: Proposed implementation plan; no application code created in Phase 0.

## Technology and boundaries

Use the requested React 19, Vite, JavaScript ES6+, Tailwind CSS v4, React Router, Lucide React, and LocalStorage. Build a client-rendered static SPA without a backend or payment SDK. Select compatible package versions and record them in the lockfile during approved Phase 1; exact tooling versions are not asserted here. Context plus functional state updates is sufficient for the proposed small catalog; no external state library is planned.

## Proposed folder structure

```text
noir-and-form/
  PRD.md
  architecture.md
  design.md
  rules.md
  phases.doc.md
  memory.md
  CODEX_MASTER_PROMPT.md  # phase-limited instructions
  README.md              # status and documentation index
  public/                 # favicon, social image, later robots/sitemap
  src/
    app/                  # router, providers, app shell, route boundary
    assets/               # local photography/fonts and attribution inventory
    components/
      layout/             # Header, Footer, Navigation, PageContainer
      ui/                 # Button, Field, Dialog, StatusMessage, EmptyState
      product/            # ProductCard, ProductGrid, Gallery, VariantSelector
    pages/                # Home, Shop, Product, Wishlist, Cart, Checkout,
                          # Confirmation, About, Contact, NotFound
    features/
      cart/               # reducer, provider, selectors, quantity rules
      wishlist/           # reducer and provider
      checkout/           # form and ephemeral confirmation state
      catalog/            # search/filter/sort functions
    data/                 # products and category constants
    hooks/                # reusable behavior with real callers
    utils/                # money, storage, validation, metadata helpers
    styles/               # Tailwind entry, design tokens, global styles
    test/                 # shared test setup and fixtures
  e2e/                    # critical browser journeys
```

Create only necessary files in approved implementation phases; this tree does not authorize scaffolding now. Configuration, package manifest, index HTML, deployment configuration, and lockfile arrive in their relevant phases.

## Component and routing architecture

AppProviders wraps Router and AppShell; the shell owns skip link, header, main route outlet, footer, and global status region. Pages compose domain components and own page-specific state. UI primitives support explicit labels and focus behavior. ProductCard links to details; its wishlist button is a sibling control rather than a nested button inside a link. Shared money and totals utilities prevent inconsistent prices.

Use routes from PRD.md exactly. `/product/:slug` looks up a stable slug and renders NotFound for unknown products. `/shop` owns normalized URL parameters `q`, `category`, `min`, `max`, and `sort`; min/max are human CAD decimals parsed to cents. Invalid ranges render an error; other invalid values use safe defaults. Browser Back restores query state. Each navigation updates metadata and moves focus to main content; preserve anchor and history expectations. Confirmation reads only ephemeral state and displays a fallback on direct entry/reload. Route-level error handling offers reload and Shop recovery without leaking internals.

## Product data model

Approved catalog: 30 fictional fashion products, unique IDs/slugs, categories/collections, images, sizes/colors, variant-specific demo stock, CAD prices, and tags.

| Entity | Fields and invariants |
| --- | --- |
| Product | `id`, unique `slug`, `name`, `categoryId`, `collection`, `description`, `material`, `care`, `priceCents` (nonnegative integer), `currency: CAD`, ISO `releasedAt`, numeric `featuredRank`, `images`, `colors`, `variants`, `tags` (nonempty strings) |
| Image | Stable `id`, local `src`, responsive candidates, positive width/height, meaningful `alt`; optional `colorId` |
| Color | Stable `id`, readable `name`, visual `hex`; label always visible to assistive technology |
| Variant | Unique `id`, `colorId`, `size`, nonnegative integer `stock`; product supplies price for all variants |
| Cart line | `productId`, `variantId`, integer `quantity`; identity is both IDs |
| Wishlist | Unique product IDs |
| Demo order | Reference, creation time, immutable line/price snapshot, subtotal/shipping/tax/total in cents; only in memory |

Catalog validation checks uniqueness, referenced colors/images, category membership, valid cents, and usable variant stock. Availability derives from variants. Simulated stock is never decremented globally or claimed to be a real reservation. All display money uses `Intl.NumberFormat` for en-CA/CAD.

## State management

- Static catalog is imported data. Derived search results, cart totals, and availability are computed rather than persisted.
- Cart and wishlist use a shared context with separate state/actions, exposed through `useCart` and `useWishlist`.
- Shop query state lives in the URL. Gallery selection, product options, quantity input, mobile menu, and field errors stay local to their components.
- Checkout provider holds an ephemeral order summary for Confirmation. Do not include form fields in durable state. Copy the cart snapshot before clearing it; guard duplicate submits.
- Quantity caps, reconciliation, and illustrative shipping/tax are shared pure functions matching PRD.md. A changed variant resets incompatible selection and announces relevant feedback.

## LocalStorage persistence

Use `noir-form:cart:v1` and `noir-form:wishlist:v1`, each containing `{ version: 1, items: [...] }`. Lazily read once before initial persistence to avoid overwriting saved state on mount. Catch access, JSON, and quota errors. Validate shape and IDs, discard unknown records, merge duplicate cart identities, clamp quantities to current caps, and drop unavailable lines with a summary notice. Never trust stored prices or HTML. Unknown schema versions reset only the affected project key with feedback; migrate only when a deliberate migration exists.

Persist committed state changes and never checkout/contact fields or orders. Failed writes retain usable in-memory state and display a nonblocking persistence notice. Browser storage events rehydrate valid updates for other tabs without write-back loops; last valid write wins, with no claim of transactional synchronization. Clearing state affects only project keys, never `localStorage.clear()`.

## Reusable hooks and utilities

Plan `useCart`, `useWishlist`, `useDocumentMetadata`, and focused dialog/navigation behavior. Introduce other hooks only for repeated behavior. Pure utilities cover currency formatting, decimal-to-cents parsing, subtotal/shipping/tax calculations and nearest-cent rounding, catalog filtering/sorting, schema validation/reconciliation, and form validation. Keep product business rules out of presentation markup.

## Error handling and security boundaries

Provide empty, no-results, unavailable product, missing route, image failure, malformed URL, invalid form, and storage failure states. Image fallback preserves dimensions and text description. React-rendered user strings remain text; no raw HTML insertion. No secrets belong in source or client environment variables. Log useful development diagnostics without personal form values. An error boundary handles render failures; event handlers and storage operations require their own handling.

## Testing strategy

Proposed development-only tools: Vitest, React Testing Library with user-event, Playwright, and axe integration. Add only tools used by required checks and confirm compatibility in the implementation phase.

- Unit checks: money, illustrative shipping threshold and tax basis/rounding, combined filters and sorting, quantity cap/merge/reconciliation, corrupt storage and schema handling, form validation.
- Integration checks: product option requirements, wishlist toggling, cart edits, storage-denied fallback, accessible form errors, and empty checkout.
- Browser checks: discovery-to-confirmation, persisted wishlist/cart after refresh, direct/deep links, invalid slug, mobile menu/filter keyboard interactions, duplicate submit prevention, and confirmation fallback.
- Manual checks: representative screen reader, full keyboard flow, reduced motion, contrast, zoom/reflow, actual responsive layout, and current Chrome/Edge/Firefox plus Safari when available. Record unavailable environments honestly.
- Run lint/build and relevant regression tests at each phase; Phase 4 consolidates release evidence. Automated accessibility scores supplement manual review.

## Deployment architecture

Phase 6 proposes a GitHub repository and Vercel static Vite build (`dist` output), with SPA deep-link fallback and cache policy for hashed assets. Preserve static assets, robots, and sitemap before fallback. Verify fresh direct loads for Product/Shop and an unknown URL; SPA fallback may return HTTP 200 for the custom 404, which is a documented hosting/SEO limitation. No server functions or runtime secrets are required. Preview first, then publish only after explicit authorization of repository visibility, account, origin/domain, and production deployment. Git initialization, commits, pushes, and portfolio updates also require explicit authorization under rules.md.

## Phase ownership and visual authority

Follow phases.doc.md: Phase 1 owns structure, scripts/basic testing, tokens/fonts, navigation/footer, route skeletons and custom 404; Phase 2 owns pages/catalog presentation; Phase 3 owns discovery and shopping interactions. These are implemented under continuous authorization. design.md owns the visual system; PRD.md owns the now-resolved illustrative calculations. Current evidence belongs in memory.md and docs/QA.md.

## Implemented structure

Actual source map and extension guidance: docs/CODE_GUIDE.md. Related commerce pages share src/pages/Commerce.jsx; editorial/policy pages share src/pages/Content.jsx. src/components/UI.jsx and DemoForm.jsx provide reused primitives. Small-context functional state updates replace the originally proposed reducers without an external state dependency. All requested route/page boundaries remain intact.

Performance additions: scripts/prepare-assets.mjs copies licensed Latin fonts/notices to public/fonts before builds; scripts/critical-images-plugin.mjs adds early route-aware image hints; Photo prefers responsive WebP with JPEG/image-failure recovery. Full-viewport main/loading minimums keep the footer out of view while lazy route chunks resolve. Fonts/images/robots/sitemap remain static files outside SPA rewrites. Use the verified returned production alias for origin-dependent SEO.
