import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { getDocs, where } from 'firebase/firestore';
import {
  pickText,
  regionsToQuery,
  sortResources,
  toRegionResource,
  useResources,
  type RegionResource,
} from './useResources';
import type { Region } from '../context/region';

function snapshot(docs: Record<string, Record<string, unknown>>) {
  return {
    docs: Object.entries(docs).map(([id, data]) => ({ id, data: () => data })),
  } as never;
}

const valid = { region: 'MX', isActive: true, name: 'Línea', phone: '55 1234 5678' };

describe('toRegionResource', () => {
  it('keeps an active resource with a name and a phone or https url', () => {
    expect(toRegionResource('a', valid)).toMatchObject({ id: 'a', region: 'MX', phone: '55 1234 5678', order: 99 });
    expect(toRegionResource('b', { ...valid, phone: undefined, url: 'https://example.org' })).toMatchObject({
      url: 'https://example.org',
    });
  });

  it('drops inactive, unknown-region, unnamed or unreachable documents', () => {
    expect(toRegionResource('a', { ...valid, isActive: false })).toBeNull();
    expect(toRegionResource('a', { ...valid, region: 'mx' })).toBeNull();
    expect(toRegionResource('a', { ...valid, region: undefined })).toBeNull();
    expect(toRegionResource('a', { ...valid, name: '  ' })).toBeNull();
    expect(toRegionResource('a', { ...valid, phone: undefined })).toBeNull();
    expect(toRegionResource('a', { ...valid, phone: 'call us' })).toBeNull();
    // Insecure or non-web links are never offered as a working resource.
    expect(toRegionResource('a', { ...valid, phone: undefined, url: 'http://example.org' })).toBeNull();
    expect(toRegionResource('a', { ...valid, phone: undefined, url: 'javascript:alert(1)' })).toBeNull();
  });

  it('keeps an https image url and ignores any other', () => {
    expect(toRegionResource('a', { ...valid, imageUrl: 'https://firebasestorage.googleapis.com/x.png' })?.imageUrl).toBe(
      'https://firebasestorage.googleapis.com/x.png',
    );
    expect(toRegionResource('a', { ...valid, imageUrl: 'http://x.png' })?.imageUrl).toBeUndefined();
    expect(toRegionResource('a', valid)?.imageUrl).toBeUndefined();
  });

  it('accepts per-language text', () => {
    const resource = toRegionResource('a', { ...valid, name: { en: 'Line', es: 'Línea' }, description: { es: 'Apoyo' } });
    expect(pickText(resource!.name, 'en')).toBe('Line');
    expect(pickText(resource!.name, 'es')).toBe('Línea');
    // Missing language falls back to the other one.
    expect(pickText(resource!.description, 'en')).toBe('Apoyo');
  });
});

describe('regionsToQuery / sortResources', () => {
  it('asks for the user region plus the international fallback', () => {
    expect(regionsToQuery('us')).toEqual(['US', 'GLOBAL']);
    expect(regionsToQuery('mx')).toEqual(['MX', 'GLOBAL']);
    expect(regionsToQuery('global')).toEqual(['GLOBAL']);
  });

  it('puts the regional resources before the international ones, each by order', () => {
    const r = (id: string, region: RegionResource['region'], order: number): RegionResource => ({ id, region, order, name: id, url: 'https://x' });
    const sorted = sortResources([r('g1', 'GLOBAL', 1), r('mx2', 'MX', 2), r('g0', 'GLOBAL', 0), r('mx1', 'MX', 1)]);
    expect(sorted.map((x) => x.id)).toEqual(['mx1', 'mx2', 'g0', 'g1']);
  });
});

describe('useResources', () => {
  it('queries active resources for the region and returns them valid and sorted', async () => {
    vi.mocked(getDocs).mockResolvedValue(
      snapshot({
        g: { region: 'GLOBAL', isActive: true, name: 'International', url: 'https://g.org', order: 1 },
        mx: { ...valid, order: 2 },
        broken: { region: 'MX', isActive: true, name: 'No contact' },
      }),
    );

    const { result } = renderHook(() => useResources('mx'));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.resources.map((r) => r.id)).toEqual(['mx', 'g']);
    expect(result.current.error).toBeNull();
    expect(where).toHaveBeenCalledWith('isActive', '==', true);
    expect(where).toHaveBeenCalledWith('region', 'in', ['MX', 'GLOBAL']);
  });

  it('reloads when the region changes', async () => {
    const { result, rerender } = renderHook(({ region }: { region: Region }) => useResources(region), {
      initialProps: { region: 'us' },
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    rerender({ region: 'global' });
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(where).toHaveBeenLastCalledWith('region', 'in', ['GLOBAL']);
  });

  it('reports an error and returns no resources when Firestore fails', async () => {
    vi.mocked(getDocs).mockRejectedValue(new Error('offline'));
    const { result } = renderHook(() => useResources('us'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.resources).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
