import { useState } from 'react';
import { FAMILY_OFFICES } from '../data/offices/family';
import { ADDITIONAL_PRAYERS, MEAL_PRAYERS } from '../data/offices/prayers';
import type { DailyReadings } from '../services/lectionary';
import type { LiturgicalDay } from '../services/liturgicalCalendar';
import { OfficeViewer } from './OfficeViewer';
import { Icon } from './Icon';

export interface FamilyViewProps {
  day: LiturgicalDay;
  readings: DailyReadings | null;
  sentence: string;
  onToggleTheme: () => void;
  theme: 'day' | 'night';
}

/** Ofício para Famílias e Indivíduos + Credo, orações adicionais e refeições. */
export function FamilyView({ day, readings, sentence, onToggleTheme, theme }: FamilyViewProps) {
  const [selectedId, setSelectedId] = useState(FAMILY_OFFICES[0].id);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const office = FAMILY_OFFICES.find((item) => item.id === selectedId) ?? FAMILY_OFFICES[0];

  return (
    <div className="layout">
      <div>
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2 className="card-title">Ofício para Famílias e Indivíduos</h2>
          <div className="mode-switch" style={{ marginBottom: 0, paddingTop: '0.2rem' }}>
            {FAMILY_OFFICES.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === office.id}
                onClick={() => setSelectedId(item.id)}
              >
                {item.title.replace('Ao Anoitecer — ', 'Anoitecer ')}
              </button>
            ))}
          </div>
        </div>

        <OfficeViewer
          office={office}
          day={day}
          readings={readings}
          sentence={sentence}
          track={1}
          onTrackChange={() => undefined}
          onToggleTheme={onToggleTheme}
          theme={theme}
        />

        <div className="card" style={{ marginTop: '1rem' }}>
          <h2 className="card-title">Orações às Refeições</h2>
          <div className="library-grid two">
            {(
              [
                ['Manhã', MEAL_PRAYERS.morning],
                ['Meio-dia', MEAL_PRAYERS.midday],
                ['Noite', MEAL_PRAYERS.evening],
                ['Fim do dia', MEAL_PRAYERS.night],
              ] as const
            ).map(([title, prayer]) => (
              <div key={title}>
                <h3 style={{ fontFamily: 'var(--serif-display)', fontVariant: 'small-caps', color: 'var(--bordo)', margin: '0 0 0.3rem' }}>
                  {title}
                </h3>
                <p className="reading-note">Antes</p>
                <p className="verse-line">{prayer.before.join(' ')}</p>
                <p className="reading-note">Depois</p>
                <p className="verse-line">{prayer.after.join(' ')}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: '1rem' }}>
          <button
            type="button"
            className="ghost-button"
            onClick={() => setExtrasOpen((value) => !value)}
            aria-expanded={extrasOpen}
          >
            <Icon name="book" size={12} />
            {extrasOpen ? 'Recolher orações adicionais' : 'Abrir orações adicionais'}
          </button>
          {extrasOpen && (
            <div className="library-grid two" style={{ marginTop: '0.8rem' }}>
              {ADDITIONAL_PRAYERS.map((prayer) => (
                <div key={prayer.id}>
                  <h3 style={{ fontFamily: 'var(--serif-display)', fontVariant: 'small-caps', color: 'var(--bordo)', margin: '0 0 0.25rem', fontSize: '1rem' }}>
                    {prayer.title}
                  </h3>
                  <p className="verse-line">{prayer.text.join(' ')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <aside className="aside" aria-label="Sobre este ofício">
        <section className="card">
          <h2 className="card-title">Como usar</h2>
          <p>
            As devoções familiares são breves: podem ser rezadas em casa, à mesa ou no
            trabalho. Basta escolher o momento do dia correspondente.
          </p>
          <p>
            Se houver mais de uma pessoa, um lê a parte do oficiante (℣) e todos respondem
            em conjunto (℟).
          </p>
        </section>
        <section className="card">
          <h2 className="card-title">Credo dos Apóstolos</h2>
          <p>
            O Credo e o Pai Nosso estão incluídos em todas as devoções. Em família, podem ser
            rezados alternando as vozes.
          </p>
        </section>
      </aside>
    </div>
  );
}
