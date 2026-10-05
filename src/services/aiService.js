// Talks to our own backend (/api/ai/ask), which holds the private API key.
export async function askAI(product, question, history = []) {
  const slim = {
    title: product.title, brand: product.brand, category: product.subCategory,
    price: product.price, rating: product.rating, availability: product.availability,
    description: product.description, specifications: product.specs,
  };
  let res;
  try {
    res = await fetch("http://localhost:5001/api/ai/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: slim, question, history }),
    });
  } catch {
    throw new Error("Cannot reach the AI server. Is `npm run server` running?");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Server error (${res.status})`);
  return data.answer;
}
