import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import type { Language } from '../context/language';
import type { Region } from '../context/region';

/** Region codes as stored in the Firestore `resources` collection. */
export type ResourceRegion = 'US' | 'MX' | 'GLOBAL';

/** A text field can be one string for every language, or one per language. */
export type LocalizedText = string | Partial<Record<Language, string>>;

export interface RegionResource {
  id: string;
  region: ResourceRegion;
  order: number;
  name: LocalizedText;
  description?: LocalizedText;
  url?: string;
  phone?: string;
  /** `https://` download URL of the card image (e.g. from Firebase Storage). */
  imageUrl?: string;
}

const DB_REGION: Record<Region, ResourceRegion> = { us: 'US', mx: 'MX', global: 'GLOBAL' };
const APP_REGION: Record<ResourceRegion, Region> = { US: 'us', MX: 'mx', GLOBAL: 'global' };

export function toDbRegion(region: Region): ResourceRegion {
  return DB_REGION[region];
}

/** The app region whose phone format applies to a resource. */
export function toAppRegion(region: ResourceRegion): Region {
  return APP_REGION[region];
}

/** The regions to query: the user's own region plus the international fallback. */
export function regionsToQuery(region: Region): ResourceRegion[] {
  return region === 'global' ? ['GLOBAL'] : [toDbRegion(region), 'GLOBAL'];
}

function isLocalizedText(value: unknown): value is LocalizedText {
  if (typeof value === 'string') return value.trim() !== '';
  if (!value || typeof value !== 'object') return false;
  return Object.values(value).some((text) => typeof text === 'string' && text.trim() !== '');
}

/** Text in the active language, falling back to the other one. */
export function pickText(value: LocalizedText | undefined, language: Language): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[language] || value.en || value.es || '';
}

function isHttpsUrl(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('https://');
}

const PHONE_PATTERN = /^\+?[\d\s().-]{3,}$/;

/**
 * Turns a Firestore document into a resource, or `null` when it can't be used:
 * unknown region, no name, or no valid way to reach it (an `https://` url
 * and/or a phone number). This keeps a broken or half-filled document from
 * ever being shown as a working resource.
 */
export function toRegionResource(id: string, data: Record<string, unknown>): RegionResource | null {
  const region = data.region;
  if (region !== 'US' && region !== 'MX' && region !== 'GLOBAL') return null;
  if (data.isActive !== true) return null;
  if (!isLocalizedText(data.name)) return null;

  const url = isHttpsUrl(data.url) ? data.url : undefined;
  const phone = typeof data.phone === 'string' && PHONE_PATTERN.test(data.phone.trim()) ? data.phone.trim() : undefined;
  if (!url && !phone) return null;

  return {
    id,
    region,
    order: typeof data.order === 'number' ? data.order : 99,
    name: data.name,
    description: isLocalizedText(data.description) ? data.description : undefined,
    url,
    phone,
    imageUrl: isHttpsUrl(data.imageUrl) ? data.imageUrl : undefined,
  };
}

/** The user's region first, then the international resources; each by `order`. */
export function sortResources(resources: RegionResource[]): RegionResource[] {
  return [...resources].sort((a, b) => {
    const aGlobal = a.region === 'GLOBAL' ? 1 : 0;
    const bGlobal = b.region === 'GLOBAL' ? 1 : 0;
    return aGlobal - bGlobal || a.order - b.order;
  });
}

/** Active crisis resources for the region the user picked, plus the international ones. */
export function useResources(region: Region) {
  // The answer remembers which region it belongs to, so switching region shows
  // `loading` again until the new answer arrives.
  const [result, setResult] = useState<{ region: Region; resources: RegionResource[]; error: unknown } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (!db) throw new Error('Firebase is not configured');
        const q = query(
          collection(db, 'resources'),
          where('isActive', '==', true),
          where('region', 'in', regionsToQuery(region)),
        );
        const snap = await getDocs(q);
        const data = snap.docs
          .map((d) => toRegionResource(d.id, d.data()))
          .filter((resource): resource is RegionResource => resource !== null);
        if (!cancelled) setResult({ region, resources: sortResources(data), error: null });
      } catch (e) {
        if (!cancelled) setResult({ region, resources: [], error: e });
      }
    }
    load();

    // A slow answer for a previous region must not overwrite the current one.
    return () => {
      cancelled = true;
    };
  }, [region]);

  const current = result?.region === region ? result : null;
  return { resources: current?.resources ?? [], loading: current === null, error: current?.error ?? null };
}
