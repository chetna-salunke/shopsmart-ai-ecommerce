import { useEffect, useRef, useState } from "react";
import { askAI } from "../services/aiService";
import Icon from "./Icons";

const SUGGESTIONS = ["What are the main advantages?", "Who is this suitable for?", "Is it good value for money?"];

export default function AIProductAssistant({ product, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedQ, setFailedQ] = useState(null);
  const [detail, setDetail] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function send(question, alreadyAdded = false) {
    const q = question.trim();
    if (!q || loading) return;
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    if (!alreadyAdded) setMessages((m) => [...m, { role: "user", content: q }]);
    setInput(""); setFailedQ(null); setLoading(true);
    try {
      const answer = await askAI(product, q, history);
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch (e) {
      setFailedQ(q);
      setDetail(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <section className="assistant" role="dialog" aria-label="AI product assistant" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2><Icon name="sparkles" size={20} /> AI Product Assistant</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="close" size={20} /></button>
        </header>

        <div className="ctx"><img src={product.image} alt="" /><div><strong>{product.title}</strong><span>{product.brand} · ₹{product.price.toLocaleString("en-IN")}</span></div></div>

        <div className="msgs" aria-live="polite">
          {messages.length === 0 && (
            <div className="hint">
              <p>Ask me anything about this product.</p>
              {SUGGESTIONS.map((s) => <button key={s} className="chip" onClick={() => send(s)}>{s}</button>)}
            </div>
          )}
          {messages.map((m, i) => <div key={i} className={`msg ${m.role}`}>{m.content}</div>)}
          {loading && <div className="msg assistant thinking">AI is thinking...</div>}
          {failedQ && (
            <div className="msg error" role="alert">
              Sorry, I couldn't generate a response. Please try again.
              {detail && <small>Reason: {detail}</small>}
              <button className="link" onClick={() => send(failedQ, true)}>Try Again</button>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form className="composer" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question..." aria-label="Your question" />
          <button className="btn" disabled={loading || !input.trim()}>Send</button>
        </form>
      </section>
    </div>
  );
}
