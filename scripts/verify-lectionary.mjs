#!/usr/bin/env node
/**
 * Verificação do lecionário.
 *
 *  · Todas as citações do Ofício Diário e do RCL são interpretáveis;
 *  · Todos os dias de 2026 a 2040 têm leituras do Ofício;
 *  · Todos os domingos têm Próprio do RCL para o Ano A, B e C;
 *  · Nenhum ofício fica sem salmos.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'verify-lectionary-'));
const bundle = join(dir, 'lectionary.mjs');
execFileSync(
  'npx',
  [
    'esbuild',
    'scripts/entry-verify.ts',
    '--bundle',
    '--format=esm',
    '--loader:.json=json',
    `--outfile=${bundle}`,
  ],
  { stdio: 'inherit' },
);

// O texto bíblico usa `import.meta.glob` (resolvido pelo Vite). Nos testes,
// substituímos por um carregador que lê os arquivos do repositório.
const patched = join(dir, 'lectionary-patched.mjs');
const source = readFileSync(bundle, 'utf8')
  .replace(
    /import\.meta\.glob(?:<[^>]*>)?\([^)]*\)/,
    `new Proxy({}, { get: (_target, key) => {
      const file = String(key).split('/').pop();
      return async () => ({ default: JSON.parse(__readFile('src/data/bible/books/' + file, 'utf8')) });
    } })`,
  )
  .replace(
    /^/,
    "import { readFileSync as __readFile } from 'node:fs';\n",
  );
writeFileSync(patched, source);

const mod = await import(patched);
const {
  getLiturgicalDay,
  getDailyOfficeReadings,
  getRclPropers,
  getRclTracks,
  parseCitation,
  renderCitation,
  COLLECTS,
  DAILY_OFFICES,
  FAMILY_OFFICES,
  HOLY_DAYS,
  CANTICLES,
} = mod;

let failures = 0;
const fail = (message) => {
  failures += 1;
  if (failures <= 25) console.error(`  ✗ ${message}`);
};

const stats = {
  days: 0,
  missingOffice: 0,
  missingPsalms: 0,
  citationTotal: 0,
  citationUnparsed: 0,
  citationMissingBook: 0,
  sundays: 0,
  missingProper: 0,
};
const unparsed = new Set();
const missingBooks = new Set();

const addCitations = (list, label) => {
  for (const citation of list) {
    if (!citation) continue;
    stats.citationTotal += 1;
    const parsed = parseCitation(citation);
    if (parsed.alternatives.length === 0) {
      stats.citationUnparsed += 1;
      unparsed.add(`${label}: ${citation}`);
      continue;
    }
    for (const part of parsed.alternatives) {
      if (part.missing && !part.canticleNumber) {
        stats.citationMissingBook += 1;
        missingBooks.add(part.bookName);
      }
      if (!part.missing && !part.canticleNumber && part.spans.length === 0) {
        stats.citationUnparsed += 1;
        unparsed.add(`${label} (sem faixa): ${citation}`);
      }
    }
  }
};

const collect = (lessons) => {
  const out = [];
  const walk = (value) => {
    if (!value) return;
    if (typeof value === 'string') out.push(value);
    else if (Array.isArray(value)) value.forEach(walk);
    else Object.values(value).forEach(walk);
  };
  walk(lessons);
  return out;
};

console.log('Ofício Diário e RCL — 2026 a 2040');
let cursor = '2026-01-01';
while (cursor <= '2040-12-31') {
  const day = getLiturgicalDay(cursor);
  stats.days += 1;

  const office = getDailyOfficeReadings(day);
  if (!office) {
    stats.missingOffice += 1;
    fail(`${cursor}: sem leituras do Ofício (${day.season}, semana ${day.officeKey.week}, dia ${day.officeKey.day})`);
  } else {
    if (office.psalms.morning.length === 0 && office.psalms.evening.length === 0) {
      stats.missingPsalms += 1;
      fail(`${cursor}: ofício sem salmos`);
    }
    addCitations(office.psalms.morning, `${cursor} salmos manhã`);
    addCitations(office.psalms.evening, `${cursor} salmos tarde`);
    addCitations(collect(office.lessons), `${cursor} leituras`);
  }

  if (day.isSunday) {
    stats.sundays += 1;
    const proper = getRclPropers(day);
    if (!proper) {
      stats.missingProper += 1;
      fail(`${cursor} (domingo, ${day.seasonLabel}, ${day.sundayTitle}): sem Próprio RCL`);
    } else {
      const tracks = getRclTracks(proper);
      for (const track of tracks) {
        addCitations([track.first, track.psalm, track.second, track.gospel], `${cursor} RCL`);
      }
    }
  }

  const next = new Date(`${cursor}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  cursor = next.toISOString().slice(0, 10);
}

// -------------------------------------------------------- texto bíblico real
console.log('Texto bíblico');
const passages = await Promise.all(
  ['Salmo 30', 'Ruth 3:1-7', 'Luke 10', 'Neh 7:73b-8:3, 5-18', 'Salmo 119:145-176', 'Isaiah 55:1-5 or Job 5:8-21'].map(
    (citation) => renderCitation(citation),
  ),
);
const expected = [
  ['Salmo 30', 11],
  ['Ruth 3:1-7', 7],
  ['Luke 10', 40],
  ['Neh 7:73b-8:3, 5-18', 5],
  ['Salmo 119:145-176', 32],
  ['Isaiah 55:1-5 or Job 5:8-21', 10],
];
passages.forEach((result, index) => {
  const [citation, minimum] = expected[index];
  const alternatives = result.filter((passage) => !passage.missing);
  const total = alternatives.reduce((sum, passage) => sum + passage.verses.length, 0);
  if (total < minimum) fail(`«${citation}»: esperava ao menos ${minimum} versículos, obtive ${total}`);
  const first = alternatives[0]?.verses[0];
  if (first && first.text.trim().length < 10) fail(`«${citation}»: primeiro versículo vazio`);
  console.log(`  · ${citation} → ${total} versículos`);
});

// ------------------------------------------------- integridade das coletas
console.log('Integridade das coletas e ofícios');
const collectIds = new Set(COLLECTS.map((collect) => collect.id));
const duplicateCollects = COLLECTS.map((collect) => collect.id).filter((id, index, list) => list.indexOf(id) !== index);
for (const id of duplicateCollects) fail(`coleta duplicada: ${id}`);

for (const holyDay of HOLY_DAYS) {
  if (!collectIds.has(holyDay.collectId)) fail(`dia santo sem coleta: ${holyDay.name} → ${holyDay.collectId}`);
}

for (const office of [...DAILY_OFFICES, ...FAMILY_OFFICES]) {
  for (const block of office.blocks) {
    if (block.kind === 'collect' && block.collectId && !collectIds.has(block.collectId)) {
      fail(`${office.id}: coleta inexistente ${block.collectId}`);
    }
    if (block.kind === 'canticle' && !CANTICLES.some((canticle) => canticle.id === block.canticleId)) {
      fail(`${office.id}: cântico inexistente ${block.canticleId}`);
    }
  }
}

let collectDays = 0;
const allDeadline = '2040-12-31';
let collectCursor = '2026-01-01';
while (collectCursor <= allDeadline) {
  const liturgicalDay = getLiturgicalDay(collectCursor);
  collectDays += 1;
  if (liturgicalDay.collectIds.length === 0) fail(`${collectCursor}: dia sem coleta`);
  for (const id of liturgicalDay.collectIds) {
    if (!collectIds.has(id)) fail(`${collectCursor}: coleta do dia inexistente (${id})`);
  }
  const next = new Date(`${collectCursor}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  collectCursor = next.toISOString().slice(0, 10);
}
console.log(`  · ${COLLECTS.length} coletas · ${HOLY_DAYS.length} dias santos · ${collectDays} dias com coleta`);

console.log('\nResumo');
console.log(`  · dias verificados: ${stats.days}`);
console.log(`  · domingos: ${stats.sundays}`);
console.log(`  · citações verificadas: ${stats.citationTotal}`);
console.log(`  · ofícios ausentes: ${stats.missingOffice}`);
console.log(`  · ofícios sem salmos: ${stats.missingPsalms}`);
console.log(`  · domingos sem Próprio: ${stats.missingProper}`);
console.log(`  · citações não interpretadas: ${stats.citationUnparsed}`);
console.log(`  · citações de livros ausentes: ${stats.citationMissingBook}`);

if (unparsed.size > 0) {
  console.error('\nCitações não interpretadas:');
  for (const item of [...unparsed].slice(0, 20)) console.error(`  · ${item}`);
}
if (missingBooks.size > 0) {
  console.log(`\nLivros ausentes na edição local (esperado para deuterocanônicos): ${[...missingBooks].join(', ')}`);
}

rmSync(dir, { recursive: true, force: true });

if (failures > 0) {
  console.error(`\n${failures} verificação(ões) falharam.`);
  process.exit(1);
}
console.log('\n✓ Lecionário verificado.');
