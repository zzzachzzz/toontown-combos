import { For } from 'solid-js';
import { Combo } from './Combo';
import type { GagTrack } from './constants';

type Props = {
  cogLvl: number;
  gagTrack: GagTrack;
  stunTrack?: GagTrack;
};

export const ComboCell = ({ cogLvl, gagTrack, stunTrack }: Props) => {
  return (
    <div class="combo-cell">
      <For each={[4, 3, 2, 1]}>
        {numToons => {
          // Check if gagTrack is 'drop' and numToons is 1
          if (gagTrack === 'drop' && numToons === 1)
            return null;

          return <Combo
            numToons={numToons}
            cogLvl={cogLvl}
            gagTrack={gagTrack}
            stunTrack={stunTrack}
          />
        }}
      </For>
    </div>
  );
};

