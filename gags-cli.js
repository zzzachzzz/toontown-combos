import findCombo, { logTable, Cog } from './gags.js';

// TODO output multiple combos, for example,
// in multi-track scenarios, such as squirt + drop,
// return a combo which uses squirt lvl 6 and one that uses drop lvl 6.
// And the ability to omit certain gags from being used in a combo. For example,
// no fog/bday/storm, which is relevant to field offices. Although, the algorithm
// should prefer that anyway. Generating multiple combo choices might solve that issue.
// Think about... big changes with more dynamic results and more user input parameters.

const game = 'ttr'; // 'ttr' | 'classic'
const cog = new Cog({ lvl: 11, isLured: false, game });
const combos = findCombo({
  cogLvl: cog.lvl,
  isLured: cog.isLured,
  gags: {
    trap: 0,
    sound: 3,
    throw: 0,
    squirt: 0,
    drop: 0,
  },
  organicGags: {
    trap: 1,
    sound: 0,
    throw: 1,
    squirt: 0,
    drop: 1,
  },
  game,
});

for (const combo of combos) {
  logTable(combo, cog);
}

