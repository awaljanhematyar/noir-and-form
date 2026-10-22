# Code guide

NOIR & FORM follows the Ember & Oak Kitchen convention: a concise responsibility description starts meaningful source files; searchable uppercase headings mark groups of logic. Comments explain intent and important boundaries, not every line.

## Source map

| Location | Responsibility |
| --- | --- |
| `src/main.jsx` | React root, browser router, shared provider |
| `src/app/App.jsx` | Navigation, footer, routes, route errors, metadata and focus |
| `src/app/Store.jsx` | Validated browser persistence, cart/wishlist actions, ephemeral order |
| `src/data/catalog.js` | 30 fictional products, categories, collections, variants and images |
| `src/utils/shop.js` | Integer money, illustrative totals, storage reconciliation, filtering, form validation |
| `src/components/UI.jsx` | Product cards, images/fallback, quantities, editorial links and empty states |
| `src/components/DemoForm.jsx` | Local-only validated form with linked errors and first-invalid focus |
| `src/pages/` | Editorial, catalog, product, commerce, collection and policy pages |
| `src/styles/index.css` | Tailwind v4 theme, fonts, responsive layouts, controls, reduced motion |
| `src/**/*.test.*` | Business-rule and user-input integration regressions |
| `e2e/shopping.spec.js` | Real Chrome shopping/accessibility/layout/screenshot checks |

## Business rules worth keeping centralized

- Cart line identity is product ID plus variant ID. Reconcile stored data against the catalog; prices always come from current product data.
- Quantity is a positive integer no greater than the lesser of 10 and variant demo stock. Sold-out variants cannot enter the cart.
- Shipping/tax are fictional fixtures: CAD 15 below CAD 250 merchandise subtotal, free at/above CAD 250, and flat illustrative 5% tax on merchandise plus shipping, rounded once to the nearest cent.
- Wishlist and cart are the only durable shopper state. Checkout/contact fields and confirmation summaries never enter LocalStorage.
- Size/color filters must match one available variant jointly. Search/category/collection/price/size/color/sort are combined, with URL persistence and Load more in increments of 12.
- Every form is local-only. No payment-card field, payment SDK, order API, message transmission, or fulfillment exists.

## State and recovery

The small catalog uses a shared React context with functional state updates, rather than an external state library. `usePersistedItems` owns safe hydration, schema checks, storage errors, and cross-tab storage events. Derived totals/results are not stored. Confirmation exists only in provider memory and safely falls back after refresh.

Lazy page modules reduce initial JavaScript; Home stays eager. Dialogs use native `showModal()` behavior with explicit accessible names, Escape dismissal, and focus restoration. Query changes do not move focus away from the search input. Route changes focus main content.

## Extending safely

Add complete data records instead of special-case components. Keep public-facing copy honest about fictional products and stock photography. Use legitimate asset rights and update the inventory. A real store would require separate backend, transaction, privacy, security, fulfillment, and legal work; adding a real payment flow is outside this project.
