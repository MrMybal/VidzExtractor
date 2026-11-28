import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('./', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const command = process.argv[2] || 'build';
if (!['build', 'check'].includes(command)) throw new Error('Expected build or check');
const origin = JSON.parse(await read('vendor/cydoc-origin.json'));
const archive = await readFile(new URL(`vendor/${origin.archive}`, root));
if (createHash('sha256').update(archive).digest('hex') !== origin.sha256) {
  throw new Error('CyDoc archive does not match the recorded upstream build');
}
const installed = JSON.parse(await read('node_modules/cydoc/package.json'));
if (installed.version !== origin.version) throw new Error('Unexpected CyDoc version');
const result = spawnSync(process.execPath, ['node_modules/cydoc/tools/cli.mjs', command, 'cydoc.config.json'], {
  cwd: fileURLToPath(root), stdio: 'inherit'
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);

// Adapt the upstream reader shell at generation time, keeping its real bootstrap.
const entry = new URL('../Documentation/Documentation.html', root);
const html = (await readFile(entry, 'utf8'))
  .replace('<html lang="fr">', '<html lang="en">')
  .replace('CyDoc — votre documentation, partout. Lecteur local et multilingue pour vos applications.',
    'Vidz Extracteur — installation, video downloads and troubleshooting in English and French.')
  .replace('href="DocData/assets/favicon.svg" type="image/svg+xml"',
    'href="DocData/assets/app-logo.png" type="image/png"')
  .replace('<title>CyDoc — Documentation</title>', '<title>Vidz Extracteur — Documentation</title>')
  .replace('Activez JavaScript pour utiliser le lecteur de documentation CyDoc.',
    'Enable JavaScript to read this manual. Activez JavaScript pour lire ce manuel.');
await writeFile(entry, html);
await copyFile(new URL('DocAI.md', root), new URL('../Documentation/DocAI.md', root));
const notices = [
  'Vidz Extracteur documentation reader: third-party notices',
  'The application remains GPL-3.0-only; see APPLICATION-LICENSE.txt.',
  `CyDoc ${origin.version}, upstream commit ${origin.commit}\n${origin.repository}\n${await read('node_modules/cydoc/LICENSE')}`,
  `Marked (Markdown compiler, build only)\n${await read('node_modules/marked/LICENSE.md')}`,
  `Prism (syntax highlighting, build only)\n${await read('node_modules/prismjs/LICENSE')}`,
  `esbuild (bundler, build only)\n${await read('node_modules/esbuild/LICENSE.md')}`
].join('\n\n--------------------\n\n');
await writeFile(new URL('../Documentation/DocData/THIRD-PARTY-NOTICES.txt', root), notices);
await copyFile(new URL('../LICENSE', root), new URL('../Documentation/DocData/APPLICATION-LICENSE.txt', root));
console.log(`Reader generated with CyDoc ${origin.version} (${origin.commit.slice(0, 7)})`);
