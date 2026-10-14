import { createContext, useContext } from 'react';

/**
 * The country the user says they are in. It is a user preference only: it is
 * never detected automatically (auto-detection is out of scope), and it drives
 * region-specific formats and, later, the resources shown. `global` covers the
 * rest of the world and uses neutral, non-country-specific formats.
 */
export type Region = 'us' | 'mx' | 'global';

export interface RegionContextValue {
  region: Region;
  setRegion: (region: Region) => void;
}

export const REGION_STORAGE_KEY = 'safety-plan-region';

/** The app's original market, used until the user picks a region. */
export const DEFAULT_REGION: Region = 'us';

export const REGION_CODES: Region[] = ['us', 'mx', 'global'];

export function isRegion(value: unknown): value is Region {
  return value === 'us' || value === 'mx' || value === 'global';
}

/** A previously saved choice wins; otherwise the default region. */
export function loadStoredRegion(): Region {
  if (typeof window === 'undefined') return DEFAULT_REGION;
  const stored = window.localStorage.getItem(REGION_STORAGE_KEY);
  return isRegion(stored) ? stored : DEFAULT_REGION;
}

// Same no-provider behaviour as useLanguage: a safe default so components can
// render in isolation.
const defaultContextValue: RegionContextValue = {
  region: DEFAULT_REGION,
  setRegion: () => {},
};

export const RegionContext = createContext<RegionContextValue>(defaultContextValue);

export function useRegion() {
  return useContext(RegionContext);
}
