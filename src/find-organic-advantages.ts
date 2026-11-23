import { findCombo, FindComboArgs, FindComboResult, logTable, Combo } from './gags';
import type { GagTrack } from './constants';

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

// const combo = findCombo(args);
// logTable(combo);

function thing({
  gagTrack,
  maxCogLvl = 20,
  minCogLvl = 1,
  maxToons = 4,
  minToons = 1,
  organicGags = {},
  isLured = false,
  altOrganicGags,
  gags,
}: {
  gagTrack?: GagTrack;
  maxCogLvl?: number;
  minCogLvl?: number;
  maxToons?: number;
  minToons?: number,
  organicGags?: FindComboArgs['organicGags'];
  isLured?: FindComboArgs['isLured'];

  altOrganicGags: FindComboArgs['organicGags']; // TODO
  gags: FindComboArgs['gags']; // TODO
}) {
  const retval: [FindComboResult, FindComboResult][] = [];
  // findCombo(
  for (let cogLvl = maxCogLvl; cogLvl >= minCogLvl; cogLvl--) {
    // for (let numToons = maxToons; numToons >= minToons; numToons--) {
      const argsCommon = { cogLvl, isLured, gags, organicGags, minGagLvl: 5 };

      const argsNonOrgCombo = { ...argsCommon };
      const nonOrgCombo = findCombo(argsNonOrgCombo);

      const argsOrgCombo = { ...argsCommon, organicGags: altOrganicGags };
      const orgCombo = findCombo(argsOrgCombo);

      if (nonOrgCombo?.toKey() !== orgCombo?.toKey()) {
        retval.push([
          new FindComboResult(argsNonOrgCombo, nonOrgCombo),
          new FindComboResult(argsOrgCombo, orgCombo),
        ]);
      }
    // }
  }
  return retval;
}

function main() {
  let res = thing({
    // gagTrack: 'squirt',
    maxCogLvl: 14,
    minCogLvl: 7,
    organicGags: { trap: 0, drop: 0 },
    isLured: true,
    altOrganicGags: { trap: 1, drop: 1 },
    gags: { trap: 1, drop: 1,  },
  });

  for (const [nonOrgCombo, orgCombo] of res) {
    console.log('nonOrgCombo:');
    logTable(nonOrgCombo);
    console.log('orgCombo:');
    logTable(orgCombo);
    console.log('\n----------------------\n');
  }
}
main();

