import { JSX, For, Show, createMemo, createSignal } from 'solid-js';
import { useStore } from './store.instance';
import * as util from './util';
import { Combo, Gag, sortFnGags, SosToonGag } from './gags';
import { GagTracks, GagTrack, gagTrackDisplayName, cogHp, SosToons } from './constants';

type OnClickGridGag = (
  data: { track: GagTrack; lvl: number; },
  e: MouseEvent & {
    currentTarget: HTMLButtonElement;
    target: JSX.Element;
  }
) => void;

type OnClickGridSosToonGag = (
  data: { sosToon: SosToons; },
  e: MouseEvent & {
    currentTarget: HTMLButtonElement;
    target: JSX.Element;
  }
) => void;

enum OnClickSelectedGagAction {
  Remove,
  Copy,
}

type OnClickSelectedGag = (
  data: { gag: Gag; action: OnClickSelectedGagAction; },
  e: MouseEvent & {
    currentTarget: HTMLButtonElement;
    target: JSX.Element;
  }
) => void;

enum OnClickSelectedGagLvlModAction {
  LvlUp,
  LvlDown,
}

type OnClickSelectedGagLvlMod = (
  data: { gag: Gag; action: OnClickSelectedGagLvlModAction; },
  e: MouseEvent & {
    currentTarget: HTMLButtonElement;
    target: JSX.Element;
  }
) => void;

type OnClickOrgToggle = (
  data: { gag: Gag; },
  e: MouseEvent & {
    currentTarget: HTMLButtonElement;
    target: JSX.Element;
  }
) => void;

type OnClickClearGags = JSX.EventHandler<HTMLButtonElement, MouseEvent>;

export const Calculator = () => {
  const store = useStore();
  const combo = store.getCalculatorCombo;
  const setCombo = store.setCalculatorCombo;
  const [additionalGagMultiplier, setAdditionalGagMultiplier] = createSignal(0);

  const comboDamage = createMemo(() => combo().damage({ additionalGagMultiplier: additionalGagMultiplier() }));

  const onClickGridGag: OnClickGridGag = (data, e) => {
    // For handling onContextMenu (right click), prevent default
    // behavior and proceed unless modifier key is pressed.
    if (e.ctrlKey || e.shiftKey || e.altKey)
      return;
    e.preventDefault();
    setCombo(c => {
      c.gags.push(new Gag(data))
      c.gags.sort(sortFnGags);
      return c;
    });
  };

  const onClickGridSosToonGag: OnClickGridSosToonGag = (data, _) => {
    setCombo(c => {
      c.gags.push(new SosToonGag(data.sosToon))
      c.gags.sort(sortFnGags);
      return c;
    });
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
          c.gags.push(Gag.fromGag(data.gag));
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

  return (
    <div id="calc-page">
      <GagGrid
        onClickGag={onClickGridGag}
        onClickGridSosToonGag={onClickGridSosToonGag}
      />
      <CogsHp comboDamage={comboDamage()} />
      <label for="additional-gag-multiplier">Additional Gag Multiplier:</label>
      <select
        name="additional gag multiplier"
        id="additional-gag-multiplier"
        value={additionalGagMultiplier().toString()}
        onChange={e => setAdditionalGagMultiplier(Number(e.target.value))}
      >
        <option value="0">None</option>
        <option value="-0.10">-10% (1-star FO Market Research)</option>
        <option value="-0.15">-15% (2-star FO Market Research)</option>
        <option value="-0.20">-20% (3-star FO Market Research)</option>
        <option value="-0.25">-25% (Factory Foreman Cogs / 4-star FO Market Research)</option>
        <option value="0.2">+20% (Club President 1 Cog Defeated)</option>
        <option value="0.25">+25% (Coin Bull Market)</option>
        <option value="0.4">+40% (Club President 2 Cogs Defeated)</option>
        <option value="0.5">+50% (Fired Up / Bullion Bull Market)</option>
        <option value="0.6">+60% (Club President 3 Cogs Defeated)</option>
      </select>
      <ComboInfo
        combo={combo()}
        comboDamage={comboDamage()}
        additionalGagMultiplier={additionalGagMultiplier()}
        onClickOrgToggle={onClickOrgToggle}
        onClickSelectedGag={onClickSelectedGag}
        onClickSelectedGagLvlMod={onClickSelectedGagLvlMod}
        onClickClearGags={onClickClearGags}
      />
      <div id="calc-page-how-to">
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
  );
};

type GagGridProps = {
  onClickGag: OnClickGridGag;
  onClickGridSosToonGag: OnClickGridSosToonGag;
};

const GagGrid = (props: GagGridProps) => {
  return (
    <div id="calc-gag-grid">
      <For each={Object.values(GagTracks)}>
        {track => {
          return (
            <div class="calc-gag-row no-drag" style={{ background: `var(--${track})` }}>
              <div class="calc-gag-row-track-label">{gagTrackDisplayName[track]}</div>
              <For each={[...util.range(1, 7)]} >
                {lvl => {
                  return (
                    <button
                      class="calc-gag-grid-cell"
                      onContextMenu={[props.onClickGag, { track, lvl, isOrg: true }]}
                      onClick={[props.onClickGag, { track, lvl, isOrg: false }]}>
                      <img class="no-drag" src={util.getGagIconUrl({ track, lvl })} />
                    </button>
                  );
                }}
              </For>
            </div>
          );
        }}
      </For>
      {/* Damaging SOS Toons */}
      <SosToonsGroup
        sosToons={[
          SosToons.ClerkWill, SosToons.ClerkPenny, SosToons.ClerkClara,
          SosToons.BarbaraSeville, SosToons.SidSonata, SosToons.MoeZart,
          SosToons.ClumsyNed, SosToons.FranzNeckvein, SosToons.BarnacleBessie,
        ]}
        onClickGridSosToonGag={props.onClickGridSosToonGag}
      />
    </div>
  );
};

type SosToonsProps = {
  sosToons: Array<SosToons>;
  onClickGridSosToonGag: OnClickGridSosToonGag;
};

const SosToonsGroup = (props: SosToonsProps) => {
  return (
    <div class="sos-toons">
      <For each={props.sosToons}>
        {sosToon => {
          return (
            <button
              class="calc-gag-grid-cell"
              onClick={[props.onClickGridSosToonGag, { sosToon }]}
            >
              <img class="no-drag sos-toon-icon" src={util.getSosToonIconUrl(sosToon)} />
              <img class="no-drag sos-toon-gag-icon" src={getSosGagIconUrl(sosToon)} />
            </button>
          );
        }}
      </For>
    </div>
  );
};

type CogsHpProps = {
  comboDamage: number;
};

const CogsHp = (props: CogsHpProps) => {
  return (
    <table id="cogs-hp">
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
                      <td class="cogs-hp-cell" style={tdStyle()}>
                        <div class="cogs-hp-lvl">{cogLvl}</div>
                        <div class="cogs-hp-hp">{cogHp[cogLvl]}</div>
                        <div class="cogs-hp-remaining">
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

type ComboInfoProps = {
  combo: Combo;
  comboDamage: number;
  additionalGagMultiplier: number;
  onClickOrgToggle: OnClickOrgToggle;
  onClickSelectedGag: OnClickSelectedGag;
  onClickSelectedGagLvlMod: OnClickSelectedGagLvlMod;
  onClickClearGags: OnClickClearGags;
};

const ComboInfo = (props: ComboInfoProps) => {
  const damage = () => props.comboDamage;

  const cogLvlDestroyed = (): number | null => {
    for (const [cogLvl, _cogHp] of Object.entries(cogHp).reverse()) {
      if (damage() >= _cogHp)
        return Number(cogLvl);
    }
    return null;
  };

  return (
    <div id="combo-info">
      <Show when={cogLvlDestroyed()}>
        {lvl => {
          const remaining = () => cogHp[lvl()] - damage();
          return (
            <div id="combo-info-result">
              <div style={{ 'text-align': 'right' }}>
                <img
                  width="60"
                  height="60"
                  src={util.getResourceUrl(`cog_icons/${lvl() > 14 ? 'field-office' : lvl()}.png`)}
                />
              </div>
              <table>
                <tbody>
                  <tr>
                    <td class="cogs-hp-cell" style={{ 'white-space': 'nowrap', border: '2px solid var(--color-fg)' }}>
                      <div class="cogs-hp-lvl">Level: {lvl()}</div>
                      <div class="cogs-hp-hp">HP: {cogHp[lvl()]}</div>
                      <div class="cogs-hp-remaining">
                        Remaining: {remaining()}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ width: 'min-content', 'text-align': 'center' }}>
                <span id="combo-info-result-dmg">
                  {damage()}
                </span>
                <label id="combo-info-result-dmg-label" for="combo-info-result-dmg">
                  Damage
                </label>
              </div>
            </div>
          );
        }}
      </Show>
      <Show when={props.combo.gags.length > 0}>
        <button
          id="clear-gags-btn"
          onClick={props.onClickClearGags}
        >
          Clear all gags ({props.combo.gags.length})
        </button>
      </Show>
      <div id="selected-gags">
        <For each={props.combo.gagsGroupedByTrack()}>
          {gagGroup => {
            // Multipliers will be the same for the gags of a given track in the combo
            const multipliers = createMemo(() => gagGroup[0].multipliers(props.combo));

            return (
              <div class="selected-gag" style={{ border: `4px solid var(--${gagGroup[0].track})` }}>
                <div style={{ display: 'flex', 'flex-direction': 'column', gap: '0.5rem' }}>
                  <Show when={gagGroup[0].track === GagTracks.trap && gagGroup.length >= 2}>
                    <span class="multi-trap-warning">
                      Multiple trap present in combo, damage negated
                    </span>
                  </Show>
                  <For each={gagGroup}>
                    {gag => (
                      <div class="selected-gag-img-and-name">
                        <button
                          onClick={[props.onClickSelectedGag, { gag, action: OnClickSelectedGagAction.Remove }]}
                          onContextMenu={[props.onClickSelectedGag, { gag, action: OnClickSelectedGagAction.Copy }]}
                          class="selected-gag-img-container"
                          style={{
                            background: gag instanceof SosToonGag ? 'var(--lightgrey)' : undefined,
                            border: `2px solid ${gag instanceof SosToonGag ? 'var(--gag-bg-blue)' : 'transparent'}`,
                          }}
                        >
                          {gag instanceof SosToonGag
                            ? <>
                              <img class="no-drag sos-toon-icon" src={util.getSosToonIconUrl(gag.sosToon)} />
                              <img class="no-drag sos-toon-gag-icon" src={getSosGagIconUrl(gag.sosToon)} />
                            </> : (
                              <img src={util.getGagIconUrl({ track: gag.track, lvl: gag.lvl })} />
                            )
                          }
                        </button>
                        <div class="selected-gag-lvl-mod">
                          <button
                            onClick={[props.onClickSelectedGagLvlMod, { gag, action: OnClickSelectedGagLvlModAction.LvlUp }]}
                            class="selected-gag-lvl-mod-img-container"
                            style={{ opacity: canLvlUpGag(gag) ? '100%' : '50%' }}
                            disabled={!canLvlUpGag(gag)}
                            aria-label="Level up gag"
                          >
                            &#9650;
                          </button>
                          <button
                            onClick={[props.onClickSelectedGagLvlMod, { gag, action: OnClickSelectedGagLvlModAction.LvlDown }]}
                            class="selected-gag-lvl-mod-img-container"
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
                            class="selected-org-img-container"
                            style={{ opacity: gag.isOrg ? '100%' : '50%' }}
                          >
                            <img src={util.getResourceUrl('Organic.png')} />
                          </button>
                        </Show>
                        <span class="selected-gag-name">{gag.name}{gag.isOrg && ' (Org) '}</span>
                        <Show when={gag.damage > 0}>
                          <span class="selected-gag-base-dmg">{`[${gag.damage}]`}</span>
                        </Show>
                      </div>
                    )}
                  </For>
                </div>
                <Show when={multipliers().multi || multipliers().knockback}>
                  <div class="select-gag-multipliers">
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
    </div>
  );
};

const getSosGagIconUrl = (sosToon: SosToons) => {
  switch (sosToon) {
    case SosToons.ClerkWill:      return util.getGagIconUrl({ track: GagTracks.trap, lvl: 4 });
    case SosToons.ClerkPenny:     return util.getGagIconUrl({ track: GagTracks.trap, lvl: 5 });
    case SosToons.ClerkClara:     return util.getGagIconUrl({ track: GagTracks.trap, lvl: 6 });
    case SosToons.BarbaraSeville: return util.getGagIconUrl({ track: GagTracks.sound, lvl: 4 });
    case SosToons.SidSonata:      return util.getGagIconUrl({ track: GagTracks.sound, lvl: 5 });
    case SosToons.MoeZart:        return util.getGagIconUrl({ track: GagTracks.sound, lvl: 6 });
    case SosToons.ClumsyNed:      return util.getGagIconUrl({ track: GagTracks.drop, lvl: 4 });
    case SosToons.FranzNeckvein:  return util.getGagIconUrl({ track: GagTracks.drop, lvl: 5 });
    case SosToons.BarnacleBessie: return util.getGagIconUrl({ track: GagTracks.drop, lvl: 6 });
    default:
      throw new Error(`Unmatched SosToons value '${sosToon}'`);
  }
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

