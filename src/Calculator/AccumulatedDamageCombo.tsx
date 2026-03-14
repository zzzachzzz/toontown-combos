import { JSX, Show, For, Switch, Match } from 'solid-js';
import * as util from '../util';
import { Combo, SosToonGag } from '../gags';
import { ADDITIONAL_GAG_MULTIPLIERS } from '../constants';
import { SvgX } from './SvgX';
import stylesSelectedGags from './SelectedGags.module.css';
import stylesAccumulatedDamageCombo from './AccumulatedDamageCombo.module.css';

const styles = { ...stylesSelectedGags, ...stylesAccumulatedDamageCombo };

type Props = {
  combo: Combo;
  additionalGagMultiplier: number;
  onClickRemove: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
};

export const AccumulatedDamageCombo = (props: Props) => {
  return (
    <div class={styles.container}>
      <Show when={props.additionalGagMultiplier !== 0}>
        <div style={{ 'font-size': '0.8rem' }}>{ADDITIONAL_GAG_MULTIPLIERS[props.additionalGagMultiplier]}</div>
        <hr style={{ border: 'none', 'border-top': `2px solid var(--black)` }} />
      </Show>
      <div class={styles.flexContainer}>
        <For each={props.combo.gags}>
          {gag => (
            <div
              class={styles.bgBlueBtn}
              style={{
                background: gag() instanceof SosToonGag ? 'var(--lightgrey)' : undefined,
                border: `2px solid ${gag() instanceof SosToonGag ? 'var(--gag-bg-blue)' : 'transparent'}`,
                position: 'relative',
              }}
            >
              {gag() instanceof SosToonGag
                ? <>
                  <img
                    class={`${styles.gagIcon} no-drag`}
                    src={util.getSosToonIconUrl((gag() as SosToonGag).sosToon)}
                  />
                  <img
                    class={`${styles.sosToonGagIcon} no-drag`}
                    src={util.getSosGagIconUrl((gag() as SosToonGag).sosToon)}
                  />
                </> : <>
                  <img
                    class={`${styles.gagIcon} no-drag`}
                    src={util.getGagIconUrl({ track: gag().track, lvl: gag().lvl })}
                  />
                  <Show when={gag().isOrg}>
                    <img class={styles.organicIcon} src={util.getResourceUrl('Organic.png')} />
                  </Show>
                </>
              }
            </div>
          )}
        </For>
        <div class={styles.damage}>
          <span class={styles.damageValue} id="combo-info-result-dmg">
            {props.combo.damage({ additionalGagMultiplier: props.additionalGagMultiplier })}
          </span>
          <label class={styles.damageLabel} for="combo-info-result-dmg">
            Damage
          </label>
        </div>
        <button type="button" aria-label="Remove" onClick={props.onClickRemove} class={styles.xBtn}>
          <SvgX />
        </button>
      </div>
    </div>
  );
};

