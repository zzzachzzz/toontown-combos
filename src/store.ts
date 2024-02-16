import { createMemo } from 'solid-js';
import { createStore as _createStore } from 'solid-js/store';
import type { GagTrack } from './constants';
import type { SavedState } from './local-storage';

export type State = {
  isLured: boolean;
  showOrgView: boolean;
  selectedOrgGags: Array<GagTrack | null>;
  hideLvl13UpCogs: boolean;
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

    getMaxCogLvl = () => {
      if (state.hideLvl13UpCogs) {
        return 12;
      }
      return 20;
    };

    getStateForStorage = (): SavedState => ({
      isLured: state.isLured,
      selectedOrgGags: state.selectedOrgGags,
      hideLvl13UpCogs: state.hideLvl13UpCogs,
    });
  };
};

