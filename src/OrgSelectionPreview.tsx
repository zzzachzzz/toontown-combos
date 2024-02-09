import { For, Show } from 'solid-js';
import { useStore } from './store.instance';
import { gagTrackData } from './constants';

export const OrgSelectionPreview = () => {
  const store = useStore();

  return (
    <Show when={store.getSelectedOrgGags().some(g => g !== null)}>
      <ul class="org-selection-preview-list">
        <For each={Array.from({ length: 4 })}>
          {(_, toonIdx) => {
            const selectedOrgGagTrack = store.getSelectedOrgGags()[toonIdx()];
            const background = selectedOrgGagTrack !== null
              ? `var(--${selectedOrgGagTrack})`
              : 'transparent';
            return (
              <li role="option" style={{ background }} class="org-selection-preview-list-item">
                {selectedOrgGagTrack !== null && <>
                  <div class="img-container">
                    <img src={gagTrackData[selectedOrgGagTrack].img} />
                  </div>
                  <span>{gagTrackData[selectedOrgGagTrack].name}</span>
                </>}
              </li>
            );
          }}
        </For>
      </ul>
    </Show>
  );
};

