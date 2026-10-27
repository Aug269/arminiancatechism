import { useCallback, useEffect, useMemo, useState } from 'react';

export type Theme = 'day' | 'night';

export interface Preferences {
  fontScale: number;
  theme: Theme;
}

const STORAGE_KEY = 'oficio-diario:prefs:v1';
const MIN_SCALE = 0.85;
const MAX_SCALE = 1.6;
const STEP = 0.08;

const DEFAULT_PREFERENCES: Preferences = { fontScale: 1, theme: 'day' };

function readPreferences(): Preferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(stored) as Partial<Preferences>;
    return {
      fontScale: clamp(parsed.fontScale ?? 1, MIN_SCALE, MAX_SCALE),
      theme: parsed.theme === 'night' ? 'night' : 'day',
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(readPreferences);

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.style.setProperty('--escala', preferences.fontScale.toFixed(3));
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', preferences.theme === 'night' ? '#17141a' : '#4a153b');
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      /* modo privado: segue sem persistir */
    }
  }, [preferences]);

  const increaseFont = useCallback(() => {
    setPreferences((current) => ({
      ...current,
      fontScale: clamp(Number((current.fontScale + STEP).toFixed(3)), MIN_SCALE, MAX_SCALE),
    }));
  }, []);

  const decreaseFont = useCallback(() => {
    setPreferences((current) => ({
      ...current,
      fontScale: clamp(Number((current.fontScale - STEP).toFixed(3)), MIN_SCALE, MAX_SCALE),
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setPreferences((current) => ({ ...current, theme: current.theme === 'day' ? 'night' : 'day' }));
  }, []);

  const reset = useCallback(() => setPreferences(DEFAULT_PREFERENCES), []);

  const fontLabel = useMemo(() => `${Math.round(preferences.fontScale * 100)}%`, [preferences.fontScale]);

  return { preferences, increaseFont, decreaseFont, toggleTheme, reset, fontLabel };
}
