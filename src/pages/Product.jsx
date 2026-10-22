/** Product detail validates sellable size/color combinations before adding to the bag. */
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, Truck, RotateCcw } from 'lucide-react';
import { findProduct, products } from '../data/catalog';
import { capFor, money } from '../utils/shop';
import { useStore } from '../app/Store';
import { EmptyState, Photo, ProductGrid, Quantity } from '../components/UI';

// ========================================
// PRODUCT OPTIONS AND GALLERY STATE
// ========================================
function ProductDetail({ product }) {
  const [image, setImage] = useState(0);
  const [color, setColor] = useState(product.colors[0].id);
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const variant = product.variants.find((item) => item.colorId === color && item.size === size);
  const selectedImage = product.images[image];
  const soldOut = product.variants.every((item) => !item.stock);
  const saved = wishlist.includes(product.id);
  // ========================================
  // VARIANT VALIDATION AND CART ACTION
  // ========================================
  function add(event) {
    event.preventDefault();
    if (!size) {
      setError('Choose a size before adding this piece.');
      document.getElementById('size-options')?.focus();
      return;
    }
    if (!capFor(variant)) {
      setError('This variant is sold out in the demo. Choose another size or color.');
      return;
    }
    if (addToCart(product.id, variant.id, quantity)) setError('');
    else setError('Your bag plus this quantity exceeds the available demo stock.');
  }
  return (
    <div className="page-width product-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/shop">The wardrobe</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>
      <div className="product-detail-layout">
        <div className="gallery">
          <div className="gallery-main">
            <Photo
              key={image}
              src={selectedImage.src}
              sizes="(max-width: 767px) 100vw, 50vw"
              alt={selectedImage.alt}
              eager
              width="900"
              height="1200"
              style={{
                objectPosition: selectedImage.position,
                transform: selectedImage.crop ? 'scale(1.32)' : undefined,
              }}
            />
            <span className="gallery-caption">
              {selectedImage.label} · Illustrative photography
            </span>
          </div>
          <div className="gallery-thumbnails" aria-label="Product image views">
            {product.images.map((item, index) => (
              <button
                key={item.label}
                aria-label={`Show ${item.label.toLowerCase()}`}
                aria-pressed={image === index}
                onClick={() => setImage(index)}
              >
                <Photo
                  src={item.src}
                  alt=""
                  width="100"
                  height="130"
                  style={{
                    objectPosition: item.position,
                    transform: item.crop ? 'scale(1.35)' : undefined,
                  }}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="purchase-panel">
          <p className="eyebrow">{product.category} / THE CONSIDERED WARDROBE</p>
          <h1>{product.name}</h1>
          <p className="detail-price">
            {money(product.priceCents)} <span>CAD</span>
          </p>
          <p className="product-description">{product.description}</p>
          <form onSubmit={add}>
            <fieldset className="color-options">
              <legend>
                Color — <span>{product.colors.find((item) => item.id === color)?.name}</span>
              </legend>
              {product.colors.map((item) => (
                <label key={item.id} className={color === item.id ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="color"
                    value={item.id}
                    checked={color === item.id}
                    onChange={() => {
                      setColor(item.id);
                      setQuantity(1);
                      setSize('');
                      setError('');
                    }}
                  />
                  <span style={{ background: item.hex }} />
                  <span className="sr-only">{item.name}</span>
                </label>
              ))}
            </fieldset>
            <fieldset
              id="size-options"
              className="size-options"
              tabIndex={-1}
              aria-describedby={error ? 'variant-error' : undefined}
            >
              <legend>
                Choose your size <span>Relaxed, considered fit</span>
              </legend>
              {['XS', 'S', 'M', 'L', 'XL'].map((item) => {
                const stock = product.variants.find(
                  (v) => v.size === item && v.colorId === color,
                )?.stock;
                return (
                  <label
                    key={item}
                    className={`${size === item ? 'selected' : ''} ${!stock ? 'unavailable' : ''}`}
                  >
                    <input
                      type="radio"
                      name="size"
                      checked={size === item}
                      disabled={!stock}
                      onChange={() => {
                        setSize(item);
                        setQuantity(1);
                        setError('');
                      }}
                    />
                    {item}
                    {!stock && <span className="sr-only"> — sold out</span>}
                  </label>
                );
              })}
            </fieldset>
            <p className="stock-note">
              {soldOut
                ? 'This piece is currently sold out in the demo.'
                : variant
                  ? `${variant.stock} available in this demo variant`
                  : 'Select a size to check demo availability.'}
            </p>
            <div className="purchase-actions">
              <Quantity value={quantity} max={capFor(variant) || 1} onChange={setQuantity} />
              <button className="button" type="submit" disabled={soldOut}>
                <ShoppingBag size={17} />
                {soldOut ? 'Sold out' : 'Add to bag'}
              </button>
            </div>
            {error && (
              <p id="variant-error" className="form-error" role="alert">
                {error}
              </p>
            )}
          </form>
          <button
            className="wishlist-detail text-link"
            onClick={() => toggleWishlist(product.id)}
            aria-pressed={saved}
          >
            <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Saved to your wishlist' : 'Save for a considered moment'}
          </button>
          <div className="detail-services">
            <span>
              <Truck size={17} /> Canada-only demo checkout
            </span>
            <span>
              <RotateCcw size={17} /> No real payment or fulfillment
            </span>
          </div>
          <details open>
            <summary>Material & care</summary>
            <p>
              {product.material}
              <br />
              {product.care}
            </p>
          </details>
          <details>
            <summary>Fit & sizing</summary>
            <p>
              XS–XL is an illustrative demo size range. No actual measurements or real fit guarantee
              are provided.
            </p>
          </details>
          <details>
            <summary>A note on this concept</summary>
            <p>
              This is a fictional product. Photography is an editorial reference; detail views are
              illustrative crops and may not match the selected color or exact garment. No goods are
              sold.
            </p>
          </details>
        </div>
      </div>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A CONSIDERED PAIRING</p>
            <h2>In good company.</h2>
          </div>
          <Link className="text-link" to="/shop">
            <ArrowLeft size={16} /> Back to the wardrobe
          </Link>
        </div>
        <ProductGrid
          products={products
            .filter((item) => item.id !== product.id && item.category === product.category)
            .slice(0, 4)}
        />
      </section>
    </div>
  );
}
// ========================================
// PRODUCT ROUTE RECOVERY
// ========================================
export default function Product() {
  const { slug } = useParams();
  const product = findProduct(slug);
  return product ? (
    <ProductDetail key={product.id} product={product} />
  ) : (
    <div className="page-width">
      <h1 className="sr-only">Product not found</h1>
      <EmptyState title="This form is yet to be found.">
        The piece you’re looking for is not in our fictional collection.
      </EmptyState>
    </div>
  );
}
