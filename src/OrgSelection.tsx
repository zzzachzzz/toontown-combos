import { For } from 'solid-js';
import { OrgGagTrackSelect } from './OrgGagTrackSelect';

export const OrgSelection = () => {
  return (
    <ul class="org-selection-list">
      <For each={Array.from({ length: 4 })}>
        {(_, i) => (
          <li>
            <div class="toon-num">Toon {i() + 1}</div>
              <OrgGagTrackSelect toonIdx={i()} />
          </li>
        )}
      </For>
    </ul>
  );
};

