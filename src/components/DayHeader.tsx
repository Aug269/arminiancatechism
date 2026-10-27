import { formatLongDate, type IsoDate } from '../services/dateUtils';
import { seasonHeadline, type LiturgicalDay } from '../services/liturgicalCalendar';
import { Icon } from './Icon';

const COLOR_HEX: Record<string, string> = {
  roxo: '#6b21a8',
  branco: '#efe4d3',
  vermelho: '#b91c1c',
  verde: '#15803d',
  rosa: '#db2777',
};

const RANK_LABEL: Record<string, string> = {
  festa: 'Festa',
  memoria: 'Memória',
  comemoracao: 'Comemoração',
};

export interface DayHeaderProps {
  day: LiturgicalDay;
  today: IsoDate;
  onShift: (days: number) => void;
  onPickDate: (date: IsoDate) => void;
  onToday: () => void;
}

/** Data litúrgica: dia, tempo, cor, ano e ciclo do Ofício. */
export function DayHeader({ day, today, onShift, onPickDate, onToday }: DayHeaderProps) {
  const feast = day.feasts[0];
  const headline = day.movableFeastTitle ?? (feast ? feast.name : seasonHeadline(day));

  return (
    <div className="dateline">
      <span className="dateline-date">{formatLongDate(day.date)}</span>
      <span className="chip">
        <span className="swatch" style={{ background: COLOR_HEX[day.color] ?? '#a2620d' }} />
        {seasonHeadline(day)}
      </span>
      <span className="chip chip-gold">Ano {day.yearLetter}</span>
      <span className="chip">Ofício · Ano {day.officeCycle}</span>
      {feast && (
        <span className="chip" title={feast.name}>
          {RANK_LABEL[feast.rank] ?? 'Festa'} · {feast.shortName}
        </span>
      )}
      {!feast && headline && headline !== seasonHeadline(day) && (
        <span className="chip">{headline}</span>
      )}

      <span className="daynav">
        <button type="button" onClick={() => onShift(-1)} aria-label="Dia anterior">
          <Icon name="chevron-left" size={14} />
        </button>
        <input
          type="date"
          value={day.date}
          onChange={(event) => event.target.value && onPickDate(event.target.value)}
          aria-label="Escolher data"
        />
        <button type="button" onClick={() => onShift(1)} aria-label="Próximo dia">
          <Icon name="chevron-right" size={14} />
        </button>
        <button type="button" onClick={onToday} disabled={day.date === today}>
          Hoje
        </button>
      </span>
    </div>
  );
}
