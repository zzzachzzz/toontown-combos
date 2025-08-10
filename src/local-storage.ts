import type { State } from './store';

/**
 * Partial state persisted in local storage.
 * Omit `additionalGagMultiplier` from `SavedState`.
 */
export type SavedState = Partial<Pick<
  State,
  'isLured' | 'showOrgView' | 'selectedOrgGags' | 'hideLvl15UpCogs' | 'level4UpGagsOnly' | 'theme'
>>;

const savedStateKey = 'savedState';

export const loadSavedState = (): SavedState | null => {
  const item = localStorage.getItem(savedStateKey)
  if (!item) return null;
  try {
    return JSON.parse(item) as SavedState;
  } catch (err) {
    console.error(`Error parsing localStorage item '${savedStateKey}'`, err);
    return null;
  }
};

export const saveSavedState = (newState: SavedState): void => {
  localStorage.setItem('savedState', JSON.stringify(newState));
};

