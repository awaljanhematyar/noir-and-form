/** Brand storytelling, local-only contact, truthful demo policies, and missing-route recovery. */
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ActionLink, EmptyState, PageHeading, Photo } from '../components/UI';
import DemoForm from '../components/DemoForm';

export function About() {
  return (
    <>
      <section className="about-opening page-width">
        <p className="eyebrow">THE STORY BEHIND THE FORM</p>
        <h1>
          A little less noise.
          <br />
          <i>A little more meaning.</i>
        </h1>
        <p>
          NOIR & FORM is a fictional Toronto fashion house.
          <br />
          An exploration of what happens when you give the everyday a little more thought.
        </p>
      </section>
      <div className="about-image">
        <Photo
          src="/images/editorial-form.jpg"
          sizes="100vw"
          alt="Quiet editorial fashion styling in neutral tones"
          eager
          width="1600"
          height="900"
        />
        <span>AN INDEPENDENT FASHION CONCEPT / TORONTO, CANADA</span>
      </div>
      <section className="about-story page-width">
        <p className="eyebrow">OUR POINT OF VIEW</p>
        <div>
          <h2>
            Fewer pieces.
            <br />
            More <i>possibility.</i>
          </h2>
          <p>
            We imagine a wardrobe that asks less of you. Pieces that feel familiar on the first
            wear, yet reveal something new over time. Forms that offer structure without
            restriction.
          </p>
          <p>
            Rooted in the contrasts of Toronto — the pace and the pause, the architecture and the
            open sky — this concept brings an editorial sensibility to everyday dressing.
          </p>
          <p>
            This brand and its catalog are fictional. The experience was created to explore
            thoughtful design and front-end engineering, rather than to sell garments or make
            manufacturing claims.
          </p>
          <ActionLink to="/collections">Explore our perspective</ActionLink>
        </div>
      </section>
      <section className="values-section">
        <div className="page-width values-grid">
          {[
            [
              '01',
              'Intentional form',
              'Proportion, texture, and the details that make a simple piece feel considered.',
            ],
            [
              '02',
              'Everyday expression',
              'A wardrobe that makes space for your own point of view.',
            ],
            [
              '03',
              'Honest by design',
              'A fictional concept, clearly presented. No invented endorsements or impact claims.',
            ],
          ].map(([number, title, text]) => (
            <article key={number}>
              <span className="eyebrow">{number} / OUR VALUES</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
export function Contact() {
  return (
    <div className="page-width contact-page">
      <PageHeading eyebrow="A CONVERSATION STARTS HERE" title="Let’s make a connection.">
        Questions, ideas, a new perspective. There’s always room for a thoughtful conversation.
      </PageHeading>
      <div className="contact-layout">
        <aside>
          <p className="eyebrow">CLIENT CARE / DEMO</p>
          <h2>
            A little
            <br />
            human connection.
          </h2>
          <p>
            This is a portfolio concept, so there is no customer service inbox or physical store.
            Explore the form with fictional details to see its validation and feedback.
          </p>
          <div className="contact-location">
            <span>Our imagined home</span>
            <strong>Toronto, Canada</strong>
            <span>Independent fashion concept</span>
          </div>
          <Link className="text-link" to="/shipping-returns">
            About shipping & returns <ArrowUpRight size={16} />
          </Link>
        </aside>
        <DemoForm />
      </div>
    </div>
  );
}

// ========================================
// TRUTHFUL INFORMATIONAL DEMO POLICIES
// ========================================
const policies = {
  '/shipping-returns': {
    title: 'Shipping & returns.',
    eyebrow: 'A NOTE ON THIS DEMO',
    sections: [
      [
        'No goods are shipped',
        'NOIR & FORM is a fictional e-commerce portfolio demo. No products are sold, reserved, shipped, exchanged, or refunded. Demo inventory is illustrative and does not reflect real stock.',
      ],
      [
        'Illustrative Canadian delivery',
        'Checkout accepts Canadian address formats only. Use fictional details. The demo uses a sample CAD $15 shipping charge below a $250 merchandise subtotal and no shipping charge from $250. A flat illustrative 5% tax is calculated on merchandise plus shipping, rounded to the nearest cent. These are design fixtures, not official rates, legal guidance, or a real delivery promise.',
      ],
      [
        'Returns and exchanges',
        'There are no real transactions, so no real returns process or return entitlement is created here. The demo does not request card information or issue payment receipts.',
      ],
      [
        'Explore with confidence',
        'Your bag and wishlist are stored in your browser. Checkout details are not persisted or sent to a fulfillment service. Demo confirmation disappears when the page is refreshed.',
      ],
    ],
  },
  '/privacy': {
    title: 'Privacy, considered.',
    eyebrow: 'DEMO DATA PRACTICES',
    sections: [
      [
        'What this demo stores',
        'This site stores validated cart product/variant IDs, quantities, and wishlist product IDs in LocalStorage under the noir-form project keys. This keeps your edit available in the same browser. There are no accounts or cross-device synchronization.',
      ],
      [
        'Forms stay local',
        'Contact and checkout form fields are used only for local validation and are not intentionally transmitted to a message or order service. They are not written to LocalStorage. Use fictional details when testing. Confirmation contains no delivery details and is held only in memory.',
      ],
      [
        'Hosting and assets',
        'Images and fonts are served as site assets. The hosting provider may process ordinary request and security logs. This demo does not add advertising trackers or analytics. This page describes the implementation; it is not legal advice or a production privacy compliance certification.',
      ],
      [
        'Your control',
        'Clear this site’s browser storage to remove your bag and wishlist. Doing so does not alter other websites. Denied storage leaves shopping available in memory for the current tab.',
      ],
    ],
  },
  '/terms': {
    title: 'Terms of exploration.',
    eyebrow: 'A FICTIONAL BRAND. A REAL DEMO.',
    sections: [
      [
        'A portfolio concept',
        'NOIR & FORM is a fictional Toronto fashion brand created to demonstrate design and front-end development. Names, catalog descriptions, materials, prices, variants, and inventory are fictional.',
      ],
      [
        'No commercial transaction',
        'Every checkout is simulated. No payment-card details are requested, no payment is processed, and no order is fulfilled. Contact submissions do not send messages. No seller contract, real shipping offer, or commercial guarantee is represented.',
      ],
      [
        'Editorial imagery',
        'Licensed stock photographs are editorial references and do not necessarily show the exact fictional piece, composition, size, or selected color. Gallery detail views may be crops of the primary image. No model or photographer endorsement is implied.',
      ],
      [
        'Availability and limitations',
        'Browser-local state can be edited or cleared. This static demo is provided for exploration, without a backend or production commerce guarantees. These explanatory terms are not a substitute for legal review of a real store.',
      ],
    ],
  },
};
export function Policy() {
  const { pathname } = useLocation();
  const policy = policies[pathname];
  return (
    <article className="page-width policy-page">
      <PageHeading eyebrow={policy.eyebrow} title={policy.title}>
        Clear expectations for a considered digital experience.
      </PageHeading>
      <div className="policy-body">
        {policy.sections.map(([title, body], index) => (
          <section key={title}>
            <span className="eyebrow">0{index + 1}</span>
            <div>
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          </section>
        ))}
        <Link className="text-link" to="/contact">
          Explore the contact demo <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
}
export function NotFound() {
  return (
    <div className="page-width not-found">
      <p className="eyebrow">404 / A DIFFERENT DIRECTION</p>
      <h1>
        Some things
        <br />
        are <i>yet to take form.</i>
      </h1>
      <EmptyState title="Let’s find your way back." to="/" action="Return home">
        This page isn’t part of our collection. A new perspective is just a click away.
      </EmptyState>
    </div>
  );
}
