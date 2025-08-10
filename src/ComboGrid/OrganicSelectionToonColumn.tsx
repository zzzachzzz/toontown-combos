import { For, Show } from 'solid-js';
import { useStore } from '../store.instance';
import { gagTracksArr, gagTrackDisplayName, GagTrack } from '../constants';
import { getGagIconUrl } from '../util';
import * as storage from '../local-storage';
import styles from './OrganicSelectionToonColumn.module.css';

type Props = {
  toonIdx: number;
};

type OnClickOrgGagTrack = (toonIdx: number, gagTrack: GagTrack) => void;

export const OrganicSelectionToonColumn = (props: Props) => {
  const store = useStore();
  const selectedOrgGag = () => store.getSelectedOrgGags()[props.toonIdx];

  const onClickOrgGagTrack: OnClickOrgGagTrack = (toonIdx: number, gagTrack: GagTrack) => {
    store.setOrToggleSelectedOrgGag(toonIdx, gagTrack);
    storage.saveSavedState(store.getStateForStorage());
  };

  return (
    <ul class={styles.column} role="listbox">
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
    : 'var(--color-bg)';

  const color = () => props.isGagTrackSelected
    ? `var(--black)`
    : undefined;

  return (
    <li role="option" style={{ background: background(), color: color() }}>
      <Show when={props.gagTrack !== null}>
        <button
          onClick={() => props.onClickOrgGagTrack(props.toonIdx, props.gagTrack!)}
          disabled={!props.showOrgView}
        >
          <div class={styles.imgContainer}>
            <img src={getGagIconUrl({ track: props.gagTrack!, lvl: 1 })} />
          </div>
          <span>{gagTrackDisplayName[props.gagTrack!]}</span>
        </button>
      </Show>
    </li>
  );
};

