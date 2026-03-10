import {
  findCombo,
  FindComboResult,
  FindComboArgs,
  Combo,
  Gag,
  sortFnGags,
  sortFnGagsLowest,
  cleanGagCounts,
  findComboArgsToKey,
  keyToFindComboArgs,
  FindComboArgsKey,
  ComboKey,
} from './gags';
import { GagTracks } from './constants';
import * as util from './util';
import { iterFindComboArgsComboGridPermutations } from './findCombo-cache-codegen';

const GT = GagTracks;

describe('findCombo', () => {
  test('matches snapshot for all permutations relevant to combo grid', () => {
    const findComboResults: Array<FindComboResult> = Array.from(
      iterFindComboArgsComboGridPermutations(),
      findComboArgs => new FindComboResult(findComboArgs, findCombo(findComboArgs)),
    );
    expectFindComboResults(findComboResults);
  });

  test('matches snapshot for all 2sound2drop & 3sound1drop permutations', () => {
    const findComboResults: Array<FindComboResult> = Array.from(
      iterFindComboArgsSoundDropPermutations(),
      findComboArgs => new FindComboResult(findComboArgs, findCombo(findComboArgs)),
    );
    expectFindComboResults(findComboResults);
  });

  function expectFindComboResults(findComboResults: Array<FindComboResult>) {
    for (const res of findComboResults) {
      if (!res.combo) continue;
      expect.soft(
        res.combo.damageKillsCog(res.cog, res.args.additionalGagMultiplier),
        `[${res.inputKey()}] Non-null combo does not kill cog`
      ).toBe(true);
      const orgTrackCounts = res.combo.orgTrackCounts();
      for (const [track, orgsAvailable] of Object.entries(res.args.organicGags)) {
        const orgsUsed = orgTrackCounts[track as GagTracks];
        if (orgsUsed > orgsAvailable) { // Extra condition check for lazy expect message creation
          expect.soft(
            orgsUsed,
            `[${res.inputKey()}] More orgs used in combo than available for track ${track} ` +
            `(${orgsUsed} > ${orgsAvailable}) ${JSON.stringify(res.shortView())}\n`
          ).toBeLessThanOrEqual(orgsAvailable);
        }
      }
    }
    expect(findComboResults.map(res => res.shortView())).toMatchSnapshot();
  }
});

const findComboArgsToFromKeyTestCases: [FindComboArgs, string][] = [
  [{ gags: { throw: 4 }, organicGags: { throw: 3 }, minGagLvl: 4, cogLvl: 14, isLured: true }, 'Th_Th_Th_th_min4_c14_l'],
  [{ gags: { throw: 2, squirt: 1 }, organicGags: { throw: 1, squirt: 1 }, cogLvl: 1, isLured: false }, 'Th_th_Sq_c1'],
  [{ gags: { drop: 1, throw: 2 }, organicGags: { throw: 1 }, minGagLvl: 5, cogLvl: 12, isLured: false }, 'Th_th_dr_min5_c12'],
  [{ gags: { drop: 1 }, organicGags: {}, minGagLvl: 4, cogLvl: 9, isLured: true, additionalGagMultiplier: -0.25 }, 'dr_min4_c9_l_*-0.25'],
  [{ gags: {}, organicGags: {}, minGagLvl: 4, cogLvl: 9, isLured: true, additionalGagMultiplier: 0.6 }, 'min4_c9_l_*0.6'],
];

describe('findComboArgsToKey', () => {
  test.each(
    findComboArgsToFromKeyTestCases
  )('converts `FindComboArgs` object to string key', (findComboArgs, key) => {
    expect(findComboArgsToKey(findComboArgs)).toEqual(key);
  });
});

describe('keyToFindComboArgs', () => {
  test.each(
    findComboArgsToFromKeyTestCases
  )('converts string key to `FindComboArgs` object', (findComboArgs, key) => {
    expect(keyToFindComboArgs(key as FindComboArgsKey)).toEqual(findComboArgs);
  });
});

describe('cleanGagCounts', () => {
  test('sorts keys to match gag track order and omits 0 or undefined values', () => {
    const cleaned = cleanGagCounts({ drop: 0, squirt: 1, toonup: 3, lure: undefined });
    expect(JSON.stringify(cleaned)).toEqual(
      '{"toonup":3,"squirt":1}'
    );
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

    // https://github.com/zzzachzzz/toontown-combos/issues/34
    test.each([
      {
        combo: new Combo({ gags: [
          new Gag({ track: GagTracks.lure, lvl: 5, isOrg: false }),
          new Gag({ track: GagTracks.throw, lvl: 4, isOrg: false }),
          new Gag({ track: GagTracks.throw, lvl: 6, isOrg: false }),
          new Gag({ track: GagTracks.throw, lvl: 6, isOrg: false }),
        ] }),
        additionalGagMultiplier: 0.60,
        expectedDamage: 523,
      },
      {
        combo: new Combo({ gags: [
          new Gag({ track: GagTracks.sound, lvl: 6, isOrg: false }),
          new Gag({ track: GagTracks.sound, lvl: 6, isOrg: false }),
          new Gag({ track: GagTracks.sound, lvl: 6, isOrg: false }),
          new Gag({ track: GagTracks.sound, lvl: 7, isOrg: false }),
        ] }),
        additionalGagMultiplier: -0.25,
        expectedDamage: 214,
      },
      {
        combo: new Combo({ gags: [
          new Gag({ track: GagTracks.lure, lvl: 5, isOrg: false }),
          new Gag({ track: GagTracks.throw, lvl: 5, isOrg: false }),
          new Gag({ track: GagTracks.throw, lvl: 5, isOrg: false }),
          new Gag({ track: GagTracks.throw, lvl: 6, isOrg: false }),
        ] }),
        additionalGagMultiplier: -0.25,
        expectedDamage: 230,
      },
      {
        combo: new Combo({ gags: [
          new Gag({ track: GagTracks.trap, lvl: 6, isOrg: true }),
        ] }),
        additionalGagMultiplier: 0.40,
        expectedDamage: 278,
      },
    ])(
      'returns correct damage for additionalGagMultiplier of $additionalGagMultiplier - test %#',
      ({ combo, additionalGagMultiplier, expectedDamage }) => {
      expect(combo.damage({ additionalGagMultiplier })).toBe(expectedDamage);
    });
  });

  const comboToFromKeyTestCases: [Combo, string][] = [
    [
      new Combo({ gags: [
        new Gag({ track: GT.throw, lvl: 6, isOrg: true }),
        new Gag({ track: GT.throw, lvl: 5, isOrg: true }),
        new Gag({ track: GT.squirt, lvl: 7 }),
      ] }),
      'Th6_Th5_sq7'
    ],
  ];

  describe('toKey', () => {
    test.each(
      comboToFromKeyTestCases
    )('converts `Combo` object to string key', (combo, key) => {
      expect(combo.toKey()).toEqual(key);
    });
  });

  describe('fromKey', () => {
    test.each(
      comboToFromKeyTestCases
    )('converts string key to `Combo` object', (combo, key) => {
      expect(Combo.fromKey(key as ComboKey)).toEqual(combo);
    });
  });
});

describe('sortFnGags', () => {
  test('sorts by track order, then by damage, high to low', () => {
    expect([
      new Gag({ track: GT.drop, lvl: 1, isOrg: false }),
      new Gag({ track: GT.toonup, lvl: 1, isOrg: true }),
      new Gag({ track: GT.drop, lvl: 1, isOrg: true }),
      new Gag({ track: GT.squirt, lvl: 1, isOrg: false }),
      new Gag({ track: GT.drop, lvl: 2, isOrg: false }),
      new Gag({ track: GT.trap, lvl: 1, isOrg: false }),
      new Gag({ track: GT.lure, lvl: 1, isOrg: true }),
      new Gag({ track: GT.sound, lvl: 1, isOrg: true }),
      new Gag({ track: GT.throw, lvl: 1, isOrg: false }),
      new Gag({ track: GT.trap, lvl: 1, isOrg: true }),
      new Gag({ track: GT.toonup, lvl: 1, isOrg: false }),
      new Gag({ track: GT.throw, lvl: 1, isOrg: true }),
      new Gag({ track: GT.sound, lvl: 1, isOrg: false }),
      new Gag({ track: GT.lure, lvl: 1, isOrg: false }),
      new Gag({ track: GT.squirt, lvl: 1, isOrg: true }),
    ].toSorted(sortFnGags)).toEqual([
      new Gag({ track: GT.toonup, lvl: 1, isOrg: true }),
      new Gag({ track: GT.toonup, lvl: 1, isOrg: false }),
      new Gag({ track: GT.trap, lvl: 1, isOrg: true }),
      new Gag({ track: GT.trap, lvl: 1, isOrg: false }),
      new Gag({ track: GT.lure, lvl: 1, isOrg: true }),
      new Gag({ track: GT.lure, lvl: 1, isOrg: false }),
      new Gag({ track: GT.sound, lvl: 1, isOrg: true }),
      new Gag({ track: GT.sound, lvl: 1, isOrg: false }),
      new Gag({ track: GT.throw, lvl: 1, isOrg: true }),
      new Gag({ track: GT.throw, lvl: 1, isOrg: false }),
      new Gag({ track: GT.squirt, lvl: 1, isOrg: true }),
      new Gag({ track: GT.squirt, lvl: 1, isOrg: false }),
      new Gag({ track: GT.drop, lvl: 2, isOrg: false }),
      new Gag({ track: GT.drop, lvl: 1, isOrg: true }),
      new Gag({ track: GT.drop, lvl: 1, isOrg: false }),
    ]);
  });
});

describe('sortFnGagsLowest', () => {
  test('sorts by damage, low to high', () => {
    const arr = [
      new Gag({ track: GT.drop,    lvl: 1,  isOrg: false }),
      new Gag({ track: GT.toonup,  lvl: 1,  isOrg: true  }),
      new Gag({ track: GT.drop,    lvl: 1,  isOrg: true  }),
      new Gag({ track: GT.squirt,  lvl: 1,  isOrg: false }),
      new Gag({ track: GT.drop,    lvl: 2,  isOrg: false }),
      new Gag({ track: GT.drop,    lvl: 0,  isOrg: true  }),
      new Gag({ track: GT.drop,    lvl: 0,  isOrg: false }),
      new Gag({ track: GT.trap,    lvl: 1,  isOrg: false }),
      new Gag({ track: GT.lure,    lvl: 1,  isOrg: true  }),
      new Gag({ track: GT.sound,   lvl: 1,  isOrg: true  }),
      new Gag({ track: GT.sound,   lvl: 0,  isOrg: true  }),
      new Gag({ track: GT.sound,   lvl: 0,  isOrg: false }),
      new Gag({ track: GT.throw,   lvl: 1,  isOrg: false }),
      new Gag({ track: GT.trap,    lvl: 1,  isOrg: true  }),
      new Gag({ track: GT.toonup,  lvl: 1,  isOrg: false }),
      new Gag({ track: GT.throw,   lvl: 1,  isOrg: true  }),
      new Gag({ track: GT.sound,   lvl: 1,  isOrg: false }),
      new Gag({ track: GT.lure,    lvl: 1,  isOrg: false }),
      new Gag({ track: GT.squirt,  lvl: 1,  isOrg: true  }),
    ];

    const sorted = arr.toSorted(sortFnGagsLowest);

    expect(sorted).toEqual([
      new Gag({ track: GT.sound,   lvl: 0,  isOrg: false }),
      new Gag({ track: GT.sound,   lvl: 0,  isOrg: true  }),
      new Gag({ track: GT.drop,    lvl: 0,  isOrg: false }),
      new Gag({ track: GT.drop,    lvl: 0,  isOrg: true  }),
      new Gag({ track: GT.toonup,  lvl: 1,  isOrg: false }),
      new Gag({ track: GT.toonup,  lvl: 1,  isOrg: true  }),
      new Gag({ track: GT.lure,    lvl: 1,  isOrg: false }),
      new Gag({ track: GT.lure,    lvl: 1,  isOrg: true  }),

      new Gag({ track: GT.sound,   lvl: 1,  isOrg: false }),
      new Gag({ track: GT.squirt,  lvl: 1,  isOrg: false }),
      new Gag({ track: GT.sound,   lvl: 1,  isOrg: true  }),
      new Gag({ track: GT.squirt,  lvl: 1,  isOrg: true  }),
      new Gag({ track: GT.throw,   lvl: 1,  isOrg: false }),
      new Gag({ track: GT.throw,   lvl: 1,  isOrg: true  }),
      new Gag({ track: GT.drop,    lvl: 1,  isOrg: false }),
      new Gag({ track: GT.trap,    lvl: 1,  isOrg: false }),
      new Gag({ track: GT.drop,    lvl: 1,  isOrg: true  }),
      new Gag({ track: GT.trap,    lvl: 1,  isOrg: true  }),
      new Gag({ track: GT.drop,    lvl: 2,  isOrg: false }),
    ]);
  });
});

function* iterFindComboArgsSoundDropPermutations(): Generator<FindComboArgs> {
  const maxCogLvl = 20;
  const isLured = false;
  for (const gags of [
    { sound: 2, drop: 2 },
    { sound: 3, drop: 1 },
  ] satisfies FindComboArgs['gags'][]) {
    for (let cogLvl = maxCogLvl; cogLvl >= 1; cogLvl--) {
      for (const soundOrg of util.range(0, gags.sound)) {
        for (const dropOrg of util.range(0, gags.drop)) {
          yield {
            minGagLvl: undefined,
            isLured,
            cogLvl,
            gags,
            organicGags: { sound: soundOrg, drop: dropOrg },
          };
        }
      }
    }
  }
}

