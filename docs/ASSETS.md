# NOIR & FORM — Asset Sources and Usage

Reviewed: 2026-10-22. All photographs are served locally; the application does not hotlink the photo CDN at runtime.

## Editorial photographs

The exact download URL, local filename, dimensions, original/derivative byte counts, and license URL for every production photo are recorded in [asset-inventory.json](asset-inventory.json). The catalog contains 30 fictional garments and reuses a smaller set of editorial reference photographs. The photos do not guarantee the fictional garment, composition, chosen color, or fit. No model, photographer, or original apparel brand endorsement is implied. Product galleries deliberately label detail/texture views as crops of the same source image.

The sources are Unsplash photographs used under the [Unsplash License](https://unsplash.com/license), which permits downloading and using photos in commercial and noncommercial projects. It does not permit selling unaltered photo copies or compiling a competing image service. The Unsplash license does not itself guarantee every third-party trademark, model/publicity, or property right. This project is a fictional editorial portfolio demonstration, not a claim that the photographed goods are sold by NOIR & FORM.

The final tan-coat hero, City Edit, and related product reference are by **Chris Yang**, [Woman in beige coat standing](https://unsplash.com/photos/woman-in-beige-coat-standing-P_GymWWNA00), photo ID `photo-1627484631037-ec4955675661`. The source page explicitly identifies it as free under the Unsplash License. The source background is red; the application's restrained desaturation treatment is a presentation choice to suit the approved neutral visual system.

Other photos retain their stable Unsplash CDN source IDs in the inventory. Their author names have not been independently resolved, so this document does not invent attribution. The retrieved files were visually inspected for suitability; obviously unrelated printed-logo references were replaced with neutral clothing references before release.

## Image preparation

Original downloaded JPEGs were locally recompressed as progressive optimized JPEGs. Smaller derivatives use the same composition and color pixels, with a maximum width of 400px for product/editorial references and 800px for the hero. Responsive derivatives are named `*-small.jpg`. These are resized reference photos, not generated garment imagery.

Each of the 19 original JPEGs and 19 smaller JPEGs now has a corresponding `.webp` file, preserving its dimensions and composition. WebP encoding uses Pillow/libwebp with quality **80**, method **6**, and no creative alterations. JPEGs remain available as fallbacks. The optimization script retains the source JPEG bytes on subsequent runs, avoiding cumulative JPEG recompression loss.

Measured totals for the 38 corresponding file pairs: **2,630,927 bytes JPEG → 1,602,930 bytes WebP**, a reduction of **1,027,997 bytes (39.1%)**. The full hero changes from **292,529 → 117,630 bytes (59.8% smaller)**; its 800px derivative changes from **48,450 → 23,822 bytes (50.8% smaller)**. These are file-size measurements, not a claim that every asset is fetched on a single page. All **38 WebP dimensions were verified** against their JPEG counterpart.

`scripts/fetch-assets.py` records the download sources. Its network operation requires normal authorized network access and never uses credentials. `scripts/optimize-assets.py` reproduces JPEG responsive derivatives and WebP counterparts from the retained source JPEGs and updates inventory sizes. The inventory records `webpFile`, `webpBytes`, `smallWebpFile`, `smallWebpBytes`, and encoding parameters alongside the JPEG references.

Internal candidate/contact-sheet files under `docs/` were used only for asset review and are not referenced by the website. No browser screenshots are fabricated from these images.

## Fonts

- **Playfair Display Variable**: locally bundled by `@fontsource-variable/playfair-display`; upstream Playfair Display Project Authors, including the reserved font name “Playfair Display”.
- **DM Sans Variable**: locally bundled by `@fontsource-variable/dm-sans`; upstream DM Sans Project Authors.

Both installed package license notices use the **SIL Open Font License 1.1**. Exact notices are preserved in `docs/licenses/playfair-display-OFL.txt` and `docs/licenses/dm-sans-OFL.txt`. The application serves bundled font files and does not call Google Fonts at runtime. Package versions are locked by the project lockfile.

## Remaining limitations

There are fewer distinct source photographs than fictional products. Some garments appear only as generalized editorial references, and every selected color is not photographed. Detail views are crops, not independent camera angles. These limitations are disclosed on product pages and in the Terms page; do not repurpose this catalog as a real commercial product listing without replacing the references with verified garment photography and rights clearances.
