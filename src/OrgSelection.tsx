import { For, Show } from 'solid-js';
import { useStore } from './store.instance';
import { OrgGagTrackSelect } from './OrgGagTrackSelect';

export const OrgSelection = () => {
  const store = useStore();

  return (
    <Show when={(
      store.getShowOrgView()
      || store.getSelectedOrgGags().some(g => g !== null)
    )}>
      <div id="org-selection">
        <ul class="org-selection-list">
          <For each={Array.from({ length: 4 })}>
            {(_, i) => (
              <li>
                <Show when={store.getShowOrgView()}>
                  <div class="toon-num">Toon {i() + 1}</div>
                </Show>
                <OrgGagTrackSelect toonIdx={i()} />
              </li>
            )}
          </For>
        </ul>
      </div>
    </Show>
  );
};

