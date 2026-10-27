import { useEffect, useState } from 'react';

export type HourOfficeId = 'matutino' | 'meiodia' | 'vespertino' | 'completas';

export interface HourOffice {
  id: HourOfficeId;
  label: string;
  subtitle: string;
  /** Faixa horária em que o ofício é próprio. */
  range: string;
  from: number;
  to: number;
}

export const HOUR_OFFICES: HourOffice[] = [
  { id: 'matutino', label: 'Matutino', subtitle: 'Oração da Manhã', range: '5h – 11h', from: 5, to: 11 },
  { id: 'meiodia', label: 'Meio-Dia', subtitle: 'Oração das Doze Horas', range: '11h – 15h', from: 11, to: 15 },
  { id: 'vespertino', label: 'Vespertino', subtitle: 'Oração da Tarde', range: '15h – 21h', from: 15, to: 21 },
  { id: 'completas', label: 'Completas', subtitle: 'Fim do Dia', range: '21h – 5h', from: 21, to: 5 },
];

/** Ofício correspondente a uma hora do dia. */
export function officeForHour(hour: number): HourOfficeId {
  if (hour >= 5 && hour < 11) return 'matutino';
  if (hour >= 11 && hour < 15) return 'meiodia';
  if (hour >= 15 && hour < 21) return 'vespertino';
  return 'completas';
}

/** Hora atual, atualizada a cada minuto. */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);

  return now;
}

export function useCurrentOffice(): HourOfficeId {
  const now = useNow();
  const [office, setOffice] = useState<HourOfficeId>(() => officeForHour(new Date().getHours()));

  useEffect(() => {
    setOffice(officeForHour(now.getHours()));
  }, [now]);

  return office;
}
