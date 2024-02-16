import findCombo, { logTable } from './gags';

const args: Parameters<typeof findCombo>[0] = {
  game: 'ttr' as const, // 'ttr' | 'classic'
  numToons: 2,  // 4 | 3 | 2
  cogLvl: 1,  // 1 - 12
  isLured: false,  // true | false
  gagTrack: 'drop' as const,  // 'sound' | 'throw' | 'squirt' | 'drop'
  stunTrack: 'throw' as const,  // 'sound' | 'throw' | 'squirt'
  organicGags: {
    // 4 | 3 | 2 | 1 | 0
    sound: 0,
    throw: 1,
    squirt: 0,
    drop: 0,
  },
};

const combo = findCombo(args);
logTable(combo);

