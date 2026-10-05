import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../services/productApi";
import Icon, { Stars } from "./Icons";

export default function ProductCard({ product, addToCart }) {
  const { id, title, image, rating, price, originalPrice, discount, inStock } = product;
  const [added, setAdded] = useState(false);
  const add = () => { addToCart(product); setAdded(true); setTimeout(() => setAdded(false), 1200); };

  return (
    <article className="card">
      <Link to={`/products/${id}`} className="card-img" aria-label={`View details: ${title}`}>
        <img src={image} alt={title} loading="lazy" />
        {discount > 0 && <span className="tag">-{discount}%</span>}
        {!inStock && <span className="tag sold">Sold out</span>}
      </Link>
      <div className="card-body">
        <h3><Link to={`/products/${id}`}>{title}</Link></h3>
        <div className="rating"><Stars value={rating} /><span>{rating.toFixed(1)}</span></div>
        <div className="card-foot">
          <div className="price">
            <strong>{formatPrice(price)}</strong>
            {discount > 0 && <s>{formatPrice(originalPrice)}</s>}
          </div>
          <button className={`cart-fab ${added ? "done" : ""}`} disabled={!inStock} onClick={add}
            aria-label={inStock ? `Add ${title} to cart` : "Out of stock"} title={inStock ? "Add to cart" : "Out of stock"}>
            <Icon name={added ? "check" : "cart"} size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
