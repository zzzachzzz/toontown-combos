import { JSX, batch, createSignal } from 'solid-js';
import { Provider, useStore } from './store.instance';
import { CombosGrid } from './CombosGrid';
import { CogLvlColumn } from './CogLvlColumn';
import { OrgSelection } from './OrgSelection';
import { OrgSelectionPreview } from './OrgSelectionPreview';
import * as storage from './local-storage';
import { BASE_URL } from './constants';
import './index.css';

export const App = () => {
  return (
    <Provider>
      <_App />
    </Provider>
  );
};

const _App = () => {
  const [showOrgView, setShowOrgView] = createSignal(true);
  const store = useStore();

  const onClickHideLvl13UpCogs: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> = (_) => {
    store.toggleHideLvl13UpCogs();
    storage.saveSavedState(store.getStateForStorage());
  };

  const onChangeSelectGame: JSX.ChangeEventHandler<HTMLSelectElement, Event> = (e) => {
    const game = e.target.value as 'ttr' | 'classic';
    store.setGame(game);
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
    <div id="app">
      <div id="game-select-and-lvl-13-toggle-container">
        <label>
          <input
            type="checkbox"
            id="hide-lvl-13-up-cogs"
            checked={store.getHideLvl13UpCogs()}
            onClick={onClickHideLvl13UpCogs}
          />
          Hide Level 13+ Cogs
        </label>
        <select id="game-select" name="game" onChange={onChangeSelectGame} value={store.getGame()}>
          <option value="ttr">Toontown Rewritten</option>
          <option value="classic">Toontown Online (Classic)</option>
        </select>
      </div>
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
            style={{ 'grid-template': `repeat(${store.getMaxCogLvl()}, 140px) / repeat(6, 1fr)` }}
          >
            <CombosGrid />
          </div>
        </div>
      </div>
      <div id="is-cog-lured">
        <button
          onClick={onClickToggleLure}
          style={{ background: store.getIsLured() ? 'var(--lure)' : 'unset' }}
        >
          <img src={`${BASE_URL}gag_icons/$1_Bill.png`} />
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

