import { ShoppingBasket, Search, SlidersHorizontal } from "lucide-react";
import { PageProps, Product } from "../types";
import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const CATEGORIES = ['All', 'Amigurumi', 'Home Decor', 'Plushies', 'Wearables'];

function CardSkeleton() {
  return (
    <div style={{ background: 'white', borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-soft)' }}>
      <div className="skeleton" style={{ width: '100%', aspectRatio: '1/1' }} />
      <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 18, width: '72%' }} />
        <div className="skeleton" style={{ height: 13, width: '55%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <div className="skeleton" style={{ height: 22, width: '30%' }} />
          <div className="skeleton" style={{ height: 40, width: 40, borderRadius: '50%' }} />
        </div>
      </div>
    </div>
  );
}

export default function Shop({ onNavigate }: PageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { el.classList.add('visible'); return; }
    const obs = new IntersectionObserver(
      ([e]) => e.target.classList.toggle('visible', e.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    getDocs(collection(db, "products"))
      .then(snap => setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="page-enter" style={{ paddingTop: 90, minHeight: '100vh' }}>

      {/* ── Hero header ── */}
      <div className="dot-grid" style={{
        padding: 'clamp(48px, 8vw, 96px) 0 clamp(48px, 6vw, 72px)',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* BG blobs */}
        <div className="float-a" style={{
          position: 'absolute', top: 0, right: '10%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,133,90,0.12), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="float-b" style={{
          position: 'absolute', bottom: 0, left: '5%',
          width: 250, height: 250, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(127,186,143,0.1), transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div ref={headerRef} className="reveal container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="label-caps" style={{ marginBottom: 14 }}>The Collection</p>
          <h1 className="section-headline" style={{ marginBottom: 16, fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}>
            Discover the<br />
            <span style={{ color: 'var(--color-primary)', fontStyle: 'italic' }}>Wonders</span> 🧸
          </h1>
          <p style={{ color: 'var(--color-ink-muted)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 40px' }}>
            Every piece is hand-stitched with the softest yarn. Find your perfect cozy companion.
          </p>

          {/* Search bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'white',
            border: '2px solid var(--color-outline)',
            borderRadius: 99,
            padding: '10px 10px 10px 22px',
            maxWidth: 420, margin: '0 auto',
            boxShadow: 'var(--shadow-soft)',
            transition: 'border-color 0.25s, box-shadow 0.25s',
          }}
            onFocusCapture={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
            onBlurCapture={e => (e.currentTarget.style.borderColor = 'var(--color-outline)')}
          >
            <Search size={17} color="var(--color-ink-faint)" style={{ flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search plushies, amigurumi…"
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontFamily: 'var(--font-body)', fontSize: '0.92rem',
                color: 'var(--color-ink)', background: 'transparent',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="btn" style={{ padding: '6px 14px', borderRadius: 99, background: 'var(--color-primary-pale)', color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 700 }}>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Filters & grid ── */}
      <div className="container" style={{ padding: '40px 24px 96px' }}>

        {/* Category pills */}
        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap',
          marginBottom: 40, alignItems: 'center',
        }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn"
            style={{
              padding: '10px 18px', borderRadius: 99,
              border: '1.5px solid var(--color-outline)',
              background: showFilters ? 'var(--color-ink)' : 'white',
              color: showFilters ? 'white' : 'var(--color-ink)',
              fontSize: '0.84rem', fontWeight: 700,
            }}
          >
            <SlidersHorizontal size={14} />
            Filter
          </button>
          <div style={{ width: '1.5px', height: 28, background: 'var(--color-outline)', borderRadius: 2 }} />
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="btn"
                style={{
                  padding: '10px 20px', borderRadius: 99,
                  background: active ? 'var(--color-primary)' : 'white',
                  color: active ? 'white' : 'var(--color-ink-muted)',
                  fontSize: '0.88rem', fontWeight: active ? 700 : 500,
                  border: `1.5px solid ${active ? 'var(--color-primary)' : 'var(--color-outline)'}`,
                  boxShadow: active ? '0 4px 16px rgba(196,98,45,0.25)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                {cat}
              </button>
            );
          })}
          {!loading && (
            <span className="label-caps" style={{ marginLeft: 'auto' }}>
              {filtered.length} item{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Product grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: 24 }}>
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            background: 'var(--color-bg-warm)',
            borderRadius: 28,
            border: '2px dashed var(--color-outline)',
          }}>
            <p style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>Nothing found</h3>
            <p style={{ color: 'var(--color-ink-muted)' }}>Try a different search or category.</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="btn btn-primary" style={{ marginTop: 24 }}>
              Show all items
            </button>
          </div>
        ) : (
          <div
            className="stagger"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: 24 }}
          >
            {filtered.map(product => (
              <article
                key={product.id}
                className="yarn-card"
                onClick={() => onNavigate('product', product.id)}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
              >
                {/* Image */}
                <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1/1', borderRadius: '24px 24px 0 0' }}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="img-hover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Badges */}
                  <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                    {product.isBestseller && <span className="tag tag-warm">⭐ Bestseller</span>}
                    {product.isNewArrival && <span className="tag tag-primary">New</span>}
                    {product.isLimitedEdition && <span className="tag tag-blush">Limited</span>}
                    {!product.isBestseller && !product.isNewArrival && !product.isLimitedEdition && (
                      <span className="tag tag-sky">Handmade</span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.3,
                  }}>
                    {product.name}
                  </h3>
                  <p style={{
                    fontSize: '0.84rem', lineHeight: 1.55,
                    color: 'var(--color-ink-muted)',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  } as React.CSSProperties}>
                    {product.description}
                  </p>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingTop: 14,
                    borderTop: '1.5px dashed var(--color-outline)',
                    marginTop: 8,
                  }}>
                    <span className="price-tag">₹{product.price.toFixed(0)}</span>
                    <button
                      onClick={e => { e.stopPropagation(); onNavigate('checkout', product); }}
                      className="btn"
                      aria-label="Adopt this piece"
                      style={{
                        width: 42, height: 42, borderRadius: '50%',
                        background: 'var(--color-accent)',
                        color: 'white',
                        boxShadow: '0 4px 14px rgba(74,124,89,0.3)',
                      }}
                    >
                      <ShoppingBasket size={17} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
