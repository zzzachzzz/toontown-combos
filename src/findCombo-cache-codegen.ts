import * as fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import {
  findCombo,
  FindComboResult,
  type FindComboArgs,
  type FindComboCache,
} from './gags';
import { genComboGridFindComboArgs } from './util';
import { type GagTrack } from './constants';

export function* genComboGridFindComboArgsAllPermutations(): Generator<FindComboArgs> {
  for (const isLured of [false, true]) {
    for (const minGagLvl of [undefined, 4]) {
      for (const findComboArgs of genComboGridFindComboArgs({
        isLured,
        minGagLvl,
        maxCogLvl: 20,
        organicGags: {},
      })) {
        const [gagTrack, numToons] = Object.entries(findComboArgs.gags)[0] as [GagTrack, number];
        for (let numOrg = 0; numOrg <= numToons; numOrg++) {
          yield {
            ...findComboArgs,
            organicGags: { [gagTrack]: numOrg },
          };
        }
      }
    }
  }
}

export function genCache(): FindComboCache {
  return Object.fromEntries(
    Array.from(
      genComboGridFindComboArgsAllPermutations(),
      findComboArgs => {
        const res = new FindComboResult(findComboArgs, findCombo(findComboArgs));
        return [res.inputKey(), res.outputKey()];
      }
    )
  );
}

export function genCodegenFileContents(): string {
  const cache = genCache();
  return (
    `import type { FindComboCache } from './gags';\n\n` +
    `export const findComboCache: FindComboCache = ${JSON.stringify(cache, null, 2)} as FindComboCache;`
  );
}

export const outCodegenFilename = 'findCombo-cache.codegen.ts';
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

