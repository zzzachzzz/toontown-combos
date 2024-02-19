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

/** Generates commbo args for default combos used in UI combos grid */
export function* genFindComboArgsDefault({
  maxCogLvl,
  organicGags,
  isLured,
}: { maxCogLvl: number; } & Pick<
  FindComboArgs,
  'organicGags' | 'isLured'>
): Generator<FindComboArgs> {
  const gagTracks: Array<GagTrack> = ['sound', 'throw', 'squirt', 'drop'];
  const stunTracks: Array<GagTrack> = ['sound', 'throw', 'squirt'];
  for (let cogLvl = maxCogLvl; cogLvl >= 1; cogLvl--) {
    for (const gagTrack of gagTracks) {
      if (gagTrack === 'drop') {
        for (const stunTrack of stunTracks) {
          for (let numToons = 4; numToons >= 1; numToons--) {
            const numDrop = Math.max(numToons - 1, 1);
            yield {
              cogLvl,
              isLured,
              gags: {
                drop: numDrop,
                [stunTrack]: numDrop === numToons ? 0 : 1,
              },
              organicGags,
            };
          }
        }
      } else {
        for (let numToons = 4; numToons >= 1; numToons--) {
          yield {
            cogLvl,
            isLured,
            gags: { [gagTrack]: numToons },
            organicGags,
          };
        }
      }
    }
  }
}

export function* genFindComboArgsCustom({
  gagTrack,
  maxCogLvl = 20,
  minCogLvl = 1,
  maxToons = 4,
  minToons = 1,
  organicGags = {},
  isLured = false,
}: {
  gagTrack: GagTrack;
  maxCogLvl?: number;
  minCogLvl?: number;
  maxToons?: number;
  minToons?: number,
  organicGags?: FindComboArgs['organicGags'];
  isLured?: FindComboArgs['isLured'];
}): Generator<FindComboArgs> {
  for (let cogLvl = maxCogLvl; cogLvl >= minCogLvl; cogLvl--) {
    for (let numToons = maxToons; numToons >= minToons; numToons--) {
      yield { cogLvl, isLured, gags: { [gagTrack]: numToons }, organicGags };
    }
  }
}

export function* genFindComboArgsFixedNumToons({
  maxCogLvl = 20,
  minCogLvl = 1,
  gags,
  organicGags = {},
  isLured = false,
}: {
  maxCogLvl?: number;
  minCogLvl?: number;
  maxToons?: number;
  minToons?: number,
  gags: FindComboArgs['gags'];
  organicGags?: FindComboArgs['organicGags'];
  isLured?: FindComboArgs['isLured'];
}): Generator<FindComboArgs> {
  for (let cogLvl = maxCogLvl; cogLvl >= minCogLvl; cogLvl--) {
    yield { cogLvl, isLured, gags, organicGags };
  }
}

