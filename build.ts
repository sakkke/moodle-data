import { $ } from 'bun';
import { cp } from 'node:fs/promises';

const describe = (await $`git describe --tags || true`.text()).trim();

// Use .slice(1) to remove the prefix 'v' from the version.
const version = describe.length !== 0 ? describe.slice(1) : '0.1.0-snapshot';
console.log(`version: ${version}`);

const resourcesPath = './resources';
const buildPath = './build'
const extensionName = `moodle_data-${version}`;
const extensionPath = `${buildPath}/${extensionName}`;
const tarPath = `${extensionPath}.tar.gz`;

await cp(resourcesPath, extensionPath, { recursive: true });

await Bun.build({
  entrypoints: ['./index.ts'],
  outdir: extensionPath,
});

await $`tar --version`;
await $`tar -v -c -f ${tarPath} -zC ${buildPath} ${extensionName}`;