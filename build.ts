import { $ } from 'bun';
import { cp } from 'node:fs/promises';

const describe = await $`git describe --tags || true`.text();

const version = describe.length !== 0 ? describe : '0.1.0-snapshot';
console.log(`version: ${version}`);

const resourcesPath = './resources';
const buildPath = './build'
const extensionName = `moodle_data-${version}`;
const extensionPath = `${buildPath}/${extensionName}`;
const zipPath = `${extensionPath}.tar.gz`;

await cp(resourcesPath, extensionPath, { recursive: true });

await Bun.build({
  entrypoints: ['./index.ts'],
  outdir: extensionPath,
});

await $`tar --version`;
await $`tar -v -c -f ${zipPath} -zC ${buildPath} ${extensionName}`;