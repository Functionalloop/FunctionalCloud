import { Page } from '../App';
import { Instagram, MessageCircle, Heart, ArrowRight } from 'lucide-react';

const NAV_LINKS: { page: Page; label: string }[] = [
  { page: 'home', label: 'Home' },
  { page: 'shop', label: 'Shop' },
  { page: 'story', label: 'Our Story' },
  { page: 'care', label: 'Care Tips' },
];

export default function Footer({ onNavigate }: { onNavigate?: (page: Page) => void }) {
  const go = (page: Page) => onNavigate?.(page);

  return (
    <footer style={{
      background: 'var(--color-ink)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      marginTop: 0,
    }}>
      {/* Decorative arcs */}
      <div className="float-a" style={{ position: 'absolute', top: -80, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'rgba(196,98,45,0.1)', pointerEvents: 'none' }} />
      <div className="float-b" style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(127,186,143,0.08)', pointerEvents: 'none' }} />

      {/* Top band — CTA */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: 'clamp(36px, 5vw, 64px) 0',
      }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 28 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>
              HANDMADE IN INDIA
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, color: 'white' }}>
              Cloud Bloom
              <span style={{ display: 'inline-block', marginLeft: 10, fontSize: '1.5rem' }}>🌸</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', marginTop: 10, maxWidth: 340, lineHeight: 1.65 }}>
              Handcrafted amigurumi & crochet creations made with love, stitch by stitch.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => go('shop')}
              className="btn"
              style={{
                background: 'var(--color-primary)', color: 'white',
                borderRadius: 99, padding: '14px 28px',
                fontWeight: 700, fontSize: '0.95rem',
                boxShadow: '0 6px 20px rgba(196,98,45,0.4)',
              }}
            >
              Shop Collection <ArrowRight size={15} />
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              <a
                href="https://www.instagram.com/cloud_bloom_09/"
                target="_blank" rel="noopener noreferrer"
                className="btn"
                style={{
                  textDecoration: 'none', flex: 1, justifyContent: 'center',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white', borderRadius: 99, padding: '11px 18px',
                  fontSize: '0.85rem', fontWeight: 600,
                }}
              >
                <Instagram size={15} />
                Instagram
              </a>
              <a
                href="https://wa.me/919272472780"
                target="_blank" rel="noopener noreferrer"
                className="btn"
                style={{
                  textDecoration: 'none', flex: 1, justifyContent: 'center',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white', borderRadius: 99, padding: '11px 18px',
                  fontSize: '0.85rem', fontWeight: 600,
                }}
              >
                <MessageCircle size={15} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Middle — nav + info */}
      <div style={{ padding: 'clamp(32px, 4vw, 56px) 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 40 }}>
          {/* Pages */}
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 18 }}>
              Navigate
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {NAV_LINKS.map(({ page, label }) => (
                <button
                  key={page}
                  onClick={() => go(page)}
                  className="link-hover"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left', padding: 0,
                    fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'var(--font-body)', fontWeight: 500,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'white'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 18 }}>
              Get in touch
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="https://wa.me/919272472780" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'white'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'}
              >
                +91 92724 72780
              </a>
              <a href="https://www.instagram.com/cloud_bloom_09/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'white'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'}
              >
                @cloud_bloom_09
              </a>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginTop: 4 }}>
                Custom orders welcome.<br />DM us for enquiries!
              </p>
            </div>
          </div>

          {/* Tagline card */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20,
            padding: '24px 22px',
          }}>
            <p style={{ fontSize: '1.5rem', marginBottom: 12 }}>🧶</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: 8, lineHeight: 1.25 }}>
              "Made with patience,<br />worn with joy."
            </p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>— The Cloud Bloom team</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ padding: '20px 0' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
            © 2024 Cloud Bloom · Developed by Functional Enterprises
          </p>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 5 }}>
            Made with <Heart size={11} fill="var(--color-primary)" color="var(--color-primary)" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
