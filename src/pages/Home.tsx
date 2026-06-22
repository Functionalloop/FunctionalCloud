import { PageProps, Product } from "../types";
import { useEffect, useRef, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { ArrowRight, Heart, Instagram, MessageCircle, Star, Sparkles } from "lucide-react";

/* ── Intersection Observer reveal hook ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Show immediately if already in viewport
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div style={{ background: 'white', borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-soft)' }}>
      <div className="skeleton" style={{ width: '100%', aspectRatio: '4/5' }} />
      <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 18, width: '70%' }} />
        <div className="skeleton" style={{ height: 14, width: '40%' }} />
      </div>
    </div>
  );
}

/* ── Marquee strip ── */
const MARQUEE_ITEMS = [
  "✦ Handmade Amigurumi",
  "✦ Crocheted Plushies",
  "✦ Cozy Home Decor",
  "✦ Limited Editions",
  "✦ Made in India",
  "✦ Ships Nationwide",
  "✦ Custom Orders",
  "✦ Handmade Amigurumi",
  "✦ Crocheted Plushies",
  "✦ Cozy Home Decor",
  "✦ Limited Editions",
  "✦ Made in India",
  "✦ Ships Nationwide",
  "✦ Custom Orders",
];



export default function Home({ onNavigate }: PageProps) {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const sectionRef1 = useReveal();
  const sectionRef2 = useReveal();
  const sectionRef3 = useReveal();

  /* Cursor blob */
  useEffect(() => {
    const move = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const q = query(collection(db, "products"), where("isNewArrival", "==", true));
        const snap = await getDocs(q);
        setNewArrivals(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  return (
    <div className="page-enter" style={{ paddingTop: 90, overflowX: 'hidden' }}>

      {/* ── Cursor blob ── */}
      <div
        id="cursor-blob"
        style={{ left: mousePos.x, top: mousePos.y }}
        aria-hidden
      />

      {/* ─────────────────────────────── HERO ─────────────────────────────── */}
      <section style={{ paddingTop: '120px', paddingBottom: '80px', position: 'relative' }}>
        <div className="container" style={{ position: 'relative' }}>

          {/* Background decoration blobs */}
          <div className="float-a" style={{
            position: 'absolute', top: '-60px', right: '-40px',
            width: 480, height: 480,
            borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
            background: 'radial-gradient(circle at 40% 40%, rgba(232, 133, 90, 0.18), rgba(248, 196, 125, 0.1) 60%, transparent)',
            pointerEvents: 'none', zIndex: 0,
          }} />
          <div className="float-b" style={{
            position: 'absolute', bottom: '-80px', left: '-60px',
            width: 360, height: 360,
            borderRadius: '40% 60% 30% 70% / 60% 40% 50% 50%',
            background: 'radial-gradient(circle, rgba(127, 186, 143, 0.15), transparent 70%)',
            pointerEvents: 'none', zIndex: 0,
          }} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))',
            gap: '48px',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}>

            {/* ── Left: copy ── */}
            <div>
              {/* Rubber stamp label — replace old pill tags */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, marginBottom: 28, position: 'relative' }}>
                {/* Stamp block */}
                <div style={{
                  display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
                  border: '3px solid var(--color-primary)',
                  padding: '6px 16px 5px',
                  position: 'relative',
                  transform: 'rotate(-2deg)',
                }}>
                  {/* inner thin border */}
                  <div style={{ position: 'absolute', inset: 3, border: '1px solid var(--color-primary)', pointerEvents: 'none', opacity: 0.5 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-primary)', lineHeight: 1 }}>Est.</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-primary)', lineHeight: 1.1 }}>2018</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-primary)', lineHeight: 1.1 }}>Handmade</span>
                </div>
                {/* Separator thread line */}
                <div style={{ width: 28, height: 2, background: 'repeating-linear-gradient(90deg, var(--color-outline) 0px, var(--color-outline) 4px, transparent 4px, transparent 8px)', margin: '0 6px' }} />
                {/* Live badge */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px',
                  background: 'var(--color-accent)',
                  clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', opacity: 0.9, animation: 'pulse 1.6s ease-in-out infinite', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'white' }}>New drops weekly</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="hero-headline" style={{ marginBottom: 24, position: 'relative' }}>
                <span style={{ display: 'block' }}>Stitch by</span>
                <span style={{
                  display: 'block',
                  color: 'var(--color-primary)',
                  fontStyle: 'italic',
                  position: 'relative',
                }}>
                  stitch,
                  <svg
                    aria-hidden
                    style={{ position: 'absolute', bottom: -8, left: 0, width: '100%', height: 14, overflow: 'visible' }}
                    viewBox="0 0 300 14" preserveAspectRatio="none"
                  >
                    <path d="M0,10 Q37.5,2 75,10 T150,10 T225,10 T300,10" stroke="var(--color-warm)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
                <span style={{ display: 'block' }}>made with</span>
                <span style={{ display: 'block', color: 'var(--color-accent)' }}>love.</span>
              </h1>

              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-ink-muted)', maxWidth: 460, marginBottom: 36 }}>
                Discover our whimsical world of amigurumi and crochet creations — each piece a cozy little companion, handcrafted to bring warmth to your home and joy to your heart.
              </p>

              {/* CTA row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 48 }}>
                <button onClick={() => onNavigate('shop')} className="btn btn-primary" style={{ fontSize: '0.95rem', padding: '15px 30px' }}>
                  Shop the Collection
                  <ArrowRight size={16} />
                </button>
                <button onClick={() => onNavigate('story')} className="btn btn-outline" style={{ fontSize: '0.95rem', padding: '13px 28px' }}>
                  Our Story
                </button>
              </div>

              {/* Perks — bold slash list instead of pill badges */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                gap: 0, rowGap: 6,
                borderTop: '2px solid var(--color-outline)',
                paddingTop: 20,
              }}>
                {[
                  { emoji: '🤲', text: 'Handcrafted' },
                  { emoji: '🌿', text: 'Eco yarn' },
                  { emoji: '📦', text: 'Gift-ready' },
                  { emoji: '⚡', text: 'Fast ship' },
                ].map(({ emoji, text }, i, arr) => (
                  <span key={text} style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      color: 'var(--color-ink)',
                      letterSpacing: '-0.01em',
                    }}>
                      {emoji} {text}
                    </span>
                    {i < arr.length - 1 && (
                      <span style={{
                        display: 'inline-block', width: 22, textAlign: 'center',
                        color: 'var(--color-outline-strong)',
                        fontWeight: 300, fontSize: '1rem',
                      }}>/</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Right: image cluster ── */}
            <div style={{ position: 'relative', height: 520 }}>

              {/* Main hero image */}
              <div
                className="float-c"
                style={{
                  position: 'absolute',
                  top: '5%', left: '5%', right: '5%',
                  background: 'white',
                  borderRadius: 32,
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-float)',
                  border: '3px solid var(--color-outline)',
                  height: 420,
                  zIndex: 2,
                }}
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC49aj1bU9GZYohvjrCtijRPFIwom_3Z74aeo0kLv9iQJchkEPN7UyH6YK4PazfUDyr_Jdif8lbw_jzWsi9zwZGMQ2j4M1_mJk9RfmGGcWcFHQjTykZQvOqIEMNqkfv9X68SprxQDK4nyz4dmy1F_wnKrjBIr5jgYx-tzO_jEocPEwZQuq51k_bZ6SUGmdxtJ6WC0xsE65uV5pQs1ZpC6B-uDrI-8gfARQNlIPf2qiRl-nFaqWapnd0208oWkLTjDgTD6DW48DvEC0"
                  alt="Handcrafted crochet plushie"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Overlay label */}
                <div style={{
                  position: 'absolute', bottom: 20, left: 20, right: 20,
                  background: 'rgba(250, 246, 240, 0.92)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 16,
                  padding: '12px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  border: '1.5px solid rgba(196,98,45,0.2)',
                }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-ink)' }}>Featured Plushie</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)', marginTop: 2 }}>Hand-crocheted • One of a kind</p>
                  </div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={12} fill="var(--color-warm)" color="var(--color-warm)" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge — top right */}
              <div style={{
                position: 'absolute', top: 0, right: 0, zIndex: 3,
                background: 'var(--color-primary)',
                color: 'white',
                borderRadius: '50%',
                width: 90, height: 90,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                fontWeight: 900,
                lineHeight: 1.15,
                textAlign: 'center',
                letterSpacing: '-0.02em',
                boxShadow: '0 8px 24px rgba(196,98,45,0.4)',
                animation: 'floatC 6s ease-in-out infinite alternate',
              }}>
                <span style={{ fontSize: '1.4rem' }}>✦</span>
                <span>New<br/>weekly</span>
              </div>

              {/* Floating price card — bottom left */}
              <div style={{
                position: 'absolute', bottom: 10, left: -16, zIndex: 4,
                background: 'white',
                borderRadius: 18,
                padding: '14px 20px',
                boxShadow: 'var(--shadow-lift)',
                border: '1.5px solid var(--color-outline)',
                display: 'flex', alignItems: 'center', gap: 12,
                animation: 'floatB 7s ease-in-out infinite alternate',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'var(--color-accent-pale)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-accent)',
                }}>
                  <Heart size={20} fill="var(--color-accent-light)" />
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-ink-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Starting at</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)' }}>₹299</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── MARQUEE STRIP ─────────────── */}
      <div style={{
        background: 'var(--color-primary)',
        color: 'white',
        padding: '14px 0',
        overflow: 'hidden',
        marginBottom: 80,
        borderTop: '2px solid var(--color-primary-dark)',
        borderBottom: '2px solid var(--color-primary-dark)',
      }}>
        <div className="marquee-wrap" style={{ overflow: 'hidden' }}>
          <div className="marquee-track">
            {MARQUEE_ITEMS.map((item, i) => (
              <span
                key={i}
                className="font-mono"
                style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', flexShrink: 0, paddingRight: '2rem' }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────── NEWLY HATCHED ─────────────── */}
      <section ref={sectionRef1} className="reveal" style={{ paddingBottom: 96 }}>
        <div className="container">

          {/* Section header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p className="label-caps" style={{ marginBottom: 10 }}>Fresh off the hook</p>
              <h2 className="section-headline" style={{ color: 'var(--color-ink)' }}>
                Newly<br />
                <span style={{ color: 'var(--color-primary)', fontStyle: 'italic' }}>Hatched</span> 🐣
              </h2>
            </div>
            <button onClick={() => onNavigate('shop')} className="btn btn-outline" style={{ alignSelf: 'flex-end', flexShrink: 0 }}>
              View All <ArrowRight size={15} />
            </button>
          </div>

          {/* Product grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 24 }}>
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          ) : newArrivals.length > 0 ? (
            <div
              className="stagger"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 24 }}
            >
              {newArrivals.slice(0, 3).map(product => (
                <article
                  key={product.id}
                  className="yarn-card"
                  onClick={() => onNavigate('product', product.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/5' }}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="img-hover"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {/* Badges */}
                    <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span className="tag tag-primary">New Arrival</span>
                    </div>
                    {/* Quick shop overlay */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(26, 18, 8, 0.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                      className="quick-shop-overlay"
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0'}
                    >
                      <span style={{
                        background: 'white', color: 'var(--color-ink)',
                        fontWeight: 700, fontSize: '0.9rem',
                        padding: '10px 24px', borderRadius: 99,
                        transform: 'translateY(8px)',
                        transition: 'transform 0.3s ease',
                      }}>
                        View Details →
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '18px 20px 22px' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--color-ink)',
                      marginBottom: 6,
                      letterSpacing: '-0.02em',
                    }}>
                      {product.name}
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="price-tag">₹{product.price.toFixed(0)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onNavigate('checkout', product); }}
                        className="btn"
                        style={{
                          width: 40, height: 40, borderRadius: '50%',
                          background: 'var(--color-primary)',
                          color: 'white',
                          flexShrink: 0,
                          boxShadow: '0 4px 12px rgba(196,98,45,0.3)',
                        }}
                        aria-label="Add to cart"
                      >
                        <Heart size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '80px 20px',
              background: 'var(--color-bg-warm)',
              borderRadius: 24,
              border: '2px dashed var(--color-outline)',
            }}>
              <p style={{ fontSize: '2rem', marginBottom: 12 }}>🧶</p>
              <p style={{ color: 'var(--color-ink-muted)', fontWeight: 500 }}>
                New arrivals coming soon — check back!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────── VALUES / FEATURE BENTO ─────────────── */}
      <section ref={sectionRef2} className="reveal" style={{ paddingBottom: 96 }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 20,
          }}>

            {/* Large left card */}
            <div style={{
              gridColumn: 'span 1',
              background: 'var(--color-primary)',
              borderRadius: 28,
              padding: '40px 36px',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              position: 'relative',
              overflow: 'hidden',
              minHeight: 280,
            }}>
              <div className="float-a" style={{
                position: 'absolute', top: -40, right: -40,
                width: 200, height: 200,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                pointerEvents: 'none',
              }} />
              <span style={{ fontSize: '2.5rem' }}>🧶</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                Slow made,<br />soul filled.
              </h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.85, lineHeight: 1.7, maxWidth: 280 }}>
                Every piece is crocheted by hand, stitch by stitch, with patience and craft tradition rooted in love.
              </p>
              <button onClick={() => onNavigate('story')} className="btn" style={{
                marginTop: 'auto', background: 'rgba(255,255,255,0.15)',
                color: 'white', borderRadius: 99, padding: '10px 22px',
                fontSize: '0.85rem', fontWeight: 700,
                border: '1.5px solid rgba(255,255,255,0.3)',
                alignSelf: 'flex-start',
              }}>
                Read the story →
              </button>
            </div>

            {/* Stats column — typewriter ticker style */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Stat 1 */}
              <div style={{
                flex: 1,
                background: 'var(--color-ink)',
                borderRadius: 24,
                padding: '28px 28px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* grid pattern overlay */}
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.07,
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  pointerEvents: 'none',
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>↳ customers served</p>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontWeight: 900,
                    fontSize: '3.2rem', letterSpacing: '-0.05em', lineHeight: 1,
                    color: 'white',
                  }}>500<span style={{ color: 'var(--color-primary-light)' }}>+</span></p>
                </div>
                <div style={{ position: 'relative', zIndex: 1, marginTop: 12 }}>
                  <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                    <div style={{ width: '78%', height: '100%', background: 'var(--color-primary)', borderRadius: 2 }} />
                  </div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: 6, letterSpacing: '0.08em' }}>and growing 🌱</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div style={{
                flex: 1,
                background: 'var(--color-warm-pale)',
                borderRadius: 24,
                padding: '28px 28px',
                position: 'relative', overflow: 'hidden',
                border: '2px dashed var(--color-warm)',
              }}>
                {/* diagonal stripe */}
                <div style={{
                  position: 'absolute', top: 0, right: 0, bottom: 0,
                  width: '40%',
                  background: 'repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(184,134,45,0.06) 6px, rgba(184,134,45,0.06) 12px)',
                  pointerEvents: 'none',
                }} />
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-warm-dark)', opacity: 0.7, marginBottom: 8 }}>↳ every single piece</p>
                <p style={{
                  fontFamily: 'var(--font-display)', fontWeight: 900,
                  fontSize: '3rem', letterSpacing: '-0.05em', lineHeight: 1,
                  color: 'var(--color-warm-dark)',
                }}>hand<br/>crafted.</p>
              </div>
            </div>

            {/* Custom order card */}
            <div style={{
              background: 'var(--color-bg-warm)',
              borderRadius: 28,
              padding: '36px 32px',
              border: '2px dashed var(--color-outline-strong)',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              minHeight: 260,
            }}>
              <span style={{ fontSize: '2.2rem' }}>🎁</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-ink)', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                Custom orders available!
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)', lineHeight: 1.65 }}>
                Want something made just for you? We do custom plushies, gifts, and home decor. Just reach out on WhatsApp.
              </p>
              <a
                href="https://wa.me/919272472780"
                target="_blank" rel="noopener noreferrer"
                className="btn btn-accent"
                style={{ alignSelf: 'flex-start', marginTop: 'auto', textDecoration: 'none', fontSize: '0.88rem', padding: '11px 22px' }}
              >
                <MessageCircle size={15} />
                Chat with us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── INSTAGRAM / SOCIAL CTA ─────────────── */}
      <section ref={sectionRef3} className="reveal" style={{ paddingBottom: 96 }}>
        <div className="container">
          <div style={{
            background: 'var(--color-ink)',
            borderRadius: 36,
            padding: 'clamp(40px, 6vw, 72px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 24,
            position: 'relative',
            overflow: 'hidden',
          }}>

            {/* Decorative circles */}
            <div className="float-a" style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(196,98,45,0.12)', pointerEvents: 'none' }} />
            <div className="float-b" style={{ position: 'absolute', bottom: -80, left: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(127,186,143,0.1)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p className="label-caps" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>Join the community</p>
              <h2 className="section-headline" style={{ color: 'white', marginBottom: 16 }}>
                Follow us on<br />
                <span style={{ color: 'var(--color-primary-light)', fontStyle: 'italic' }}>Instagram</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', maxWidth: 440, lineHeight: 1.7, marginBottom: 36 }}>
                Behind-the-scenes of the craft, new drops first, and a community of crochet lovers. Come say hi! 👋
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                <a
                  href="https://www.instagram.com/cloud_bloom_09/"
                  target="_blank" rel="noopener noreferrer"
                  className="btn"
                  style={{
                    textDecoration: 'none', borderRadius: 99, padding: '14px 28px',
                    background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366)',
                    color: 'white', fontSize: '0.95rem', fontWeight: 700,
                    boxShadow: '0 8px 24px rgba(220,39,67,0.4)',
                  }}
                >
                  <Instagram size={17} />
                  @cloud_bloom_09
                </a>
                <a
                  href="https://wa.me/919272472780"
                  target="_blank" rel="noopener noreferrer"
                  className="btn"
                  style={{
                    textDecoration: 'none', borderRadius: 99, padding: '13px 26px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    color: 'white', fontSize: '0.95rem', fontWeight: 600,
                  }}
                >
                  <MessageCircle size={17} />
                  WhatsApp us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── NEWSLETTER / WHATSAPP ─────────────── */}
      <section style={{ paddingBottom: 96 }}>
        <div className="container">
          <div style={{
            background: 'var(--color-primary-pale)',
            border: '2px dashed rgba(196,98,45,0.3)',
            borderRadius: 32,
            padding: 'clamp(36px, 5vw, 64px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            gap: 40,
            alignItems: 'center',
          }}>
            {/* Text */}
            <div>
              <span className="tag tag-primary" style={{ marginBottom: 16, display: 'inline-flex' }}>
                <Sparkles size={10} />
                Exclusive updates
              </span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                fontWeight: 800,
                color: 'var(--color-ink)',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
                marginBottom: 14,
              }}>
                Join the Cloud Bloom community
              </h2>
              <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                Get first access to new arrivals, crafting tips, and a special 10% off your first order when you send us your number on WhatsApp. 🎉
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={e => e.preventDefault()}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <input
                className="input-field"
                type="tel"
                placeholder="Your WhatsApp number (+91...)"
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '15px', fontSize: '0.95rem' }}
              >
                Get 10% off → Join Now
              </button>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-faint)', textAlign: 'center' }}>
                No spam. Pinky promise 🤙 Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
