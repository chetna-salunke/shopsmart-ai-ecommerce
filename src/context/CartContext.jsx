import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const DELIVERY = 100;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart")) || []; } catch { return []; }
  });
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (p, qty = 1) =>
    setItems((cur) => cur.some((i) => i.id === p.id)
      ? cur.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i))
      : [...cur, { id: p.id, title: p.title, image: p.image, price: p.price, originalPrice: p.originalPrice, qty }]);
  const setQty = (id, qty) => setItems((cur) => cur.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const removeFromCart = (id) => setItems((cur) => cur.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.originalPrice * i.qty, 0);
    const pay = items.reduce((s, i) => s + i.price * i.qty, 0);
    const delivery = items.length ? DELIVERY : 0;
    return { count, subtotal, discount: subtotal - pay, delivery, total: pay + delivery };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addToCart, setQty, removeFromCart, clearCart, ...totals }}>
      {children}
    </CartContext.Provider>
  );
}
