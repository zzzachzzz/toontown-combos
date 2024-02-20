import type { FindComboArgs } from './gags';
import { GagTrack, BASE_URL, gags } from './constants';

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

/**
 * Generate an inclusive range of numbers.
 * Examples:
 * ---------
 * range(1, 10)        -> 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
 * range(0, -10, -1)   -> 0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10
 * range(0, 10, 2)     -> 0, 2, 4, 6, 8, 10
 */
export function* range(start: number, end: number, step: number = 1): Generator<number> {
  if (step === 0) {
    throw new Error("Step cannot be zero.");
  }
  if (start < end && step < 0 || start > end && step > 0) {
    throw new Error("Invalid range: step direction does not match range direction.");
  }
  if (step > 0) {
    for (let i = start; i <= end; i += step) {
      yield i;
    }
  } else {
    for (let i = start; i >= end; i += step) {
      yield i;
    }
  }
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

export const getResourceUrl = (path: string): string => `${BASE_URL}${path}`;

export const getGagIconUrl = ({ track, lvl }: { track: GagTrack; lvl: number; }): string => {
  const iconName = lvl === 0
    ? 'None'
    : gags[track][lvl].name.replace(/\s/g, '_');
  return getResourceUrl(`gag_icons/${iconName}.png`);
};

