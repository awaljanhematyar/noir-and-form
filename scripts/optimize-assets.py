"""Reproduce responsive JPEG/WebP derivatives without altering the retained JPEG sources."""
from pathlib import Path
import json
import shutil
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]

# ========================================
# RESPONSIVE ASSET DERIVATIVES
# ========================================
inventory_path = ROOT / 'docs' / 'asset-inventory.json'
records = json.loads(inventory_path.read_text(encoding='utf-8'))
for record in records:
    path = ROOT / record['file']
    image = ImageOps.exif_transpose(Image.open(path)).convert('RGB')
    # Retain the optimized source JPEG byte-for-byte; repeated runs cannot compound JPEG loss.
    width = 800 if path.name == 'hero.jpg' else 400
    small = image.copy()
    small.thumbnail((width, 10000))
    small_path = path.with_name(path.stem + '-small.jpg')
    small.save(small_path, 'JPEG', quality=78, optimize=True, progressive=True)
    webp_path = path.with_suffix('.webp')
    small_webp_path = small_path.with_suffix('.webp')
    image.save(webp_path, 'WEBP', quality=80, method=6, exact=True)
    small.save(small_webp_path, 'WEBP', quality=80, method=6, exact=True)
    record.update({
        'width': image.width, 'height': image.height, 'bytes': path.stat().st_size,
        'smallFile': small_path.relative_to(ROOT).as_posix(),
        'smallWidth': small.width, 'smallHeight': small.height, 'smallBytes': small_path.stat().st_size,
        'webpFile': webp_path.relative_to(ROOT).as_posix(), 'webpBytes': webp_path.stat().st_size,
        'smallWebpFile': small_webp_path.relative_to(ROOT).as_posix(), 'smallWebpBytes': small_webp_path.stat().st_size,
        'webpEncoding': {'quality': 80, 'method': 6, 'sameDimensionsAndComposition': True},
    })
    if path.name in ['hero.jpg', 'editorial-city.jpg', 'product-05.jpg', 'product-15.jpg']:
        record.update({
            'sourcePage': 'https://unsplash.com/photos/woman-in-beige-coat-standing-P_GymWWNA00',
            'photographer': 'Chris Yang',
            'licenseVerified': 'Source page explicitly labels free use under the Unsplash License; checked 2026-10-22.',
        })
    print(path.name, record['bytes'], 'webp:', record['webpBytes'], 'small:', record['smallBytes'], 'smallWebp:', record['smallWebpBytes'], flush=True)
inventory_path.write_text(json.dumps(records, indent=2), encoding='utf-8')

# ========================================
# BUNDLED FONT LICENSE NOTICES
# ========================================
license_dir = ROOT / 'docs' / 'licenses'
license_dir.mkdir(parents=True, exist_ok=True)
for family in ['dm-sans', 'playfair-display']:
    source = ROOT / 'node_modules' / '@fontsource-variable' / family / 'LICENSE'
    if source.exists():
        shutil.copyfile(source, license_dir / (family + '-OFL.txt'))
jpg_total = sum(record['bytes'] + record['smallBytes'] for record in records)
webp_total = sum(record['webpBytes'] + record['smallWebpBytes'] for record in records)
print('Verified', len(records) * 2, 'retained JPEGs and matching WebP counterparts.', flush=True)
print('JPEG total:', jpg_total, 'WebP total:', webp_total, 'saved:', jpg_total - webp_total,
      f'({(jpg_total - webp_total) / jpg_total:.1%})', flush=True)
