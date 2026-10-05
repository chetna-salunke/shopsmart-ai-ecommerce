import { useState, useEffect, useCallback } from "react";
import { fetchProducts } from "../services/productApi";

let cache = null;

export default function useProducts() {
  const [products, setProducts] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { cache = await fetchProducts(); setProducts(cache); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (!cache) load(); }, [load]);
  return { products, loading, error, reload: load };
}
