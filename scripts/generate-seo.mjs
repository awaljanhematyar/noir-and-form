/** Generate truthful production sitemap/robots files only for an explicitly supplied deployment origin. */
import fs from 'node:fs/promises';
import { products, collections } from '../src/data/catalog.js';

const input = process.argv[2];
if (!input || !/^https:\/\/[^/]+\/?$/.test(input))
  throw new Error('Pass the verified HTTPS production origin.');
const origin = new URL(input).origin;
const routes = [
  '/',
  '/shop',
  '/collections',
  ...collections.map((item) => `/collections/${item.slug}`),
  ...products.map((item) => `/product/${item.slug}`),
  '/about',
  '/contact',
  '/shipping-returns',
  '/privacy',
  '/terms',
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${origin}${route}</loc></url>`).join('\n')}\n</urlset>\n`;
await fs.writeFile('public/sitemap.xml', xml);
await fs.writeFile(
  'public/robots.txt',
  `User-agent: *\nAllow: /\nDisallow: /cart\nDisallow: /checkout\nDisallow: /wishlist\nDisallow: /order-confirmation\nSitemap: ${origin}/sitemap.xml\n`,
);
let html = await fs.readFile('index.html', 'utf8');
html = html.replace(
  /content="(?:https:\/\/[^" ]+)?\/social-cover.jpg"/,
  `content="${origin}/social-cover.jpg"`,
);
await fs.writeFile('index.html', html);
console.log(`Generated ${routes.length} sitemap URLs for ${origin}.`);
