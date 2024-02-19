import * as util from './util';

describe('batch', () => {
  test('generates correct batch sizes when remainder', () => {
    const gen = util.batch(4, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(Array.from(gen)).toEqual([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9],
    ]);
  });

  test('generates correct batch sizes when fewer elements than batchSize', () => {
    const gen = util.batch(6, [1, 2]);
    expect(Array.from(gen)).toEqual([
      [1, 2],
    ]);
  });

  test('generates zero batches when zero elements', () => {
    const gen = util.batch(2, []);
    expect(Array.from(gen)).toEqual([
    ]);
  });
});

describe('iterFindComboArgs', () => {
  test('generated combo args match snapshot', () => {
    const maxCogLvl = 12;
    const organicGags = {};
    const isLured = false;

    expect.addSnapshotSerializer({
      serialize(val, config, indentation, depth, refs, printer) {
        // Output all object properties on one line
        return JSON.stringify(val);
      },
      test(val) {
        return typeof val == 'object' && !Array.isArray(val);
      },
    })
    expect(
      Array.from(util.genFindComboArgsDefault({ maxCogLvl, organicGags, isLured }))
    ).toMatchSnapshot();
  });
});

