/** Cart, wishlist, checkout, and ephemeral confirmation share validated commerce rules. */
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check, Trash2 } from 'lucide-react';
import { useStore } from '../app/Store';
import { capFor, getProduct, money, totals } from '../utils/shop';
import { EmptyState, PageHeading, Photo, ProductGrid, Quantity } from '../components/UI';
import DemoForm from '../components/DemoForm';

// ========================================
// CONSISTENT ILLUSTRATIVE ORDER TOTALS
// ========================================
export function Summary({ amounts, children }) {
  return (
    <section className="order-summary" aria-label="Illustrative order summary">
      <p className="eyebrow">THE DETAILS</p>
      <h2>A considered total.</h2>
      <dl>
        <div>
          <dt>Subtotal</dt>
          <dd>{money(amounts.subtotal)}</dd>
        </div>
        <div>
          <dt>Demo shipping</dt>
          <dd>{amounts.shipping ? money(amounts.shipping) : 'Complimentary'}</dd>
        </div>
        <div>
          <dt>Illustrative tax (5%)</dt>
          <dd>{money(amounts.tax)}</dd>
        </div>
        <div className="summary-total">
          <dt>
            Demo total <small>CAD</small>
          </dt>
          <dd>{money(amounts.total)}</dd>
        </div>
      </dl>
      <p className="summary-disclosure">
        Illustrative demo calculation — not a tax or shipping quote. Sample shipping is $15 below
        $250; free from $250. A fictional flat 5% tax applies to merchandise plus shipping.
      </p>
      {children}
      <span className="summary-footnote">
        No payment. No real order. Just a considered experience.
      </span>
    </section>
  );
}
export function Cart() {
  const { cart, updateQuantity, removeLine } = useStore();
  return (
    <div className="page-width commerce-page">
      <PageHeading eyebrow="YOUR CONSIDERED SELECTION" title="In your bag.">
        {cart.length
          ? 'A few good pieces. A little more possibility.'
          : 'Good things begin with a little consideration.'}
      </PageHeading>
      {!cart.length ? (
        <EmptyState title="Room for something considered.">
          Your bag is empty. Explore the wardrobe and find your form.
        </EmptyState>
      ) : (
        <div className="commerce-layout">
          <div>
            <div className="cart-table-labels">
              <span>Piece</span>
              <span>Quantity / Total</span>
            </div>
            {cart.map((line) => {
              const product = getProduct(line.productId);
              const variant = product.variants.find((item) => item.id === line.variantId);
              return (
                <article className="cart-line" key={line.variantId}>
                  <Link to={`/product/${product.slug}`}>
                    <Photo
                      src={product.images[0].src}
                      alt={product.images[0].alt}
                      width="150"
                      height="200"
                    />
                  </Link>
                  <div className="cart-line-info">
                    <Link className="product-name" to={`/product/${product.slug}`}>
                      {product.name}
                    </Link>
                    <p>
                      {product.colors.find((color) => color.id === variant.colorId)?.name} /{' '}
                      {variant.size}
                    </p>
                    <span>{money(product.priceCents)} CAD</span>
                    <button
                      className="remove-line"
                      onClick={() => removeLine(variant.id)}
                      aria-label={`Remove ${product.name}, ${variant.size}`}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                  <div className="cart-line-controls">
                    <Quantity
                      value={line.quantity}
                      max={capFor(variant)}
                      onChange={(quantity) => updateQuantity(variant.id, quantity)}
                      label={`Quantity for ${product.name}, ${variant.size}`}
                    />
                    <strong>{money(product.priceCents * line.quantity)}</strong>
                  </div>
                </article>
              );
            })}
            <Link className="text-link continue-link" to="/shop">
              <ArrowLeft size={16} /> Continue exploring
            </Link>
          </div>
          <Summary amounts={totals(cart)}>
            <Link className="button" to="/checkout">
              Continue to demo checkout <ArrowUpRight size={17} />
            </Link>
          </Summary>
        </div>
      )}
    </div>
  );
}
export function Wishlist() {
  const { wishlist } = useStore();
  return (
    <div className="page-width commerce-page">
      <PageHeading eyebrow="PIECES TO COME BACK TO" title="A moment of consideration.">
        Your personal edit, saved in this browser.
      </PageHeading>
      {wishlist.length ? (
        <ProductGrid products={wishlist.map(getProduct).filter(Boolean)} />
      ) : (
        <EmptyState title="Keep what speaks to you.">
          Tap the heart on any piece to begin your wishlist. Your saved edit will be here when you
          return.
        </EmptyState>
      )}
    </div>
  );
}
export function Checkout() {
  const { cart, setCart, setOrder, setNotice } = useStore();
  const navigate = useNavigate();
  const submitted = useRef(false);
  function placeOrder() {
    if (submitted.current || !cart.length) return;
    submitted.current = true;
    const snapshot = {
      reference: `NF-DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      amounts: totals(cart),
      lines: cart.map((line) => ({
        ...line,
        name: getProduct(line.productId).name,
        priceCents: getProduct(line.productId).priceCents,
      })),
    };
    setOrder(snapshot);
    setCart([]);
    setNotice('Demo order created. No payment, email, or fulfillment has occurred.');
    navigate('/order-confirmation', { replace: true });
  }
  return (
    <div className="page-width commerce-page">
      <PageHeading eyebrow="A SIMULATED CHECKOUT" title="The final details.">
        An interactive demo. No payment, no real order, no information stored.
      </PageHeading>
      {!cart.length ? (
        <EmptyState title="Your bag is taking a quiet moment.">
          Add a piece before exploring the demo checkout.
        </EmptyState>
      ) : (
        <div className="commerce-layout">
          <section className="checkout-details">
            <h2>Delivery details</h2>
            <p>Canada only. Use fictional information to explore this form.</p>
            <DemoForm checkout onValid={placeOrder} />
          </section>
          <div>
            <div className="checkout-mini-items">
              {cart.map((line) => (
                <div key={line.variantId}>
                  <span>
                    {getProduct(line.productId).name} × {line.quantity}
                  </span>
                  <span>{money(getProduct(line.productId).priceCents * line.quantity)}</span>
                </div>
              ))}
            </div>
            <Summary amounts={totals(cart)} />
          </div>
        </div>
      )}
    </div>
  );
}
export function Confirmation() {
  const { order } = useStore();
  if (!order)
    return (
      <div className="page-width commerce-page">
        <PageHeading eyebrow="DEMO CONFIRMATION" title="A fresh beginning." />
        <EmptyState title="There’s no demo receipt in this tab.">
          Demo confirmations are kept only in memory and disappear on refresh. Your browser never
          stores order or personal details.
        </EmptyState>
      </div>
    );
  return (
    <div className="page-width confirmation-page">
      <div className="confirmation-heading">
        <span className="confirmation-check">
          <Check size={28} />
        </span>
        <p className="eyebrow">DEMO EXPERIENCE COMPLETE</p>
        <h1>A considered choice.</h1>
        <p>
          Your simulated order is ready to review.
          <br />
          No payment, email, or fulfillment has occurred.
        </p>
        <span className="order-reference">{order.reference}</span>
      </div>
      <div className="confirmation-summary">
        <h2>Your fictional selection</h2>
        {order.lines.map((line) => (
          <div className="receipt-line" key={line.variantId}>
            <span>
              {line.name} × {line.quantity}
            </span>
            <span>{money(line.priceCents * line.quantity)}</span>
          </div>
        ))}
        <Summary amounts={order.amounts} />
        <p className="summary-disclosure">
          This receipt is memory-only. Refreshing this page clears it.
        </p>
        <Link to="/shop" className="button">
          Return to the wardrobe <ArrowUpRight size={17} />
        </Link>
      </div>
    </div>
  );
}
