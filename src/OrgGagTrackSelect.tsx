import { For, Show } from 'solid-js';
import { useStore } from './store.instance';
import { gagTracksArr, gagTrackDisplayName, GagTrack } from './constants';
import { getGagIconUrl } from './util';
import * as storage from './local-storage';

type Props = {
  toonIdx: number;
};

type OnClickOrgGagTrack = (toonIdx: number, gagTrack: GagTrack) => void;

export const OrgGagTrackSelect = (props: Props) => {
  const store = useStore();
  const selectedOrgGag = () => store.getSelectedOrgGags()[props.toonIdx];

  const onClickOrgGagTrack: OnClickOrgGagTrack = (toonIdx: number, gagTrack: GagTrack) => {
    store.setOrToggleSelectedOrgGag(toonIdx, gagTrack);
    storage.saveSavedState(store.getStateForStorage());
  };

  return (
    <ul class="org-gag-track-list" role="listbox">
      {store.getShowOrgView() ? (
        <For each={gagTracksArr}>
          {gagTrack => (
            <GagTrackListItem
              toonIdx={props.toonIdx}
              gagTrack={gagTrack}
              isGagTrackSelected={gagTrack === selectedOrgGag()}
              onClickOrgGagTrack={onClickOrgGagTrack}
              showOrgView={store.getShowOrgView()}
            />
          )}
        </For>
      ) : (
        <GagTrackListItem
          toonIdx={props.toonIdx}
          gagTrack={selectedOrgGag()}
          isGagTrackSelected={selectedOrgGag() !== null}
          onClickOrgGagTrack={onClickOrgGagTrack}
          showOrgView={store.getShowOrgView()}
        />
      )}
    </ul>
  );
};

type GagTrackListItemProps = {
  toonIdx: number;
  gagTrack: GagTrack | null;
  isGagTrackSelected: boolean;
  onClickOrgGagTrack: OnClickOrgGagTrack;
  showOrgView: boolean;
};

const GagTrackListItem = (props: GagTrackListItemProps) => {
  const background = () => props.isGagTrackSelected
    ? `var(--${props.gagTrack})`
    : 'transparent';

  return (
    <li role="option" style={{ background: background() }}>
      <Show when={props.gagTrack !== null}>
        <button
          onClick={() => props.onClickOrgGagTrack(props.toonIdx, props.gagTrack!)}
          disabled={!props.showOrgView}
        >
          <div class="img-container">
            <img src={getGagIconUrl({ track: props.gagTrack!, lvl: 1 })} />
          </div>
          <span>{gagTrackDisplayName[props.gagTrack!]}</span>
        </button>
      </Show>
    </li>
  );
};

