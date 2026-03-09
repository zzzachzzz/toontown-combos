import { For } from 'solid-js';
import type { Combo as ComboType } from '../gags';
import { getGagIconUrl } from '../util';
import styles from './Combo.module.css';

type Props = {
  combo: ComboType;
  isLured: boolean;
};

export const Combo = (props: Props) => {
  return (
    <div class={styles.combo}>
      <span class={styles.dmg}>
        {props.combo.damage({ isLured: props.isLured })}
      </span>
      <div class={styles.gags}>
        <For each={props.combo.gags}>
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
  );
};

