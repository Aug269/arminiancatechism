import { useState } from 'react';
import { WEEKLY_OFFICES } from '../data/offices/weekly';
import { WEEKDAY_NAMES } from '../services/dateUtils';
import type { LiturgicalDay } from '../services/liturgicalCalendar';
import { ReadingBlock } from './ReadingBlock';
import { SilenceTimer } from './SilenceTimer';

export interface WeeklyViewProps {
  day: LiturgicalDay;
}

/** Ofício para a Semana: sentença, salmo, leitura e oração de cada dia. */
export function WeeklyView({ day }: WeeklyViewProps) {
  const [selected, setSelected] = useState(day.weekday);
  const current = WEEKLY_OFFICES.find((item) => item.weekday === selected) ?? WEEKLY_OFFICES[0];

  return (
    <div className="paper">
      <header className="office-head">
        <p className="office-eyebrow">Ofício para a Semana</p>
        <h1 className="office-title">Orações da Semana</h1>
        <p className="office-subtitle">Sentenças e orações temáticas de domingo a sábado</p>
      </header>

      <div className="mode-switch" role="tablist" aria-label="Dias da semana">
        {WEEKLY_OFFICES.map((item) => (
          <button
            key={item.weekday}
            type="button"
            role="tab"
            aria-selected={item.weekday === selected}
            onClick={() => setSelected(item.weekday)}
          >
            {WEEKDAY_NAMES[item.weekday].replace('-feira', '')}
          </button>
        ))}
      </div>

      <section className="weekly-card">
        <span className="day">{WEEKDAY_NAMES[current.weekday]}</span>
        <h3>{current.theme}</h3>
        <p className="sentence">{current.sentence}</p>
        <p className="verse-line">{current.psalmVerse}</p>
      </section>

      <h2 className="block-heading">Leitura</h2>
      <ReadingBlock citation={current.reading} kicker="Leitura do dia" />

      <h2 className="block-heading">Oração</h2>
      <p className="paragraph dropcap">{current.prayer}</p>

      <SilenceTimer seconds={90} label="Silêncio para guardar a palavra do dia" />

      <div className="rule">
        <span>Deus nos abençoe e nos guarde</span>
      </div>
      <p className="response">Amém.</p>
    </div>
  );
}
