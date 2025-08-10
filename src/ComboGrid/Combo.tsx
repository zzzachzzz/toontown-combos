import { For, Show } from 'solid-js';
import type { FindComboResult } from '../gags';
import { getGagIconUrl } from '../util';
import styles from './Combo.module.css';

type Props = {
  combo: FindComboResult;
};

export const Combo = (props: Props) => {
  return (
    <Show when={props.combo.damageKillsCog()}>
      <div class={styles.combo}>
        <span class={styles.dmg}>{props.combo.damage()}</span>
        <div class={styles.gags}>
          <For each={props.combo.combo.gags}>
            {gag => (
              <div
                class={styles.gagIconContainer}
                style={{ background: gag.isOrg ? `var(--${gag.track})` : 'unset' }}
              >
                <img class={styles.gagIcon} src={getGagIconUrl({ track: gag.track, lvl: gag.lvl })} />
                {gag.isOrg && <span class={styles.orgText}>Org</span>}
              </div>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
};

