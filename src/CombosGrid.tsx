import { For, createMemo, ComponentProps } from 'solid-js';
import { ComboCell } from './ComboCell';
import { useStore } from './store.instance';
import type { GagTrack } from './constants';

/** Which tracks to generate combos for */
const gagTracks: Array<GagTrack> = ['sound', 'throw', 'squirt', 'drop'];

export const CombosGrid = () => {
  const store = useStore();

  const comboCellProps = createMemo(() => {
    const maxCogLvl = store.getMaxCogLvl();
    const arr: Array<ComponentProps<typeof ComboCell>> = [];
    for (let cogLvl = maxCogLvl; cogLvl >= 1; cogLvl--) {
      for (const gagTrack of gagTracks) {
        if (gagTrack === 'drop') {
          arr.push({ cogLvl, gagTrack, stunTrack: 'sound' });
          arr.push({ cogLvl, gagTrack, stunTrack: 'throw' });
          arr.push({ cogLvl, gagTrack, stunTrack: 'squirt' });
        } else {
          arr.push({ cogLvl, gagTrack });
        }
      }
    }
    return arr;
  });

  return (
    <For each={comboCellProps()}>
      {p => <ComboCell {...p} />}
    </For>
  );
};

