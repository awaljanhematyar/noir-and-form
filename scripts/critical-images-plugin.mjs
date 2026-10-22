/** Vite injects early route-aware image hints without introducing a backend or preloading every page. */
import { products } from '../src/data/catalog.js';

export function criticalImages() {
  const productImages = Object.fromEntries(
    products.map((product) => [`/product/${product.slug}`, product.images[0].src]),
  );
  const code = `(()=>{const p=location.pathname;const m=${JSON.stringify(productImages)};const hero=p==='/';const product=!!m[p];const src=hero?'/images/hero.jpg':product?m[p]:p==='/shop'&&!location.search?'${products[0].images[0].src}':null;if(!src)return;const url=src.replace('.jpg','.webp');const l=document.createElement('link');l.rel='preload';l.as='image';l.type='image/webp';l.href=url;l.setAttribute('fetchpriority','high');l.setAttribute('imagesrcset',url.replace('.webp','-small.webp')+' '+(hero?800:400)+'w, '+url+' '+(hero?1800:700)+'w');l.setAttribute('imagesizes',hero?'100vw':product?'(max-width: 767px) 100vw, 50vw':'(max-width: 767px) 50vw, (max-width: 1100px) 33vw, 25vw');document.head.appendChild(l)})();`;
  return {
    name: 'noir-critical-images',
    transformIndexHtml: {
      order: 'pre',
      handler: () => [{ tag: 'script', children: code, injectTo: 'head' }],
    },
  };
}
