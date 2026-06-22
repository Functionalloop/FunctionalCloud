import { ArrowLeft, Cloud, Droplets, Eye, Heart, Leaf, Minus, Plus, Star } from "lucide-react";
import { PageProps, Product } from "../types";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ProductDetail({ onNavigate, data }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!data) { setLoading(false); return; }
        const snap = await getDoc(doc(db, "products", data));
        if (snap.exists()) setProduct({ id: snap.id, ...snap.data() } as Product);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [data]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--color-primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--color-ink-muted)' }}>Loading your cozy companion…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 24 }}>
        <p style={{ fontSize: '3rem' }}>😔</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-ink)' }}>Product not found</h2>
        <p style={{ color: 'var(--color-ink-muted)' }}>This item may have sold out. Check the shop for what's available.</p>
        <button onClick={() => onNavigate('shop')} className="btn btn-primary" style={{ marginTop: 8 }}>
          Back to Shop
        </button>
      </div>
    );
  }

  const defaultFeatures = [
    { icon: <Cloud size={16} />, text: 'Hypoallergenic polyfill stuffing' },
    { icon: <Eye size={16} />, text: 'Securely fastened safety eyes' },
    { icon: <Leaf size={16} />, text: 'Soft, skin-safe acrylic yarn' },
  ];

  const features = product.features?.length
    ? product.features.map(f => ({ icon: <Leaf size={16} />, text: f }))
    : defaultFeatures;

  return (
    <div className="page-enter" style={{ paddingTop: 90 }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>

        {/* Breadcrumb */}
        <button
          onClick={() => onNavigate('shop')}
          className="btn"
          style={{
            gap: 6, padding: '9px 18px', borderRadius: 99, marginBottom: 40,
            background: 'white', border: '1.5px solid var(--color-outline)',
            color: 'var(--color-ink-muted)', fontSize: '0.86rem', fontWeight: 600,
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          <ArrowLeft size={15} />
          Back to Shop
        </button>

        {/* Main layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: 'clamp(32px, 5vw, 72px)',
          alignItems: 'start',
        }}>

          {/* ── Left: Image ── */}
          <div style={{ position: 'sticky', top: 100 }}>
            {/* Main image */}
            <div style={{
              position: 'relative',
              borderRadius: 32,
              overflow: 'hidden',
              background: 'var(--color-bg-warm)',
              aspectRatio: '1/1',
              boxShadow: 'var(--shadow-float)',
              border: '2px solid var(--color-outline)',
            }}>
              {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="img-hover"
                onLoad={() => setImgLoaded(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: imgLoaded ? 'block' : 'none' }}
              />

              {/* Floating badges on image */}
              <div style={{ position: 'absolute', top: 18, left: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="tag tag-sky">Hand-crocheted</span>
                {product.isLimitedEdition && <span className="tag tag-blush">Limited Edition</span>}
                {product.isBestseller && <span className="tag tag-warm">⭐ Bestseller</span>}
                {product.isNewArrival && <span className="tag tag-primary">New Arrival</span>}
              </div>

              {/* Heart corner */}
              <button
                className="btn"
                style={{
                  position: 'absolute', top: 18, right: 18,
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(250, 246, 240, 0.9)',
                  backdropFilter: 'blur(8px)',
                  border: '1.5px solid var(--color-outline)',
                  color: 'var(--color-blush-dark)',
                }}
              >
                <Heart size={18} />
              </button>
            </div>

            {/* Stars row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20, paddingLeft: 4 }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="var(--color-warm)" color="var(--color-warm)" />)}
              </div>
              <span style={{ fontSize: '0.84rem', color: 'var(--color-ink-muted)', fontWeight: 600 }}>5.0 · Loved by every owner</span>
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Name & price */}
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900,
                color: 'var(--color-ink)',
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
                marginBottom: 12,
              }}>
                {product.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  ₹{product.price.toFixed(0)}
                </span>
                <span style={{ fontSize: '0.84rem', color: 'var(--color-ink-faint)', textDecoration: 'line-through' }}>
                  ₹{(product.price * 1.2).toFixed(0)}
                </span>
                <span className="tag tag-accent" style={{ fontSize: '0.7rem' }}>20% off</span>
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
              {product.description}
            </p>

            {/* Quantity */}
            <div>
              <p className="label-caps" style={{ marginBottom: 12 }}>Quantity</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="btn"
                  style={{ width: 42, height: 42, borderRadius: '12px 0 0 12px', border: '1.5px solid var(--color-outline)', borderRight: 'none', background: 'white', color: 'var(--color-ink)' }}
                >
                  <Minus size={15} />
                </button>
                <div style={{
                  width: 52, height: 42,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1.5px solid var(--color-outline)',
                  fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem',
                  background: 'white',
                  color: 'var(--color-ink)',
                }}>
                  {qty}
                </div>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="btn"
                  style={{ width: 42, height: 42, borderRadius: '0 12px 12px 0', border: '1.5px solid var(--color-outline)', borderLeft: 'none', background: 'white', color: 'var(--color-ink)' }}
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={() => onNavigate('checkout', product)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '17px', fontSize: '1rem', borderRadius: 16 }}
              >
                <Heart size={18} />
                Adopt Now · ₹{(product.price * qty).toFixed(0)}
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className="btn btn-outline"
                style={{ width: '100%', padding: '15px', fontSize: '0.95rem', borderRadius: 16 }}
              >
                Continue Shopping
              </button>
            </div>

            {/* What's Inside */}
            <div style={{
              background: 'var(--color-accent-pale)',
              border: '1.5px solid rgba(74,124,89,0.2)',
              borderRadius: 20,
              padding: '24px 24px',
            }}>
              <p className="label-caps" style={{ color: 'var(--color-accent-dark)', marginBottom: 16 }}>What's Inside</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {features.map(({ icon, text }, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.9rem', color: 'var(--color-ink-muted)', fontWeight: 500 }}>
                    <span style={{ color: 'var(--color-accent)', flexShrink: 0 }}>{icon}</span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Care tag */}
            <div style={{
              background: 'var(--color-warm-pale)',
              border: '1.5px dashed var(--color-warm-dark)',
              borderRadius: 18,
              padding: '20px 22px',
              display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <Droplets size={22} color="var(--color-warm-dark)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, color: 'var(--color-ink)' }}>Care Instructions</p>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-ink-muted)', lineHeight: 1.65 }}>
                  Treat gently. Hand wash only with mild soap and lukewarm water. Lay flat on a dry towel to reshape and air dry. Do not tumble dry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
