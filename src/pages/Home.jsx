/** Editorial homepage introduces the fictional label, collections, and new arrivals. */
import { ArrowDown, ArrowUpRight, MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ActionLink, Photo, ProductGrid } from '../components/UI';
import { products } from '../data/catalog';

export default function Home() {
  return (
    <>
      {/* ========================================
        EDITORIAL OPENING
        ======================================== */}
      <section className="hero">
        <Photo
          className="hero-image"
          src="/images/hero.jpg"
          alt="Editorial fashion portrait in warm neutral tones"
          eager
          width="1600"
          height="1100"
        />
        <div className="hero-shade" />
        <div className="hero-topline">
          <span>THE NEW PERSPECTIVE</span>
          <span>COLLECTION 01 / 2026</span>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Less, but considered.</p>
          <h1>
            Quiet forms.
            <br />
            <i>Lasting presence.</i>
          </h1>
          <p>
            A wardrobe of intention. Refined silhouettes,
            <br className="desktop-break" /> tactile textures, and the freedom to be yourself.
          </p>
          <ActionLink to="/shop" light>
            Explore the collection
          </ActionLink>
        </div>
        <div className="hero-bottom">
          <span>Designed with intention. Worn with ease.</span>
          <a href="#new-arrivals" aria-label="Discover new arrivals below">
            <ArrowDown size={18} />
          </a>
          <span>01 — 03</span>
        </div>
        <div className="hero-caption">
          <span>THE ART OF EVERYDAY</span>
          <span>NOIR & FORM / TORONTO</span>
        </div>
      </section>
      <div className="brand-strip">
        <span>CONSIDERED DESIGN</span>
        <span className="strip-dot">✦</span>
        <span>ENDURING SILHOUETTES</span>
        <span className="strip-dot">✦</span>
        <span>EVERYDAY EXPRESSION</span>
        <span className="strip-dot">✦</span>
        <span>LESS, BUT BETTER</span>
      </div>

      {/* ========================================
        CURATED PRODUCT DISCOVERY
        ======================================== */}
      <section id="new-arrivals" className="section page-width">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A NEW SEASON OF SIMPLICITY</p>
            <h2>The considered edit.</h2>
          </div>
          <Link className="text-link" to="/shop?sort=newest">
            View all pieces <ArrowUpRight size={17} />
          </Link>
        </div>
        <ProductGrid products={products.slice(0, 4)} />
      </section>
      <section className="collection-story">
        <div className="collection-story-image">
          <Photo
            src="/images/editorial-city.jpg"
            sizes="(max-width: 767px) 100vw, 50vw"
            alt="Neutral city styling, an editorial reference for the City Edit"
            width="1000"
            height="1200"
          />
          <span className="image-note">A STUDY IN EVERYDAY ELEGANCE</span>
        </div>
        <div className="collection-story-copy">
          <p className="eyebrow">THE CITY EDIT / COLLECTION 01</p>
          <h2>
            Made for
            <br />
            your <i>everyday.</i>
          </h2>
          <p>
            Between the places you go and the moments you keep. Discover considered layers that
            bring a quiet confidence to the everyday.
          </p>
          <ActionLink to="/collections/the-city-edit">Discover the edit</ActionLink>
          <span className="story-number">
            01 <span>/ THE COLLECTIONS</span>
          </span>
        </div>
      </section>
      <section className="section page-width">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FIND YOUR FORM</p>
            <h2>A wardrobe, refined.</h2>
          </div>
          <span className="section-side-note">
            Intentional pieces.
            <br />
            Infinite possibilities.
          </span>
        </div>
        <div className="category-grid">
          {[
            ['Outerwear', '/images/product-01.jpg', 'The art of layering'],
            ['Knitwear', '/images/product-02.jpg', 'A softer perspective'],
            ['Tailoring', '/images/product-03.jpg', 'Structure, reimagined'],
          ].map(([category, image, subtitle]) => (
            <Link key={category} to={`/shop?category=${category}`} className="category-card">
              <Photo
                src={image}
                alt={`Illustrative ${category.toLowerCase()} editorial`}
                width="600"
                height="800"
              />
              <div>
                <div>
                  <small>{subtitle}</small>
                  <h3>{category}</h3>
                </div>
                <ArrowUpRight size={25} />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="brand-manifesto">
        <p className="eyebrow">THE NOIR & FORM PHILOSOPHY</p>
        <h2>
          Not more. <i>More considered.</i>
        </h2>
        <p>
          We believe the most meaningful pieces are the ones you return to.
          <br />
          An exploration of form, feeling, and a little less noise.
        </p>
        <Link className="text-link" to="/about">
          The story behind the form <MoveRight size={20} />
        </Link>
        <span className="manifesto-mark" aria-hidden="true">
          N/F
        </span>
      </section>
    </>
  );
}
