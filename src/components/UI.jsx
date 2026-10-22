/** Reusable accessible product presentation, navigation links, and quantity controls. */
import { ArrowUpRight, Heart, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../app/Store';
import { money } from '../utils/shop';

// ========================================
// SHARED EDITORIAL ELEMENTS
// ========================================
export function ActionLink({ to, children, light = false, className = '' }) {
  return (
    <Link className={`button ${light ? 'button-light' : ''} ${className}`} to={to}>
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </Link>
  );
}
export function PageHeading({ eyebrow, title, children }) {
  return (
    <header className="page-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {children && <p className="intro">{children}</p>}
    </header>
  );
}
export function EmptyState({ title, children, to = '/shop', action = 'Explore the collection' }) {
  return (
    <section className="empty-state">
      <span className="monogram" aria-hidden="true">
        N/F
      </span>
      <h2>{title}</h2>
      <p>{children}</p>
      <ActionLink to={to}>{action}</ActionLink>
    </section>
  );
}
export function Photo({ src, alt, className = '', eager = false, ...rest }) {
  const [failed, setFailed] = useState(false);
  const [jpegFallback, setJpegFallback] = useState(false);
  const localPhoto = src.startsWith('/images/') && src.endsWith('.jpg');
  const hero = src.endsWith('/hero.jpg');
  const imageSrc = localPhoto && !jpegFallback ? src.replace('.jpg', '.webp') : src;
  const srcSet = localPhoto
    ? `${imageSrc.replace(/\.(jpg|webp)$/, '-small.$1')} ${hero ? 800 : 400}w, ${imageSrc} ${hero ? 1800 : src.includes('editorial') ? 1100 : 700}w`
    : undefined;
  return failed ? (
    <div className={`image-fallback ${className}`} role="img" aria-label={alt}>
      <span>N/F</span>
      <small>Image unavailable</small>
    </div>
  ) : (
    <img
      src={imageSrc}
      srcSet={srcSet}
      sizes={hero ? '100vw' : '(max-width: 767px) 50vw, (max-width: 1100px) 33vw, 25vw'}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      onError={() => {
        if (localPhoto && !jpegFallback) setJpegFallback(true);
        else setFailed(true);
      }}
      {...rest}
    />
  );
}

// ========================================
// INDEPENDENT PRODUCT AND WISHLIST CONTROLS
// ========================================
export function ProductCard({ product, eager = false }) {
  const { wishlist, toggleWishlist } = useStore();
  const saved = wishlist.includes(product.id);
  const soldOut = product.variants.every((variant) => !variant.stock);
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          <Photo
            src={product.images[0].src}
            alt={product.images[0].alt}
            eager={eager}
            width="600"
            height="800"
          />
        </Link>
        {product.featuredRank < 4 && <span className="product-badge">New arrival</span>}
        {soldOut && <span className="product-badge">Sold out</span>}
        <button
          className="save-button"
          aria-label={`${saved ? 'Remove' : 'Save'} ${product.name} ${saved ? 'from' : 'to'} wishlist`}
          aria-pressed={saved}
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <Link className="quick-view" to={`/product/${product.slug}`}>
          Discover piece <ArrowUpRight size={15} />
        </Link>
      </div>
      <div className="product-card-info">
        <div>
          <Link to={`/product/${product.slug}`} className="product-name">
            {product.name}
          </Link>
          <p>{product.category}</p>
        </div>
        <span className="product-price">
          {money(product.priceCents)} <small>CAD</small>
        </span>
      </div>
      <div
        className="card-swatches"
        role="img"
        aria-label={`Available colors: ${product.colors.map((color) => color.name).join(', ')}`}
      >
        {product.colors.map((color) => (
          <span key={color.id} style={{ background: color.hex }} />
        ))}
      </div>
    </article>
  );
}
export function ProductGrid({ products, eager = false }) {
  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} eager={eager && index < 4} />
      ))}
    </div>
  );
}
export function Quantity({ value, max, onChange, label = 'Quantity' }) {
  return (
    <div className="quantity">
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={14} />
      </button>
      <input
        aria-label={label}
        type="number"
        min="1"
        max={max}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isInteger(next) && next >= 1 && next <= max) onChange(next);
        }}
      />
      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
