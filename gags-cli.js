import findCombo, { logTable, findComboV2 } from './gags.js';

// TODO output multiple combos, for example,
// in multi-track scenarios, such as squirt + drop,
// return a combo which uses squirt lvl 6 and one that uses drop lvl 6.
// And the ability to omit certain gags from being used in a combo. For example,
// no fog/bday/storm, which is relevant to field offices. Although, the algorithm
// should prefer that anyway. Generating multiple combo choices might solve that issue.
// Think about... big changes with more dynamic results and more user input parameters.

const args = {
  game: 'ttr', // 'ttr' | 'classic'
  numToons: 2,  // 4 | 3 | 2
  cogLvl: 11,  // 1 - 12
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

const combos = findComboV2({
  cogLvl: 12,  // 1 - 12
  isLured: false,  // true | false
  gags: {
    sound: 1,
    throw: 1,
    squirt: 2,
    // drop: 2,
    // sound: 2,
    // trap: 1,
  },
  organicGags: {
    throw: 0,
    trap: 1,
    squirt: 1,
  },
  game: 'ttr',
});

for (const combo of combos) {
  logTable(combo);
}

