import { Link, Navigate } from "react-router-dom";
import { formatPrice } from "../services/productApi";
import Icon from "../components/Icons";

export default function OrderSuccess() {
  let order = null;
  try { order = JSON.parse(localStorage.getItem("lastOrder")); } catch { /* ignore */ }
  if (!order) return <Navigate to="/" replace />;

  const eta = new Date(new Date(order.date).getTime() + 5 * 864e5).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="container section">
      <ol className="steps" aria-label="Checkout progress">
        <li className="done"><span><Icon name="check" size={14} /></span> Cart</li>
        <li className="done"><span><Icon name="check" size={14} /></span> Delivery &amp; payment</li>
        <li className="now"><span><Icon name="check" size={14} /></span> Confirmation</li>
      </ol>
      <div className="success">
        <span className="success-ico"><Icon name="check" size={38} strokeWidth={2.4} /></span>
        <h1>Thank you, your order is placed!</h1>
        <p className="muted big">Order <b>#{order.id}</b> · Estimated delivery by <b>{eta}</b></p>

        <div className="success-card">
          <ul className="co-items">
            {order.items.map((i) => (
              <li key={i.id}><span className="thumb"><img src={i.image} alt="" /><b>{i.qty}</b></span><span className="t">{i.title}</span><span>{formatPrice(i.price * i.qty)}</span></li>
            ))}
          </ul>
          <div className="row"><span>Delivery</span><span>{formatPrice(order.delivery)}</span></div>
          <div className="row total"><span>{order.paid ? "Total paid" : "Total to pay on delivery"}</span><span>{formatPrice(order.total)}</span></div>
          <div className="success-meta">
            <div><small>Payment</small><strong>{order.method}</strong></div>
            <div><small>Shipping to</small><strong>{order.ship.name}</strong><span>{order.ship.address}</span></div>
          </div>
        </div>
        <p className="demo-note center"><Icon name="shield" size={14} /> Demo order: nothing was charged or shipped.</p>
        <div className="actions center"><Link to="/products" className="btn big">Continue shopping</Link><Link to="/" className="btn outline big">Back to home</Link></div>
      </div>
    </div>
  );
}
