import { Link } from "react-router-dom";
import { CATEGORIES } from "../services/productApi";
import { metaOf } from "./categoryMeta";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container foot-grid">
        <div className="foot-brand">
          <Logo light />
          <p>Quality products across every category, with an AI assistant to answer your questions before you buy.</p>
        </div>
        <div>
          <h4>Shop</h4>
          {CATEGORIES.map((c) => <Link key={c} to={`/products?category=${c}`}>{metaOf(c).label}</Link>)}
        </div>
        <div>
          <h4>Quick links</h4>
          <Link to="/">Home</Link>
          <Link to="/products">All products</Link>
          <Link to="/cart">Your cart</Link>
        </div>
        <div>
          <h4>Shopping help</h4>
          <p>Open any product and tap <b>Ask AI About This Product</b> to get instant answers.</p>
        </div>
      </div>
      <div className="foot-bottom"><div className="container">© {new Date().getFullYear()} ShopSmart. Built with React.</div></div>
    </footer>
  );
}
