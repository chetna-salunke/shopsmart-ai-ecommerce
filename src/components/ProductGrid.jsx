import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";

export default function ProductGrid({ products }) {
  const { addToCart } = useCart();
  return (
    <div className="grid">
      {products.map((p) => <ProductCard key={p.id} product={p} addToCart={addToCart} />)}
    </div>
  );
}
