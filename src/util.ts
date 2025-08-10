import type { FindComboArgs } from './gags';
import { GagTrack, GagTracks, BASE_URL, gags, SosToons } from './constants';

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
  minGagLvl,
}: { maxCogLvl: number; } & Pick<
  FindComboArgs,
  'organicGags' | 'isLured' | 'minGagLvl'>
): Generator<FindComboArgs> {
  const common = { isLured, organicGags, minGagLvl };
  const gagTracks: Array<GagTrack> = ['sound', 'throw', 'squirt'];
  for (let cogLvl = maxCogLvl; cogLvl >= 1; cogLvl--) {
    for (const gagTrack of gagTracks) {
      for (let numToons = 4; numToons >= 1; numToons--) {
        yield { ...common, cogLvl, gags: { [gagTrack]: numToons } };
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

export const getCogIconUrl = (cogLvl: number): string =>
  getResourceUrl(`cog_icons/${cogLvl > 14 ? 'field-office' : cogLvl}.png`)

export const getSosToonIconUrl = (sosToon: SosToons): string => {
  const iconName = (() => {
    switch (sosToon) {
      case SosToons.ClerkWill:      return 'clerk-will';
      case SosToons.ClerkPenny:     return 'clerk-penny';
      case SosToons.ClerkClara:     return 'clerk-clara';
      case SosToons.BarbaraSeville: return 'barbara-seville';
      case SosToons.SidSonata:      return 'sid-sonata';
      case SosToons.MoeZart:        return 'moe-zart';
      case SosToons.ClumsyNed:      return 'clumsy-ned';
      case SosToons.FranzNeckvein:  return 'franz-neckvein';
      case SosToons.BarnacleBessie: return 'barnacle-bessie';
      default:
        throw new Error(`Unmatched SosToons value '${sosToon}'`);
    }
  })();
  return getResourceUrl(`${iconName}.png`);
};

export const getSosGagIconUrl = (sosToon: SosToons) => {
  switch (sosToon) {
    case SosToons.ClerkWill:      return getGagIconUrl({ track: GagTracks.trap, lvl: 4 });
    case SosToons.ClerkPenny:     return getGagIconUrl({ track: GagTracks.trap, lvl: 5 });
    case SosToons.ClerkClara:     return getGagIconUrl({ track: GagTracks.trap, lvl: 6 });
    case SosToons.BarbaraSeville: return getGagIconUrl({ track: GagTracks.sound, lvl: 4 });
    case SosToons.SidSonata:      return getGagIconUrl({ track: GagTracks.sound, lvl: 5 });
    case SosToons.MoeZart:        return getGagIconUrl({ track: GagTracks.sound, lvl: 6 });
    case SosToons.ClumsyNed:      return getGagIconUrl({ track: GagTracks.drop, lvl: 4 });
    case SosToons.FranzNeckvein:  return getGagIconUrl({ track: GagTracks.drop, lvl: 5 });
    case SosToons.BarnacleBessie: return getGagIconUrl({ track: GagTracks.drop, lvl: 6 });
    default:
      throw new Error(`Unmatched SosToons value '${sosToon}'`);
  }
};

