import { JSX } from 'solid-js';
import { SvgX } from './SvgX';
import styles from './AccumulatedDamageDisplay.module.css';

type Props = {
  accumulatedDamage: number;
  onClickClearAll: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
};

export const AccumulatedDamageDisplay = (props: Props) => {
  return (
    <div class={styles.container}>
      <span class={styles.damageValue} id="combo-info-result-dmg">
        {props.accumulatedDamage}
      </span>
      <label class={styles.damageLabel} for="combo-info-result-dmg">
        Accumulated Damage Total
      </label>

      <button type="button" class={styles.xBtn} id="clear-all-accumulated-combos" onClick={props.onClickClearAll}>
        <SvgX />
        <label class={styles.xBtnLabel} for="clear-all-accumulated-combos">
          Clear All
        </label>
      </button>
    </div>
  );
};

