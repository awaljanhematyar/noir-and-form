# NOIR & FORM — Design System

> ACTIVE AUTHORIZATION (2026-10-22): The user's final autonomous execution override authorizes continuous Phases 1–6, Git initialization/commits/pushes, public GitHub repository `awaljanhematyar/noir-and-form`, Vercel deployment, real screenshots, a screenshot-based 16:9 device cover, and integration into `https://hematyar-professional-portfolio.vercel.app`. Proceed automatically after verification; no routine phase approvals. Authentication, security checks, platform confirmations, permissions, and unrelated data remain protected. This supersedes historical approval gates below. Keep all local writes within this project; inspect existing portfolio read-only and use its authenticated publishing workflow or a project-local checkout if authorized access permits.

Status: Approved design system implemented. Asset sources and licenses are recorded in docs/ASSETS.md; current verification is recorded in memory.md and docs/QA.md.

## Brand identity

A fictional Toronto fashion label built around quiet confidence, sculptural silhouettes, and considered materials. Use an editorial rhythm: a decisive photographic opening, generous space, restrained typography, and direct product information. Voice is brief, calm, and specific. Show “Fictional brand / portfolio demo” in the footer and explicit demo messaging in transaction flows. Avoid invented endorsements or factual environmental claims.

## Color tokens

| Token | Value | Use |
| --- | --- | --- |
| off-white | `#FAFAF8` | Main background, text on black |
| black | `#171717` | Primary text, dark surfaces, actions |
| gray | `#888888` | Decorative accent; not small text on off-white |
| sand | `#E7DED2` | Subtle surfaces and separators |
| olive | `#727B65` | Accent and selected states with explicit labels |

These approved colors replace the earlier palette. Use black or accessible dark neutral tints for readable helper/error text, with words and icons to distinguish feedback. Derived neutral surface/border tones support contrast without adding a separate brand accent. Gray and sand must not be sole control boundaries where contrast fails; do not assume olive supports small text. Verify at least 4.5:1 for normal text and 3:1 for large text and meaningful UI boundaries. Over-image text needs tested backing across responsive crops.
## Typography

Approved pairing: locally hosted Playfair Display for editorial headings and locally hosted DM Sans for body/UI, with exact font-file usage rights documented before use. Fallbacks: Georgia/serif and system-ui/sans-serif. Keep font weights limited and use swap behavior; record source and license with assets.

Implemented body base is 15px, with generous paragraph leading and smaller editorial captions; text-entry form controls are at least 16px. Heading sizes use responsive clamps: H1 roughly 44–90px, H2 32–56px, H3 24–32px. Avoid thin weights at small sizes. Product names and prices prioritize legibility and support zoom/reflow. Small uppercase labels may use modest tracking; do not uppercase long paragraphs. Reading width is approximately 65 characters. One H1 per page; heading hierarchy follows content rather than visual size.

## Spacing and layout

Use a 4px base with 4, 8, 12, 16, 24, 32, 48, 64, and 96px steps. Page gutters: 16px small, 24px medium, 48px large. Content maximum width: 1440px, centered. Sections use 48–96px vertical space. Editorial pages can break the grid deliberately while maintaining alignment. Use subtle 1px rules, minimal shadows, and mostly square edges; avoid excessive gradients and decorative clutter.

Mobile-first breakpoints: base below 640px; sm 640px; md 768px; lg 1024px; xl 1280px; 2xl 1536px. These are planned layout tokens, not device assumptions. Product grid: one column below 375px, two from 375px where content fits, three from 768px, four from 1280px. Verify long names and prices before retaining two columns on small screens.

## Header and navigation

Use an off-white header with wordmark, Shop/About/Contact links, named wishlist/cart icon buttons, and counts. Sticky positioning must not hide focus or anchors. On small screens show a menu trigger, wordmark, and shopping controls; full menu opens as a labeled dialog with close control. Include current-page indication, skip link, adequate touch space, Escape, trapped focus, and focus restoration. No hover-only navigation or invented promotional countdowns.

## Homepage and imagery

Hero combines a strong fashion photograph, large editorial headline, short supporting text, and a clear Shop action. Follow with category stories and a small new-arrivals grid, then brand story and footer. Avoid carousels by default. Use consistent warm-neutral art direction, uncluttered backgrounds, inclusive adult models, and honest crop/alt descriptions. Assets need confirmed usage rights and a local attribution inventory before release. Do not use unrelated photographs as if they accurately document specific garment details.

## Product cards and shop

Use a stable 3:4 image ratio, reserved dimensions, product name, category, CAD price, and an independent wishlist toggle. Optional second-image hover must have a usable primary image on touch and reduced-motion devices. The whole card cannot contain nested interactive controls. Saved state includes a label/pressed state, not color alone. Keep product purchase on the detail page so required variant selection remains clear.

Shop has title/count, search field, category control, inclusive min/max inputs, sort selection, active-filter summary, and reset. Desktop can show a sidebar; mobile uses an accessible filter dialog with Apply/Reset and retained values. Prefer labeled numeric inputs over a custom price slider. Empty results show a specific message and reset action.

## Product details

Use gallery and purchase panel side by side at lg, stacked below. Gallery has main image, labeled thumbnail buttons, stable image space, and descriptive alternatives; zoom is optional and must not block core browsing. Product information includes title, price, description, color names/swatches, size controls, available quantity, and material/care details. Size/color groups use labeled native radios or equivalent accessible controls. Sold-out variants are explicitly marked; selection changes explain availability. Do not preselect size. Quantity uses a labeled number input and accessible increment/decrement buttons. Add to cart validates selections and announces success without stealing focus.

## Cart and checkout

Cart shows image, name, chosen size/color, unit price, quantity, line total, and Remove. Summary repeats subtotal, illustrative shipping, illustrative tax and estimate disclosure, and illustrative total per PRD.md. Stack summary below lines on mobile. Empty cart leads to Shop.

Checkout uses a focused guest form and readable summary. Keep the demo notice visible before the action, label the action “Place demo order,” and never request card details. Use appropriate autocomplete attributes for names/address/email, visible labels, optional markers, and linked errors. Disable duplicate submission while processing and announce status. Confirmation says no charge, fulfillment, or email occurred and offers return to Shop. Missing confirmation data has a helpful fallback.

## Buttons, forms, and feedback

Primary button: black fill/off-white text; secondary: transparent with black border; text link: underline or equally clear treatment. Define default, hover, focus-visible, active, disabled, and loading states. Minimum target plan is 44 by 44 CSS px for interactive controls. Focus indicator uses a visible 2px black outline with a 2px off-white offset; verify visibility on both light and dark surfaces.

Fields have persistent labels, clear boundaries, helper text, and error text linked with descriptions. Use error summary and first-invalid focus on submit. Success/error messages remain long enough to read; critical feedback is inline rather than a fleeting toast. Noncritical cart/wishlist updates use polite live announcements. Provide deliberate empty, sold-out, image-failure, storage-failure, and 404 states.

## Accessibility and motion

Use semantic elements before custom ARIA; icon-only actions always have accessible names. Ensure keyboard order matches visual order, visible focus is not obscured, and dialogs return focus. Do not communicate state by color alone. Support 200% zoom, desktop 400% reflow, and widths down to 320px without horizontal scrolling for core content.

Transitions are subtle, typically 150–250ms for opacity/color or small movement. No autoplay motion, parallax dependency, or scroll hijacking. Under reduced motion remove movement and smooth scrolling; retain immediate state feedback. Validate contrast, keyboard access, screen-reader labels, and responsive imagery during implementation rather than assuming the palette guarantees compliance.
