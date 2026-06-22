import { ShoppingBasket, User, LogIn, Menu, X, Sparkles } from 'lucide-react';
import { Page } from '../App';
import { useState, useEffect, useRef } from 'react';
import { User as FirebaseUser } from 'firebase/auth';

export default function Navigation({
  currentPage,
  onNavigate,
  user,
}: {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user?: FirebaseUser | null;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navState, setNavState] = useState<'top' | 'solid' | 'hidden'>('top');
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const prev = lastScrollY.current;

      if (y < 60) {
        setNavState('top');
      } else if (y > prev && y > 120) {
        setNavState('hidden');
      } else if (y < prev) {
        setNavState('solid');
      }

      lastScrollY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks: { page: Page; label: string }[] = [
    { page: 'home', label: 'Home' },
    { page: 'shop', label: 'Shop' },
    { page: 'story', label: 'Our Story' },
  ];

  const go = (page: Page) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  const isTop = navState === 'top';
  const isHidden = navState === 'hidden';

  return (
    <>
      {/* ─── Main Header ─── */}
      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
          background: isTop
            ? 'linear-gradient(to bottom, rgba(240, 232, 220, 0.7) 0%, transparent 100%)'
            : 'rgba(250, 246, 240, 0.97)',
          backdropFilter: isTop ? 'none' : 'blur(20px)',
          WebkitBackdropFilter: isTop ? 'none' : 'blur(20px)',
          borderBottom: isTop ? '1px solid transparent' : '1px solid rgba(196, 156, 110, 0.2)',
          boxShadow: isTop ? 'none' : '0 1px 24px rgba(26, 18, 8, 0.06)',
        }}
      >
        {/* ── Inner container ── */}
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: isTop ? '18px clamp(16px, 4vw, 40px)' : '12px clamp(16px, 4vw, 40px)',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 16,
          transition: 'padding 0.4s ease',
        }}>

          {/* ── Col 1: Logo ── */}
          <button
            onClick={() => go('home')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 0, textAlign: 'left',
              display: 'flex', flexDirection: 'column', gap: 2,
            }}
          >
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.52rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-primary)',
              lineHeight: 1,
            }}>
              ✦ handmade
            </span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              color: 'var(--color-ink)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              transition: 'font-size 0.4s ease',
            }}>
              Cloud Bloom
            </span>
          </button>

          {/* ── Col 2: Center Links (desktop only) ── */}
          {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
            {navLinks.map(({ page, label }) => {
              const active = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => go(page)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '8px 18px',
                    fontSize: '0.88rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: active ? 700 : 400,
                    color: active ? 'var(--color-ink)' : 'var(--color-ink-muted)',
                    position: 'relative',
                    letterSpacing: '0.01em',
                    transition: 'color 0.25s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-ink)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = active ? 'var(--color-ink)' : 'var(--color-ink-muted)'; }}
                >
                  {label}
                  {/* Underline indicator */}
                  <span style={{
                    position: 'absolute',
                    bottom: 3, left: 18, right: 18,
                    height: 1.5,
                    background: 'var(--color-primary)',
                    borderRadius: 2,
                    transformOrigin: 'center',
                    transform: active ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
                  }} />
                </button>
              );
            })}
          </nav>
          )}

          {/* ── Col 3: Right actions ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>

            {/* User — desktop only */}
            {!isMobile && user ? (
              <button
                onClick={() => go('checkout')}
                className="hidden md:flex"
                style={{
                  alignItems: 'center',
                  gap: 7,
                  padding: '4px 12px 4px 4px',
                  borderRadius: 99,
                  background: 'var(--color-bg-warm)',
                  border: '1.5px solid var(--color-outline)',
                  color: 'var(--color-ink)',
                  fontSize: '0.83rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-outline)'; }}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={13} color="white" />
                  </div>
                )}
                {user.displayName?.split(' ')[0] || 'Account'}
              </button>
            ) : (
              <button
                onClick={() => go('checkout')}
                className="hidden md:flex"
                style={{
                  alignItems: 'center', gap: 5,
                  padding: '8px 14px',
                  background: 'none', border: 'none',
                  color: 'var(--color-ink-muted)',
                  fontSize: '0.83rem', fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-ink)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-ink-muted)'; }}
              >
                <LogIn size={14} />
                Sign in
              </button>
            )}

            {/* Cart — always visible */}
            <button
              onClick={() => go('checkout')}
              aria-label="Cart"
              style={{
                width: 38, height: 38,
                borderRadius: '50%',
                background: isTop ? 'rgba(26,18,8,0.06)' : 'var(--color-bg-warm)',
                border: isTop ? '1px solid rgba(26,18,8,0.1)' : '1px solid var(--color-outline)',
                color: 'var(--color-ink-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-primary-pale)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isTop ? 'rgba(26,18,8,0.06)' : 'var(--color-bg-warm)';
                e.currentTarget.style.borderColor = isTop ? 'rgba(26,18,8,0.1)' : 'var(--color-outline)';
                e.currentTarget.style.color = 'var(--color-ink-muted)';
              }}
            >
              <ShoppingBasket size={16} />
            </button>

            {/* Hamburger — mobile only */}
            {isMobile && (
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                style={{
                  width: 38, height: 38,
                  borderRadius: '50%',
                  background: isTop ? 'rgba(26,18,8,0.06)' : 'var(--color-bg-warm)',
                  border: isTop ? '1px solid rgba(26,18,8,0.1)' : '1px solid var(--color-outline)',
                  color: 'var(--color-ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {/* Custom 3-line hamburger icon */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ display: 'block', width: 16, height: 1.5, background: 'currentColor', borderRadius: 2 }} />
                  <span style={{ display: 'block', width: 10, height: 1.5, background: 'currentColor', borderRadius: 2 }} />
                  <span style={{ display: 'block', width: 13, height: 1.5, background: 'currentColor', borderRadius: 2 }} />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* ── Thin progress-style accent line at very bottom of nav ── */}
        {!isTop && (
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0,
            height: 2,
            width: '100%',
            background: 'linear-gradient(90deg, transparent, var(--color-primary) 20%, var(--color-warm) 50%, var(--color-primary) 80%, transparent)',
            opacity: 0.35,
          }} />
        )}
      </header>

      {/* ─── Mobile overlay ─── */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 150,
          background: 'rgba(26,18,8,0.5)',
          backdropFilter: 'blur(8px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* ─── Mobile drawer ─── */}
      <div style={{
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        width: 'min(85vw, 320px)',
        zIndex: 160,
        background: 'var(--color-bg)',
        borderLeft: '1px solid var(--color-outline)',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-20px 0 80px rgba(26,18,8,0.12)',
        overflowY: 'auto',
      }}>

        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 20px 18px',
          borderBottom: '1px solid var(--color-outline)',
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: 3 }}>
              ✦ handmade
            </p>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-ink)', letterSpacing: '-0.03em' }}>
              Cloud Bloom
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--color-bg-warm)',
              border: '1px solid var(--color-outline)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--color-ink)',
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* User card */}
        {user && (
          <div style={{
            margin: '14px 16px 0',
            padding: '12px 14px',
            background: 'var(--color-primary-pale)',
            border: '1px solid rgba(196,98,45,0.12)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={16} color="white" />
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.displayName}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Nav links */}
        <div style={{ flex: 1, padding: '16px 12px 0' }}>
          {navLinks.map(({ page, label }) => {
            const active = currentPage === page;
            return (
              <button
                key={page}
                onClick={() => go(page)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '15px 16px',
                  borderRadius: 10,
                  background: active ? 'var(--color-primary-pale)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.15rem',
                  fontWeight: active ? 700 : 400,
                  color: active ? 'var(--color-primary)' : 'var(--color-ink)',
                  letterSpacing: '-0.02em',
                  marginBottom: 2,
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  width: 5, height: 5,
                  borderRadius: '50%',
                  background: active ? 'var(--color-primary)' : 'var(--color-outline)',
                  flexShrink: 0,
                  transition: 'background 0.2s',
                }} />
                {label}
                {active && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', letterSpacing: '0.1em', opacity: 0.7 }}>
                    ← here
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ margin: '12px 16px', height: 1, background: 'var(--color-outline)', opacity: 0.5 }} />

        {/* Bottom CTA */}
        <div style={{ padding: '0 16px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {!user && (
            <button
              onClick={() => go('checkout')}
              style={{
                padding: '12px',
                borderRadius: 12,
                background: 'var(--color-bg-warm)',
                color: 'var(--color-ink)',
                border: '1px solid var(--color-outline)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <LogIn size={14} />
              Sign in
            </button>
          )}

          <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--color-ink-faint)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 2 }}>
            <Sparkles size={10} />
            Handmade with love in India
          </p>
        </div>
      </div>
    </>
  );
}
