import { useState, useEffect } from 'react';

/**
 * Returns true when the given CSS media query matches the current viewport.
 * Efficiently uses matchMedia and updates on change — no resize listeners needed.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Modern browsers support addEventListener on MediaQueryList
    mql.addEventListener('change', onChange);
    // Sync in case it changed between render and effect
    setMatches(mql.matches);

    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
