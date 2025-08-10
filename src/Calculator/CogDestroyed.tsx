import * as util from '../util';
import { cogHp } from '../constants';
import styles from './CogDestroyed.module.css';

type Props = {
  cogLvl: number;
  comboDamage: number;
};

export const CogDestroyed = (props: Props) => {
  const remaining = () => cogHp[props.cogLvl] - props.comboDamage;

  return (
    <div class={styles.container}>
      <div style={{ 'text-align': 'right' }}>
        <img
          width="60"
          height="60"
          src={util.getCogIconUrl(props.cogLvl)}
        />
      </div>
      <table>
        <tbody>
          <tr>
            <td class={styles.cell}>
              <div class={styles.cogLvl}>Level: {props.cogLvl}</div>
              <div class={styles.cogHp}>HP: {cogHp[props.cogLvl]}</div>
              <div class={styles.cogsHpRemaining}>
                Remaining: {remaining()}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ width: 'min-content', 'text-align': 'center' }}>
        <span class={styles.damage} id="combo-info-result-dmg">
          {props.comboDamage}
        </span>
        <label class={styles.damageLabel} for="combo-info-result-dmg">
          Damage
        </label>
      </div>
    </div>
  );
};

