import { Show, For } from 'solid-js';
import { useStore } from '../store.instance';
import * as util from '../util';
import { cogHp, additionalGagMultipliers } from '../constants';
import {
  OnClickSelectedGagAction,
  OnClickGridGag,
  OnClickSelectedGag,
  OnClickSelectedGagLvlModAction,
  OnClickSelectedGagLvlMod,
  OnClickOrgToggle,
  OnClickClearGags,
} from './types';
import { Gag, sortFnGags, SosToonGag } from '../gags';
import { GagGrid } from './GagGrid';
import { CogsHp } from './CogsHp';
import { CogDestroyed } from './CogDestroyed';
import { SelectedGags } from './SelectedGags';
import { AccumulatedDamageCombo } from './AccumulatedDamageCombo';
import { AccumulatedDamageDisplay } from './AccumulatedDamageDisplay';
import styles from './Calculator.module.css';

export const Calculator = () => {
  const store = useStore();
  const combo = store.getCalculatorCombo;
  const setCombo = store.setCalculatorCombo;
  const comboDamage = store.getCalculatorComboDamage;
  const additionalGagMultiplier = store.getAdditionalGagMultiplier;

  const onClickGridGag: OnClickGridGag = (data, e) => {
    // For handling onContextMenu (right click), prevent default
    // behavior and proceed unless modifier key is pressed.
    if (e.ctrlKey || e.shiftKey || e.altKey)
      return;
    e.preventDefault();

    if ('sosToon' in data) {
      setCombo(c => {
        c.gags.push(new SosToonGag(data.sosToon))
        c.gags.sort(sortFnGags);
        return c;
      });
    } else {
      setCombo(c => {
        c.gags.push(new Gag(data))
        c.gags.sort(sortFnGags);
        return c;
      });
    }
  };

  const onClickSelectedGag: OnClickSelectedGag = (data, e) => {
    // For handling onContextMenu (right click), prevent default
    // behavior and proceed unless modifier key is pressed.
    if (e.ctrlKey || e.shiftKey || e.altKey)
      return;
    e.preventDefault();
    switch (data.action) {
      case OnClickSelectedGagAction.Remove: {
        setCombo(c => {
          c.gags = c.gags.filter(g => g !== data.gag);
          return c;
        });
        break;
      }
      case OnClickSelectedGagAction.Copy: {
        setCombo(c => {
          c.gags.push(data.gag.clone());
          return c;
        });
        break;
      }
      default:
        break;
    }
  };

  const onClickSelectedGagLvlMod: OnClickSelectedGagLvlMod = (data, _) => {
    setCombo(c => {
      const _gag = c.gags.find(g => g === data.gag)!;
      _gag.lvl += data.action === OnClickSelectedGagLvlModAction.LvlUp
        ? 1
        : -1;
      return c;
    });
  };

  const onClickClearGags: OnClickClearGags = (_) => {
    setCombo(c => {
      c.gags = [];
      return c;
    });
  };

  const onClickOrgToggle: OnClickOrgToggle = (data, _) => {
    toggleGagOrg(data.gag);
  };

  const toggleGagOrg = (gag: Gag) => {
    setCombo(c => {
      const _gag = c.gags.find(g => g === gag)!;
      _gag.isOrg = !gag.isOrg;
      return c;
    });
  };

  const cogLvlDestroyed = (): number | null => {
    for (const [cogLvl, _cogHp] of Object.entries(cogHp).reverse()) {
      if (comboDamage() >= _cogHp)
        return Number(cogLvl);
    }
    return null;
  };

  return (
    <div class={styles.container}>
      <div class={styles.left}>
        <GagGrid onClickGag={onClickGridGag} />

        <CogsHp comboDamage={comboDamage()} />

        <label for="additional-gag-multiplier">Additional Gag Multiplier:</label>
        <select
          id="additional-gag-multiplier"
          class={styles.additionalGagMultiplier}
          name="additional gag multiplier"
          value={additionalGagMultiplier().toString()}
          onChange={e => store.setAdditionalGagMultiplier(Number(e.target.value))}
        >
          {Object.entries(additionalGagMultipliers).map(([value, desc]) => (
            <option value={value}>{desc}</option>
          ))}
        </select>

        <Show when={cogLvlDestroyed()}>
          {cogLvl => <CogDestroyed cogLvl={cogLvl()} comboDamage={comboDamage()} />}
        </Show>

        <Show when={combo().gags.length > 0}>
          <div style={{ 'display': 'flex', 'justify-content': 'space-between', 'width': '100%' }}>
            <button
              class={styles.clearGagsBtn}
              onClick={onClickClearGags}
            >
              Clear all gags ({combo().gags.length})
            </button>

            <button
              class={styles.clearGagsBtn}
              onClick={() => store.pushAccumulatedDamageCombo()}
            >
              Add Combo to Total
            </button>
          </div>
        </Show>

        <SelectedGags
          combo={combo()}
          additionalGagMultiplier={additionalGagMultiplier()}
          onClickOrgToggle={onClickOrgToggle}
          onClickGag={onClickSelectedGag}
          onClickGagLvlMod={onClickSelectedGagLvlMod}
          onClickClearGags={onClickClearGags}
        />

        <div class={styles.howTo}>
          <ul>
            <li>Click to select a gag</li>
            <li>Right-click to select an organic gag</li>
            <li>
              <span>Or click the organic icon&nbsp;</span>
              <span style={{ position: 'relative', 'padding-right': '1.1rem' }}>
                <img
                  style={{ position: 'absolute', top: 0, left: 0, width: '1.1rem', height: '1.1rem' }}
                  src={util.getResourceUrl('Organic.png')}
                />
              </span>
              <span>&nbsp;of a selected gag to toggle organic</span>
            </li>
            <li>Click a selected gag to deselect it</li>
            <li>Click a selected gag's up/down buttons to level it up/down</li>
            <li>Right-click a selected gag to duplicate it</li>
            <li>
              Note about <i>Additional Gag Multiplier</i>:<br/>
              If the calculations seem odd, that's because they are.<br/>
              <a href="https://github.com/zzzachzzz/toontown-combos/issues/34#issuecomment-2282841602">Learn more here</a>
            </li>
          </ul>
        </div>
      </div>
       <Show when={store.getAccumulatedDamageCombos().length > 0}>
         <div class={styles.right}>
           <div class={styles.rightInnerCombos}>
             <For each={store.getAccumulatedDamageCombos()}>
               {({ combo, additionalGagMultiplier }, index) => (
                 <AccumulatedDamageCombo
                   combo={combo}
                   additionalGagMultiplier={additionalGagMultiplier}
                   onClickRemove={() => store.removeAccumulatedDamageCombo(index())}
                 />
               )}
             </For>
           </div>
           <div class={styles.rightInnerTotal}>
             <AccumulatedDamageDisplay
               accumulatedDamage={store.getAccumulatedCombosDamage()}
               onClickClearAll={store.clearAccumulatedDamageCombos}
             />
           </div>
         </div>
       </Show>
    </div>
  );
};

