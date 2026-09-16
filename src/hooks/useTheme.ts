import { useEffect } from 'react';
import { useSettings } from './queries';

export function useTheme() {
  const { data } = useSettings();
  const theme = data?.theme ?? 'light';

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      document.documentElement.dataset['theme'] = theme === 'system' ? (mq.matches ? 'dark' : 'light') : theme;
    };
    apply();
    if (theme !== 'system') return;
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);
}
