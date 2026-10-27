import { useMemo, useState } from 'react';
import { COLOR_LABELS, HOLY_DAYS, type LiturgicalColor } from '../data/holyDays';
import {
  formatShortDate,
  isValidIso,
  iso,
  monthLength,
  MONTH_NAMES,
  parseIso,
  WEEKDAY_SHORT,
  type IsoDate,
} from '../services/dateUtils';
import { getLiturgicalDay, getMovableTable, getMovableFeasts } from '../services/liturgicalCalendar';
import { CollectBlock } from './CollectBlock';
import { getCollect } from '../data/collects';
import { Icon } from './Icon';

const COLOR_HEX: Record<LiturgicalColor, string> = {
  roxo: '#6b21a8',
  branco: '#efe4d3',
  vermelho: '#b91c1c',
  verde: '#15803d',
  rosa: '#db2777',
};

export interface CalendarViewProps {
  selected: IsoDate;
  today: IsoDate;
  onSelect: (date: IsoDate) => void;
  onGoToOffice: () => void;
}

type Tab = 'mes' | 'tabua' | 'festas';

/** Calendário Litúrgico: mês, tábua móvel 2026–2075 e dias santos. */
export function CalendarView({ selected, today, onSelect, onGoToOffice }: CalendarViewProps) {
  const initial = parseIso(selected);
  const [tab, setTab] = useState<Tab>('mes');
  const [month, setMonth] = useState(initial.month);
  const [year, setYear] = useState(initial.year);

  const firstWeekday = useMemo(() => new Date(Date.UTC(year, month - 1, 1)).getUTCDay(), [month, year]);
  const daysInMonth = useMemo(() => monthLength(year, month), [month, year]);

  const cells = useMemo(() => {
    const items: Array<{ date: IsoDate | null; day: ReturnType<typeof getLiturgicalDay> | null }> = [];
    for (let i = 0; i < firstWeekday; i += 1) items.push({ date: null, day: null });
    for (let d = 1; d <= daysInMonth; d += 1) {
      const date = iso(year, month, d);
      items.push({ date, day: getLiturgicalDay(date) });
    }
    return items;
  }, [daysInMonth, firstWeekday, month, year]);

  const day = useMemo(() => getLiturgicalDay(selected), [selected]);
  const collect = getCollect(day.collectIds[0] ?? '');
  const table = useMemo(() => getMovableTable(2026, 2075), []);

  const shiftMonth = (delta: number) => {
    const next = new Date(Date.UTC(year, month - 1 + delta, 1));
    setYear(next.getUTCFullYear());
    setMonth(next.getUTCMonth() + 1);
  };

  const feast = getMovableFeasts(day.churchYearStart + 1);

  return (
    <div className="paper">
      <header className="office-head">
        <p className="office-eyebrow">Calculador Litúrgico Perpétuo</p>
        <h1 className="office-title">Calendário Litúrgico</h1>
        <p className="office-subtitle">Tempo, cor, próprio e festas — de 2026 a 2075</p>
      </header>

      <div className="mode-switch" role="tablist" aria-label="Visões do calendário">
        <button type="button" role="tab" aria-selected={tab === 'mes'} onClick={() => setTab('mes')}>
          Mês
        </button>
        <button type="button" role="tab" aria-selected={tab === 'tabua'} onClick={() => setTab('tabua')}>
          Tábua móvel
        </button>
        <button type="button" role="tab" aria-selected={tab === 'festas'} onClick={() => setTab('festas')}>
          Dias santos
        </button>
      </div>

      {tab === 'mes' && (
        <div className="calendar">
          <div className="calendar-head">
            <button type="button" className="icon-button" onClick={() => shiftMonth(-1)} aria-label="Mês anterior">
              <Icon name="chevron-left" />
            </button>
            <h2>
              {MONTH_NAMES[month - 1]} de {year}
            </h2>
            <button type="button" className="icon-button" onClick={() => shiftMonth(1)} aria-label="Próximo mês">
              <Icon name="chevron-right" />
            </button>
            <span className="chip chip-gold">Ano {day.yearLetter}</span>
          </div>

          <div className="calendar-grid" role="grid" aria-label={`${MONTH_NAMES[month - 1]} de ${year}`}>
            {WEEKDAY_SHORT.map((label) => (
              <div className="dow" key={label} role="columnheader">
                {label}
              </div>
            ))}
            {cells.map((cell, index) =>
              cell.date && cell.day ? (
                <button
                  type="button"
                  key={cell.date}
                  className="calendar-cell"
                  role="gridcell"
                  data-today={cell.date === today}
                  data-selected={cell.date === selected}
                  data-feast={cell.day.isFeastDay}
                  onClick={() => onSelect(cell.date as IsoDate)}
                  title={`${cell.day.dayTitle} · ${cell.day.seasonLabel}`}
                >
                  <span className="num">{parseIso(cell.date).day}</span>
                  <span
                    className="dot"
                    style={{ background: COLOR_HEX[cell.day.color] }}
                    aria-hidden="true"
                  />
                  <span className="sr-only">
                    {cell.day.seasonLabel}. {cell.day.isFeastDay ? 'Festa.' : ''}
                  </span>
                </button>
              ) : (
                <div className="calendar-cell is-empty" key={`empty-${index}`} aria-hidden="true" />
              ),
            )}
          </div>

          <div className="legend" aria-label="Legenda das cores">
            {(Object.keys(COLOR_HEX) as LiturgicalColor[]).map((color) => (
              <span key={color}>
                <span className="swatch" style={{ background: COLOR_HEX[color] }} />
                {COLOR_LABELS[color]}
              </span>
            ))}
          </div>

          <section className="card" style={{ marginTop: '0.6rem' }}>
            <h2 className="card-title">Dia selecionado · {formatShortDate(selected)}</h2>
            <h3>{day.isSunday ? day.sundayTitle : day.dayTitle}</h3>
            <div className="meta-row">
              <span>Tempo</span>
              <strong>{day.seasonLabel}</strong>
            </div>
            <div className="meta-row">
              <span>Cor</span>
              <strong>{COLOR_LABELS[day.color]}</strong>
            </div>
            <div className="meta-row">
              <span>Ano litúrgico</span>
              <strong>
                Ano {day.yearLetter} · Ofício Ano {day.officeCycle}
              </strong>
            </div>
            <div className="meta-row">
              <span>Páscoa do ciclo</span>
              <strong>{formatShortDate(feast.easter)}</strong>
            </div>
            <div className="meta-row">
              <span>Primeiro Advento</span>
              <strong>{formatShortDate(feast.advent1)}</strong>
            </div>
            {day.feasts.map((item) => (
              <div className="meta-row" key={item.name}>
                <span>{item.rank === 'festa' ? 'Festa' : item.rank === 'memoria' ? 'Memória' : 'Comemoração'}</span>
                <strong>{item.name}</strong>
              </div>
            ))}
            <div style={{ marginTop: '0.6rem' }}>
              <button type="button" className="ghost-button" onClick={onGoToOffice}>
                Rezar o Ofício deste dia
              </button>
            </div>
          </section>

          {collect && <CollectBlock collect={collect} title="Coleta do dia" />}
        </div>
      )}

      {tab === 'tabua' && (
        <div>
          <p className="reading-note">
            Datas móveis calculadas para cada ano. A Páscoa determina a Quaresma, a Semana
            Santa, o Tempo Pascal e o Próprio do Tempo Comum.
          </p>
          <div className="table-wrap">
            <table className="movable">
              <caption>Tábua móvel 2026 – 2075</caption>
              <thead>
                <tr>
                  <th>Ano</th>
                  <th>Páscoa</th>
                  <th>Cinzas</th>
                  <th>Ramos</th>
                  <th>Ascensão</th>
                  <th>Pentecostes</th>
                  <th>Cristo Rei</th>
                  <th>Advento</th>
                  <th>Ciclo</th>
                </tr>
              </thead>
              <tbody>
                {table.map((row) => (
                  <tr key={row.year} onClick={() => onSelect(iso(row.year, 4, 5))}>
                    <td className="year">{row.year}</td>
                    <td>{formatShortDate(row.easter)}</td>
                    <td>{formatShortDate(row.ashWednesday)}</td>
                    <td>{formatShortDate(row.palmSunday)}</td>
                    <td>{formatShortDate(row.ascension)}</td>
                    <td>{formatShortDate(row.pentecost)}</td>
                    <td>{formatShortDate(row.christTheKing)}</td>
                    <td>{formatShortDate(row.advent1)}</td>
                    <td>Ano {row.yearLetter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'festas' && (
        <div>
          <p className="reading-note">
            Dias santos e festas de data fixa. Quando caem em domingo, a celebração pode ser
            transferida.
          </p>
          <ul className="index-list">
            {[...HOLY_DAYS]
              .sort((a, b) => a.month - b.month || a.day - b.day)
              .map((item) => (
                <li key={`${item.month}-${item.day}-${item.name}`}>
                  <button
                    type="button"
                    className="index-button"
                    onClick={() => {
                      const date = iso(year, item.month, item.day);
                      if (isValidIso(date)) {
                        setMonth(item.month);
                        onSelect(date);
                        setTab('mes');
                      }
                    }}
                  >
                    <span className="title">
                      {String(item.day).padStart(2, '0')}/{String(item.month).padStart(2, '0')} ·{' '}
                      {item.name}
                    </span>
                    <span className="ref">
                      {item.rank === 'festa' ? 'Festa' : item.rank === 'memoria' ? 'Memória' : 'Comemoração'} ·{' '}
                      {COLOR_LABELS[item.color]}
                      {item.note ? ` · ${item.note}` : ''}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
