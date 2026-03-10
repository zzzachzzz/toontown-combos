import * as fs from 'fs/promises';
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import {
  findCombo,
  FindComboResult,
  type FindComboArgs,
  type FindComboArgsKey,
  type ComboKey,
} from './gags';
import { range } from './util';
import { GagTracks } from './constants';

// TODO import this, it's copied from gags.test.ts
function* iterFindComboArgsComboGridPermutations(): Generator<FindComboArgs> {
  for (const { gagTrack, numToons } of (
    [GagTracks.sound, GagTracks.throw, GagTracks.squirt]
    .flatMap(gagTrack => Array.from(
      range(4, 1, -1),
      numToons => ({ gagTrack, numToons })
    ))
  )) {
    const maxCogLvl = 20;
    for (
      const isLured of (
        gagTrack === GagTracks.throw || gagTrack === GagTracks.squirt
        ? [false, true]
        : [false]
      )
    ) {
      for (let cogLvl = maxCogLvl; cogLvl >= 1; cogLvl--) {
        for (let numOrg = 0; numOrg <= numToons; numOrg++) {
          for (const minGagLvl of [undefined, 4]) {
            yield {
              minGagLvl,
              isLured,
              cogLvl,
              gags: { [gagTrack]: numToons },
              organicGags: { [gagTrack]: numOrg },
            };
          }
        }
      }
    }
  }
}

async function main() {
  console.log('Beginning cache codegen');
  const cache: Record<FindComboArgsKey, ComboKey> = Object.fromEntries(
    Array.from(
      iterFindComboArgsComboGridPermutations(),
      findComboArgs => {
        const res = new FindComboResult(findComboArgs, findCombo(findComboArgs));
        return [res.inputKey(), res.outputKey()];
      }
    )
  );

  const outfilename = 'findCombo-cache.codegen.ts';
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const outfilepath = resolve(__dirname, outfilename);

  await fs.writeFile(
    outfilepath,
    `export const cache: Record<FindComboArgsKey, ComboKey> = ${JSON.stringify(cache, null, 2)};`,
    { encoding: 'utf8' }
  );

  console.log(`Wrote cache codegen to file '${outfilepath}'`);
}

if (import.meta.main) main();

