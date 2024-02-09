import { For } from 'solid-js';
import { useStore } from './store.instance';
import { gagTracksArr, gagTrackData, GagTrack } from './constants';
import * as storage from './local-storage';

type Props = {
  toonIdx: number;
};

export const OrgGagTrackSelect = ({ toonIdx }: Props) => {
  const store = useStore();
  const selectedOrgGag = () => store.getSelectedOrgGags()[toonIdx];

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
              <button onClick={() => onClickOrgGagTrack(toonIdx, gagTrack)}>
                <div class="img-container">
                  <img src={gagTrackData[gagTrack].img} />
                </div>
                <span>{gagTrackData[gagTrack].name}</span>
              </button>
            </li>
          );
        }}
      </For>
    </ul>
  );
};

