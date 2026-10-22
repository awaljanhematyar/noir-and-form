/** Verify the published portfolio entry without accessing its authenticated CMS. */
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});
try {
  const page = await browser.newPage();
  const url = 'https://hematyar-professional-portfolio.vercel.app/projects/noir-and-form';
  for (const [name, width, height] of [
    ['desktop', 1440, 1000],
    ['mobile', 390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto(url);
    await page.getByRole('heading', { name: /NOIR & FORM/ }).waitFor();
    await page
      .locator('a[href="https://github.com/awaljanhematyar/noir-and-form"]')
      .first()
      .waitFor();
    await page.locator('a[href="https://noir-and-form-umber.vercel.app"]').first().waitFor();
    const cover = page.locator('img[src*="portfolio-cover.png"]');
    await cover.first().waitFor();
    await cover.first().evaluate((image) => image.decode());
    if (!(await cover.first().evaluate((image) => image.naturalWidth > 0)))
      throw Error('Cover failed');
    if (!(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)))
      throw Error('Overflow');
    await page.screenshot({ path: `docs/portfolio/portfolio-${name}.png`, fullPage: true });
  }
  await fs.writeFile(
    'docs/portfolio/integration-verification.json',
    JSON.stringify(
      {
        url,
        verifiedAt: new Date().toISOString(),
        checks: [
          'Published title',
          'GitHub link',
          'Live link',
          'Decoded cover',
          'Desktop/mobile without overflow',
        ],
      },
      null,
      2,
    ),
  );
  console.log('Public portfolio entry verified on desktop and mobile.');
} finally {
  await browser.close();
}
