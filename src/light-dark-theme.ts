import type { State } from './store';
import type { SavedState } from './local-storage';

export const determineTheme = (
  savedStateTheme: SavedState['theme']
): State['theme'] => {
  if (savedStateTheme !== undefined)
    return savedStateTheme

  if (window.matchMedia('(prefers-color-scheme: dark)').matches)
    return 'dark';

  return 'light';
};


export const setDomDataTheme = (theme: State['theme']): void => {
  document.querySelector('html')!.setAttribute('data-theme', theme);
};

