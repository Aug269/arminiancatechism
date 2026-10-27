#!/usr/bin/env node
/**
 * Verificação do calculador litúrgico.
 *
 *  1. Compara as datas da Páscoa (2026–2075) com a tabela oficial.
 *  2. Confere as datas móveis derivadas (Cinzas, Ramos, Ascensão, Pentecostes,
 *     Trindade, Cristo Rei, Advento).
 *  3. Verifica invariantes do calendário: continuidade dos tempos litúrgicos,
 *     um único Próprio por semana e letras do ano litúrgico.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'verify-calendar-'));
const bundle = join(dir, 'calendar.mjs');
execFileSync(
  'npx',
  ['esbuild', 'src/services/liturgicalCalendar.ts', '--bundle', '--format=esm', `--outfile=${bundle}`],
  { stdio: 'inherit' },
);

const mod = await import(bundle);
const { easterSunday, getMovableFeasts, getLiturgicalDay, firstSundayOfAdvent, getMovableTable, properNumberFor } = mod;

let failures = 0;
const check = (label, actual, expected) => {
  if (actual !== expected) {
    failures += 1;
    console.error(`  ✗ ${label}: esperado ${expected}, obtido ${actual}`);
  }
};

// ---------------------------------------------------------------- Páscoa
const EASTER = {
  2026: '2026-04-05',
  2027: '2027-03-28',
  2028: '2028-04-16',
  2029: '2029-04-01',
  2030: '2030-04-21',
  2031: '2031-04-13',
  2032: '2032-03-28',
  2033: '2033-04-17',
  2034: '2034-04-09',
  2035: '2035-03-25',
  2036: '2036-04-13',
  2037: '2037-04-05',
  2038: '2038-04-25',
  2039: '2039-04-10',
  2040: '2040-04-01',
  2041: '2041-04-21',
  2042: '2042-04-06',
  2043: '2043-03-29',
  2044: '2044-04-17',
  2045: '2045-04-09',
  2046: '2046-03-25',
  2047: '2047-04-14',
  2048: '2048-04-05',
  2049: '2049-04-18',
  2050: '2050-04-10',
  2051: '2051-04-02',
  2052: '2052-04-21',
  2053: '2053-04-06',
  2054: '2054-03-29',
  2055: '2055-04-18',
  2056: '2056-04-02',
  2057: '2057-04-22',
  2058: '2058-04-14',
  2059: '2059-03-30',
  2060: '2060-04-18',
  2061: '2061-04-10',
  2062: '2062-03-26',
  2063: '2063-04-15',
  2064: '2064-04-06',
  2065: '2065-03-29',
  2066: '2066-04-11',
  2067: '2067-04-03',
  2068: '2068-04-22',
  2069: '2069-04-14',
  2070: '2070-03-30',
  2071: '2071-04-19',
  2072: '2072-04-10',
  2073: '2073-03-26',
  2074: '2074-04-15',
  2075: '2075-04-07',
};

console.log('Páscoa (2026–2075)');
let easterChecked = 0;
for (let year = 2026; year <= 2075; year += 1) {
  const expected = EASTER[year];
  if (!expected) continue;
  easterChecked += 1;
  check(`Páscoa ${year}`, easterSunday(year), expected);
}
if (easterChecked !== 50) {
  failures += 1;
  console.error(`  ✗ esperava verificar 50 anos, verifiquei ${easterChecked}`);
}

// ------------------------------------------------------------ datas móveis
console.log('Datas móveis');
const feast2026 = getMovableFeasts(2026);
check('Cinzas 2026', feast2026.ashWednesday, '2026-02-18');
check('Ramos 2026', feast2026.palmSunday, '2026-03-29');
check('Quinta-Feira Santa 2026', feast2026.maundyThursday, '2026-04-02');
check('Sexta-Feira Santa 2026', feast2026.goodFriday, '2026-04-03');
check('Ascensão 2026', feast2026.ascension, '2026-05-14');
check('Pentecostes 2026', feast2026.pentecost, '2026-05-24');
check('Trindade 2026', feast2026.trinity, '2026-05-31');
check('Cristo Rei 2026', feast2026.christTheKing, '2026-11-22');
check('Advento 2026', firstSundayOfAdvent(2026), '2026-11-29');
check('Advento 2027', firstSundayOfAdvent(2027), '2027-11-28');

// ------------------------------------------------------- propriedades do dia
console.log('Calendário — casos conhecidos');
const cases = [
  ['2026-10-27', { season: 'afterPentecost', proper: 25, yearLetter: 'A', sundayTitle: '22º Domingo após Pentecostes' }],
  ['2026-11-22', { season: 'afterPentecost', proper: 29, yearLetter: 'A' }],
  ['2026-11-29', { season: 'advent', proper: null, yearLetter: 'B' }],
  ['2026-12-25', { season: 'christmas', yearLetter: 'B' }],
  ['2027-01-06', { season: 'epiphany', yearLetter: 'B' }],
  ['2027-02-10', { season: 'lent', yearLetter: 'B' }],
  ['2027-03-14', { season: 'lent', yearLetter: 'B' }],
  ['2027-03-21', { season: 'holyWeek', yearLetter: 'B' }],
  ['2026-04-05', { season: 'easter', yearLetter: 'A' }],
  ['2026-05-24', { season: 'afterPentecost', yearLetter: 'A' }],
  ['2026-05-31', { season: 'afterPentecost', yearLetter: 'A' }],
];

for (const [date, expected] of cases) {
  const day = getLiturgicalDay(date);
  for (const [key, value] of Object.entries(expected)) {
    check(`${date} · ${key}`, day[key], value);
  }
}

check('2026-10-27 ciclo do ofício', getLiturgicalDay('2026-10-27').officeCycle, 1);
check('2027-03-21 cor (Ramos)', getLiturgicalDay('2027-03-21').color, 'vermelho');
check('2026-11-01 coleta (Todos os Santos)', getLiturgicalDay('2026-11-01').collectIds[0], 'todos-os-santos');
check('2026-12-25 título', getLiturgicalDay('2026-12-25').dayTitle, 'Natividade de Nosso Senhor');
check('2026-12-25 cor', getLiturgicalDay('2026-12-25').color, 'branco');
check('2027-10-27 ciclo do ofício', getLiturgicalDay('2027-10-27').officeCycle, 2);
check('2026-10-27 coleta', getLiturgicalDay('2026-10-27').collectIds[0], 'proprio-25');

// ------------------------------------------------------------ continuidade
console.log('Continuidade 2026–2075');
let previous = null;
let cursor = '2026-01-01';
let days = 0;
const seasonOrder = [
  'christmas',
  'epiphany',
  'lent',
  'holyWeek',
  'easter',
  'afterPentecost',
  'advent',
];
while (cursor <= '2075-12-31') {
  const day = getLiturgicalDay(cursor);
  days += 1;
  if (!day.season || !day.seasonLabel) {
    failures += 1;
    console.error(`  ✗ ${cursor} sem tempo litúrgico`);
  }
  if (day.season === 'afterPentecost' && day.proper !== null) {
    if (
      previous &&
      previous.season === 'afterPentecost' &&
      previous.proper !== null &&
      previous.proper !== 0 &&
      day.proper !== previous.proper
    ) {
      const expectedJump = previous.proper >= 29 || day.proper === previous.proper + 1;
      if (!expectedJump && !(previous.proper === 0 && day.proper > 0)) {
        failures += 1;
        console.error(`  ✗ ${cursor}: Próprio saltou de ${previous.proper} para ${day.proper}`);
      }
    }
  }
  if (day.proper !== null && (day.proper < 1 || day.proper > 29)) {
    failures += 1;
    console.error(`  ✗ ${cursor}: Próprio fora do intervalo (${day.proper})`);
  }
  previous = day;
  const next = new Date(`${cursor}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  cursor = next.toISOString().slice(0, 10);
}
console.log(`  · ${days} dias verificados`);

// Próprios do Tempo Comum: 2026 como caso de teste de sequência.
console.log('Sequência de Próprios em 2026');
const seen = new Set();
for (let d = new Date('2026-05-31T12:00:00Z'); d <= new Date('2026-11-28T12:00:00Z'); d.setUTCDate(d.getUTCDate() + 1)) {
  const isoDay = d.toISOString().slice(0, 10);
  const day = getLiturgicalDay(isoDay);
  if (day.proper) seen.add(day.proper);
}
const expected2026 = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
for (const n of expected2026) {
  if (!seen.has(n)) {
    failures += 1;
    console.error(`  ✗ Próprio ${n} não apareceu em 2026`);
  }
}
check('Próprio de 2026-06-07', properNumberFor('2026-06-07'), 5);

// ---------------------------------------------------------------- tábua móvel
const table = getMovableTable(2026, 2075);
check('linhas da tábua móvel', table.length, 50);
check('última linha da tábua', table[table.length - 1].year, 2075);

rmSync(dir, { recursive: true, force: true });

if (failures > 0) {
  console.error(`\n${failures} verificação(ões) falharam.`);
  process.exit(1);
}
console.log('\n✓ Calculador litúrgico verificado.');
