import { JSX, For, Show, batch, createMemo } from 'solid-js';
import { useStore } from './store.instance';
import { Combo } from './Combo';
import { CogLvlColumn } from './CogLvlColumn';
import { OrgSelection } from './OrgSelection';
import * as util from './util';
import { findCombo, Combo as _Combo } from './gags';
import * as storage from './local-storage';

export const ComboGrid = () => {
  const store = useStore();

  const combos = createMemo(() => {
    const maxCogLvl = store.getMaxCogLvl();
    const organicGags = store.getSelectedOrgGagTrackCounts();
    const isLured = store.getIsLured();
    const level4UpGagsOnly = store.getLevel4UpGagsOnly();
    const minGagLvl = level4UpGagsOnly ? 4 : null;

    return Array.from(
      util.iterFindComboArgs({ maxCogLvl, organicGags, isLured, minGagLvl }),
      findComboArgs => findCombo(findComboArgs)
    );
  });

  const onClickHideLvl13UpCogs: JSX.EventHandler<HTMLInputElement, MouseEvent> = (_) => {
    store.toggleHideLvl13UpCogs();
    storage.saveSavedState(store.getStateForStorage());
  };

  const onClickToggleLevel4UpGagsOnly: JSX.EventHandler<HTMLInputElement, MouseEvent> = (_) => {
    store.toggleLevel4UpGagsOnly();
    storage.saveSavedState(store.getStateForStorage());
  };

  const onClickToggleLure: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (_) => {
    store.toggleIsLured();
    storage.saveSavedState(store.getStateForStorage());
  };

  const onClickToggleShowOrgView: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (_) => {
    store.toggleShowOrgView();
    storage.saveSavedState(store.getStateForStorage());
  };

  const onClickClearSelection: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (_) => {
    batch(() => {
      store.resetSelectedOrgGags();
      store.setIsLured(false);
    });
    storage.saveSavedState(store.getStateForStorage());
  };

  const combosGridTemplate = () => {
    const maxLvl = store.getMaxCogLvl();
    return `repeat(${maxLvl}, 140px) / repeat(3, minmax(min-content, 250px))`;
  };

  return (
    <div id="combo-grid">
      <div style="flex-grow: 1; overflow: hidden;">
        <div id="combos">
          <div
            id="cog-lvl-column"
            style={{ 'grid-template-rows': `repeat(${store.getMaxCogLvl()}, 140px)` }}
          >
            <CogLvlColumn />
          </div>
          <div
            id="combos-grid"
            style={{ 'grid-template': combosGridTemplate() }}
          >
            <For each={Array.from(util.batch(4, combos()))}>
              {comboBatch => (
                <div class="combo-cell">
                  <For each={comboBatch}>
                    {combo => <Combo combo={combo} />}
                  </For>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
      <div id="combo-grid-settings">
        <label>
          <input
            type="checkbox"
            id="hide-lvl-13-up-cogs"
            checked={store.getHideLvl13UpCogs()}
            onClick={onClickHideLvl13UpCogs}
          />
          Hide Level 13+ Cogs
        </label>
        <label>
          <input
            type="checkbox"
            id="level-4-up-gags-only"
            checked={store.getLevel4UpGagsOnly()}
            onClick={onClickToggleLevel4UpGagsOnly}
          />
          Level 4+ Gags Only
        </label>
      </div>
      <div id="is-cog-lured">
        <button
          onClick={onClickToggleLure}
          style={{ background: store.getIsLured() ? 'var(--lure)' : 'unset' }}
        >
          <img src={util.getGagIconUrl({ track: 'lure', lvl: 1 }) /* $1 bill icon */} />
          <span>Is Cog Lured?</span>
        </button>
      </div>
      <div style="display: flex; justify-content: center;">
        <button id="expand-org" onClick={onClickToggleShowOrgView}>
          {store.getShowOrgView() ? 'Hide' : 'Show'} organic gags selection
        </button>
      </div>
      <div id="org-selection-container">
        <Show when={store.getShowOrgView()}>
          <div id="org-selection-header">
            <h4>Select Your Party's Organic Gags</h4>
            <button
              id="clear-selection"
              onClick={onClickClearSelection}
            >
              Clear Selection
            </button>
          </div>
        </Show>
        <OrgSelection />
      </div>
    </div>
  );
};

