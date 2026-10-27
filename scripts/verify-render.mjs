#!/usr/bin/env node
/**
 * Verificação de renderização: monta as grandes telas com React (render estático)
 * para garantir que nenhum componente quebra em tempo de execução.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'verify-render-'));
const bundle = join(dir, 'smoke.mjs');
const patched = join(dir, 'smoke-patched.mjs');

execFileSync(
  'npx',
  [
    'esbuild',
    'scripts/smoke/render-smoke.tsx',
    '--bundle',
    '--format=esm',
    '--loader:.json=json',
    `--outfile=${bundle}`,
  ],
  { stdio: 'inherit' },
);

// `import.meta.glob` é resolvido pelo Vite; nos testes usamos um stub.
const code = readFileSync(bundle, 'utf8').replace(/import\.meta\.glob\([^)]*\)/g, '{}');
writeFileSync(patched, code);

try {
  execFileSync('node', [patched], { stdio: 'inherit', cwd: process.cwd() });
} finally {
  rmSync(dir, { recursive: true, force: true });
}
