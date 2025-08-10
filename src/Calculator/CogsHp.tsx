import { For } from 'solid-js';
import * as util from '../util';
import { cogHp } from '../constants';
import styles from './CogsHp.module.css';

type Props = {
  comboDamage: number;
};

export const CogsHp = (props: Props) => {
  return (
    <table class={styles.table}>
      <tbody>
        <For each={[...util.batch(10, util.range(1, 20))]}>
          {range => {
            return (
              <tr>
                <For each={range}>
                  {cogLvl => {
                    const remaining = () => cogHp[cogLvl] - props.comboDamage;

                    const tdStyle = () => {
                      if (props.comboDamage === 0)
                        return {};
                      if (remaining() <= 0)
                        return { background: '#22c45e', color: 'var(--black)' };
                      return { background: '#ef4444', color: 'var(--black)' };
                    };

                    return (
                      <td class={styles.cell} style={tdStyle()}>
                        <div class={styles.cogLvl}>{cogLvl}</div>
                        <div class={styles.cogHp}>{cogHp[cogLvl]}</div>
                        <div class={styles.cogHpRemaining}>
                          {props.comboDamage === 0 ? '-' : remaining()}
                        </div>
                      </td>
                    );
                  }}
                </For>
              </tr>
            );
          }}
        </For>
      </tbody>
    </table>
  );
};

