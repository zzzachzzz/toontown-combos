import { For, Show } from 'solid-js';
import type { FindComboResult } from './gags';
import { getGagIconUrl } from './util';

type Props = {
  combo: FindComboResult;
};

export const Combo = (props: Props) => {
  return (
    <Show when={props.combo.damageKillsCog()}>
      <div class="combo">
        <span class="combo-dmg">{props.combo.damage()}</span>
        <div class="gags">
          <For each={props.combo.combo.gags}>
            {gag => (
              <div
                class="gag-icon-container"
                style={{ background: gag.isOrg ? `var(--${gag.track})` : 'unset' }}
              >
                <img class="gag-icon" src={getGagIconUrl({ track: gag.track, lvl: gag.lvl })} />
                {gag.isOrg && <span class="org">Org</span>}
              </div>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
};

