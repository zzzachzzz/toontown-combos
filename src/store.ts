import { createMemo } from 'solid-js';
import { createStore as _createStore } from 'solid-js/store';
import type { GagTrack } from './constants';
import type { SavedState } from './local-storage';

export type State = {
  isLured: boolean;
  showOrgView: boolean;
  selectedOrgGags: Array<GagTrack | null>;
  hideLvl13UpCogs: boolean;
  level4UpGagsOnly: boolean;
};

type CreateStoreArgs = {
  initialState?: Partial<State>;
};

export const createStore = ({
  initialState,
}: CreateStoreArgs = {}) => {
  const [state, setState] = _createStore<State>({
    isLured: false,
    showOrgView: true,
    selectedOrgGags: Array.from({ length: 4 }, () => null),
    hideLvl13UpCogs: false,
    level4UpGagsOnly: false,
    ...initialState,
  });

  return new class {
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

    getHideLvl13UpCogs = () => state.hideLvl13UpCogs;

    toggleHideLvl13UpCogs = () => setState('hideLvl13UpCogs', hideLvl13UpCogs => !hideLvl13UpCogs);

    getLevel4UpGagsOnly = () => state.level4UpGagsOnly;

    toggleLevel4UpGagsOnly = () => setState('level4UpGagsOnly', level4UpGagsOnly => !level4UpGagsOnly);

    getMaxCogLvl = () => {
      if (state.hideLvl13UpCogs) {
        return 12;
      }
      return 20;
    };

    getStateForStorage = (): SavedState => ({
      isLured: state.isLured,
      showOrgView: state.showOrgView,
      selectedOrgGags: state.selectedOrgGags,
      hideLvl13UpCogs: state.hideLvl13UpCogs,
      level4UpGagsOnly: state.level4UpGagsOnly,
    });
  };
};

