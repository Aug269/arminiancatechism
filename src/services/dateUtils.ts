/**
 * Utilidades de data usadas pelo cálculo litúrgico.
 *
 * Todas as datas são representadas como strings ISO curtas (`aaaa-mm-dd`) e
 * manipuladas em UTC, para que o cálculo não dependa do fuso horário nem do
 * horário de verão do dispositivo.
 */

export type IsoDate = string;

const MS_PER_DAY = 86_400_000;

export function iso(year: number, month: number, day: number): IsoDate {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toISOString().slice(0, 10);
}

export function todayIso(now: Date = new Date()): IsoDate {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return iso(year, month, day);
}

export function parseIso(value: IsoDate): { year: number; month: number; day: number } {
  const [year, month, day] = value.split('-').map(Number);
  return { year, month, day };
}

function toUtc(value: IsoDate): Date {
  const { year, month, day } = parseIso(value);
  return new Date(Date.UTC(year, month - 1, day));
}

function fromUtc(date: Date): IsoDate {
  return date.toISOString().slice(0, 10);
}

export function addDays(value: IsoDate, amount: number): IsoDate {
  const date = toUtc(value);
  date.setUTCDate(date.getUTCDate() + amount);
  return fromUtc(date);
}

export function diffDays(from: IsoDate, to: IsoDate): number {
  return Math.round((toUtc(to).getTime() - toUtc(from).getTime()) / MS_PER_DAY);
}

/** 0 = domingo … 6 = sábado. */
export function weekdayOf(value: IsoDate): number {
  return toUtc(value).getUTCDay();
}

/** Domingo da semana que contém a data (semanas litúrgicas vão de domingo a sábado). */
export function sundayOf(value: IsoDate): IsoDate {
  return addDays(value, -weekdayOf(value));
}

/** Próximo domingo (ou a própria data, se já for domingo). */
export function sundayOnOrAfter(value: IsoDate): IsoDate {
  return addDays(value, (7 - weekdayOf(value)) % 7);
}

export function sameIso(a: IsoDate, b: IsoDate): boolean {
  return a === b;
}

export function isBetween(value: IsoDate, start: IsoDate, end: IsoDate): boolean {
  return value >= start && value <= end;
}

export function isValidIso(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(toUtc(value).getTime());
}

export function monthLength(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export const MONTH_NAMES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

export const WEEKDAY_NAMES = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];

export const WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function formatLongDate(value: IsoDate): string {
  const { year, month, day } = parseIso(value);
  const weekday = WEEKDAY_NAMES[weekdayOf(value)];
  const name = MONTH_NAMES[month - 1];
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${day} de ${name} de ${year}`;
}

export function formatShortDate(value: IsoDate): string {
  const { month, day } = parseIso(value);
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
}

/** Nome do dia da semana em inglês — usado como chave no lecionário do Ofício. */
export const WEEKDAY_KEYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const WEEKDAY_ABBREV = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
