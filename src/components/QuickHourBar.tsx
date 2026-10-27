import { HOUR_OFFICES, type HourOfficeId } from '../hooks/useHourOffice';

export interface QuickHourBarProps {
  current: HourOfficeId;
  now: HourOfficeId;
  onChange: (office: HourOfficeId) => void;
}

/** Acesso rápido aos quatro ofícios, com destaque para o da hora atual. */
export function QuickHourBar({ current, now, onChange }: QuickHourBarProps) {
  return (
    <nav className="quick-hours" aria-label="Ofícios do dia">
      {HOUR_OFFICES.map((office) => (
        <button
          key={office.id}
          type="button"
          className="hour-button"
          data-now={office.id === now}
          aria-current={office.id === current}
          onClick={() => onChange(office.id)}
          title={`${office.subtitle} · ${office.range}`}
        >
          <span className="hour-dot" aria-hidden="true" />
          <span className="hour-name">{office.label}</span>
          <span className="hour-time">{office.range}</span>
          <span className="sr-only">
            {office.subtitle}
            {office.id === now ? ' — ofício da hora atual' : ''}
          </span>
        </button>
      ))}
    </nav>
  );
}
