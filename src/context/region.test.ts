import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { DEFAULT_REGION, REGION_CODES, REGION_STORAGE_KEY, isRegion, loadStoredRegion, useRegion } from './region';

beforeEach(() => {
  window.localStorage.clear();
});

describe('loadStoredRegion', () => {
  it('returns a previously saved region', () => {
    window.localStorage.setItem(REGION_STORAGE_KEY, 'mx');
    expect(loadStoredRegion()).toBe('mx');
    window.localStorage.setItem(REGION_STORAGE_KEY, 'us');
    expect(loadStoredRegion()).toBe('us');
  });

  it('defaults to the United States when nothing is saved', () => {
    expect(DEFAULT_REGION).toBe('us');
    expect(loadStoredRegion()).toBe('us');
  });

  it('does not detect the region from the browser locale', () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('es-MX');
    expect(loadStoredRegion()).toBe('us');
  });

  it('ignores an unsupported saved value', () => {
    window.localStorage.setItem(REGION_STORAGE_KEY, 'ca');
    expect(loadStoredRegion()).toBe('us');
  });
});

describe('REGION_CODES / isRegion', () => {
  it('supports the United States and Mexico only', () => {
    expect(REGION_CODES).toEqual(['us', 'mx']);
    expect(isRegion('us')).toBe(true);
    expect(isRegion('mx')).toBe(true);
    expect(isRegion('MX')).toBe(false);
    expect(isRegion(null)).toBe(false);
  });
});

describe('useRegion without a provider', () => {
  it('defaults to the United States with a setter that is a safe no-op', () => {
    const { result } = renderHook(() => useRegion());
    expect(result.current.region).toBe('us');
    act(() => result.current.setRegion('mx'));
    expect(result.current.region).toBe('us');
  });
});
