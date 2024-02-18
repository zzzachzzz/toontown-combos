import { For, Show } from 'solid-js';
import type { Combo as _Combo } from './gags';
import { BASE_URL } from './constants';

type Props = {
  combo: _Combo;
};

export const Combo = (props: Props) => {
  return (
    <Show when={props.combo.damageKillsCog()}>
      <div class="combo">
        <span class="combo-dmg">{props.combo.damage()}</span>
        <div class="gags">
          <For each={props.combo.gags}>
            {gag => (
              <div
                class="gag-icon-container"
                style={{ background: gag.isOrg ? `var(--${gag.track})` : 'unset' }}
              >
                <img class="gag-icon" src={`${BASE_URL}gag_icons/${gag.name.replace(/\s/g, '_')}.png`} />
                {gag.isOrg && <span class="org">Org</span>}
              </div>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
};

