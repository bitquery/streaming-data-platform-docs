/**
 * gray-matter depends on js-yaml 3.x APIs (safeLoad/safeDump) removed in js-yaml 4.
 * Patch engines.js so we can pin js-yaml to a patched 4.x release.
 */
const fs = require('fs');
const path = require('path');

const enginesPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'gray-matter',
  'lib',
  'engines.js',
);

if (!fs.existsSync(enginesPath)) {
  process.exit(0);
}

const content = fs.readFileSync(enginesPath, 'utf8');
const patched = content
  .replace('yaml.safeLoad.bind(yaml)', 'yaml.load.bind(yaml)')
  .replace('yaml.safeDump.bind(yaml)', 'yaml.dump.bind(yaml)');

if (patched !== content) {
  fs.writeFileSync(enginesPath, patched);
  console.log('patched gray-matter for js-yaml 4.x compatibility');
}
