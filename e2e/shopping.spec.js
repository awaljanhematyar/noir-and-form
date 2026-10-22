/** Critical browser journeys validate persistence, demo transactions, routes, and responsive accessibility. */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

test('discovery, wishlist, variant cart, validated checkout and memory-only confirmation', async ({
  page,
}) => {
  await page.goto('/shop');
  await expect(page.locator('.product-card')).toHaveCount(12);
  await page.getByRole('button', { name: 'Discover more pieces' }).click();
  await expect(page.locator('.product-card')).toHaveCount(24);
  await page.getByRole('button', { name: 'Save The Sculpted Coat to wishlist' }).click();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Remove The Sculpted Coat from wishlist' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('link', { name: 'View The Sculpted Coat', exact: true }).click();
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Choose a size');
  await page.getByRole('radio', { name: 'M', exact: true }).check();
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page.getByRole('link', { name: 'Shopping bag, 1 items' }).click();
  await expect(page.locator('.cart-line')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.cart-line')).toHaveCount(1);
  await page.getByRole('link', { name: /Continue to demo checkout/ }).click();
  await page.getByRole('button', { name: 'Place demo order' }).click();
  await expect(page.locator('.error-summary')).toBeVisible();
  const checkoutAccessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(checkoutAccessibility.violations).toEqual([]);
  const fields = {
    'First name': 'Demo',
    'Last name': 'Guest',
    'Email address': 'demo@example.com',
    'Street address': '123 Example Street',
    City: 'Toronto',
    'Postal code': 'M5V 2T6',
  };
  for (const [name, value] of Object.entries(fields))
    await page.getByLabel(name, { exact: true }).fill(value);
  await page.getByLabel('Province / territory').selectOption('Ontario');
  await page.getByRole('button', { name: 'Place demo order' }).click();
  await expect(page).toHaveURL(/order-confirmation/);
  await expect(page.locator('h1')).toHaveText('A considered choice.');
  await expect(page.locator('.confirmation-heading')).toContainText(
    'No payment, email, or fulfillment',
  );
  const stored = await page.evaluate(() => JSON.stringify(localStorage));
  expect(stored).not.toContain('demo@example.com');
  expect(stored).not.toContain('123 Example');
  expect(stored).not.toContain('NF-DEMO');
  await page.reload();
  await expect(page.locator('h1')).toHaveText('A fresh beginning.');
});

test('filters combine, empty results reset, and unavailable variants remain unavailable', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Search products', exact: true }).click();
  await expect(page.getByRole('searchbox', { name: 'Search products', exact: true })).toBeFocused();
  await page
    .getByRole('searchbox', { name: 'Search products', exact: true })
    .fill('impossible-piece');
  await expect(page.locator('.empty-state')).toContainText('No pieces match');
  await page.getByRole('link', { name: 'Reset the edit' }).click();
  await expect(page.locator('.product-card')).toHaveCount(12);
  await page.locator('#desktop-category').selectOption('Knitwear');
  await expect(page).toHaveURL(/category=Knitwear/);
  await expect(page.locator('.product-card')).toHaveCount(8);
  await page.goto('/product/the-slouch-knit');
  await expect(page.getByRole('button', { name: 'Sold out', exact: true })).toBeDisabled();
});

test('corrupt and denied storage do not break the catalog', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('noir-form:cart:v1', '{bad'));
  await page.reload();
  await expect(page.locator('.storage-warning')).toBeVisible();
  await page.goto('/cart');
  await expect(page.locator('.empty-state')).toContainText('Your bag is empty');
  await page.addInitScript(() =>
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Denied');
      },
    }),
  );
  await page.reload();
  await expect(page.locator('h1')).toHaveText('In your bag.');
  await expect(page.locator('.storage-warning')).toContainText('unavailable');
});

test('all routes load directly and unknown paths recover', async ({ page }) => {
  for (const route of [
    '/',
    '/shop',
    '/collections',
    '/collections/the-city-edit',
    '/product/the-sculpted-coat',
    '/wishlist',
    '/cart',
    '/checkout',
    '/order-confirmation',
    '/about',
    '/contact',
    '/shipping-returns',
    '/privacy',
    '/terms',
    '/not-a-page',
  ]) {
    const response = await page.goto(route);
    expect(response.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).not.toContainText('We couldn’t load');
  }
});

for (const route of [
  '/',
  '/shop',
  '/product/the-sculpted-coat',
  '/contact',
  '/cart',
  '/checkout',
]) {
  test(`automated accessibility: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.locator('h1').waitFor();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(
        results.violations.map((item) => ({
          id: item.id,
          nodes: item.nodes.map((node) => node.target),
        })),
      ),
    ).toEqual([]);
  });
}
for (const width of [320, 375, 768, 1024, 1440]) {
  test(`responsive layout without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/shop', '/product/the-sculpted-coat', '/cart', '/contact']) {
      await page.goto(route);
      await page.locator('h1').waitFor();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${route} at ${width}px`,
      ).toBe(true);
    }
  });
}

test('mobile dialog is keyboard usable, restores focus and respects reduced motion', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
  await page.goto('/shop');
  await page.getByRole('button', { name: /^Filters/ }).click();
  await page.locator('#mobile-size').selectOption('M');
  await page.getByRole('button', { name: 'Apply filters' }).click();
  await expect(page).toHaveURL(/size=M/);
  await expect(page.getByRole('button', { name: /^Filters/ })).toBeFocused();
});

test('capture authentic desktop and mobile project screenshots', async ({ page }) => {
  await mkdir('docs/portfolio/screenshots', { recursive: true });
  for (const [name, route, width, height] of [
    ['desktop-home', '/', 1440, 900],
    ['mobile-home', '/', 390, 844],
    ['desktop-shop', '/shop', 1440, 1000],
    ['mobile-shop', '/shop', 390, 844],
    ['product-detail', '/product/the-sculpted-coat', 1440, 1000],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto(route);
    await page.locator('h1').waitFor();
    await page.evaluate(() => document.fonts.ready);
    // Real scrolling activates lazy photos before a full-page capture; no fabricated pixels.
    await page.locator('img').evaluateAll(async (images) => {
      for (const image of images) {
        image.scrollIntoView({ block: 'center' });
        await image.decode().catch(() => {});
      }
      window.scrollTo(0, 0);
    });
    await expect(page.locator('.image-fallback')).toHaveCount(0);
    await page.screenshot({ path: `docs/portfolio/screenshots/${name}.png`, fullPage: true });
    if (name.includes('home'))
      await page.screenshot({ path: `docs/portfolio/screenshots/${name}-viewport.png` });
  }
  await page.getByRole('radio', { name: 'M', exact: true }).check();
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page.goto('/cart');
  await page.locator('.cart-line').waitFor();
  await page.screenshot({ path: 'docs/portfolio/screenshots/shopping-cart.png', fullPage: true });
  await writeFile(
    'docs/portfolio/screenshots/capture-manifest.json',
    JSON.stringify(
      {
        origin: new URL(page.url()).origin,
        capturedAt: new Date().toISOString(),
        method:
          'Actual Playwright Chrome browser captures, with real page scrolling and font/image decoding.',
        desktopHomeViewport: { width: 1440, height: 900 },
        mobileHomeViewport: { width: 390, height: 844 },
        files: [
          'desktop-home.png',
          'mobile-home.png',
          'desktop-shop.png',
          'mobile-shop.png',
          'product-detail.png',
          'shopping-cart.png',
          'desktop-home-viewport.png',
          'mobile-home-viewport.png',
        ],
      },
      null,
      2,
    ),
  );
});
