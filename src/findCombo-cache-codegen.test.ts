import { genCodegenFileContents, outCodegenFilename, outCodegenFilepath } from './findCombo-cache-codegen';

describe('genCodegenFileContents', () => {
  // The presence of this test makes it so that we don't need to do codegen as part of the build step.
  // We simply verify that there is no diff from the result of the codegen, without writing any files to disk.
  test(`matches snapshot file contents of '${outCodegenFilename}'`, async () => {
    await expect(genCodegenFileContents()).toMatchFileSnapshot(outCodegenFilepath);
  });
});

