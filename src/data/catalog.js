/** Fictional catalog: stable product/variant identifiers and editorial image references. */

// ========================================
// CATALOG TAXONOMY
// ========================================
export const categories = ['Outerwear', 'Knitwear', 'Tailoring', 'Essentials'];
export const sizes = ['XS', 'S', 'M', 'L', 'XL'];
export const colors = [
  { id: 'noir', name: 'Noir', hex: '#252525' },
  { id: 'sand', name: 'Sand', hex: '#c7b9a6' },
  { id: 'ivory', name: 'Ivory', hex: '#eeeae1' },
  { id: 'olive', name: 'Olive', hex: '#727b65' },
];
export const collections = [
  {
    slug: 'the-city-edit',
    name: 'The City Edit',
    subtitle: 'A softer kind of structure.',
    description:
      'Quietly confident layers for the rhythm of the city. Tailored lines, tactile fabrics, and the freedom to make them your own.',
    image: '/images/editorial-city.jpg',
    categories: ['Tailoring', 'Outerwear'],
  },
  {
    slug: 'slow-mornings',
    name: 'Slow Mornings',
    subtitle: 'Space to just be.',
    description:
      'Soft textures and unhurried silhouettes. A considered selection of knits and everyday pieces, made for your own pace.',
    image: '/images/editorial-soft.jpg',
    categories: ['Knitwear', 'Essentials'],
  },
  {
    slug: 'essential-forms',
    name: 'Essential Forms',
    subtitle: 'The beauty in less.',
    description:
      'The pieces you return to. An exploration of proportion, simplicity, and a wardrobe that feels like you.',
    image: '/images/editorial-form.jpg',
    categories: ['Essentials', 'Tailoring'],
  },
];

// ========================================
// FICTIONAL PRODUCT RECORDS
// ========================================
const records = [
  [
    'The Sculpted Coat',
    'Outerwear',
    385,
    'wool-blend',
    'A generous silhouette, a beautifully defined shoulder. Our signature coat brings a sense of ease to colder days.',
  ],
  [
    'The Everyday Knit',
    'Knitwear',
    145,
    'cotton-knit',
    'A tactile rib, a relaxed neckline, a shape that moves with you. An everyday piece with an unexpected softness.',
  ],
  [
    'The Column Trouser',
    'Tailoring',
    175,
    'tailored',
    'A long, fluid line with a gently structured waist. The foundation of a considered wardrobe.',
  ],
  [
    'The Essential Shirt',
    'Essentials',
    125,
    'cotton',
    'Crisp cotton meets a loose, effortless fit. A familiar form, thoughtfully reconsidered.',
  ],
  ['The Wrap Coat', 'Outerwear', 425, 'wool-blend'],
  ['The Ribbed Cardigan', 'Knitwear', 165, 'cotton-knit'],
  ['The Relaxed Blazer', 'Tailoring', 265, 'tailored'],
  ['The Organic Tee', 'Essentials', 65, 'cotton'],
  ['The Trench', 'Outerwear', 325, 'cotton'],
  ['The Soft Rollneck', 'Knitwear', 155, 'cotton-knit'],
  ['The Pleated Trouser', 'Tailoring', 185, 'tailored'],
  ['The Longline Shirt', 'Essentials', 135, 'cotton'],
  ['The Studio Jacket', 'Outerwear', 245, 'cotton'],
  ['The Fine Gauge Crew', 'Knitwear', 125, 'cotton-knit'],
  ['The Double-Breasted Blazer', 'Tailoring', 295, 'tailored'],
  ['The Ribbed Tank', 'Essentials', 55, 'cotton'],
  ['The Cocoon Coat', 'Outerwear', 395, 'wool-blend'],
  ['The Textured Vest', 'Knitwear', 115, 'cotton-knit'],
  ['The Straight Trouser', 'Tailoring', 165, 'tailored'],
  ['The Poplin Tunic', 'Essentials', 145, 'cotton'],
  ['The Cropped Jacket', 'Outerwear', 225, 'cotton'],
  ['The Open Collar Knit', 'Knitwear', 155, 'cotton-knit'],
  ['The Tailored Waistcoat', 'Tailoring', 155, 'tailored'],
  ['The Long Sleeve Tee', 'Essentials', 75, 'cotton'],
  ['The Transit Coat', 'Outerwear', 355, 'wool-blend'],
  ['The Cable Sweater', 'Knitwear', 185, 'cotton-knit'],
  ['The Fluid Skirt', 'Tailoring', 165, 'tailored'],
  ['The Weekend Shirt', 'Essentials', 115, 'cotton'],
  ['The Light Layer', 'Outerwear', 195, 'cotton'],
  ['The Slouch Knit', 'Knitwear', 175, 'cotton-knit'],
];
const materials = {
  'wool-blend': '70% wool, 30% recycled polyester (fictional composition)',
  'cotton-knit': '100% cotton (fictional composition)',
  tailored: '65% viscose, 35% polyester (fictional composition)',
  cotton: '100% cotton (fictional composition)',
};
// Match editorial references to garment categories; exact pieces and colorways remain fictional.
const imagePools = {
  Outerwear: [1, 7, 9, 10, 13],
  Knitwear: [2, 6, 14],
  Tailoring: [3, 11, 5, 15],
  Essentials: [4, 8, 12],
};

export const products = records.map(([name, category, price, fabric, description], index) => {
  const id = `nf-${String(index + 1).padStart(3, '0')}`;
  const productColors = [colors[index % 4], colors[(index + 1) % 4]];
  const pool = imagePools[category];
  const image = `/images/product-${String(pool[Math.floor(index / 4) % pool.length]).padStart(2, '0')}.jpg`;
  return {
    id,
    slug: name.toLowerCase().replaceAll(' ', '-'),
    name,
    category,
    categoryId: category.toLowerCase(),
    collection: collections[index % 3].slug,
    priceCents: price * 100,
    currency: 'CAD',
    description:
      description ||
      'Considered proportions. A quietly distinctive shape. A versatile layer for days that move between the familiar and the unexpected.',
    material: materials[fabric],
    care:
      fabric === 'wool-blend' || fabric === 'tailored'
        ? 'Professional dry clean recommended.'
        : 'Gentle cold wash. Reshape and dry flat.',
    tags: [fabric, index < 8 ? 'new-arrival' : 'signature', 'fictional'],
    releasedAt: `2026-09-${String(30 - index).padStart(2, '0')}`,
    featuredRank: index,
    colors: productColors,
    images: [
      {
        src: image,
        alt: `Editorial styling reference for ${name}; illustrative photography`,
        position: 'center',
        label: 'Editorial view',
      },
      {
        src: image,
        alt: `Closer illustrative crop for ${name}; not a separate garment photograph`,
        position: '50% 25%',
        label: 'Detail crop',
        crop: true,
      },
      {
        src: image,
        alt: `Texture-focused illustrative crop for ${name}`,
        position: '50% 65%',
        label: 'Texture crop',
        crop: true,
      },
    ],
    variants: productColors.flatMap((color) =>
      sizes.map((size, sizeIndex) => ({
        id: `${id}-${color.id}-${size.toLowerCase()}`,
        colorId: color.id,
        size,
        stock: index === 29 || (index % 7 === 0 && sizeIndex === 0) ? 0 : sizeIndex === 4 ? 2 : 8,
      })),
    ),
  };
});
export const findProduct = (slug) => products.find((product) => product.slug === slug);
