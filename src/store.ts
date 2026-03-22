import { createMemo, createSignal, createStore as _createStore, storePath } from 'solid-js'; // TODO update to preferred 2.0 pattern rather than `storePath` helper
import { findCombo, Combo, findComboArgsToKey, type ComboKey } from './gags';
import * as util from './util';
import type { GagTrack } from './constants';
import type { SavedState } from './local-storage';

export type State = {
  additionalGagMultiplier: number;
  isLured: boolean;
  showOrgView: boolean;
  selectedOrgGags: Array<GagTrack | null>;
  hideLvl15UpCogs: boolean;
  level4UpGagsOnly: boolean;
  theme: 'light' | 'dark';
  accumulatedDamageCombos: Array<{
    combo: Combo;
    additionalGagMultiplier: number;
  }>;
};

type CreateStoreArgs = {
  initialState?: Partial<State>;
  getFindComboCache?: () => Record<string, string> | null | undefined;
};

export const createStore = ({
  initialState,
  getFindComboCache,
}: CreateStoreArgs = {}) => {
  const [state, setState] = _createStore<State>({
    additionalGagMultiplier: 0,
    isLured: false,
    showOrgView: true,
    selectedOrgGags: Array.from({ length: 4 }, () => null),
    hideLvl15UpCogs: false,
    level4UpGagsOnly: false,
    theme: 'light',
    accumulatedDamageCombos: [],
    ...initialState,
  });

  const [calculatorCombo, setCalculatorCombo] = createSignal<Combo>(
    new Combo({ gags: [] }),
    { equals: false }
  );

  return new class {
    getCalculatorCombo = calculatorCombo;

    setCalculatorCombo = setCalculatorCombo;

    getCalculatorComboDamage = createMemo((): number => calculatorCombo().damage({
      additionalGagMultiplier: state.additionalGagMultiplier
    }));

    getAdditionalGagMultiplier = () => state.additionalGagMultiplier;

    setAdditionalGagMultiplier = (value: State['additionalGagMultiplier']) =>
      setState(storePath('additionalGagMultiplier', value));

    pushAccumulatedDamageCombo = () => {
      const combo = this.getCalculatorCombo().clone();
      const { additionalGagMultiplier } = state;
      setState(storePath(
        'accumulatedDamageCombos',
        state.accumulatedDamageCombos.length,
        { combo, additionalGagMultiplier }
      ));
    };

    removeAccumulatedDamageCombo = (index: number) => {
      setState(storePath(
        'accumulatedDamageCombos',
        arr => [...arr.slice(0, index), ...arr.slice(index + 1)]
      ));
    };

    clearAccumulatedDamageCombos = () => {
      setState(storePath('accumulatedDamageCombos', []));
    };

    getAccumulatedDamageCombos = () => state.accumulatedDamageCombos;

    getAccumulatedCombosDamage = createMemo((): number => state.accumulatedDamageCombos.reduce(
      (acc, { combo, additionalGagMultiplier }) => acc + combo.damage({ additionalGagMultiplier }),
      0
    ));

    getIsLured = () => state.isLured;

    toggleIsLured = () => setState(storePath('isLured', isLured => !isLured));

    setIsLured = (isLured: State['isLured']) => setState(storePath('isLured', isLured));

    getShowOrgView = () => state.showOrgView;

    toggleShowOrgView = () => setState(storePath('showOrgView', showOrgView => !showOrgView));

    getSelectedOrgGags = () => state.selectedOrgGags;

    setOrToggleSelectedOrgGag = (toonIdx: number, gagTrack: GagTrack) => {
      setState(storePath('selectedOrgGags', toonIdx, prevGagTrack => {
        return gagTrack === prevGagTrack
          ? null
          : gagTrack;
      }));
    };

    resetSelectedOrgGags = () => {
      setState(storePath('selectedOrgGags',Array.from({ length: 4 }, () => null)));
    };

    getSelectedOrgGagTrackCounts = createMemo((): Record<GagTrack, number> => {
      return this.getSelectedOrgGags().reduce((acc, selectedOrgGag) => {
        if (selectedOrgGag !== null) acc[selectedOrgGag]++;
        return acc;
      }, { toonup: 0, trap: 0, lure: 0, sound: 0, throw: 0, squirt: 0, drop: 0 });
    });

    getHideLvl15UpCogs = () => state.hideLvl15UpCogs;

    toggleHideLvl15UpCogs = () => setState(storePath('hideLvl15UpCogs', hideLvl15UpCogs => !hideLvl15UpCogs));

    getLevel4UpGagsOnly = () => state.level4UpGagsOnly;

    toggleLevel4UpGagsOnly = () => setState(storePath('level4UpGagsOnly', level4UpGagsOnly => !level4UpGagsOnly));

    getMaxCogLvl = () => {
      if (state.hideLvl15UpCogs) {
        return 14;
      }
      return 20;
    };

    // "Why createMemo is not lazy?" (initial value computed eagerly on my `createStore` call)
    // "Just what I was looking at the time.
    //  I created Solid back in 2016 and was inspired heavily by S.js which was all eager.
    //  Changing to lazy would have been breaking. But it will be lazy in 2.0." -ryansolid
    // https://github.com/solidjs/solid/discussions/2416#discussioncomment-12204286
    getComboGridCombos = createMemo((): Array<Combo | null> => {
      const maxCogLvl = this.getMaxCogLvl();
      const organicGags = this.getSelectedOrgGagTrackCounts();
      const isLured = this.getIsLured();
      const minGagLvl = this.getLevel4UpGagsOnly() ? 4 : undefined;

      const cache = getFindComboCache?.(); // TODO... is this a dependency..? That would trigger an update?

      return Array.from(
        util.iterFindComboArgs({ maxCogLvl, organicGags, isLured, minGagLvl }),
        findComboArgs => {
          const cacheKey = findComboArgsToKey(findComboArgs);
          if (cache) {
            const cacheHit = cache[cacheKey];
            if (cacheHit != null) return Combo.fromKey(cacheHit satisfies string as ComboKey);
            console.warn(`Cache miss for ComboKey '${cacheKey}'`);
          }
          return findCombo(findComboArgs);
        }
      );
    }, []);

    getTheme = () => state.theme;

    toggleTheme = () => setState(storePath('theme', theme => theme === 'dark' ? 'light' : 'dark'));

    getStateForStorage = (): Required<SavedState> => ({
      isLured: state.isLured,
      showOrgView: state.showOrgView,
      selectedOrgGags: state.selectedOrgGags,
      hideLvl15UpCogs: state.hideLvl15UpCogs,
      level4UpGagsOnly: state.level4UpGagsOnly,
      theme: state.theme,
    });
  };
};

