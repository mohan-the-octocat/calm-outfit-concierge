export const steps = [
  {
    prompt: 'I am...',
    key: 'identity',
    options: ['Woman', 'Man', 'Non-binary', 'Shopping for someone else'],
  },
  {
    prompt: 'I need...',
    key: 'occasion',
    options: [
      'Wedding guest look',
      'Boardroom ready',
      'Brunch smart-casual',
      'Evening cocktail',
      'Summer resort',
      'Festive Indian wear',
    ],
  },
  {
    prompt: 'I like...',
    key: 'vibe',
    options: [
      'Minimal and tailored',
      'Bold colors',
      'Monochrome luxe',
      'Crafted textiles',
      'Understated with a statement accessory',
      'Comfort first',
    ],
  },
];

export const catalog = [
  {
    id: 'sku-1',
    title: 'Champagne silk kurta set',
    tag: 'Festive Indian wear',
    vibe: 'Understated with a statement accessory',
    price: 'Rs 14,500',
    promo: 'Festive offer: 10% off',
    sizes: ['S', 'M', 'L'],
    unavailableSizes: ['XL'],
    stores: ['Mumbai', 'Pune'],
    returnPolicy: 'Exchange eligible',
    checkoutUrl: '/checkout?item=sku-1',
    hero: true,
    inventoryStatus: 'limited',
    freshness: 'New this week',
    fulfillment: [
      { type: 'pickup', label: 'Pickup', etaHours: 2, cutoff: '21:00', timezone: 'Asia/Kolkata' },
      { type: 'shipping', label: 'Express', etaHours: 8, cutoff: '18:00', timezone: 'Asia/Kolkata' },
      { type: 'shipping', label: 'Standard', etaHours: 48, cutoff: '23:59', timezone: 'Asia/Kolkata' },
    ],
  },
  {
    id: 'sku-2',
    title: 'Midnight linen bandhgala',
    tag: 'Evening cocktail',
    vibe: 'Minimal and tailored',
    price: 'Rs 18,900',
    promo: null,
    sizes: ['M', 'L', 'XL'],
    unavailableSizes: ['S'],
    stores: ['Delhi'],
    returnPolicy: 'Final Sale',
    checkoutUrl: '/checkout?item=sku-2',
    hero: true,
    inventoryStatus: 'available',
    freshness: null,
    fulfillment: [
      { type: 'pickup', label: 'Pickup', etaHours: 3, cutoff: '20:00', timezone: 'Asia/Kolkata' },
      { type: 'shipping', label: 'Same-day', etaHours: 12, cutoff: '16:00', timezone: 'Asia/Kolkata' },
    ],
  },
  {
    id: 'sku-3',
    title: 'Ivory chikankari saree',
    tag: 'Wedding guest look',
    vibe: 'Crafted textiles',
    price: 'Rs 22,000',
    promo: 'Wedding season credit applied',
    sizes: ['One size'],
    unavailableSizes: [],
    stores: ['Lucknow', 'Delhi'],
    returnPolicy: 'Exchange eligible',
    checkoutUrl: '/checkout?item=sku-3',
    hero: false,
    inventoryStatus: 'available',
    freshness: 'Bestseller',
    fulfillment: [
      { type: 'pickup', label: 'Pickup', etaHours: 4, cutoff: '22:00', timezone: 'Asia/Kolkata' },
      { type: 'shipping', label: 'Express', etaHours: 18, cutoff: '19:00', timezone: 'Asia/Kolkata' },
    ],
  },
  {
    id: 'sku-4',
    title: 'Charcoal Italian suit',
    tag: 'Boardroom ready',
    vibe: 'Minimal and tailored',
    price: 'Rs 32,000',
    promo: null,
    sizes: ['M', 'L'],
    unavailableSizes: ['S', 'XL'],
    stores: ['Bangalore'],
    returnPolicy: 'Exchange eligible',
    checkoutUrl: '/checkout?item=sku-4',
    hero: false,
    inventoryStatus: 'limited',
    freshness: null,
    fulfillment: [
      { type: 'shipping', label: 'Same-day', etaHours: 10, cutoff: '15:00', timezone: 'Asia/Kolkata' },
      { type: 'shipping', label: 'Standard', etaHours: 30, cutoff: '23:59', timezone: 'Asia/Kolkata' },
    ],
  },
  {
    id: 'sku-5',
    title: 'Terracotta co-ord set',
    tag: 'Brunch smart-casual',
    vibe: 'Bold colors',
    price: 'Rs 9,800',
    promo: 'Buy 2 save more',
    sizes: ['S', 'M', 'L', 'XL'],
    unavailableSizes: [],
    stores: ['Hyderabad'],
    returnPolicy: 'Exchange eligible',
    checkoutUrl: '/checkout?item=sku-5',
    hero: false,
    inventoryStatus: 'available',
    freshness: 'Just in',
    fulfillment: [
      { type: 'pickup', label: 'Pickup', etaHours: 6, cutoff: '19:00', timezone: 'Asia/Kolkata' },
      { type: 'shipping', label: 'Express', etaHours: 20, cutoff: '20:00', timezone: 'Asia/Kolkata' },
    ],
  },
  {
    id: 'sku-6',
    title: 'Sea-foam resort dress',
    tag: 'Summer resort',
    vibe: 'Comfort first',
    price: 'Rs 11,400',
    promo: null,
    sizes: ['S', 'M'],
    unavailableSizes: ['L'],
    stores: ['Goa'],
    returnPolicy: 'Exchange eligible',
    checkoutUrl: '/checkout?item=sku-6',
    hero: false,
    inventoryStatus: 'available',
    freshness: null,
    fulfillment: [
      { type: 'shipping', label: 'Standard', etaHours: 40, cutoff: '22:00', timezone: 'Asia/Kolkata' },
    ],
  },
];

export function isValidImageUrl(url) {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return /https?:/.test(parsed.protocol) && /\.(jpg|jpeg|png|webp)$/i.test(parsed.pathname);
  } catch {
    return false;
  }
}

export function filterCatalog(items, selections) {
  const filtered = items.filter((item) => item.vibe === selections.vibe || item.tag === selections.occasion);
  return filtered.length ? filtered : items.slice(0, 6);
}

export function limitHero(items, maxHero = 2) {
  let used = 0;
  return items.map((item) => {
    if (!item.hero) return item;
    used += 1;
    return { ...item, hero: used <= maxHero };
  });
}

export function getArrivalLabel(option, now = new Date()) {
  const [hour, minute] = option.cutoff.split(':').map(Number);
  const cutoff = new Date(now);
  cutoff.setHours(hour, minute, 0, 0);
  if (now > cutoff) {
    return `${option.label}: next window`;
  }
  if (option.etaHours <= 4) return `${option.label}: today`;
  if (option.etaHours <= 24) return `${option.label}: tomorrow`;
  return `${option.label}: ${Math.ceil(option.etaHours / 24)} days`;
}

export function sortFulfillment(options, now = new Date()) {
  return [...options].sort((a, b) => {
    const aScore = getArrivalLabel(a, now).includes('next window') ? a.etaHours + 24 : a.etaHours;
    const bScore = getArrivalLabel(b, now).includes('next window') ? b.etaHours + 24 : b.etaHours;
    return aScore - bScore;
  });
}

export function validateNotify(input) {
  const email = /^\S+@\S+\.\S+$/;
  const phone = /^\+?[0-9]{10,15}$/;
  return email.test(input) || phone.test(input);
}
