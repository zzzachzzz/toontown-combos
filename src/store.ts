import { createMemo, createSignal } from 'solid-js';
import { createStore as _createStore } from 'solid-js/store';
import { findCombo, FindComboResult, Combo } from './gags';
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
};

type CreateStoreArgs = {
  initialState?: Partial<State>;
};

export const createStore = ({
  initialState,
}: CreateStoreArgs = {}) => {
  const [state, setState] = _createStore<State>({
    additionalGagMultiplier: 0,
    isLured: false,
    showOrgView: true,
    selectedOrgGags: Array.from({ length: 4 }, () => null),
    hideLvl15UpCogs: false,
    level4UpGagsOnly: false,
    theme: 'light',
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
      setState('additionalGagMultiplier', value);

    getIsLured = () => state.isLured;

    toggleIsLured = () => setState('isLured', isLured => !isLured);

    setIsLured = (isLured: State['isLured']) => setState('isLured', isLured);

    getShowOrgView = () => state.showOrgView;

    toggleShowOrgView = () => setState('showOrgView', showOrgView => !showOrgView);

    getSelectedOrgGags = () => state.selectedOrgGags;

    setOrToggleSelectedOrgGag = (toonIdx: number, gagTrack: GagTrack) => {
      setState('selectedOrgGags', toonIdx, prevGagTrack => {
        return gagTrack === prevGagTrack
          ? null
          : gagTrack;
      });
    };

    resetSelectedOrgGags = () => {
      setState('selectedOrgGags',Array.from({ length: 4 }, () => null));
    };

    getSelectedOrgGagTrackCounts = createMemo((): Record<GagTrack, number> => {
      return this.getSelectedOrgGags().reduce((acc, selectedOrgGag) => {
        if (selectedOrgGag !== null) acc[selectedOrgGag]++;
        return acc;
      }, { toonup: 0, trap: 0, lure: 0, sound: 0, throw: 0, squirt: 0, drop: 0 });
    });

    getHideLvl15UpCogs = () => state.hideLvl15UpCogs;

    toggleHideLvl15UpCogs = () => setState('hideLvl15UpCogs', hideLvl15UpCogs => !hideLvl15UpCogs);

    getLevel4UpGagsOnly = () => state.level4UpGagsOnly;

    toggleLevel4UpGagsOnly = () => setState('level4UpGagsOnly', level4UpGagsOnly => !level4UpGagsOnly);

    getMaxCogLvl = () => {
      if (state.hideLvl15UpCogs) {
        return 14;
      }
      return 20;
    };

    getComboGridCombos = createMemo((): Array<FindComboResult> => {
      const maxCogLvl = this.getMaxCogLvl();
      const organicGags = this.getSelectedOrgGagTrackCounts();
      const isLured = this.getIsLured();
      const level4UpGagsOnly = this.getLevel4UpGagsOnly();
      const minGagLvl = level4UpGagsOnly ? 4 : null;

      return Array.from(
        util.iterFindComboArgs({ maxCogLvl, organicGags, isLured, minGagLvl }),
        findComboArgs => findCombo(findComboArgs)
      );
    });

    getTheme = () => state.theme;

    toggleTheme = () => setState('theme', theme => theme === 'dark' ? 'light' : 'dark');

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

