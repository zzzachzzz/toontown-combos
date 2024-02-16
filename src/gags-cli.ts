import { findCombo, logTable } from './gags';

const args: Parameters<typeof findCombo>[0] = {
  cogLvl: 11,
  isLured: false,
  gags: {
    toonup: 0,
    trap:   0,
    lure:   0,
    sound:  3,
    throw:  0,
    squirt: 0,
    drop:   0,
  },
  organicGags: {
    toonup: 0,
    trap:   0,
    lure:   0,
    sound:  2,
    throw:  0,
    squirt: 0,
    drop:   0,
  },
};

const combo = findCombo(args);
logTable(combo);

