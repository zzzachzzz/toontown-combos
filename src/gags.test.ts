import { findCombo, FindComboResult, Combo, Gag, Cog } from './gags';
import { GagTracks } from './constants';
import * as util from './util';

type IterFindComboArgsArgs = Parameters<typeof util.iterFindComboArgs>[0];

describe('findCombo', () => {
  test.each<IterFindComboArgsArgs>([
    { maxCogLvl: 12, organicGags: {}, isLured: false },
  ])('combos match the snapshot for args %j', (args) => {
    const findComboResults: Array<FindComboResult> = Array.from(
      util.iterFindComboArgs(args),
      findComboArgs => findCombo(findComboArgs),
    )
    expect(findComboResults).toMatchSnapshot();
  });
});

describe('FindComboResult', () => {
  describe('inputKey & outputKey', () => {
    test.each([
      new FindComboResult({
        combo: new Combo({ gags: [] }),
        cog: new Cog({ lvl: 11, isLured: true }),
        gagsInput: { sound: 1, throw: 1, squirt: 2 },
        organicGagsInput: {},
      }),
      new FindComboResult({
        combo: new Combo({ gags: [] }),
        cog: new Cog({ lvl: 11, isLured: false }),
        gagsInput: { drop: 2, squirt: 2 },
        organicGagsInput: { drop: 1 },
      }),
    ])('generates the expected input key and output key', (findComboRes) => {
      expect({
        inputKey: findComboRes.inputKey(),
        outputKey: findComboRes.outputKey(),
      }).toMatchSnapshot();
    });
  });

  describe('cleanGagCounts', () => {
    test('sorts keys to match gag track order and omits 0 or undefined values', () => {
      const cleaned = Combo.cleanGagCounts({ drop: 0, squirt: 1, toonup: 3, lure: undefined });
      expect(JSON.stringify(cleaned)).toEqual(
        '{"toonup":3,"squirt":1}'
      );
    });
  });
});

describe('Combo', () => {
  describe('damage', () => {
    // https://github.com/zzzachzzz/toontown-combos/issues/35
    test.each([
      {
        combo: new Combo({ gags: [
          new Gag({ track: GagTracks.lure, lvl: 5, isOrg: false }),
          new Gag({ track: GagTracks.squirt, lvl: 5, isOrg: false }),
          new Gag({ track: GagTracks.squirt, lvl: 4, isOrg: true }),
          new Gag({ track: GagTracks.squirt, lvl: 4, isOrg: true }),
          new Gag({ track: GagTracks.squirt, lvl: 4, isOrg: false }),
        ] }),
        expectedDamage: 173,
      },
      {
        combo: new Combo({ gags: [
          new Gag({ track: GagTracks.lure, lvl: 5, isOrg: false }),
          new Gag({ track: GagTracks.throw, lvl: 5, isOrg: true }),
          new Gag({ track: GagTracks.throw, lvl: 5, isOrg: false }),
          new Gag({ track: GagTracks.throw, lvl: 5, isOrg: false }),
          new Gag({ track: GagTracks.throw, lvl: 4, isOrg: false }),
        ] }),
        expectedDamage: 258,
      },
    ])('off by one damage calc issue #35 - test %#', ({ combo, expectedDamage }) => {
      expect(combo.damage()).toBe(expectedDamage);
    });
  });
});

