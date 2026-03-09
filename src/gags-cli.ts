import { findCombo, FindComboResult, logTable } from './gags';

const args: Parameters<typeof findCombo>[0] = {
  cogLvl: 12,
  isLured: false,
  gags: {
    toonup: 0,
    trap:   0,
    lure:   0,
    sound:  4,
    throw:  0,
    squirt: 0,
    drop:   0,
  },
  organicGags: {
    toonup: 0,
    trap:   0,
    lure:   0,
    sound:  3,
    throw:  0,
    squirt: 0,
    drop:   0,
  },
  minGagLvl: undefined,
  additionalGagMultiplier: undefined,
};

const combo = findCombo(args);
logTable(new FindComboResult(args, combo));

