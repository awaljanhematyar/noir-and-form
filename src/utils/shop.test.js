/** Regression tests exercise catalog invariants and meaningful shopping boundary conditions. */
import { describe, expect, it } from 'vitest';
import { products } from '../data/catalog';
import {
  cleanCart,
  cleanWishlist,
  filterProducts,
  parsePrice,
  readStored,
  totals,
  validateForm,
} from './shop';

// ========================================
// CATALOG AND MONEY INVARIANTS
// ========================================
describe('fictional catalog', () => {
  it('contains 30 complete unique records with coherent variant stock', () => {
    expect(products).toHaveLength(30);
    expect(new Set(products.map((product) => product.id)).size).toBe(30);
    expect(new Set(products.map((product) => product.slug)).size).toBe(30);
    for (const product of products) {
      expect(product.currency).toBe('CAD');
      expect(Number.isInteger(product.priceCents)).toBe(true);
      expect(product.tags.length).toBeGreaterThan(0);
      expect(product.images.length).toBeGreaterThan(1);
      expect(new Set(product.variants.map((item) => item.id)).size).toBe(product.variants.length);
      expect(
        product.variants.every(
          (item) =>
            product.colors.some((color) => color.id === item.colorId) &&
            Number.isInteger(item.stock) &&
            item.stock >= 0,
        ),
      ).toBe(true);
    }
  });
});
describe('illustrative totals', () => {
  const shirt = products[3]; // $125 means two units hit the free-shipping threshold exactly.
  const line = (quantity) => [{ productId: shirt.id, variantId: shirt.variants[1].id, quantity }];
  it('does not charge an empty bag', () =>
    expect(totals([])).toEqual({ subtotal: 0, shipping: 0, tax: 0, total: 0 }));
  it('applies shipping below $250 and flat demo tax to subtotal plus shipping', () =>
    expect(totals(line(1))).toEqual({ subtotal: 12500, shipping: 1500, tax: 700, total: 14700 }));
  it('removes shipping at the exact threshold', () =>
    expect(totals(line(2))).toEqual({ subtotal: 25000, shipping: 0, tax: 1250, total: 26250 }));
  it('parses decimal prices safely without allowing exponents or partial values', () => {
    expect(parsePrice('12.05')).toBe(1205);
    expect(parsePrice('0')).toBe(0);
    for (const value of ['1e3', '-2', '4.555', 'abc', '', 'Infinity'])
      expect(parsePrice(value)).toBeNull();
  });
});

// ========================================
// CORRUPTED AND STALE PERSISTENCE
// ========================================
describe('storage reconciliation', () => {
  const product = products[0];
  const variant = product.variants.find((item) => item.stock === 8);
  it('merges identical variants, caps demo stock, and drops unknown or noninteger data', () => {
    const good = { productId: product.id, variantId: variant.id, quantity: 6 };
    expect(
      cleanCart([
        good,
        good,
        { ...good, variantId: 'missing' },
        { ...good, quantity: -4 },
        { ...good, quantity: 1.3 },
        null,
      ]),
    ).toEqual([{ ...good, quantity: 8 }]);
  });
  it('removes sold-out variants and deduplicates wishlist records', () => {
    expect(
      cleanCart([
        { productId: products[29].id, variantId: products[29].variants[0].id, quantity: 1 },
      ]),
    ).toEqual([]);
    expect(cleanWishlist([product.id, product.id, 'unknown', null])).toEqual([product.id]);
  });
  it('recovers from invalid JSON, unsupported versions, and denied reads', () => {
    expect(readStored('test', cleanCart, { getItem: () => '{bad' }).items).toEqual([]);
    expect(
      readStored('test', cleanCart, { getItem: () => '{"version":2,"items":[]}' }).notice,
    ).toContain('reset');
    expect(
      readStored('test', cleanCart, {
        getItem: () => {
          throw new Error('denied');
        },
      }).notice,
    ).toContain('could not be read');
  });
});
describe('combined discovery', () => {
  it('combines search, inclusive prices, category and joint available size/color', () => {
    const result = filterProducts(
      products,
      new URLSearchParams({
        q: 'COAT',
        category: 'Outerwear',
        min: '300',
        max: '400',
        color: 'noir',
        size: 'M',
        sort: 'price-asc',
      }),
    );
    expect(result.length).toBeGreaterThan(0);
    expect(
      result.every(
        (product) =>
          product.name.toLowerCase().includes('coat') &&
          product.priceCents >= 30000 &&
          product.priceCents <= 40000 &&
          product.variants.some(
            (variant) => variant.colorId === 'noir' && variant.size === 'M' && variant.stock > 0,
          ),
      ),
    ).toBe(true);
    expect(result.map((product) => product.priceCents)).toEqual(
      result.map((product) => product.priceCents).sort((a, b) => a - b),
    );
  });
  it('does not return a sold-out size/color pair even when other variants exist', () =>
    expect(
      filterProducts([products[0]], new URLSearchParams({ size: 'XS', color: 'noir' })),
    ).toEqual([]));
  it('ignores unknown URL filter values safely', () =>
    expect(
      filterProducts(
        products,
        new URLSearchParams({
          category: 'invalid',
          size: 'XXXL',
          color: 'missing',
          collection: 'missing',
          sort: 'invalid',
        }),
      ),
    ).toHaveLength(30));
});
describe('local-only form validation', () => {
  it('accepts a valid fictional Canadian delivery and rejects invalid province/postal/email', () => {
    const values = {
      firstName: 'Demo',
      lastName: 'Guest',
      email: 'demo@example.com',
      street: '123 Example Street',
      city: 'Toronto',
      province: 'Ontario',
      postal: 'M5V 2T6',
    };
    expect(validateForm(values, true)).toEqual({});
    expect(
      validateForm(
        { ...values, postal: '12345', province: 'California', email: 'not-email' },
        true,
      ),
    ).toHaveProperty('postal');
    expect(validateForm({ ...values, province: 'California' }, true)).toHaveProperty('province');
  });
  it('rejects whitespace-only names and undersized contact messages', () =>
    expect(
      validateForm({ name: '  ', email: 'demo@example.com', subject: 'Hello', message: 'Short' }),
    ).toMatchObject({ name: expect.any(String), message: expect.any(String) }));
});
