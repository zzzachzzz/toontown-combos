import { JSX, For, batch, createSignal, createMemo } from 'solid-js';
import { useStore } from './store.instance';
import { Combo } from './Combo';
import { CogLvlColumn } from './CogLvlColumn';
import { OrgSelection } from './OrgSelection';
import { OrgSelectionPreview } from './OrgSelectionPreview';
import * as util from './util';
import { findCombo, Combo as _Combo } from './gags';
import * as storage from './local-storage';

export const ComboGrid = () => {
  const [showOrgView, setShowOrgView] = createSignal(true);
  const store = useStore();

  const combos = createMemo(() => {
    const maxCogLvl = store.getMaxCogLvl();
    const organicGags = store.getSelectedOrgGagTrackCounts();
    const isLured = store.getIsLured();

    return Array.from(
      util.iterFindComboArgs({ maxCogLvl, organicGags, isLured }),
      findComboArgs => findCombo(findComboArgs)
    );
  });

  const onClickHideLvl13UpCogs: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> = (_) => {
    store.toggleHideLvl13UpCogs();
    storage.saveSavedState(store.getStateForStorage());
  };

  const onClickToggleLure: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (_) => {
    store.toggleIsLured();
    storage.saveSavedState(store.getStateForStorage());
  };

  const onClickClearSelection: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (_) => {
    batch(() => {
      store.resetSelectedOrgGags();
      store.setIsLured(false);
    });
    storage.saveSavedState(store.getStateForStorage());
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
            style={{ 'grid-template': `repeat(${store.getMaxCogLvl()}, 140px) / repeat(3, 1fr)` }}
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
      <div id="lvl-13-toggle-container">
        <label>
          <input
            type="checkbox"
            id="hide-lvl-13-up-cogs"
            checked={store.getHideLvl13UpCogs()}
            onClick={onClickHideLvl13UpCogs}
          />
          Hide Level 13+ Cogs
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
        <button id="expand-org" onClick={() => setShowOrgView(s => !s)}>
          {showOrgView() ? 'Hide' : 'Show'} organic gags selection
        </button>
      </div>
      {showOrgView() ? (
        <div id="org-selection-container">
          <div id="org-selection-header">
            <h4>Select Your Party's Organic Gags</h4>
            <button
              id="clear-selection"
              onClick={onClickClearSelection}
            >
              Clear Selection
            </button>
          </div>
          <div id="org-selection">
            <OrgSelection />
          </div>
        </div>
      ) : (
        <div id="org-selection-preview">
          <OrgSelectionPreview />
        </div>
      )}
    </div>
  );
};

