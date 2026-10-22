/** Collection index and individual editorial edits share the approved catalog taxonomy. */
import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { collections, products } from '../data/catalog';
import { ActionLink, EmptyState, PageHeading, Photo, ProductGrid } from '../components/UI';

// ========================================
// COLLECTION INDEX AND EDITORIAL DETAIL
// ========================================
export default function Collections() {
  const { slug } = useParams();
  const collection = collections.find((item) => item.slug === slug);
  if (slug && !collection)
    return (
      <div className="page-width">
        <h1 className="sr-only">Collection not found</h1>
        <EmptyState
          title="An edit yet to be imagined."
          to="/collections"
          action="Explore the collections"
        >
          This collection is not available.
        </EmptyState>
      </div>
    );
  if (collection)
    return (
      <>
        <section className="collection-hero">
          <Photo
            src={collection.image}
            sizes="(max-width: 767px) 100vw, 50vw"
            alt={`Editorial reference for ${collection.name}`}
            eager
            width="1200"
            height="900"
          />
          <div>
            <p className="eyebrow">THE NOIR & FORM COLLECTIONS</p>
            <h1>{collection.name}</h1>
            <p className="collection-subtitle">{collection.subtitle}</p>
            <p>{collection.description}</p>
            <ActionLink to={`/shop?collection=${collection.slug}`}>Shop the edit</ActionLink>
          </div>
        </section>
        <section className="section page-width">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE PIECES</p>
              <h2>A point of view.</h2>
            </div>
            <Link className="text-link" to="/collections">
              All collections <ArrowUpRight size={17} />
            </Link>
          </div>
          <ProductGrid products={products.filter((item) => item.collection === collection.slug)} />
        </section>
      </>
    );
  return (
    <div className="page-width">
      <PageHeading eyebrow="THREE PERSPECTIVES. ONE PHILOSOPHY." title="The collections.">
        Distinct points of view. United by a belief that less can say so much more.
      </PageHeading>
      <div className="collection-list">
        {collections.map((item, index) => (
          <Link className="collection-tile" key={item.slug} to={`/collections/${item.slug}`}>
            <Photo
              src={item.image}
              alt={`Editorial reference for ${item.name}`}
              width="700"
              height="900"
            />
            <div>
              <span className="eyebrow">COLLECTION 0{index + 1}</span>
              <h2>{item.name}</h2>
              <p>{item.subtitle}</p>
              <span className="text-link">
                Discover the edit <ArrowUpRight size={17} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
