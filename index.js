import findCombo, { classicCogHp, ttrCogHp } from './gags.js';
import './index.css';

const savedState = JSON.parse(localStorage.getItem('savedState'));

const _selectedOrgGags =
  savedState?.selectedOrgGags || Array.from({ length: 4 }, () => null);

/**
 * @type {{
 *   selectedOrgGags: Array<string | null>,
 *   selectedOrgGagCounts: Object<string, number>,
 *   isLured: boolean,
 *   game: string,
 *   showOrgView: boolean,
 * }}
 */
const state = {
  selectedOrgGags: _selectedOrgGags,
  selectedOrgGagCounts: calcSelectedGagTrackCounts(_selectedOrgGags),
  isLured: savedState?.isLured || false,
  hideLvl13UpCogs: savedState?.hideLvl13UpCogs || false,
  /** 'ttr' or 'classic' */
  game: savedState?.game || 'ttr',
  showOrgView: true,
};

/** @return {number} */
const getMaxCogLvl = () => {
  if (state.game === 'classic')
    return 12;
  if (state.hideLvl13UpCogs)
    return 12;
  return 20;
};

/**
 * @return {Object<string, number>}
 */
function calcSelectedGagTrackCounts(selectedOrgGags) {
  return selectedOrgGags.reduce((acc, selectedOrgGag) => {
    if (selectedOrgGag !== null) acc[selectedOrgGag]++;
    return acc;
  }, { toonup: 0, trap: 0, lure: 0, sound: 0, throw: 0, squirt: 0, drop: 0 });
}

const gagTracks = ['sound', 'throw', 'squirt', 'drop'];

function CombosCell({ cogLvl, gagTrack, stunTrack = null }) {
  return `
    <div class="combo-cell">
      ${(() => {
        const arr = [];
        for (let numToons = 4; numToons >= 1; numToons--) {
          // Check if gagTrack is 'drop' and numToons is 1
          if (!(gagTrack === 'drop' && numToons === 1)) {
            arr.push(Combo({ numToons, cogLvl, gagTrack, stunTrack }));
          }
        }
        return arr.join('');
      })()}
    </div>
  `;
}

function Combo({ cogLvl, gagTrack, numToons, stunTrack }) {
  const { selectedOrgGagCounts: organicGags, isLured, game } = state;

  const combo = findCombo({ cogLvl, gagTrack, numToons, isLured, organicGags, stunTrack, game });

  if (!combo.damageKillsCog())
    return null;

  const damageText = combo.damage();

  return `
    <div class="combo">
      <span class="combo-dmg">${damageText}</span>
      <div class="gags">
        ${combo.gags.reduce((acc, gag) => acc + `
          <div class="gag-icon-container" ${gag.isOrg ? `style="background: var(--${gag.track});"` : ''}>
            <img class="gag-icon" src="assets/gag_icons/${gag.name.replace(/\s/g, '_')}.png" />
            ${gag.isOrg ? '<span class="org">Org</span>' : ''}
          </div>
        `, '')}
      </div>
    </div>
  `;
}

function CogLvlCell(cogLvl) {
  const cogHp = (state.game === 'ttr' ? ttrCogHp : classicCogHp)[cogLvl];
  const cogLvlImg = cogLvl > 12 ? '13+' : cogLvl.toString();
  return `
    <div class="cog-lvl-cell">
      <div class="cog-icon-container">
        <img src="assets/cog_icons/${cogLvlImg}.png" ${state.isLured ? 'style="background: var(--lure);"' : ''} />
        ${state.isLured ? '<span>Lured</span>' : ''}
      </div>
      <div>
        <span class="cog-lvl">${cogLvl}</span>
        <span class="cog-hp">${cogHp}</span><span class="hp">HP</span>
      </div>
    </div>
  `;
}

function CogLvlColumn() {
  let arr = [];
  const maxCogLvl = getMaxCogLvl();
  for (let cogLvl = maxCogLvl; cogLvl >= 1; cogLvl--) {
    arr.push(CogLvlCell(cogLvl));
  }
  return arr.join('');
}

function CombosGrid() {
  const arr = [];
  const maxCogLvl = getMaxCogLvl();
  for (let cogLvl = maxCogLvl; cogLvl >= 1; cogLvl--) {
    arr.push(
      gagTracks.reduce((acc, gagTrack) => {
        if (gagTrack === 'drop') {
          return acc
            + CombosCell({ cogLvl, gagTrack, stunTrack: 'sound' })
            + CombosCell({ cogLvl, gagTrack, stunTrack: 'throw' })
            + CombosCell({ cogLvl, gagTrack, stunTrack: 'squirt' });
        } else {
          return acc + CombosCell({ cogLvl, gagTrack });
        }
      }, '')
    );
  }
  return arr.join('');
}

function OrgSelection() {
  return `
    <ul class="org-selection-list">
      ${Array.from({ length: 4 }).reduce((acc, _, i) => acc + `
        <li>
          <div class="toon-num">Toon ${i+1}</div>
          ${OrgGagTrackSelect({ toonIdx: i })}
        </li>
      `, '')}
    </ul>
  `;
}

function OrgSelectionPreview() {
  if (state.selectedOrgGags.every(g => g === null))
    return '';

  return `
    <ul class="org-selection-preview-list">
      ${Array.from({ length: 4 }).reduce((acc, _, toonIdx) => {
        const selectedOrgGagTrack = state.selectedOrgGags[toonIdx];
        /** @type {{ name: string, img: string } | null} */
        let foundGagTrack;
        if (selectedOrgGagTrack !== null) {
          foundGagTrack = trackSelectList.find(
            ({ name }) => selectedOrgGagTrack === name.replace(/\s/g, '').toLowerCase()
          )
          if (!foundGagTrack) throw Error(`Did not find track for key ${selectedOrgGagTrack}`);
        } else {
          foundGagTrack = null;
        }
        const background = foundGagTrack !== null
          ? `var(--${selectedOrgGagTrack})`
          : 'transparent';
        return acc + `
          <li role="option" style="background: ${background};" class="org-selection-preview-list-item">
            ${foundGagTrack === null ? '' : `
              <div class="img-container">
                <img src="${foundGagTrack.img}" />
              </div>
              <span>${foundGagTrack.name}</span>
            `}
          </li>
        `;
      }, '')}
    </ul>
  `;
}

const trackSelectList = [
  { name: 'Toon Up', img: 'assets/gag_icons/Feather.png' },
  { name: 'Trap', img: 'assets/gag_icons/Banana_Peel.png' },
  { name: 'Lure', img: 'assets/gag_icons/$1_Bill.png' },
  { name: 'Sound', img: 'assets/gag_icons/Bike_Horn.png' },
  { name: 'Throw', img: 'assets/gag_icons/Cupcake.png' },
  { name: 'Squirt', img: 'assets/gag_icons/Squirting_Flower.png' },
  { name: 'Drop', img: 'assets/gag_icons/Flower_Pot.png' },
];

function OrgGagTrackSelect({ toonIdx }) {
  const selectedOrgGag = state.selectedOrgGags[toonIdx];
  return `
    <ul class="org-gag-track-list" role="listbox">
      ${trackSelectList.reduce((acc, { name, img }) => {
        const key = name.replace(/\s/g, '').toLowerCase();
        const background = selectedOrgGag === key
          ? `var(--${key})`
          : 'transparent';
        return acc + `
          <li role="option" style="background: ${background};">
            <button onclick="onClickOrgGagTrack('${key}', ${toonIdx})">
              <div class="img-container">
                <img src="${img}" />
              </div>
              <span>${name}</span>
            </button>
          </li>
        `;
        }, '')}
    </ul>
  `;
}

function onMaxCogLvlChanged() {
  const cogLvlColumn = document.getElementById("cog-lvl-column");
  const combosGrid = document.getElementById("combos-grid");
  const maxCogLvl = getMaxCogLvl();
  cogLvlColumn.style.gridTemplateRows = `repeat(${maxCogLvl}, 140px)`;
  combosGrid.style.gridTemplate = `repeat(${maxCogLvl}, 140px) / repeat(6, 1fr)`;
}

function CogLuredButton() {
  return `
    <button ${state.isLured ? 'style="background: var(--lure);"': ''}>
      <img src="assets/gag_icons/$1_Bill.png" />
      <span>Is Cog Lured?</span>
    </button>
  `;
}

function onChangeSelectGame(e) {
  const game = e.target.value;
  state.game = game;

  saveStateToLocalStorage();

  onMaxCogLvlChanged();
  renderCogLvlColumn();
  renderComboGrid();
}

function onClickHideLvl13UpCogs() {
  const hideLvl13UpCogs = !state.hideLvl13UpCogs;
  state.hideLvl13UpCogs = hideLvl13UpCogs;

  saveStateToLocalStorage();

  renderHideLvl13UpCogsCheckbox();
  onMaxCogLvlChanged();
  renderCogLvlColumn();
  renderComboGrid();
}

function onClickToggleLure() {
  state.isLured = !state.isLured;

  saveStateToLocalStorage();

  renderCogLuredButton();
  renderCogLvlColumn();
  renderComboGrid();
}

function onClickToggleOrgView() {
  state.showOrgView = !state.showOrgView;

  const toggleOrgViewBtn = document.getElementById('expand-org');
  const orgSelection = document.getElementById('org-selection-container');
  const orgSelectionPreview = document.getElementById('org-selection-preview');

  if (state.showOrgView) {
    toggleOrgViewBtn.innerText = 'Hide organic gags selection';
    orgSelection.style.display = 'block';
    orgSelectionPreview.style.display = 'none';
  } else {
    toggleOrgViewBtn.innerText = 'Show organic gags selection';
    orgSelection.style.display = 'none';
    orgSelectionPreview.style.display = 'block';
  }
}

function saveStateToLocalStorage() {
  const { selectedOrgGags, isLured, hideLvl13UpCogs, game } = state;
  localStorage.setItem('savedState', JSON.stringify({ selectedOrgGags, isLured, hideLvl13UpCogs, game }));
}

window.onClickOrgGagTrack = (gagTrack, toonIdx) => {
  const prevSelectedGagTrack = state.selectedOrgGags[toonIdx];
  state.selectedOrgGags[toonIdx] = gagTrack === prevSelectedGagTrack
    ? null
    : gagTrack;
  state.selectedOrgGagCounts = calcSelectedGagTrackCounts(state.selectedOrgGags);

  saveStateToLocalStorage();

  renderOrgSelection();
  renderComboGrid();
};

function onClickClearSelection() {
  const _selectedOrgGags = Array.from({ length: 4 }, () => null);
  state.selectedOrgGags = _selectedOrgGags;
  state.selectedOrgGagCounts = calcSelectedGagTrackCounts(_selectedOrgGags);
  state.isLured = false;

  saveStateToLocalStorage();

  renderCogLuredButton();
  renderCogLvlColumn();
  renderOrgSelection();
  renderComboGrid();
}

const renderComboGrid = () => document.getElementById('combos-grid').innerHTML = CombosGrid();
renderComboGrid();

const renderCogLvlColumn = () => document.getElementById('cog-lvl-column').innerHTML = CogLvlColumn();
renderCogLvlColumn();

const renderOrgSelection = () => {
  document.getElementById('org-selection').innerHTML = OrgSelection();
  document.getElementById('org-selection-preview').innerHTML = OrgSelectionPreview();
};
renderOrgSelection();

const renderCogLuredButton = () => document.getElementById('is-cog-lured').innerHTML = CogLuredButton();
renderCogLuredButton();

const renderHideLvl13UpCogsCheckbox = () => {
  /** @type {HTMLInputElement} */
  const el = document.getElementById('hide-lvl-13-up-cogs');
  el.checked = state.hideLvl13UpCogs;
};
renderHideLvl13UpCogsCheckbox();
onMaxCogLvlChanged();

document.getElementById('clear-selection').addEventListener('click', onClickClearSelection);
document.getElementById('is-cog-lured').addEventListener('click', onClickToggleLure);
document.getElementById('game-select').addEventListener('change', onChangeSelectGame);
document.getElementById('hide-lvl-13-up-cogs').addEventListener('click', onClickHideLvl13UpCogs);
document.getElementById('expand-org').addEventListener('click', onClickToggleOrgView);

(function setInitialSelectedGameDOM() {
  const select = document.getElementById('game-select');
  for (let i = 0; i < select.options.length; i++) {
    const option = select.options[i];
    if (option.value === state.game) {
      option.setAttribute('selected', true);
      break;
    }
  }
})();
