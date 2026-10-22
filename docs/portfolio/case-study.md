# NOIR & FORM

A considered fashion storefront for a fictional Toronto label.

[Live experience](https://noir-and-form-umber.vercel.app) · [Source](https://github.com/awaljanhematyar/noir-and-form)

## Brief and design

Create a premium shopping experience that demonstrates both visual craft and dependable front-end behavior. An off-white editorial canvas, Playfair Display headings, DM Sans body typography, generous spacing and restrained olive accents frame the locally hosted photography. The layout adapts from a 320 px phone to a wide desktop without horizontal overflow.

## Experience and architecture

Thirty fictional products support combined URL-based search and filters, sorting, collection discovery and progressive catalog loading. Explicit variant selection respects size/color stock. Wishlist and cart survive refresh through validated, versioned LocalStorage; blocked or corrupt storage degrades gracefully. Checkout validates input, calculates illustrative CAD totals with integer cents and creates a memory-only confirmation. No payment or personal data is transmitted.

React 19, Vite, JavaScript, Tailwind CSS v4, React Router and Lucide React form a small client-side architecture. Shared commerce utilities centralize validation and calculations. Lazy routes, responsive WebP photography and local fonts reduce transfer costs. Source comments explain responsibilities, constraints and non-obvious behavior.

## Evidence

Fourteen unit/integration tests and seventeen local Chrome browser tests pass. Browser coverage includes shopping, persistence, routes, six-page axe checks, responsive widths and keyboard dialogs. See [QA](../QA.md) for exact results, performance measurements and limitations. The cover is a deterministic composition of actual production desktop and mobile screenshots, preserved alongside a capture manifest.

## Boundaries

The catalog, stock, tax and shipping are illustrative. Photography is licensed editorial reference imagery, with disclosed reuse and gallery crops. This portfolio demonstration has no payment, fulfillment, backend orders or contact delivery. Performance goals remain partially unmet; automated accessibility checks are not certification.
