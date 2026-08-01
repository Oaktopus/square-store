import products from '../../public/data/products.json';

export const PATCH_PRICES = {
  Embroidered: 2990,
  'Laser Engraved': 2390,
  'UV Printed Leatherette': 2690,
};
export const TEXT_PRICE = 800;

export function itemPriceCents(product, options) {
  if (options && options.patch) {
    let price = PATCH_PRICES[options.patch] || 0;
    if (options.text && options.text.trim()) price += TEXT_PRICE;
    return price;
  }
  return product.price;
}

export { products };
