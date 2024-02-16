import { findCombo, Combo, Gag, Cog } from './gags';
import * as util from './util';

type IterFindComboArgsArgs = Parameters<typeof util.iterFindComboArgs>[0];

describe('findCombo', () => {
  test.each<IterFindComboArgsArgs>([
    { maxCogLvl: 12, organicGags: {}, isLured: false },
  ])('combos match the snapshot for args %j', (args) => {
    const combos: Array<Combo> = Array.from(
      util.iterFindComboArgs(args),
      findComboArgs => findCombo(findComboArgs),
    )
    expect(combos).toMatchSnapshot();
  });
});

describe('Combo', () => {
  describe('inputKey & outputKey', () => {
    test.each([
      new Combo({
        gags: [
          new Gag({ track: 'sound', lvl: 1 }),
          new Gag({ track: 'throw', lvl: 0 }),
          new Gag({ track: 'squirt', lvl: 1 }),
          new Gag({ track: 'squirt', lvl: 7 }),
        ],
        cog: new Cog({ lvl: 11, isLured: true }),
        gagsInput: { sound: 1, throw: 1, squirt: 2 },
      }),
      new Combo({
        gags: [
          new Gag({ track: 'squirt', lvl: 1 }),
          new Gag({ track: 'squirt', lvl: 0 }),
          new Gag({ track: 'drop', lvl: 4 }),
          new Gag({ track: 'drop', lvl: 4, isOrg: true }),
        ],
        cog: new Cog({ lvl: 11, isLured: false }),
        gagsInput: { drop: 2, squirt: 2 },
        organicGagsInput: { drop: 1 },
      }),
    ])('generates the expected input key and output key', (combo) => {
      expect({
        inputKey: combo.inputKey(),
        outputKey: combo.outputKey(),
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

