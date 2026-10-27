import { renderToStaticMarkup } from 'react-dom/server';
import App from '../../src/App';
import { CalendarView } from '../../src/components/CalendarView';
import { LibraryView } from '../../src/components/LibraryView';
import { WeeklyView } from '../../src/components/WeeklyView';
import { FamilyView } from '../../src/components/FamilyView';
import { getLiturgicalDay } from '../../src/services/liturgicalCalendar';
import { getDailyOfficeReadings } from '../../src/services/lectionary';

const checks: Array<[string, () => string, string[]]> = [];

const day = getLiturgicalDay('2026-10-27');
const readings = getDailyOfficeReadings(day);

checks.push(['App', () => renderToStaticMarkup(<App />), [
  'Ofício Vespertino',
  'Ofício Diário &amp; Lecionário',
  'Rede Episcopal Brasileira',
  'Tempo Comum',
  'Ano A',
]]);

checks.push(['Calendário', () => renderToStaticMarkup(
  <CalendarView selected="2026-10-27" today="2026-10-27" onSelect={() => {}} onGoToOffice={() => {}} />,
), ['Calendário Litúrgico', 'outubro de 2026', 'Tábua móvel']]);

checks.push(['Biblioteca', () => renderToStaticMarkup(<LibraryView onClose={() => {}} />), [
  'Biblioteca Litúrgica',
  'Coletas',
  'Cânticos',
]]);

checks.push(['Semana', () => renderToStaticMarkup(<WeeklyView day={day} />), [
  'Orações da Semana',
  'Sentenças e orações temáticas',
]]);

checks.push(['Famílias', () => renderToStaticMarkup(
  <FamilyView day={day} readings={readings} sentence="Sentença" onToggleTheme={() => {}} theme="day" />,
), ['Pela Manhã', 'Orações às Refeições']]);

let failures = 0;
for (const [label, render, expected] of checks) {
  try {
    const html = render();
    for (const needle of expected) {
      if (!html.includes(needle)) {
        failures += 1;
        console.error(`  ✗ ${label}: não encontrou «${needle}»`);
      }
    }
    console.log(`  · ${label}: ${(html.length / 1024).toFixed(1)} kB de HTML`);
  } catch (error) {
    failures += 1;
    console.error(`  ✗ ${label}: ${(error as Error).message}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} verificação(ões) falharam.`);
  process.exit(1);
}
console.log('\n✓ Renderização verificada.');
