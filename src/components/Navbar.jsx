import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES } from "../services/productApi";
import { metaOf } from "./categoryMeta";
import Icon from "./Icons";
import Logo from "./Logo";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [accOpen, setAccOpen] = useState(false);
  const accRef = useRef(null);
  const { user, logout } = useAuth();
  const [q, setQ] = useState("");
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const catRef = useRef(null);
  const close = () => { setOpen(false); setCatOpen(false); setAccOpen(false); };

  const search = () => { navigate(`/products?q=${encodeURIComponent(q.trim())}`); close(); };

  // close menus when the page changes, on Escape, or on an outside click
  useEffect(() => { close(); }, [location.pathname, location.search]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setCatOpen(false); setAccOpen(false); } };
    const onDown = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
      if (accRef.current && !accRef.current.contains(e.target)) setAccOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => { window.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDown); };
  }, []);

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <span><Icon name="truck" size={15} /> Fast delivery to your door</span>
          <span><Icon name="returns" size={15} /> Easy returns</span>
          <span><Icon name="shield" size={15} /> Secure payments</span>
        </div>
      </div>

      <header className="navbar">
        <div className="container nav-inner">
          <button className="icon-btn hamburger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
          <Logo onClick={close} />

          <div className="nav-search"><SearchBar value={q} onChange={setQ} onSubmit={search} /></div>

          <div className="nav-actions">
            {user ? (
              <div className="acc-menu" ref={accRef}>
                <button className="nav-act" aria-label="Account menu" aria-expanded={accOpen} onClick={() => setAccOpen(!accOpen)}>
                  <span className="avatar-sm">{user.name[0]?.toUpperCase()}</span><span>{user.name.split(" ")[0]}</span>
                </button>
                {accOpen && (
                  <div className="acc-drop">
                    <div className="acc-head"><strong>{user.name}</strong><small>{user.email}</small></div>
                    <Link to="/cart"><Icon name="cart" size={16} /> My cart</Link>
                    <Link to="/products"><Icon name="bag" size={16} /> Keep shopping</Link>
                    <button onClick={() => { logout(); close(); navigate("/"); }}><Icon name="close" size={16} /> Log out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-act" aria-label="Log in or sign up"><Icon name="user" size={22} /><span>Login</span></Link>
            )}
            <Link to="/cart" className="nav-act" aria-label={`Cart, ${count} items`}>
              <span className="act-ico"><Icon name="cart" size={22} /><span className="badge">{count}</span></span>
              <span>Cart</span>
            </Link>
          </div>
        </div>

        <div className={`nav-row ${open ? "open" : ""}`}>
          <div className="container nav-row-inner">
            <div className="cat-menu" ref={catRef}>
              <button className="cat-btn" aria-expanded={catOpen} aria-haspopup="true" onClick={() => setCatOpen(!catOpen)}>
                <Icon name="menu" size={18} /> All Categories <Icon name="down" size={16} />
              </button>
              {catOpen && (
                <div className="cat-drop">
                  {CATEGORIES.map((c) => {
                    const m = metaOf(c);
                    return (
                      <Link key={c} to={`/products?category=${c}`}>
                        <span className="mini-ico" style={{ background: m.bg, color: m.fg }}><Icon name={m.icon} size={16} /></span>{m.label}
                      </Link>
                    );
                  })}
                  <Link to="/products" className="all"><span className="mini-ico"><Icon name="grid" size={16} /></span>View all products</Link>
                </div>
              )}
            </div>
            <nav className="nav-links" aria-label="Main">
              <NavLink to="/" end onClick={close}>Home</NavLink>
              <NavLink to="/products" end onClick={close}>Shop</NavLink>
              {CATEGORIES.map((c) => <Link key={c} to={`/products?category=${c}`} onClick={close}>{metaOf(c).label}</Link>)}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
