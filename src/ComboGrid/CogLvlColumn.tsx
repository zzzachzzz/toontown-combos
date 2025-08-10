import { For, createMemo } from 'solid-js';
import { CogLvlCell } from './CogLvlCell';
import { useStore } from '../store.instance';

export const CogLvlColumn = () => {
  const store = useStore();

  const cogLvls = createMemo(() => {
    const maxCogLvl = store.getMaxCogLvl();
    const arr: Array<number> = [];
    for (let cogLvl = maxCogLvl; cogLvl >= 1; cogLvl--) {
      arr.push(cogLvl);
    }
    return arr;
  });

  return (
    <For each={cogLvls()}>
      {cogLvl => <CogLvlCell cogLvl={cogLvl} />}
    </For>
  );
};

