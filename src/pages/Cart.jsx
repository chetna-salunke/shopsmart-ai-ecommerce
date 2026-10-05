import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";

export default function Cart() {
  const { items, clearCart } = useCart();
  if (!items.length)
    return (
      <div className="container section state">
        <h1>Your cart is empty</h1>
        <p>Add something you like and it will show up here.</p>
        <Link to="/products" className="btn">Browse products</Link>
      </div>
    );
  return (
    <div className="container section">
      <div className="cart-head"><h1>Shopping Cart</h1><button className="link danger" onClick={clearCart}>Clear cart</button></div>
      <div className="cart-layout">
        <div>{items.map((i) => <CartItem key={i.id} item={i} />)}</div>
        <OrderSummary />
      </div>
    </div>
  );
}
