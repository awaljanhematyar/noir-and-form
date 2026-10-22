/** Application shell provides responsive navigation, route metadata, focus, and recovery. */
import { Component, lazy, Suspense, useEffect, useRef } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowUpRight, Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useStore } from './Store';
import Home from '../pages/Home';
import { collections, products } from '../data/catalog';

const Shop = lazy(() => import('../pages/Shop'));
const Product = lazy(() => import('../pages/Product'));
const Collections = lazy(() => import('../pages/Collections'));
const Cart = lazy(() => import('../pages/Commerce').then((module) => ({ default: module.Cart })));
const Wishlist = lazy(() =>
  import('../pages/Commerce').then((module) => ({ default: module.Wishlist })),
);
const Checkout = lazy(() =>
  import('../pages/Commerce').then((module) => ({ default: module.Checkout })),
);
const Confirmation = lazy(() =>
  import('../pages/Commerce').then((module) => ({ default: module.Confirmation })),
);
const About = lazy(() => import('../pages/Content').then((module) => ({ default: module.About })));
const Contact = lazy(() =>
  import('../pages/Content').then((module) => ({ default: module.Contact })),
);
const Policy = lazy(() =>
  import('../pages/Content').then((module) => ({ default: module.Policy })),
);
const NotFound = lazy(() =>
  import('../pages/Content').then((module) => ({ default: module.NotFound })),
);
const navigation = [
  ['/shop', 'Shop'],
  ['/collections', 'Collections'],
  ['/about', 'Our story'],
];

// ========================================
// RESPONSIVE NAVIGATION AND FOOTER
// ========================================
function Header() {
  const { cart, wishlist } = useStore();
  const location = useLocation();
  const dialog = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    dialog.current?.close();
  }, [location.pathname]);
  return (
    <>
      <div className="announcement">
        <span>Considered pieces. Enduring style.</span>
        <span className="announcement-right">
          Toronto, Canada <span aria-hidden="true">↗</span>
        </span>
      </div>
      <header className="site-header">
        <button
          className="icon-button mobile-menu"
          ref={trigger}
          aria-label="Open navigation"
          aria-haspopup="dialog"
          onClick={() => dialog.current.showModal()}
        >
          <Menu size={22} />
        </button>
        <nav className="desktop-nav" aria-label="Primary">
          {navigation.map(([to, label]) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="wordmark" aria-label="NOIR & FORM home">
          NOIR <span>&</span> FORM
        </Link>
        <nav className="header-actions" aria-label="Shopping">
          <Link
            className="icon-button search-link"
            to="/shop?focus=search"
            aria-label="Search products"
          >
            <Search size={19} />
          </Link>
          <Link
            className="icon-button"
            to="/wishlist"
            aria-label={`Wishlist, ${wishlist.length} saved products`}
          >
            <Heart size={19} />
            {wishlist.length > 0 && <span className="count">{wishlist.length}</span>}
          </Link>
          <Link
            className="icon-button"
            to="/cart"
            aria-label={`Shopping bag, ${cart.reduce((sum, line) => sum + line.quantity, 0)} items`}
          >
            <ShoppingBag size={19} />
            {cart.length > 0 && (
              <span className="count">{cart.reduce((sum, line) => sum + line.quantity, 0)}</span>
            )}
          </Link>
        </nav>
      </header>
      <dialog
        ref={dialog}
        className="menu-dialog"
        aria-labelledby="menu-title"
        onClose={() => trigger.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current.close();
        }}
      >
        <div className="dialog-top">
          <span id="menu-title" className="eyebrow">
            NOIR & FORM
          </span>
          <button
            className="icon-button"
            aria-label="Close navigation"
            onClick={() => dialog.current.close()}
          >
            <X />
          </button>
        </div>
        <nav aria-label="Mobile">
          {[...navigation, ['/contact', 'Contact'], ['/wishlist', 'Wishlist']].map(
            ([to, label]) => (
              <Link key={to} to={to}>
                {label}
                <ArrowUpRight size={22} />
              </Link>
            ),
          )}
        </nav>
        <p>
          Considered, by design.
          <br />
          Toronto, Canada.
        </p>
      </dialog>
    </>
  );
}
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Link className="footer-wordmark" to="/">
            NOIR & FORM
          </Link>
          <p>
            A considered wardrobe.
            <br />A quieter kind of statement.
          </p>
          <span className="eyebrow">Toronto, Canada</span>
        </div>
        <div>
          <h2>Explore</h2>
          <Link to="/shop">All pieces</Link>
          <Link to="/collections">The collections</Link>
          <Link to="/about">Our story</Link>
        </div>
        <div>
          <h2>Client care</h2>
          <Link to="/contact">Get in touch</Link>
          <Link to="/shipping-returns">Shipping & returns</Link>
          <Link to="/wishlist">Your wishlist</Link>
        </div>
        <div className="footer-note">
          <h2>Thoughtfully imagined.</h2>
          <p>
            An independent portfolio project exploring the intersection of fashion, form, and
            digital craft.
          </p>
          <span className="fictional-label">Fictional brand · E-commerce demo</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} NOIR & FORM. A portfolio concept.</span>
        <div>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <span>Canada · CAD $</span>
        </div>
      </div>
    </footer>
  );
}

// ========================================
// ROUTE METADATA AND ACCESSIBLE FOCUS
// ========================================
function RouteEffects() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    const names = {
      '/': 'Considered, by design.',
      '/shop': 'The wardrobe',
      '/collections': 'The collections',
      '/about': 'Our story',
      '/contact': 'Get in touch',
      '/cart': 'Your bag',
      '/checkout': 'Demo checkout',
      '/order-confirmation': 'Demo confirmation',
      '/wishlist': 'Your wishlist',
      '/shipping-returns': 'Shipping & returns',
      '/privacy': 'Privacy',
      '/terms': 'Terms',
    };
    const product = products.find((item) => `/product/${item.slug}` === pathname);
    const collection = collections.find((item) => `/collections/${item.slug}` === pathname);
    const title = product?.name || collection?.name || names[pathname] || 'Page not found';
    document.title = `${title} | NOIR & FORM`;
    const description = product
      ? `${product.name}. ${product.description} A fictional CAD fashion catalog — portfolio demo only.`
      : `${title}. Explore NOIR & FORM, a fictional Toronto fashion house and interactive e-commerce portfolio demo.`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document
      .querySelector('meta[property="og:image"]')
      ?.setAttribute('content', `${window.location.origin}/social-cover.jpg`);
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.append(robots);
    }
    const privateRoute =
      ['/cart', '/checkout', '/wishlist', '/order-confirmation'].includes(pathname) ||
      search ||
      title === 'Page not found';
    robots.content = privateRoute ? 'noindex,follow' : 'index,follow';
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = `${window.location.origin}${pathname}`;
  }, [pathname, search]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Wait for lazy route content to mount; never move focus while typing a search query.
    if (new URLSearchParams(window.location.search).get('focus') === 'search') return;
    const timer = setTimeout(
      () => document.getElementById('main')?.focus({ preventScroll: true }),
      50,
    );
    return () => clearTimeout(timer);
  }, [pathname]);
  return null;
}
class RouteBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <section className="empty-state">
        <h1>A moment to reset.</h1>
        <p>We couldn’t load this page. Your locally saved bag is still available.</p>
        <a className="button" href="/shop">
          Return to the wardrobe
        </a>
      </section>
    ) : (
      this.props.children
    );
  }
}

// ========================================
// APPLICATION ROUTES
// ========================================
export default function App() {
  const { notice, warning, setNotice } = useStore();
  const location = useLocation();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <RouteEffects />
      <Header />
      <main id="main" tabIndex={-1}>
        <RouteBoundary key={location.pathname}>
          <Suspense
            fallback={
              <div className="loading" role="status">
                A moment of consideration…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/:slug" element={<Collections />} />
              <Route path="/product/:slug" element={<Product />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<Confirmation />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {['shipping-returns', 'privacy', 'terms'].map((slug) => (
                <Route key={slug} path={`/${slug}`} element={<Policy />} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </RouteBoundary>
      </main>
      <Footer />
      <div className="sr-only" role="status" aria-live="polite">
        {notice}
      </div>
      {notice && (
        <div className="toast">
          <span>{notice}</span>
          <button aria-label="Dismiss notification" onClick={() => setNotice('')}>
            <X size={17} />
          </button>
        </div>
      )}
      {warning && (
        <div className="storage-warning" role="status">
          {warning}
        </div>
      )}
    </>
  );
}
