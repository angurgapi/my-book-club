'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const get = () =>
    typeof window !== 'undefined' && window.matchMedia(query).matches;
  const [matches, set] = useState<boolean>(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => set(e.matches);
    set(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
