import { $ } from 'bun';
import { cp } from 'node:fs/promises';
import { platform } from 'node:process';

const describe = (await $`git describe --tags || true`.text()).trim();

// Use .slice(1) to remove the prefix 'v' from the version.
const version = describe.length !== 0 ? describe.slice(1) : '0.1.0-snapshot';
console.log(`version: ${version}`);

const resourcesPath = './resources';
const buildPath = './build'
const extensionName = `moodle_data-${version}`;
const extensionPath = `${buildPath}/${extensionName}`;
const zipName = `${extensionName}.zip`;

await cp(resourcesPath, extensionPath, { recursive: true });

await Bun.build({
  entrypoints: ['./index.ts'],
  outdir: extensionPath,
});

{
  const bsdtar = new Map([
    ['linux', 'bsdtar'],
    ['win32', 'tar'],
  ]).get(platform) ?? 'linux';

  await $`cd ${extensionPath}; ${bsdtar} -v -c -f ../${zipName} -a *`;
}