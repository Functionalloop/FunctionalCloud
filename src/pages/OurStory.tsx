import { Heart, ArrowRight, Instagram, MessageCircle } from "lucide-react";
import { PageProps } from "../types";

const TIMELINE = [
  {
    year: '2018',
    emoji: '🧶',
    title: 'The first stitch',
    desc: 'It began on a quiet afternoon with a single skein of dusty rose yarn and a slightly worn velvet armchair. The very first scarf — lopsided, imperfect, and perfect.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALYePb58Tuo4pj8pSxRhev8zCqnJ8XWutgNoAhQxbD11Tv7TfyFvsdB-6xbl_QeB4OqHhOhK-qsESHI07vZ1XrEoRBgRogqQiiNk8GPqhNksWL4dsl_O4psg7EU5GoBf0xpJZJzRd34krz9vphXoFSROFyL0qwp2KDkxJU1g65llk0r0SlC1IKzgCmxJrKaRIT_2WLOssFSVyX0pZbD5ES3o97ZjUKDk623MpkdbWWqh67r86tyhbHHCYyCJmxclIuiJ33Bza9i1o',
    tag: 'The beginning',
    tagColor: 'var(--color-primary)',
  },
  {
    year: '2020',
    emoji: '📸',
    title: 'Finding our people',
    desc: 'The pandemic slowed the world, but it grew our craft. We started sharing on Instagram — little square photographs of amigurumi and crochet creatures. The response floored us.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZdNJ-ZNoXTaIWroh4u43VIVI9coimbqXRor_2mSLfcN9KtWIRTAb5170aXwJ3xfui686utoHFQLNAIgA-zie5vPyG29HZ-C0VaE8G9pPe-eiVAMHHFqhU6wHlSf1Y6z92h0wXiNFB2zSlqMPa3uqcjzjAxcnw1zdS3GpIYBnSICoMjEsOdLGO_n0ZQ0oGG-UfL3azbl1ryKZiLZCo2yYHgMLcakap64NN46vES7QRHR7iTJaDfrepyZjO8tWDslb9mwslEwAcXSA',
    tag: 'Community born',
    tagColor: 'var(--color-accent)',
  },
  {
    year: '2022',
    emoji: '🌸',
    title: 'Cloud Bloom is born',
    desc: 'From hobby to haven. Cloud Bloom launched as a real store — a place for handmade crochet creations, made with patience, care, and the softest yarn we could find.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0RBy9FAVri1vAabn5d9TFD06b7CUHADd4s8vRsXv0SNT-pEzeAkwsAYAbJpdMIKFi7vAWVT0BwvQe6IRa82XTAvLY5-kqWyyM_R2qnAZq8HU2NsT2G7uofClUru-3tDeD04HK1G8jH2mqBpIaiOE_28Eq9VmHz0XMI_eKd-UtPOFQZv5nXD32gK2nLieA6KV4ZlRddu_yO8CyaBPScTXe2jFPKRmVMLRovyGpH3unLZLcuJCIY3OPY4Ylda2G5ZG1TE8aT6QA8Ug',
    tag: 'Brand launched',
    tagColor: 'var(--color-warm-dark)',
  },
];

const VALUES = [
  { emoji: '🤲', title: 'Handcrafted always', desc: 'Every single item is made by hand, never mass-produced. That\'s our absolute, non-negotiable promise.' },
  { emoji: '🌱', title: 'Slow & intentional', desc: 'We believe in making things mindfully. Quality over quantity. Love over speed.' },
  { emoji: '💛', title: 'Community first', desc: 'We\'re not just a store — we\'re a little community of people who love beautiful, handmade things.' },
  { emoji: '🇮🇳', title: 'Made in India', desc: 'Proudly handcrafted in India, celebrating the warmth and craft tradition of our homeland.' },
];

export default function OurStory({ onNavigate }: PageProps) {
  return (
    <div className="page-enter" style={{ paddingTop: 90, overflowX: 'hidden' }}>

      {/* ── Hero ── */}
      <section style={{ padding: 'clamp(48px, 8vw, 96px) 0 clamp(48px, 6vw, 72px)', textAlign: 'center', position: 'relative' }}>
        {/* BG blobs */}
        <div className="float-a" style={{ position: 'absolute', top: 0, right: '5%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,133,90,0.1), transparent 70%)', pointerEvents: 'none' }} />
        <div className="float-b" style={{ position: 'absolute', bottom: 0, left: '5%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(127,186,143,0.1), transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="label-caps" style={{ marginBottom: 14 }}>About us</p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            marginBottom: 20,
            color: 'var(--color-ink)',
          }}>
            How It All<br />
            <span style={{ color: 'var(--color-primary)', fontStyle: 'italic' }}>Started</span>
          </h1>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.75, color: 'var(--color-ink-muted)', maxWidth: 520, margin: '0 auto 36px' }}>
            Every stitch holds a story. Ours began not in a factory, but on a quiet afternoon with a single skein of dusty rose yarn and a dream of making something beautiful.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('shop')} className="btn btn-primary">
              Shop Now <ArrowRight size={16} />
            </button>
            <a
              href="https://www.instagram.com/cloud_bloom_09/"
              target="_blank" rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ textDecoration: 'none' }}
            >
              <Instagram size={16} />
              Follow along
            </a>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section style={{ paddingBottom: 96 }}>
        <div className="container">
          <p className="label-caps" style={{ marginBottom: 14, textAlign: 'center' }}>Our journey</p>
          <h2 className="section-headline" style={{ textAlign: 'center', marginBottom: 64 }}>
            Stitch by stitch,<br />
            <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>year by year</span>
          </h2>

          {TIMELINE.map((item, i) => (
            <div key={item.year} style={{
              display: 'grid',
              gridTemplateColumns: i % 2 === 0 ? '1fr 80px 1fr' : '1fr 80px 1fr',
              gap: '0 0',
              marginBottom: 48,
              alignItems: 'center',
            }}>
              {/* Left content */}
              <div style={{ gridColumn: i % 2 === 0 ? 1 : 3, padding: '0 40px 0 0' }}>
                {i % 2 === 0 && (
                  <div style={{
                    background: 'white',
                    borderRadius: 28,
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lift)',
                    border: '2px solid var(--color-outline)',
                    transform: `rotate(${i % 2 === 0 ? '-1.5deg' : '1.5deg'})`,
                    transition: 'transform 0.4s ease',
                  }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: '20px 24px 24px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: item.tagColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {item.year} · {item.tag}
                      </span>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginTop: 6, color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
                        {item.title}
                      </p>
                    </div>
                  </div>
                )}
                {i % 2 !== 0 && (
                  <div style={{ textAlign: 'right', paddingRight: 0 }}>
                    <span className="tag" style={{ background: item.tagColor, color: 'white', marginBottom: 12, display: 'inline-flex' }}>
                      {item.emoji} {item.year}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12, color: 'var(--color-ink)' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                      {item.desc}
                    </p>
                  </div>
                )}
              </div>

              {/* Timeline center line */}
              <div style={{ gridColumn: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                <div style={{ flex: 1, width: 2, background: 'var(--color-outline)', minHeight: 40 }} />
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: item.tagColor,
                  color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem',
                  flexShrink: 0,
                  boxShadow: `0 4px 16px ${item.tagColor}55`,
                  zIndex: 1,
                }}>
                  {item.emoji}
                </div>
                <div style={{ flex: 1, width: 2, background: 'var(--color-outline)', minHeight: 40 }} />
              </div>

              {/* Right content */}
              <div style={{ gridColumn: i % 2 === 0 ? 3 : 1, padding: i % 2 === 0 ? '0 0 0 40px' : '0 40px 0 0' }}>
                {i % 2 !== 0 && (
                  <div style={{
                    background: 'white',
                    borderRadius: 28,
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lift)',
                    border: '2px solid var(--color-outline)',
                    transform: 'rotate(1.5deg)',
                    transition: 'transform 0.4s ease',
                  }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: '20px 24px 24px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: item.tagColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {item.year} · {item.tag}
                      </span>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginTop: 6, color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
                        {item.title}
                      </p>
                    </div>
                  </div>
                )}
                {i % 2 === 0 && (
                  <div>
                    <span className="tag" style={{ background: item.tagColor, color: 'white', marginBottom: 12, display: 'inline-flex' }}>
                      {item.emoji} {item.year}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12, color: 'var(--color-ink)' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                      {item.desc}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ paddingBottom: 96, background: 'var(--color-bg-warm)' }}>
        <div className="container" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <p className="label-caps" style={{ marginBottom: 14, textAlign: 'center' }}>What we believe</p>
          <h2 className="section-headline" style={{ textAlign: 'center', marginBottom: 56 }}>
            Our <span style={{ color: 'var(--color-primary)', fontStyle: 'italic' }}>values</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 20 }}>
            {VALUES.map(({ emoji, title, desc }) => (
              <div key={title} style={{
                background: 'white',
                borderRadius: 24,
                padding: '32px 28px',
                boxShadow: 'var(--shadow-soft)',
                border: '1.5px solid var(--color-outline)',
                transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lift)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-soft)'; }}
              >
                <p style={{ fontSize: '2.2rem', marginBottom: 16 }}>{emoji}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 10, color: 'var(--color-ink)' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--color-ink-muted)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingTop: 80, paddingBottom: 96 }}>
        <div className="container">
          <div style={{
            background: 'var(--color-primary)',
            borderRadius: 36,
            padding: 'clamp(48px, 6vw, 80px)',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div className="float-a" style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
            <div className="float-b" style={{ position: 'absolute', bottom: -80, left: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: '2.5rem', marginBottom: 16 }}>🧸</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 16 }}>
                Find your new cozy companion
              </h2>
              <p style={{ fontSize: '1rem', opacity: 0.85, maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.7 }}>
                Every piece in our shop is waiting to be adopted. Hand-crocheted, one of a kind, made with love.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => onNavigate('shop')} className="btn" style={{ background: 'white', color: 'var(--color-primary)', borderRadius: 99, padding: '15px 32px', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                  Shop the Collection →
                </button>
                <a href="https://wa.me/919272472780" target="_blank" rel="noopener noreferrer" className="btn" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: 99, padding: '13px 26px', fontWeight: 600, fontSize: '0.95rem', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                  <MessageCircle size={16} />
                  Custom Order
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
