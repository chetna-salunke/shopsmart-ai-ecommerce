import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../services/productApi";

export default function OrderSummary() {
  const { subtotal, discount, delivery, total } = useCart();
  return (
    <aside className="summary">
      <h2>Order Summary</h2>
      <div className="row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
      <div className="row green"><span>Discount</span><span>−{formatPrice(discount)}</span></div>
      <div className="row"><span>Delivery</span><span>{formatPrice(delivery)}</span></div>
      <div className="row total"><span>Total</span><span>{formatPrice(total)}</span></div>
      <Link to="/checkout" className="btn full">Checkout</Link>
    </aside>
  );
}
