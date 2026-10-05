import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import { CATEGORIES, formatPrice } from "../services/productApi";
import ProductGrid from "../components/ProductGrid";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import Icon, { Stars } from "../components/Icons";
import { metaOf } from "../components/categoryMeta";

const PERKS = [
  ["truck", "Fast delivery", "Straight to your door"],
  ["returns", "Easy returns", "Hassle-free policy"],
  ["lock", "Secure checkout", "Your data stays safe"],
  ["sparkles", "AI shopping help", "Ask before you buy"],
];

const PROMOS = [
  { cat: "Fashion", kicker: "New in fashion", title: "Fresh styles for every day", tone: "green" },
  { cat: "Home", kicker: "Home & living", title: "Small upgrades, big comfort", tone: "cream" },
  { cat: "Electronics", kicker: "Tech picks", title: "Gadgets worth owning", tone: "blue" },
];

const STEPS = [
  ["Open any product", "Pick something you like from the shop."],
  ["Tap “Ask AI About This Product”", "Ask about features, value or who it suits."],
  ["Get a clear answer", "Decide with confidence, then add it to your cart."],
];

// SAMPLE CONTENT: replace with real customer reviews before going live.
const REVIEWS = [
  { name: "Sarah J.", text: "Great quality and quick delivery. It's now my first stop for everyday things.", tint: "#f6d9c8" },
  { name: "Michael T.", text: "I asked the AI assistant a few questions first and it saved me from a wrong buy.", tint: "#d5e3f3" },
  { name: "Priya K.", text: "Lots of variety, real discounts and a checkout that took under a minute.", tint: "#e3d9f1" },
];

function useCountdown() {
  const calc = () => {
    const now = new Date(), end = new Date(now);
    end.setHours(24, 0, 0, 0);
    const s = Math.max(0, Math.floor((end - now) / 1000));
    return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60];
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const i = setInterval(() => setT(calc()), 1000); return () => clearInterval(i); }, []);
  return t;
}
const pad = (n) => String(n).padStart(2, "0");

export default function Home() {
  const { products, loading, error, reload } = useProducts();
  const [subscribed, setSubscribed] = useState(false);
  const [tab, setTab] = useState("All");
  const track = useRef(null);
  const [h, m, s] = useCountdown();

  const byRating = [...products].sort((a, b) => b.rating - a.rating);
  const heroItems = byRating.filter((p) => p.image).slice(0, 3);
  const trending = (tab === "All" ? byRating : byRating.filter((p) => p.category === tab)).slice(0, 12);
  const deal = [...products].filter((p) => p.inStock).sort((a, b) => b.discount - a.discount)[0];
  const avg = products.length ? (products.reduce((x, p) => x + p.rating, 0) / products.length).toFixed(1) : null;
  const countIn = (c) => products.filter((p) => p.category === c).length;
  const bestIn = (cat) => byRating.find((p) => p.category === cat);
  const chatItem = byRating[0];

  useEffect(() => { track.current?.scrollTo({ left: 0 }); }, [tab]);
  const scrollPicks = (dir) => { const el = track.current; if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" }); };

  return (
    <div className="home">
      {/* HERO */}
      <section className="container">
        <div className="h-hero">
          <div className="h-copy">
            <span className="h-chip"><Icon name="sparkles" size={15} /> Shopping with an AI assistant</span>
            <h1>Everyday finds, picked smartly.</h1>
            <p>Electronics, fashion, beauty and home essentials in one place, with an assistant that answers your questions before you buy.</p>
            <div className="h-cta">
              <Link to="/products" className="btn big">Shop Now <Icon name="arrow" size={16} /></Link>
              <a href="#ai" className="btn outline big">See how AI helps</a>
            </div>
            {avg && (
              <dl className="h-stats">
                <div><dt>{products.length}+</dt><dd>Products</dd></div>
                <div><dt>{CATEGORIES.length}</dt><dd>Categories</dd></div>
                <div><dt>{avg}★</dt><dd>Average rating</dd></div>
              </dl>
            )}
          </div>

          <div className="h-visual" aria-hidden={heroItems.length === 0}>
            <div className="h-arch">{heroItems[0] && <img src={heroItems[0].image} alt={heroItems[0].title} />}</div>
            {heroItems[1] && <span className="h-orb o1"><img src={heroItems[1].image} alt={heroItems[1].title} /></span>}
            {heroItems[2] && <span className="h-orb o2"><img src={heroItems[2].image} alt={heroItems[2].title} /></span>}
            {heroItems[0] && (
              <Link to={`/products/${heroItems[0].id}`} className="h-float f-product">
                <small>Top rated</small>
                <strong>{heroItems[0].title}</strong>
                <span><Stars value={heroItems[0].rating} size={12} /> {formatPrice(heroItems[0].price)}</span>
              </Link>
            )}
            <div className="h-float f-ai" aria-hidden="true">
              <span className="ai-dot"><Icon name="sparkles" size={14} /></span>
              <span>“Is this good for daily use?”</span>
            </div>
          </div>
        </div>
      </section>

      {/* PERKS BAR */}
      <section className="container">
        <ul className="perks-bar">
          {PERKS.map(([i, t, d]) => <li key={t}><Icon name={i} size={22} strokeWidth={1.6} /><span><b>{t}</b><small>{d}</small></span></li>)}
        </ul>
      </section>

      {/* CATEGORIES */}
      <section className="container hsec">
        <div className="hsec-head"><div><h2>Shop by category</h2><p>Find what you need in a couple of taps.</p></div><Link to="/products" className="see-all">View all <Icon name="arrow" size={15} /></Link></div>
        <div className="tiles">
          {CATEGORIES.map((c) => {
            const meta = metaOf(c), n = countIn(c);
            return (
              <Link key={c} to={`/products?category=${c}`} className="tile">
                <span className="tile-ico" style={{ background: meta.bg, color: meta.fg }}><Icon name={meta.icon} size={26} /></span>
                <strong>{meta.label}</strong>
                <small>{n ? `${n} items` : "Browse"}</small>
                <Icon name="arrow" size={16} className="tile-go" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* DEAL OF THE DAY */}
      {deal && (
        <section className="container hsec">
          <div className="deal">
            <div className="deal-img"><img src={deal.image} alt={deal.title} /><span className="deal-off">-{deal.discount}%</span></div>
            <div className="deal-info">
              <small>Deal of the day</small>
              <h2>{deal.title}</h2>
              <div className="deal-price"><strong>{formatPrice(deal.price)}</strong><s>{formatPrice(deal.originalPrice)}</s></div>
              <div className="deal-stock"><span style={{ width: `${Math.min(100, Math.max(8, deal.stock))}%` }} /></div>
              <small className="deal-left">Only {deal.stock} left in stock</small>
            </div>
            <div className="deal-time">
              <small>Ends in</small>
              <div className="clock" role="timer" aria-label={`${h} hours ${m} minutes ${s} seconds left`}>
                {[["Hrs", h], ["Min", m], ["Sec", s]].map(([l, v]) => <span key={l}><b>{pad(v)}</b><i>{l}</i></span>)}
              </div>
              <Link to={`/products/${deal.id}`} className="btn cream big">Grab this deal <Icon name="arrow" size={16} /></Link>
            </div>
          </div>
        </section>
      )}

      {/* TRENDING (tabs + carousel) */}
      <section className="container hsec">
        <div className="panel">
          <div className="hsec-head tight">
            <div><h2>Trending now</h2><p>The highest-rated products, by category.</p></div>
            <Link to="/products" className="see-all">See all products <Icon name="arrow" size={15} /></Link>
          </div>
          <div className="tabs" role="tablist" aria-label="Product category">
            {["All", ...CATEGORIES].map((c) => (
              <button key={c} role="tab" aria-selected={tab === c} className={tab === c ? "on" : ""} onClick={() => setTab(c)}>{c === "All" ? "All" : metaOf(c).label}</button>
            ))}
          </div>
          {loading && <Loading text="Loading products..." />}
          {error && <ErrorMessage message={`Could not load products: ${error}`} onRetry={reload} />}
          {!loading && !error && (
            trending.length ? (
              <div className="picks">
                <button className="slide-btn prev" aria-label="Previous products" onClick={() => scrollPicks(-1)}><Icon name="left" size={18} /></button>
                <div className="picks-track" ref={track}><ProductGrid products={trending} /></div>
                <button className="slide-btn next" aria-label="Next products" onClick={() => scrollPicks(1)}><Icon name="right" size={18} /></button>
              </div>
            ) : <div className="state"><p>No products in this category yet.</p></div>
          )}
        </div>
      </section>

      {/* PROMO CARDS */}
      {!loading && !error && (
        <section className="container hsec">
          <div className="promos">
            {PROMOS.map((b) => {
              const item = bestIn(b.cat);
              return (
                <Link key={b.cat} to={`/products?category=${b.cat}`} className={`promo ${b.tone}`}>
                  <span className="promo-img">{item && <img src={item.image} alt="" loading="lazy" />}</span>
                  <span className="promo-txt"><small>{b.kicker}</small><strong>{b.title}</strong></span>
                  <Icon name="arrow" size={18} className="promo-go" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* AI SHOWCASE */}
      <section className="container hsec" id="ai">
        <div className="ai-show">
          <div className="ai-copy">
            <h2>Not sure about a product? Just ask.</h2>
            <p>Every product page has an AI assistant that knows the product's details and answers in plain language.</p>
            <ol className="ai-steps">
              {STEPS.map(([t, d], i) => <li key={t}><span>{i + 1}</span><div><strong>{t}</strong><small>{d}</small></div></li>)}
            </ol>
            <Link to="/products" className="btn big">Try it on a product <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="ai-demo" aria-label="Example conversation">
            <div className="ai-demo-head"><Icon name="sparkles" size={18} /> AI Product Assistant <em>Example</em></div>
            {chatItem && <div className="ai-ctx">{chatItem.image && <img src={chatItem.image} alt="" />}<span><b>{chatItem.title}</b><small>{formatPrice(chatItem.price)}</small></span></div>}
            <div className="bub me">Is it good value for money?</div>
            <div className="bub bot">It's one of our highest-rated items and currently discounted, so it's solid value. Check the specifications for warranty and return details before you buy.</div>
            <div className="bub me">Who is it suitable for?</div>
            <div className="bub bot typing"><i /><i /><i /></div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="container hsec">
        <div className="reviews2">
          <div className="rev-sum">
            <small>Customer love</small>
            <strong>4.8</strong>
            <Stars value={5} size={18} />
            <p>Average rating from happy shoppers</p>
          </div>
          {REVIEWS.map((r) => (
            <figure key={r.name} className="rev">
              <blockquote>“{r.text}”</blockquote>
              <figcaption>
                <span className="avatar" style={{ background: r.tint }}>{r.name[0]}</span>
                <span><strong>{r.name}</strong><small><Icon name="check" size={11} /> Verified buyer</small></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container hsec">
        <div className="news2">
          <div className="news2-copy">
            <span className="news2-ico"><Icon name="mail" size={24} /></span>
            <h2>Get early access to deals</h2>
            <p>New arrivals and offers in your inbox. No spam, unsubscribe anytime.</p>
          </div>
          {subscribed ? (
            <p className="news2-done" role="status"><Icon name="check" size={18} /> You're on the list. Thanks for joining!</p>
          ) : (
            <form className="news2-form" onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}>
              <input type="email" required aria-label="Email address" placeholder="Your email address" />
              <button className="btn">Subscribe</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
