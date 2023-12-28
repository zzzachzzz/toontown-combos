import findCombo, { logTable, findComboV2 } from './gags.js';

// TODO, consider also supporting numToons=1 just for convenience I guess

const args = {
  game: 'ttr', // 'ttr' | 'classic'
  numToons: 2,  // 4 | 3 | 2
  cogLvl: 12,  // 1 - 12
  isLured: true,  // true | false
  gagTrack: 'trap',  // 'sound' | 'throw' | 'squirt' | 'drop' | 'trap'
  stunTrack: 'throw',  // 'sound' | 'throw' | 'squirt' | 'trap'
  organicGags: {
    // 4 | 3 | 2 | 1 | 0
    sound: 0,
    throw: 1,
    squirt: 0,
    drop: 0,
  },
};

const combo = findComboV2({...args, gags: {'throw': 1, 'squirt': 0} });
logTable(combo);

