import { JSX } from 'solid-js';
import { SvgX } from './SvgX';
import styles from './AccumulatedDamageDisplay.module.css';

type Props = {
  accumulatedDamage: number;
  onClickClearAll: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
};

export const AccumulatedDamageDisplay = (props: Props) => {
  return (
    <div>
      <hr class={styles.hr} />
      <div class={styles.innerContainer}>
        <div class={styles.damage}>
          <span class={styles.damageValue} id="combo-info-result-dmg">
            {props.accumulatedDamage}
          </span>
          <label class={styles.damageLabel} for="combo-info-result-dmg">
            Damage
          </label>
        </div>
        <button type="button" class={styles.xBtn} id="clear-all-accumulated-combos" onClick={props.onClickClearAll}>
          <SvgX />
          <label class={styles.xBtnLabel} for="clear-all-accumulated-combos">
            Clear All
          </label>
        </button>
      </div>
    </div>
  );
};

