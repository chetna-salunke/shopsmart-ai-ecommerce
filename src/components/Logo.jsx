import { Link } from "react-router-dom";
import Icon from "./Icons";

export default function Logo({ light = false, onClick }) {
  return (
    <Link to="/" className={`logo ${light ? "light" : ""}`} onClick={onClick} aria-label="ShopSmart home">
      <span className="logo-mark"><Icon name="bag" size={22} strokeWidth={1.7} /></span>
      <span className="logo-text"><b>ShopSmart</b><small>Ask before you buy</small></span>
    </Link>
  );
}
