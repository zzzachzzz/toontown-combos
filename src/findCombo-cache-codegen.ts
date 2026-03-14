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

// TODO The collab?
// export function* iterFindComboArgs({ // TODO Rename? ComboGrid permutations
export function* iterFindComboArgsComboGridPermutations(): Generator<FindComboArgs> {
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

export function genCache(): Record<FindComboArgsKey, ComboKey> {
  return Object.fromEntries(
    Array.from(
      iterFindComboArgsComboGridPermutations(),
      findComboArgs => {
        const res = new FindComboResult(findComboArgs, findCombo(findComboArgs));
        return [res.inputKey(), res.outputKey()];
      }
    )
  );
}

export function genCodegenFileContents(): string {
  const cache = genCache();
  return JSON.stringify(cache, null, 2);
}

export const outCodegenFilename = 'findCombo-cache.codegen.json';
export const outCodegenFilepath = resolve(dirname(fileURLToPath(import.meta.url)), outCodegenFilename);

async function main() {
  console.log('Beginning cache codegen');

  const codegenFileContents = genCodegenFileContents();

  await fs.writeFile(
    outCodegenFilepath,
    codegenFileContents,
    { encoding: 'utf8' }
  );

  console.log(`Wrote cache codegen to file '${outCodegenFilepath}'`);
}

if (import.meta.main) main();

