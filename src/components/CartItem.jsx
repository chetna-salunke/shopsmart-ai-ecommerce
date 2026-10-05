import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../services/productApi";

export default function CartItem({ item }) {
  const { setQty, removeFromCart } = useCart();
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.title} />
      <div className="ci-info">
        <Link to={`/products/${item.id}`}><h3>{item.title}</h3></Link>
        <span>{formatPrice(item.price)} each</span>
        <div className="qty">
          <button aria-label="Decrease quantity" onClick={() => setQty(item.id, item.qty - 1)} disabled={item.qty <= 1}>−</button>
          <span>{item.qty}</span>
          <button aria-label="Increase quantity" onClick={() => setQty(item.id, item.qty + 1)}>+</button>
        </div>
      </div>
      <div className="ci-end">
        <strong>{formatPrice(item.price * item.qty)}</strong>
        <button className="link danger" onClick={() => removeFromCart(item.id)}>Remove</button>
      </div>
    </div>
  );
}
