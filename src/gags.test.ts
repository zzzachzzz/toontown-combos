import { findCombo, FindComboResult, Combo, Gag, Cog } from './gags';
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

