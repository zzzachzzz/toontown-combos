import type { FindComboArgs } from './gags';
import type { GagTrack } from './constants';

export function* batch<T>(batchSize: number, iterable: Iterable<T>): Generator<Array<T>> {
  let yieldNext: Array<T> = [];
  for (const item of iterable) {
    yieldNext.push(item);
    if (yieldNext.length === batchSize) {
      yield yieldNext;
      yieldNext = [];
    }
  }
  if (yieldNext.length > 0)
    yield yieldNext;
}

export function* iterFindComboArgs({
  maxCogLvl,
  organicGags,
  isLured,
}: { maxCogLvl: number; } & Pick<
  FindComboArgs,
  'organicGags' | 'isLured'>
): Generator<FindComboArgs> {
  const common = { isLured, organicGags };
  const gagTracks: Array<GagTrack> = ['sound', 'throw', 'squirt', 'drop'];
  const stunTracks: Array<GagTrack> = ['sound', 'throw', 'squirt'];
  for (let cogLvl = maxCogLvl; cogLvl >= 1; cogLvl--) {
    for (const gagTrack of gagTracks) {
      if (gagTrack === 'drop') {
        for (const stunTrack of stunTracks) {
          for (let numToons = 4; numToons >= 1; numToons--) {
            const numDrop = Math.max(numToons - 1, 1);
            yield {
              ...common,
              cogLvl,
              gags: {
                drop: numDrop,
                [stunTrack]: numDrop === numToons ? 0 : 1,
              },
            };
          }
        }
      } else {
        for (let numToons = 4; numToons >= 1; numToons--) {
          yield { ...common, cogLvl, gags: { [gagTrack]: numToons } };
        }
      }
    }
  }
}

