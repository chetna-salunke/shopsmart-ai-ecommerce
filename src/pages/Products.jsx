import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import ProductGrid from "../components/ProductGrid";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

const DEFAULTS = { maxPrice: 150000, minRating: "0", inStock: false };

export default function Products() {
  const { products, loading, error, reload } = useProducts();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const category = params.get("category") || "";

  const [search, setSearch] = useState(q);
  const [sort, setSort] = useState("");
  const [filters, setFilters] = useState(DEFAULTS);
  const [showFilters, setShowFilters] = useState(false);

  // keep input in sync with navbar searches
  useEffect(() => {
    setSearch(q);
  }, [q]);
  // debounced typing -> URL
  useEffect(() => {
    const t = setTimeout(() => {
      if (search === q) return;
      const next = new URLSearchParams(params);
      search ? next.set("q", search) : next.delete("q");
      setParams(next, { replace: true });
    }, 300);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line

  const setFilter = (key, value) => {
    if (key === "category") {
      const next = new URLSearchParams(params);
      value ? next.set("category", value) : next.delete("category");
      setParams(next);
    } else setFilters((f) => ({ ...f, [key]: value }));
  };
  const reset = () => { setFilters(DEFAULTS); setSearch(""); setSort(""); setParams({}); };

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = products.filter((p) =>
      (!term || p.title.toLowerCase().includes(term) || p.category.toLowerCase().includes(term) || p.subCategory.includes(term)) &&
      (!category || p.category === category) &&
      p.price <= Number(filters.maxPrice) &&
      p.rating >= Number(filters.minRating) &&
      (!filters.inStock || p.inStock));
    const sorters = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
    };
    return sorters[sort] ? [...list].sort(sorters[sort]) : list;
  }, [products, q, category, filters, sort]);

  return (
    <div className="container section" id="categories">
      <h1>Products</h1>
      <SearchBar value={search} onChange={setSearch} />

      <div className="toolbar">
        <p>Showing {visible.length} of {products.length} products</p>
        <button className="btn outline filter-toggle" onClick={() => setShowFilters(!showFilters)}>Filters</button>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className="layout">
        <div className={`filter-wrap ${showFilters ? "show" : ""}`}>
          <FilterPanel filters={{ ...filters, category }} setFilter={setFilter} reset={reset} />
        </div>
        <div>
          {loading && <Loading text="Loading products..." />}
          {error && <ErrorMessage message={`Could not load products: ${error}`} onRetry={reload} />}
          {!loading && !error && (visible.length
            ? <ProductGrid products={visible} />
            : <div className="state"><p>No products found.</p><button className="btn outline" onClick={reset}>Clear filters</button></div>)}
        </div>
      </div>
    </div>
  );
}
