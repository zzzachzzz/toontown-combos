import { For, createMemo } from 'solid-js';
import { Combo } from './Combo';
import { useStore } from './store.instance';
import { batch, genFindComboArgsDefault } from './util';
import { findCombo, Combo as _Combo } from './gags';

export const CombosGrid = () => {
  const store = useStore();

  const combos = createMemo(() => {
    const maxCogLvl = store.getMaxCogLvl();
    const organicGags = store.getSelectedOrgGagTrackCounts();
    const isLured = store.getIsLured();

    return Array.from(
      genFindComboArgsDefault({ maxCogLvl, organicGags, isLured }),
      findComboArgs => findCombo(findComboArgs)
    );
  });

  return (
    <For each={Array.from(batch(4, combos()))}>
      {comboBatch => (
        <div class="combo-cell">
          <For each={comboBatch}>
            {combo => <Combo combo={combo} />}
          </For>
        </div>
      )}
    </For>
  );
};

