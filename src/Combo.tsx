import { For, Show, createMemo } from 'solid-js';
import { useStore } from './store.instance';
import findCombo from './gags';
import { GagTrack, BASE_URL } from './constants';

type Props = {
  cogLvl: number;
  gagTrack: GagTrack;
  numToons: number;
  stunTrack?: GagTrack;
};

export const Combo = ({ cogLvl, gagTrack, numToons, stunTrack }: Props) => {
  const store = useStore();

  // TODO Might need a custom equality check... cache key concept for combos
  const combo = createMemo(() => {
    const organicGags = store.getSelectedOrgGagTrackCounts();
    const isLured = store.getIsLured();
    const game = store.getGame();
    return findCombo({ cogLvl, gagTrack, numToons, isLured, organicGags, stunTrack, game });
  });

  return (
    <Show when={combo().damageKillsCog()}>
      <div class="combo">
        <span class="combo-dmg">{combo().damage()}</span>
        <div class="gags">
          <For each={combo().gags}>
            {gag => (
              <div
                class="gag-icon-container"
                style={{ background: gag.isOrg ? `var(--${gag.track})` : 'unset' }}
              >
                <img class="gag-icon" src={`${BASE_URL}gag_icons/${gag.name.replace(/\s/g, '_')}.png`} />
                {gag.isOrg && <span class="org">Org</span>}
              </div>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
};

