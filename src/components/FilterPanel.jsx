import { CATEGORIES } from "../services/productApi";

export default function FilterPanel({ filters, setFilter, reset }) {
  return (
    <aside className="filters" aria-label="Filters">
      <div className="filters-head"><h2>Filters</h2><button className="link" onClick={reset}>Reset</button></div>

      <label>Category
        <select value={filters.category} onChange={(e) => setFilter("category", e.target.value)}>
          <option value="">All</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>

      <label>Max price: ₹{Number(filters.maxPrice).toLocaleString("en-IN")}
        <input type="range" min="500" max="150000" step="500" value={filters.maxPrice}
          onChange={(e) => setFilter("maxPrice", e.target.value)} />
      </label>

      <label>Minimum rating
        <select value={filters.minRating} onChange={(e) => setFilter("minRating", e.target.value)}>
          <option value="0">Any</option>
          <option value="3">3★ & up</option>
          <option value="4">4★ & up</option>
          <option value="4.5">4.5★ & up</option>
        </select>
      </label>

      <label className="check">
        <input type="checkbox" checked={filters.inStock} onChange={(e) => setFilter("inStock", e.target.checked)} />
        In stock only
      </label>
    </aside>
  );
}
