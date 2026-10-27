import { getCollect } from '../data/collects';
import { COLOR_LABELS } from '../data/holyDays';
import { getDailyOfficeReadings } from '../services/lectionary';
import { getMovableFeasts, type LiturgicalDay } from '../services/liturgicalCalendar';
import { formatShortDate, WEEKDAY_NAMES } from '../services/dateUtils';
import { CollectBlock } from './CollectBlock';

export interface LiturgicalAsideProps {
  day: LiturgicalDay;
  onOpenCalendar: () => void;
}

/** Coluna lateral: resumo do dia, leituras e próximas festas. */
export function LiturgicalAside({ day, onOpenCalendar }: LiturgicalAsideProps) {
  const collect = getCollect(day.collectIds[0] ?? '');
  const readings = getDailyOfficeReadings(day);
  const lessons = readings
    ? readings.lessons.morning ?? readings.lessons.evening ?? readings.lessons.flat ?? {}
    : undefined;
  const feast = getMovableFeasts(day.churchYearStart + 1);

  const upcoming: Array<{ label: string; date: string }> = [
    { label: 'Quarta-Feira de Cinzas', date: feast.ashWednesday },
    { label: 'Domingo de Páscoa', date: feast.easter },
    { label: 'Ascensão do Senhor', date: feast.ascension },
    { label: 'Pentecostes', date: feast.pentecost },
    { label: 'Cristo Rei', date: feast.christTheKing },
  ]
    .filter((item) => item.date >= day.date)
    .slice(0, 4);

  return (
    <aside className="aside" aria-label="Resumo litúrgico">
      <section className="card">
        <h2 className="card-title">O dia</h2>
        <h3>{day.isSunday ? day.sundayTitle : day.dayTitle}</h3>
        <div className="meta-row">
          <span>Tempo litúrgico</span>
          <strong>{day.seasonLabel}</strong>
        </div>
        <div className="meta-row">
          <span>Cor</span>
          <strong>{COLOR_LABELS[day.color]}</strong>
        </div>
        <div className="meta-row">
          <span>Ano litúrgico</span>
          <strong>Ano {day.yearLetter}</strong>
        </div>
        <div className="meta-row">
          <span>Ofício Diário</span>
          <strong>Ano {day.officeCycle}</strong>
        </div>
        {day.proper && (
          <div className="meta-row">
            <span>Próprio</span>
            <strong>{day.proper}</strong>
          </div>
        )}
        <div className="meta-row">
          <span>Advento</span>
          <strong>{formatShortDate(feast.advent1)}</strong>
        </div>
      </section>

      {collect && (
        <section className="card">
          <h2 className="card-title">Coleta do dia</h2>
          <CollectBlock collect={collect} />
        </section>
      )}

      {readings && (
        <section className="card">
          <h2 className="card-title">Leituras do Ofício</h2>
          {readings.psalms.morning.length > 0 && (
            <div className="meta-row">
              <span>Salmos · manhã</span>
              <strong>{readings.psalms.morning.join(', ')}</strong>
            </div>
          )}
          {readings.psalms.evening.length > 0 && (
            <div className="meta-row">
              <span>Salmos · tarde</span>
              <strong>{readings.psalms.evening.join(', ')}</strong>
            </div>
          )}
          {lessons?.first && (
            <div className="meta-row">
              <span>1ª leitura</span>
              <strong>{lessons.first}</strong>
            </div>
          )}
          {lessons?.second && (
            <div className="meta-row">
              <span>2ª leitura</span>
              <strong>{lessons.second}</strong>
            </div>
          )}
          {lessons?.gospel && (
            <div className="meta-row">
              <span>Evangelho</span>
              <strong>{lessons.gospel}</strong>
            </div>
          )}
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="card">
          <h2 className="card-title">Datas móveis</h2>
          <ul className="card-list">
            {upcoming.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <span className="meta">{formatShortDate(item.date)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card">
        <h2 className="card-title">Calendário</h2>
        <p>
          Consulte a tábua móvel de 2026 a 2075, as festas de data fixa e a cor de cada
          celebração.
        </p>
        <button type="button" className="ghost-button" onClick={onOpenCalendar}>
          Abrir calendário litúrgico
        </button>
      </section>

      <section className="card">
        <h2 className="card-title">Semana</h2>
        <ul className="card-list">
          <li>
            <span className="meta">Domingo</span>
            <span>A Ressurreição</span>
          </li>
          <li>
            <span className="meta">{WEEKDAY_NAMES[3]}</span>
            <span>O Arrependimento</span>
          </li>
          <li>
            <span className="meta">{WEEKDAY_NAMES[5]}</span>
            <span>A Cruz</span>
          </li>
        </ul>
      </section>
    </aside>
  );
}
