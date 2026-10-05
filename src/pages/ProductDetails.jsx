import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchProduct, formatPrice } from "../services/productApi";
import { useCart } from "../context/CartContext";
import AIProductAssistant from "../components/AIProductAssistant";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import Icon from "../components/Icons";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [aiOpen, setAiOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { setProduct(await fetchProduct(id)); setImg(0); setQty(1); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [id]);
  useEffect(() => { load(); }, [load]);

  if (loading) return <Loading text="Loading product..." />;
  if (error) return <ErrorMessage message={`Could not load this product: ${error}`} onRetry={load} />;

  const p = product;
  const add = () => { addToCart(p, qty); setAdded(true); setTimeout(() => setAdded(false), 1500); };

  return (
    <div className="container section">
      <Link to="/products" className="link back"><Icon name="left" size={16} /> Back to products</Link>
      <div className="details">
        <div className="gallery">
          <img className="main" src={p.images[img]} alt={p.title} />
          <div className="thumbs">
            {p.images.slice(0, 5).map((src, i) => (
              <button key={src} className={i === img ? "on" : ""} onClick={() => setImg(i)} aria-label={`Image ${i + 1}`}><img src={src} alt="" /></button>
            ))}
          </div>
        </div>

        <div>
          <span className="muted">{p.category}</span>
          <h1>{p.title}</h1>
          <div className="rating">★ {p.rating.toFixed(1)}</div>
          <div className="price big">
            <strong>{formatPrice(p.price)}</strong>
            {p.discount > 0 && <><s>{formatPrice(p.originalPrice)}</s><span className="tag static">{p.discount}% off</span></>}
          </div>
          <p>{p.description}</p>
          <p className={p.inStock ? "green" : "danger"}><strong>{p.availability}</strong>{p.inStock && ` (${p.stock} left)`}</p>

          <h2>Specifications</h2>
          <table className="specs"><tbody>
            {Object.entries(p.specs).filter(([, v]) => v).map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}
          </tbody></table>

          <div className="qty">
            <button aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <span>{qty}</span>
            <button aria-label="Increase quantity" onClick={() => setQty(Math.min(p.stock || 1, qty + 1))}>+</button>
          </div>
          <div className="actions">
            <button className="btn" disabled={!p.inStock} onClick={add}>{added ? "Added ✓" : "Add to Cart"}</button>
            <button className="btn dark" disabled={!p.inStock} onClick={() => { addToCart(p, qty); navigate("/cart"); }}>Buy Now</button>
            <button className="btn ai" onClick={() => setAiOpen(true)}><Icon name="sparkles" size={17} /> Ask AI About This Product</button>
          </div>
        </div>
      </div>
      {aiOpen && <AIProductAssistant product={p} onClose={() => setAiOpen(false)} />}
    </div>
  );
}
