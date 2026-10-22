"""Download editorial references locally and record their Unsplash source/license URLs."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import Request, urlopen
import json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'images'
OUT.mkdir(parents=True, exist_ok=True)

# EDITORIAL REFERENCES — product names and material claims are fictional, not photo metadata.
photos = [
    'photo-1539109136881-3be0616acf4b',
    'photo-1434389677669-e08b4cac3105',
    'photo-1594633312681-425c7b97ccd1',
    'photo-1598554747436-c9293d6a588f',
    'photo-1627484631037-ec4955675661',
    'photo-1434389677669-e08b4cac3105',
    'photo-1591047139829-d91aecb6caea',
    'photo-1521572163474-6864f9cf17ab',
    'photo-1544022613-e87ca75a784a',
    'photo-1551028719-00167b16eac5',
    'photo-1473966968600-fa801b869a1a',
    'photo-1521572163474-6864f9cf17ab',
    'photo-1544022613-e87ca75a784a',
    'photo-1434389677669-e08b4cac3105',
    'photo-1627484631037-ec4955675661',
]
assets = [(f'product-{i+1:02}.jpg', photo, 700) for i, photo in enumerate(photos)]
assets += [('hero.jpg', 'photo-1627484631037-ec4955675661', 1800), ('editorial-city.jpg', 'photo-1627484631037-ec4955675661', 1100), ('editorial-soft.jpg', 'photo-1434389677669-e08b4cac3105', 1100), ('editorial-form.jpg', 'photo-1544022613-e87ca75a784a', 1100)]

def download(asset):
    name, photo, width = asset
    url = f'https://images.unsplash.com/{photo}?auto=format&fit=crop&w={width}&q=82&fm=jpg'
    path = OUT / name
    if not path.exists() or name in ['product-06.jpg', 'product-12.jpg']:
        request = Request(url, headers={'User-Agent': 'NOIR-FORM-Portfolio/1.0'})
        with urlopen(request, timeout=50) as response:
            content = response.read()
        if len(content) < 3000:
            raise ValueError(f'Invalid image {name}')
        path.write_bytes(content)
    return {'file': f'public/images/{name}', 'source': url, 'license': 'https://unsplash.com/license', 'use': 'Illustrative editorial reference; fictional catalog, not an exact garment/color representation', 'bytes': path.stat().st_size}

results = []
with ThreadPoolExecutor(max_workers=6) as pool:
    for result in pool.map(download, assets):
        results.append(result)
        print(result['file'], result['bytes'], flush=True)
(ROOT / 'docs').mkdir(exist_ok=True)
(ROOT / 'docs' / 'asset-inventory.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
