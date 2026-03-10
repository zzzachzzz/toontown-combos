import { genCodegenFileContents, outCodegenFilename, outCodegenFilepath } from './findCombo-cache-codegen';

describe('genCodegenFileContents', () => {
  test(`matches snapshot file contents of '${outCodegenFilename}'`, async () => {
    await expect(genCodegenFileContents()).toMatchFileSnapshot(outCodegenFilepath);
  });
});

