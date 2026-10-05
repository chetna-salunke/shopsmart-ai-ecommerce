import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../services/productApi";
import Icon from "../components/Icons";

// DEMO ONLY: nothing is sent anywhere and no payment is processed.
const METHODS = [
  { id: "upi", icon: "phone", title: "UPI", sub: "Google Pay, PhonePe, Paytm and more" },
  { id: "card", icon: "card", title: "Credit / Debit card", sub: "Visa, Mastercard, RuPay" },
  { id: "netbanking", icon: "bank", title: "Net banking", sub: "Pay from your bank account" },
  { id: "cod", icon: "cash", title: "Cash on delivery", sub: "Pay when your order arrives" },
];
const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Punjab National Bank"];
const digits = (n) => (v) => v.replace(/\D/g, "").slice(0, n);
const fmtCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const fmtExp = (v) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };

export default function Checkout() {
  const { items, subtotal, discount, delivery, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: user?.name || "", phone: "", pin: "", address: "", city: "", upi: "", card: "", holder: "", exp: "", cvv: "", bank: "" });
  const [method, setMethod] = useState("upi");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k, fmt = (v) => v) => (e) => { setF((s) => ({ ...s, [k]: fmt(e.target.value) })); setErrors((er) => ({ ...er, [k]: undefined })); };

  function validate() {
    const e = {};
    if (f.name.trim().length < 2) e.name = "Enter the recipient's name";
    if (f.phone.length !== 10) e.phone = "Enter a 10-digit mobile number";
    if (f.pin.length !== 6) e.pin = "Enter a 6-digit PIN code";
    if (f.address.trim().length < 8) e.address = "Enter your full address";
    if (!f.city.trim()) e.city = "Enter your city";
    if (method === "upi" && !/^[\w.-]+@\w+$/.test(f.upi)) e.upi = "Enter a valid UPI ID, like name@bank";
    if (method === "card") {
      if (f.card.replace(/\s/g, "").length !== 16) e.card = "Enter a 16-digit card number";
      if (f.holder.trim().length < 2) e.holder = "Enter the name on the card";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(f.exp)) e.exp = "Use MM/YY";
      if (f.cvv.length !== 3) e.cvv = "3 digits";
    }
    if (method === "netbanking" && !f.bank) e.bank = "Choose your bank";
    return e;
  }

  function place(ev) {
    ev.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) { setTimeout(() => document.querySelector("[aria-invalid=true]")?.focus(), 0); return; }
    setBusy(true);
    setTimeout(() => {
      const order = {
        id: String(Math.floor(100000 + Math.random() * 900000)),
        date: new Date().toISOString(),
        items: items.map(({ id, title, image, price, qty }) => ({ id, title, image, price, qty })),
        delivery, total,
        paid: method !== "cod",
        method: METHODS.find((m) => m.id === method).title,
        ship: { name: f.name.trim(), address: `${f.address.trim()}, ${f.city.trim()} - ${f.pin}` },
      };
      try { localStorage.setItem("lastOrder", JSON.stringify(order)); } catch { /* ignore */ }
      clearCart();
      navigate("/order-success", { replace: true });
    }, 1500);
  }

  if (!items.length && !busy)
    return (
      <div className="container section state">
        <h1>Nothing to check out</h1>
        <p>Your cart is empty. Add a few products first.</p>
        <Link to="/products" className="btn">Browse products</Link>
      </div>
    );

  const Err = ({ k }) => (errors[k] ? <small className="err">{errors[k]}</small> : null);
  const Field = ({ k, label, span, ...rest }) => (
    <label className={`field ${span ? "span2" : ""}`}>{label}
      <input value={f[k]} onChange={set(k, rest.fmt)} aria-invalid={!!errors[k]} {...{ ...rest, fmt: undefined }} />
      <Err k={k} />
    </label>
  );

  return (
    <div className="container section">
      <ol className="steps" aria-label="Checkout progress">
        <li className="done"><span><Icon name="check" size={14} /></span> Cart</li>
        <li className="now"><span>2</span> Delivery &amp; payment</li>
        <li><span>3</span> Confirmation</li>
      </ol>
      <h1>Checkout</h1>
      {!user && <p className="co-login">Have an account? <Link to="/login" state={{ from: "/checkout" }} className="link">Log in</Link> to fill in your name automatically, or continue as a guest.</p>}
      <div className="demo-banner"><Icon name="shield" size={16} /> Demo checkout: no payment is processed. Please don't enter real card details.</div>

      <form className="co-layout" onSubmit={place} noValidate>
        <div className="co-main">
          <section className="co-card">
            <h2><span className="num">1</span> Delivery details</h2>
            <div className="form-grid">
              <Field k="name" label="Full name" span autoComplete="name" />
              <Field k="phone" label="Mobile number" inputMode="numeric" fmt={digits(10)} placeholder="10-digit number" autoComplete="tel" />
              <Field k="pin" label="PIN code" inputMode="numeric" fmt={digits(6)} placeholder="6 digits" autoComplete="postal-code" />
              <Field k="address" label="Address" span placeholder="House no, street, area" autoComplete="street-address" />
              <Field k="city" label="City" span autoComplete="address-level2" />
            </div>
          </section>

          <section className="co-card">
            <h2><span className="num">2</span> Payment method</h2>
            <div className="methods" role="radiogroup" aria-label="Payment method">
              {METHODS.map((m) => {
                const on = method === m.id;
                return (
                  <div key={m.id} className={`method ${on ? "on" : ""}`}>
                    <label>
                      <input type="radio" name="pay" value={m.id} checked={on} onChange={() => { setMethod(m.id); setErrors({}); }} />
                      <span className="m-ico"><Icon name={m.icon} size={20} /></span>
                      <span className="m-txt"><strong>{m.title}</strong><small>{m.sub}</small></span>
                      <span className="m-dot" />
                    </label>
                    {on && m.id === "upi" && <div className="m-body"><Field k="upi" label="UPI ID" placeholder="name@bank" autoComplete="off" /></div>}
                    {on && m.id === "card" && (
                      <div className="m-body form-grid">
                        <Field k="card" label="Card number" span inputMode="numeric" fmt={fmtCard} placeholder="0000 0000 0000 0000" autoComplete="off" />
                        <Field k="holder" label="Name on card" span autoComplete="off" />
                        <Field k="exp" label="Expiry" inputMode="numeric" fmt={fmtExp} placeholder="MM/YY" autoComplete="off" />
                        <Field k="cvv" label="CVV" type="password" inputMode="numeric" fmt={digits(3)} placeholder="123" autoComplete="off" />
                      </div>
                    )}
                    {on && m.id === "netbanking" && (
                      <div className="m-body">
                        <label className="field">Select your bank
                          <select value={f.bank} onChange={set("bank")} aria-invalid={!!errors.bank}><option value="">Choose a bank</option>{BANKS.map((b) => <option key={b}>{b}</option>)}</select>
                          <Err k="bank" />
                        </label>
                      </div>
                    )}
                    {on && m.id === "cod" && <div className="m-body"><p className="muted">Pay in cash when your order arrives. Please keep the exact amount ready.</p></div>}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="co-summary">
          <h2>Order summary</h2>
          <ul className="co-items">
            {items.map((i) => (
              <li key={i.id}><span className="thumb"><img src={i.image} alt="" /><b>{i.qty}</b></span><span className="t">{i.title}</span><span>{formatPrice(i.price * i.qty)}</span></li>
            ))}
          </ul>
          <div className="row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="row green"><span>Discount</span><span>−{formatPrice(discount)}</span></div>
          <div className="row"><span>Delivery</span><span>{formatPrice(delivery)}</span></div>
          <div className="row total"><span>Total</span><span>{formatPrice(total)}</span></div>
          <button className="btn big full" disabled={busy}>
            {busy ? <><span className="btn-spin" /> Placing order...</> : method === "cod" ? "Place order" : `Pay ${formatPrice(total)}`}
          </button>
          <p className="secure"><Icon name="lock" size={14} /> Secure, encrypted checkout (demo)</p>
          <Link to="/cart" className="link back"><Icon name="left" size={16} /> Back to cart</Link>
        </aside>
      </form>
    </div>
  );
}
