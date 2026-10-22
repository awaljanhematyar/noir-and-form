/** Copy the exact licensed Latin font files to stable URLs used by CSS and early preloads. */
import fs from 'node:fs/promises';

await fs.mkdir('public/fonts', { recursive: true });
for (const [source, destination] of [
  ['dm-sans/files/dm-sans-latin-wght-normal.woff2', 'dm-sans-latin.woff2'],
  ['playfair-display/files/playfair-display-latin-wght-normal.woff2', 'playfair-latin.woff2'],
  [
    'playfair-display/files/playfair-display-latin-wght-italic.woff2',
    'playfair-latin-italic.woff2',
  ],
]) {
  await fs.copyFile(`node_modules/@fontsource-variable/${source}`, `public/fonts/${destination}`);
}
for (const font of ['dm-sans', 'playfair-display']) {
  await fs.copyFile(
    `node_modules/@fontsource-variable/${font}/LICENSE`,
    `public/fonts/${font}-OFL.txt`,
  );
}
