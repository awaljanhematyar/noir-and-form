/** Run three mobile Lighthouse samples per representative route and preserve concise evidence. */
import fs from 'node:fs/promises';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';

// ========================================
// REPRODUCIBLE MOBILE LAB MEASUREMENT
// ========================================
const origin = process.env.BASE_URL || 'http://127.0.0.1:4173';
const chrome = await launch({
  chromePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  chromeFlags: ['--headless=new', '--disable-gpu'],
});
const records = [];
await fs.mkdir('docs/qa/lighthouse', { recursive: true });
try {
  for (const [name, route] of [
    ['home', '/'],
    ['shop', '/shop'],
    ['product', '/product/the-sculpted-coat'],
  ]) {
    for (let run = 1; run <= 3; run++) {
      const result = await lighthouse(`${origin}${route}`, {
        port: chrome.port,
        output: 'json',
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor: 'mobile',
      });
      const report = result.lhr;
      const record = {
        route,
        run,
        origin,
        timestamp: report.fetchTime,
        scores: Object.fromEntries(
          Object.entries(report.categories).map(([key, category]) => [
            key,
            Math.round(category.score * 100),
          ]),
        ),
        lcpMs: Math.round(report.audits['largest-contentful-paint'].numericValue),
        cls: report.audits['cumulative-layout-shift'].numericValue,
        tbtMs: Math.round(report.audits['total-blocking-time'].numericValue),
        issues: Object.values(report.audits)
          .filter(
            (audit) =>
              audit.score !== null && audit.score < 1 && audit.details?.type !== 'opportunity',
          )
          .map((audit) => ({ id: audit.id, title: audit.title, displayValue: audit.displayValue })),
      };
      records.push(record);
      console.log(JSON.stringify(record));
      await fs.writeFile(`docs/qa/lighthouse/${name}-${run}.json`, JSON.stringify(report));
      await fs.writeFile('docs/qa/performance-summary.json', JSON.stringify(records, null, 2));
    }
  }
} finally {
  await chrome.kill();
}
