// AngkaNusa hand-in program (Node 22, standard library only).
// The deliverable is the static site in app/ plus the renders in screenshots/.
// This program copies both into the output directory (/output in the grader,
// MAKEFUN_OUTPUT_DIR elsewhere) and writes dossier.json with the vendored
// make.fun library, so the scorer can rebuild the same bytes and compare.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}

mkdirSync(outputDir, { recursive: true });
copyTree(join(repoRoot, 'app'), join(outputDir, 'app'));
if (existsSync(join(repoRoot, 'screenshots'))) {
  copyTree(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'));
} else {
  mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
}

// Caps mirror the scorer's gate: dossier text 160 KiB, at most 4 screenshots of
// 256 KiB each, app/ at most 993 entries and 16 MiB.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log('AngkaNusa: site + screenshots copied, dossier.json written (' + dossier.length + ' bytes).');
