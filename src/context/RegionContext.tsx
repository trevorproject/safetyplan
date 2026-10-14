import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { RegionContext, loadStoredRegion, REGION_STORAGE_KEY, type Region } from './region';

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegionState] = useState<Region>(loadStoredRegion);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(REGION_STORAGE_KEY, region);
  }, [region]);

  const setRegion = useCallback((next: Region) => setRegionState(next), []);

  return <RegionContext.Provider value={{ region, setRegion }}>{children}</RegionContext.Provider>;
}
