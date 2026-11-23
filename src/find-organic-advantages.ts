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
}: {
  gagTrack: GagTrack;
  maxCogLvl?: number;
  minCogLvl?: number;
  maxToons?: number;
  minToons?: number,
  organicGags?: FindComboArgs['organicGags'];
  isLured?: FindComboArgs['isLured'];
}) {
  const retval: [FindComboResult, FindComboResult][] = [];
  // findCombo(
  for (let cogLvl = maxCogLvl; cogLvl >= minCogLvl; cogLvl--) {
    for (let numToons = maxToons; numToons >= minToons; numToons--) {
      const args = { cogLvl, isLured, gags: { [gagTrack]: numToons }, organicGags, minGagLvl: 5 };
      const nonOrgCombo = findCombo({ ...args, organicGags: {} });
      const orgCombo = findCombo(args);

      if (nonOrgCombo?.toKey() !== orgCombo?.toKey()) {
        retval.push([
          new FindComboResult(args, nonOrgCombo),
          new FindComboResult(args, orgCombo),
        ]);
      }
    }
  }
  return retval;
}

function main() {
  let res = thing({
    gagTrack: 'squirt',
    maxCogLvl: 14,
    minCogLvl: 7,
    organicGags: { squirt: 1 },
    isLured: true,
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

