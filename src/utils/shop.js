/** Shared commerce rules use integer cents and validate all untrusted browser state. */
import { categories, collections, colors, products, sizes } from '../data/catalog';

// ========================================
// MONEY AND ILLUSTRATIVE TOTALS
// ========================================
export const money = (cents) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(cents / 100);
export const capFor = (variant) => Math.min(10, variant?.stock || 0);
export const getProduct = (id) => products.find((product) => product.id === id);
export function totals(lines) {
  const subtotal = lines.reduce(
    (sum, line) => sum + (getProduct(line.productId)?.priceCents || 0) * line.quantity,
    0,
  );
  const shipping = subtotal === 0 || subtotal >= 25000 ? 0 : 1500;
  // A single fictional 500-basis-point tax is a demo fixture, never an official tax quote.
  const tax = Math.round(((subtotal + shipping) * 500) / 10000);
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}
export function parsePrice(value) {
  if (!/^\d+(\.\d{1,2})?$/.test(String(value))) return null;
  const [whole, fraction = ''] = String(value).split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return Number.isSafeInteger(cents) ? cents : null;
}

// ========================================
// VALIDATED CART AND WISHLIST HYDRATION
// ========================================
export function cleanCart(value) {
  if (!Array.isArray(value)) return [];
  const lines = new Map();
  for (const entry of value.slice(0, 500)) {
    if (!entry || !Number.isInteger(entry.quantity) || entry.quantity <= 0) continue;
    const product = getProduct(entry.productId);
    const variant = product?.variants.find((item) => item.id === entry.variantId);
    if (!capFor(variant)) continue;
    const key = `${product.id}:${variant.id}`;
    const quantity = Math.min(capFor(variant), (lines.get(key)?.quantity || 0) + entry.quantity);
    lines.set(key, { productId: product.id, variantId: variant.id, quantity });
  }
  return [...lines.values()];
}
export const cleanWishlist = (value) =>
  Array.isArray(value) ? [...new Set(value.filter((id) => getProduct(id)))].slice(0, 30) : [];
export function readStored(key, clean, storage = window.localStorage) {
  try {
    const raw = storage.getItem(key);
    if (raw === null) return { items: [], notice: '' };
    const data = JSON.parse(raw);
    if (data?.version !== 1 || !Array.isArray(data.items))
      return { items: [], notice: 'Saved shopping data was reset because its format changed.' };
    const items = clean(data.items);
    return {
      items,
      notice:
        JSON.stringify(items) === JSON.stringify(data.items)
          ? ''
          : 'Saved shopping data was adjusted to match the current demo catalog.',
    };
  } catch {
    return {
      items: [],
      notice: 'Saved shopping data could not be read. You can still shop in this tab.',
    };
  }
}

// ========================================
// COMBINED PRODUCT FILTERING AND SORTING
// ========================================
export function filterProducts(catalog, params) {
  const q = (params.get('q') || '').trim().toLowerCase();
  const min = parsePrice(params.get('min') ?? '');
  const max = parsePrice(params.get('max') ?? '');
  const category = categories.includes(params.get('category')) ? params.get('category') : '';
  const color = colors.some((item) => item.id === params.get('color')) ? params.get('color') : '';
  const size = sizes.includes(params.get('size')) ? params.get('size') : '';
  const collection = collections.some((item) => item.slug === params.get('collection'))
    ? params.get('collection')
    : '';
  const list = catalog.filter(
    (product) =>
      (!q ||
        `${product.name} ${product.category} ${product.description} ${product.tags.join(' ')}`
          .toLowerCase()
          .includes(q)) &&
      (!category || product.category === category) &&
      (!collection || product.collection === collection) &&
      (min === null || product.priceCents >= min) &&
      (max === null || product.priceCents <= max) &&
      ((!color && !size) ||
        product.variants.some(
          (variant) =>
            variant.stock > 0 &&
            (!color || variant.colorId === color) &&
            (!size || variant.size === size),
        )),
  );
  const sort = params.get('sort');
  return list.sort((a, b) => {
    const primary =
      sort === 'price-asc'
        ? a.priceCents - b.priceCents
        : sort === 'price-desc'
          ? b.priceCents - a.priceCents
          : sort === 'name'
            ? a.name.localeCompare(b.name)
            : sort === 'newest'
              ? b.releasedAt.localeCompare(a.releasedAt)
              : a.featuredRank - b.featuredRank;
    return primary || a.id.localeCompare(b.id);
  });
}

// ========================================
// DEMO FORM VALIDATION
// ========================================
export const provinces = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Northwest Territories',
  'Nova Scotia',
  'Nunavut',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Yukon',
];
export function validateForm(values, checkout = false) {
  const errors = {};
  const limits = checkout
    ? { firstName: [1, 80], lastName: [1, 80], street: [1, 120], city: [1, 80] }
    : { name: [1, 80], subject: [1, 120], message: [10, 2000] };
  for (const [field, [min, max]] of Object.entries(limits)) {
    const length = (values[field] || '').trim().length;
    if (length < min || length > max)
      errors[field] = `Please enter ${min === 1 ? '1' : min}–${max} characters.`;
  }
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((values.email || '').trim()) ||
    (values.email || '').length > 254
  )
    errors.email = 'Enter a valid email address.';
  if (checkout) {
    if (!provinces.includes(values.province))
      errors.province = 'Select a Canadian province or territory.';
    if (
      !/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\s?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(
        (values.postal || '').trim(),
      )
    )
      errors.postal = 'Enter a Canadian postal code, such as M5V 2T6.';
    if ((values.unit || '').length > 40) errors.unit = 'Use 40 characters or fewer.';
  }
  return errors;
}
