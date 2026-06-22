import { useEffect, useRef } from 'react';

export default function ParallaxBackground() {
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          if (layer1Ref.current)
            layer1Ref.current.style.transform = `translateY(${y * 0.15}px)`;
          if (layer2Ref.current)
            layer2Ref.current.style.transform = `translateY(${y * 0.08}px)`;
          if (layer3Ref.current)
            layer3Ref.current.style.transform = `translateY(${y * -0.06}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: -20,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: 'var(--color-bg)',
      }}
    >
      {/* Subtle warm grain texture layer */}
      <div
        ref={layer1Ref}
        style={{
          position: 'absolute',
          top: '-20%', left: '-10%',
          width: '120%', height: '140%',
          backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=60&w=1800&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.025,
          transform: 'translateY(0px)',
          transition: 'transform 60ms ease-out',
          filter: 'saturate(0)',
        }}
      />

      {/* Warm top-right glow */}
      <div
        ref={layer2Ref}
        style={{
          position: 'absolute',
          top: -200, right: -200,
          width: 800, height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,192,125,0.12) 0%, transparent 65%)',
          transform: 'translateY(0px)',
        }}
      />

      {/* Green bottom-left glow */}
      <div
        ref={layer3Ref}
        style={{
          position: 'absolute',
          bottom: -300, left: -200,
          width: 700, height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(127,186,143,0.1) 0%, transparent 65%)',
          transform: 'translateY(0px)',
        }}
      />

      {/* Subtle gradient overlay for readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(250,246,240,0.2) 0%, rgba(250,246,240,0.0) 50%, rgba(250,246,240,0.15) 100%)',
      }} />
    </div>
  );
}
