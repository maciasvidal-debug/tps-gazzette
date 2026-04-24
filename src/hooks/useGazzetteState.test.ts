import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGazzetteState } from './useGazzetteState';

const STORAGE_KEY = 'tps_gazzette_draft';

describe('useGazzetteState', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('handles invalid JSON in localStorage and returns default state', () => {
    const invalidJson = '{ invalid: json }';
    localStorage.setItem(STORAGE_KEY, invalidJson);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useGazzetteState());

    // Verify console.error was called
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to parse saved state:'),
      expect.any(SyntaxError)
    );

    // Verify it returns the default state
    expect(result.current.state.masthead.title).toBe('THE TPS GAZZETTE');

    consoleSpy.mockRestore();
  });

  it('returns saved state from localStorage when JSON is valid', () => {
    const validState = {
      masthead: {
        title: 'CUSTOM TITLE',
        date: 'April 24, 2024',
        volume: 'Vol. 99',
        tags: ['TEST'],
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validState));

    const { result } = renderHook(() => useGazzetteState());

    expect(result.current.state.masthead.title).toBe('CUSTOM TITLE');
  });

  it('returns default state when localStorage is empty', () => {
    const { result } = renderHook(() => useGazzetteState());

    expect(result.current.state.masthead.title).toBe('THE TPS GAZZETTE');
  });
});
