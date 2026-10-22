/** URL-driven catalog discovery combines available size/color variants and paged presentation. */
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { categories, colors, products, sizes, collections } from '../data/catalog';
import { filterProducts, parsePrice } from '../utils/shop';
import { EmptyState, PageHeading, ProductGrid } from '../components/UI';

// ========================================
// SHARED DESKTOP/MOBILE FILTER FIELDS
// ========================================
function FilterFields({ params, update, prefix }) {
  return (
    <>
      <label htmlFor={`${prefix}-category`}>Category</label>
      <select
        id={`${prefix}-category`}
        value={params.get('category') || ''}
        onChange={(event) => update('category', event.target.value)}
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category}>{category}</option>
        ))}
      </select>
      <label htmlFor={`${prefix}-size`}>Size</label>
      <select
        id={`${prefix}-size`}
        value={params.get('size') || ''}
        onChange={(event) => update('size', event.target.value)}
      >
        <option value="">All sizes</option>
        {sizes.map((size) => (
          <option key={size}>{size}</option>
        ))}
      </select>
      <label htmlFor={`${prefix}-color`}>Color</label>
      <select
        id={`${prefix}-color`}
        value={params.get('color') || ''}
        onChange={(event) => update('color', event.target.value)}
      >
        <option value="">All colors</option>
        {colors.map((color) => (
          <option key={color.id} value={color.id}>
            {color.name}
          </option>
        ))}
      </select>
      <label htmlFor={`${prefix}-collection`}>Collection</label>
      <select
        id={`${prefix}-collection`}
        value={params.get('collection') || ''}
        onChange={(event) => update('collection', event.target.value)}
      >
        <option value="">All collections</option>
        {collections.map((collection) => (
          <option key={collection.slug} value={collection.slug}>
            {collection.name}
          </option>
        ))}
      </select>
      <fieldset className="price-filter">
        <legend>Price range · CAD</legend>
        <label>
          From
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={params.get('min') || ''}
            onChange={(event) => update('min', event.target.value)}
          />
        </label>
        <label>
          To
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="500"
            value={params.get('max') || ''}
            onChange={(event) => update('max', event.target.value)}
          />
        </label>
      </fieldset>
    </>
  );
}
export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [paging, setPaging] = useState({ query: '', count: 12 });
  const [draft, setDraft] = useState(new URLSearchParams(params));
  const query = params.toString();
  const count = paging.query === query ? paging.count : 12;
  const dialog = useRef(null);
  const trigger = useRef(null);
  const search = useRef(null);
  useEffect(() => {
    if (params.get('focus') === 'search') search.current?.focus();
  }, [params]);
  function update(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('focus');
    setParams(next);
  }
  function draftUpdate(key, value) {
    setDraft((previous) => {
      const next = new URLSearchParams(previous);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  }
  const min = parsePrice(params.get('min') ?? '');
  const max = parsePrice(params.get('max') ?? '');
  const invalidPrice =
    (params.get('min') && min === null) ||
    (params.get('max') && max === null) ||
    (min !== null && max !== null && min > max);
  const result = invalidPrice ? [] : filterProducts(products, params);
  const filterCount = [...params.keys()].filter(
    (key) => !['q', 'sort', 'focus'].includes(key),
  ).length;
  return (
    <div className="page-width shop-page">
      <PageHeading eyebrow="THE NOIR & FORM WARDROBE" title="Considered pieces.">
        A quieter statement. Discover shapes and textures for the way you move.
      </PageHeading>
      <div className="shop-categories">
        <button
          className={!params.get('category') ? 'active' : ''}
          onClick={() => update('category', '')}
        >
          All pieces
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={params.get('category') === category ? 'active' : ''}
            onClick={() => update('category', category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="shop-toolbar">
        <div className="search-field">
          <Search size={18} />
          <input
            ref={search}
            aria-label="Search products"
            type="search"
            placeholder="Find your next considered piece…"
            value={params.get('q') || ''}
            onChange={(event) => update('q', event.target.value)}
          />
        </div>
        <button
          className="mobile-filter button-outline"
          ref={trigger}
          onClick={() => {
            setDraft(new URLSearchParams(params));
            dialog.current.showModal();
          }}
        >
          <SlidersHorizontal size={16} /> Filters {filterCount > 0 && `(${filterCount})`}
        </button>
        <label className="sort-label">
          Sort by
          <select
            value={params.get('sort') || 'featured'}
            onChange={(event) => update('sort', event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </label>
      </div>
      <div className="shop-layout">
        <aside className="filter-sidebar" aria-label="Product filters">
          <div className="filter-title">
            <span>Refine your edit</span>
            <SlidersHorizontal size={16} />
          </div>
          <FilterFields params={params} update={update} prefix="desktop" />
          <button className="text-link" onClick={() => setParams({})}>
            Reset all filters <X size={14} />
          </button>
          <p className="filter-footnote">
            Fictional pieces, real possibilities.
            <br />
            All prices in Canadian dollars.
          </p>
        </aside>
        <div className="shop-results">
          <div className="result-count" role="status">
            {result.length} considered {result.length === 1 ? 'piece' : 'pieces'}
            {filterCount > 0 && <button onClick={() => setParams({})}>Clear filters</button>}
          </div>
          {invalidPrice && (
            <p className="form-error" role="alert">
              Enter valid positive prices with up to two decimals, and a maximum at least as large
              as the minimum.
            </p>
          )}
          {result.length ? (
            <>
              <ProductGrid products={result.slice(0, count)} eager />
              <div className="load-more">
                <p>
                  Showing {Math.min(count, result.length)} of {result.length} pieces
                </p>
                {count < result.length && (
                  <button
                    className="button-outline"
                    onClick={() => setPaging({ query, count: count + 12 })}
                  >
                    Discover more pieces
                  </button>
                )}
              </div>
            </>
          ) : (
            <EmptyState title="A little room to reconsider." action="Reset the edit" to="/shop">
              No pieces match this combination. Try a different search or clear your filters.
            </EmptyState>
          )}
        </div>
      </div>
      <dialog
        ref={dialog}
        className="filter-dialog"
        aria-labelledby="filter-title"
        onClose={() => trigger.current?.focus()}
      >
        <div className="dialog-top">
          <h2 id="filter-title">Refine your edit</h2>
          <button
            className="icon-button"
            aria-label="Close filters"
            onClick={() => dialog.current.close()}
          >
            <X />
          </button>
        </div>
        <FilterFields params={draft} update={draftUpdate} prefix="mobile" />
        <div className="filter-actions">
          <button className="button-outline" onClick={() => setDraft(new URLSearchParams())}>
            Reset
          </button>
          <button
            className="button"
            onClick={() => {
              setParams(draft);
              dialog.current.close();
            }}
          >
            Apply filters
          </button>
        </div>
      </dialog>
    </div>
  );
}
