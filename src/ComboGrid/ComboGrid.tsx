import { JSX, For, Show, batch } from 'solid-js';
import { useStore } from '../store.instance';
import * as util from '../util';
import * as storage from '../local-storage';
import { Combo } from './Combo';
import { CogLvlColumn } from './CogLvlColumn';
import { OrganicSelection } from './OrganicSelection';
import styles from './ComboGrid.module.css';

export const ComboGrid = () => {
  const store = useStore();

  const combos = store.getComboGridCombos;

  const onClickHideLvl15UpCogs: JSX.EventHandler<HTMLInputElement, MouseEvent> = (_) => {
    store.toggleHideLvl15UpCogs();
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
    <div class={styles.pageContainer}>
      <div class={styles.combosContainer}>
        <div class={styles.combosOuterGrid}>
          <div
            class={styles.cogLvlColumnGrid}
            style={{ 'grid-template-rows': `repeat(${store.getMaxCogLvl()}, 140px)` }}
          >
            <CogLvlColumn />
          </div>
          <div
            class={styles.gagCombosInnerGrid}
            style={{ 'grid-template': combosGridTemplate() }}
          >
            <For each={Array.from(util.batch(4, combos()))}>
              {comboBatch => (
                <div>
                  <For each={comboBatch}>
                    {combo => <Combo combo={combo} />}
                  </For>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
      <div class={styles.settings}>
        <div class={styles.settingsCheckboxes}>
          <label class={styles.settingsCheckboxLabel}>
            <input
              type="checkbox"
              checked={store.getHideLvl15UpCogs()}
              onClick={onClickHideLvl15UpCogs}
            />
            Hide Level 15+ Cogs
          </label>
          <label class={styles.settingsCheckboxLabel}>
            <input
              type="checkbox"
              checked={store.getLevel4UpGagsOnly()}
              onClick={onClickToggleLevel4UpGagsOnly}
            />
            Level 4+ Gags Only
          </label>
        </div>
        <button
          class={styles.isCogLured}
          onClick={onClickToggleLure}
          style={{
            background: store.getIsLured() ? 'var(--lure)' : 'var(--color-bg)',
            color: store.getIsLured() ? 'var(--black)' : 'inherit',
          }}
        >
          <img src={util.getGagIconUrl({ track: 'lure', lvl: 1 }) /* $1 bill icon */} />
          <span>Is Cog Lured?</span>
        </button>
        <button class={styles.expandOrg} onClick={onClickToggleShowOrgView}>
          {store.getShowOrgView() ? 'Hide' : 'Show'} organic gags selection
        </button>
        <div class={styles.orgSelectionContainer}>
          <Show when={store.getShowOrgView()}>
            <div class={styles.orgSelectionHeader}>
              <h4>Select Your Party's Organic Gags</h4>
              <button
                class={styles.clearSelection}
                onClick={onClickClearSelection}
              >
                Clear Selection
              </button>
            </div>
          </Show>
          <OrganicSelection />
        </div>
      </div>
    </div>
  );
};

