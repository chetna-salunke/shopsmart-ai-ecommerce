// REST API layer. Uses the public DummyJSON API: https://dummyjson.com/docs/products
const BASE = "https://dummyjson.com";
const USD_TO_INR = 83;

const GROUPS = {
  Electronics: ["smartphones", "laptops", "tablets"],
  Fashion: ["mens-shirts", "mens-shoes", "womens-dresses", "womens-shoes", "tops"],
  Beauty: ["beauty", "fragrances", "skin-care"],
  Home: ["furniture", "home-decoration", "kitchen-accessories", "groceries"],
  Accessories: ["mens-watches", "womens-watches", "womens-bags", "womens-jewellery", "sunglasses", "mobile-accessories"],
};
export const CATEGORIES = Object.keys(GROUPS);

const groupOf = (c) => Object.keys(GROUPS).find((g) => GROUPS[g].includes(c)) || "Other";

function normalize(p) {
  const discount = Math.round(p.discountPercentage || 0);
  const price = Math.round(p.price * USD_TO_INR);
  return {
    id: p.id,
    title: p.title,
    category: groupOf(p.category),
    subCategory: p.category,
    brand: p.brand || "Generic",
    price,
    originalPrice: discount ? Math.round(price / (1 - discount / 100)) : price,
    discount,
    rating: p.rating,
    stock: p.stock,
    inStock: p.stock > 0,
    availability: p.availabilityStatus || (p.stock > 0 ? "In Stock" : "Out of Stock"),
    image: p.thumbnail,
    images: p.images?.length ? p.images : [p.thumbnail],
    description: p.description,
    createdAt: p.meta?.createdAt || "",
    specs: {
      Brand: p.brand || "Generic",
      SKU: p.sku,
      Weight: p.weight && `${p.weight} g`,
      Dimensions: p.dimensions && `${p.dimensions.width} x ${p.dimensions.height} x ${p.dimensions.depth} cm`,
      Warranty: p.warrantyInformation,
      Shipping: p.shippingInformation,
      Returns: p.returnPolicy,
    },
  };
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export async function fetchProducts() {
  const data = await get("/products?limit=100");
  return data.products.map(normalize).filter((p) => p.category !== "Other");
}

export async function fetchProduct(id) {
  return normalize(await get(`/products/${id}`));
}

export const formatPrice = (n) => "₹" + n.toLocaleString("en-IN");
