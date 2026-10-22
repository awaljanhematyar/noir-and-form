/** Real-browser checks target the preview by default and can verify a live release via BASE_URL. */
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  timeout: 120000,
  workers: 1,
  reporter: [
    ['list'],
    [
      'json',
      {
        outputFile:
          process.env.BROWSER_LABEL === 'edge'
            ? 'docs/qa/browser-edge-results.json'
            : process.env.BASE_URL
              ? 'docs/qa/browser-live-results.json'
              : 'docs/qa/browser-local-results.json',
      },
    ],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:4173',
    headless: true,
    viewport: { width: 1440, height: 1000 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      executablePath:
        process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    },
  },
});
