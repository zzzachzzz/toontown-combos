import { For } from 'solid-js';
import { useStore } from './store.instance';
import { gagTracksArr, gagTrackDisplayName, GagTrack } from './constants';
import { getGagIconUrl } from './util';
import * as storage from './local-storage';

type Props = {
  toonIdx: number;
};

export const OrgGagTrackSelect = (props: Props) => {
  const store = useStore();
  const selectedOrgGag = () => store.getSelectedOrgGags()[props.toonIdx];

  const onClickOrgGagTrack = (toonIdx: number, gagTrack: GagTrack) => {
    store.setOrToggleSelectedOrgGag(toonIdx, gagTrack);
    storage.saveSavedState(store.getStateForStorage());
  };

  return (
    <ul class="org-gag-track-list" role="listbox">
      <For each={gagTracksArr}>
        {gagTrack => {
          const background = () => selectedOrgGag() === gagTrack
            ? `var(--${gagTrack})`
            : 'transparent';
          return (
            <li role="option" style={{ background: background() }}>
              <button onClick={() => onClickOrgGagTrack(props.toonIdx, gagTrack)}>
                <div class="img-container">
                  <img src={getGagIconUrl({ track: gagTrack, lvl: 1 })} />
                </div>
                <span>{gagTrackDisplayName[gagTrack]}</span>
              </button>
            </li>
          );
        }}
      </For>
    </ul>
  );
};

