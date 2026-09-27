import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { ThemeContext } from './theme';
import { useKarachiMinutes } from '../hooks/useKarachiMinutes';
import { isNightAt } from '../lib/time';

// A manual choice lasts for the session; otherwise the theme follows Karachi's clock
const OVERRIDE_KEY = 'noir:theme';

const readOverride = () => {
  try {
    const saved = sessionStorage.getItem(OVERRIDE_KEY);
    return saved === 'day' || saved === 'night' ? saved : null;
  } catch {
    return null;
  }
};

const ThemeProvider = ({ children }) => {
  const minutes = useKarachiMinutes();
  const [override, setOverride] = useState(readOverride);
  const theme = override ?? (isNightAt(minutes) ? 'night' : 'day');

  // Layout effect so a flushSync'd theme change lands inside the view-transition snapshot
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setTheme = useCallback((next) => {
    setOverride(next);
    try {
      sessionStorage.setItem(OVERRIDE_KEY, next);
    } catch {
      // Storage unavailable — the choice lasts until reload
    }
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
