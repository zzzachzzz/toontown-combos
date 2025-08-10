import { Show, For, createMemo } from 'solid-js';
import * as util from '../util';
import { Combo, Gag, SosToonGag } from '../gags';
import { GagTracks } from '../constants';
import {
  OnClickOrgToggle,
  OnClickSelectedGag,
  OnClickSelectedGagAction,
  OnClickSelectedGagLvlMod,
  OnClickSelectedGagLvlModAction,
  OnClickClearGags,
} from './types';
import styles from './SelectedGags.module.css';

const { Remove, Copy } = OnClickSelectedGagAction;
const { LvlUp, LvlDown } = OnClickSelectedGagLvlModAction;

type Props = {
  combo: Combo;
  additionalGagMultiplier: number;
  onClickOrgToggle: OnClickOrgToggle;
  onClickGag: OnClickSelectedGag;
  onClickGagLvlMod: OnClickSelectedGagLvlMod;
  onClickClearGags: OnClickClearGags;
};

export const SelectedGags = (props: Props) => {
  return (
    <div class={styles.container}>
      <For each={props.combo.gagsGroupedByTrack()}>
        {gagGroup => {
          // Multipliers will be the same for the gags of a given track in the combo
          const multipliers = createMemo(() => gagGroup[0].multipliers(props.combo));

          return (
            <div class={styles.selectedGagGroup} style={{ border: `4px solid var(--${gagGroup[0].track})` }}>
              <div style={{ display: 'flex', 'flex-direction': 'column', gap: '0.5rem' }}>
                <Show when={gagGroup[0].track === GagTracks.trap && gagGroup.length >= 2}>
                  <span class={styles.multiTrapWarning}>
                    Multiple trap present in combo, damage negated
                  </span>
                </Show>
                <For each={gagGroup}>
                  {gag => (
                    <div class={styles.selectedGag}>
                      <button
                        onClick={[props.onClickGag, { gag, action: Remove }]}
                        onContextMenu={[props.onClickGag, { gag, action: Copy }]}
                        class={styles.bgBlueBtn}
                        style={{
                          background: gag instanceof SosToonGag ? 'var(--lightgrey)' : undefined,
                          border: `2px solid ${gag instanceof SosToonGag ? 'var(--gag-bg-blue)' : 'transparent'}`,
                          position: 'relative',
                        }}
                      >
                        {gag instanceof SosToonGag
                          ? <>
                            <img
                              class={`${styles.gagIcon} no-drag`}
                              src={util.getSosToonIconUrl(gag.sosToon)}
                            />
                            <img
                              class={`${styles.sosToonGagIcon} no-drag`}
                              src={util.getSosGagIconUrl(gag.sosToon)}
                            />
                          </> : (
                            <img
                              class={`${styles.gagIcon} no-drag`}
                              src={util.getGagIconUrl({ track: gag.track, lvl: gag.lvl })}
                            />
                          )
                        }
                      </button>
                      <div class={styles.gagLvlMod}>
                        <button
                          onClick={[props.onClickGagLvlMod, { gag, action: LvlUp }]}
                          class={styles.bgBlueBtn}
                          style={{ opacity: canLvlUpGag(gag) ? '100%' : '50%' }}
                          disabled={!canLvlUpGag(gag)}
                          aria-label="Level up gag"
                        >
                          &#9650;
                        </button>
                        <button
                          onClick={[props.onClickGagLvlMod, { gag, action: LvlDown }]}
                          class={styles.bgBlueBtn}
                          style={{ opacity: canLvlDownGag(gag) ? '100%' : '50%' }}
                          disabled={!canLvlDownGag(gag)}
                          aria-label="Level down gag"
                        >
                          &#9660;
                        </button>
                      </div>
                      <Show when={!(gag instanceof SosToonGag)}>
                        <button
                          onClick={[props.onClickOrgToggle, { gag }]}
                          class={styles.bgBlueBtn}
                          style={{ opacity: gag.isOrg ? '100%' : '50%' }}
                        >
                          <img class={styles.orgImg} src={util.getResourceUrl('Organic.png')} />
                        </button>
                      </Show>
                      <span class={styles.gagName}>{gag.name}{gag.isOrg && ' (Org) '}</span>
                      <Show when={gag.damage > 0}>
                        <span>{`[${gag.damage}]`}</span>
                      </Show>
                    </div>
                  )}
                </For>
              </div>
              <Show when={multipliers().multi || multipliers().knockback}>
                <div class={styles.gagMultipliers}>
                  <Show when={multipliers().multi}>
                    <div>+20% Same type bonus</div>
                  </Show>
                  <Show when={multipliers().knockback}>
                    <div>+50% Lure knockback bonus</div>
                  </Show>
                  <hr style={{ border: 'none', 'border-top': `2px solid var(--${gagGroup[0].track})` }} />
                  <div style={{ 'text-align': 'right' }}>
                    Damage: {
                      props.combo.damage({
                        onlyTrack: gagGroup[0].track,
                        additionalGagMultiplier: props.additionalGagMultiplier,
                      })
                    }
                  </div>
                </div>
              </Show>
            </div>
          );
        }}
      </For>
    </div>
  );
};

const canLvlUpGag = (gag: Gag): boolean => {
  if (gag instanceof SosToonGag) {
    return gag.lvl < 3;
  }
  return gag.lvl < 7;
};

const canLvlDownGag = (gag: Gag): boolean => {
  return gag.lvl > 1;
};

