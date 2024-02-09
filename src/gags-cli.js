import findCombo, { logTable } from './gags.js';

const args = {
  game: 'ttr', // 'ttr' | 'classic'
  numToons: 2,  // 4 | 3 | 2
  cogLvl: 1,  // 1 - 12
  isLured: false,  // true | false
  gagTrack: 'drop',  // 'sound' | 'throw' | 'squirt' | 'drop'
  stunTrack: 'throw',  // 'sound' | 'throw' | 'squirt'
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

